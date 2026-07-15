import { CONFIG } from '../config.js';
import { Utils } from '../utils.js';
import { Services } from '../core/ServiceContainer.js';
import type { ISoundConfig, IPlayOptions, IAudioManager } from './AudioTypes.js';
import { DEFAULT_SOUNDS } from './SoundLibrary.js';
import { ProceduralSynth } from './ProceduralSynth.js';
import { SamplePlayer } from './SamplePlayer.js';

// ============================================
// AUDIO MANAGER - Singleton (fachada)
// Coordina estado (mute/volume/enabled), ciclo de vida del AudioContext y
// enruta play() entre samples (SamplePlayer) y síntesis (ProceduralSynth).
// El catálogo de sonidos vive en SoundLibrary.
// v2.0.0 (TypeScript, descompuesto)
// ============================================

// Re-export de los tipos para compatibilidad con importadores previos.
export type { ISoundConfig, IPlayOptions, IAudioManager } from './AudioTypes.js';

class AudioManager implements IAudioManager {
    private static instance: AudioManager | null = null;

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isEnabled: boolean = true;
    private isMuted: boolean = false;
    private sounds: Map<string, ISoundConfig> = new Map();
    private initialized: boolean = false;
    /** Guards against re-registering the ResourceManager disposer if a first
     *  init() throws after registration and init() is later retried. */
    private disposerRegistered: boolean = false;

    // definite assignment (`!`): en el camino de early-return del singleton el
    // constructor no llega a asignarlos, pero en ese caso devolvemos la instancia
    // existente (que sí los tiene), así que nunca se usan sin inicializar.
    private readonly synth!: ProceduralSynth;
    private readonly samplePlayer!: SamplePlayer;

    public constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }
        this.isEnabled = CONFIG.AUDIO?.ENABLED ?? true;

        this.synth = new ProceduralSynth(
            () => this.context,
            () => this.masterGain
        );
        this.samplePlayer = new SamplePlayer(
            () => this.context,
            () => this.masterGain,
            () => this.init(),
            () => this.isMuted
        );

        Utils.Logger.audio('AudioManager instance created');
    }

    // ── Maps de samples expuestos para retro-compatibilidad (tests + legacy) ──
    private get audioBuffers(): Map<string, AudioBuffer> {
        return this.samplePlayer.audioBuffers;
    }
    private get htmlAudio(): Map<string, HTMLAudioElement> {
        return this.samplePlayer.htmlAudio;
    }

    public init(): void {
        if (this.initialized) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('Web Audio API not supported');
            }

            this.context = new AudioContextClass();
            if (this.context) {
                this.masterGain = this.context.createGain();
                this.masterGain.connect(this.context.destination);
                this.masterGain.gain.value = CONFIG.AUDIO?.MASTER_VOLUME || 0.3;

                const resManager = Services.get('ResourceManager');
                if (resManager && !this.disposerRegistered) {
                    this.disposerRegistered = true;
                    resManager.register('audio-manager', 'audio', {
                        dispose: () => {
                            if (this.masterGain) {
                                try {
                                    this.masterGain.disconnect();
                                } catch (_) {}
                            }
                            if (this.context && this.context.state !== 'closed') {
                                this.context.close().catch(() => {});
                            }
                        }
                    });
                }

                this.registerSounds();
                this.initialized = true;

                Utils.Logger.audio('AudioManager initialized successfully');
            }
        } catch (error) {
            Utils.Logger.error('Failed to initialize AudioManager:', error);
            this.isEnabled = false;
        }
    }

    private registerSounds(): void {
        for (const [name, config] of Object.entries(DEFAULT_SOUNDS)) {
            this.registerSound(name, config);
        }
        Utils.Logger.audio(`Registered ${this.sounds.size} procedural sounds`);
    }

    public registerSound(name: string, config: ISoundConfig): void {
        this.sounds.set(name, config);
    }

    public loadSound(name: string, url: string): Promise<void> {
        return this.samplePlayer.loadSound(name, url);
    }

    public play(name: string, options: IPlayOptions = {}): boolean {
        if (!this.isEnabled || this.isMuted) return false;

        if (!this.initialized) {
            this.init();
        }

        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }

        if (this.audioBuffers.has(name)) {
            return this.playBuffer(name, options);
        }

        if (this.htmlAudio.has(name)) {
            return this.playHTML5(name, options);
        }

        const config = this.sounds.get(name);
        if (!config) {
            Utils.Logger.warn(`Sound "${name}" not found`);
            return false;
        }

        try {
            return this.synth.play(config, options);
        } catch (error) {
            Utils.Logger.error(`Error playing sound "${name}":`, error);
            return false;
        }
    }

    // Delegaciones finas hacia SamplePlayer. Se mantienen como métodos de
    // instancia (en vez de inlinear) para preservar el contrato de spy de los
    // tests (`vi.spyOn(am, 'playBuffer')`) y posibles llamadores legacy.
    private playBuffer(name: string, options: IPlayOptions): boolean {
        return this.samplePlayer.playBuffer(name, options);
    }

    private playHTML5(name: string, options: IPlayOptions): boolean {
        return this.samplePlayer.playHTML5(name, options);
    }

    public setMute(muted: boolean): void {
        this.isMuted = muted;
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : (CONFIG.AUDIO?.MASTER_VOLUME || 0.3);
        }
        Utils.Logger.audio(`Audio ${muted ? 'muted' : 'unmuted'}`);
    }

    public setVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = clampedVolume;
        }
        Utils.Logger.audio(`Volume set to ${clampedVolume}`);
    }

    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
        Utils.Logger.audio(`Audio ${enabled ? 'enabled' : 'disabled'}`);
    }

    public cleanup(): void {
        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.disposeOwner('audio-manager');
        } else {
            if (this.context && this.context.state !== 'closed') {
                this.context.close();
            }
        }
        this.initialized = false;
        this.disposerRegistered = false;
        Utils.Logger.audio('AudioManager cleaned up');
    }

    public static __resetForTesting(): void {
        AudioManager.instance = null;
    }

    public __injectContext(mockCtx: any): void {
        this.context = mockCtx;
        this.masterGain = mockCtx.createGain();
        if (this.masterGain) {
            this.masterGain.connect(mockCtx.destination);
            this.masterGain.gain.value = CONFIG.AUDIO?.MASTER_VOLUME || 0.3;
        }
        if (this.sounds.size === 0) this.registerSounds();
        this.initialized = true;
        this.isEnabled = true;
    }
}

const audioManager = AudioManager.getInstance();

export { AudioManager };

if (typeof window !== 'undefined') {
    Services.register('AudioManager', audioManager);
}
