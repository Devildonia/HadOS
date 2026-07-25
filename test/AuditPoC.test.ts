import { describe, it, expect, beforeEach, vi } from 'vitest';
import { escapeHTML, sanitizeHTML } from '../js/utils/html.js';
import { WorkerProcess, messagePortTransport } from '../js/core/WorkerProcess.js';
import { ResourceManager } from '../js/core/ResourceManager.js';
import { VFSCoreTree } from '../js/core/vfs/VFSCoreTree.js';
import { VFSOperations } from '../js/core/vfs/VFSOperations.js';
import { VFS } from '../js/core/VFS.js';
import { PermissionBroker } from '../js/core/PermissionBroker.js';
import { sanitizeSandboxTokens } from '../js/core/IframeProcess.js';
import { VFSBlobStore } from '../js/core/VFSBlobStore.js';
import { EventManager } from '../js/utils/events.js';
import { Kernel } from '../js/core/Kernel.js';
import { Services } from '../js/core/ServiceContainer.js';

describe('Audit PoC Regression & Hardening Suite (commit f0936c7 fixes)', () => {

    describe('A-06: escapeHTML without DOM dependence', () => {
        it('escapes single quotes, double quotes, and angle brackets safely', () => {
            const input = `<script>alert('xss "test" & <more>')</script>`;
            const escaped = escapeHTML(input);
            expect(escaped).not.toContain('<');
            expect(escaped).not.toContain('>');
            expect(escaped).not.toContain("'");
            expect(escaped).toContain('&lt;script&gt;');
            expect(escaped).toContain('&#39;');
            expect(escaped).toContain('&quot;');
        });

        it('returns empty string for non-string input', () => {
            expect(escapeHTML(null as any)).toBe('');
            expect(escapeHTML(undefined as any)).toBe('');
        });
    });

    describe('A-07: sanitizeHTML URL whitelist and text preservation', () => {
        it('strips dangerous javascript: URLs in href and src', () => {
            const dirty = `<a href="javascript:alert(1)">click</a><img src="javascript:alert(2)">`;
            const clean = sanitizeHTML(dirty);
            expect(clean).not.toContain('javascript:');
        });

        it('preserves inner text when an unallowed tag (e.g. script/iframe) is removed', () => {
            const input = `<div>Hello <script>console.log(1)</script>World</div>`;
            const clean = sanitizeHTML(input);
            expect(clean).toContain('Hello console.log(1)World');
        });

        it('strips style attributes from elements', () => {
            const dirty = `<div style="background: url(http://evil.com)">text</div>`;
            const clean = sanitizeHTML(dirty);
            expect(clean).not.toContain('style=');
        });

        it('allows valid data:image URLs on img elements', () => {
            const valid = `<img src="data:image/png;base64,iVBORw0KGgo=" alt="test">`;
            const clean = sanitizeHTML(valid);
            expect(clean).toContain('data:image/png');
        });
    });

    describe('A-05: WorkerProcess dual pending maps', () => {
        it('prevents sys:pong from settling app requests with matching IDs', async () => {
            const channel = new MessageChannel();
            const host = new WorkerProcess(messagePortTransport(channel.port1));

            // Listen on port2 and respond with sys:pong using ID 1
            channel.port2.onmessage = (e) => {
                const msg = e.data;
                if (msg.ch === 'app') {
                    // simulate delayed response
                    setTimeout(() => {
                        channel.port2.postMessage({ ch: 'app', type: 'response', id: msg.id, payload: 'ok' });
                    }, 50);
                } else if (msg.ch === 'sys' && msg.type === 'ping') {
                    channel.port2.postMessage({ ch: 'sys', type: 'pong', id: msg.id });
                }
            };
            channel.port2.start();

            // Fire app request (ID 1) and ping (ID 1)
            const appReq = host.request('test');
            const pingReq = host.ping();

            const pingResult = await pingReq;
            expect(pingResult).toBe(true);

            const appResult = await appReq;
            expect(appResult).toBe('ok');
        });
    });

    describe('M-03: ResourceManager LIFO drain protection', () => {
        it('drains all entries without skipping when dispose calls unregister', () => {
            const rm = new ResourceManager();
            const log: number[] = [];

            let unreg2: (() => void) | null = null;

            rm.register('test', 'other', {
                dispose: () => {
                    log.push(1);
                    if (unreg2) unreg2(); // unregisters resource 2 while disposing resource 1
                }
            });

            unreg2 = rm.register('test', 'other', {
                dispose: () => { log.push(2); }
            });

            rm.disposeOwner('test');
            expect(log).toEqual([2, 1]);
            expect(rm.stats().total).toBe(0);
        });
    });

    describe('M-04: VFSCoreTree Object.hasOwn path resolution', () => {
        it('prevents resolving inherited Object prototype properties', () => {
            const tree = new VFSCoreTree();
            tree.setRoot(tree.cloneDefaultFS());

            expect(tree.resolve('C:\\toString')).toBeNull();
            expect(tree.resolve('C:\\constructor')).toBeNull();
            expect(tree.resolve('C:\\valueOf')).toBeNull();
        });

        // The other half of M-04: the guard must not swing the other way. mkdir,
        // rename and uniqueKey decided existence with a bare `children[name]`, so a
        // prototype member answered truthy and these perfectly legal names were
        // refused as "already taken".
        it('accepts prototype-member names as ordinary files and folders', () => {
            const tree = new VFSCoreTree();
            tree.setRoot(tree.cloneDefaultFS());
            const ops = new VFSOperations(tree, () => {});

            expect(ops.mkdir('C:\\DOCUMENTS', 'constructor')).toBe(true);
            expect(ops.writeFile('C:\\DOCUMENTS', 'note.txt', 'hi')).toBe(true);
            expect(ops.rename('C:\\DOCUMENTS', 'note.txt', 'toString')).toBe(true);

            expect(ops.listDir('C:\\DOCUMENTS')).toEqual(
                expect.arrayContaining(['constructor', 'toString'])
            );
            expect(tree.resolve('C:\\DOCUMENTS\\toString')?.type).toBe('file');
        });
    });

    describe('M-06 & M-07: VFSOperations system path guard and byte measurement', () => {
        it('M-06: rejects deleting C:\\HADOS\\SYSTEM', () => {
            const tree = new VFSCoreTree();
            tree.setRoot(tree.cloneDefaultFS());
            const ops = new VFSOperations(tree, () => {});

            expect(ops.deleteNode('C:\\HADOS', 'SYSTEM')).toBe(false);
            expect(tree.resolve('C:\\HADOS\\SYSTEM')).not.toBeNull();
        });

        it('M-07: correctly measures multi-byte UTF-8 string length', () => {
            const tree = new VFSCoreTree();
            tree.setRoot(tree.cloneDefaultFS());
            const ops = new VFSOperations(tree, () => {});

            // Create a string of multi-byte characters (e.g. 500,001 3-byte characters = ~1.5MB)
            const multiByteStr = '🚀'.repeat(300_000); // 300k emojis = 1.2MB in UTF-8 (exceeds 1MB)
            const result = ops.writeFile('C:\\DOCUMENTS', 'huge.txt', multiByteStr);
            expect(result).toBe(false); // Refused because UTF-8 byte length > 1MB
        });
    });

    describe('M-10: IframeProcess sandbox token sanitization', () => {
        it('strips allow-same-origin and allow-top-navigation from sandbox options', () => {
            const dirty = 'allow-same-origin allow-forms allow-top-navigation';
            const clean = sanitizeSandboxTokens(dirty);
            expect(clean).not.toContain('allow-same-origin');
            expect(clean).not.toContain('allow-top-navigation');
            expect(clean).toContain('allow-scripts');
            expect(clean).toContain('allow-forms');
        });
    });

    describe('M-09: PermissionBroker dialog Escape key & fallback', () => {
        beforeEach(() => {
            PermissionBroker.reset();
            document.body.innerHTML = '';
        });

        it('resolves decision to denied on modal action', async () => {
            PermissionBroker.setDeclared('testApp', ['fs:write']);
            const checkPromise = PermissionBroker.check('testApp', 'fs:write');
            await new Promise(r => setTimeout(r, 10));

            const denyBtn = document.body.querySelector('[data-consent="denied"]') as HTMLButtonElement;
            expect(denyBtn).toBeTruthy();
            denyBtn.click();

            const result = await checkPromise;
            expect(result).toBe(false);
        });
    });

    describe('M-13: VFSBlobStore memory fallback is bounded', () => {
        const MAX_MEMORY_BLOB_BYTES = 50 * 1024 * 1024;
        // Only `size` is read on the memory path, so a stub avoids allocating 50 MB.
        const fakeBlob = (size: number): Blob => ({ size, type: 'video/mp4' } as Blob);

        it('runs on the memory backend in this environment', () => {
            expect(VFSBlobStore.backend()).toBe('memory');
        });

        it('refuses a blob larger than the whole budget — evicting could not help', async () => {
            await expect(VFSBlobStore.put('too-big', fakeBlob(MAX_MEMORY_BLOB_BYTES + 1)))
                .rejects.toThrow(/exceeds the in-memory fallback budget/);
            expect(await VFSBlobStore.get('too-big')).toBeNull();
        });

        it('leaves the previous content intact when an overwrite is refused', async () => {
            await VFSBlobStore.put('keeper', fakeBlob(1024));
            await expect(VFSBlobStore.put('keeper', fakeBlob(MAX_MEMORY_BLOB_BYTES + 1)))
                .rejects.toThrow();
            expect(await VFSBlobStore.get('keeper')).not.toBeNull();
            await VFSBlobStore.delete('keeper');
        });

        it('evicts the least-recently-used blob to make room', async () => {
            await VFSBlobStore.put('old', fakeBlob(20 * 1024 * 1024));
            await VFSBlobStore.put('recent', fakeBlob(20 * 1024 * 1024));
            await VFSBlobStore.get('old');          // touching 'old' makes 'recent' the LRU

            await VFSBlobStore.put('incoming', fakeBlob(20 * 1024 * 1024));

            expect(await VFSBlobStore.get('recent')).toBeNull();     // evicted
            expect(await VFSBlobStore.get('old')).not.toBeNull();    // kept: used more recently
            expect(await VFSBlobStore.get('incoming')).not.toBeNull();

            await VFSBlobStore.delete('old');
            await VFSBlobStore.delete('incoming');
        });

        it('announces each eviction so the VFS can drop the orphaned node', async () => {
            const evicted: string[] = [];
            VFSBlobStore.onEvict(id => evicted.push(id));

            await VFSBlobStore.put('doomed', fakeBlob(30 * 1024 * 1024));
            await VFSBlobStore.put('usurper', fakeBlob(30 * 1024 * 1024));

            expect(evicted).toContain('doomed');
            await VFSBlobStore.delete('usurper');
        });

        it('removes the file from the tree when its blob is evicted', async () => {
            const tree = new VFSCoreTree();
            tree.setRoot(tree.cloneDefaultFS());
            const ops = new VFSOperations(tree, () => {});
            VFSBlobStore.onEvict(id => { ops.dropNodeByBlobRef(id); });

            expect(await ops.writeFileAsync('C:\\DOCUMENTS', 'first.mp4', fakeBlob(30 * 1024 * 1024))).toBe(true);
            expect(tree.resolve('C:\\DOCUMENTS\\first.mp4')).not.toBeNull();

            // Forces the eviction of first.mp4's blob.
            expect(await ops.writeFileAsync('C:\\DOCUMENTS', 'second.mp4', fakeBlob(30 * 1024 * 1024))).toBe(true);

            // No phantom: the node goes with the bytes rather than listing and opening empty.
            expect(tree.resolve('C:\\DOCUMENTS\\first.mp4')).toBeNull();
            expect(tree.resolve('C:\\DOCUMENTS\\second.mp4')).not.toBeNull();

            await VFSBlobStore.delete((tree.resolve('C:\\DOCUMENTS\\second.mp4') as { blobRef?: string }).blobRef!);
        });

        it('frees the budget again on delete', async () => {
            await VFSBlobStore.put('big', fakeBlob(45 * 1024 * 1024));
            await VFSBlobStore.delete('big');
            // If delete had not decremented the running total, this would overflow.
            await expect(VFSBlobStore.put('next', fakeBlob(45 * 1024 * 1024))).resolves.toBeUndefined();
            await VFSBlobStore.delete('next');
        });
    });

    describe('M-11: a process that never signals ready does not hang its waiters', () => {
        /** A transport that swallows everything — the guest that died on boot. */
        const deadTransport = () => ({
            postMessage: () => { /* into the void */ },
            onMessage: () => { /* never delivers sys:ready */ },
            terminate: () => { /* nothing to tear down */ },
        });

        it('rejects `ready` once the timeout elapses', async () => {
            vi.useFakeTimers();
            try {
                const proc = new WorkerProcess(deadTransport(), 5_000);
                const ready = proc.ready;              // arms the timeout on first access
                vi.advanceTimersByTime(5_001);
                await expect(ready).rejects.toThrow(/never signalled ready/);
            } finally {
                vi.useRealTimers();
            }
        });

        it('rejects `ready` when the process is killed before it reports in', async () => {
            const proc = new WorkerProcess(deadTransport(), 0);
            const ready = proc.ready;
            proc.terminate();
            await expect(ready).rejects.toThrow(/terminated/);
        });

        it('surfaces a transport error as a ready rejection', async () => {
            let fail!: (err: Error) => void;
            const proc = new WorkerProcess({
                postMessage: () => { },
                onMessage: () => { },
                onError: (handler) => { fail = handler; },
                terminate: () => { },
            }, 0);
            const ready = proc.ready;
            fail(new Error('Worker error: boom'));
            await expect(ready).rejects.toThrow(/boom/);
        });

        it('does not arm a timer for a process nobody waits on', () => {
            vi.useFakeTimers();
            try {
                const before = vi.getTimerCount();
                new WorkerProcess(deadTransport(), 5_000);
                expect(vi.getTimerCount()).toBe(before);
            } finally {
                vi.useRealTimers();
            }
        });
    });

    describe('M-08: scoped EventManager releases anonymous handlers', () => {
        it('removes inline arrow listeners that the global API could never take back', () => {
            const em = new EventManager();
            const el = document.createElement('button');
            let clicks = 0;

            const scope = em.scope('test-window');
            scope.add(el, 'click', () => { clicks++; });   // no reference kept by the caller
            scope.add(el, 'mouseover', () => { clicks++; });

            el.dispatchEvent(new Event('click'));
            expect(clicks).toBe(1);
            expect(em.count()).toBe(2);

            scope.removeAll();

            el.dispatchEvent(new Event('click'));
            el.dispatchEvent(new Event('mouseover'));
            expect(clicks).toBe(1);        // detached: no further increments
            expect(em.count()).toBe(0);    // and the manager is not holding the node
        });
    });

    describe('M-02: resources are owned per instance, not per app', () => {
        it('killing one window does not dispose a sibling instance of the same app', () => {
            const rm = new ResourceManager();
            Services.register('ResourceManager', rm);

            const disposed: string[] = [];
            const track = (owner: string) =>
                rm.register(owner, 'other', { dispose: () => disposed.push(owner) });

            class TwoWindowApp {
                public windowId: string;
                constructor(id: string) { this.windowId = id; }
                terminate(): void { /* the kernel does the resource teardown */ }
            }

            Kernel.registerApp('twowin', TwoWindowApp as never, { name: 'Two Window App', icon: '🪟' });
            const a = Kernel.launch('twowin', { id: 'win-a' })!;
            const b = Kernel.launch('twowin', { id: 'win-b' })!;

            // Both instances share an appId; only the windowId tells them apart.
            expect(a.appId).toBe(b.appId);
            track(a.windowId!);
            track(b.windowId!);
            track(a.appId);          // an app-wide resource, owned by neither window

            Kernel.kill(a.pid);

            expect(disposed).toContain(a.windowId);
            expect(disposed).not.toContain(b.windowId);   // the sibling survives
            expect(disposed).not.toContain(a.appId);      // and so does the shared one

            Kernel.kill(b.pid);
            Kernel.unregisterApp('twowin');
        });
    });

    describe('A-03: VFS targeted reset', () => {
        beforeEach(async () => {
            localStorage.clear();
            (VFS as any).__reset();
        });

        it('restores missing GAMES folder without wiping user files in DOCUMENTS', async () => {
            await VFS.init();
            VFS.writeFile('C:\\DOCUMENTS', 'user.txt', 'important data');
            VFS.flushBestEffort();

            // Corrupt only the GAMES directory
            const root = VFS.getRoot()!;
            delete root.children!['GAMES'];

            (VFS as any).__reset();
            await VFS.init();

            expect(VFS.readFile('C:\\DOCUMENTS\\user.txt')).toBe('important data');
            expect(VFS.resolve('C:\\GAMES')).not.toBeNull();
        });
    });
});
