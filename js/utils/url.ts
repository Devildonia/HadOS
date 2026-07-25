/**
 * ASSET URL RESOLUTION
 *
 * `vite.config.ts` sets `base: './'` so HadOS can be served from a subdirectory.
 * Vite honours that for anything it can see statically — the `<link>` and
 * `<script>` tags in `index.html` come out of a build rewritten to `./css/…`,
 * `./libs/…` and so on. What it cannot see is a path built at runtime in code,
 * and those were all written root-absolute (`/wasm/ort/`, `/games/…/boing.opus`,
 * `/ai-runtime.js`). Under a subpath they would 404 together.
 *
 * This resolves such a path against the application base. Two environments:
 *
 *   - Main thread: `document.baseURI` is exactly the answer, and it already
 *     accounts for a `<base>` tag if one is ever added.
 *   - Worker: there is no document. The host passes its base in the worker URL
 *     as `?__base=`, and `workerAssetBase()` below falls back to deriving it from
 *     the worker's own location when that parameter is absent.
 */

/** Query parameter the host uses to hand a worker the application base URL. */
export const WORKER_BASE_PARAM = '__base';

/**
 * Appends the current base to a worker URL so the worker can resolve assets.
 * Call it on the host side; a worker started without it falls back to a guess.
 */
export function withWorkerBase(workerUrl: string | URL): string {
    const base = (typeof document !== 'undefined' && document.baseURI) ? document.baseURI : '';
    const url = new URL(String(workerUrl), base || undefined);
    if (base) url.searchParams.set(WORKER_BASE_PARAM, base);
    return url.href;
}

/**
 * The application base as seen from inside a worker.
 *
 * Prefers the explicit `?__base=` the host attached. Without it, derives the base
 * from the worker's own URL: Vite emits bundled workers into `<base>/assets/`, so
 * a worker whose immediate parent directory is `assets` sits one level below the
 * base; anything else (a prebuilt worker in `public/`, like `ai-runtime.js`) sits
 * directly at it.
 *
 * The derivation deliberately checks only the LAST path segment. Searching the
 * whole URL for `/assets/` — the first version of this — broke an app deployed at
 * a path that itself contains one: `/assets/app/ai-runtime.js` resolved its base
 * to `/` rather than `/assets/app/`.
 */
function workerAssetBase(): string | null {
    if (typeof self === 'undefined' || !self.location?.href) return null;

    let url: URL;
    try {
        url = new URL(self.location.href);
    } catch {
        return null;
    }

    const explicit = url.searchParams.get(WORKER_BASE_PARAM);
    if (explicit) return explicit;

    // A blob: worker's pathname is an opaque UUID that says nothing about where
    // the app lives, so there is nothing to derive. The caller falls through.
    if (url.protocol === 'blob:') return null;

    const segments = url.pathname.split('/');
    segments.pop();                                                  // the worker file itself
    if (segments[segments.length - 1] === 'assets') segments.pop();  // Vite's bundle directory
    return new URL(`${segments.join('/')}/`, url.origin).href;
}

/**
 * Resolves an asset path against the application base URL.
 *
 * @param path Asset path (`/assets/icons/app.webp` or `assets/icons/app.webp`)
 * @returns An absolute URL, or the input untouched if it was already absolute
 */
export function getAssetUrl(path: string): string {
    if (!path) return path;

    // Already absolute — a CDN URL, a data: image, an object URL. Leave it alone.
    if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) {
        return path;
    }

    const relativePath = path.startsWith('/') ? path.slice(1) : path;

    if (typeof document !== 'undefined' && document.baseURI) {
        return new URL(relativePath, document.baseURI).href;
    }

    const workerBase = workerAssetBase();
    if (workerBase) return new URL(relativePath, workerBase).href;

    // No document and no usable worker location (jsdom without a URL, SSR, a blob
    // worker). Stay relative rather than inventing an origin — `BASE_URL` is './'
    // in a build, which is correct here precisely because there is nothing to
    // resolve against.
    const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${normalizedBase}${relativePath}`;
}
