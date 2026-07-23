/**
 * IDLE EVICTION (audit v1.0.8, M1)
 * A loaded Gemma is ~550 MB of GPU memory; leaving it resident for the whole
 * session was the audit's one medium finding. These tests pin the governance:
 * an idle runtime is shut down (and transparently respawned on next use), a
 * recently-used one is not, and an in-flight request is NEVER evicted under.
 *
 * The eviction clock is shrunk through a seam (__setIdleConfig) and the tests
 * use real timers with tiny waits — no fake-timer/microtask interplay.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { createChatHandlers, CHAT_REQUESTS } from '../js/ai/chatHandlers';
import type { IChatRuntime, ChatPartialListener } from '../js/ai/ChatRuntime';
import type { IAiModelCache, ModelBackend } from '../js/ai/AiModelCache';
import { registerChatModel } from '../js/ai/models';
import { AiService } from '../js/ai/AiService';
import { PermissionBroker } from '../js/core/PermissionBroker';
import { AppRuntime, type IGuestTransport } from '../js/sdk/appRuntime';
import { WorkerProcess, type IProcessTransport } from '../js/core/WorkerProcess';
import type { ProcMessage } from '../js/core/ipc/protocol';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

class FakeChatRuntime implements IChatRuntime {
    private _loadedId: string | null = null;
    /** When set, generate() parks until the deferred resolves — the in-flight case. */
    public blockGenerate: Promise<void> | null = null;

    get loadedId(): string | null { return this._loadedId; }
    isSupported(): boolean { return true; }
    async loadModel(id: string): Promise<void> { this._loadedId = id; }
    async generate(_prompt: string, onPartial?: ChatPartialListener): Promise<string> {
        if (this.blockGenerate) await this.blockGenerate;
        onPartial?.('ok', true);
        return 'ok';
    }
    dispose(): void { this._loadedId = null; }
}

function fakeCache(entries: Record<string, ArrayBuffer>): IAiModelCache {
    const store = new Map(Object.entries(entries));
    return {
        load: async () => { throw new Error('unused'); },
        get: async (id) => store.get(id) ?? null,
        put: async (id, d) => { store.set(id, d); },
        has: async (id) => store.has(id),
        evict: async (id) => { store.delete(id); },
        list: async () => [...store.keys()],
        backend: (): ModelBackend => 'memory',
        __reset: () => store.clear(),
    };
}

function loopback(): { host: IProcessTransport; guest: IGuestTransport } {
    let toGuest: ((m: unknown) => void) | null = null;
    let toHost: ((m: unknown) => void) | null = null;
    const post = (target: () => ((m: unknown) => void) | null, msg: ProcMessage) => {
        queueMicrotask(() => target()?.(structuredClone(msg)));
    };
    return {
        host: {
            postMessage: (m: unknown) => post(() => toGuest, m as ProcMessage),
            onMessage: (h: (m: unknown) => void) => { toHost = h; },
            terminate: () => { toGuest = null; toHost = null; },
        } as IProcessTransport,
        guest: {
            post: (m: unknown) => post(() => toHost, m as ProcMessage),
            onMessage: (h: (m: unknown) => void) => { toGuest = h; },
        } as IGuestTransport,
    };
}

describe('AiService idle eviction', () => {
    let runtime: FakeChatRuntime;
    let spawnCount: number;

    beforeEach(() => {
        localStorage.removeItem('hados-ai-chat-models');
        PermissionBroker.reset();
        PermissionBroker.setPrompt(async () => 'granted');
        registerChatModel({ id: 'chat-evict', label: 'g.task', bytes: 8, sha256: null, task: 'chat', importedAt: Date.now() });

        runtime = new FakeChatRuntime();
        spawnCount = 0;
        const cache = fakeCache({ 'chat-evict': new Uint8Array(8).fill(1).buffer });
        AiService.__setSpawner(() => {
            spawnCount++;
            const { host, guest } = loopback();
            const app = new AppRuntime(guest);
            const handlers = createChatHandlers(runtime, cache, {});
            app.on(CHAT_REQUESTS.LOAD, (p) => handlers.load((p ?? {}) as Record<string, unknown>))
                .on(CHAT_REQUESTS.GENERATE, (p) => handlers.generate((p ?? {}) as Record<string, unknown>))
                .start();
            return { pid: 1000 + spawnCount, worker: new WorkerProcess(host) };
        });
        AiService.__setIdleConfig(80, 40); // evict after 80 ms idle, sweep every 40 ms
    });

    afterEach(() => {
        AiService.__setIdleConfig(null, null);
        AiService.__setSpawner(null);
        PermissionBroker.reset();
        localStorage.removeItem('hados-ai-chat-models');
    });

    it('evicts an idle runtime and respawns transparently on the next use', async () => {
        await AiService.chat('messenger', { persona: 'p', history: [{ role: 'user', text: 'hi' }] });
        expect(spawnCount).toBe(1);

        await sleep(250); // > evict + a few sweeps
        // Evicted: the next call must build a fresh process — and still just work.
        const out = await AiService.chat('messenger', { persona: 'p', history: [{ role: 'user', text: 'hi' }] });
        expect(out).toBe('ok');
        expect(spawnCount).toBe(2);
    });

    it('does not evict a recently-used runtime', async () => {
        await AiService.chat('messenger', { persona: 'p', history: [{ role: 'user', text: 'hi' }] });
        await sleep(30); // < evict window
        await AiService.chat('messenger', { persona: 'p', history: [{ role: 'user', text: 'hi' }] });
        expect(spawnCount).toBe(1);
    });

    it('never evicts under an in-flight request, however long it runs', async () => {
        let release!: () => void;
        runtime.blockGenerate = new Promise<void>(r => { release = r; });

        const pending = AiService.chat('messenger', { persona: 'p', history: [{ role: 'user', text: 'hi' }] });
        await sleep(250); // sweeps fire well past the evict window while in flight
        release();
        await expect(pending).resolves.toBe('ok'); // survived — no mid-generation kill
        expect(spawnCount).toBe(1);

        runtime.blockGenerate = null;
        await AiService.chat('messenger', { persona: 'p', history: [{ role: 'user', text: 'hi' }] });
        expect(spawnCount).toBe(1); // the finally-touch reset the idle clock
    });
});
