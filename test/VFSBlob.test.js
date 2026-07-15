// fake-indexeddb/auto before any VFS import so VFSBlobStore selects the IDB
// backend (jsdom has no OPFS). This is the only suite that loads it.
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../js/core/VFS.js';
import { VFSBlobStore } from '../js/core/VFSBlobStore.js';

describe('VFS binary/blob API (Phase 0.2)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
    });

    it('uses a durable blob backend (IndexedDB under fake-indexeddb)', () => {
        expect(['opfs', 'indexeddb']).toContain(VFSBlobStore.backend());
    });

    it('writes a Blob out-of-tree and reads it back', async () => {
        const blob = new Blob(['PNG-BYTES-HERE'], { type: 'image/png' });
        const ok = await VFS.writeFileAsync('C:\\DOCUMENTS', 'pic.png', blob);
        expect(ok).toBe(true);

        // The tree node keeps only metadata, not the bytes.
        const node = VFS.resolve('C:\\DOCUMENTS\\pic.png');
        expect(node.type).toBe('file');
        expect(node.blobRef).toBeTruthy();
        expect(node.mime).toBe('image/png');
        expect(node.content).toBeUndefined();

        // Content is retrievable via the async API as a Blob.
        const out = await VFS.readFileAsync('C:\\DOCUMENTS\\pic.png');
        expect(out).toBeInstanceOf(Blob);
        expect(out.type).toBe('image/png'); // MIME preserved on read-back
        expect(await out.text()).toBe('PNG-BYTES-HERE');
    });

    it('stores string data inline (delegates to writeFile)', async () => {
        const ok = await VFS.writeFileAsync('C:\\DOCUMENTS', 'note.txt', 'plain text');
        expect(ok).toBe(true);
        const node = VFS.resolve('C:\\DOCUMENTS\\note.txt');
        expect(node.content).toBe('plain text');
        expect(node.blobRef).toBeUndefined();
        expect(await VFS.readFileAsync('C:\\DOCUMENTS\\note.txt')).toBe('plain text');
    });

    it('releases the blob when the file is deleted', async () => {
        await VFS.writeFileAsync('C:\\DOCUMENTS', 'gone.png', new Blob(['x'], { type: 'image/png' }));
        const ref = VFS.resolve('C:\\DOCUMENTS\\gone.png').blobRef;
        expect(await VFSBlobStore.get(ref)).toBeInstanceOf(Blob);

        VFS.deleteNode('C:\\DOCUMENTS', 'gone.png');
        expect(await VFSBlobStore.get(ref)).toBeNull(); // orphan cleaned up
    });

    it('frees the old blob when overwriting with inline text', async () => {
        await VFS.writeFileAsync('C:\\DOCUMENTS', 'swap', new Blob(['bin'], { type: 'application/octet-stream' }));
        const oldRef = VFS.resolve('C:\\DOCUMENTS\\swap').blobRef;

        VFS.writeFile('C:\\DOCUMENTS', 'swap', 'now text');
        expect(await VFSBlobStore.get(oldRef)).toBeNull();
        expect(VFS.readFile('C:\\DOCUMENTS\\swap')).toBe('now text');
    });

    it('rejects a blob over the 50 MB cap', async () => {
        const huge = { size: 50 * 1024 * 1024 + 1, type: 'application/octet-stream' };
        // A fake Blob-like with an oversized size (avoids allocating 50 MB in the test).
        const ok = await VFS.writeFileAsync('C:\\DOCUMENTS', 'huge.bin', huge);
        expect(ok).toBe(false);
        expect(VFS.resolve('C:\\DOCUMENTS\\huge.bin')).toBeNull();
    });
});
