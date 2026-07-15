import { describe, it, expect, beforeEach } from 'vitest';
import { PackageManager } from '../js/core/PackageManager.js';
import { PermissionBroker } from '../js/core/PermissionBroker.js';
import { validateManifest, compareVersions, packageIntegrity } from '../js/core/AppPackage.js';
import { VFS } from '../js/core/VFS.js';

const pkg = (over = {}) => ({
    manifest: {
        id: 'demo-app',
        name: 'Demo App',
        version: '1.0.0',
        entry: 'index.html',
        permissions: ['fs:write'],
        ...(over.manifest || {}),
    },
    files: over.files ?? {
        'index.html': '<h1>hi</h1>',
        'assets/data.txt': 'payload',
    },
});

describe('AppPackage manifest (Fase 4)', () => {
    it('accepts a valid manifest', () => {
        expect(validateManifest(pkg().manifest).ok).toBe(true);
    });

    it('rejects a bad id, version, missing entry and unknown permission', () => {
        expect(validateManifest({ ...pkg().manifest, id: 'Bad Id' }).error).toMatch(/id must match/);
        expect(validateManifest({ ...pkg().manifest, version: '1.0' }).error).toMatch(/semver/);
        expect(validateManifest({ ...pkg().manifest, entry: '' }).error).toMatch(/entry is required/);
        expect(validateManifest({ ...pkg().manifest, permissions: ['gpu'] }).error).toMatch(/unknown permission/);
    });

    it('compares semver versions', () => {
        expect(compareVersions('1.2.0', '1.10.0')).toBe(-1);
        expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
        expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    });

    it('produces a stable integrity stamp that changes with content', async () => {
        const a = await packageIntegrity(pkg());
        const b = await packageIntegrity(pkg());
        const c = await packageIntegrity(pkg({ files: { 'index.html': '<h1>changed</h1>' } }));
        expect(a).toBe(b);
        expect(c).not.toBe(a);
    });
});

describe('PackageManager install/update/uninstall (Fase 4)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PermissionBroker.reset();
        PackageManager.__reset();
    });

    it('installs a package into the app home and records it', async () => {
        const res = await PackageManager.install(pkg());
        expect(res.ok).toBe(true);
        expect(res.updated).toBe(false);

        // Files land in the app's own home dir, nested paths included.
        expect(VFS.readFile('C:\\APPS\\demo-app\\index.html')).toBe('<h1>hi</h1>');
        expect(VFS.readFile('C:\\APPS\\demo-app\\assets\\data.txt')).toBe('payload');

        const installed = PackageManager.get('demo-app');
        expect(installed.manifest.version).toBe('1.0.0');
        expect(installed.integrity).toBeTruthy();
        expect(PackageManager.list()).toHaveLength(1);
    });

    it('rejects an invalid package', async () => {
        const res = await PackageManager.install(pkg({ manifest: { id: 'BAD' } }));
        expect(res.ok).toBe(false);
        expect(res.error).toMatch(/id must match/);
    });

    it('rejects a package whose entry file is missing', async () => {
        const res = await PackageManager.install({ manifest: pkg().manifest, files: { 'other.txt': 'x' } });
        expect(res.ok).toBe(false);
        expect(res.error).toMatch(/missing the entry/);
    });

    it('refuses reinstalling the same or an older version', async () => {
        await PackageManager.install(pkg());
        const same = await PackageManager.install(pkg());
        expect(same.ok).toBe(false);
        expect(same.error).toMatch(/not newer/);

        const older = await PackageManager.install(pkg({ manifest: { version: '0.9.0' } }));
        expect(older.ok).toBe(false);
    });

    it('updates to a newer version and removes stale files', async () => {
        await PackageManager.install(pkg());
        const res = await PackageManager.install(pkg({
            manifest: { version: '1.1.0' },
            files: { 'index.html': '<h1>v2</h1>' }, // assets/data.txt is gone in v2
        }));
        expect(res.ok).toBe(true);
        expect(res.updated).toBe(true);
        expect(PackageManager.get('demo-app').manifest.version).toBe('1.1.0');
        expect(VFS.readFile('C:\\APPS\\demo-app\\index.html')).toBe('<h1>v2</h1>');
        expect(VFS.resolve('C:\\APPS\\demo-app\\assets\\data.txt')).toBeNull(); // clean update
    });

    it('uninstall removes the home dir, the registry entry and the grants', async () => {
        await PackageManager.install(pkg());
        PermissionBroker.set('demo-app', 'fs:write', 'granted');

        expect(PackageManager.uninstall('demo-app')).toBe(true);
        expect(VFS.resolve('C:\\APPS\\demo-app')).toBeNull();
        expect(PackageManager.get('demo-app')).toBeUndefined();
        expect(PermissionBroker.peek('demo-app', 'fs:write')).toBeUndefined();
        expect(PackageManager.uninstall('demo-app')).toBe(false); // already gone
    });

    it('persists the registry and restores permission ceilings on init', async () => {
        await PackageManager.install(pkg());
        PackageManager.__reset();
        PermissionBroker.reset();
        PackageManager.init(); // reload from the VFS

        expect(PackageManager.get('demo-app').manifest.name).toBe('Demo App');
        // The manifest ceiling is re-applied: an undeclared capability is refused
        // without ever prompting.
        let prompted = false;
        PermissionBroker.setPrompt(async () => { prompted = true; return 'granted'; });
        expect(await PermissionBroker.check('demo-app', 'notify')).toBe(false); // not declared
        expect(prompted).toBe(false);
    });

    it('enforces the manifest ceiling: declared capability still asks for consent', async () => {
        await PackageManager.install(pkg()); // declares fs:write only
        let prompts = 0;
        PermissionBroker.setPrompt(async () => { prompts++; return 'granted'; });

        expect(await PermissionBroker.check('demo-app', 'fs:write')).toBe(true); // declared -> prompt -> granted
        expect(prompts).toBe(1);
        expect(await PermissionBroker.check('demo-app', 'net')).toBe(false);     // undeclared -> refused
        expect(prompts).toBe(1);                                                  // no prompt for undeclared
    });
});
