import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VFS } from '../js/core/VFS.js';
import { VFSBlobStore } from '../js/core/VFSBlobStore.js';
import { Services } from '../js/core/ServiceContainer.js';
import { WorkerProcess, messagePortTransport } from '../js/core/WorkerProcess.js';
import { ProcessWatchdog } from '../js/core/ProcessWatchdog.js';
import { createIframeTransport } from '../js/core/IframeProcess.js';
import { PermissionBroker } from '../js/core/PermissionBroker.js';
import { Kernel } from '../js/core/Kernel.js';

/**
 * Error-path coverage: the branches a real OS lives or dies on — storage quota,
 * denied permissions and dead processes. These are the paths the v1.6.6 audit
 * flagged as the thinnest part of the suite.
 */

describe('Error paths — storage quota', () => {
    let setItem;
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        setItem = localStorage.setItem;
    });
    afterEach(() => { localStorage.setItem = setItem; Services.unregister('Notify'); });

    const quotaError = () => {
        const e = new Error('QuotaExceededError');
        e.name = 'QuotaExceededError';
        throw e;
    };

    it('surfaces a quota failure through Notify instead of throwing', async () => {
        const errors = [];
        Services.unregister('Notify');
        Services.register('Notify', { info() {}, success() {}, warn() {}, error: (m) => errors.push(m) });

        VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'data');
        localStorage.setItem = quotaError;           // storage is now full

        await expect(VFS.flush()).resolves.toBeUndefined();  // must not throw
        expect(errors.some(m => /quota/i.test(m))).toBe(true);
    });

    it('a quota failure with no Notify service still does not throw', async () => {
        Services.unregister('Notify');
        VFS.writeFile('C:\\DOCUMENTS', 'b.txt', 'data');
        localStorage.setItem = quotaError;
        await expect(VFS.flush()).resolves.toBeUndefined();
    });

    it('keeps the in-memory tree usable after a failed persist', async () => {
        VFS.writeFile('C:\\DOCUMENTS', 'c.txt', 'kept');
        localStorage.setItem = quotaError;
        await VFS.flush();
        // The write is still readable even though it could not be persisted.
        expect(VFS.readFile('C:\\DOCUMENTS\\c.txt')).toBe('kept');
    });

    it('rejects an oversized file before it can fill storage', () => {
        expect(VFS.writeFile('C:\\DOCUMENTS', 'huge.txt', 'x'.repeat(1_000_001))).toBe(false);
    });

    it('blob store survives a backend failure by falling back to memory', async () => {
        const blob = new Blob(['payload'], { type: 'text/plain' });
        await VFSBlobStore.put('fallback-probe', blob);
        const out = await VFSBlobStore.get('fallback-probe');
        expect(await out.text()).toBe('payload');
        await VFSBlobStore.delete('fallback-probe');
        expect(await VFSBlobStore.get('fallback-probe')).toBeNull();
    });
});

describe('Error paths — denied permissions', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PermissionBroker.reset();
    });

    it('a denied decision is remembered — the user is not asked twice', async () => {
        let prompts = 0;
        PermissionBroker.setPrompt(async () => { prompts++; return 'denied'; });
        expect(await PermissionBroker.check('app', 'fs:write')).toBe(false);
        expect(await PermissionBroker.check('app', 'fs:write')).toBe(false);
        expect(prompts).toBe(1);
    });

    it('a prompt that throws is treated as denied and recorded', async () => {
        PermissionBroker.setPrompt(async () => { throw new Error('dialog destroyed'); });
        expect(await PermissionBroker.check('app', 'notify')).toBe(false);
        expect(PermissionBroker.peek('app', 'notify')).toBe('denied');
    });

    it('a denial survives a reload (persisted, not re-asked)', async () => {
        PermissionBroker.setPrompt(async () => 'denied');
        await PermissionBroker.check('app', 'fs:read');
        PermissionBroker.reset();
        PermissionBroker.init();
        expect(PermissionBroker.peek('app', 'fs:read')).toBe('denied');
    });

    it('the NUL-separated key keeps look-alike (app, capability) pairs apart', async () => {
        // ("a b","c") and ("a","b c") would collide under a space separator.
        let asked = [];
        PermissionBroker.setPrompt(async (appId, cap) => { asked.push(`${appId}|${cap}`); return 'granted'; });
        await Promise.all([
            PermissionBroker.check('a b', 'c'),
            PermissionBroker.check('a', 'b c'),
        ]);
        expect(asked.sort()).toEqual(['a b|c', 'a|b c']); // two distinct prompts
        expect(PermissionBroker.peek('a b', 'c')).toBe('granted');
        expect(PermissionBroker.peek('a', 'b c')).toBe('granted');
    });
});

