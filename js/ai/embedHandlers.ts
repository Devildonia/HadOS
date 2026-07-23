/**
 * EMBED HANDLERS (guest side, transport-free)
 * The embedding ops of the asr-runtime process — same testability pattern as
 * every other handler set: a fake engine in jsdom, the real one in the worker.
 */

import type { IEmbedEngine, IEmbedResult, IEmbedProgress } from './EmbedEngine';

export const EMBED_REQUESTS = {
    EMBED: 'embed:texts',
    INFO: 'embed:info',
} as const;

export const EMBED_EVENTS = {
    PROGRESS: 'embed:progress',
} as const;

/** An app indexing a "document" of thousands of lines is not indexing — cap it. */
export const MAX_EMBED_TEXTS = 512;

export type EmbedProgressReporter = (ev: IEmbedProgress & { requestId: string }) => void;

export interface IEmbedHandlers {
    embed(args: Record<string, unknown>): Promise<IEmbedResult & { requestId: string }>;
    info(): { supported: boolean; ready: boolean };
}

export function createEmbedHandlers(
    engine: IEmbedEngine,
    opts: { onProgress?: EmbedProgressReporter } = {},
): IEmbedHandlers {
    let running: Promise<unknown> = Promise.resolve();

    async function embed(args: Record<string, unknown>): Promise<IEmbedResult & { requestId: string }> {
        const requestId = typeof args.requestId === 'string' ? args.requestId : '';
        if (!requestId) throw new Error('embed: missing requestId');
        if (!engine.isSupported()) throw new Error('embed: this environment cannot run the embedding model');

        const texts = Array.isArray(args.texts) ? args.texts.filter((t): t is string => typeof t === 'string' && t.trim().length > 0) : [];
        if (texts.length === 0) throw new Error('embed: no texts to embed');
        if (texts.length > MAX_EMBED_TEXTS) throw new Error(`embed: too many texts (${texts.length} > ${MAX_EMBED_TEXTS})`);

        const report = (p: IEmbedProgress) => opts.onProgress?.({ ...p, requestId });

        const job = running.catch(() => { /* previous failure is not ours */ }).then(async () => {
            await engine.init(report);
            report({ phase: 'embed', loaded: 0, total: texts.length });
            const result = await engine.embed(texts);
            report({ phase: 'embed', loaded: texts.length, total: texts.length });
            return result;
        });
        running = job;

        const out = await job;
        return { ...out, requestId };
    }

    function info(): { supported: boolean; ready: boolean } {
        return { supported: engine.isSupported(), ready: engine.ready };
    }

    return { embed, info };
}
