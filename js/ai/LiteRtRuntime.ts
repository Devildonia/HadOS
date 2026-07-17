/**
 * LITERT RUNTIME — the real binding (@litertjs/core)
 * The only file in HadOS that knows LiteRT exists. Everything else talks to
 * `IInferenceRuntime`, so swapping runtimes means rewriting this file and nothing
 * else.
 *
 * Runs inside the `ai-runtime` worker, never on the main thread.
 */

import {
    loadLiteRt,
    loadAndCompile,
    Tensor,
    isWebGPUSupported,
    type CompiledModel,
    type TensorDetails,
    type TensorType,
} from '@litertjs/core';
import type { Backend, IInferenceRuntime, IInferOutput, IModelInfo } from './InferenceRuntime';

/**
 * Where `scripts/copy-litert-wasm.js` puts the runtime. A DIRECTORY on purpose:
 * given a directory, loadLiteRt detects the browser's Wasm features and loads the
 * matching build (plain / threaded / JSPI / compat). Naming a file instead would
 * pin every visitor to one build.
 *
 * This is why cross-origin isolation (COOP/COEP) is not a prerequisite: without it,
 * the detection simply lands on the non-threaded build.
 */
const WASM_DIR = new URL('/wasm/litert/', self.location.origin).href;

interface Entry {
    model: CompiledModel;
    info: IModelInfo;
}

/**
 * LiteRT states a shape two different ways, and they are not interchangeable:
 * a model's `TensorDetails.shape` is an `Int32Array`, while a live tensor's
 * `type.layout.dimensions` is `Int32Array | number[]`. Both normalise to number[]
 * here — assuming one shape for both is a typecheck error, and would have been a
 * runtime one.
 */
function dimsOfDetails(details: TensorDetails | undefined): number[] {
    return details ? Array.from(details.shape) : [];
}

function dimsOfTensorType(type: TensorType | undefined): number[] {
    return type ? Array.from(type.layout.dimensions) : [];
}

export class LiteRtRuntime implements IInferenceRuntime {
    private readonly models = new Map<string, Entry>();
    private _backend: Backend | null = null;

    get backend(): Backend | null { return this._backend; }

    /**
     * `backend` is the *preference*. WebGPU is asked for only when the browser
     * actually reports support — LiteRT would otherwise fail at compile time on a
     * machine with no adapter or a blocklisted driver, and a paint app should degrade
     * to a slower cutout rather than refuse to work.
     */
    async init(backend: Backend): Promise<void> {
        /**
         * Tell emscripten where the .wasm lives before its loader runs.
         *
         * LiteRT importScripts()es the loader from WASM_DIR but sets no locateFile,
         * so emscripten falls back to resolving the .wasm against `self.location` —
         * which in a worker is the WORKER's URL (`/ai-runtime.js`), not the loader's
         * directory. It then fetched `/litert_wasm_internal.wasm`, the dev server
         * answered with index.html for the unknown path, and the failure surfaced as
         * `expected magic word 00 61 73 6d, found 3c 21 44 4f` — those bytes are
         * `<!DO`.
         *
         * `self.Module` is the package's own documented seam for this: its
         * `createWasmLib` passes it straight to the module factory.
         */
        (self as unknown as { Module?: unknown }).Module = {
            locateFile: (file: string) => WASM_DIR + file,
        };

        await loadLiteRt(WASM_DIR);
        this._backend = backend === 'webgpu' && isWebGPUSupported() ? 'webgpu' : 'wasm';
    }

    async loadModel(id: string, bytes: ArrayBuffer): Promise<IModelInfo> {
        if (!this._backend) throw new Error('LiteRtRuntime: loadModel before init');

        // Ask for the chosen accelerator, but list 'wasm' behind it: LiteRT falls back
        // per-op, so a model with one op the GPU delegate cannot handle still runs.
        const accelerator: Array<'webgpu' | 'wasm'> = this._backend === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'];

        // loadAndCompile takes the bytes directly — which is what lets AiModelCache
        // serve from OPFS with no blob: URL detour.
        const model = await loadAndCompile(new Uint8Array(bytes), { accelerator });

        const info: IModelInfo = {
            inputShape: dimsOfDetails(model.getInputDetails()[0]),
            outputShape: dimsOfDetails(model.getOutputDetails()[0]),
        };

        // Replacing an id must not strand the old model's native memory.
        this.dispose(id);
        this.models.set(id, { model, info });
        return info;
    }

    async infer(id: string, input: Float32Array, shape: number[]): Promise<IInferOutput> {
        const entry = this.models.get(id);
        if (!entry) throw new Error(`LiteRtRuntime: model '${id}' is not loaded`);

        const expected = entry.info.inputShape.reduce((a, b) => a * b, 1);
        if (expected > 0 && input.length !== expected) {
            // Catch it here, with a sentence that says what went wrong. Handing a
            // mis-sized buffer to Wasm gets a decoded C++ abort, or worse, silence.
            throw new Error(`LiteRtRuntime: input has ${input.length} values, '${id}' wants ${expected}`);
        }

        let inputTensor: Tensor | undefined;
        let outputs: Tensor[] | undefined;
        try {
            inputTensor = new Tensor(input, shape);
            outputs = await entry.model.run(inputTensor);

            const first = outputs[0];
            if (!first) throw new Error(`LiteRtRuntime: '${id}' returned no output`);

            const data = await first.data();
            const dims = dimsOfTensorType(first.type);
            return {
                // data() hands back a view onto Wasm memory that delete() invalidates,
                // and it crosses a postMessage after this. Copy before freeing.
                data: data instanceof Float32Array ? new Float32Array(data) : Float32Array.from(data),
                shape: dims.length ? dims : entry.info.outputShape,
            };
        } finally {
            // Tensors hold Wasm/GPU buffers the JS GC cannot see. Miss a delete and
            // the leak is invisible until a long Pinta session runs the tab out of
            // memory — hence the finally, so a failed run frees just the same.
            try { inputTensor?.delete(); } catch { /* already gone */ }
            for (const o of outputs ?? []) {
                try { o.delete(); } catch { /* already gone */ }
            }
        }
    }

    dispose(id: string): void {
        const entry = this.models.get(id);
        if (!entry) return;
        try { (entry.model as unknown as { delete?: () => void }).delete?.(); } catch { /* already gone */ }
        this.models.delete(id);
    }
}
