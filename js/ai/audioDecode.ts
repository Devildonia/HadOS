/**
 * AUDIO DECODE (main-thread helper)
 * Whisper wants 16 kHz mono Float32 samples. Workers have no AudioContext, so
 * decoding and resampling happen here — both are native and fast — and only the
 * raw samples cross into the asr-runtime process.
 */

/** Whisper's expected sample rate. */
export const ASR_SAMPLE_RATE = 16000;

/**
 * Decodes any browser-supported media container to 16 kHz mono samples.
 * OfflineAudioContext does the resampling; channels are mixed by connecting a
 * multi-channel source to a mono destination (the Web Audio down-mix rules).
 */
export async function decodeTo16kMono(data: ArrayBuffer): Promise<Float32Array> {
    type AC = typeof AudioContext;
    const Ctx: AC | undefined = (globalThis as { AudioContext?: AC; webkitAudioContext?: AC }).AudioContext
        ?? (globalThis as { webkitAudioContext?: AC }).webkitAudioContext;
    if (!Ctx || typeof OfflineAudioContext === 'undefined') {
        throw new Error('asr: Web Audio is not available in this environment');
    }

    const ctx = new Ctx();
    let decoded: AudioBuffer;
    try {
        decoded = await ctx.decodeAudioData(data);
    } finally {
        void ctx.close?.();
    }
    if (!decoded.duration) throw new Error('asr: the file contains no decodable audio');

    const frames = Math.ceil(decoded.duration * ASR_SAMPLE_RATE);
    const offline = new OfflineAudioContext(1, frames, ASR_SAMPLE_RATE);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();

    const rendered = await offline.startRendering();
    // slice(): detach from the rendering buffer so it can be GC'd/transferred.
    return rendered.getChannelData(0).slice();
}
