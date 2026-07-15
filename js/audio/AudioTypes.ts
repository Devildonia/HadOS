// ============================================
// AUDIO TYPES — contratos compartidos del subsistema de audio
// Extraídos de AudioManager.ts para que SoundLibrary, ProceduralSynth
// y SamplePlayer puedan tiparse sin depender de la fachada (evita ciclos).
// ============================================

export interface ISoundConfig {
    type: 'tone' | 'sweep' | 'noise' | 'pulse' | 'vibrato' | 'bubbles';
    frequency?: number;
    startFreq?: number;
    endFreq?: number;
    midFreq?: number;
    duration: number;
    volume: number;
    waveType?: OscillatorType;
    pulses?: number;
    pulseDuration?: number;
    pulseGap?: number;
    vibratoRate?: number;
    baseFreq?: number;
    bubbleCount?: number;
    variations?: number;
    loop?: boolean;
}

export interface IPlayOptions {
    volume?: number;
    frequency?: number;
    variation?: number;
}

export interface IAudioManager {
    init(): void;
    registerSound(name: string, config: ISoundConfig): void;
    loadSound(name: string, url: string): Promise<void>;
    play(name: string, options?: IPlayOptions): boolean;
    setMute(muted: boolean): void;
    setVolume(volume: number): void;
    setEnabled(enabled: boolean): void;
    cleanup(): void;
}
