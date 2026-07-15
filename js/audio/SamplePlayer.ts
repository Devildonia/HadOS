import { CONFIG } from '../config.js';
import { Utils } from '../utils.js';
import type { IPlayOptions } from './AudioTypes.js';

// ============================================
// SAMPLE PLAYER — reproducción de audio basado en ficheros
// Extraído de AudioManager. Gestiona los buffers decodificados (WebAudio) y
// el fallback HTML5 <audio>. Depende del AudioContext / masterGain de la
// fachada mediante getters perezosos y de un callback de inicialización.
// ============================================

export class SamplePlayer {
    public readonly audioBuffers: Map<string, AudioBuffer> = new Map();
    public readonly htmlAudio: Map<string, HTMLAudioElement> = new Map();

    constructor(
        private readonly getContext: () => AudioContext | null,
        private readonly getMasterGain: () => GainNode | null,
        private readonly ensureInit: () => void,
        private readonly getMuted: () => boolean
    ) {}

    public hasSample(name: string): boolean {
        return this.audioBuffers.has(name) || this.htmlAudio.has(name);
    }

    public async loadSound(name: string, url: string): Promise<void> {
        if (!this.getContext()) {
            try { this.ensureInit(); } catch { /* ignore */ }
        }

        const isLocal = typeof window !== 'undefined' && window.location.protocol === 'file:';
        const context = this.getContext();

        if (!isLocal && context) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await context.decodeAudioData(arrayBuffer);
                this.audioBuffers.set(name, audioBuffer);
                Utils.Logger.audio(`Loaded sound file (WebAudio): ${name}`);
                return;
            } catch (error) {
                Utils.Logger.warn(`Failed to load sound ${name} via WebAudio, trying HTML5 Audio fallback...`, error);
            }
        } else {
            Utils.Logger.audio(`Local protocol detected or context missing. Using HTML5 Audio for: ${name}`);
        }

        const audio = new Audio(url);
        audio.addEventListener('canplaythrough', () => {
            if (!this.htmlAudio.has(name)) {
                Utils.Logger.audio(`Loaded sound file (HTML5): ${name}`);
            }
            this.htmlAudio.set(name, audio);
        });
        audio.addEventListener('error', (e) => {
            Utils.Logger.error(`Failed to load sound ${name} via HTML5 Audio`, e);
        });

        this.htmlAudio.set(name, audio);
    }

    public playBuffer(name: string, options: IPlayOptions): boolean {
        const context = this.getContext();
        const masterGain = this.getMasterGain();
        if (!context || !masterGain) return false;
        const buffer = this.audioBuffers.get(name);
        if (!buffer) return false;

        const source = context.createBufferSource();
        source.buffer = buffer;

        const gainNode = context.createGain();
        gainNode.gain.value = options.volume ?? 0.5;

        source.connect(gainNode);
        gainNode.connect(masterGain);

        source.start(0);
        return true;
    }

    public playHTML5(name: string, options: IPlayOptions): boolean {
        const audio = this.htmlAudio.get(name);
        if (!audio) return false;

        const sound = audio.cloneNode() as HTMLAudioElement;
        sound.volume = (options.volume ?? 0.5) * (CONFIG.AUDIO?.MASTER_VOLUME ?? 1);

        if (this.getMuted()) sound.volume = 0;

        sound.play().catch(e => Utils.Logger.error('HTML5 Play failed', e));
        return true;
    }
}
