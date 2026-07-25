/**
 * AI SERVICE (host facade)
 * The one entry point host apps use for on-device inference. It owns the lifetime
 * of the single `ai-runtime` Kernel process, gates every call on the `ai:infer`
 * capability, and forwards the work. Host apps never touch the worker directly.
 *
 * Isolated apps do not use this class — they issue `ai.*` syscalls, which the
 * SyscallBroker routes here. Both paths therefore land on the same consent check
 * and the same process.
 */

import { Kernel } from '../core/Kernel';
import { PermissionBroker } from '../core/PermissionBroker';
import { workerTransportFromWorker, type WorkerProcess } from '../core/WorkerProcess';
import { Utils } from '../utils';
import { getAssetUrl, withWorkerBase } from '../utils/url';
import { AI_REQUESTS, AI_EVENTS, type ILoadResult } from './aiRuntimeHandlers';
import { CHAT_REQUESTS, CHAT_EVENTS, type IChatTokenEvent } from './chatHandlers';
import { ASR_REQUESTS, ASR_EVENTS } from './asrHandlers';
import type { IAsrResult, IAsrProgress } from './AsrEngine';
import { EMBED_REQUESTS, EMBED_EVENTS } from './embedHandlers';
import type { IEmbedResult, IEmbedProgress } from './EmbedEngine';
import { AiModelCache } from './AiModelCache';
import {
    getModelForTask, getDefaultChatModel, listChatModels, registerChatModel,
    removeChatModel as unregisterChatModel, type IChatModelMeta,
} from './models';
import { buildGemmaPrompt, type IChatTurn } from './chatPrompt';
import { imageDataToTensor, subjectMask, maskCoverage, inputSizeFor } from './segmentation';
import type { IInferOutput } from './InferenceRuntime';

/** The capability every ai.* call is gated on. */
export const AI_CAPABILITY = 'ai:infer';

/** The capability chat generation is gated on — separate from `ai:infer` because
 *  the honest consent text differs: this one runs a user-imported LLM. */
export const CHAT_CAPABILITY = 'ai:chat';

/** The capability transcription is gated on — its consent text names the ~140 MB
 *  one-time Whisper download, which neither of the others involves. */
export const TRANSCRIBE_CAPABILITY = 'ai:transcribe';

/** The capability semantic indexing is gated on (~25 MB MiniLM download). */
export const EMBED_CAPABILITY = 'ai:embed';

/** The app id the ai-runtime process itself runs under. */
const RUNTIME_APP_ID = 'ai-runtime';

/**
 * A first load downloads a model (megabytes) and compiles it (seconds of Wasm/GPU
 * work). The IPC default of 10s would abort a perfectly healthy cold start on a slow
 * connection, so loads get their own budget. Inference is bounded far tighter: past
 * this the model is wedged and the watchdog should have it.
 */
const LOAD_TIMEOUT_MS = 180_000;
const INFER_TIMEOUT_MS = 60_000;
/** An LLM reply streams for a while; the prefill alone can take many seconds. */
const CHAT_TIMEOUT_MS = 180_000;

/** Whisper-base on the Wasm backend chews long audio slowly — a 10-minute video
 *  can legitimately take several minutes. The watchdog still covers a real hang. */
const TRANSCRIBE_TIMEOUT_MS = 900_000;

/** A chat model under this size cannot be a real LLM bundle — reject junk early. */
const MIN_CHAT_MODEL_BYTES = 1024 * 1024;

/**
 * Idle eviction (audit v1.0.8, M1): a loaded Gemma is ~550 MB of GPU memory and
 * Whisper ~140 MB of wasm heap — leaving them resident for the whole session
 * turns "on-device by default" into an OOM generator on modest hardware. A
 * runtime with no in-flight work and no use for IDLE_EVICT_MS gets its process
 * shut down; the model BYTES stay cached (OPFS / Cache API), so the next use
 * pays a recompile, not a redownload.
 */
const IDLE_EVICT_MS = 10 * 60_000;
const IDLE_SWEEP_MS = 60_000;

export interface IProgress {
    id: string;
    loaded: number;
    total: number;
    phase: 'download' | 'compile';
}

export type ProgressListener = (p: IProgress) => void;

export interface ISegmentResult {
    /** One byte per pixel at the model's resolution: 1 = subject, 0 = background. */
    mask: Uint8Array;
    /** Side length of that square mask. */
    size: number;
    /** Fraction of the frame the subject covers, 0..1. */
    coverage: number;
}

/** Builds the process. Swapped in tests, where jsdom has no Worker. */
export type Spawner = () => { pid: number; worker: WorkerProcess };

