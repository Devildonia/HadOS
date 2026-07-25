import { describe, it, expect, afterEach, vi } from 'vitest';
import { getAssetUrl, withWorkerBase, WORKER_BASE_PARAM } from '../js/utils/url';

/**
 * `base: './'` exists so HadOS can be served from a subdirectory. Vite rewrites
 * the paths it can see statically in index.html; a path built in code is on its
 * own, which is what this resolves. The worker half is the interesting part —
 * there is no `document` to ask.
 */

/** Points `document.baseURI` somewhere for the length of one test. */
function withBaseURI(href: string) {
    const spy = vi.spyOn(document, 'baseURI', 'get').mockReturnValue(href);
    return () => spy.mockRestore();
}

describe('getAssetUrl — main thread', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    it('resolves a root-absolute path against the app base', () => {
        withBaseURI('https://example.test/hados/');
        expect(getAssetUrl('/wasm/ort/')).toBe('https://example.test/hados/wasm/ort/');
        expect(getAssetUrl('/games/ragdoll/assets/audio/boing.opus'))
            .toBe('https://example.test/hados/games/ragdoll/assets/audio/boing.opus');
    });

    it('treats a relative path the same as a root-absolute one', () => {
        withBaseURI('https://example.test/hados/');
        expect(getAssetUrl('assets/icons/app.webp')).toBe(getAssetUrl('/assets/icons/app.webp'));
    });

    it('resolves against the directory when the base names a file', () => {
        withBaseURI('https://example.test/hados/index.html');
        expect(getAssetUrl('/manifest.json')).toBe('https://example.test/hados/manifest.json');
    });

    it('serves the origin root unchanged in shape', () => {
        withBaseURI('https://example.test/');
        expect(getAssetUrl('/ai-runtime.js')).toBe('https://example.test/ai-runtime.js');
    });

    it('leaves URLs that are already absolute alone', () => {
        withBaseURI('https://example.test/hados/');
        for (const url of [
            'https://cdn.example/x.js',
            'http://cdn.example/x.js',
            '//cdn.example/x.js',
            'data:image/png;base64,iVBORw0KGgo=',
            'blob:https://example.test/8f3c-1',
        ]) {
            expect(getAssetUrl(url)).toBe(url);
        }
    });

    it('passes an empty path straight through', () => {
        expect(getAssetUrl('')).toBe('');
    });
});

/**
 * Worker resolution. `self.location` is the only thing a worker knows about where
 * it lives, so these pin both the explicit hand-off and the fallback derivation.
 */
describe('getAssetUrl — worker', () => {
    const asWorker = (href: string) => {
        vi.spyOn(document, 'baseURI', 'get').mockReturnValue('');
        vi.spyOn(self, 'location', 'get').mockReturnValue({ href } as Location);
    };

    afterEach(() => { vi.restoreAllMocks(); });

    it('prefers the base the host attached to the worker URL', () => {
        asWorker(`https://example.test/anywhere/w.js?${WORKER_BASE_PARAM}=https%3A%2F%2Fexample.test%2Fhados%2F`);
        expect(getAssetUrl('/wasm/ort/')).toBe('https://example.test/hados/wasm/ort/');
    });

    it('climbs out of Vite\'s bundle directory when no base was passed', () => {
        // Vite emits bundled workers into <base>/assets/.
        asWorker('https://example.test/hados/assets/asr.worker-a1b2c3.js');
        expect(getAssetUrl('/wasm/ort/')).toBe('https://example.test/hados/wasm/ort/');
    });

    it('stays put for a prebuilt worker that sits at the base', () => {
        asWorker('https://example.test/hados/ai-runtime.js');
        expect(getAssetUrl('/wasm/litert/')).toBe('https://example.test/hados/wasm/litert/');
    });

    it('does not mistake a base that contains "assets" for the bundle directory', () => {
        // The regression that motivated checking only the LAST segment: searching
        // the whole URL for '/assets/' resolved this base to '/'.
        asWorker('https://example.test/assets/app/ai-runtime.js');
        expect(getAssetUrl('/wasm/ort/')).toBe('https://example.test/assets/app/wasm/ort/');
    });

    it('still climbs one level when the base itself contains "assets"', () => {
        asWorker('https://example.test/assets/app/assets/asr.worker-a1b2c3.js');
        expect(getAssetUrl('/wasm/ort/')).toBe('https://example.test/assets/app/wasm/ort/');
    });

    it('falls back to the configured base for a blob worker, which knows nothing', () => {
        // A blob: URL's pathname is an opaque UUID — it says nothing about where the
        // app lives, so there is nothing to derive and inventing an origin would be
        // worse than staying relative. BASE_URL is './' in a build and '/' here.
        asWorker('blob:https://example.test/8f3c-1');
        const configured = import.meta.env.BASE_URL.endsWith('/')
            ? import.meta.env.BASE_URL
            : `${import.meta.env.BASE_URL}/`;
        expect(getAssetUrl('/wasm/ort/')).toBe(`${configured}wasm/ort/`);
        expect(getAssetUrl('/wasm/ort/')).not.toContain('blob:');
    });
});

describe('withWorkerBase', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    it('attaches the current base so the worker need not guess', () => {
        withBaseURI('https://example.test/hados/');
        const url = new URL(withWorkerBase('/ai-runtime.js'));
        expect(url.origin + url.pathname).toBe('https://example.test/ai-runtime.js');
        expect(url.searchParams.get(WORKER_BASE_PARAM)).toBe('https://example.test/hados/');
    });

    it('keeps any query the worker URL already carried', () => {
        withBaseURI('https://example.test/hados/');
        const url = new URL(withWorkerBase('https://example.test/hados/assets/w.js?type=asr'));
        expect(url.searchParams.get('type')).toBe('asr');
        expect(url.searchParams.get(WORKER_BASE_PARAM)).toBe('https://example.test/hados/');
    });

    it('round-trips: what it attaches is what the worker reads back', () => {
        withBaseURI('https://example.test/hados/');
        const href = withWorkerBase('/ai-runtime.js');
        vi.restoreAllMocks();

        vi.spyOn(document, 'baseURI', 'get').mockReturnValue('');
        vi.spyOn(self, 'location', 'get').mockReturnValue({ href } as Location);
        expect(getAssetUrl('/wasm/genai')).toBe('https://example.test/hados/wasm/genai');
    });
});
