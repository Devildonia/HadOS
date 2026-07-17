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
import { AI_REQUESTS, AI_EVENTS, type ILoadResult } from './aiRuntimeHandlers';
import { getModelForTask } from './models';
import { imageDataToTensor, subjectMask, maskCoverage, inputSizeFor } from './segmentation';
import type { IInferOutput } from './InferenceRuntime';

/** The capability every ai.* call is gated on. */
export const AI_CAPABILITY = 'ai:infer';

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
    const worker = new Worker(RUNTIME_URL);
    const { pid, worker: proc } = Kernel.spawnWorker(RUNTIME_APP_ID, workerTransportFromWorker(worker));
    return { pid, worker: proc };
}

export const AiService = (() => {
    let spawner: Spawner = defaultSpawner;
    let handle: { pid: number; worker: WorkerProcess } | null = null;
    const listeners = new Set<ProgressListener>();

    /** True when this browser can run the stack at all. */
    function isSupported(): boolean {
        return typeof Worker !== 'undefined';
    }

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
        return handle.worker;
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
    async function loadModel(appId: string, id: string): Promise<ILoadResult> {
        await requireConsent(appId);
        const p = await proc();
        await p.ready;
        return await p.request(AI_REQUESTS.LOAD, { id }, LOAD_TIMEOUT_MS) as ILoadResult;
    }

    async function infer(appId: string, id: string, input: Float32Array, shape: number[]): Promise<IInferOutput> {
        await requireConsent(appId);
        const p = await proc();
        await p.ready;
        const out = await p.request(AI_REQUESTS.INFER, { id, input, shape }, INFER_TIMEOUT_MS) as IInferOutput;
        // structuredClone hands back a Float32Array; a JSON-ish transport would not.
        return { data: out.data instanceof Float32Array ? out.data : Float32Array.from(out.data ?? []), shape: out.shape };
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
        spawner = fn ?? defaultSpawner;
    }

    return { isSupported, loadModel, infer, segment, dispose, info, onProgress, shutdown, __setSpawner };
})();
