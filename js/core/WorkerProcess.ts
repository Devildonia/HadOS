/**
 * WORKER PROCESS (host side)
 * Wraps an isolated process runtime behind the IPC protocol. It talks to an
 * `IProcessTransport` rather than a `Worker` directly, so:
 *   - a real Web Worker is one transport (see `workerTransport`),
 *   - tests inject a loopback transport (no Worker needed in jsdom),
 *   - an iframe MessagePort can be a transport later (Fase 2).
 *
 * Responsibilities: track readiness, correlate request/response by id, and
 * expose ping() for the watchdog. Phase 1 — see docs/webos-roadmap.
 */

import { isAppMessage, isSysMessage, type AppMessage, type ProcMessage } from './ipc/protocol';

export interface IProcessTransport {
    postMessage(msg: ProcMessage): void;
    onMessage(handler: (msg: unknown) => void): void;
    onError?: (handler: (err: Error) => void) => void;
    terminate(): void;
}

interface Pending {
    resolve: (value: unknown) => void;
    reject: (err: Error) => void;
    timer: ReturnType<typeof setTimeout>;
}

export class WorkerProcess {
    private _nextAppId = 1;
    private _nextPingId = 1;
    private readonly pendingApp = new Map<number, Pending>();
    private readonly pendingPing = new Map<number, Pending>();
    private readonly requestHandlers = new Map<string, (payload: unknown) => unknown | Promise<unknown>>();
    private _ready = false;
    private _terminated = false;
    private resolveReady!: () => void;
    private rejectReady!: (err: Error) => void;
    private readonly readyPromise: Promise<void>;
    private readyTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private readonly transport: IProcessTransport,
        private readonly readyTimeoutMs = 15_000,
    ) {
        this.readyPromise = new Promise<void>((res, rej) => {
            this.resolveReady = res;
            this.rejectReady = rej;
        });
        // Nobody is required to await `ready`; swallow here so a rejection that has
        // no waiter yet can't escape as an unhandled rejection. Anyone who does
        // await it still sees the error — this handler doesn't consume it.
        this.readyPromise.catch(() => { /* reported to whoever awaits `ready` */ });

        this.transport.onMessage(m => this.handle(m));
        if (this.transport.onError) {
            this.transport.onError(err => this.failReady(err));
        }
    }

    /**
     * Resolves when the process posts `sys:ready`; rejects if it errors, is killed,
     * or never signals at all.
     *
     * The timeout is armed on FIRST ACCESS rather than in the constructor: a guest
     * that throws at its top level never sends `sys:ready`, which used to hang every
     * `await proc.ready` forever — the watchdog killed the PID but the original
     * caller was never told (audit v1.0.0-rc.1, M-11). Arming it lazily keeps
     * processes nobody waits on from leaving a live timer behind.
     */
    get ready(): Promise<void> {
        if (!this._ready && !this._terminated && this.readyTimer === null && this.readyTimeoutMs > 0) {
            this.readyTimer = setTimeout(() => {
                this.readyTimer = null;
                this.failReady(new Error(`process never signalled ready within ${this.readyTimeoutMs}ms`));
            }, this.readyTimeoutMs);
        }
        return this.readyPromise;
    }

    private clearReadyTimer(): void {
        if (this.readyTimer !== null) {
            clearTimeout(this.readyTimer);
            this.readyTimer = null;
        }
    }

    /** Rejects `ready` unless the process already reported in. Idempotent. */
    private failReady(err: Error): void {
        if (this._ready) return;
        this.clearReadyTimer();
        this.rejectReady(err);
    }

    get isReady(): boolean { return this._ready; }
    get isTerminated(): boolean { return this._terminated; }

    private handle(raw: unknown): void {
        if (!raw || typeof raw !== 'object') return;
        const msg = raw as ProcMessage;

        if (isSysMessage(msg)) {
            if (msg.type === 'ready') {
                this._ready = true;
                this.clearReadyTimer();
                this.resolveReady();
            } else if (msg.type === 'pong') {
                this.settlePing(msg.id);
            }
            return;
        }

        if (isAppMessage(msg)) {
            if (msg.type === 'response') {
                // Reply to a request WE sent.
                if (typeof msg.id === 'number') this.settleApp(msg.id, msg.payload, msg.error);
            } else {
                // Inbound request FROM the process (e.g. a syscall). Duplex IPC.
                void this.dispatchRequest(msg);
            }
        }
    }

    private async dispatchRequest(msg: AppMessage): Promise<void> {
        const handler = this.requestHandlers.get(msg.type);
        if (!handler) {
            this.reply(msg.id, undefined, `unhandled request: ${msg.type}`);
            return;
        }
        try {
            this.reply(msg.id, await handler(msg.payload));
        } catch (err) {
            this.reply(msg.id, undefined, err instanceof Error ? err.message : String(err));
        }
    }

    private reply(id: number | undefined, payload?: unknown, error?: string): void {
        const msg: AppMessage = { ch: 'app', type: 'response' };
        if (id !== undefined) msg.id = id;
        if (payload !== undefined) msg.payload = payload;
        if (error !== undefined) msg.error = error;
        this.transport.postMessage(msg);
    }

    /** Registers a handler for inbound requests of `type` from the process
     *  (used by the syscall broker to serve fs/notify/log calls over the channel). */
    onRequest(type: string, handler: (payload: unknown) => unknown | Promise<unknown>): this {
        this.requestHandlers.set(type, handler);
        return this;
    }

    private settleApp(id: number, payload: unknown, error?: string): void {
        const p = this.pendingApp.get(id);
        if (!p) return;
        clearTimeout(p.timer);
        this.pendingApp.delete(id);
        if (error) p.reject(new Error(error));
        else p.resolve(payload);
    }

    private settlePing(id: number): void {
        const p = this.pendingPing.get(id);
        if (!p) return;
        clearTimeout(p.timer);
        this.pendingPing.delete(id);
        p.resolve(true);
    }

    /** Sends an app request and resolves with its response payload. */
    request(type: string, payload?: unknown, timeoutMs = 10_000): Promise<unknown> {
        if (this._terminated) return Promise.reject(new Error('process terminated'));
        const id = this._nextAppId++;
        const msg: AppMessage = { ch: 'app', type, id, payload };
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pendingApp.delete(id);
                reject(new Error(`request "${type}" timed out`));
            }, timeoutMs);
            this.pendingApp.set(id, { resolve, reject, timer });
            this.transport.postMessage(msg);
        });
    }

    /** Liveness probe for the watchdog: true if the process pongs in time. */
    ping(timeoutMs = 2_000): Promise<boolean> {
        if (this._terminated) return Promise.resolve(false);
        const id = this._nextPingId++;
        return new Promise<boolean>((resolve) => {
            const timer = setTimeout(() => {
                this.pendingPing.delete(id);
                resolve(false);
            }, timeoutMs);
            this.pendingPing.set(id, {
                resolve: () => { clearTimeout(timer); resolve(true); },
                reject: () => { clearTimeout(timer); resolve(false); },
                timer,
            });
            this.transport.postMessage({ ch: 'sys', type: 'ping', id });
        });
    }

    terminate(): void {
        if (this._terminated) return;
        this._terminated = true;
        // A process killed before it ever reported in must fail its waiters too,
        // not leave them pending for the life of the page.
        this.failReady(new Error('process terminated'));
        for (const [, p] of this.pendingApp) {
            clearTimeout(p.timer);
            p.reject(new Error('process terminated'));
        }
        this.pendingApp.clear();

        for (const [, p] of this.pendingPing) {
            clearTimeout(p.timer);
            p.reject(new Error('process terminated'));
        }
        this.pendingPing.clear();

        try { this.transport.terminate(); } catch { /* ignore */ }
    }
}

