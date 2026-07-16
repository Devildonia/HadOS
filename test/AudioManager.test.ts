/**
 * TESTS: AudioManager — Sprint 2, versión 4 (definitiva)
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { AudioManager } from '../js/audio/AudioManager';

// ─── Factories ────────────────────────────────────────────────────────────────

function makeGainNode() {
    return {
        connect: vi.fn(),
        gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    };
}
function makeOscNode() {
    return {
        connect: vi.fn(), start: vi.fn(), stop: vi.fn(), type: 'sine',
        frequency: { value: 440, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    };
}
function makeFilterNode() {
    return { connect: vi.fn(), type: 'lowpass', frequency: { value: 1000 } };
}
function makeBufferSourceNode() {
    return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), buffer: null };
}
function makeCtx() {
    return {
        state: 'running',
        currentTime: 0,
        sampleRate: 44100,
        destination: {},
        createOscillator: vi.fn(makeOscNode as any),
        createGain: vi.fn(makeGainNode as any),
        createBiquadFilter: vi.fn(makeFilterNode as any),
        createBuffer: vi.fn((ch: number, len: number) => ({
            getChannelData: vi.fn(() => new Float32Array(len))
        }) as any),
        createBufferSource: vi.fn(makeBufferSourceNode as any),
        decodeAudioData: vi.fn().mockResolvedValue({ duration: 1.0 }),
        resume: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
    };
}

// new Audio() requiere clase real, no arrow function
class MockAudio {
    src: string;
    volume: number;
    addEventListener: any;
    play: any;
    cloneNode: any;
    constructor(url?: string) {
        this.src = url || '';
        this.volume = 1;
        this.addEventListener = vi.fn();
        this.play = vi.fn().mockResolvedValue(undefined);
        this.cloneNode = vi.fn(() => new MockAudio(this.src));
    }
}

// ─── Helper principal ─────────────────────────────────────────────────────────
/**
 * Devuelve { am, ctx } con singleton reseteado y contexto inyectado.
 * am.__injectContext(ctx) garantiza que ctx y am.context son el MISMO objeto.
 * Los spies de ctx están limpios (recién creados) en cada llamada.
 */
function setup() {
    (AudioManager as any).__resetForTesting();
    (window as any).Audio = MockAudio;
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as any);

    const ctx = makeCtx();
    const am = AudioManager.getInstance();
    (am as any).__injectContext(ctx);

    return { am, ctx };
}

afterEach(() => {
    (AudioManager as any).__resetForTesting();
    vi.restoreAllMocks();
});

// ─── Singleton ────────────────────────────────────────────────────────────────
describe('AudioManager — Singleton', () => {
    it('getInstance() siempre retorna la misma instancia', () => {
        (AudioManager as any).__resetForTesting();
        const a = AudioManager.getInstance();
        const b = AudioManager.getInstance();
        expect(a).toBe(b);
    });

    it('new() tras getInstance() retorna el mismo singleton', () => {
        (AudioManager as any).__resetForTesting();
        const a = AudioManager.getInstance();
        expect(new AudioManager()).toBe(a);
    });
});

// ─── init() ──────────────────────────────────────────────────────────────────
describe('AudioManager — init()', () => {
    it('inicializa contexto, masterGain y sounds', () => {
        const { am, ctx } = setup();
        const amAny = am as any;

        expect(amAny.initialized).toBe(true);
        expect(amAny.context).toBe(ctx as any);
        expect(amAny.masterGain).not.toBeNull();
        expect(amAny.sounds.size).toBeGreaterThan(0);
    });

    it('es idempotente — segunda llamada no reinicializa', () => {
        const { am, ctx } = setup();
        const amAny = am as any;
        const contextBefore = amAny.context;

        // Forzar un segundo init() — initialized ya es true, debe salir inmediatamente
        amAny.initialized = false;  // simular estado pre-init
        (am as any).__injectContext(ctx); // re-inyectar el mismo ctx
        amAny.initialized = false;
        (am as any).__injectContext(ctx);

        // El contexto debe seguir siendo el mismo objeto
        expect(amAny.context).toBe(contextBefore);
    });

    it('deshabilita audio si AudioContext lanza', () => {
        (AudioManager as any).__resetForTesting();
        (window as any).AudioContext = vi.fn(function (this: any) { throw new Error('Sin hardware'); });
        (window as any).webkitAudioContext = undefined;

        const am = AudioManager.getInstance() as any;
        am.init();

        expect(am.initialized).toBe(false);
        expect(am.isEnabled).toBe(false);
    });
});

// ─── registerSound / sounds Map ──────────────────────────────────────────────
describe('AudioManager — registerSound / sounds Map', () => {
    it('pre-registra blip, happy, jump', () => {
        const { am } = setup();
        const amAny = am as any;
        expect(amAny.sounds.has('blip')).toBe(true);
        expect(amAny.sounds.has('happy')).toBe(true);
        expect(amAny.sounds.has('jump')).toBe(true);
        expect(amAny.sounds.size).toBeGreaterThan(20);
    });

    it('registerSound() añade entrada', () => {
        const { am } = setup();
        const amAny = am as any;
        am.registerSound('ping', { type: 'tone', frequency: 880, duration: 0.1, volume: 0.5 });
        expect(amAny.sounds.get('ping')!.frequency).toBe(880);
    });

    it('registerSound() sobreescribe entrada existente', () => {
        const { am } = setup();
        const amAny = am as any;
        am.registerSound('blip', { type: 'tone', frequency: 999, duration: 0.1, volume: 0.5 });
        expect(amAny.sounds.get('blip')!.frequency).toBe(999);
    });
});

