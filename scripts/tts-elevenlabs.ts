import fs from 'fs';
import path from 'path';

// Read the key from the environment only — never hardcode a secret. Put it in a
// gitignored `.env` (ELEVENLABS_API_KEY=...) or export it before running.
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
    throw new Error(
        '[ElevenLabs] Missing ELEVENLABS_API_KEY. Set it in a gitignored .env or export it: ' +
        'ELEVENLABS_API_KEY=... npm run generate:demo-video'
    );
}
// Voice: Adam (pNInz6obpgDQGcFmaJgB) or Rachel (21m00Tcm4TlvDq8ikWAM)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

export interface SceneSpeech {
    id: string;
    text: string;
    startTimeSec: number;
}

export async function generateSceneAudios(scenes: SceneSpeech[], outputDir: string): Promise<Array<{ id: string; audioPath: string; startTimeSec: number }>> {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const results: Array<{ id: string; audioPath: string; startTimeSec: number }> = [];

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
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(audioPath, buffer);
            console.log(`[ElevenLabs] Audio saved: ${audioPath} (${buffer.length} bytes)`);

            results.push({
                id: scene.id,
                audioPath,
                startTimeSec: scene.startTimeSec,
            });
        } catch (err) {
            console.error(`[ElevenLabs] Failed to generate audio for '${scene.id}':`, err);
        }
    }

    return results;
}
