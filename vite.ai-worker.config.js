import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Builds the `ai-runtime` process as a SELF-CONTAINED CLASSIC (IIFE) worker script.
 *
 * Why classic instead of an ES module, unlike every other process in HadOS:
 * LiteRT's loader (`@litertjs/wasm-utils`'s `runScript`) has exactly two paths —
 * `importScripts()` when it exists, else a `document.createElement('script')` that
 * needs a DOM. A module worker satisfies neither: `importScripts` IS defined there,
 * so the feature check passes, and then calling it throws
 * "Module scripts don't support importScripts()". So LiteRT can run on the main
 * thread or in a classic worker, and inference does not belong on the main thread.
 *
 * Why a separate config rather than Vite's own worker bundling: in dev, Vite serves
 * `new Worker(new URL(...))` as raw transformed TS at `?worker_file&type=classic`
 * WITHOUT bundling it, so the ES `import` statements are a syntax error the moment
 * the worker is spawned classic. Building it ourselves gives one file that behaves
 * identically in dev and prod.
 *
 * Same shape as vite.guest.config.js, and for a related reason: both are scripts
 * that must not be ES modules. Output goes to `public/` so it is served as-is in dev
 * and copied to `dist/` on build. It is a generated artifact (gitignored) —
 * `predev`/`build` regenerate it.
 */
export default defineConfig({
    // outDir IS public/, so this build must not also copy public/ into itself.
    publicDir: false,
    build: {
        outDir: 'public',
        emptyOutDir: false, // public/ holds committed assets — never wipe it
        lib: {
            entry: resolve(__dirname, 'js/workers/ai.worker.ts'),
            name: 'AiRuntime',
            formats: ['iife'],
            fileName: () => 'ai-runtime.js',
        },
        rollupOptions: {
            // One self-contained file: a classic worker cannot import chunks.
            output: { inlineDynamicImports: true },
        },
        minify: true,
        sourcemap: false,
    },
});
