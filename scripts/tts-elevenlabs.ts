import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

// Read the key from the environment only — never hardcode a secret. Put it in a
// gitignored `.env` (ELEVENLABS_API_KEY=...) or export it before running.
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Voice: Adam (pNInz6obpgDQGcFmaJgB) or Rachel (21m00Tcm4TlvDq8ikWAM)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

export interface SceneSpeech {
    id: string;
    text: string;
    startTimeSec: number;
}

export interface GeneratedClip {
    id: string;
    audioPath: string;
    startTimeSec: number;
    durationSec: number;
}

/** True when a key is present, so callers can gracefully skip the voiceover. */
export function hasElevenLabsKey(): boolean {
    return !!ELEVENLABS_API_KEY;
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

export async function generateSceneAudios(scenes: SceneSpeech[], outputDir: string): Promise<GeneratedClip[]> {
    if (!ELEVENLABS_API_KEY) {
        console.warn('[ElevenLabs] No ELEVENLABS_API_KEY — skipping voiceover (video will be silent, subtitles only).');
        return [];
    }
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const results: GeneratedClip[] = [];

    for (const scene of scenes) {
        const audioPath = path.join(outputDir, `${scene.id}.mp3`);
        console.log(`[ElevenLabs] Generating audio for scene '${scene.id}'...`);

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text: scene.text,
                    model_id: MODEL_ID,
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
