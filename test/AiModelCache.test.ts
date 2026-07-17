// fake-indexeddb/auto before the import so AiModelCache selects the IDB backend
// (jsdom has no OPFS), mirroring VFSBlob.test.ts.
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AiModelCache, isValidModelId } from '../js/ai/AiModelCache';
import type { IModelSpec } from '../js/ai/AiModelCache';
import { getModel, getModelForTask, listModels, MODEL_HOSTS } from '../js/ai/models';

const BYTES = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

/** A fetch that streams the given bytes back in small chunks, like the real thing. */
function streamingFetch(data: Uint8Array, chunkSize = 3, status = 200) {
    return vi.fn(async () => {
        let offset = 0;
        return {
            ok: status >= 200 && status < 300,
            status,
            headers: { get: (h: string) => (h.toLowerCase() === 'content-length' ? String(data.byteLength) : null) },
            body: {
                getReader: () => ({
                    read: async () => {
                        if (offset >= data.byteLength) return { done: true, value: undefined };
                        const value = data.slice(offset, offset + chunkSize);
                        offset += value.byteLength;
                        return { done: false, value };
                    },
                }),
            },
            arrayBuffer: async () => data.buffer,
        } as unknown as Response;
    });
}

/** A fetch with no readable stream — the arrayBuffer() fallback path. */
function bufferFetch(data: Uint8Array) {
    return vi.fn(async () => ({
        ok: true,
        status: 200,
        headers: { get: () => null },
        body: null,
        arrayBuffer: async () => data.buffer,
    } as unknown as Response));
}

const spec = (over: Partial<IModelSpec> = {}): IModelSpec => ({
    id: `m-${Math.random().toString(36).slice(2)}`,
    url: 'https://example.test/model.tflite',
    ...over,
});

