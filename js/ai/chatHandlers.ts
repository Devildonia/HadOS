/**
 * CHAT HANDLERS (guest side, transport-free)
 * The chat half of the `ai-runtime` process, split from aiRuntimeHandlers for the
 * same reason that file is split from the worker shell: jsdom has no Worker, and
 * the behaviour should be testable with a fake runtime.
 *
 * Contrast with the tensor path: chat models are USER-IMPORTED, so `load` takes
 * the full spec (id + expected size/hash recorded at import) instead of resolving
 * an id against the download registry. There is deliberately no URL anywhere in
 * this path — on a cache miss there is nothing to fetch, only an error telling
 * the user to import the file again.
 */

import type { IAiModelCache } from './AiModelCache';
import type { IChatRuntime } from './ChatRuntime';

export const CHAT_REQUESTS = {
    LOAD: 'chat:load',
    GENERATE: 'chat:generate',
    DISPOSE: 'chat:dispose',
    INFO: 'chat:info',
} as const;

export const CHAT_EVENTS = {
    /** A streamed reply delta: { requestId, delta, done }. */
    TOKEN: 'chat:token',
} as const;

export interface IChatLoadArgs {
    id: string;
    /** Expected byte length recorded at import. */
    bytes?: number;
    /** Expected hex SHA-256 recorded at import (null if it could not be computed). */
    sha256?: string | null;
}

export interface IChatTokenEvent {
    requestId: string;
    delta: string;
    done: boolean;
}

export type ChatTokenReporter = (ev: IChatTokenEvent) => void;
export type ChatProgressReporter = (ev: { id: string; loaded: number; total: number; phase: 'download' | 'compile' }) => void;

export interface IChatHandlers {
    load(args: Record<string, unknown>): Promise<{ id: string }>;
    generate(args: Record<string, unknown>): Promise<{ requestId: string; text: string }>;
    dispose(): { ok: true };
    info(): { supported: boolean; loadedId: string | null };
}

async function sha256Hex(data: ArrayBuffer): Promise<string | null> {
    try {
        const subtle = (globalThis.crypto as Crypto | undefined)?.subtle;
        if (!subtle) return null;
        const digest = await subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
        return null;
    }
}

export function createChatHandlers(
    runtime: IChatRuntime,
    cache: IAiModelCache,
    opts: { onToken?: ChatTokenReporter; onProgress?: ChatProgressReporter } = {},
): IChatHandlers {
    /** In-flight load, so two apps asking at once compile once. */
    let loading: Promise<{ id: string }> | null = null;
    let loadingId: string | null = null;

    async function load(args: Record<string, unknown>): Promise<{ id: string }> {
        const id = typeof args.id === 'string' ? args.id : '';
        if (!id) throw new Error('chat: missing model id');
        if (!runtime.isSupported()) {
            throw new Error('chat: WebGPU is required for on-device chat and this browser does not expose it');
        }
        if (runtime.loadedId === id) return { id };
        if (loading && loadingId === id) return loading;

        const expectedBytes = typeof args.bytes === 'number' ? args.bytes : undefined;
        const expectedHash = typeof args.sha256 === 'string' ? args.sha256.toLowerCase() : null;

        loadingId = id;
        loading = (async () => {
            const data = await cache.get(id);
            if (!data) {
                throw new Error(`chat: model '${id}' is not in the local cache — import the file again`);
            }
            // The bytes crossed OPFS, not the network, but the import wrote them and
            // anything could have happened to the disk since. Same rule as downloads:
            // verify before compiling, fail loudly instead of running corrupt weights.
            if (expectedBytes !== undefined && data.byteLength !== expectedBytes) {
                throw new Error(`chat: model '${id}' is ${data.byteLength} bytes, expected ${expectedBytes} — re-import it`);
            }
            if (expectedHash) {
                const actual = await sha256Hex(data);
                if (actual !== null && actual !== expectedHash) {
                    throw new Error(`chat: model '${id}' failed its SHA-256 check — re-import it`);
                }
            }

            opts.onProgress?.({ id, loaded: 0, total: 1, phase: 'compile' });
            await runtime.loadModel(id, data);
            opts.onProgress?.({ id, loaded: 1, total: 1, phase: 'compile' });
            return { id };
        })();

        try {
            return await loading;
        } finally {
            loading = null;   // clear on failure too, so a retry can work
            loadingId = null;
        }
    }

    async function generate(args: Record<string, unknown>): Promise<{ requestId: string; text: string }> {
        const requestId = typeof args.requestId === 'string' ? args.requestId : '';
        const prompt = typeof args.prompt === 'string' ? args.prompt : '';
        if (!requestId) throw new Error('chat: missing requestId');
        if (!prompt.trim()) throw new Error('chat: empty prompt');

        const text = await runtime.generate(prompt, (delta, done) => {
            opts.onToken?.({ requestId, delta, done });
        });
        return { requestId, text };
    }

    function dispose(): { ok: true } {
        runtime.dispose();
        return { ok: true };
    }

    function info(): { supported: boolean; loadedId: string | null } {
        return { supported: runtime.isSupported(), loadedId: runtime.loadedId };
    }

    return { load, generate, dispose, info };
}
