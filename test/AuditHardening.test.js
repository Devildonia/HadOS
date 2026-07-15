import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Utils } from '../js/utils.js';
import { VFS } from '../js/core/VFS.js';
import { PermissionBroker } from '../js/core/PermissionBroker.js';
import { PackageManager } from '../js/core/PackageManager.js';
import { validatePackage } from '../js/core/AppPackage.js';
import { attachSyscalls } from '../js/core/SyscallBroker.js';
import { WorkerProcess, messagePortTransport } from '../js/core/WorkerProcess.js';
import { AppRuntime, messagePortGuestTransport } from '../js/sdk/appRuntime.js';

/** Regression tests for the v1.6.6 audit findings (M1, M2, B1–B5, O1). */

function connect({ appId = 'test', fsRoot = 'C:\\APPS\\test' } = {}) {
    const channel = new MessageChannel();
    const host = new WorkerProcess(messagePortTransport(channel.port1));
    const guest = new AppRuntime(messagePortGuestTransport(channel.port2));
    attachSyscalls(host, { appId, pid: 1, fsRoot });
    guest.start();
    return { host, guest };
}

describe('Audit v1.6.6 — path safety helpers (M2)', () => {
    it('hasTraversal detects `..` segments across separator styles', () => {
        expect(Utils.hasTraversal('C:\\APPS\\x\\..\\..\\WINDOWS')).toBe(true);
        expect(Utils.hasTraversal('a/../b')).toBe(true);
        expect(Utils.hasTraversal('C:\\APPS\\x\\notes.txt')).toBe(false);
        expect(Utils.hasTraversal('..')).toBe(true);
        expect(Utils.hasTraversal('a..b')).toBe(false); // only whole segments count
    });

    it('isSafeRelativePath rejects traversal, drive prefixes and absolute paths', () => {
        expect(Utils.isSafeRelativePath('assets/data.txt')).toBe(true);
        expect(Utils.isSafeRelativePath('index.html')).toBe(true);
        expect(Utils.isSafeRelativePath('../escape.txt')).toBe(false);
        expect(Utils.isSafeRelativePath('C:\\WINDOWS\\evil')).toBe(false);
        expect(Utils.isSafeRelativePath('/etc/passwd')).toBe(false);
        expect(Utils.isSafeRelativePath('\\abs')).toBe(false);
        expect(Utils.isSafeRelativePath('')).toBe(false);
    });
});

describe('Audit v1.6.6 — syscall hardening (M2, B2)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PermissionBroker.reset();
        PermissionBroker.setPrompt(async () => 'granted');
    });

    it('M2: rejects a traversal path even though it is prefixed by fsRoot', async () => {
        const { host, guest } = connect({ fsRoot: 'C:\\APPS\\test' });
        await host.ready;
        // Prefix check alone would let this through: it starts with the fsRoot.
        await expect(guest.syscall('fs.write', {
            path: 'C:\\APPS\\test\\..\\..\\WINDOWS\\SYSTEM', name: 'evil', content: 'x',
        })).rejects.toThrow(/path traversal/);
        expect(VFS.resolve('C:\\WINDOWS\\SYSTEM\\evil')).toBeNull();
    });

    it('M2: still rejects a plain outside-root path', async () => {
        const { host, guest } = connect({ fsRoot: 'C:\\APPS\\test' });
        await host.ready;
        await expect(guest.syscall('fs.read', { path: 'C:\\WINDOWS\\SYSTEM\\crash.log' }))
            .rejects.toThrow(/denied outside/);
    });

    it('M2: accepts a legitimate path inside the root regardless of separator style', async () => {
        VFS.mkdir('C:\\', 'APPS'); VFS.mkdir('C:\\APPS', 'test');
        const { host, guest } = connect({ fsRoot: 'C:\\APPS\\test' });
        await host.ready;
        expect(await guest.syscall('fs.write', { path: 'C:/APPS/test', name: 'ok.txt', content: 'yes' })).toBe(true);
        expect(VFS.readFile('C:\\APPS\\test\\ok.txt')).toBe('yes');
    });

    it('B2: notify falls back to info for a non-allow-listed level', async () => {
        const calls = [];
        const fakeNotify = {
            info: (m) => calls.push(['info', m]),
            success: (m) => calls.push(['success', m]),
            warn: (m) => calls.push(['warn', m]),
            error: (m) => calls.push(['error', m]),
        };
        const { Services } = await import('../js/core/ServiceContainer.js');
        Services.unregister('Notify');
        Services.register('Notify', fakeNotify);

        const { host, guest } = connect();
        await host.ready;
        await guest.syscall('notify', { level: 'error', message: 'real' });
        await guest.syscall('notify', { level: 'constructor', message: 'proto' }); // not allow-listed
        expect(calls).toEqual([['error', 'real'], ['info', 'proto']]);
        Services.unregister('Notify');
    });
});

