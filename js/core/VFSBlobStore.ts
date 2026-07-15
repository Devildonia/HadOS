/**
 * VFS BLOB STORE
 * Durable storage for binary/large file content, kept OUT of the JSON tree so
 * the metadata tree stays small and cheap to serialize. The VFS node keeps only
 * a `blobRef` pointing here. Phase 0.2 of the Web OS roadmap.
 *
 * Backend selection (first available wins):
 *   1. OPFS (Origin Private File System) — real files, ideal for large binaries.
 *   2. IndexedDB — stores Blobs directly (structured clone); used when OPFS is
 *      unavailable (older browsers, jsdom + fake-indexeddb in tests).
 *   3. In-memory Map — last resort so the API never throws (non-durable).
 */

type BlobBackend = 'opfs' | 'indexeddb' | 'memory';

const BLOB_DB_NAME = 'win95-vfs-blobs';
const BLOB_DB_VERSION = 1;
const BLOB_STORE = 'blobs';

function opfsAvailable(): boolean {
    try {
        return typeof navigator !== 'undefined'
            && !!navigator.storage
            && typeof navigator.storage.getDirectory === 'function';
    } catch {
        return false;
    }
}

function idbAvailable(): boolean {
    try {
        return typeof indexedDB !== 'undefined' && indexedDB !== null;
    } catch {
        return false;
    }
}

// ── OPFS backend ──────────────────────────────────────────────────────────────
async function opfsDir(): Promise<FileSystemDirectoryHandle> {
    return navigator.storage.getDirectory();
}

async function opfsPut(id: string, data: Blob): Promise<void> {
    const dir = await opfsDir();
    const handle = await dir.getFileHandle(id, { create: true });
    const writable = await (handle as any).createWritable();
    await writable.write(data);
    await writable.close();
}

async function opfsGet(id: string): Promise<Blob | null> {
    try {
        const dir = await opfsDir();
        const handle = await dir.getFileHandle(id);
        return await handle.getFile();
    } catch {
        return null; // NotFoundError
    }
}

async function opfsDelete(id: string): Promise<void> {
    try {
        const dir = await opfsDir();
        await dir.removeEntry(id);
    } catch { /* already gone */ }
}

// ── IndexedDB backend ─────────────────────────────────────────────────────────
let blobDbPromise: Promise<IDBDatabase> | null = null;

function openBlobDB(): Promise<IDBDatabase> {
    if (!blobDbPromise) {
        blobDbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(BLOB_DB_NAME, BLOB_DB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(BLOB_STORE)) {
                    db.createObjectStore(BLOB_STORE);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    return blobDbPromise;
}

// Store as { buffer, type } rather than a raw Blob: ArrayBuffers structured-clone
// reliably across every engine (and test shims), whereas Blob-in-IndexedDB has a
// history of browser quirks. The Blob is reconstructed on read.
interface StoredBlob { buffer: ArrayBuffer; type: string; }

async function idbPut(id: string, data: Blob): Promise<void> {
    const buffer = await data.arrayBuffer();
    const record: StoredBlob = { buffer, type: data.type };
    const db = await openBlobDB();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(BLOB_STORE, 'readwrite');
        tx.objectStore(BLOB_STORE).put(record, id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

function idbGet(id: string): Promise<Blob | null> {
    return openBlobDB().then(db => new Promise<Blob | null>((resolve, reject) => {
        const req = db.transaction(BLOB_STORE, 'readonly').objectStore(BLOB_STORE).get(id);
        req.onsuccess = () => {
            const rec = req.result as StoredBlob | undefined;
            resolve(rec ? new Blob([rec.buffer], { type: rec.type }) : null);
        };
        req.onerror = () => reject(req.error);
    }));
}

function idbDelete(id: string): Promise<void> {
    return openBlobDB().then(db => new Promise<void>((resolve, reject) => {
        const tx = db.transaction(BLOB_STORE, 'readwrite');
        tx.objectStore(BLOB_STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    }));
}

// ── Memory backend (last resort) ──────────────────────────────────────────────
const memory = new Map<string, Blob>();

export interface IVFSBlobStore {
    put(id: string, data: Blob): Promise<void>;
    get(id: string): Promise<Blob | null>;
    delete(id: string): Promise<void>;
    backend(): BlobBackend;
}

export const VFSBlobStore: IVFSBlobStore = (() => {
    const backend: BlobBackend = opfsAvailable() ? 'opfs' : (idbAvailable() ? 'indexeddb' : 'memory');

    async function put(id: string, data: Blob): Promise<void> {
        try {
            if (backend === 'opfs') return await opfsPut(id, data);
            if (backend === 'indexeddb') return await idbPut(id, data);
        } catch {
            // Fall through to memory so a write never hard-fails.
        }
        memory.set(id, data);
    }

    async function get(id: string): Promise<Blob | null> {
        try {
            if (backend === 'opfs') { const b = await opfsGet(id); if (b) return b; }
            if (backend === 'indexeddb') { const b = await idbGet(id); if (b) return b; }
        } catch { /* fall through */ }
        return memory.get(id) ?? null;
    }

    async function del(id: string): Promise<void> {
        memory.delete(id);
        try {
            if (backend === 'opfs') return await opfsDelete(id);
            if (backend === 'indexeddb') return await idbDelete(id);
        } catch { /* ignore */ }
    }

    return { put, get, delete: del, backend: () => backend };
})();
