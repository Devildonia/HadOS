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
    terminate(): void;
}

interface Pending {
    resolve: (value: unknown) => void;
    reject: (err: Error) => void;
    timer: ReturnType<typeof setTimeout>;
}

export class WorkerProcess {
    private _nextId = 1;
    private readonly pending = new Map<number, Pending>();
    private readonly requestHandlers = new Map<string, (payload: unknown) => unknown | Promise<unknown>>();
    private _ready = false;
    private _terminated = false;
    private resolveReady!: () => void;
    /** Resolves when the process posts `sys:ready`. */
    public readonly ready: Promise<void>;

    constructor(private readonly transport: IProcessTransport) {
        this.ready = new Promise<void>(res => { this.resolveReady = res; });
        this.transport.onMessage(m => this.handle(m));
    }

    get isReady(): boolean { return this._ready; }
    get isTerminated(): boolean { return this._terminated; }

    private handle(raw: unknown): void {
        if (!raw || typeof raw !== 'object') return;
        const msg = raw as ProcMessage;

        if (isSysMessage(msg)) {
            if (msg.type === 'ready') {
                this._ready = true;
                this.resolveReady();
            } else if (msg.type === 'pong') {
                this.settle(msg.id, undefined, undefined);
            }
            return;
        }

        if (isAppMessage(msg)) {
            if (msg.type === 'response') {
                // Reply to a request WE sent.
                if (typeof msg.id === 'number') this.settle(msg.id, msg.payload, msg.error);
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

    private settle(id: number, payload: unknown, error?: string): void {
        const p = this.pending.get(id);
        if (!p) return;
        clearTimeout(p.timer);
        this.pending.delete(id);
        if (error) p.reject(new Error(error));
        else p.resolve(payload);
    }

    /** Sends an app request and resolves with its response payload. */
    request(type: string, payload?: unknown, timeoutMs = 10_000): Promise<unknown> {
        if (this._terminated) return Promise.reject(new Error('process terminated'));
        const id = this._nextId++;
        const msg: AppMessage = { ch: 'app', type, id, payload };
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`request "${type}" timed out`));
            }, timeoutMs);
            this.pending.set(id, { resolve, reject, timer });
            this.transport.postMessage(msg);
        });
    }

    /** Liveness probe for the watchdog: true if the process pongs in time. */
    ping(timeoutMs = 2_000): Promise<boolean> {
        if (this._terminated) return Promise.resolve(false);
        const id = this._nextId++;
        return new Promise<boolean>((resolve) => {
            const timer = setTimeout(() => {
                this.pending.delete(id);
                resolve(false);
            }, timeoutMs);
            this.pending.set(id, {
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
        for (const [, p] of this.pending) {
            clearTimeout(p.timer);
            p.reject(new Error('process terminated'));
        }
        this.pending.clear();
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
        terminate: () => { try { port.close(); } catch { /* already closed */ } },
    };
}