/** Wraps an already-constructed Web Worker as a transport. Prefer this so the
 *  `new Worker(new URL('...', import.meta.url))` literal stays together at the
 *  call site (required for Vite to bundle the worker for production). */
export function workerTransportFromWorker(worker: Worker): IProcessTransport {
    return {
        postMessage: (msg) => worker.postMessage(msg),
        onMessage: (handler) => { worker.onmessage = (e: MessageEvent) => handler(e.data); },
        onError: (handler) => { worker.onerror = (e: ErrorEvent) => handler(new Error(e.message || 'Worker error')); },
        terminate: () => worker.terminate(),
    };
}

/** Convenience: build a transport from a worker module URL. */
export function workerTransport(url: URL): IProcessTransport {
    return workerTransportFromWorker(new Worker(url, { type: 'module' }));
}

/**
 * Transport over a dedicated MessagePort — a point-to-point channel (from a
 * `MessageChannel`) instead of the global `window` bus. Used for iframe
 * processes: the host keeps one port, the guest gets the other, so messages
 * never touch the shared window and can't be spoofed by other frames.
 */
export function messagePortTransport(port: MessagePort): IProcessTransport {
    port.start();
    return {
        postMessage: (msg) => port.postMessage(msg),
        onMessage: (handler) => { port.onmessage = (e: MessageEvent) => handler(e.data); },
        // A MessagePort has no channel for "the guest threw" — an opaque-origin
        // iframe that dies at its top level simply goes quiet. `messageerror` only
        // covers undeserialisable payloads, so the real net for a guest that never
        // boots is WorkerProcess's ready timeout (audit v1.0.0-rc.1, M-11).
        onError: (handler) => {
            port.onmessageerror = () => handler(new Error('iframe process sent an undeserialisable message'));
        },
        terminate: () => { try { port.close(); } catch { /* already closed */ } },
    };
}
