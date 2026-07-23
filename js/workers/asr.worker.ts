/**
 * ASR RUNTIME WORKER (process runtime, guest side)
 * The `asr-runtime` process: Whisper transcription off the main thread. Unlike
 * `ai-runtime` this is a NORMAL module worker — transformers.js/onnxruntime use
 * dynamic import(), which classic workers refuse, and nothing here needs
 * LiteRT's importScripts() path. Deliberately thin; behaviour in asrHandlers.
 */

import { createWorkerRuntime } from '../sdk/appRuntime';
import { createAsrHandlers, ASR_REQUESTS, ASR_EVENTS } from '../ai/asrHandlers';
import { createEmbedHandlers, EMBED_REQUESTS, EMBED_EVENTS } from '../ai/embedHandlers';
import { TransformersAsrEngine } from '../ai/AsrEngine';
import { TransformersEmbedEngine } from '../ai/EmbedEngine';

const app = createWorkerRuntime();

const engine = new TransformersAsrEngine();
const handlers = createAsrHandlers(engine, {
    onProgress: (ev) => { void app.request(ASR_EVENTS.PROGRESS, ev).catch(() => { /* host not listening */ }); },
});

// Embeddings share this process: same transformers.js stack, one worker.
const embedEngine = new TransformersEmbedEngine();
const embedHandlers = createEmbedHandlers(embedEngine, {
    onProgress: (ev) => { void app.request(EMBED_EVENTS.PROGRESS, ev).catch(() => { /* host not listening */ }); },
});

app
    .on(ASR_REQUESTS.TRANSCRIBE, (payload) => handlers.transcribe((payload ?? {}) as Record<string, unknown>))
    .on(ASR_REQUESTS.INFO, () => handlers.info())
    .on(ASR_REQUESTS.DISPOSE, () => handlers.dispose())
    .on(EMBED_REQUESTS.EMBED, (payload) => embedHandlers.embed((payload ?? {}) as Record<string, unknown>))
    .on(EMBED_REQUESTS.INFO, () => embedHandlers.info())
    .start();
