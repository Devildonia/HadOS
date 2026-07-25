/**
 * VFS STORAGE BACKEND
 * Async key–value persistence for the VFS tree. Prefers IndexedDB (large quota,
 * structured, off the localStorage 5–10 MB cap) and transparently falls back to
 * localStorage when IndexedDB is unavailable (e.g. jsdom in tests, private-mode
 * quirks). The VFS keeps an in-memory tree as the working copy, so this backend
 * only handles durable load/save of the serialized tree — reads stay synchronous
 * against memory.
 *
 * Migration: the previous implementation stored the tree in localStorage under
 * LEGACY_KEY. On first load with IndexedDB available, if IDB has no tree but the
 * legacy localStorage entry exists, it is adopted into IDB and the legacy key is
 * cleared. Phase 0.1 of the Web OS roadmap — see docs/webos-roadmap.
 */

/** Unique database name for HadOS VFS storage. */
const DB_NAME = 'hados-vfs';
/** Schema version index for the IndexedDB backend. */
const DB_VERSION = 1;
/** Target object store name within the database. */
const STORE_NAME = 'kv';
/** Key used to store the serialized tree data. */
const ROOT_KEY = 'root';

/**
 * Pre-HadOS storage, read once and adopted so an existing install keeps its files
 * across the rename. Ordered oldest-last: the IndexedDB tree superseded the
 * localStorage one, which itself predates the IndexedDB migration.
 */
const LEGACY_DB_NAME = 'win95-vfs';        // Windows App Center ≤ v1.6.7
const LEGACY_KEY = 'win95_vfs_root';       // even older: localStorage tree

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

/**
 * Opens a connection to the specified IndexedDB database, initializing object stores if needed.
 * @param name Database name.
 */
function openDB(name: string = DB_NAME): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(name, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/**
 * Reads the tree from the pre-rename IndexedDB without creating it if absent.
 * Opening a missing DB would otherwise materialise an empty one and leave litter.
 */
async function readLegacyDB(): Promise<string | null> {
    try {
        if (typeof indexedDB.databases === 'function') {
            const names = (await indexedDB.databases()).map(d => d.name);
            if (!names.includes(LEGACY_DB_NAME)) return null;
        }
        const db = await openDB(LEGACY_DB_NAME);
        const value = await idbGet(db, ROOT_KEY);
        db.close();
        return value;
    } catch {
        return null;
    }
}

/**
 * Helper wrapper to perform a read transaction against IndexedDB object store.
 * @param db Database handle.
 * @param key Target record key.
 */
function idbGet(db: IDBDatabase, key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
        req.onerror = () => reject(req.error);
    });
}

/**
 * Helper wrapper to perform a write transaction against IndexedDB object store.
 * @param db Database handle.
 * @param key Target record key.
 * @param value String data value to write.
 */