describe('Audit v1.6.6 — PermissionBroker (M1, B1)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PermissionBroker.reset();
        document.body.innerHTML = '';
    });

    it('M1: concurrent checks for the same capability share ONE prompt', async () => {
        let prompts = 0;
        PermissionBroker.setPrompt(async () => {
            prompts++;
            await new Promise(r => setTimeout(r, 20)); // user thinking
            return 'granted';
        });

        const results = await Promise.all([
            PermissionBroker.check('appA', 'fs:write'),
            PermissionBroker.check('appA', 'fs:write'),
            PermissionBroker.check('appA', 'fs:write'),
            PermissionBroker.check('appA', 'fs:write'),
            PermissionBroker.check('appA', 'fs:write'),
        ]);
        expect(prompts).toBe(1);                       // no stack of modals
        expect(results).toEqual([true, true, true, true, true]);
        expect(PermissionBroker.peek('appA', 'fs:write')).toBe('granted');
    });

    it('M1: different capabilities still prompt independently', async () => {
        let prompts = 0;
        PermissionBroker.setPrompt(async () => { prompts++; return 'granted'; });
        await Promise.all([
            PermissionBroker.check('appA', 'fs:write'),
            PermissionBroker.check('appA', 'notify'),
        ]);
        expect(prompts).toBe(2);
    });

    it('M1: a shared denied prompt denies every concurrent caller', async () => {
        PermissionBroker.setPrompt(async () => { await new Promise(r => setTimeout(r, 10)); return 'denied'; });
        const results = await Promise.all([
            PermissionBroker.check('appA', 'fs:write'),
            PermissionBroker.check('appA', 'fs:write'),
        ]);
        expect(results).toEqual([false, false]);
    });

    it('B1: the consent dialog escapes the app id (no HTML injection)', async () => {
        const evil = '<img src=x onerror="window.__pwned=1">';
        const p = PermissionBroker.check(evil, 'fs:write');
        await new Promise(r => setTimeout(r, 0));

        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog).toBeTruthy();
        expect(dialog.querySelector('img')).toBeNull();          // not parsed as HTML
        expect(dialog.textContent).toContain(evil);              // shown as literal text
        expect(window.__pwned).toBeUndefined();

        document.querySelector('[data-consent="denied"]').click();
        await p;
    });
});

describe('Audit v1.6.6 — packaging (M2, O1)', () => {
    const pkg = (files) => ({
        manifest: { id: 'demo-app', name: 'Demo', version: '1.0.0', entry: 'index.html', permissions: ['fs:write'] },
        files: files ?? { 'index.html': '<h1>hi</h1>' },
    });

    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PermissionBroker.reset();
        PackageManager.__reset();
    });

    it('M2: rejects a package with a traversal file key', async () => {
        const res = await PackageManager.install(pkg({ 'index.html': 'x', '../../WINDOWS/evil.txt': 'pwn' }));
        expect(res.ok).toBe(false);
        expect(res.error).toMatch(/unsafe file path/);
        expect(VFS.resolve('C:\\WINDOWS\\evil.txt')).toBeNull();
    });

    it('M2: rejects a package with an absolute file key', async () => {
        expect(validatePackage(pkg({ 'index.html': 'x', 'C:\\WINDOWS\\evil': 'pwn' })).error).toMatch(/unsafe file path/);
        expect(validatePackage(pkg({ 'index.html': 'x', '/etc/passwd': 'pwn' })).error).toMatch(/unsafe file path/);
    });

    it('M2: rejects a manifest whose entry escapes the package', () => {
        const bad = { ...pkg(), manifest: { ...pkg().manifest, entry: '../../evil.html' } };
        expect(validatePackage(bad).error).toMatch(/safe relative path/);
    });

    it('O1: verify() detects a tampered package against the recorded integrity', async () => {
        await PackageManager.install(pkg());
        expect(await PackageManager.verify('demo-app', pkg())).toBe(true);
        expect(await PackageManager.verify('demo-app', pkg({ 'index.html': '<h1>tampered</h1>' }))).toBe(false);
        expect(await PackageManager.verify('not-installed', pkg())).toBe(false);
    });
});

describe('Audit v1.6.6 — VFS blob write race (B4)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
    });

    it('B4: concurrent blob writes to the same path leave a readable winner', async () => {
        const a = new Blob(['AAA'], { type: 'text/plain' });
        const b = new Blob(['BBB'], { type: 'text/plain' });
        await Promise.all([
            VFS.writeFileAsync('C:\\DOCUMENTS', 'race.bin', a),
            VFS.writeFileAsync('C:\\DOCUMENTS', 'race.bin', b),
        ]);
        // Whichever won, its blob must still be retrievable (not freed by the loser).
        const out = await VFS.readFileAsync('C:\\DOCUMENTS\\race.bin');
        expect(out).toBeInstanceOf(Blob);
        expect(['AAA', 'BBB']).toContain(await out.text());
    });
});