/** Where vite.ai-worker.config.js emits the prebuilt classic worker. */
const RUNTIME_URL = '/ai-runtime.js';

function defaultSpawner(): { pid: number; worker: WorkerProcess } {
    // A CLASSIC worker from a prebuilt file, unlike every other process in HadOS,
    // which spawn `new Worker(new URL(...), {type:'module'})`. LiteRT's loader calls
    // importScripts(), which a module worker defines but refuses to run — see
    // vite.ai-worker.config.js for the full reasoning.
    // Root-absolute in source, resolved against the app base here: Vite rewrites
    // paths it can see in index.html, but not one built in code (see utils/url.ts).
    const worker = new Worker(withWorkerBase(getAssetUrl(RUNTIME_URL)));
    const { pid, worker: proc } = Kernel.spawnWorker(RUNTIME_APP_ID, workerTransportFromWorker(worker));
    return { pid, worker: proc };
}

/** The app id the asr-runtime process runs under. */
const ASR_APP_ID = 'asr-runtime';

function defaultAsrSpawner(): { pid: number; worker: WorkerProcess } {
    // A NORMAL module worker, unlike ai-runtime: transformers.js/onnxruntime use
    // dynamic import(), which classic workers refuse, and nothing here needs
    // LiteRT's importScripts() path.
    // `new Worker(new URL('...', import.meta.url))` MUST stay as one expression:
    // Vite detects the whole shape. Split it — even just to hand the URL through a
    // helper — and Vite stops seeing a worker, treats the `.ts` as a plain asset and
    // inlines it as `data:video/mp2t;base64,…` (the extension guessed as MPEG
    // transport stream). It builds clean and fails at runtime. So this one does NOT
    // get `withWorkerBase()`; it relies on getAssetUrl's fallback, which resolves a
    // worker sitting in Vite's `assets/` directory back to the app base.
    const worker = new Worker(new URL('../workers/asr.worker.ts', import.meta.url), { type: 'module' });
    const { pid, worker: proc } = Kernel.spawnWorker(ASR_APP_ID, workerTransportFromWorker(worker));
    return { pid, worker: proc };
}

