import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAiRuntimeHandlers, toFloat32, AI_REQUESTS } from '../js/ai/aiRuntimeHandlers';
import { FakeInferenceRuntime } from '../js/ai/InferenceRuntime';
import { AiModelCache } from '../js/ai/AiModelCache';
import { AiService, AI_CAPABILITY } from '../js/ai/AiService';
import { DEEPLAB_V3 } from '../js/ai/models';
import { PermissionBroker } from '../js/core/PermissionBroker';
import { VFS } from '../js/core/VFS';
import { WorkerProcess, type IProcessTransport } from '../js/core/WorkerProcess';
import { AppRuntime, type IGuestTransport } from '../js/sdk/appRuntime';
import type { ProcMessage } from '../js/core/ipc/protocol';

/**
 * The real registry pins a SHA-256, and no fixture can forge a preimage for it —
 * the first run of this suite died on exactly that, which is the integrity check
 * earning its keep. So the substrate tests run against a stand-in registry with the
 * same shape and no pinned hash. The real entry's pinning is asserted in
 * AiModelCache.test.ts, where it belongs.
 */
vi.mock('../js/ai/models', () => {
    const TEST_SPEC = {
        id: 'deeplab-v3-float32',
        url: 'https://storage.googleapis.com/test/model.tflite',
        bytes: 64,
        task: 'segmentation' as const,
        label: 'Test segmentation model',
        inputSize: 257,
        classes: 21,
        backgroundClass: 0,
    };
    return {
        DEEPLAB_V3: TEST_SPEC,
        MODEL_HOSTS: ['https://storage.googleapis.com'],
        // The allowlist semantics are what the substrate leans on, so they are kept
        // exactly: a name that is not registered resolves to null, and no caller
        // anywhere can supply a URL.
        getModel: (id: string) => (id === TEST_SPEC.id ? TEST_SPEC : null),
        getModelForTask: (t: string) => (t === 'segmentation' ? TEST_SPEC : null),
        listModels: () => [TEST_SPEC],
    };
});

const MODEL_ID = DEEPLAB_V3.id;
/** The fake's declared input: 1*257*257*3. */
const IN_SHAPE = [1, 257, 257, 3];
const IN_LEN = IN_SHAPE.reduce((a, b) => a * b, 1);

/** jsdom does not construct ImageData — the shape is all segment() reads. */
function imageData(width: number, height: number): ImageData {
    return { width, height, data: new Uint8ClampedArray(width * height * 4), colorSpace: 'srgb' } as ImageData;
}

/** A fetch that returns `n` bytes, enough to satisfy the registry's pinned spec. */
function fetchOk(byteLength = DEEPLAB_V3.bytes!) {
    return vi.fn(async () => ({
        ok: true,
        status: 200,
        headers: { get: () => String(byteLength) },
        body: null,
        arrayBuffer: async () => new ArrayBuffer(byteLength),
    } as unknown as Response));
}

/**
 * Wires a real WorkerProcess to a real AppRuntime through an in-memory loopback,
 * so the tests drive the actual IPC protocol (ready, ids, errors) rather than a
 * mock of it. jsdom has no Worker; this is the substitute.
 */
function loopback(): { host: IProcessTransport; guest: IGuestTransport } {
    let toGuest: ((m: unknown) => void) | null = null;
    let toHost: ((m: unknown) => void) | null = null;
    const post = (target: () => ((m: unknown) => void) | null, msg: ProcMessage) => {
        // Async, like a real postMessage: catches ordering bugs a sync call hides.
        queueMicrotask(() => target()?.(structuredClone(msg)));
    };
    return {
        host: {
            postMessage: (m) => post(() => toGuest, m),
            onMessage: (h) => { toHost = h; },
            terminate: () => { toGuest = null; toHost = null; },
        },
        guest: {
            post: (m) => post(() => toHost, m),
            onMessage: (h) => { toGuest = h; },
        },
    };
}

