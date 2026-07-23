/**
 * ASR HANDLERS (guest side, transport-free)
 * The behaviour of the `asr-runtime` process, split from the worker shell so it
 * can be tested in jsdom with a fake engine — the same pattern as
 * aiRuntimeHandlers and chatHandlers.
 */

import { toFloat32 } from './aiRuntimeHandlers';
import type { IAsrEngine, IAsrResult, IAsrProgress } from './AsrEngine';

export const ASR_REQUESTS = {
    TRANSCRIBE: 'asr:transcribe',
    INFO: 'asr:info',
    DISPOSE: 'asr:dispose',
} as const;

export const ASR_EVENTS = {
    /** Model download / init / run progress: IAsrProgress + requestId. */
    PROGRESS: 'asr:progress',
} as const;

export type AsrProgressReporter = (ev: IAsrProgress & { requestId: string }) => void;

export interface IAsrHandlers {
    transcribe(args: Record<string, unknown>): Promise<IAsrResult & { requestId: string }>;
    info(): { supported: boolean; ready: boolean };
    dispose(): { ok: true };
}

export function createAsrHandlers(
    engine: IAsrEngine,
    opts: { onProgress?: AsrProgressReporter } = {},
): IAsrHandlers {
    /** Whisper decodes one stream at a time; overlapping runs would fight for it. */
    let running: Promise<unknown> = Promise.resolve();

    async function transcribe(args: Record<string, unknown>): Promise<IAsrResult & { requestId: string }> {
        const requestId = typeof args.requestId === 'string' ? args.requestId : '';
        if (!requestId) throw new Error('asr: missing requestId');
        if (!engine.isSupported()) throw new Error('asr: this environment cannot run the speech model');

        const audio = toFloat32(args.audio);
        if (audio.length === 0) throw new Error('asr: empty audio');
        const language = typeof args.language === 'string' && args.language ? args.language : undefined;

        const report = (p: IAsrProgress) => opts.onProgress?.({ ...p, requestId });

        const job = running.catch(() => { /* previous failure is not ours */ }).then(async () => {
            await engine.init(report);
            report({ phase: 'transcribe', loaded: 0, total: 1 });
            const result = await engine.transcribe(audio, language ? { language } : {});
            report({ phase: 'transcribe', loaded: 1, total: 1 });
            return result;
        });
        running = job;

        const out = await job;
        return { ...out, requestId };
    }

    function info(): { supported: boolean; ready: boolean } {
        return { supported: engine.isSupported(), ready: engine.ready };
    }

    function dispose(): { ok: true } {
        engine.dispose();
        return { ok: true };
    }

    return { transcribe, info, dispose };
}
