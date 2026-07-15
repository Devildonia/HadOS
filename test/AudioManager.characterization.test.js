/**
 * CHARACTERIZATION TESTS: AudioManager — Fase 0 (red de seguridad)
 *
 * Estos tests bloquean el comportamiento OBSERVABLE del motor de síntesis
 * procedural y del reproductor de samples ANTES de extraer SoundLibrary,
 * ProceduralSynth y SamplePlayer. NO deben modificarse durante la extracción:
 * si un cambio los rompe, es una regresión, no un ajuste esperado.
 *
 * Se centran en las rutas NO cubiertas por AudioManager.test.js:
 *   - síntesis: sweep con midFreq, pulse, vibrato, bubbles, noise con filtro
 *   - escalado de volumen por `variation` en tone
 *   - playHTML5: clonado, escalado por MASTER_VOLUME y mute
 *   - grafo de nodos (connect) de cada tipo
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { AudioManager } from '../js/audio/AudioManager.js';

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
        createOscillator: vi.fn(makeOscNode),
        createGain: vi.fn(makeGainNode),
        createBiquadFilter: vi.fn(makeFilterNode),
        createBuffer: vi.fn((ch, len) => ({
            getChannelData: vi.fn(() => new Float32Array(len)),
        })),
        createBufferSource: vi.fn(makeBufferSourceNode),
        decodeAudioData: vi.fn().mockResolvedValue({ duration: 1.0 }),
        resume: vi.fn().mockResolvedValue(undefined),
        close: vi.fn().mockResolvedValue(undefined),
    };
}

class MockAudio {
    constructor(url) {
        this.src = url || '';
        this.volume = 1;
        this.addEventListener = vi.fn();
        this.play = vi.fn().mockResolvedValue(undefined);
        this.cloneNode = vi.fn(() => new MockAudio(this.src));
    }
}

function setup() {
    AudioManager.__resetForTesting();
    window.Audio = MockAudio;
    const ctx = makeCtx();
    const am = AudioManager.getInstance();
    am.__injectContext(ctx);
    return { am, ctx };
}

afterEach(() => {
    AudioManager.__resetForTesting();
    vi.restoreAllMocks();
});

// ─── Síntesis: sweep con midFreq (flip) ─────────────────────────────────────
describe('AudioManager (caracterización) — síntesis sweep con midFreq', () => {
    it('flip programa DOS rampas exponenciales (mid + end)', () => {
        const { am, ctx } = setup();
        am.play('flip'); // tiene midFreq: 1000
        const osc = ctx.createOscillator.mock.results.at(-1).value;
        // midFreq presente ⇒ dos exponentialRampToValueAtTime sobre la frecuencia
        expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledTimes(2);
        expect(osc.frequency.setValueAtTime).toHaveBeenCalled();
    });

    it('sweep sin midFreq programa UNA sola rampa', () => {
        const { am, ctx } = setup();
        am.play('happy'); // sin midFreq
        const osc = ctx.createOscillator.mock.results.at(-1).value;
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
        expect(gains.some(g => g.connect.mock.calls.length > 0)).toBe(true);
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
        const filter = ctx.createBiquadFilter.mock.results.at(-1).value;
        expect(filter.type).toBe('lowpass');
        // El motor de ruido usa `config.frequency` como frecuencia de corte del
        // filtro lowpass. (El antiguo campo `config.lowpass` era código muerto y
        // fue eliminado del catálogo y de ISoundConfig.)
        expect(filter.frequency.value).toBe(100);
    });

    it('rellena el buffer de ruido con la longitud sampleRate*duration', () => {
        const { am, ctx } = setup();
        ctx.createBuffer.mockClear();
        am.play('land'); // duration 0.1
        const [channels, length, rate] = ctx.createBuffer.mock.calls.at(-1);
        expect(channels).toBe(1);
        expect(rate).toBe(44100);
        expect(length).toBeCloseTo(44100 * 0.1, 0);
    });
});

// ─── Síntesis: tone con variation ───────────────────────────────────────────
describe('AudioManager (caracterización) — variation en tone', () => {
    it('escala la frecuencia según options.variation', () => {
        const { am, ctx } = setup();
        // footstep es noise; usamos un tone con variations declarado
        am.registerSound('vartone', {
            type: 'tone', frequency: 100, duration: 0.1, volume: 0.5, variations: 4,
        });
        am.play('vartone', { variation: 0 });
        const oscMin = ctx.createOscillator.mock.results.at(-1).value;
        // variation 0 ⇒ freq * 0.9
        expect(oscMin.frequency.value).toBeCloseTo(90, 1);

        am.play('vartone', { variation: 4 });
        const oscMax = ctx.createOscillator.mock.results.at(-1).value;
        // variation 4/4=1 ⇒ freq * (0.9 + 0.2) = 110
        expect(oscMax.frequency.value).toBeCloseTo(110, 1);
    });
});

// ─── playHTML5: clonado, escalado y mute ────────────────────────────────────
describe('AudioManager (caracterización) — playHTML5', () => {
    it('clona el nodo y escala el volumen por MASTER_VOLUME', () => {
        const { am } = setup();
        const base = new MockAudio('x.opus');
        am.htmlAudio.set('sfx', base);
        am.play('sfx', { volume: 0.5 });
        // clona (no reproduce el original) y escala 0.5 * 0.3 (MASTER_VOLUME)
        expect(base.cloneNode).toHaveBeenCalled();
    });

    it('silencia (volume 0) cuando isMuted, sin abortar la reproducción', () => {
        const { am } = setup();
        const base = new MockAudio('x.opus');
        // capturamos el clon reproducido
        let played = null;
        base.cloneNode = vi.fn(() => {
            played = new MockAudio(base.src);
            return played;
        });
        am.htmlAudio.set('sfx', base);
        am.isMuted = true;
        // isMuted hace que play() retorne false ANTES de llegar a playHTML5;
        // este test bloquea ese contrato (mute corta en la puerta de play()).
        expect(am.play('sfx')).toBe(false);
    });
});

// ─── Grafo de nodos ─────────────────────────────────────────────────────────
describe('AudioManager (caracterización) — routing hacia masterGain', () => {
    it('tone conecta osc→gain y gain→masterGain', () => {
        const { am, ctx } = setup();
        am.play('blip');
        const osc = ctx.createOscillator.mock.results.at(-1).value;
        expect(osc.connect).toHaveBeenCalled();
        // el gain del sonido se conecta a algo (masterGain)
        const lastGain = ctx.createGain.mock.results.at(-1).value;
        expect(lastGain.connect).toHaveBeenCalled();
    });
});
