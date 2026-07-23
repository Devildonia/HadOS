/**
 * Copies MediaPipe GenAI's wasm runtime into public/ so the ai-runtime worker can
 * load it same-origin (FilesetResolver.forGenAiTasks('/wasm/genai')). Same shape
 * and reasoning as copy-litert-wasm.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'node_modules', '@mediapipe', 'tasks-genai', 'wasm');
const DEST = path.join(root, 'public', 'wasm', 'genai');

if (!fs.existsSync(SRC)) {
    console.warn(`[genai] ${path.relative(root, SRC)} not found — skipping wasm copy (run npm install).`);
    process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });

let copied = 0;
let skipped = 0;
for (const name of fs.readdirSync(SRC)) {
    const from = path.join(SRC, name);
    const to = path.join(DEST, name);
    if (!fs.statSync(from).isFile()) continue;

    const src = fs.statSync(from);
    if (fs.existsSync(to)) {
        const dst = fs.statSync(to);
        if (dst.size === src.size && dst.mtimeMs >= src.mtimeMs) {
            skipped++;
            continue;
        }
    }
    fs.copyFileSync(from, to);
    copied++;
}

console.log(`[genai] wasm runtime ready in public/wasm/genai (${copied} copied, ${skipped} up to date)`);
