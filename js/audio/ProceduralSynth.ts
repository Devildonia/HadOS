import { Utils } from '../utils.js';
import type { ISoundConfig, IPlayOptions } from './AudioTypes.js';

// ============================================
// PROCEDURAL SYNTH — motor de síntesis Web Audio
// Extraído de AudioManager. Recibe el AudioContext y el masterGain de forma
// perezosa (getters) para tolerar reinyección de contexto (tests / recreación).
// No mantiene estado propio: solo traduce ISoundConfig → grafo de nodos.
// ============================================

export class ProceduralSynth {
    constructor(
        private readonly getContext: () => AudioContext | null,
        private readonly getMasterGain: () => GainNode | null
    ) {}

    /**
     * Reproduce un sonido procedural según su tipo.
     * @returns true si el tipo era conocido y se sintetizó; false si desconocido.
     */
    public play(config: ISoundConfig, options: IPlayOptions): boolean {
        switch (config.type) {
            case 'sweep':
                this.playSweep(config, options);
                return true;
            case 'tone':
                this.playTone(config, options);
                return true;
            case 'noise':
                this.playNoise(config, options);
                return true;
            case 'pulse':
                this.playPulse(config, options);
                return true;
            case 'vibrato':
                this.playVibrato(config, options);
                return true;
            case 'bubbles':
                this.playBubbles(config, options);
                return true;
            default:
                Utils.Logger.warn(`Unknown sound type: ${config.type}`);
                return false;
        }
    }

    private playSweep(config: ISoundConfig, options: IPlayOptions): void {
        const context = this.getContext();
        const masterGain = this.getMasterGain();
        if (!context || !masterGain) return;
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = config.waveType || 'sine';
        osc.frequency.setValueAtTime(config.startFreq || 440, context.currentTime);

        if (config.midFreq) {
            osc.frequency.exponentialRampToValueAtTime(
                config.midFreq,
                context.currentTime + config.duration / 2
            );
            osc.frequency.exponentialRampToValueAtTime(
                config.endFreq || 880,
                context.currentTime + config.duration
            );
        } else {
            osc.frequency.exponentialRampToValueAtTime(
                config.endFreq || 880,
                context.currentTime + config.duration
            );
        }

        const volume = options.volume || config.volume;
        gain.gain.setValueAtTime(volume, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + config.duration);

        osc.start(context.currentTime);
        osc.stop(context.currentTime + config.duration);
    }

    private playTone(config: ISoundConfig, options: IPlayOptions): void {
        const context = this.getContext();
        const masterGain = this.getMasterGain();
        if (!context || !masterGain) return;
        const osc = context.createOscillator();
        const gain = context.createGain();

        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = config.waveType || 'sine';

        let freq = options.frequency || config.frequency || 440;
        if (config.variations && options.variation !== undefined) {
            const variation = options.variation / config.variations;
            freq *= (0.9 + variation * 0.2);
        }
        osc.frequency.value = freq;

        const volume = options.volume || config.volume;
        gain.gain.setValueAtTime(volume, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + config.duration);

        osc.start(context.currentTime);
        osc.stop(context.currentTime + config.duration);
    }

    private playNoise(config: ISoundConfig, options: IPlayOptions): void {
        const context = this.getContext();
        const masterGain = this.getMasterGain();
        if (!context || !masterGain) return;
        const bufferSize = context.sampleRate * config.duration;
        const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = context.createBufferSource();
        noise.buffer = buffer;

        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = config.frequency || 100;

        const gain = context.createGain();

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        const volume = options.volume || config.volume;
        gain.gain.setValueAtTime(volume, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + config.duration);

        noise.start(context.currentTime);
        noise.stop(context.currentTime + config.duration);
    }

    private playPulse(config: ISoundConfig, options: IPlayOptions): void {
        const context = this.getContext();
        const masterGain = this.getMasterGain();
        if (!context || !masterGain) return;
        const pulses = config.pulses || 1;
        const pulseDuration = config.pulseDuration || 0.1;
        const pulseGap = config.pulseGap || 0.1;

        for (let i = 0; i < pulses; i++) {
            const startTime = context.currentTime + i * (pulseDuration + pulseGap);

            const osc = context.createOscillator();
            const gain = context.createGain();

            osc.connect(gain);
            gain.connect(masterGain);

            osc.type = config.waveType || 'square';
            osc.frequency.value = config.frequency || 440;

            const volume = options.volume || config.volume;
            gain.gain.setValueAtTime(volume, startTime);
            gain.gain.setValueAtTime(0, startTime + pulseDuration);

            osc.start(startTime);
            osc.stop(startTime + pulseDuration);
        }
    }

    private playVibrato(config: ISoundConfig, options: IPlayOptions): void {
        const context = this.getContext();
        const masterGain = this.getMasterGain();
        if (!context || !masterGain) return;
        const osc = context.createOscillator();
        const gain = context.createGain();
        const vibrato = context.createOscillator();
        const vibratoGain = context.createGain();

        const freq = config.frequency || 440;
        vibrato.frequency.value = config.vibratoRate || 5;
        vibratoGain.gain.value = freq * 0.1;

        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = config.waveType || 'sine';
        osc.frequency.value = freq;

        const volume = options.volume || config.volume;
        gain.gain.setValueAtTime(volume, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + config.duration);

        vibrato.start(context.currentTime);
        osc.start(context.currentTime);
        vibrato.stop(context.currentTime + config.duration);
        osc.stop(context.currentTime + config.duration);
    }

    private playBubbles(config: ISoundConfig, options: IPlayOptions): void {
        const context = this.getContext();
        const masterGain = this.getMasterGain();
        if (!context || !masterGain) return;
        const bubbleCount = config.bubbleCount || 5;
        for (let i = 0; i < bubbleCount; i++) {
            const delay = (config.duration / bubbleCount) * i;
            const startTime = context.currentTime + delay;

            const osc = context.createOscillator();
            const gain = context.createGain();

            osc.connect(gain);
            gain.connect(masterGain);

            osc.type = 'sine';
            const freq = (config.baseFreq || 300) + Math.random() * 100;
            osc.frequency.value = freq;

            const volume = (options.volume || config.volume) * 0.5;
            gain.gain.setValueAtTime(volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

            osc.start(startTime);
            osc.stop(startTime + 0.1);
        }
    }
}
