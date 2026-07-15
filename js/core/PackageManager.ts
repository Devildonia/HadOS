/**
 * PACKAGE MANAGER (Fase 4)
 * Installs, updates and uninstalls app packages, keeping a local registry in the
 * VFS. An app's files land in its own home dir (C:\APPS\<id>) — the same
 * namespace its processes are confined to (Fase 3) — and the manifest's declared
 * permissions become the ceiling the PermissionBroker enforces.
 *
 * Versioning: installing an equal or older version is refused; a newer version
 * replaces the previous files (clean update). Uninstall removes the home dir,
 * the registry entry and every permission grant for the app.
 */

import { VFS } from './VFS';
import { Utils } from './../utils';
import { PermissionBroker } from './PermissionBroker';
import {
    compareVersions, packageIntegrity, validatePackage,
    type AppManifest, type AppPackage,
} from './AppPackage';

const REGISTRY_DIR = 'C:\\WINDOWS\\SYSTEM';
const REGISTRY_NAME = 'packages.json';
const REGISTRY_PATH = `${REGISTRY_DIR}\\${REGISTRY_NAME}`;
const APPS_ROOT = 'C:\\APPS';

export interface InstalledApp {
    manifest: AppManifest;
    /** ISO timestamp of the last install/update. */
    installedAt: string;
    /** SHA-256 (or fallback) of the installed package. */
    integrity: string;
    /** The app's home directory in the VFS. */
    home: string;
}

export interface InstallResult {
    ok: boolean;
    error?: string | undefined;
    /** True when this replaced an older version. */
    updated?: boolean;
    app?: InstalledApp;
}

/** Creates every segment of an absolute VFS dir path (idempotent). */
function ensureDirPath(fullPath: string): void {
    const parts = fullPath.replace(/^C:\\?/i, '').split('\\').filter(Boolean);
    let current = 'C:';
    for (const part of parts) {
        VFS.mkdir(current === 'C:' ? 'C:\\' : current, part);
        current = `${current}\\${part}`;
    }
}

export const PackageManager = (() => {
    let registry: Record<string, InstalledApp> = {};

    /** Loads the registry from the VFS and re-applies each app's permission ceiling. */
    function init(): void {
        const raw = VFS.readFile(REGISTRY_PATH);
        if (raw) {
            try { registry = JSON.parse(raw) || {}; }
            catch { registry = {}; }
        }
        for (const app of Object.values(registry)) {
            PermissionBroker.setDeclared(app.manifest.id, app.manifest.permissions ?? []);
        }
    }

    function persist(): void {
        ensureDirPath(REGISTRY_DIR);
        VFS.writeFile(REGISTRY_DIR, REGISTRY_NAME, JSON.stringify(registry));
        void VFS.flush();
    }

    function list(): InstalledApp[] { return Object.values(registry); }
    function get(id: string): InstalledApp | undefined { return registry[id]; }

    /** Writes the package files into the app's home dir. */
    function writeFiles(home: string, files: Record<string, string>): void {
        for (const [rel, content] of Object.entries(files)) {
            // Defence in depth: validatePackage already rejects unsafe keys, but
            // never build a path from an unchecked key.
            if (!Utils.isSafeRelativePath(rel)) {
                Utils.Logger.warn(`[PackageManager] skipping unsafe file path: ${rel}`);
                continue;
            }
            const segments = Utils.pathSegments(rel);
            const name = segments.pop();
            if (!name) continue;
            const dir = segments.length ? `${home}\\${segments.join('\\')}` : home;
            ensureDirPath(dir);
            VFS.writeFile(dir, name, content);
        }
    }

    async function install(pkg: AppPackage): Promise<InstallResult> {
        const valid = validatePackage(pkg);
        if (!valid.ok) return { ok: false, error: valid.error };

        const { manifest } = pkg;
        const existing = registry[manifest.id];
        let updated = false;

        if (existing) {
            const cmp = compareVersions(manifest.version, existing.manifest.version);
            if (cmp <= 0) {
                return {
                    ok: false,
                    error: `version ${manifest.version} is not newer than the installed ${existing.manifest.version}`,
                };
            }
            // Clean update: drop the old files before laying down the new ones.
            VFS.deleteNode(APPS_ROOT, manifest.id);
            updated = true;
        }

        const home = `${APPS_ROOT}\\${manifest.id}`;
        ensureDirPath(home);
        writeFiles(home, pkg.files);

        const app: InstalledApp = {
            manifest,
            installedAt: new Date().toISOString(),
            integrity: await packageIntegrity(pkg),
            home,
        };
        registry[manifest.id] = app;
        persist();

        // The manifest's declared capabilities become the consent ceiling.
        PermissionBroker.setDeclared(manifest.id, manifest.permissions ?? []);

        Utils.Logger.log(`[PackageManager] ${updated ? 'updated' : 'installed'} ${manifest.id}@${manifest.version}`);
        return { ok: true, updated, app };
    }

    /**
     * Re-hashes `pkg` and compares it with the integrity stamped at install —
     * use it to detect a tampered/corrupted package before (re)installing.
     *
     * Scope: this proves the bytes are UNCHANGED, not who produced them.
     * Authenticity needs signing (SubtleCrypto), and there is no launch-time
     * check yet because packages aren't executed from the registry. See
     * docs/webos-roadmap/phase-4-packaging.md.
     */
    async function verify(id: string, pkg: AppPackage): Promise<boolean> {
        const installed = registry[id];
        if (!installed) return false;
        return (await packageIntegrity(pkg)) === installed.integrity;
    }

    function uninstall(id: string): boolean {
        if (!registry[id]) return false;
        VFS.deleteNode(APPS_ROOT, id);   // removes the home dir + its files/blobs
        delete registry[id];
        persist();
        PermissionBroker.clearDeclared(id);
        PermissionBroker.revokeApp(id);  // forget consent decisions too
        Utils.Logger.log(`[PackageManager] uninstalled ${id}`);
        return true;
    }

    function __reset(): void { registry = {}; }

    return { init, install, uninstall, verify, list, get, __reset };
})();
