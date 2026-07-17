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

/**
 * Type defining the storage backend strategies.
 */
type BlobBackend = 'opfs' | 'indexeddb' | 'memory';

/** Database name storing binary blob files. */
const BLOB_DB_NAME = 'hados-vfs-blobs';
/** Schema version index for the IndexedDB blob database. */
const BLOB_DB_VERSION = 1;
/** Target object store name within the blob database. */
const BLOB_STORE = 'blobs';

/** Pre-HadOS blob store. Blobs are migrated lazily — see get(). */
const LEGACY_BLOB_DB_NAME = 'win95-vfs-blobs';

/**
 * Checks whether Origin Private File System (OPFS) is supported by the host.
 */
function opfsAvailable(): boolean {
    try {
        return typeof navigator !== 'undefined'
            && !!navigator.storage
            && typeof navigator.storage.getDirectory === 'function';
    } catch {
        return false;
    }
}

/**
 * Checks whether IndexedDB is available and functional in the host browser environment.
 */
function idbAvailable(): boolean {
    try {
        return typeof indexedDB !== 'undefined' && indexedDB !== null;
    } catch {
        return false;
    }
}

// ── OPFS backend ──────────────────────────────────────────────────────────────
/**
 * Resolves the root directory handle for origin private file system storage.
 */
async function opfsDir(): Promise<FileSystemDirectoryHandle> {
    return navigator.storage.getDirectory();
}

/**
 * Writes raw Blob content to the OPFS backend under a given file entry key.
 * @param id Unique blob key identifier.
 * @param data Blob instance containing binary data.
 */
async function opfsPut(id: string, data: Blob): Promise<void> {
    const dir = await opfsDir();
    const handle = await dir.getFileHandle(id, { create: true });
    const writable = await (handle as any).createWritable();
    await writable.write(data);
    await writable.close();
}

/**
 * Retrieves a binary Blob instance from the OPFS storage backend.
 * @param id Unique blob key identifier.
 */
async function opfsGet(id: string): Promise<Blob | null> {
    try {
        const dir = await opfsDir();
        const handle = await dir.getFileHandle(id);
        return await handle.getFile();
    } catch {
        return null; // NotFoundError
    }
}

/**
 * Deletes a file entry from the OPFS storage.
 * @param id Unique blob key identifier.
 */
async function opfsDelete(id: string): Promise<void> {
    try {
        const dir = await opfsDir();
        await dir.removeEntry(id);
    } catch { /* already gone */ }
}

// ── IndexedDB backend ─────────────────────────────────────────────────────────
/** DB connection instance promise cache. */
let blobDbPromise: Promise<IDBDatabase> | null = null;

/**
 * Opens a connection to a specific database by name for blob operations.
 * @param name Database name.
 */
function openNamedBlobDB(name: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(name, BLOB_DB_VERSION);
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

/**
 * Resolves the primary active database connection promise for blob operations.
 */
function openBlobDB(): Promise<IDBDatabase> {
    if (!blobDbPromise) blobDbPromise = openNamedBlobDB(BLOB_DB_NAME);
    return blobDbPromise;
}

/**
 * Looks a blob up in the pre-HadOS store. Blobs are migrated LAZILY (on the first
 * read that misses) rather than copied wholesale at boot.
 * @param id Unique blob key identifier.
 */
async function legacyIdbGetRaw(id: string): Promise<StoredBlob | null> {
    try {
        if (typeof indexedDB.databases === 'function') {
            const names = (await indexedDB.databases()).map(d => d.name);
            if (!names.includes(LEGACY_BLOB_DB_NAME)) return null;
        }
        const db = await openNamedBlobDB(LEGACY_BLOB_DB_NAME);
        const rec = await new Promise<StoredBlob | null>((resolve, reject) => {
            const req = db.transaction(BLOB_STORE, 'readonly').objectStore(BLOB_STORE).get(id);
            req.onsuccess = () => resolve((req.result as StoredBlob | undefined) ?? null);
            req.onerror = () => reject(req.error);
        });
        db.close();
        return rec;
    } catch {
        return null;
    }
}

/**
 * Intermediate schema mapping binary files for browser storage compatibility.
 */
interface StoredBlob {
    /** Raw array buffer contents. */
    buffer: ArrayBuffer;
    /** Original file type metadata. */
    type: string;
}

/**
 * Performs a write transaction to insert a binary record into the IndexedDB database.
 * @param id Unique blob key identifier.
 * @param data Blob instance.
 */
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

/**
 * Fetches the database record containing the raw binary buffer of a blob.
 * @param id Unique blob key identifier.
 */
function idbGetRaw(id: string): Promise<StoredBlob | null> {
    return openBlobDB().then(db => new Promise<StoredBlob | null>((resolve, reject) => {
        const req = db.transaction(BLOB_STORE, 'readonly').objectStore(BLOB_STORE).get(id);
        req.onsuccess = () => resolve((req.result as StoredBlob | undefined) ?? null);
        req.onerror = () => reject(req.error);
    }));
}

/**
 * Reconstructs a full Blob wrapper from the raw database records, lazy-migrating legacy keys.
 * @param id Unique blob key identifier.
 */
async function idbGet(id: string): Promise<Blob | null> {
    const rec = await idbGetRaw(id);
    if (rec) return new Blob([rec.buffer], { type: rec.type });

    // Miss: the blob may predate the HadOS rename. Adopt it on the way out so the
    // next read hits the new store and the legacy one drains over time.
    const legacy = await legacyIdbGetRaw(id);
    if (!legacy) return null;
    const blob = new Blob([legacy.buffer], { type: legacy.type });
    try { await idbPut(id, blob); } catch { /* keep serving the read regardless */ }
    return blob;
}

/**
 * Removes a record entry from the IndexedDB store.
 * @param id Unique blob key identifier.
 */
function idbDelete(id: string): Promise<void> {
    return openBlobDB().then(db => new Promise<void>((resolve, reject) => {
        const tx = db.transaction(BLOB_STORE, 'readwrite');
        tx.objectStore(BLOB_STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    }));
}

// ── Memory backend (last resort) ──────────────────────────────────────────────
/** Local in-memory Map fallback database for testing environments. */
const memory = new Map<string, Blob>();

/**
 * Interface defining durable binary blob storage controller operations.
 */
export interface IVFSBlobStore {
    /** Stores a Blob binary payload associated with a unique reference ID. */
    put(id: string, data: Blob): Promise<void>;
    /** Retrieves the binary Blob payload associated with a unique reference ID. */
    get(id: string): Promise<Blob | null>;
    /** Deletes the binary Blob payload associated with a unique reference ID. */
    delete(id: string): Promise<void>;
    /** Identifies the active storage backend engine. */
    backend(): BlobBackend;
}

export const VFSBlobStore: IVFSBlobStore = (() => {
    /** The active selected storage backend strategy. */
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
