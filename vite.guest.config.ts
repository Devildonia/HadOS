import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Builds the iframe-process guest as a SELF-CONTAINED CLASSIC (IIFE) script.
 *
 * Why classic instead of an ES module: a process iframe runs with
 * `sandbox="allow-scripts"` and NO `allow-same-origin`, which gives it an opaque
 * origin. ES module fetches are always CORS-checked, and a module requested from
 * an opaque (`null`) origin is refused — that, not the CSP, is what previously
 * forced `allow-same-origin`. Classic scripts execute without a CORS check, so
 * shipping the guest as one inlined IIFE is what lets us drop `allow-same-origin`
 * and get real origin isolation (see docs/webos-roadmap/phase-1-process-model.md).
 *
 * Output goes to `public/` so it is served as-is in dev and copied to `dist/` on
 * build. It is a generated artifact (gitignored) — `predev`/`build` regenerate it.
 */
export default defineConfig({
    // This build only emits the guest bundle; it doesn't need to copy public/ into
    // itself (outDir IS public/), and saying so silences Vite's overlap warning.
    publicDir: false,
    build: {
        outDir: 'public',
        emptyOutDir: false, // public/ holds committed assets — never wipe it
        lib: {
            entry: resolve(__dirname, 'js/sdk/guestBoot.ts'),
            name: 'ProcessGuest',
            formats: ['iife'],
            fileName: () => 'process-guest.js',
        },
        rollupOptions: {
            // The guest must be ONE self-contained file: an opaque-origin document
            // cannot fetch further chunks from our origin.
            output: { inlineDynamicImports: true },
        },
        minify: true,
        sourcemap: false,
    },
});
