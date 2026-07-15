/**
 * APP RUNTIME SDK (guest side)
 * The small library an isolated app (Web Worker now, sandboxed iframe later)
 * loads to speak the process IPC protocol without hand-rolling postMessage:
 *   - announces `sys:ready`,
 *   - auto-answers `sys:ping` with `sys:pong` (keeps the watchdog happy),
 *   - routes `app` requests to registered handlers and replies with the result
 *     or an error, correlated by id.
 *
 * Transport-agnostic (an `IGuestTransport`) so the same app code runs in a
 * Worker (`workerGuestTransport`) or an iframe MessagePort later. Phase 1.x.
 */

import { isAppMessage, isSysMessage, type AppMessage, type ProcMessage } from '../core/ipc/protocol';

export type RequestHandler = (payload: unknown) => unknown | Promise<unknown>;

export interface IGuestTransport {
    post(msg: ProcMessage): void;
    onMessage(handler: (msg: unknown) => void): void;
}

export class AppRuntime {
    private readonly handlers = new Map<string, RequestHandler>();
    private readonly pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();
    private nextId = 1;
    private started = false;

    constructor(private readonly transport: IGuestTransport) {
        this.transport.onMessage(m => { void this.handle(m); });
    }

    /**
     * Calls the host and resolves with its response — the guest→host direction
     * (syscalls). `syscall('fs.read', {...})` reaches the host's syscall broker.
     */
    request(type: string, payload?: unknown, timeoutMs = 10_000): Promise<unknown> {
        const id = this.nextId++;
        const msg: AppMessage = { ch: 'app', type, id, payload };
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`request "${type}" timed out`));
            }, timeoutMs);
            this.pending.set(id, { resolve, reject, timer });
            this.transport.post(msg);
        });
    }

    /** Ergonomic alias for a host syscall. */
    syscall(name: string, args?: unknown, timeoutMs?: number): Promise<unknown> {
        return this.request(name, args, timeoutMs);
    }

    private settle(id: number, payload: unknown, error?: string): void {
        const p = this.pending.get(id);
        if (!p) return;
        clearTimeout(p.timer);
        this.pending.delete(id);
        if (error) p.reject(new Error(error));
        else p.resolve(payload);
    }

    /** Registers a handler for an app request `type`. Chainable. */
    on(type: string, handler: RequestHandler): this {
        this.handlers.set(type, handler);
        return this;
    }

    /** Announces readiness to the host. Call once after registering handlers. */
    start(): this {
        if (this.started) return this;
        this.started = true;
        this.transport.post({ ch: 'sys', type: 'ready' });
        return this;
    }

    private reply(id: number | undefined, payload?: unknown, error?: string): void {
        const msg: AppMessage = { ch: 'app', type: 'response' };
        if (id !== undefined) msg.id = id;
        if (payload !== undefined) msg.payload = payload;
        if (error !== undefined) msg.error = error;
        this.transport.post(msg);
    }

    private async handle(raw: unknown): Promise<void> {
        const msg = raw as ProcMessage;
        if (isSysMessage(msg)) {
            if (msg.type === 'ping') this.transport.post({ ch: 'sys', type: 'pong', id: msg.id });
            return;
        }
        if (isAppMessage(msg)) {
            if (msg.type === 'response') {
                // Reply to a syscall/request WE sent to the host.
                if (typeof msg.id === 'number') this.settle(msg.id, msg.payload, msg.error);
                return;
            }
            const handler = this.handlers.get(msg.type);
            if (!handler) {
                this.reply(msg.id, undefined, `unknown request: ${msg.type}`);
                return;
            }
            try {
                const result = await handler(msg.payload);
                this.reply(msg.id, result);
            } catch (err) {
                this.reply(msg.id, undefined, err instanceof Error ? err.message : String(err));
            }
        }
    }
}

/** Guest transport backed by the Web Worker global scope. */
export function workerGuestTransport(): IGuestTransport {
    const ctx = self as unknown as {
        postMessage(m: ProcMessage): void;
        onmessage: ((e: MessageEvent) => void) | null;
    };
    return {
        post: (msg) => ctx.postMessage(msg),
        onMessage: (handler) => { ctx.onmessage = (e: MessageEvent) => handler(e.data); },
    };
}

/** Convenience: an AppRuntime wired to the Worker global scope. */
export function createWorkerRuntime(): AppRuntime {
    return new AppRuntime(workerGuestTransport());
}

/** Guest transport over a dedicated MessagePort (for iframe processes). */
export function messagePortGuestTransport(port: MessagePort): IGuestTransport {
    port.start();
    return {
        post: (msg) => port.postMessage(msg),
        onMessage: (handler) => { port.onmessage = (e: MessageEvent) => handler(e.data); },
    };
}

/** Convenience: an AppRuntime wired to a MessagePort. */
export function createPortRuntime(port: MessagePort): AppRuntime {
    return new AppRuntime(messagePortGuestTransport(port));
}