describe('Error paths — dead / crashed processes', () => {
    const fakeTransport = () => {
        let handler = null;
        const state = { terminated: false, sent: [] };
        return {
            state,
            transport: {
                postMessage: (m) => state.sent.push(m),
                onMessage: (h) => { handler = h; },
                terminate: () => { state.terminated = true; },
            },
            deliver: (m) => handler && handler(m),
        };
    };

    it('a request on a terminated process rejects instead of hanging', async () => {
        const f = fakeTransport();
        const wp = new WorkerProcess(f.transport);
        wp.terminate();
        await expect(wp.request('anything')).rejects.toThrow('terminated');
    });

    it('terminate rejects every in-flight request', async () => {
        const f = fakeTransport();
        const wp = new WorkerProcess(f.transport);
        const a = wp.request('one', {}, 5000);
        const b = wp.request('two', {}, 5000);
        wp.terminate();
        await expect(a).rejects.toThrow('terminated');
        await expect(b).rejects.toThrow('terminated');
    });

    it('a request times out when the process never answers', async () => {
        const f = fakeTransport();  // swallows everything
        const wp = new WorkerProcess(f.transport);
        await expect(wp.request('lost', {}, 30)).rejects.toThrow(/timed out/);
    });

    it('ping on a terminated process resolves false (never hangs)', async () => {
        const f = fakeTransport();
        const wp = new WorkerProcess(f.transport);
        wp.terminate();
        expect(await wp.ping(20)).toBe(false);
    });

    it('terminate is idempotent and survives a transport that throws', () => {
        const wp = new WorkerProcess({
            postMessage() {}, onMessage() {},
            terminate() { throw new Error('worker already gone'); },
        });
        expect(() => wp.terminate()).not.toThrow();
        expect(() => wp.terminate()).not.toThrow();
        expect(wp.isTerminated).toBe(true);
    });

    it('an unhandled inbound request is answered with an error, not silence', async () => {
        const channel = new MessageChannel();
        const host = new WorkerProcess(messagePortTransport(channel.port1));
        const replies = [];
        channel.port2.onmessage = (e) => replies.push(e.data);
        channel.port2.start();
        channel.port2.postMessage({ ch: 'app', type: 'no.such.syscall', id: 1 });
        await new Promise(r => setTimeout(r, 20));
        expect(replies.some(m => m.id === 1 && /unhandled request/.test(m.error || ''))).toBe(true);
        host.terminate();
    });

    it('the watchdog kills a crashed process and forgets it afterwards', async () => {
        const killed = [];
        let alive = true;
        const proc = { ping: async () => alive };
        let targets = [{ pid: 42, proc }];
        const wd = new ProcessWatchdog({
            maxMisses: 2,
            getTargets: () => targets,
            onKill: (pid) => { killed.push(pid); targets = []; },  // kill removes it
        });
        await wd.tick();          // alive
        alive = false;            // process crashes
        await wd.tick();          // miss 1
        await wd.tick();          // miss 2 -> kill
        expect(killed).toEqual([42]);
        await wd.tick();          // gone: must not throw or re-kill
        expect(killed).toEqual([42]);
    });

    it('the watchdog stops cleanly and does not tick afterwards', async () => {
        let pings = 0;
        const wd = new ProcessWatchdog({
            intervalMs: 5,
            getTargets: () => [{ pid: 1, proc: { ping: async () => { pings++; return true; } } }],
            onKill: () => {},
        });
        wd.start();
        expect(wd.running).toBe(true);
        wd.stop();
        expect(wd.running).toBe(false);
        const seen = pings;
        await new Promise(r => setTimeout(r, 30));
        expect(pings).toBe(seen); // no ticks after stop
    });
});

describe('Error paths — iframe process spawn', () => {
    beforeEach(() => { document.body.innerHTML = ''; Kernel.__reset(); });
    afterEach(() => { document.body.innerHTML = ''; });

    it('rejects when given neither srcdoc nor src', async () => {
        await expect(createIframeTransport({})).rejects.toThrow(/needs srcdoc or src/);
    });

    it('does not leave the iframe mounted when the spawn is invalid', async () => {
        const before = document.querySelectorAll('iframe').length;
        await createIframeTransport({}).catch(() => {});
        expect(document.querySelectorAll('iframe').length).toBe(before);
    });
});
