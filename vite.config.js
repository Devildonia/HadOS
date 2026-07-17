import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      injectRegister: null, // Register is handled manually in index.html
      manifest: false,      // Use existing public/manifest.json
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,opus,mp3,woff2,ttf}'],
        // The LiteRT runtime is ~36 MB across its four builds and only one is ever
        // loaded — feature-detected per browser, on first use of an AI feature. The
        // .wasm files already fall outside globPatterns and the size cap, but their
        // loader .js siblings would match: precaching those would make every install
        // pay for AI it may never touch, and cache three loaders that never run.
        globIgnores: ['**/wasm/litert/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        rollupOptions: {
          output: {
            entryFileNames: 'sw.js'
          }
        }
      }
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: 'hidden',  // Sprint 1 bonus: source maps sin exponerlos públicamente
    rollupOptions: {
      input: {
        // The iframe-process guest is NOT an input here: it lives in public/ and is
        // built separately as a classic IIFE (see vite.guest.config.js) so it can run
        // in an opaque-origin sandbox.
        main: 'index.html'
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    exclude: ['test/e2e/**', 'node_modules/**'],
  }
});

