/**
 * Resolves an asset path against the application base URL so assets load correctly
 * whether deployed at domain root, under a subdirectory, or from within Web Workers.
 *
 * @param path Asset path (e.g. '/assets/icons/app.webp' or 'assets/icons/app.webp')
 * @returns Fully qualified base-relative asset path
 */
export function getAssetUrl(path: string): string {
    if (!path) return path;

    // Preserve absolute protocol schemes (http:, https:, data:, blob:)
    if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }

    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    // Main thread browser environment
    if (typeof document !== 'undefined' && document.baseURI) {
        return new URL(normalizedPath, document.baseURI).href;
    }

    // Web Worker environment
    if (typeof self !== 'undefined' && self.location && self.location.href) {
        const href = self.location.href;
        const assetsIdx = href.lastIndexOf('/assets/');
        const baseRoot = assetsIdx !== -1
            ? href.substring(0, assetsIdx + 1)
            : href.substring(0, href.lastIndexOf('/') + 1);
        return new URL(normalizedPath, baseRoot).href;
    }

    // Fallback for tests or SSR
    const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL)
        ? import.meta.env.BASE_URL
        : './';

    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${normalizedBase}${normalizedPath}`;
}
