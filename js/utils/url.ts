/**
 * Resolves an asset path against Vite's BASE_URL so assets load correctly
 * whether deployed at domain root or under a subdirectory.
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

    const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL)
        ? import.meta.env.BASE_URL
        : './';

    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    return `${normalizedBase}${normalizedPath}`;
}
