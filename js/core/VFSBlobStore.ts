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
    const writable = await (handle as unknown as { createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }).createWritable();
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
 * Outcome of a legacy probe. `dbExists` is the part that matters: only the absence
 * of the whole legacy store is conclusive enough to stop probing — a single missing
 * KEY says nothing about the other blobs still waiting to migrate.
 */
type LegacyLookup =
    | { dbExists: false }
    | { dbExists: true; rec: StoredBlob | null };

/**
 * Opens the pre-HadOS blob DB ONLY if it already exists, resolving null otherwise.
 *
 * `indexedDB.open(name)` CREATES the database when it is missing. On Firefox, which
 * has no `indexedDB.databases()` to guard against that, every cache miss therefore
 * materialised an empty legacy store (audit v1.0.0-rc.1, M-14). Opening WITHOUT a
 * version never upgrades an existing DB, so an `onupgradeneeded` here can only mean
 * "it wasn't there" — at which point we back out and drop what we just created.
 */
function openLegacyBlobDBIfExists(): Promise<IDBDatabase | null> {
    return new Promise((resolve) => {
        let created = false;
        try {
            const req = indexedDB.open(LEGACY_BLOB_DB_NAME);
            req.onupgradeneeded = () => { created = true; };
            req.onsuccess = () => {
                const db = req.result;
                if (created) {
                    db.close();
                    try { indexedDB.deleteDatabase(LEGACY_BLOB_DB_NAME); } catch { /* litter, not a failure */ }
                    resolve(null);
                    return;
                }
                resolve(db);
            };
            req.onerror = () => resolve(null);
            req.onblocked = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
}

/**
 * Looks a blob up in the pre-HadOS store. Blobs are migrated LAZILY (on the first
 * read that misses) rather than copied wholesale at boot.
 * @param id Unique blob key identifier.
 */
async function legacyIdbLookup(id: string): Promise<LegacyLookup> {
    try {
        if (typeof indexedDB.databases === 'function') {
            const names = (await indexedDB.databases()).map(d => d.name);
            if (!names.includes(LEGACY_BLOB_DB_NAME)) return { dbExists: false };
        }
        const db = await openLegacyBlobDBIfExists();
        if (!db) return { dbExists: false };
        if (!db.objectStoreNames.contains(BLOB_STORE)) {
            db.close();
            return { dbExists: false };
        }
        const rec = await new Promise<StoredBlob | null>((resolve, reject) => {
            const req = db.transaction(BLOB_STORE, 'readonly').objectStore(BLOB_STORE).get(id);
            req.onsuccess = () => resolve((req.result as StoredBlob | undefined) ?? null);
            req.onerror = () => reject(req.error);
        });
        db.close();
        return { dbExists: true, rec };
    } catch {
        // A transient failure is not proof of absence — report "exists, no record"
        // so the caller retries later instead of latching the migration shut.
        return { dbExists: true, rec: null };
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

/** Local in-memory Map fallback database for testing environments. */
const memory = new Map<string, Blob>();
let memoryTotalBytes = 0;
const MAX_MEMORY_BLOB_BYTES = 50 * 1024 * 1024; // 50 MB limit

const LEGACY_BLOBS_CHECKED_KEY = 'hados_vfs_legacy_blobs_checked';

/** Listeners told which blob the memory fallback dropped. Registered by the VFS. */
const evictHandlers = new Set<(id: string) => void>();

/** One warning per session, not one per file, the first time RAM is all we have. */
let memoryFallbackAnnounced = false;
function notifyMemoryFallback(): void {
    if (memoryFallbackAnnounced) return;
    memoryFallbackAnnounced = true;
    console.warn(
        '[VFSBlobStore] No durable storage available (OPFS and IndexedDB both failed). ' +
        'Binary files are being held in memory and will NOT survive a reload.'
    );
}

/**
 * Reconstructs a full Blob wrapper from the raw database records, lazy-migrating legacy keys.
 * @param id Unique blob key identifier.
 */
async function idbGet(id: string): Promise<Blob | null> {
    const rec = await idbGetRaw(id);
    if (rec) return new Blob([rec.buffer], { type: rec.type });

    if (localStorage.getItem(LEGACY_BLOBS_CHECKED_KEY) === 'true') {
        return null;
    }

    // Miss: the blob may predate the HadOS rename. Adopt it on the way out so the
    // next read hits the new store and the legacy one drains over time.
    const legacy = await legacyIdbLookup(id);
    if (!legacy.dbExists) {
        // No legacy store at all — stop paying for this probe on every future miss.
        // Latching on a missing KEY instead would strand every other legacy blob
        // behind the first lookup that happened to miss (audit v1.0.0-rc.1, M-14).
        try { localStorage.setItem(LEGACY_BLOBS_CHECKED_KEY, 'true'); } catch { /* private mode */ }
        return null;
    }
    if (!legacy.rec) return null;
    const blob = new Blob([legacy.rec.buffer], { type: legacy.rec.type });
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
    /**
     * Registers the handler invoked when the memory fallback drops a blob to make
     * room. The store has no idea what a file is, so it cannot clean up after
     * itself — whoever owns the references has to be told. See the VFS wiring.
     */
    onEvict(handler: (id: string) => void): void;
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
        // The memory map is a last resort that does NOT survive a reload, so it has
        // to be bounded: without a cap a handful of 50 MB blobs OOMs the tab
        // (audit v1.0.0-rc.1, M-13).
        //
        // Nothing can be done for a blob larger than the whole budget — evicting
        // every other blob still would not make it fit. Refuse BEFORE touching the
        // map, so a failed overwrite leaves the previous content intact.
        if (data.size > MAX_MEMORY_BLOB_BYTES) {
            throw new Error(
                `VFSBlobStore: blob size (${data.size} bytes) exceeds the in-memory fallback budget ` +
                `(${MAX_MEMORY_BLOB_BYTES} bytes); refusing to store "${id}"`
            );
        }

        notifyMemoryFallback();

        const prev = memory.get(id);
        if (prev) {
            memoryTotalBytes -= prev.size;
            memory.delete(id);
        }

        // Evict least-recently-used first (`get` re-inserts on read, so Map order is
        // true recency). Each eviction is ANNOUNCED: dropping a blob silently would
        // leave the VFS holding a node whose blobRef resolves to nothing — a file
        // that lists normally and opens empty, which is the exact dishonesty M-13
        // was about, just moved from the write to the read.
        while (memoryTotalBytes + data.size > MAX_MEMORY_BLOB_BYTES && memory.size > 0) {
            const lruKey = memory.keys().next().value;
            if (lruKey === undefined) break;
            const lruBlob = memory.get(lruKey);
            if (lruBlob) memoryTotalBytes -= lruBlob.size;
            memory.delete(lruKey);
            for (const handler of evictHandlers) {
                try { handler(lruKey); } catch { /* a bad listener must not fail the write */ }
            }
        }

        memory.set(id, data);
        memoryTotalBytes += data.size;
    }

    async function get(id: string): Promise<Blob | null> {
        try {
            if (backend === 'opfs') { const b = await opfsGet(id); if (b) return b; }
            if (backend === 'indexeddb') { const b = await idbGet(id); if (b) return b; }
        } catch { /* fall through */ }
        const b = memory.get(id);
        if (b) {
            // Refresh LRU insertion order
            memory.delete(id);
            memory.set(id, b);
            return b;
        }
        return null;
    }

    async function del(id: string): Promise<void> {
        const existing = memory.get(id);
        if (existing) {
            memoryTotalBytes -= existing.size;
            memory.delete(id);
        }
        try {
            if (backend === 'opfs') return await opfsDelete(id);
            if (backend === 'indexeddb') return await idbDelete(id);
        } catch { /* ignore */ }
    }

    function onEvict(handler: (id: string) => void): void {
        evictHandlers.add(handler);
    }

    return { put, get, delete: del, backend: () => backend, onEvict };
})();
