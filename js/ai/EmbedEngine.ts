/**
 * EMBEDDING ENGINE
 * Sentence embeddings via transformers.js — the third leg of the AI substrate,
 * living in the SAME asr-runtime worker as Whisper (one transformers stack, one
 * process). Powers the Doc Explorer's real semantic search: 384-dim MiniLM
 * vectors, mean-pooled and L2-normalised, so cosine similarity is a dot product.
 *
 * Verified live (same discipline as Whisper's dtype hunt): q8 MiniLM creates a
 * session and embeds on this ort build — no QDQ trouble here — at ~23 MB total.
 */

import { pipeline, env, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { getAssetUrl } from '../utils/url.js';

export const EMBED_MODEL_ID = 'Xenova/all-MiniLM-L6-v2';
export const EMBED_DIM = 384;

/** Same dev/build split as AsrEngine — see the comment there. */
const ORT_WASM_BASE = getAssetUrl(import.meta.env?.DEV
    ? '/node_modules/onnxruntime-web/dist/'
    : '/wasm/ort/');

export interface IEmbedProgress {
    phase: 'download' | 'init' | 'embed';
    file?: string | undefined;
    loaded: number;
    total: number;
}

export type EmbedProgressListener = (p: IEmbedProgress) => void;

export interface IEmbedResult {
    /** Row-major [n × dim], each row L2-normalised. */
    vectors: Float32Array;
    dims: [number, number];
}

export interface IEmbedEngine {
    isSupported(): boolean;
    init(onProgress?: EmbedProgressListener): Promise<void>;
    embed(texts: string[]): Promise<IEmbedResult>;
    dispose(): void;
    readonly ready: boolean;
}

export class TransformersEmbedEngine implements IEmbedEngine {
    private pipe: FeatureExtractionPipeline | null = null;
    private initPromise: Promise<void> | null = null;

    get ready(): boolean {
        return this.pipe !== null;
    }

    isSupported(): boolean {
        return typeof WebAssembly !== 'undefined' && typeof fetch !== 'undefined';
    }

    init(onProgress?: EmbedProgressListener): Promise<void> {
        if (this.pipe) return Promise.resolve();
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            const onnx = env.backends.onnx as unknown as { wasm?: { wasmPaths?: string } };
            onnx.wasm = onnx.wasm ?? {};
            onnx.wasm.wasmPaths = ORT_WASM_BASE;
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            this.pipe = await pipeline('feature-extraction', EMBED_MODEL_ID, {
                dtype: 'q8',
                device: 'wasm',
                progress_callback: (p: unknown) => {
                    const ev = p as { status?: string; file?: string; loaded?: number; total?: number };
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

    async embed(texts: string[]): Promise<IEmbedResult> {
        if (!this.pipe) throw new Error('embed: engine not initialised');
        const out = await this.pipe(texts, { pooling: 'mean', normalize: true });
        const dims = out.dims as number[];
        const n = dims[0] ?? texts.length;
        const dim = dims[1] ?? EMBED_DIM;
        // Detach from the runtime tensor so it can be freed/transferred.
        const vectors = Float32Array.from(out.data as Float32Array);
        return { vectors, dims: [n, dim] };
    }

    dispose(): void {
        void this.pipe?.dispose?.();
        this.pipe = null;
        this.initPromise = null;
    }
}
