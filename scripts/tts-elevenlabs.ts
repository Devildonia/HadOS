import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

// The key is read from the environment ONLY, and lazily (at call time) — never
// hardcode a secret, and never read it at import time, since the caller loads
// `.env` after the imports are evaluated. Put it in a gitignored `.env`
// (ELEVENLABS_API_KEY=...) or export it before running.
const apiKey = () => process.env.ELEVENLABS_API_KEY;
// Voice: Adam (pNInz6obpgDQGcFmaJgB) or Rachel (21m00Tcm4TlvDq8ikWAM)
const voiceId = () => process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
const modelId = () => process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

/** A line of narration to synthesize. */
export interface SceneText {
    id: string;
    text: string;
}

/** A synthesized clip. `startTimeSec` is filled in later, from the recording. */
export interface GeneratedClip {
    id: string;
    audioPath: string;
    durationSec: number;
}

/** True when a key is present, so callers can gracefully skip the voiceover. */
export function hasElevenLabsKey(): boolean {
    return !!apiKey();
}

/** Probe an mp3's duration with ffprobe; 0 if it can't be read. */
function probeDurationSec(file: string): number {
    try {
        const out = execFileSync('ffprobe', [
            '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', file,
        ], { encoding: 'utf8' });
        const d = parseFloat(out.trim());
        return Number.isFinite(d) ? d : 0;
    } catch {
        return 0;
    }
}

export async function generateSceneAudios(scenes: SceneText[], outputDir: string): Promise<GeneratedClip[]> {
    const key = apiKey();
    if (!key) {
        console.warn('[ElevenLabs] No ELEVENLABS_API_KEY — skipping voiceover (video will be silent, subtitles only).');
        return [];
    }
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const results: GeneratedClip[] = [];

    for (const scene of scenes) {
        const audioPath = path.join(outputDir, `${scene.id}.mp3`);
        console.log(`[ElevenLabs] Generating audio for scene '${scene.id}'...`);

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId()}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': key,
                },
                body: JSON.stringify({
                    text: scene.text,
                    model_id: modelId(),
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
            }

            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(audioPath, buffer);
            const durationSec = probeDurationSec(audioPath);
            console.log(`[ElevenLabs] Saved ${audioPath} (${buffer.length} bytes, ${durationSec.toFixed(2)}s)`);

            results.push({ id: scene.id, audioPath, startTimeSec: scene.startTimeSec, durationSec });
        } catch (err) {
            console.error(`[ElevenLabs] Failed for '${scene.id}':`, err);
        }
    }

    return results;
}
