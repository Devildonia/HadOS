/**
 * SEMANTIC INDEX SUBSTRATE (embeddings + vector math)
 * Fake engine for the handler/IPC/consent behaviour, and direct pins on the
 * pure math: cosine top-K ranking and the PCA projection the canvas now shows.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { createEmbedHandlers, MAX_EMBED_TEXTS } from '../js/ai/embedHandlers';
import type { IEmbedEngine, IEmbedResult, IEmbedProgress, EmbedProgressListener } from '../js/ai/EmbedEngine';
import { semanticTopK, pca3 } from '../js/ai/vectorMath';
import { AiService, EMBED_CAPABILITY } from '../js/ai/AiService';
import { PermissionBroker } from '../js/core/PermissionBroker';
import { AppRuntime, type IGuestTransport } from '../js/sdk/appRuntime';
import { WorkerProcess, type IProcessTransport } from '../js/core/WorkerProcess';
import type { ProcMessage } from '../js/core/ipc/protocol';

const DIM = 4; // small dim keeps expectations hand-checkable

/** Deterministic fake: text "a b c d" becomes the normalised vector [a,b,c,d]. */
class FakeEmbedEngine implements IEmbedEngine {
    public supported = true;
    public embedCalls: string[][] = [];
    private _ready = false;

    get ready(): boolean { return this._ready; }
    isSupported(): boolean { return this.supported; }

    async init(onProgress?: EmbedProgressListener): Promise<void> {
        onProgress?.({ phase: 'download', file: 'model.onnx', loaded: 10, total: 20 });
        onProgress?.({ phase: 'init', loaded: 1, total: 1 });
        this._ready = true;
    }

    async embed(texts: string[]): Promise<IEmbedResult> {
        this.embedCalls.push(texts);
        const vectors = new Float32Array(texts.length * DIM);
        texts.forEach((t, r) => {
            const parts = t.split(/\s+/).map(Number);
            let norm = 0;
            for (let i = 0; i < DIM; i++) norm += (parts[i] ?? 0) ** 2;
            norm = Math.sqrt(norm) || 1;
            for (let i = 0; i < DIM; i++) vectors[r * DIM + i] = (parts[i] ?? 0) / norm;
        });
        return { vectors, dims: [texts.length, DIM] };
    }

    dispose(): void { this._ready = false; }
}

describe('embed handlers', () => {
    it('validates requestId and texts before touching the engine', async () => {
        const engine = new FakeEmbedEngine();
        const h = createEmbedHandlers(engine);
        await expect(h.embed({ texts: ['x'] })).rejects.toThrow(/requestId/);
        await expect(h.embed({ requestId: 'r', texts: [] })).rejects.toThrow(/no texts/);
        await expect(h.embed({ requestId: 'r', texts: ['  ', 42] })).rejects.toThrow(/no texts/);
        expect(engine.embedCalls.length).toBe(0);
    });

    it('caps the batch size — indexing is not bulk ingestion', async () => {
        const h = createEmbedHandlers(new FakeEmbedEngine());
        const texts = Array.from({ length: MAX_EMBED_TEXTS + 1 }, (_, i) => `t${i}`);
        await expect(h.embed({ requestId: 'r', texts })).rejects.toThrow(/too many texts/);
    });

    it('reports progress tagged with the requestId and returns the matrix', async () => {
        const events: Array<IEmbedProgress & { requestId: string }> = [];
        const h = createEmbedHandlers(new FakeEmbedEngine(), { onProgress: (ev) => events.push(ev) });

        const out = await h.embed({ requestId: 'r1', texts: ['1 0 0 0', '0 1 0 0'] });
        expect(out.requestId).toBe('r1');
        expect(out.dims).toEqual([2, DIM]);
        expect(out.vectors.length).toBe(2 * DIM);
        expect(events.every(e => e.requestId === 'r1')).toBe(true);
        expect(events.map(e => e.phase)).toContain('embed');
    });
});