/** Boots a full ai-runtime process over the loopback and returns the host handle. */
function spawnFakeRuntime(runtime: FakeInferenceRuntime) {
    const { host, guest } = loopback();
    const app = new AppRuntime(guest);
    const handlers = createAiRuntimeHandlers(runtime, {
        preferredBackend: () => 'wasm',
        onProgress: (ev) => { void app.request('ai:progress', ev).catch(() => {}); },
    });
    app.on(AI_REQUESTS.LOAD, (p) => handlers.load((p ?? {}) as any))
        .on(AI_REQUESTS.INFER, (p) => handlers.infer((p ?? {}) as any))
        .on(AI_REQUESTS.DISPOSE, (p) => handlers.dispose((p ?? {}) as any))
        .on(AI_REQUESTS.INFO, () => handlers.info())
        .start();
    return new WorkerProcess(host);
}

describe('ai-runtime handlers', () => {
    let runtime: FakeInferenceRuntime;
    let handlers: ReturnType<typeof createAiRuntimeHandlers>;

    beforeEach(() => {
        AiModelCache.__reset();
        vi.stubGlobal('fetch', fetchOk());
        runtime = new FakeInferenceRuntime({ inputShape: IN_SHAPE, outputShape: [1, 4] });
        handlers = createAiRuntimeHandlers(runtime, { preferredBackend: () => 'wasm' });
    });
    afterEach(() => vi.unstubAllGlobals());

    it('loads a registered model and reports its shapes and backend', async () => {
        const res = await handlers.load({ id: MODEL_ID });
        expect(res.id).toBe(MODEL_ID);
        expect(res.inputShape).toEqual(IN_SHAPE);
        expect(res.backend).toBe('wasm');
        expect(runtime.isLoaded(MODEL_ID)).toBe(true);
    });

    it('refuses a model that is not on the allowlist', async () => {
        await expect(handlers.load({ id: 'not-a-model' })).rejects.toThrow(/unknown model/);
        // And it must not be temptable by a URL — the registry is the only source.
        await expect(handlers.load({ id: 'https://evil.test/x.tflite' })).rejects.toThrow(/unknown model/);
        expect(runtime.loadedCount).toBe(0);
    });

    it('initialises the runtime once across concurrent loads', async () => {
        const init = vi.spyOn(runtime, 'init');
        await Promise.all([handlers.load({ id: MODEL_ID }), handlers.load({ id: MODEL_ID })]);
        expect(init).toHaveBeenCalledTimes(1);
    });

    it('compiles a model once when two callers race', async () => {
        const load = vi.spyOn(runtime, 'loadModel');
        await Promise.all([handlers.load({ id: MODEL_ID }), handlers.load({ id: MODEL_ID })]);
        expect(load).toHaveBeenCalledTimes(1);
    });

    it('reports download then compile progress', async () => {
        const seen: string[] = [];
        const h = createAiRuntimeHandlers(runtime, {
            preferredBackend: () => 'wasm',
            onProgress: (ev) => seen.push(ev.phase),
        });
        await h.load({ id: MODEL_ID });
        expect(seen).toContain('download');
        expect(seen).toContain('compile');
        // Compile is reported last: the bar must not sit at 100% during the wait.
        expect(seen[seen.length - 1]).toBe('compile');
    });

    it('runs inference and returns the output tensor', async () => {
        await handlers.load({ id: MODEL_ID });
        const input = new Float32Array(IN_LEN).fill(0.5);
        const out = await handlers.infer({ id: MODEL_ID, input, shape: IN_SHAPE });
        expect(out.shape).toEqual([1, 4]);
        expect(Array.from(out.data)).toEqual([1, 1, 1, 1]); // fake doubles the input
    });

    it('loads on demand when infer is called first', async () => {
        const out = await handlers.infer({ id: MODEL_ID, input: new Float32Array(IN_LEN), shape: IN_SHAPE });
        expect(out.shape).toEqual([1, 4]);
        expect(runtime.isLoaded(MODEL_ID)).toBe(true);
    });

    it('rejects an input that does not match the model shape', async () => {
        await handlers.load({ id: MODEL_ID });
        await expect(handlers.infer({ id: MODEL_ID, input: new Float32Array(3), shape: IN_SHAPE }))
            .rejects.toThrow(/model wants/);
    });

    it('lets a failed init be retried instead of wedging the process', async () => {
        const failing = new FakeInferenceRuntime({ failInit: true, inputShape: IN_SHAPE });
        const h = createAiRuntimeHandlers(failing, { preferredBackend: () => 'wasm' });
        await expect(h.load({ id: MODEL_ID })).rejects.toThrow(/init failed/);

        // A transient GPU hiccup must not poison every later call. `recover()` rather
        // than a stubbed init(): stubbing it out would skip the very state the real
        // init sets, and the test would be asserting against a runtime that never
        // actually initialised.
        failing.recover();
        await expect(h.load({ id: MODEL_ID })).resolves.toMatchObject({ id: MODEL_ID, backend: 'wasm' });
    });

    it('disposes a model and reports what it holds', async () => {
        await handlers.load({ id: MODEL_ID });
        expect(handlers.info()).toEqual({ backend: 'wasm', loaded: [MODEL_ID] });
        handlers.dispose({ id: MODEL_ID });
        expect(handlers.info().loaded).toEqual([]);
        expect(runtime.isLoaded(MODEL_ID)).toBe(false);
    });
});

