/**
 * AI RUNTIME WORKER (process runtime, guest side)
 * The `ai-runtime` process: owns the inference runtime and every loaded model, off
 * the main thread, so a multi-second compile or a heavy inference never stutters the
 * desktop and the watchdog can kill a wedged model.
 *
 * Deliberately thin — the behaviour lives in `ai/aiRuntimeHandlers.ts` so it can be
 * tested in jsdom, which has no Worker. This file only wires that behaviour to the
 * real transport and the real runtime.
 */

import { createWorkerRuntime } from '../sdk/appRuntime';
import { createAiRuntimeHandlers, AI_REQUESTS, AI_EVENTS } from '../ai/aiRuntimeHandlers';
import { LiteRtRuntime } from '../ai/LiteRtRuntime';
import type { Backend } from '../ai/InferenceRuntime';

const app = createWorkerRuntime();

/**
 * WebGPU is the fast path but is not everywhere (no adapter, a blocklisted driver,
 * an older browser), so the runtime asks for it only when the API is present and
 * falls back to the Wasm build otherwise.
 */
function preferredBackend(): Backend {
    return typeof navigator !== 'undefined' && 'gpu' in navigator ? 'webgpu' : 'wasm';
}

const runtime = new LiteRtRuntime();

const handlers = createAiRuntimeHandlers(runtime, {
    preferredBackend,
    // Progress travels guest→host as a request; the host answers it, and a failure
    // to deliver a progress tick must never take down the load it is describing.
    onProgress: (ev) => { void app.request(AI_EVENTS.PROGRESS, ev).catch(() => { /* host not listening */ }); },
});

app
    .on(AI_REQUESTS.LOAD, (payload) => handlers.load((payload ?? {}) as Record<string, unknown>))
    .on(AI_REQUESTS.INFER, (payload) => handlers.infer((payload ?? {}) as Record<string, unknown>))
    .on(AI_REQUESTS.DISPOSE, (payload) => handlers.dispose((payload ?? {}) as Record<string, unknown>))
    .on(AI_REQUESTS.INFO, () => handlers.info())
    .start();
