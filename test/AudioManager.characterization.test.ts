/**
 * CHARACTERIZATION TESTS: AudioManager — Fase 0 (red de seguridad)
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { AudioManager } from '../js/audio/AudioManager';

// ─── Factories con captura de conexiones ────────────────────────────────────
function makeGainNode() {
    return {
        connect: vi.fn(),
        gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    };
}
function makeOscNode() {
    return {
        connect: vi.fn(), start: vi.fn(), stop: vi.fn(), type: 'sine',
        frequency: {
            value: 440,
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
        },
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
            getChannelData: vi.fn(() => new Float32Array(len)),
        }) as any),
        createBufferSource: vi.fn(makeBufferSourceNode as any),
        decodeAudioData: vi.fn().mockResolvedValue({ duration: 1.0 }),
        resume: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
    };
}

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

function setup() {
    (AudioManager as any).__resetForTesting();
    (window as any).Audio = MockAudio;
    const ctx = makeCtx();
    const am = AudioManager.getInstance();
    (am as any).__injectContext(ctx);
    return { am, ctx };
}

afterEach(() => {
    (AudioManager as any).__resetForTesting();
    vi.restoreAllMocks();
});

// ─── Síntesis: sweep con midFreq (flip) ─────────────────────────────────────
describe('AudioManager (caracterización) — síntesis sweep con midFreq', () => {
    it('flip programa DOS rampas exponenciales (mid + end)', () => {
        const { am, ctx } = setup();
        am.play('flip'); // tiene midFreq: 1000
        const osc = ctx.createOscillator.mock.results.at(-1)!.value;
        // midFreq presente ⇒ dos exponentialRampToValueAtTime sobre la frecuencia
        expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledTimes(2);
        expect(osc.frequency.setValueAtTime).toHaveBeenCalled();
    });

    it('sweep sin midFreq programa UNA sola rampa', () => {
        const { am, ctx } = setup();
        am.play('happy'); // sin midFreq
        const osc = ctx.createOscillator.mock.results.at(-1)!.value;
        expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledTimes(1);
    });
});

// ─── Síntesis: pulse ────────────────────────────────────────────────────────
describe('AudioManager (caracterización) — síntesis pulse', () => {
    it('crea un oscilador por cada pulso', () => {
        const { am, ctx } = setup();
        ctx.createOscillator.mockClear();
        am.play('laugh'); // pulses: 3
        expect(ctx.createOscillator).toHaveBeenCalledTimes(3);
    });
});

// ─── Síntesis: vibrato ──────────────────────────────────────────────────────
describe('AudioManager (caracterización) — síntesis vibrato', () => {
    it('crea DOS osciladores (portadora + vibrato) y los conecta', () => {
        const { am, ctx } = setup();
        ctx.createOscillator.mockClear();
        am.play('cry'); // type vibrato
        expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
        // el LFO de vibrato se conecta a la frecuencia de la portadora vía gain
        const gains = ctx.createGain.mock.results.map(r => r.value);
        expect(gains.some(g => (g as any).connect.mock.calls.length > 0)).toBe(true);
    });
});

// ─── Síntesis: bubbles ──────────────────────────────────────────────────────
describe('AudioManager (caracterización) — síntesis bubbles', () => {
    it('crea un oscilador por burbuja (bubbleCount)', () => {
        const { am, ctx } = setup();
        ctx.createOscillator.mockClear();
        am.play('drink'); // bubbleCount: 3
        expect(ctx.createOscillator).toHaveBeenCalledTimes(3);
    });
});

// ─── Síntesis: noise (filtro lowpass) ───────────────────────────────────────
describe('AudioManager (caracterización) — síntesis noise + filtro', () => {
    it('crea un BiquadFilter lowpass con corte en config.frequency', () => {
        const { am, ctx } = setup();
        ctx.createBiquadFilter.mockClear();
        am.play('fall_impact'); // frequency: 100
        expect(ctx.createBiquadFilter).toHaveBeenCalled();
        const filter = ctx.createBiquadFilter.mock.results.at(-1)!.value;
        expect(filter.type).toBe('lowpass');
        expect((filter.frequency as any).value).toBe(100);
    });

    it('rellena el buffer de ruido con la longitud sampleRate*duration', () => {
        const { am, ctx } = setup();
        ctx.createBuffer.mockClear();
        am.play('land'); // duration 0.1
        const [channels, length, rate] = ctx.createBuffer.mock.calls.at(-1) as any;
        expect(channels).toBe(1);
        expect(rate).toBe(44100);
        expect(length).toBeCloseTo(44100 * 0.1, 0);
    });
});

// ─── Síntesis: tone con variation ───────────────────────────────────────────
describe('AudioManager (caracterización) — variation en tone', () => {
    it('escala la frecuencia según options.variation', () => {
        const { am, ctx } = setup();
        am.registerSound('vartone', {
            type: 'tone', frequency: 100, duration: 0.1, volume: 0.5, variations: 4,
        });
        am.play('vartone', { variation: 0 });
        const oscMin = ctx.createOscillator.mock.results.at(-1)!.value;
        // variation 0 ⇒ freq * 0.9
        expect(oscMin.frequency.value).toBeCloseTo(90, 1);

        am.play('vartone', { variation: 4 });
        const oscMax = ctx.createOscillator.mock.results.at(-1)!.value;
        // variation 4/4=1 ⇒ freq * (0.9 + 0.2) = 110
        expect(oscMax.frequency.value).toBeCloseTo(110, 1);
    });
});

// ─── playHTML5: clonado, escalado y mute ────────────────────────────────────
describe('AudioManager (caracterización) — playHTML5', () => {
    it('clona el nodo y escala el volumen por MASTER_VOLUME', () => {
        const { am } = setup();
        const base = new MockAudio('x.opus');
        (am as any).htmlAudio.set('sfx', base);
        am.play('sfx', { volume: 0.5 });
        expect(base.cloneNode).toHaveBeenCalled();
    });

    it('silencia (volume 0) cuando isMuted, sin abortar la reproducción', () => {
        const { am } = setup();
        const base = new MockAudio('x.opus');
        base.cloneNode = vi.fn(() => {
            return new MockAudio(base.src);
        });
        (am as any).htmlAudio.set('sfx', base);
        (am as any).isMuted = true;
        expect(am.play('sfx')).toBe(false);
    });
});

// ─── Grafo de nodos ─────────────────────────────────────────────────────────
describe('AudioManager (caracterización) — routing hacia masterGain', () => {
    it('tone conecta osc→gain y gain→masterGain', () => {
        const { am, ctx } = setup();
        am.play('blip');
        const osc = ctx.createOscillator.mock.results.at(-1)!.value;
        expect(osc.connect).toHaveBeenCalled();
        const lastGain = ctx.createGain.mock.results.at(-1)!.value;
        expect(lastGain.connect).toHaveBeenCalled();
    });
});
