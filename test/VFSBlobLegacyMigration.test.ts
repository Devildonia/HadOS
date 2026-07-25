// fake-indexeddb/auto must precede the store import: VFSBlobStore picks its
// backend at module-load time, and this suite is about the IndexedDB path.
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VFSBlobStore } from '../js/core/VFSBlobStore';

/**
 * M-14 — lazy migration of pre-HadOS blobs.
 *
 * Blobs stored before the rename live in `win95-vfs-blobs` and are adopted on the
 * first read that misses. The optimisation that skips that probe once the legacy
 * store is gone must key off the ABSENCE OF THE DATABASE, never off a single
 * missing key: one lookup for a blob that was simply deleted would otherwise latch
 * the migration shut and strand every other legacy blob forever.
 */

const LEGACY_DB = 'win95-vfs-blobs';
const NEW_DB = 'hados-vfs-blobs';
const STORE = 'blobs';
const CHECKED_KEY = 'hados_vfs_legacy_blobs_checked';

function seedLegacyBlob(id: string, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const open = indexedDB.open(LEGACY_DB, 1);
        open.onupgradeneeded = () => open.result.createObjectStore(STORE);
        open.onsuccess = () => {
            const db = open.result;
            const tx = db.transaction(STORE, 'readwrite');
            tx.objectStore(STORE).put({ buffer: new TextEncoder().encode(text).buffer, type: 'text/plain' }, id);
            tx.oncomplete = () => { db.close(); resolve(); };
            tx.onerror = () => reject(tx.error);
        };
        open.onerror = () => reject(open.error);
    });
}

function dropDB(name: string): Promise<void> {
    return new Promise((resolve) => {
        const req = indexedDB.deleteDatabase(name);
        req.onsuccess = req.onerror = req.onblocked = () => resolve();
    });
}

function listDBs(): Promise<string[]> {
    return indexedDB.databases().then(ds => ds.map(d => d.name ?? ''));
}

describe('VFSBlobStore — legacy blob migration (audit M-14)', () => {
    beforeEach(async () => {
        localStorage.removeItem(CHECKED_KEY);
        await dropDB(LEGACY_DB);
    });

    afterEach(async () => {
        localStorage.removeItem(CHECKED_KEY);
        await dropDB(LEGACY_DB);
    });

    it('uses the IndexedDB backend in this environment', () => {
        expect(VFSBlobStore.backend()).toBe('indexeddb');
    });

    it('a miss on one blob does not strand the other legacy blobs', async () => {
        await seedLegacyBlob('legacy-keeper', 'still here');

        // A read for something that exists nowhere. The legacy DB is present, so
        // this proves nothing about the blobs still in it.
        expect(await VFSBlobStore.get('never-existed')).toBeNull();
        expect(localStorage.getItem(CHECKED_KEY)).toBeNull();

        // The real legacy blob must still migrate.
        const found = await VFSBlobStore.get('legacy-keeper');
        expect(found).not.toBeNull();
        expect(await found!.text()).toBe('still here');
    });

    it('adopts the legacy blob into the new store so the next read is local', async () => {
        await seedLegacyBlob('legacy-adopted', 'adopt me');
        await VFSBlobStore.get('legacy-adopted');

        await dropDB(LEGACY_DB);   // legacy gone: only an adopted copy can answer now
        const again = await VFSBlobStore.get('legacy-adopted');
        expect(again).not.toBeNull();
        expect(await again!.text()).toBe('adopt me');
    });

    it('latches the probe off only once the legacy store is truly absent', async () => {
        expect(await VFSBlobStore.get('nothing-here')).toBeNull();
        expect(localStorage.getItem(CHECKED_KEY)).toBe('true');
    });

    it('never materialises an empty legacy DB when databases() is unavailable', async () => {
        // Firefox has no indexedDB.databases(), so the name guard is skipped and the
        // probe falls through to opening the DB — which used to CREATE it.
        const databases = indexedDB.databases;
        // @ts-expect-error — deliberately simulating a browser without this API
        delete indexedDB.databases;
        try {
            expect(await VFSBlobStore.get('absent-on-firefox')).toBeNull();
        } finally {
            indexedDB.databases = databases;
        }

        expect(await listDBs()).not.toContain(LEGACY_DB);
        expect(await listDBs()).toContain(NEW_DB);
    });
});
