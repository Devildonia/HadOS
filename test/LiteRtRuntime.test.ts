import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * LiteRT is Wasm and jsdom cannot run it, so nothing here proves inference works —
 * that is the browser's job (see docs/ai/phase-0-substrate-and-paint.md).
 *
 * What these tests DO cover is the translation layer, which is where the guesses
 * live: shapes, accelerator selection, and tensor lifetime. Two real bugs were
 * caught here by types alone — LiteRT reports a shape as `TensorDetails.shape`
 * (Int32Array) for a model but as `type.layout.dimensions` for a live tensor, and
 * `Dimensions` may be an Int32Array rather than a number[].
 */

const deletedTensors: string[] = [];
let webgpuSupported = true;
let runImpl: (input: unknown) => Promise<unknown[]>;
// The param is declared so `mock.calls[0][0]` typechecks: vi.fn(async () => …)
// infers a zero-length argument tuple, and indexing it is an error.
const loadLiteRtMock = vi.fn(async (_wasmDir: string) => undefined);
const loadAndCompileMock = vi.fn();

vi.mock('@litertjs/core', () => {
    class FakeTensor {
        static nextName = 0;
        readonly name: string;
        type: { dtype: string; layout: { dimensions: Int32Array | number[] } };
        constructor(public data: Float32Array, public shape?: number[]) {
            this.name = `in-${FakeTensor.nextName++}`;
            this.type = { dtype: 'float32', layout: { dimensions: shape ?? [] } };
        }
        async dataFn() { return this.data; }
        delete() { deletedTensors.push(this.name); }
    }
    return {
        Tensor: FakeTensor,
        loadLiteRt: loadLiteRtMock,
        loadAndCompile: loadAndCompileMock,
        isWebGPUSupported: () => webgpuSupported,
    };
});

const { LiteRtRuntime } = await import('../js/ai/LiteRtRuntime');

/** An output tensor as LiteRT hands it back: Int32Array dims, a data() promise. */
function outputTensor(name: string, data: Float32Array, dims: number[]) {
    return {
        name,
        type: { dtype: 'float32', layout: { dimensions: Int32Array.from(dims) } },
        data: async () => data,
        delete() { deletedTensors.push(name); },
    };
}

/** A CompiledModel as LiteRT hands it back: shapes are Int32Array on `.shape`. */
function compiledModel(inDims: number[], outDims: number[]) {
    return {
        getInputDetails: () => [{ name: 'input', index: 0, dtype: 'float32', shape: Int32Array.from(inDims) }],
        getOutputDetails: () => [{ name: 'output', index: 0, dtype: 'float32', shape: Int32Array.from(outDims) }],
        run: (input: unknown) => runImpl(input),
        delete: () => deletedTensors.push('model'),
    };
}

const IN = [1, 2, 2, 3];   // 12 values
const OUT = [1, 2, 2, 2];  // 4 values

