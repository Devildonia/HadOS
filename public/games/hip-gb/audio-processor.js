/**
 * Audio processor for the emulator.
 * Runs in AudioWorkletGlobalScope.
 */
class GameBoyAudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = new Float32Array(16384);
        this.readIdx = 0;
        this.writeIdx = 0;
        this.count = 0;

        this.hdEnabled = false;
        this.hdGain = 1.2;
        this.reverbIntensity = 0.4;
        this.subPunch = 0.5;
        this.reverbTail = new Float32Array(8000).fill(0);
        this.reverbIdx = 0;

        this.port.onmessage = (e) => {
            if (e.data.type === 'samples') {
                const samples = e.data.payload;
                for (let i = 0; i < samples.length; i++) {
                    this.buffer[this.writeIdx] = samples[i];
                    this.writeIdx = (this.writeIdx + 1) % 16384;
                    if (this.count < 16384) this.count++;
                    else this.readIdx = (this.readIdx + 1) % 16384;
                }
            } else if (e.data.type === 'config') {
                this.hdEnabled = e.data.hd;
            } else if (e.data.type === 'params') {
                if (e.data.gain !== undefined) this.hdGain = e.data.gain;
                if (e.data.reverb !== undefined) this.reverbIntensity = e.data.reverb;
                if (e.data.sub !== undefined) this.subPunch = e.data.sub;
            } else if (e.data.type === 'get_metrics') {
                this.port.postMessage({ type: 'metrics', count: this.count });
            }
        };
    }

    process(_inputs, outputs) {
        const out = outputs[0];
        if (!out || out.length < 2) return true;

        const left = out[0];
        const right = out[1];
        const len = left.length;

        for (let i = 0; i < len; i++) {
            let sL = 0;
            let sR = 0;

            if (this.count >= 2) {
                sL = this.buffer[this.readIdx];
                this.readIdx = (this.readIdx + 1) % 16384;
                sR = this.buffer[this.readIdx];
                this.readIdx = (this.readIdx + 1) % 16384;
                this.count -= 2;

                if (this.hdEnabled) {
                    const sub = Math.tanh((sL + sR) * 2.0) * (this.subPunch * 0.8);
                    const delay = this.reverbTail[this.reverbIdx];
                    const feedback = 0.3 + (this.reverbIntensity * 0.5);
                    this.reverbTail[this.reverbIdx] = (sL + sR) * 0.5 + delay * feedback;
                    this.reverbIdx = (this.reverbIdx + 1) % 8000;
                    const reverbMix = this.reverbIntensity * 0.7;
                    sL = (sL * 0.9 + delay * reverbMix + sub * 0.4) * this.hdGain;
                    sR = (sR * 0.9 + delay * reverbMix + sub * 0.4) * this.hdGain;
                }
            }

            left[i] = sL;
            right[i] = sR;
        }

        return true;
    }
}

registerProcessor('gameboy-audio-processor', GameBoyAudioProcessor);