describe('semanticTopK', () => {
    // Unit vectors in a 4-dim space.
    const rows = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [Math.SQRT1_2, Math.SQRT1_2, 0, 0],
    ].flat();
    const matrix = Float32Array.from(rows);

    it('ranks by cosine, highest first', () => {
        const q = Float32Array.from([1, 0, 0, 0]);
        const top = semanticTopK(q, matrix, 4, 3);
        expect(top[0]!.index).toBe(0);
        expect(top[0]!.score).toBeCloseTo(1, 5);
        expect(top[1]!.index).toBe(2); // 45° away
        expect(top[1]!.score).toBeCloseTo(Math.SQRT1_2, 5);
        expect(top[2]!.index).toBe(1); // orthogonal
    });

    it('clamps K to the row count and never invents rows', () => {
        const q = Float32Array.from([0, 1, 0, 0]);
        expect(semanticTopK(q, matrix, 4, 99).length).toBe(3);
        expect(semanticTopK(q, matrix, 4, 0).length).toBe(0);
    });
});

describe('pca3', () => {
    it('separates two clusters along the first component', () => {
        // Two tight clusters far apart on a diagonal of an 8-dim space.
        const dim = 8;
        const n = 6;
        const m = new Float32Array(n * dim);
        for (let r = 0; r < n; r++) {
            const sign = r < 3 ? 1 : -1;
            m[r * dim] = sign * 10 + (r % 3) * 0.1;
            m[r * dim + 1] = sign * 10;
        }
        const out = pca3(m, n, dim);
        const c0 = [out[0]!, out[3]!, out[6]!];   // first cluster, component 0
        const c1 = [out[9]!, out[12]!, out[15]!]; // second cluster, component 0
        // All of one cluster on one side, all of the other on the other side.
        expect(c0.every(v => v > 0.5) || c0.every(v => v < -0.5)).toBe(true);
        expect(c1.every(v => v > 0.5) || c1.every(v => v < -0.5)).toBe(true);
        expect(Math.sign(c0[0]!)).not.toBe(Math.sign(c1[0]!));
    });

    it('scales every output axis into [-1, 1]', () => {
        const m = Float32Array.from([5, 0, 0, -5, 0, 0, 0, 3, 0]);
        const out = pca3(m, 3, 3);
        for (const v of out) expect(Math.abs(v)).toBeLessThanOrEqual(1 + 1e-6);
    });

    it('yields zeros for degenerate input instead of NaN', () => {
        const m = new Float32Array(4 * 3); // all-identical (zero) rows
        const out = pca3(m, 4, 3);
        expect([...out].every(v => v === 0)).toBe(true);
        expect(pca3(new Float32Array(0), 0, 3).length).toBe(0);
    });

    it('is deterministic', () => {
        const m = Float32Array.from({ length: 5 * 6 }, (_, i) => Math.sin(i));
        expect([...pca3(m, 5, 6)]).toEqual([...pca3(m, 5, 6)]);
    });
});

// ── Host facade over real IPC ────────────────────────────────────────────────

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

function spawnFakeEmbedProcess(engine: FakeEmbedEngine): WorkerProcess {
    const { host, guest } = loopback();
    const app = new AppRuntime(guest);
    const handlers = createEmbedHandlers(engine, {
        onProgress: (ev) => { void app.request('embed:progress', ev).catch(() => {}); },
    });
    app.on('embed:texts', (p) => handlers.embed((p ?? {}) as Record<string, unknown>))
        .on('embed:info', () => handlers.info())
        .start();
    return new WorkerProcess(host);
}

describe('AiService.embed', () => {
    let engine: FakeEmbedEngine;

    beforeEach(() => {
        PermissionBroker.reset();
        engine = new FakeEmbedEngine();
        AiService.__setAsrSpawner(() => ({ pid: 88, worker: spawnFakeEmbedProcess(engine) }));
    });

    afterEach(() => {
        AiService.__setAsrSpawner(null);
        PermissionBroker.reset();
    });

    it('is denied without ai:embed consent, before any work', async () => {
        PermissionBroker.setPrompt(async () => 'denied');
        await expect(AiService.embed('docexplorer', ['x'])).rejects.toThrow(`permission denied: ${EMBED_CAPABILITY}`);
        expect(engine.embedCalls.length).toBe(0);
    });

    it('embeds end to end with progress', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        const phases: string[] = [];
        const out = await AiService.embed('docexplorer', ['1 0 0 0', '0 0 1 0'], (p) => phases.push(p.phase));
        expect(out.dims).toEqual([2, DIM]);
        expect(out.vectors[0]).toBeCloseTo(1, 5);
        expect(phases).toContain('embed');
    });
});
