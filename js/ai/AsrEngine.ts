/**
 * ASR ENGINE
 * The speech-to-text half of the AI substrate: Whisper (base, q8) via
 * `@huggingface/transformers` running in the `asr-runtime` worker. This is what
 * replaces the Media Player's SIMULATED transcript with a real one — for local
 * files only, because a cross-origin YouTube embed's audio is unreachable by
 * design of the web platform, and we say so instead of pretending.
 *
 * Unlike Gemma (license-gated, user-imported), Whisper is Apache-2.0, so it is
 * downloaded like DeepLab is: behind a consent prompt that names the size. The
 * download itself is transformers.js's own multi-file fetch, cached by it in the
 * Cache API — the model NAME below is pinned in code and no caller can supply
 * one, so apps still cannot use this as a download primitive.
 *
 * Runs on the Wasm backend (q8) deliberately: predictable ~80 MB, works with or
 * without WebGPU. Slower than GPU — the UI shows honest progress instead.
 */

import { pipeline, env } from '@huggingface/transformers';
import type { AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';

/** Pinned model. Changing it changes what users download — treat like the registry.
 *  The onnx-community export, NOT the older Xenova one: the legacy q8 export trips
 *  onnxruntime ≥1.26's QDQ handling ("Missing required scale … DequantizeLinear"). */
export const ASR_MODEL_ID = 'onnx-community/whisper-base';

/** q4 is the ONLY quantisation this ort build accepts for whisper-base — q8 and
 *  uint8 both fail session creation with the QDQ error above (verified live).
 *  Costs more disk than q8 would (~138 MB total, the decoder is 118 MB): the
 *  price of a working model. Keep every size claim in the UI in step with this. */
export const ASR_DTYPE = 'q4';

/** Where onnxruntime's wasm loads from. In dev, Vite serves node_modules and
 *  refuses to module-import public/ files; in the build, copy-ort-wasm.ts stages
 *  them under /wasm/ort/. Never onnxruntime's default CDN. */
const ORT_WASM_BASE = import.meta.env?.DEV
    ? '/node_modules/onnxruntime-web/dist/'
    : '/wasm/ort/';

export interface IAsrChunk {
    text: string;
    /** Seconds. `end` can be null on the trailing chunk of a stream. */
    start: number;
    end: number;
}

export interface IAsrResult {
    text: string;
    chunks: IAsrChunk[];
}

export interface IAsrProgress {
    /** 'download' covers every model file transformers.js pulls; 'transcribe' is the run. */
    phase: 'download' | 'init' | 'transcribe';
    file?: string | undefined;
    loaded: number;
    total: number;
}

export type AsrProgressListener = (p: IAsrProgress) => void;

export interface IAsrEngine {
    isSupported(): boolean;
    /** Downloads (once) and initialises the pipeline. Safe to call repeatedly. */
    init(onProgress?: AsrProgressListener): Promise<void>;
    transcribe(audio: Float32Array, opts?: { language?: string }): Promise<IAsrResult>;
    dispose(): void;
    readonly ready: boolean;
}

export class TransformersAsrEngine implements IAsrEngine {
    private pipe: AutomaticSpeechRecognitionPipeline | null = null;
    private initPromise: Promise<void> | null = null;

    get ready(): boolean {
        return this.pipe !== null;
    }

    isSupported(): boolean {
        return typeof WebAssembly !== 'undefined' && typeof fetch !== 'undefined';
    }

    init(onProgress?: AsrProgressListener): Promise<void> {
        if (this.pipe) return Promise.resolve();
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            // Self-hosted ort wasm (its default is jsDelivr — reachable from a
            // URL-spawned worker because META CSP does not apply to workers at
            // all, but an external runtime dependency is still wrong; see
            // known-issues). Model files go through the browser Cache API;
            // resolution is remote-only (the HF Hub).
            const onnx = env.backends.onnx as unknown as { wasm?: { wasmPaths?: string } };
            onnx.wasm = onnx.wasm ?? {};
            onnx.wasm.wasmPaths = ORT_WASM_BASE;
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            this.pipe = await pipeline('automatic-speech-recognition', ASR_MODEL_ID, {
                dtype: ASR_DTYPE,
                device: 'wasm',
                progress_callback: (p: unknown) => {
                    const ev = p as { status?: string; file?: string; loaded?: number; total?: number; progress?: number };
                    if (ev.status === 'progress') {
                        onProgress?.({ phase: 'download', file: ev.file, loaded: ev.loaded ?? 0, total: ev.total ?? 0 });
                    } else if (ev.status === 'ready') {
                        onProgress?.({ phase: 'init', loaded: 1, total: 1 });
                    }
                },
            });
        })().catch(err => {
            this.initPromise = null; // a network failure must be retryable
            throw err;
        });
        return this.initPromise;
    }

    async transcribe(audio: Float32Array, opts: { language?: string } = {}): Promise<IAsrResult> {
        if (!this.pipe) throw new Error('asr: engine not initialised');
        const out = await this.pipe(audio, {
            // 30 s windows with 5 s stride — the documented long-form recipe.
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: true,
            ...(opts.language ? { language: opts.language } : {}),
        }) as { text: string; chunks?: Array<{ text: string; timestamp: [number, number | null] }> };

        const chunks: IAsrChunk[] = (out.chunks ?? []).map(c => ({
            text: c.text,
            start: c.timestamp?.[0] ?? 0,
            // A null end means "ran off the end of the audio" — clamp to start.
            end: c.timestamp?.[1] ?? c.timestamp?.[0] ?? 0,
        }));
        return { text: out.text ?? '', chunks };
    }

    dispose(): void {
        void this.pipe?.dispose?.();
        this.pipe = null;
        this.initPromise = null;
    }
}
