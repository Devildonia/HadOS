/**
 * APP PACKAGE FORMAT (Fase 4)
 * A `.wapp` package is a manifest (`app.json`) plus the app's files. It is
 * represented here as an already-parsed envelope so the container format is
 * swappable: today packages are JSON envelopes; a zip loader can be added later
 * without touching the PackageManager (it only ever sees `AppPackage`).
 *
 * The manifest declares the capabilities the app may request — that list is the
 * ceiling the PermissionBroker enforces (the user still consents at first use).
 */

/** Capabilities an app may declare. Mirrors the PermissionBroker's vocabulary. */
import { Utils } from '../utils';

/** List of verified system capabilities matching permission keys. */
export const KNOWN_PERMISSIONS = ['fs:read', 'fs:write', 'notify', 'net', 'ai:infer'] as const;

/**
 * Representation of an application's JSON package manifest metadata.
 */
export interface AppManifest {
    /** Unique app id; also its home dir name (C:\APPS\<id>). */
    id: string;
    /** The readable display name of the application. */
    name: string;
    /** Semver x.y.z — used to decide install vs update and reject downgrades. */
    version: string;
    /** Entry file within the package (the guest document/script). */
    entry: string;
    /** Icon string or image path for shortcut representation. */
    icon?: string;
    /** Optional detailed description of the application. */
    description?: string;
    /** Capabilities the app may request at runtime (the permission ceiling). */
    permissions?: string[];
}

/**
 * Represents a parsed application installation package wrapper.
 */
export interface AppPackage {
    /** Package manifest configuration data. */
    manifest: AppManifest;
    /** Relative path mappings within the package mapping to file text contents. */
    files: Record<string, string>;
}

/** Regular expression validation identifier matching safe package ID constraints. */
const ID_RE = /^[a-z0-9-]+$/;
/** Regular expression matching semver structure. */
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

/**
 * Validates a parsed manifest object structure against type and semver rules.
 * @param m Target manifest object structure.
 */
export function validateManifest(m: unknown): { ok: boolean; error?: string } {
    if (!m || typeof m !== 'object') return { ok: false, error: 'manifest must be an object' };
    const x = m as Partial<AppManifest>;

    if (typeof x.id !== 'string' || !ID_RE.test(x.id)) {
        return { ok: false, error: 'manifest.id must match ^[a-z0-9-]+$' };
    }
    if (typeof x.name !== 'string' || !x.name.trim()) {
        return { ok: false, error: 'manifest.name is required' };
    }
    if (typeof x.version !== 'string' || !SEMVER_RE.test(x.version)) {
        return { ok: false, error: 'manifest.version must be semver x.y.z' };
    }
    if (typeof x.entry !== 'string' || !x.entry.trim()) {
        return { ok: false, error: 'manifest.entry is required' };
    }
    if (!Utils.isSafeRelativePath(x.entry)) {
        return { ok: false, error: `manifest.entry must be a safe relative path: ${x.entry}` };
    }
    if (x.permissions !== undefined) {
        if (!Array.isArray(x.permissions)) {
            return { ok: false, error: 'manifest.permissions must be an array' };
        }
        const unknown = x.permissions.find(p => !(KNOWN_PERMISSIONS as readonly string[]).includes(p));
        if (unknown) return { ok: false, error: `unknown permission: ${unknown}` };
    }
    return { ok: true };
}

/**
 * Validates the contents, files list, and path specifications inside an AppPackage.
 * @param pkg Target package object structure.
 */
export function validatePackage(pkg: unknown): { ok: boolean; error?: string } {
    if (!pkg || typeof pkg !== 'object') return { ok: false, error: 'package must be an object' };
    const p = pkg as Partial<AppPackage>;
    const m = validateManifest(p.manifest);
    if (!m.ok) return m;
    if (!p.files || typeof p.files !== 'object') return { ok: false, error: 'package.files is required' };

    // Every file key must be a safe RELATIVE path. Reject `..` segments, drive
    // prefixes and leading separators at this boundary so a package can never
    // write outside its own home, regardless of how the VFS resolves paths.
    for (const key of Object.keys(p.files)) {
        if (!Utils.isSafeRelativePath(key)) {
            return { ok: false, error: `unsafe file path in package: ${key}` };
        }
    }

    const entry = (p.manifest as AppManifest).entry;
    if (!(entry in p.files)) return { ok: false, error: `package.files is missing the entry "${entry}"` };
    return { ok: true };
}

/**
 * Compares two semantic version strings.
 * @param a First version string.
 * @param b Second version string.
 * @returns -1 if a < b, 0 if equal, 1 if a > b.
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        const x = pa[i] ?? 0;
        const y = pb[i] ?? 0;
        if (x > y) return 1;
        if (x < y) return -1;
    }
    return 0;
}

/**
 * Generates a SHA-256 hash or deterministic FNV-1a hash representation of the package contents to verify integrity.
 * @param pkg Target application package.
 */
export async function packageIntegrity(pkg: AppPackage): Promise<string> {
    const json = JSON.stringify({ manifest: pkg.manifest, files: pkg.files });
    const subtle = globalThis.crypto?.subtle;
    if (subtle) {
        const bytes = new TextEncoder().encode(json);
        const digest = await subtle.digest('SHA-256', bytes);
        return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback: FNV-1a — not cryptographic, only a change detector.
    let h = 0x811c9dc5;
    for (let i = 0; i < json.length; i++) {
        h ^= json.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return `fnv1a-${h.toString(16)}`;
}