describe('AiModelCache', () => {
    beforeEach(() => {
        AiModelCache.__reset();
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('selects a durable backend (IndexedDB under fake-indexeddb)', () => {
        expect(['opfs', 'indexeddb']).toContain(AiModelCache.backend());
    });

    it('downloads on a miss and serves the same bytes', async () => {
        const f = streamingFetch(BYTES);
        vi.stubGlobal('fetch', f);

        const s = spec();
        const out = await AiModelCache.load(s);
        expect(new Uint8Array(out)).toEqual(BYTES);
        expect(f).toHaveBeenCalledTimes(1);
        expect(await AiModelCache.has(s.id)).toBe(true);
    });

    it('serves a second load from the cache without re-fetching', async () => {
        const f = streamingFetch(BYTES);
        vi.stubGlobal('fetch', f);

        const s = spec();
        await AiModelCache.load(s);
        const again = await AiModelCache.load(s);

        expect(new Uint8Array(again)).toEqual(BYTES);
        expect(f).toHaveBeenCalledTimes(1); // the whole point of the cache
    });

    it('downloads once when two callers race for the same model', async () => {
        const f = streamingFetch(BYTES);
        vi.stubGlobal('fetch', f);

        const s = spec();
        const [a, b] = await Promise.all([AiModelCache.load(s), AiModelCache.load(s)]);

        expect(f).toHaveBeenCalledTimes(1);
        expect(new Uint8Array(a)).toEqual(BYTES);
        expect(new Uint8Array(b)).toEqual(BYTES);
    });

    it('reports progress as bytes land, ending at the total', async () => {
        vi.stubGlobal('fetch', streamingFetch(BYTES, 3));
        const seen: Array<[number, number]> = [];

        await AiModelCache.load(spec(), (loaded, total) => seen.push([loaded, total]));

        expect(seen.length).toBeGreaterThan(1);          // genuinely incremental
        expect(seen[seen.length - 1]).toEqual([8, 8]);   // and it finishes at 100%
        const loaded = seen.map(s => s[0]);
        expect(loaded).toEqual([...loaded].sort((x, y) => x - y)); // monotonic
    });

    it('falls back to arrayBuffer() when the body is not streamable', async () => {
        vi.stubGlobal('fetch', bufferFetch(BYTES));
        const seen: Array<[number, number]> = [];

        const out = await AiModelCache.load(spec(), (l, t) => seen.push([l, t]));

        expect(new Uint8Array(out)).toEqual(BYTES);
        expect(seen).toEqual([[8, 8]]); // one final tick, never a frozen 0%
    });

    it('reports progress immediately on a cache hit', async () => {
        vi.stubGlobal('fetch', streamingFetch(BYTES));
        const s = spec();
        await AiModelCache.load(s);

        const seen: Array<[number, number]> = [];
        await AiModelCache.load(s, (l, t) => seen.push([l, t]));
        expect(seen).toEqual([[8, 8]]); // a cached model must not look stuck at 0%
    });

    it('rejects a truncated download and does not cache it', async () => {
        vi.stubGlobal('fetch', streamingFetch(BYTES));
        const s = spec({ bytes: 999 });

        await expect(AiModelCache.load(s)).rejects.toThrow(/expected 999/);
        expect(await AiModelCache.has(s.id)).toBe(false); // poison never stored
    });

    it('rejects bytes that fail their SHA-256 and does not cache them', async () => {
        vi.stubGlobal('fetch', streamingFetch(BYTES));
        const s = spec({ sha256: 'f'.repeat(64) });

        await expect(AiModelCache.load(s)).rejects.toThrow(/SHA-256/);
        expect(await AiModelCache.has(s.id)).toBe(false);
    });

    it('accepts bytes matching their SHA-256', async () => {
        // sha256 of the 8 bytes above, computed independently by node:crypto.
        const { createHash } = await import('node:crypto');
        const digest = createHash('sha256').update(BYTES).digest('hex');

        vi.stubGlobal('fetch', streamingFetch(BYTES));
        const out = await AiModelCache.load(spec({ sha256: digest, bytes: 8 }));
        expect(new Uint8Array(out)).toEqual(BYTES);
    });

    it('surfaces an HTTP error and stays retryable', async () => {
        const bad = vi.fn(async () => ({
            ok: false, status: 404,
            headers: { get: () => null }, body: null,
            arrayBuffer: async () => new ArrayBuffer(0),
        } as unknown as Response));
        vi.stubGlobal('fetch', bad);

        const s = spec();
        await expect(AiModelCache.load(s)).rejects.toThrow(/HTTP 404/);

        // A failed attempt must not wedge the in-flight map: the retry re-fetches.
        vi.stubGlobal('fetch', streamingFetch(BYTES));
        expect(new Uint8Array(await AiModelCache.load(s))).toEqual(BYTES);
    });

    it('refuses ids that could escape the cache directory', async () => {
        vi.stubGlobal('fetch', streamingFetch(BYTES));
        for (const id of ['../escape', 'a/b', '..', '', 'x'.repeat(200), 'a b', '.hidden']) {
            expect(isValidModelId(id)).toBe(false);
            await expect(AiModelCache.load(spec({ id }))).rejects.toThrow(/invalid model id/);
        }
        expect(await AiModelCache.has('../escape')).toBe(false);
    });

    it('accepts ordinary ids', () => {
        for (const id of ['deeplab-v3-float32', 'a', 'A.b_c-1']) expect(isValidModelId(id)).toBe(true);
    });

    it('evicts a cached model so the next load re-downloads', async () => {
        const f = streamingFetch(BYTES);
        vi.stubGlobal('fetch', f);

        const s = spec();
        await AiModelCache.load(s);
        await AiModelCache.evict(s.id);

        expect(await AiModelCache.has(s.id)).toBe(false);
        await AiModelCache.load(s);
        expect(f).toHaveBeenCalledTimes(2);
    });

    it('survives a reload of the process (the bytes are durable, not just in RAM)', async () => {
        const f = streamingFetch(BYTES);
        vi.stubGlobal('fetch', f);

        const s = spec({ id: 'durable-model' });
        await AiModelCache.load(s);

        // __reset() drops every in-memory trace — module state and the memory Map —
        // which is as close to "the user reopened HadOS" as a unit test gets. Without
        // this the suite would pass even if the cache never reached durable storage.
        AiModelCache.__reset();

        expect(await AiModelCache.has(s.id)).toBe(true);
        expect(new Uint8Array(await AiModelCache.load(s))).toEqual(BYTES);
        expect(f).toHaveBeenCalledTimes(1); // no second download after the "restart"
    });

    it('lists what it is holding', async () => {
        vi.stubGlobal('fetch', streamingFetch(BYTES));
        const s = spec({ id: 'listed-model' });
        await AiModelCache.load(s);
        expect(await AiModelCache.list()).toContain('listed-model');
    });
});

describe('model registry', () => {
    it('resolves the segmentation model by id and by task', () => {
        const byTask = getModelForTask('segmentation');
        expect(byTask).not.toBeNull();
        expect(getModel(byTask!.id)).toBe(byTask);
    });

    it('refuses ids that are not on the allowlist', () => {
        // The syscall boundary leans on this: an app naming an unknown model gets
        // nothing, and never gets to supply a URL of its own.
        expect(getModel('https://evil.test/x.tflite')).toBeNull();
        expect(getModel('../../etc/passwd')).toBeNull();
        expect(getModel('deeplab-v3-float32-but-not-really')).toBeNull();
    });

    it('has every model host in the CSP connect-src', async () => {
        // Drift here is invisible to every other test and to the whole app until a
        // user clicks "quitar fondo" in production and the browser silently blocks
        // the download. Pin the two together.
        const fs = await import('node:fs');
        const path = await import('node:path');
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const connectSrc = /connect-src ([^;"]+)/.exec(html)?.[1] ?? '';

        expect(connectSrc).toBeTruthy();
        for (const host of MODEL_HOSTS) expect(connectSrc).toContain(host);
    });

    it('every registered model has a usable, pinned, allowlisted spec', () => {
        for (const m of listModels()) {
            expect(isValidModelId(m.id)).toBe(true);
            expect(m.url.startsWith('https://')).toBe(true);
            // Pinned integrity: without these a truncated or swapped file is cached forever.
            expect(m.bytes).toBeGreaterThan(0);
            expect(m.sha256).toMatch(/^[0-9a-f]{64}$/);
            // A `latest` URL can be republished, which would break the pinned hash.
            expect(m.url).not.toContain('/latest/');
            // The host must be one the CSP actually permits.
            expect(MODEL_HOSTS.some(h => m.url.startsWith(h + '/'))).toBe(true);
            expect(m.backgroundClass).toBeLessThan(m.classes);
        }
    });
});
