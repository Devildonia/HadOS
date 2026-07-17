/**
 * Sanitizes a file/folder name for VFS operations
 * Removes dangerous characters that could cause path traversal or XSS
 * @param {string} name - File or folder name
 * @returns {string} Sanitized name
 */
export function sanitizePath(name: string): string {
    if (typeof name !== 'string') return '';
    return name
        .replace(/[<>:"/\\|?*]/g, '_')  // Remove filesystem-dangerous chars
        .replace(/\.\./g, '_')           // Prevent path traversal
        .replace(/^\s+|\s+$/g, '')       // Trim whitespace
        .substring(0, 255);              // Max length
}

/** Splits a VFS path into segments, treating `/` and `\` alike. */
export function pathSegments(path: string): string[] {
    if (typeof path !== 'string') return [];
    return path.replace(/\//g, '\\').split('\\').filter(Boolean);
}

/**
 * True when any segment is `..` — i.e. the path attempts directory traversal.
 * Callers must REJECT such paths at the boundary rather than rely on how the VFS
 * happens to resolve them (today `VFS.resolve` treats `..` as a literal name, so
 * traversal fails by accident, not by design).
 */
export function hasTraversal(path: string): boolean {
    return pathSegments(path).some(seg => seg === '..');
}

/**
 * True when `path` is a safe *relative* path usable as a key inside a package or
 * an app home: no `..` segments, no drive prefix (`C:`) and no leading separator
 * (both of which would make it absolute).
 */
export function isSafeRelativePath(path: string): boolean {
    if (typeof path !== 'string' || !path.trim()) return false;
    if (/^[a-z]:/i.test(path)) return false;   // drive prefix -> absolute
    if (/^[\\/]/.test(path)) return false;     // leading separator -> absolute
    return !hasTraversal(path);
}

/**
 * Normalizes an absolute VFS path for comparison: unifies separators, drops
 * empty segments and trailing separators. Does NOT resolve `..` — use
 * hasTraversal() to reject those first.
 */
export function normalizeVfsPath(path: string): string {
    const segs = pathSegments(path);
    return segs.join('\\');
}
