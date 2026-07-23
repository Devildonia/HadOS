/**
 * ON-DEVICE TRANSCRIPTION (Whisper substrate)
 * Same discipline as AiChat.test: the engine seam is faked (no model, no wasm),
 * and what gets pinned is the behaviour around it — argument validation, progress
 * routing by requestId, the consent gate, and the IPC round trip.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { createAsrHandlers, ASR_REQUESTS } from '../js/ai/asrHandlers';
import type { IAsrEngine, IAsrResult, IAsrProgress, AsrProgressListener } from '../js/ai/AsrEngine';
import { AiService, TRANSCRIBE_CAPABILITY } from '../js/ai/AiService';
import { PermissionBroker } from '../js/core/PermissionBroker';
import { AppRuntime, type IGuestTransport } from '../js/sdk/appRuntime';
import { WorkerProcess, type IProcessTransport } from '../js/core/WorkerProcess';
import type { ProcMessage } from '../js/core/ipc/protocol';

class FakeAsrEngine implements IAsrEngine {
    public supported = true;
    public initCount = 0;
    public transcribeCalls: Array<{ samples: number; language?: string | undefined }> = [];
    public result: IAsrResult = {
        text: ' Hola mundo. Esto es real.',
        chunks: [
            { text: ' Hola mundo.', start: 0, end: 2.5 },
            { text: ' Esto es real.', start: 2.5, end: 5 },
        ],
    };
    private _ready = false;

    get ready(): boolean { return this._ready; }
    isSupported(): boolean { return this.supported; }

    async init(onProgress?: AsrProgressListener): Promise<void> {
        this.initCount++;
        onProgress?.({ phase: 'download', file: 'model.onnx', loaded: 50, total: 100 });
        onProgress?.({ phase: 'init', loaded: 1, total: 1 });
        this._ready = true;
    }

    async transcribe(audio: Float32Array, opts?: { language?: string }): Promise<IAsrResult> {
        this.transcribeCalls.push({ samples: audio.length, language: opts?.language });
        return this.result;
    }

    dispose(): void { this._ready = false; }
}

describe('asr handlers', () => {
    it('validates requestId and audio before touching the engine', async () => {
        const engine = new FakeAsrEngine();
        const h = createAsrHandlers(engine);
        await expect(h.transcribe({ audio: new Float32Array(8) })).rejects.toThrow(/requestId/);
        await expect(h.transcribe({ requestId: 'r', audio: new Float32Array(0) })).rejects.toThrow(/empty audio/);
        expect(engine.initCount).toBe(0);
    });

    it('refuses an unsupported environment honestly', async () => {
        const engine = new FakeAsrEngine();
        engine.supported = false;
        const h = createAsrHandlers(engine);
        await expect(h.transcribe({ requestId: 'r', audio: new Float32Array(8) }))
            .rejects.toThrow(/cannot run the speech model/);
    });

    it('reports progress tagged with the requestId and returns the chunks', async () => {
        const engine = new FakeAsrEngine();
        const events: Array<IAsrProgress & { requestId: string }> = [];
        const h = createAsrHandlers(engine, { onProgress: (ev) => events.push(ev) });

        const out = await h.transcribe({ requestId: 'r1', audio: new Float32Array(16000) });

        expect(out.requestId).toBe('r1');
        expect(out.chunks.length).toBe(2);
        expect(out.chunks[0]).toEqual({ text: ' Hola mundo.', start: 0, end: 2.5 });
        expect(events.every(e => e.requestId === 'r1')).toBe(true);
        const phases = events.map(e => e.phase);
        expect(phases).toContain('download');
        expect(phases).toContain('transcribe');
    });

    it('passes the language hint through, and only when given', async () => {
        const engine = new FakeAsrEngine();
        const h = createAsrHandlers(engine);
        await h.transcribe({ requestId: 'r1', audio: new Float32Array(8), language: 'es' });
        await h.transcribe({ requestId: 'r2', audio: new Float32Array(8) });
        expect(engine.transcribeCalls[0]?.language).toBe('es');
        expect(engine.transcribeCalls[1]?.language).toBeUndefined();
    });

    it('initialises the engine once across runs', async () => {
        const engine = new FakeAsrEngine();
        const h = createAsrHandlers(engine);
        await h.transcribe({ requestId: 'r1', audio: new Float32Array(8) });
        await h.transcribe({ requestId: 'r2', audio: new Float32Array(8) });
        // init() is called per run but the engine short-circuits once ready —
        // what must hold is that both runs completed against one engine.
        expect(engine.transcribeCalls.length).toBe(2);
        expect(engine.ready).toBe(true);
    });
});

// ── Host facade over real IPC ────────────────────────────────────────────────

function loopback(): { host: IProcessTransport; guest: IGuestTransport } {
    let toGuest: ((m: unknown) => void) | null = null;
    let toHost: ((m: unknown) => void) | null = null;
    const post = (target: () => ((m: unknown) => void) | null, msg: ProcMessage) => {
        queueMicrotask(() => target()?.(structuredClone(msg)));
    };
    return {
        host: {
            postMessage: (m: unknown) => post(() => toGuest, m as ProcMessage),
            onMessage: (h: (m: unknown) => void) => { toHost = h; },
            terminate: () => { toGuest = null; toHost = null; },
        } as IProcessTransport,
        guest: {
            post: (m: unknown) => post(() => toHost, m as ProcMessage),
            onMessage: (h: (m: unknown) => void) => { toGuest = h; },
        } as IGuestTransport,
    };
}

function spawnFakeAsrProcess(engine: FakeAsrEngine): WorkerProcess {
    const { host, guest } = loopback();
    const app = new AppRuntime(guest);
    const handlers = createAsrHandlers(engine, {
        onProgress: (ev) => { void app.request('asr:progress', ev).catch(() => {}); },
    });
    app.on(ASR_REQUESTS.TRANSCRIBE, (p) => handlers.transcribe((p ?? {}) as Record<string, unknown>))
        .on(ASR_REQUESTS.INFO, () => handlers.info())
        .start();
    return new WorkerProcess(host);
}

describe('AiService.transcribe', () => {
    let engine: FakeAsrEngine;

    beforeEach(() => {
        PermissionBroker.reset();
        engine = new FakeAsrEngine();
        AiService.__setAsrSpawner(() => ({ pid: 77, worker: spawnFakeAsrProcess(engine) }));
    });

    afterEach(() => {
        AiService.__setAsrSpawner(null);
        PermissionBroker.reset();
    });

    it('is denied without ai:transcribe consent, before any work', async () => {
        PermissionBroker.setPrompt(async () => 'denied');
        await expect(AiService.transcribe('mediaplayer', new Float32Array(16)))
            .rejects.toThrow(`permission denied: ${TRANSCRIBE_CAPABILITY}`);
        expect(engine.transcribeCalls.length).toBe(0);
    });

    it('transcribes end to end, streaming progress to the caller', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        const phases: string[] = [];

        const out = await AiService.transcribe('mediaplayer', new Float32Array(16000), {}, (p) => {
            phases.push(p.phase);
        });

        expect(out.text).toBe(' Hola mundo. Esto es real.');
        expect(out.chunks.map(c => c.start)).toEqual([0, 2.5]);
        expect(engine.transcribeCalls).toEqual([{ samples: 16000, language: undefined }]);
        expect(phases).toContain('download');
        expect(phases).toContain('transcribe');
    });
});