export const AiService = (() => {
    let spawner: Spawner = defaultSpawner;
    let handle: { pid: number; worker: WorkerProcess } | null = null;
    let asrSpawner: Spawner = defaultAsrSpawner;
    let asrHandle: { pid: number; worker: WorkerProcess } | null = null;
    const listeners = new Set<ProgressListener>();
    /** Live per-request ASR progress callbacks, routed by requestId. */
    const asrProgressSinks = new Map<string, (p: IAsrProgress) => void>();
    /** Live per-request embedding progress callbacks, routed by requestId. */
    const embedProgressSinks = new Map<string, (p: IEmbedProgress) => void>();

    // ── Idle eviction bookkeeping (audit v1.0.8, M1) ──────────────────────────
    let idleEvictMs = IDLE_EVICT_MS;
    let idleSweepMs = IDLE_SWEEP_MS;
    let lastAiUse = 0;
    let lastAsrUse = 0;
    let aiInFlight = 0;
    let asrInFlight = 0;
    let idleTimer: ReturnType<typeof setInterval> | null = null;

    function sweepIdle(): void {
        const now = Date.now();
        // Never evict under an in-flight request — a mid-generation kill would
        // surface as a random failure the user did nothing to cause.
        if (handle && !handle.worker.isTerminated && aiInFlight === 0 && now - lastAiUse > idleEvictMs) {
            Utils.Logger.log('[AiService] ai-runtime idle — evicting the loaded model(s); bytes stay cached.');
            shutdown();
        }
        if (asrHandle && !asrHandle.worker.isTerminated && asrInFlight === 0 && now - lastAsrUse > idleEvictMs) {
            Utils.Logger.log('[AiService] asr-runtime idle — evicting; model bytes stay cached.');
            shutdownAsr();
        }
        if (!handle && !asrHandle && idleTimer !== null) {
            clearInterval(idleTimer);
            idleTimer = null;
        }
    }

    function ensureIdleSweep(): void {
        if (idleTimer === null) idleTimer = setInterval(sweepIdle, idleSweepMs);
    }

    /** Wraps a runtime call in the in-flight/last-use bookkeeping. */
    async function trackAi<T>(work: () => Promise<T>): Promise<T> {
        aiInFlight++;
        ensureIdleSweep();
        try {
            return await work();
        } finally {
            aiInFlight--;
            lastAiUse = Date.now();
        }
    }

    async function trackAsr<T>(work: () => Promise<T>): Promise<T> {
        asrInFlight++;
        ensureIdleSweep();
        try {
            return await work();
        } finally {
            asrInFlight--;
            lastAsrUse = Date.now();
        }
    }

    /** True when this browser can run the stack at all. */
    function isSupported(): boolean {
        return typeof Worker !== 'undefined';
    }

    /** Live streaming callbacks, routed by requestId. */
    const tokenSinks = new Map<string, (delta: string, done: boolean) => void>();

    function proc(): WorkerProcess {
        if (handle && !handle.worker.isTerminated) return handle.worker;

        // A terminated runtime (watchdog kill, crash) must not poison the service:
        // drop the handle and spawn a fresh one on the next call.
        handle = spawner();
        handle.worker.onRequest(AI_EVENTS.PROGRESS, (payload) => {
            const p = payload as IProgress;
            for (const l of listeners) {
                try { l(p); } catch { /* a bad listener must not fail the inference */ }
            }
            return true;
        });
        handle.worker.onRequest(CHAT_EVENTS.TOKEN, (payload) => {
            const ev = payload as IChatTokenEvent;
            const sink = tokenSinks.get(ev.requestId);
            if (sink) {
                try { sink(ev.delta, ev.done); } catch { /* a bad listener must not kill the reply */ }
            }
            return true;
        });
        return handle.worker;
    }

    function asrProc(): WorkerProcess {
        if (asrHandle && !asrHandle.worker.isTerminated) return asrHandle.worker;
        asrHandle = asrSpawner();
        asrHandle.worker.onRequest(ASR_EVENTS.PROGRESS, (payload) => {
            const ev = payload as IAsrProgress & { requestId: string };
            const sink = asrProgressSinks.get(ev.requestId);
            if (sink) {
                try { sink(ev); } catch { /* a bad listener must not fail the run */ }
            }
            return true;
        });
        asrHandle.worker.onRequest(EMBED_EVENTS.PROGRESS, (payload) => {
            const ev = payload as IEmbedProgress & { requestId: string };
            const sink = embedProgressSinks.get(ev.requestId);
            if (sink) {
                try { sink(ev); } catch { /* a bad listener must not fail the run */ }
            }
            return true;
        });
        return asrHandle.worker;
    }

    async function requireConsent(appId: string): Promise<void> {
        if (!(await PermissionBroker.check(appId, AI_CAPABILITY))) {
            throw new Error(`permission denied: ${AI_CAPABILITY}`);
        }
    }

    /** Subscribe to download/compile progress. Returns an unsubscribe. */
    function onProgress(listener: ProgressListener): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    /** Downloads (once), caches and compiles a registered model. */
    function loadModel(appId: string, id: string): Promise<ILoadResult> {
        return trackAi(async () => {
            await requireConsent(appId);
            const p = await proc();
            await p.ready;
            return await p.request(AI_REQUESTS.LOAD, { id }, LOAD_TIMEOUT_MS) as ILoadResult;
        });
    }

    function infer(appId: string, id: string, input: Float32Array, shape: number[]): Promise<IInferOutput> {
        return trackAi(async () => {
            await requireConsent(appId);
            const p = await proc();
            await p.ready;
            const out = await p.request(AI_REQUESTS.INFER, { id, input, shape }, INFER_TIMEOUT_MS) as IInferOutput;
            // structuredClone hands back a Float32Array; a JSON-ish transport would not.
            return { data: out.data instanceof Float32Array ? out.data : Float32Array.from(out.data ?? []), shape: out.shape };
        });
    }

    /**
     * Segments an image into subject and background — the one call a host app needs
     * for "remove background". Returns a mask at the MODEL's resolution (1 = subject),
     * not the image's: upscaling it is the caller's business, because only the caller
     * knows whether it wants the pixels, an outline, or a selection.
     */
    async function segment(appId: string, img: ImageData): Promise<ISegmentResult> {
        const model = getModelForTask('segmentation');
        if (!model) throw new Error('ai: no segmentation model is registered');

        // Consent, download, cache and compile all happen in here, once.
        const loaded = await loadModel(appId, model.id);

        // The compiled graph is the authority on its own shape; the registry only
        // records what we believe we pinned.
        const size = inputSizeFor(model, loaded.inputShape);
        const out = await infer(appId, model.id, imageDataToTensor(img, size), [1, size, size, 3]);

        const classes = out.shape[3] ?? model.classes;
        const mask = subjectMask(out.data, size, classes, model.backgroundClass);
        return { mask, size, coverage: maskCoverage(mask) };
    }

    async function dispose(appId: string, id: string): Promise<void> {
        if (!handle || handle.worker.isTerminated) return;
        await requireConsent(appId);
        await handle.worker.request(AI_REQUESTS.DISPOSE, { id });
    }

    // ── Transcription (Whisper via transformers.js, asr-runtime process) ──────

    /** True when this browser can decode audio and run the Wasm speech model. */
    function transcribeSupported(): boolean {
        return isSupported()
            && typeof WebAssembly !== 'undefined'
            && typeof OfflineAudioContext !== 'undefined';
    }

    /**
     * Transcribes 16 kHz mono samples (see `audioDecode.ts`) on-device. First use
     * downloads Whisper (~80 MB, cached by the browser); consent names that.
     * Progress (download files, then the run itself) streams to `onProgress`.
     */
    function transcribe(
        appId: string,
        audio: Float32Array,
        opts: { language?: string } = {},
        onProgress?: (p: IAsrProgress) => void,
    ): Promise<IAsrResult> {
        return trackAsr(async () => {
            if (!(await PermissionBroker.check(appId, TRANSCRIBE_CAPABILITY))) {
                throw new Error(`permission denied: ${TRANSCRIBE_CAPABILITY}`);
            }
            const p = asrProc();
            await p.ready;

            const requestId = `asr-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
            if (onProgress) asrProgressSinks.set(requestId, onProgress);
            try {
                const out = await p.request(
                    ASR_REQUESTS.TRANSCRIBE,
                    { requestId, audio, language: opts.language },
                    TRANSCRIBE_TIMEOUT_MS,
                ) as IAsrResult & { requestId: string };
                return { text: out.text, chunks: out.chunks };
            } finally {
                asrProgressSinks.delete(requestId);
            }
        });
    }

    /** True when this browser can run the embedding model (Wasm suffices). */
    function embedSupported(): boolean {
        return isSupported() && typeof WebAssembly !== 'undefined';
    }

    /**
     * Embeds texts into L2-normalised MiniLM vectors ([n × 384], row-major).
     * First use downloads the model (~25 MB, cached); consent names that.
     */
    function embed(
        appId: string,
        texts: string[],
        onProgress?: (p: IEmbedProgress) => void,
    ): Promise<IEmbedResult> {
        return trackAsr(async () => {
            if (!(await PermissionBroker.check(appId, EMBED_CAPABILITY))) {
                throw new Error(`permission denied: ${EMBED_CAPABILITY}`);
            }
            const p = asrProc();
            await p.ready;

            const requestId = `emb-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
            if (onProgress) embedProgressSinks.set(requestId, onProgress);
            try {
                const out = await p.request(
                    EMBED_REQUESTS.EMBED,
                    { requestId, texts },
                    LOAD_TIMEOUT_MS,
                ) as IEmbedResult & { requestId: string };
                // structuredClone preserves Float32Array; a JSON-ish transport would not.
                const vectors = out.vectors instanceof Float32Array ? out.vectors : Float32Array.from(out.vectors ?? []);
                return { vectors, dims: out.dims };
            } finally {
                embedProgressSinks.delete(requestId);
            }
        });
    }

    /** Stops the asr-runtime process (frees the pipeline and its memory). */
    function shutdownAsr(): void {
        if (asrHandle) {
            Utils.Logger.log(`[AiService] stopping asr-runtime (pid ${asrHandle.pid})`);
            Kernel.kill(asrHandle.pid);
            asrHandle = null;
        }
    }

    /** Test seam: inject an asr spawner and drop any live process. */
    function __setAsrSpawner(fn: Spawner | null): void {
        asrHandle = null;
        asrProgressSinks.clear();
        embedProgressSinks.clear();
        asrSpawner = fn ?? defaultAsrSpawner;
        asrInFlight = 0;
        lastAsrUse = 0;
        if (idleTimer !== null) { clearInterval(idleTimer); idleTimer = null; }
    }

    // ── Chat (MediaPipe LLM Inference over a user-imported Gemma bundle) ──────

    /** True when a chat model has been imported and this browser can run it. */
    function chatSupported(): boolean {
        return isSupported() && typeof navigator !== 'undefined' && 'gpu' in navigator;
    }

    function chatModel(): IChatModelMeta | null {
        return getDefaultChatModel();
    }

    /**
     * Imports a user-picked model file: hash it, store the bytes in the model
     * cache (OPFS), and register the metadata. No consent gate — the file picker
     * IS the user's explicit action; generation is what gets gated.
     */
    async function importChatModel(file: File, onProgress?: (phase: 'read' | 'store', pct: number) => void): Promise<IChatModelMeta> {
        const name = file.name || 'model.task';
        if (!/\.(task|litertlm|bin)$/i.test(name)) {
            throw new Error('chat: expected a .task or .litertlm model bundle');
        }
        if (file.size < MIN_CHAT_MODEL_BYTES) {
            throw new Error(`chat: '${name}' is too small to be an LLM bundle (${file.size} bytes)`);
        }

        onProgress?.('read', 0);
        const data = await file.arrayBuffer();
        onProgress?.('read', 1);

        let sha256: string | null = null;
        try {
            const subtle = (globalThis.crypto as Crypto | undefined)?.subtle;
            if (subtle) {
                const digest = await subtle.digest('SHA-256', data);
                sha256 = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
            }
        } catch { /* insecure context — the size check still stands */ }

        // The hash IS the identity: re-importing the same file lands on the same
        // cache entry instead of storing 550 MB twice.
        const id = sha256 ? `chat-${sha256.slice(0, 16)}` : `chat-${Date.now().toString(36)}`;

        onProgress?.('store', 0);
        await AiModelCache.put(id, data);
        onProgress?.('store', 1);

        const meta: IChatModelMeta = { id, label: name, bytes: data.byteLength, sha256, task: 'chat', importedAt: Date.now() };
        registerChatModel(meta);
        Utils.Logger.log(`[AiService] chat model imported: ${name} (${(data.byteLength / 1048576).toFixed(0)} MB) as ${id}`);
        return meta;
    }

    /** Deletes an imported chat model: bytes from the cache, meta from the registry. */
    async function deleteChatModel(id: string): Promise<void> {
        await AiModelCache.evict(id);
        unregisterChatModel(id);
    }

    /**
     * Generates a persona-conditioned reply on-device, streaming deltas to
     * `onToken`. Resolves with the full reply text.
     */
    function chat(
        appId: string,
        opts: { persona: string; history: IChatTurn[] },
        onToken?: (delta: string, done: boolean) => void,
    ): Promise<string> {
        return trackAi(async () => {
            if (!(await PermissionBroker.check(appId, CHAT_CAPABILITY))) {
                throw new Error(`permission denied: ${CHAT_CAPABILITY}`);
            }
            const model = chatModel();
            if (!model) throw new Error('chat: no model imported — import a Gemma .task bundle first');

            const p = proc();
            await p.ready;
            await p.request(CHAT_REQUESTS.LOAD, { id: model.id, bytes: model.bytes, sha256: model.sha256 }, LOAD_TIMEOUT_MS);

            const requestId = `chat-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
            if (onToken) tokenSinks.set(requestId, onToken);
            try {
                const prompt = buildGemmaPrompt(opts.persona, opts.history);
                const out = await p.request(CHAT_REQUESTS.GENERATE, { requestId, prompt }, CHAT_TIMEOUT_MS) as { text: string };
                return out.text;
            } finally {
                tokenSinks.delete(requestId);
            }
        });
    }

    /** Which accelerator the runtime settled on, and what it is holding. */
    async function info(): Promise<{ backend: string | null; loaded: string[] } | null> {
        if (!handle || handle.worker.isTerminated) return null;
        return await handle.worker.request(AI_REQUESTS.INFO) as { backend: string | null; loaded: string[] };
    }

    /** Stops the runtime process and frees its models. */
    function shutdown(): void {
        if (handle) {
            Utils.Logger.log(`[AiService] stopping ai-runtime (pid ${handle.pid})`);
            Kernel.kill(handle.pid);
            handle = null;
        }
    }

    /** Test seam: inject a spawner and drop any live process. */
    function __setSpawner(fn: Spawner | null): void {
        handle = null;
        listeners.clear();
        tokenSinks.clear();
        spawner = fn ?? defaultSpawner;
        aiInFlight = 0;
        lastAiUse = 0;
        if (idleTimer !== null) { clearInterval(idleTimer); idleTimer = null; }
    }

    /** Test seam: shrink the idle-eviction clock so tests need not wait minutes. */
    function __setIdleConfig(evictMs: number | null, sweepMs: number | null): void {
        idleEvictMs = evictMs ?? IDLE_EVICT_MS;
        idleSweepMs = sweepMs ?? IDLE_SWEEP_MS;
        if (idleTimer !== null) { clearInterval(idleTimer); idleTimer = null; }
    }

    return {
        isSupported, loadModel, infer, segment, dispose, info, onProgress, shutdown, __setSpawner,
        chat, chatSupported, chatModel, listChatModels, importChatModel, deleteChatModel,
        transcribe, transcribeSupported, shutdownAsr, __setAsrSpawner,
        embed, embedSupported, __setIdleConfig,
    };
})();
