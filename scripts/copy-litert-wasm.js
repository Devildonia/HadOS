/**
 * Copies LiteRT.js's Wasm runtime out of node_modules and into public/, where the
 * dev server and `vite build` both serve it from our own origin.
 *
 * Why not the CDN (`loadLiteRt('https://cdn.jsdelivr.net/...')`): it would need CSP
 * entries for a third party and would break the PWA offline. Self-hosting keeps
 * `connect-src 'self'` sufficient for the runtime.
 *
 * Why not commit the files: they are ~36 MB across the four builds (this project has
 * been burned by a committed 21 MB zip before). They are gitignored and regenerated
 * from the lockfile on every install/dev/build, so the repo stays lean and the bytes
 * always match the pinned @litertjs/core version.
 *
 * All four builds ship because `loadLiteRt(dir)` feature-detects the browser and
 * picks one (plain / threaded / JSPI / compat) — which one depends on the visitor,
 * so the choice cannot be made here. They are excluded from the PWA precache
 * (see vite.config.js): a visitor who never touches AI must not download them.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'node_modules', '@litertjs', 'core', 'wasm');
const DEST = path.join(root, 'public', 'wasm', 'litert');

if (!fs.existsSync(SRC)) {
    // Not fatal: someone may be running a task that has no need for the runtime.
    // Failing the build here would block `npm test` on a missing optional asset.
    console.warn(`[litert] ${path.relative(root, SRC)} not found — skipping wasm copy (run npm install).`);
    process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });

let copied = 0;
let skipped = 0;
for (const name of fs.readdirSync(SRC)) {
    const from = path.join(SRC, name);
    const to = path.join(DEST, name);
    if (!fs.statSync(from).isFile()) continue;

    // Skip unchanged files: these are 8.5 MB each, and re-copying all four on every
    // `npm run dev` would add seconds to a hot restart for no reason.
    const src = fs.statSync(from);
    if (fs.existsSync(to)) {
        const dst = fs.statSync(to);
        if (dst.size === src.size && dst.mtimeMs >= src.mtimeMs) { skipped++; continue; }
    }
    fs.copyFileSync(from, to);
    copied++;
}

console.log(`[litert] wasm runtime ready in public/wasm/litert (${copied} copied, ${skipped} up to date)`);