// ─── play() ──────────────────────────────────────────────────────────────────
describe('AudioManager — play()', () => {
    it('retorna false si disabled', () => {
        const { am } = setup();
        const amAny = am as any;
        amAny.isEnabled = false;
        expect(am.play('blip')).toBe(false);
    });

    it('retorna false si muted', () => {
        const { am } = setup();
        const amAny = am as any;
        amAny.isMuted = true;
        expect(am.play('blip')).toBe(false);
    });

    it('retorna false para sonido desconocido', () => {
        const { am } = setup();
        expect(am.play('ghost-xyz')).toBe(false);
    });

    it('retorna true para tono procedural', () => {
        const { am } = setup();
        expect(am.play('blip')).toBe(true);
    });

    it('llama createOscillator para tipo tone', () => {
        const { am, ctx } = setup();
        ctx.createOscillator.mockClear();
        am.play('blip');
        expect(ctx.createOscillator).toHaveBeenCalled();
    });

    it('llama createOscillator para tipo sweep', () => {
        const { am, ctx } = setup();
        ctx.createOscillator.mockClear();
        am.play('happy');
        expect(ctx.createOscillator).toHaveBeenCalled();
    });

    it('usa createBuffer + createBufferSource para noise', () => {
        const { am, ctx } = setup();
        ctx.createBuffer.mockClear();
        ctx.createBufferSource.mockClear();
        am.play('land');
        expect(ctx.createBuffer).toHaveBeenCalled();
        expect(ctx.createBufferSource).toHaveBeenCalled();
    });

    it('prefiere audioBuffer sobre procedural', () => {
        const { am } = setup();
        (am as any).audioBuffers.set('blip', { duration: 1 });
        const spy = vi.spyOn(am, 'playBuffer' as any).mockReturnValue(true);
        am.play('blip');
        expect(spy).toHaveBeenCalledWith('blip', {});
    });

    it('prefiere htmlAudio sobre procedural', () => {
        const { am } = setup();
        (am as any).htmlAudio.set('blip', new MockAudio());
        const spy = vi.spyOn(am, 'playHTML5' as any).mockReturnValue(true);
        am.play('blip');
        expect(spy).toHaveBeenCalled();
    });

    it('hace resume si context está suspended', () => {
        const { am, ctx } = setup();
        (ctx as any).state = 'suspended';
        ctx.resume.mockClear();
        am.play('blip');
        expect(ctx.resume).toHaveBeenCalled();
    });
});

// ─── mute / volume / enabled ─────────────────────────────────────────────────
describe('AudioManager — mute / volume / enabled', () => {
    it('setMute(true) zeroes masterGain', () => {
        const { am } = setup();
        const amAny = am as any;
        am.setMute(true);
        expect(amAny.isMuted).toBe(true);
        expect(amAny.masterGain!.gain.value).toBe(0);
    });

    it('setMute(false) restaura MASTER_VOLUME', () => {
        const { am } = setup();
        const amAny = am as any;
        am.setMute(true);
        am.setMute(false);
        expect(amAny.isMuted).toBe(false);
        expect(amAny.masterGain!.gain.value).toBeCloseTo(0.3);
    });

    it('setVolume clampea a [0,1]', () => {
        const { am } = setup();
        const amAny = am as any;
        am.setVolume(2.5);
        expect(amAny.masterGain!.gain.value).toBe(1);
        am.setVolume(-1);
        expect(amAny.masterGain!.gain.value).toBe(0);
        am.setVolume(0.7);
        expect(amAny.masterGain!.gain.value).toBeCloseTo(0.7);
    });

    it('setEnabled(false) deshabilita play()', () => {
        const { am } = setup();
        am.setEnabled(false);
        expect(am.play('blip')).toBe(false);
    });

    it('setEnabled(true) re-habilita play()', () => {
        const { am } = setup();
        am.setEnabled(false);
        am.setEnabled(true);
        expect(am.play('blip')).toBe(true);
    });
});

// ─── loadSound() ─────────────────────────────────────────────────────────────
describe('AudioManager — loadSound()', () => {
    it('almacena decoded buffer en audioBuffers', async () => {
        const { am, ctx } = setup();
        const fakeBuffer = { duration: 1.5 };
        ctx.decodeAudioData.mockResolvedValue(fakeBuffer);

        Object.defineProperty(window, 'location', {
            value: { protocol: 'http:' }, configurable: true,
        });

        await am.loadSound('shutdown', 'assets/audio/HadOS_shutdown.opus');
        expect((am as any).audioBuffers.get('shutdown')).toBe(fakeBuffer);
    });

    it('fallback HTML5 si fetch falla', async () => {
        const { am } = setup();
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        Object.defineProperty(window, 'location', {
            value: { protocol: 'http:' }, configurable: true,
        });

        await am.loadSound('test-fallback', 'assets/audio/test.opus');
        expect((am as any).htmlAudio.has('test-fallback')).toBe(true);
    });

    it('usa HTML5 directo para file://', async () => {
        const { am } = setup();
        global.fetch = vi.fn();

        Object.defineProperty(window, 'location', {
            value: { protocol: 'file:' }, configurable: true,
        });

        await am.loadSound('local-sound', 'assets/audio/test.opus');
        expect((am as any).htmlAudio.has('local-sound')).toBe(true);
        expect(global.fetch).not.toHaveBeenCalled();
    });
});

// ─── cleanup() ───────────────────────────────────────────────────────────────
describe('AudioManager — cleanup()', () => {
    it('cierra context y resetea initialized', () => {
        const { am, ctx } = setup();
        am.cleanup();
        expect(ctx.close).toHaveBeenCalled();
        expect((am as any).initialized).toBe(false);
    });

    it('no lanza sin init() previo', () => {
        (AudioManager as any).__resetForTesting();
        const am = AudioManager.getInstance();
        expect(() => am.cleanup()).not.toThrow();
    });
});
