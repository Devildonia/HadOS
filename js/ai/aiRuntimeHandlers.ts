/**
 * AI-RUNTIME HANDLERS (guest side, transport-free)
 * The behaviour of the `ai-runtime` process, kept out of `workers/ai.worker.ts` so
 * it can be tested in jsdom — which has no Worker — exactly as ComputeDemo keeps its
 * spawner thin. The worker file is a shell that wires these to a real transport and
 * the real LiteRT runtime.
 *
 * The process owns the model bytes end to end: it resolves an id against the
 * registry, pulls it through AiModelCache (OPFS), and hands it to the runtime. The
 * main thread never sees a model, so a 2.65 MB download and a multi-second compile
 * never touch the desktop's frame budget.
 */

import { AiModelCache } from './AiModelCache';
import { getModel } from './models';
import type { IInferenceRuntime, IInferOutput, Backend } from './InferenceRuntime';

/** What the host may ask the ai-runtime process to do. */
export const AI_REQUESTS = {
    LOAD: 'ai:load',
    INFER: 'ai:infer',
    DISPOSE: 'ai:dispose',
    INFO: 'ai:info',
} as const;

/** What the process reports back to the host, unprompted. */
export const AI_EVENTS = {
    /** Download/compile progress for a model — drives the UI's "working" state. */
    PROGRESS: 'ai:progress',
} as const;

export interface ILoadResult {
    id: string;
    inputShape: number[];
    outputShape: number[];
    backend: Backend | null;
}

/** Emits progress to the host. Failure to report must never fail the work. */
export type ProgressReporter = (ev: { id: string; loaded: number; total: number; phase: 'download' | 'compile' }) => void;

type Args = Record<string, unknown>;

function asString(v: unknown): string {
    return typeof v === 'string' ? v : '';
}

/**
 * Coerces an incoming tensor payload to a Float32Array.
 *
 * structuredClone preserves a Float32Array across postMessage, but a guest could
 * also send a plain array, and JSON round-trips (an iframe posting through a port
 * that stringifies) turn one into `{0: 1.5, 1: …}`. Accept the honest shapes and
 * refuse the rest rather than letting `new Float32Array(junk)` produce a silent
 * array of NaN that only surfaces as a garbage mask much later.
 */
export function toFloat32(v: unknown): Float32Array {
    if (v instanceof Float32Array) return v;
    if (Array.isArray(v)) {
        if (!v.every(n => typeof n === 'number' && Number.isFinite(n))) {
            throw new Error('ai: input must contain only finite numbers');
        }
        return Float32Array.from(v);
    }
    if (ArrayBuffer.isView(v)) return Float32Array.from(v as unknown as ArrayLike<number>);
    if (v instanceof ArrayBuffer) return new Float32Array(v);
    throw new Error('ai: input must be a Float32Array or an array of numbers');
}

function toShape(v: unknown): number[] {
    if (!Array.isArray(v) || v.length === 0) throw new Error('ai: shape must be a non-empty array');
    return v.map(n => {
        const d = Number(n);
        if (!Number.isInteger(d) || d <= 0) throw new Error(`ai: invalid shape dimension '${n}'`);
        return d;
    });
}

export interface IAiRuntimeHandlers {
    load(args: Args): Promise<ILoadResult>;
    infer(args: Args): Promise<{ data: Float32Array; shape: number[] }>;
    dispose(args: Args): { id: string };
    info(): { backend: Backend | null; loaded: string[] };
}

/**
 * Builds the handler set over a runtime. `runtime` is the seam: the real LiteRT
 * binding in production, a fake in tests.
 */
export function createAiRuntimeHandlers(
    runtime: IInferenceRuntime,
    opts: { onProgress?: ProgressReporter; preferredBackend?: () => Backend } = {},
): IAiRuntimeHandlers {
    const loaded = new Map<string, ILoadResult>();
    /** One init for the process, shared by every concurrent load. */
    let initPromise: Promise<void> | null = null;
    /** In-flight loads, so two apps asking at once compile the model once. */
    const loading = new Map<string, Promise<ILoadResult>>();

    function ensureInit(): Promise<void> {
        if (!initPromise) {
            const backend = opts.preferredBackend?.() ?? 'wasm';
            initPromise = runtime.init(backend).catch(err => {
                // Let the next attempt retry rather than wedging the process on a
                // transient GPU hiccup.
                initPromise = null;
                throw err;
            });
        }
        return initPromise;
    }

    async function load(args: Args): Promise<ILoadResult> {
        const id = asString(args.id);

        // The allowlist is the whole point: an app names a model, never a URL.
        const spec = getModel(id);
        if (!spec) throw new Error(`ai: unknown model '${id}'`);

        const done = loaded.get(id);
        if (done) return done;

        const pending = loading.get(id);
        if (pending) return pending;

        const job = (async () => {
            await ensureInit();
            const bytes = await AiModelCache.load(spec, (l, t) =>
                opts.onProgress?.({ id, loaded: l, total: t, phase: 'download' }));

            // Compiling a model is seconds of work with no progress to report; say so
            // rather than leaving the bar frozen at 100% of the download.
            opts.onProgress?.({ id, loaded: 0, total: 1, phase: 'compile' });
            const info = await runtime.loadModel(id, bytes);
            opts.onProgress?.({ id, loaded: 1, total: 1, phase: 'compile' });

            const result: ILoadResult = { id, ...info, backend: runtime.backend };
            loaded.set(id, result);
            return result;
        })();

        loading.set(id, job);
        try {
            return await job;
        } finally {
            loading.delete(id); // clear on failure too, so a retry can work
        }
    }

    async function infer(args: Args): Promise<IInferOutput> {
        const id = asString(args.id);
        if (!loaded.has(id)) {
            // Load on demand: an app that calls infer first should still work.
            await load({ id });
        }
        const input = toFloat32(args.input);
        const shape = toShape(args.shape);
        return runtime.infer(id, input, shape);
    }

    function dispose(args: Args): { id: string } {
        const id = asString(args.id);
        runtime.dispose(id);
        loaded.delete(id);
        return { id };
    }

    function info(): { backend: Backend | null; loaded: string[] } {
        return { backend: runtime.backend, loaded: [...loaded.keys()] };
    }

    return { load, infer, dispose, info };
}