describe('LiteRtRuntime', () => {
    beforeEach(() => {
        deletedTensors.length = 0;
        webgpuSupported = true;
        loadLiteRtMock.mockClear();
        loadAndCompileMock.mockReset();
        loadAndCompileMock.mockImplementation(async () => compiledModel(IN, OUT));
        runImpl = async () => [outputTensor('out-0', Float32Array.from([1, 2, 3, 4]), OUT)];
    });

    const boot = async (backend: 'webgpu' | 'wasm' = 'webgpu') => {
        const r = new LiteRtRuntime();
        await r.init(backend);
        return r;
    };

    it('loads the wasm runtime from a directory, so LiteRT can feature-detect', async () => {
        await boot();
        expect(loadLiteRtMock).toHaveBeenCalledTimes(1);
        const url = String(loadLiteRtMock.mock.calls[0]![0]);
        // A directory, not a file: naming a file pins every visitor to one build.
        expect(url.endsWith('/wasm/litert/')).toBe(true);
    });

    it('uses WebGPU when the browser supports it', async () => {
        const r = await boot('webgpu');
        expect(r.backend).toBe('webgpu');
    });

    it('falls back to wasm when WebGPU is unsupported, rather than failing', async () => {
        webgpuSupported = false;
        const r = await boot('webgpu');
        // A paint app should give a slower cutout, not refuse to work.
        expect(r.backend).toBe('wasm');
    });

    it('honours an explicit wasm preference even where WebGPU exists', async () => {
        const r = await boot('wasm');
        expect(r.backend).toBe('wasm');
    });

    it('refuses to load before init', async () => {
        const r = new LiteRtRuntime();
        await expect(r.loadModel('m', new ArrayBuffer(8))).rejects.toThrow(/before init/);
    });

    it('compiles from raw bytes and asks for a gpu→wasm fallback chain', async () => {
        const r = await boot('webgpu');
        await r.loadModel('m', new ArrayBuffer(8));

        const [bytes, opts] = loadAndCompileMock.mock.calls[0]!;
        // Bytes, not a URL — this is what lets AiModelCache serve from OPFS.
        expect(bytes).toBeInstanceOf(Uint8Array);
        // LiteRT falls back per-op, so an unsupported op still runs on CPU.
        expect(opts).toEqual({ accelerator: ['webgpu', 'wasm'] });
    });

    it('asks only for wasm when that is the backend', async () => {
        const r = await boot('wasm');
        await r.loadModel('m', new ArrayBuffer(8));
        expect(loadAndCompileMock.mock.calls[0]![1]).toEqual({ accelerator: ['wasm'] });
    });

    it("reports the model's own shapes, converted from Int32Array", async () => {
        const r = await boot();
        const info = await r.loadModel('m', new ArrayBuffer(8));
        // Plain arrays out: an Int32Array would break `.reduce` callers and equality.
        expect(info.inputShape).toEqual(IN);
        expect(info.outputShape).toEqual(OUT);
        expect(Array.isArray(info.inputShape)).toBe(true);
    });

    it('frees the previous model when an id is reloaded', async () => {
        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));
        await r.loadModel('m', new ArrayBuffer(8));
        expect(deletedTensors).toContain('model'); // no stranded native memory
    });

    it('runs inference and returns the output data and shape', async () => {
        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));
        const out = await r.infer('m', new Float32Array(12).fill(1), IN);
        expect(Array.from(out.data)).toEqual([1, 2, 3, 4]);
        expect(out.shape).toEqual(OUT); // read off the live tensor's layout.dimensions
    });

    it('copies the output before the tensor is deleted', async () => {
        const backing = Float32Array.from([9, 9, 9, 9]);
        runImpl = async () => [outputTensor('out-0', backing, OUT)];

        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));
        const out = await r.infer('m', new Float32Array(12), IN);

        // data() returns a view onto Wasm memory that delete() invalidates, and it
        // still has a postMessage to survive. Mutating the source must not touch it.
        backing[0] = 0;
        expect(out.data[0]).toBe(9);
        expect(out.data).not.toBe(backing);
    });

    // The input tensor's exact name depends on a counter that runs across the whole
    // file, so these assert on the prefix — which is the actual claim anyway: an
    // input tensor got freed, whichever one it was.
    const freedAnInput = () => deletedTensors.some(d => d.startsWith('in-'));

    it('deletes every tensor it created', async () => {
        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));
        await r.infer('m', new Float32Array(12), IN);
        expect(freedAnInput()).toBe(true);
        expect(deletedTensors).toContain('out-0');
    });

    it('still frees tensors when the run throws', async () => {
        runImpl = async () => { throw new Error('gpu exploded'); };
        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));

        await expect(r.infer('m', new Float32Array(12), IN)).rejects.toThrow(/gpu exploded/);
        // Leaked Wasm/GPU buffers are invisible to the JS GC: a long Pinta session
        // would just run the tab out of memory with no clue why.
        expect(freedAnInput()).toBe(true);
    });

    it('rejects a mis-sized input with a sentence instead of a Wasm abort', async () => {
        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));
        await expect(r.infer('m', new Float32Array(5), IN)).rejects.toThrow(/wants 12/);
    });

    it('refuses to infer on a model that is not loaded', async () => {
        const r = await boot();
        await expect(r.infer('ghost', new Float32Array(12), IN)).rejects.toThrow(/not loaded/);
    });

    it('reports a model that returns nothing rather than crashing on undefined', async () => {
        runImpl = async () => [];
        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));
        await expect(r.infer('m', new Float32Array(12), IN)).rejects.toThrow(/no output/);
    });

    it('dispose frees the model and is safe to repeat', async () => {
        const r = await boot();
        await r.loadModel('m', new ArrayBuffer(8));
        r.dispose('m');
        r.dispose('m');       // must not throw on an already-freed id
        r.dispose('never');   // nor on one that never existed
        expect(deletedTensors.filter(d => d === 'model')).toHaveLength(1);
    });
});