describe('tensor payload coercion', () => {
    it('passes a Float32Array through untouched', () => {
        const f = new Float32Array([1, 2]);
        expect(toFloat32(f)).toBe(f);
    });

    it('accepts a plain number array (a JSON-ish transport)', () => {
        expect(Array.from(toFloat32([1, 2.5]))).toEqual([1, 2.5]);
    });

    it('refuses junk rather than silently producing NaN', () => {
        // `new Float32Array(['a'])` yields [NaN] — a garbage mask that only surfaces
        // much later, far from the cause.
        expect(() => toFloat32(['a', 'b'])).toThrow(/finite numbers/);
        expect(() => toFloat32([1, NaN])).toThrow(/finite numbers/);
        expect(() => toFloat32('nope')).toThrow(/must be a Float32Array/);
        expect(() => toFloat32(null)).toThrow(/must be a Float32Array/);
        expect(() => toFloat32({ 0: 1, 1: 2 })).toThrow(/must be a Float32Array/);
    });
});

describe('AiService (host facade)', () => {
    let runtime: FakeInferenceRuntime;

    beforeEach(async () => {
        localStorage.clear();
        (VFS as any).__reset();
        await VFS.init();
        PermissionBroker.reset();
        AiModelCache.__reset();
        vi.stubGlobal('fetch', fetchOk());

        runtime = new FakeInferenceRuntime({ inputShape: IN_SHAPE, outputShape: [1, 4] });
        AiService.__setSpawner(() => ({ pid: 1, worker: spawnFakeRuntime(runtime) }));
    });
    afterEach(() => {
        AiService.__setSpawner(null);
        vi.unstubAllGlobals();
    });

    it('prompts for ai:infer on first use and runs once granted', async () => {
        const prompt = vi.fn(async () => 'granted' as const);
        PermissionBroker.setPrompt(prompt);

        const res = await AiService.loadModel('pinta', MODEL_ID);
        expect(res.id).toBe(MODEL_ID);
        expect(prompt).toHaveBeenCalledWith('pinta', AI_CAPABILITY);
    });

    it('refuses to run when the user denies consent', async () => {
        PermissionBroker.setPrompt(async () => 'denied');
        await expect(AiService.loadModel('pinta', MODEL_ID)).rejects.toThrow(/permission denied: ai:infer/);
        // Denied means the model is never even fetched.
        expect(runtime.loadedCount).toBe(0);
    });

    it('remembers the decision instead of prompting per call', async () => {
        const prompt = vi.fn(async () => 'granted' as const);
        PermissionBroker.setPrompt(prompt);

        await AiService.loadModel('pinta', MODEL_ID);
        await AiService.infer('pinta', MODEL_ID, new Float32Array(IN_LEN), IN_SHAPE);
        await AiService.infer('pinta', MODEL_ID, new Float32Array(IN_LEN), IN_SHAPE);

        expect(prompt).toHaveBeenCalledTimes(1);
    });

    it('gates each app separately', async () => {
        PermissionBroker.setPrompt(async (appId) => (appId === 'pinta' ? 'granted' : 'denied'));
        await expect(AiService.loadModel('pinta', MODEL_ID)).resolves.toBeTruthy();
        await expect(AiService.loadModel('sketchy-app', MODEL_ID)).rejects.toThrow(/permission denied/);
    });

    it('carries a tensor across the process boundary and back', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        const input = new Float32Array(IN_LEN).fill(2);
        const out = await AiService.infer('pinta', MODEL_ID, input, IN_SHAPE);

        expect(out.data).toBeInstanceOf(Float32Array);
        expect(Array.from(out.data)).toEqual([4, 4, 4, 4]); // survived the round trip
        expect(out.shape).toEqual([1, 4]);
    });

    it('surfaces a runtime failure as a rejection, not a hang', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        AiService.__setSpawner(() => ({
            pid: 2,
            worker: spawnFakeRuntime(new FakeInferenceRuntime({ failLoad: true, inputShape: IN_SHAPE })),
        }));
        await expect(AiService.loadModel('pinta', MODEL_ID)).rejects.toThrow(/load failed/);
    });

    it('delivers download progress to subscribers', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        const seen: string[] = [];
        const off = AiService.onProgress(p => seen.push(p.phase));

        await AiService.loadModel('pinta', MODEL_ID);
        // Progress crosses the boundary as a guest→host request; let it drain.
        await new Promise(r => setTimeout(r, 0));

        expect(seen).toContain('download');
        off();
    });

    it('segments an image end to end and reports coverage', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        // A fake whose shapes look like a real segmenter, but tiny.
        const seg = new FakeInferenceRuntime({ inputShape: [1, 4, 4, 3], outputShape: [1, 4, 4, 21] });
        AiService.__setSpawner(() => ({ pid: 9, worker: spawnFakeRuntime(seg) }));

        const res = await AiService.segment('pinta', imageData(8, 6));

        // The mask comes back at the MODEL's resolution, not the image's — upscaling
        // is the caller's business.
        expect(res.size).toBe(4);
        expect(res.mask.length).toBe(16);
        expect(res.coverage).toBeGreaterThanOrEqual(0);
        expect(res.coverage).toBeLessThanOrEqual(1);
        // coverage must actually describe the mask it shipped.
        expect(res.coverage).toBeCloseTo([...res.mask].filter(Boolean).length / 16, 5);
    });

    it('sizes the input tensor from the compiled graph, not the registry hint', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        // The mocked registry says inputSize 257; the "graph" says 4. If segment()
        // trusted the registry it would build a 257x257x3 tensor and the fake's own
        // length check would reject it — so this passing IS the assertion.
        const seg = new FakeInferenceRuntime({ inputShape: [1, 4, 4, 3], outputShape: [1, 4, 4, 21] });
        AiService.__setSpawner(() => ({ pid: 10, worker: spawnFakeRuntime(seg) }));

        await expect(AiService.segment('pinta', imageData(9, 3))).resolves.toMatchObject({ size: 4 });
    });

    it('will not segment without consent', async () => {
        PermissionBroker.setPrompt(async () => 'denied');
        const seg = new FakeInferenceRuntime({ inputShape: [1, 4, 4, 3], outputShape: [1, 4, 4, 21] });
        AiService.__setSpawner(() => ({ pid: 11, worker: spawnFakeRuntime(seg) }));

        await expect(AiService.segment('pinta', imageData(4, 4))).rejects.toThrow(/permission denied/);
        expect(seg.loadedCount).toBe(0); // denied means the model is never even fetched
    });

    it('respawns the runtime after it is killed', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        await AiService.loadModel('pinta', MODEL_ID);

        let spawns = 0;
        AiService.__setSpawner(() => {
            spawns++;
            return { pid: 3, worker: spawnFakeRuntime(new FakeInferenceRuntime({ inputShape: IN_SHAPE, outputShape: [1, 4] })) };
        });

        await AiService.loadModel('pinta', MODEL_ID);
        expect(spawns).toBe(1);
    });
});
