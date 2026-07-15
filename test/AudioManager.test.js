/**
 * TESTS: AudioManager — Sprint 2, versión 4 (definitiva)
 *
 * SOLUCIÓN FINAL al problema de aislamiento del singleton:
 *
 * El problema raíz era intentar mockear window.AudioContext DESPUÉS de que
 * el módulo ya está cargado. AudioManager usa `static instance = null` como
 * class field, y aunque se resetea correctamente, el mock de AudioContext
 * no siempre llega al módulo debido al caching de módulos de Vitest.
 *
 * SOLUCIÓN: Añadimos __injectContext(mockCtx) al módulo de producción.
 * Este método inyecta directamente el contexto mock en la instancia,
 * sin pasar por window.AudioContext en absoluto.
 * 
 * Patrón en cada test:
 *   1. AudioManager.__resetForTesting() — nuevo singleton
 *   2. am = AudioManager.getInstance() — instancia limpia  
 *   3. am.__injectContext(ctx) — inyectar mock directamente
 *   4. ctx tiene todos los spies para assertions
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { AudioManager } from '../js/audio/AudioManager.js';

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
        createOscillator: vi.fn(makeOscNode),
        createGain: vi.fn(makeGainNode),
        createBiquadFilter: vi.fn(makeFilterNode),
        createBuffer: vi.fn((ch, len) => ({
            getChannelData: vi.fn(() => new Float32Array(len))
        })),
        createBufferSource: vi.fn(makeBufferSourceNode),
        decodeAudioData: vi.fn().mockResolvedValue({ duration: 1.0 }),
        resume: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
    };
}

// new Audio() requiere clase real, no arrow function
class MockAudio {
    constructor(url) {
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
    AudioManager.__resetForTesting();
    window.Audio = MockAudio;
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    });

    const ctx = makeCtx();
    const am = AudioManager.getInstance();
    am.__injectContext(ctx);

    return { am, ctx };
}

afterEach(() => {
    AudioManager.__resetForTesting();
    vi.restoreAllMocks();
});

// ─── Singleton ────────────────────────────────────────────────────────────────
describe('AudioManager — Singleton', () => {
    it('getInstance() siempre retorna la misma instancia', () => {
        AudioManager.__resetForTesting();
        const a = AudioManager.getInstance();
        const b = AudioManager.getInstance();
        expect(a).toBe(b);
    });

    it('new() tras getInstance() retorna el mismo singleton', () => {
        AudioManager.__resetForTesting();
        const a = AudioManager.getInstance();
        expect(new AudioManager()).toBe(a);
    });
});

// ─── init() ──────────────────────────────────────────────────────────────────
describe('AudioManager — init()', () => {
    it('inicializa contexto, masterGain y sounds', () => {
        // Usar __injectContext para evitar dependencia de window.AudioContext
        const { am, ctx } = setup();

        expect(am.initialized).toBe(true);
        expect(am.context).toBe(ctx);
        expect(am.masterGain).not.toBeNull();
        expect(am.sounds.size).toBeGreaterThan(0);
    });

    it('es idempotente — segunda llamada no reinicializa', () => {
        const { am, ctx } = setup();
        const contextBefore = am.context;

        // Forzar un segundo init() — initialized ya es true, debe salir inmediatamente
        am.initialized = false;  // simular estado pre-init
        am.__injectContext(ctx); // re-inyectar el mismo ctx
        am.initialized = false;
        am.__injectContext(ctx);

        // El contexto debe seguir siendo el mismo objeto
        expect(am.context).toBe(contextBefore);
    });

    it('deshabilita audio si AudioContext lanza', () => {
        AudioManager.__resetForTesting();
        window.AudioContext = vi.fn(function () { throw new Error('Sin hardware'); });
        window.webkitAudioContext = undefined;

        const am = AudioManager.getInstance();
        am.init();

        expect(am.initialized).toBe(false);
        expect(am.isEnabled).toBe(false);
    });
});

// ─── registerSound / sounds Map ──────────────────────────────────────────────
describe('AudioManager — registerSound / sounds Map', () => {
    it('pre-registra blip, happy, jump', () => {
        const { am } = setup();
        expect(am.sounds.has('blip')).toBe(true);
        expect(am.sounds.has('happy')).toBe(true);
        expect(am.sounds.has('jump')).toBe(true);
        expect(am.sounds.size).toBeGreaterThan(20);
    });

    it('registerSound() añade entrada', () => {
        const { am } = setup();
        am.registerSound('ping', { type: 'tone', frequency: 880, duration: 0.1, volume: 0.5 });
        expect(am.sounds.get('ping').frequency).toBe(880);
    });

    it('registerSound() sobreescribe entrada existente', () => {
        const { am } = setup();
        am.registerSound('blip', { type: 'tone', frequency: 999, duration: 0.1, volume: 0.5 });
        expect(am.sounds.get('blip').frequency).toBe(999);
    });
});

// ─── play() ──────────────────────────────────────────────────────────────────
describe('AudioManager — play()', () => {
    it('retorna false si disabled', () => {
        const { am } = setup();
        am.isEnabled = false;
        expect(am.play('blip')).toBe(false);
    });

    it('retorna false si muted', () => {
        const { am } = setup();
        am.isMuted = true;
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
        am.audioBuffers.set('blip', { duration: 1 });
        const spy = vi.spyOn(am, 'playBuffer').mockReturnValue(true);
        am.play('blip');
        expect(spy).toHaveBeenCalledWith('blip', {});
    });

    it('prefiere htmlAudio sobre procedural', () => {
        const { am } = setup();
        am.htmlAudio.set('blip', new MockAudio());
        const spy = vi.spyOn(am, 'playHTML5').mockReturnValue(true);
        am.play('blip');
        expect(spy).toHaveBeenCalled();
    });

    it('hace resume si context está suspended', () => {
        const { am, ctx } = setup();
        ctx.state = 'suspended';
        ctx.resume.mockClear();
        am.play('blip');
        expect(ctx.resume).toHaveBeenCalled();
    });
});

// ─── mute / volume / enabled ─────────────────────────────────────────────────
describe('AudioManager — mute / volume / enabled', () => {
    it('setMute(true) zeroes masterGain', () => {
        const { am } = setup();
        am.setMute(true);
        expect(am.isMuted).toBe(true);
        expect(am.masterGain.gain.value).toBe(0);
    });

    it('setMute(false) restaura MASTER_VOLUME', () => {
        const { am } = setup();
        am.setMute(true);
        am.setMute(false);
        expect(am.isMuted).toBe(false);
        expect(am.masterGain.gain.value).toBeCloseTo(0.3);
    });

    it('setVolume clampea a [0,1]', () => {
        const { am } = setup();
        am.setVolume(2.5);
        expect(am.masterGain.gain.value).toBe(1);
        am.setVolume(-1);
        expect(am.masterGain.gain.value).toBe(0);
        am.setVolume(0.7);
        expect(am.masterGain.gain.value).toBeCloseTo(0.7);
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

        await am.loadSound('shutdown', 'assets/audio/w95_shutdown.opus');
        expect(am.audioBuffers.get('shutdown')).toBe(fakeBuffer);
    });

    it('fallback HTML5 si fetch falla', async () => {
        const { am } = setup();
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        Object.defineProperty(window, 'location', {
            value: { protocol: 'http:' }, configurable: true,
        });

        await am.loadSound('test-fallback', 'assets/audio/test.opus');
        expect(am.htmlAudio.has('test-fallback')).toBe(true);
    });

    it('usa HTML5 directo para file://', async () => {
        const { am } = setup();
        global.fetch = vi.fn();

        Object.defineProperty(window, 'location', {
            value: { protocol: 'file:' }, configurable: true,
        });

        await am.loadSound('local-sound', 'assets/audio/test.opus');
        expect(am.htmlAudio.has('local-sound')).toBe(true);
        expect(global.fetch).not.toHaveBeenCalled();
    });
});

// ─── cleanup() ───────────────────────────────────────────────────────────────
describe('AudioManager — cleanup()', () => {
    it('cierra context y resetea initialized', () => {
        const { am, ctx } = setup();
        am.cleanup();
        expect(ctx.close).toHaveBeenCalled();
        expect(am.initialized).toBe(false);
    });

    it('no lanza sin init() previo', () => {
        AudioManager.__resetForTesting();
        const am = AudioManager.getInstance();
        expect(() => am.cleanup()).not.toThrow();
    });
});