function idbPut(db: IDBDatabase, key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(value, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

/** Drops a whole database (used to retire a legacy store once adopted). */
function deleteDatabase(name: string): Promise<void> {
    return new Promise((resolve) => {
        try {
            const req = indexedDB.deleteDatabase(name);
            req.onsuccess = () => resolve();
            req.onerror = () => resolve();   // best-effort: never block boot
            req.onblocked = () => resolve();
        } catch { resolve(); }
    });
}

/**
 * Helper wrapper to delete a record from the IndexedDB store.
 * @param db Database handle.
 * @param key Target record key.
 */
function idbDelete(db: IDBDatabase, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

const LEGACY_MIGRATED_KEY = 'hados_vfs_legacy_migrated';
const LS_DIRTY_KEY = 'hados_vfs_ls_dirty';

/**
 * Interface defining VFS Storage backend loader operations.
 */
export interface IVFSStore {
    /** Loads the serialized tree, or null if none is stored. */
    load(): Promise<string | null>;
    /** Persists the serialized tree durably. */
    save(data: string): Promise<void>;
    /** Synchronous fallback save for page unload events. */
    saveSync(data: string): void;
    /** Removes the stored tree (reset). */
    clear(): Promise<void>;
    /** Closes the cached connection (tests: an open handle blocks deleteDatabase). */
    __closeForTesting(): Promise<void>;
    /** True when the durable backend is IndexedDB (false = localStorage fallback). */
    usingIndexedDB(): boolean;
}

export const VFSStore: IVFSStore = (() => {
    /** DB connection instance promise cache. */
    let dbPromise: Promise<IDBDatabase> | null = null;
    /** Cached check status of IndexedDB browser availability. */
    const useIDB = idbAvailable();

    /**
     * Resolves the primary active database connection promise.
     */
    function getDB(): Promise<IDBDatabase> {
        if (!dbPromise) dbPromise = openDB();
        return dbPromise;
    }

    function saveSync(data: string): void {
        try {
            localStorage.setItem(LEGACY_KEY, data);
            localStorage.setItem(LS_DIRTY_KEY, String(Date.now()));
        } catch { /* quota */ }
    }

    /**
     * Asynchronously loads the VFS tree, migrating data from legacy formats if present.
     */
    async function load(): Promise<string | null> {
        const isLsDirty = localStorage.getItem(LS_DIRTY_KEY) !== null;
        if (!useIDB) {
            return localStorage.getItem(LEGACY_KEY);
        }
        try {
            const db = await getDB();

            if (isLsDirty) {
                const lsData = localStorage.getItem(LEGACY_KEY);
                if (lsData !== null) {
                    await idbPut(db, ROOT_KEY, lsData);
                    localStorage.removeItem(LS_DIRTY_KEY);
                    return lsData;
                }
            }

            const existing = await idbGet(db, ROOT_KEY);
            if (existing !== null) return existing;

            const isMigrated = localStorage.getItem(LEGACY_MIGRATED_KEY) === 'true';
            if (!isMigrated) {
                const legacyDb = await readLegacyDB();
                if (legacyDb !== null) {
                    await idbPut(db, ROOT_KEY, legacyDb);
                    await deleteDatabase(LEGACY_DB_NAME);
                    localStorage.setItem(LEGACY_MIGRATED_KEY, 'true');
                    return legacyDb;
                }

                const legacyLocal = localStorage.getItem(LEGACY_KEY);
                if (legacyLocal !== null) {
                    await idbPut(db, ROOT_KEY, legacyLocal);
                    localStorage.removeItem(LEGACY_KEY);
                    localStorage.setItem(LEGACY_MIGRATED_KEY, 'true');
                    return legacyLocal;
                }
                localStorage.setItem(LEGACY_MIGRATED_KEY, 'true');
            }
            return null;
        } catch {
            // IDB failed at runtime — fall back to localStorage so we still boot.
            return localStorage.getItem(LEGACY_KEY);
        }
    }

    /**
     * Persists the serialized file system tree. Falls back to localStorage on write failure.
     * @param data Serialized VFS tree JSON string.
     */
    async function save(data: string): Promise<void> {
        if (!useIDB) {
            saveSync(data);
            return;
        }
        try {
            const db = await getDB();
            await idbPut(db, ROOT_KEY, data);
            if (localStorage.getItem(LS_DIRTY_KEY)) {
                localStorage.removeItem(LS_DIRTY_KEY);
            }
        } catch {
            // Best-effort fallback keeps data somewhere durable.
            saveSync(data);
        }
    }

    /**
     * Clears all VFS tree data records in both database and localStorage configurations.
     */
    async function clear(): Promise<void> {
        localStorage.removeItem(LEGACY_KEY);
        localStorage.removeItem(LS_DIRTY_KEY);
        localStorage.removeItem(LEGACY_MIGRATED_KEY);
        if (!useIDB) return;
        try {
            const db = await getDB();
            await idbDelete(db, ROOT_KEY);
        } catch { /* ignore */ }
    }

    /**
     * Drops the cached connection. Only for tests: an open IndexedDB handle blocks
     * `deleteDatabase`, and the pending delete then stalls every later open().
     */
    async function __closeForTesting(): Promise<void> {
        if (!dbPromise) return;
        try { (await dbPromise).close(); } catch { /* already gone */ }
        dbPromise = null;
    }

    return { load, save, saveSync, clear, usingIndexedDB: () => useIDB, __closeForTesting };
})();
