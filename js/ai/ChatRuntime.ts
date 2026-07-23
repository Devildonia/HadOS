/**
 * CHAT RUNTIME
 * The LLM half of the AI substrate: MediaPipe LLM Inference (`@mediapipe/tasks-genai`,
 * the LiteRT-LM family) running a user-imported Gemma bundle. Lives in the
 * `ai-runtime` worker next to LiteRT — same process, same watchdog, same cache.
 *
 * WebGPU is a hard requirement, not a preference: LLM inference on the Wasm CPU
 * path is minutes-per-reply, which is indistinguishable from broken. When there is
 * no `navigator.gpu` we say so instead of pretending to work (the same honesty rule
 * the v1.0.6 audit imposed on the fake AI theatre this replaces).
 */

import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

/** Copied from node_modules by scripts/copy-genai-wasm.ts. */
const GENAI_WASM_BASE = '/wasm/genai';

/** Cumulative token budget (prompt + reply). Gemma 1B handles 1280 comfortably. */
const MAX_TOKENS = 1280;

export type ChatPartialListener = (delta: string, done: boolean) => void;

export interface IChatRuntime {
    /** True when this environment can run the stack at all (WebGPU present). */
    isSupported(): boolean;
    /** Compiles a model from bytes. Replaces any previously loaded model. */
    loadModel(id: string, bytes: ArrayBuffer): Promise<void>;
    /** Generates a reply for a fully-templated prompt, streaming deltas. */
    generate(prompt: string, onPartial?: ChatPartialListener): Promise<string>;
    /** Frees the compiled model. */
    dispose(): void;
    readonly loadedId: string | null;
}

export class GenAiRuntime implements IChatRuntime {
    private llm: LlmInference | null = null;
    private _loadedId: string | null = null;
    /** MediaPipe allows ONE generateResponse at a time — serialize behind this. */
    private generating: Promise<unknown> = Promise.resolve();

    get loadedId(): string | null {
        return this._loadedId;
    }

    isSupported(): boolean {
        return typeof navigator !== 'undefined' && 'gpu' in navigator;
    }

    async loadModel(id: string, bytes: ArrayBuffer): Promise<void> {
        if (!this.isSupported()) {
            throw new Error('chat: WebGPU is required for on-device chat and this browser does not expose it');
        }
        if (this._loadedId === id && this.llm) return;

        // One model at a time: a second Gemma would double GPU memory for nothing.
        this.dispose();

        const fileset = await FilesetResolver.forGenAiTasks(GENAI_WASM_BASE);
        this.llm = await LlmInference.createFromOptions(fileset, {
            baseOptions: { modelAssetBuffer: new Uint8Array(bytes) },
            maxTokens: MAX_TOKENS,
            topK: 40,
            temperature: 0.8,
        });
        this._loadedId = id;
    }

    generate(prompt: string, onPartial?: ChatPartialListener): Promise<string> {
        const llm = this.llm;
        if (!llm) return Promise.reject(new Error('chat: no model loaded'));

        // Chain instead of rejecting: two apps asking at once should queue, and a
        // failed run must not wedge the chain for the next caller.
        const run = this.generating.catch(() => { /* previous failure is not ours */ }).then(() =>
            llm.generateResponse(prompt, (delta: string, done: boolean) => {
                try { onPartial?.(delta, done); } catch { /* a bad listener must not kill the reply */ }
            }));
        this.generating = run;
        return run;
    }

    dispose(): void {
        try { this.llm?.close(); } catch { /* double-close is fine */ }
        this.llm = null;
        this._loadedId = null;
    }
}
