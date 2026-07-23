/**
 * Copies onnxruntime-web's wasm runtime into public/wasm/ort for the PRODUCTION
 * build: the asr-runtime worker sets `wasmPaths` there, keeping ort off its
 * default CDN (jsDelivr). In dev, Vite serves node_modules directly and refuses
 * to module-import public/ files, so dev uses the node_modules path instead —
 * see ORT_WASM_BASE in js/ai/AsrEngine.ts. The source is the exact version
 * @huggingface/transformers pins, because it resolves from node_modules.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'node_modules', 'onnxruntime-web', 'dist');
const DEST = path.join(root, 'public', 'wasm', 'ort');

// Only the runtime pairs the browser can actually load — dist/ carries many more.
// ort picks a variant at runtime (plain, jsep for WebGPU, asyncify or jspi for
// the wasm backend), so all four loaders+binaries must be served.
const WANTED = /^ort-wasm-simd-threaded(\.(jsep|asyncify|jspi))?\.(wasm|mjs)$/;

if (!fs.existsSync(SRC)) {
    console.warn(`[ort] ${path.relative(root, SRC)} not found — skipping wasm copy (run npm install).`);
    process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });

let copied = 0;
let skipped = 0;
for (const name of fs.readdirSync(SRC)) {
    if (!WANTED.test(name)) continue;
    const from = path.join(SRC, name);
    const to = path.join(DEST, name);

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

console.log(`[ort] wasm runtime ready in public/wasm/ort (${copied} copied, ${skipped} up to date)`);
