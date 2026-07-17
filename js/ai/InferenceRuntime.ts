/**
 * INFERENCE RUNTIME — the seam
 * The single place LiteRT is allowed to exist behind. Everything else in the AI
 * stack (cache, syscalls, capability, facade, the Pinta feature) is written against
 * this interface, so the substrate is buildable and testable without a GPU, a model
 * download, or LiteRT itself — and so a future runtime swap touches one file.
 *
 * The shape mirrors what LiteRT.js actually offers (verified against
 * @litertjs/core@2.5.2's type definitions):
 *   loadLiteRt(wasmDir)                      → init()
 *   loadAndCompile(Uint8Array, {accelerator}) → loadModel()   ← bytes, not a URL:
 *                                               that is what lets the OPFS cache work
 *   model.run(new Tensor(data, shape))        → infer()
 *   tensor.delete() / model.delete()          → dispose()
 */

/** The accelerators HadOS asks for. LiteRT also has 'webnn'; not used yet. */
export type Backend = 'webgpu' | 'wasm';

export interface IInferOutput {
    data: Float32Array;
    shape: number[];
}

export interface IModelInfo {
    /** Input tensor shape as the model itself reports it, e.g. [1, 257, 257, 3]. */
    inputShape: number[];
    outputShape: number[];
}

export interface IInferenceRuntime {
    /** Prepares the runtime. Called once per process, before any loadModel. */
    init(backend: Backend): Promise<void>;
    /** Compiles a model from its raw bytes and keeps it under `id`. */
    loadModel(id: string, bytes: ArrayBuffer): Promise<IModelInfo>;
    infer(id: string, input: Float32Array, shape: number[]): Promise<IInferOutput>;
    /** Frees a model's native memory. */
    dispose(id: string): void;
    /** Which accelerator init() actually settled on — WebGPU is not everywhere. */
    readonly backend: Backend | null;
}

/**
 * A runtime that computes nothing, for tests and for proving the plumbing.
 *
 * It is deliberately not a silent stub: it enforces the same contract the real
 * runtime does (init before load, load before infer, input size must match the
 * declared shape), so a test that passes here has exercised a real protocol rather
 * than a permissive mock. The output is a deterministic function of the input, so
 * assertions can check that data actually made the round trip.
 */
export class FakeInferenceRuntime implements IInferenceRuntime {
    private initialised = false;
    private readonly models = new Map<string, IModelInfo>();
    private _backend: Backend | null = null;

    /** Test knobs: force a failure at each stage. Mutable, so a test can exercise
     *  a recovery path without stubbing out the methods that hold the contract. */
    constructor(private readonly opts: {
        failInit?: boolean;
        failLoad?: boolean;
        failInfer?: boolean;
        /** Shape reported by loadModel; also the shape infer() demands. */
        inputShape?: number[];
        outputShape?: number[];
        /** Resolves only when released — lets a test hold a load open. */
        gate?: Promise<void>;
    } = {}) {}

    /** Stops failing, standing in for the transient fault clearing. */
    recover(): void {
        this.opts.failInit = false;
        this.opts.failLoad = false;
        this.opts.failInfer = false;
    }

    get backend(): Backend | null { return this._backend; }
    get loadedCount(): number { return this.models.size; }
    isLoaded(id: string): boolean { return this.models.has(id); }

    async init(backend: Backend): Promise<void> {
        if (this.opts.failInit) throw new Error('fake runtime: init failed');
        this._backend = backend;
        this.initialised = true;
    }

    async loadModel(id: string, bytes: ArrayBuffer): Promise<IModelInfo> {
        if (!this.initialised) throw new Error('fake runtime: loadModel before init');
        if (this.opts.failLoad) throw new Error('fake runtime: load failed');
        if (bytes.byteLength === 0) throw new Error('fake runtime: empty model bytes');
        if (this.opts.gate) await this.opts.gate;
        const info: IModelInfo = {
            inputShape: this.opts.inputShape ?? [1, 2, 2, 3],
            outputShape: this.opts.outputShape ?? [1, 2, 2, 2],
        };
        this.models.set(id, info);
        return info;
    }

    async infer(id: string, input: Float32Array, shape: number[]): Promise<IInferOutput> {
        const info = this.models.get(id);
        if (!info) throw new Error(`fake runtime: model '${id}' is not loaded`);
        if (this.opts.failInfer) throw new Error('fake runtime: infer failed');

        const expected = info.inputShape.reduce((a, b) => a * b, 1);
        if (input.length !== expected) {
            throw new Error(`fake runtime: input has ${input.length} values, model wants ${expected}`);
        }
        if (shape.length !== info.inputShape.length) {
            throw new Error(`fake runtime: input rank ${shape.length}, model wants ${info.inputShape.length}`);
        }

        // Deterministic and input-dependent, so a test can prove the bytes travelled.
        const outLen = info.outputShape.reduce((a, b) => a * b, 1);
        const data = new Float32Array(outLen);
        for (let i = 0; i < outLen; i++) data[i] = (input[i % input.length] ?? 0) * 2;
        return { data, shape: info.outputShape };
    }

    dispose(id: string): void {
        this.models.delete(id);
    }
}
