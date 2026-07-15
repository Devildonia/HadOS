import type { ISoundConfig } from './AudioTypes.js';

// ============================================
// SOUND LIBRARY — catálogo declarativo de sonidos procedurales
// Extraído de AudioManager.registerSounds(). Solo DATOS, sin lógica.
// AudioManager los carga en su Map<string, ISoundConfig> al arrancar.
// ============================================

export const DEFAULT_SOUNDS: Record<string, ISoundConfig> = {
    // UI SOUNDS
    blip: { type: 'tone', frequency: 800, duration: 0.1, volume: 0.6, waveType: 'sine' },

    // EMOTIONAL SOUNDS
    happy: { type: 'sweep', startFreq: 500, endFreq: 800, duration: 0.2, volume: 0.15, waveType: 'sine' },
    laugh: { type: 'pulse', frequency: 400, pulses: 3, pulseDuration: 0.1, pulseGap: 0.05, duration: 0.45, volume: 0.12, waveType: 'square' },
    sad: { type: 'sweep', startFreq: 600, endFreq: 200, duration: 0.8, volume: 0.1, waveType: 'triangle' },
    cry: { type: 'vibrato', frequency: 200, vibratoRate: 6, duration: 0.5, volume: 0.12, waveType: 'sine' },
    angry: { type: 'tone', frequency: 100, duration: 0.3, volume: 0.15, waveType: 'sawtooth' },
    surprised: { type: 'sweep', startFreq: 300, endFreq: 600, duration: 0.1, volume: 0.15, waveType: 'sine' },
    scared: { type: 'tone', frequency: 1000, duration: 0.2, volume: 0.12, waveType: 'square' },

    // ACTION SOUNDS
    footstep: { type: 'noise', frequency: 85, duration: 0.05, volume: 0.08, variations: 3 },
    jump: { type: 'sweep', startFreq: 300, endFreq: 600, midFreq: 150, duration: 0.25, volume: 0.15, waveType: 'triangle' },
    land: { type: 'noise', frequency: 60, duration: 0.1, volume: 0.15 },
    fall_impact: { type: 'noise', frequency: 100, duration: 0.2, volume: 0.2 },
    grab: { type: 'tone', frequency: 200, duration: 0.05, volume: 0.1, waveType: 'square' },
    release: { type: 'sweep', startFreq: 800, endFreq: 200, duration: 0.2, volume: 0.12, waveType: 'triangle' },

    // INTERACTION SOUNDS
    eat: { type: 'pulse', frequency: 150, pulses: 2, pulseDuration: 0.08, pulseGap: 0.07, duration: 0.3, volume: 0.1, waveType: 'square' },
    drink: { type: 'bubbles', baseFreq: 300, bubbleCount: 3, duration: 0.3, volume: 0.1 },
    yawn: { type: 'sweep', startFreq: 200, endFreq: 150, duration: 1.0, volume: 0.1, waveType: 'sine' },
    snore: { type: 'vibrato', frequency: 60, vibratoRate: 2, duration: 0.8, volume: 0.08, waveType: 'triangle', loop: true },
    thinking: { type: 'vibrato', frequency: 250, vibratoRate: 4, duration: 0.5, volume: 0.08, waveType: 'sine' },
    wave: { type: 'sweep', startFreq: 400, endFreq: 800, midFreq: 400, duration: 0.3, volume: 0.15, waveType: 'sine' },
    clap: { type: 'noise', frequency: 2000, duration: 0.08, volume: 0.12 },
    stretch: { type: 'sweep', startFreq: 150, endFreq: 300, duration: 0.6, volume: 0.08, waveType: 'sine' },
    dance: { type: 'pulse', frequency: 440, pulses: 4, pulseDuration: 0.1, pulseGap: 0.1, duration: 0.8, volume: 0.1, waveType: 'square' },
    step: { type: 'noise', frequency: 100, duration: 0.03, volume: 0.05 },
    sit: { type: 'noise', frequency: 150, duration: 0.3, volume: 0.1 },
    strain: { type: 'sweep', startFreq: 200, endFreq: 250, duration: 0.4, volume: 0.08, waveType: 'triangle' },
    confused: { type: 'sweep', startFreq: 400, endFreq: 300, duration: 0.3, volume: 0.1, waveType: 'sawtooth' },
    whoosh: { type: 'noise', frequency: 500, duration: 0.4, volume: 0.15 },
    flip: { type: 'sweep', startFreq: 600, endFreq: 200, midFreq: 1000, duration: 0.5, volume: 0.15, waveType: 'sine' },
    dizzy: { type: 'vibrato', frequency: 350, vibratoRate: 8, duration: 0.8, volume: 0.12, waveType: 'sine' },
    slide: { type: 'sweep', startFreq: 200, endFreq: 150, duration: 0.3, volume: 0.08, waveType: 'triangle' },

    // SPECIAL SOUNDS
    spawn: { type: 'sweep', startFreq: 800, endFreq: 200, duration: 0.15, volume: 0.15, waveType: 'square' },

    // RAGDOLL SOUNDS (Procedural)
    eek: { type: 'sweep', startFreq: 800, endFreq: 1200, duration: 0.15, volume: 0.2, waveType: 'square' },
    bonk: { type: 'noise', frequency: 150, duration: 0.15, volume: 0.25 },
    ooh: { type: 'sweep', startFreq: 400, endFreq: 500, duration: 0.2, volume: 0.15, waveType: 'sine' },
    squeak: { type: 'pulse', frequency: 1000, pulses: 2, pulseDuration: 0.05, pulseGap: 0.03, duration: 0.16, volume: 0.15, waveType: 'square' },
    yelp: { type: 'sweep', startFreq: 600, endFreq: 900, duration: 0.12, volume: 0.18, waveType: 'triangle' },
    gasp: { type: 'noise', frequency: 400, duration: 0.2, volume: 0.12 },
};
