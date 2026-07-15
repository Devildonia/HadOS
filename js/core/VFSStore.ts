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

const LEGACY_KEY = 'win95_vfs_root';
const DB_NAME = 'win95-vfs';
const DB_VERSION = 1;
const STORE_NAME = 'kv';
const ROOT_KEY = 'root';

function idbAvailable(): boolean {
    try {
        return typeof indexedDB !== 'undefined' && indexedDB !== null;
    } catch {
        return false;
    }
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
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

function idbGet(db: IDBDatabase, key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
        req.onerror = () => reject(req.error);
    });
}

function idbPut(db: IDBDatabase, key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(value, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

function idbDelete(db: IDBDatabase, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export interface IVFSStore {
    /** Loads the serialized tree, or null if none is stored. */
    load(): Promise<string | null>;
    /** Persists the serialized tree durably. */
    save(data: string): Promise<void>;
    /** Removes the stored tree (reset). */
    clear(): Promise<void>;
    /** True when the durable backend is IndexedDB (false = localStorage fallback). */
    usingIndexedDB(): boolean;
}

export const VFSStore: IVFSStore = (() => {
    let dbPromise: Promise<IDBDatabase> | null = null;
    const useIDB = idbAvailable();

    function getDB(): Promise<IDBDatabase> {
        if (!dbPromise) dbPromise = openDB();
        return dbPromise;
    }

    async function load(): Promise<string | null> {
        if (!useIDB) {
            return localStorage.getItem(LEGACY_KEY);
        }
        try {
            const db = await getDB();
            const existing = await idbGet(db, ROOT_KEY);
            if (existing !== null) return existing;

            // One-time migration from the legacy localStorage store.
            const legacy = localStorage.getItem(LEGACY_KEY);
            if (legacy !== null) {
                await idbPut(db, ROOT_KEY, legacy);
                localStorage.removeItem(LEGACY_KEY);
                return legacy;
            }
            return null;
        } catch {
            // IDB failed at runtime — fall back to localStorage so we still boot.
            return localStorage.getItem(LEGACY_KEY);
        }
    }

    async function save(data: string): Promise<void> {
        if (!useIDB) {
            localStorage.setItem(LEGACY_KEY, data);
            return;
        }
        try {
            const db = await getDB();
            await idbPut(db, ROOT_KEY, data);
        } catch {
            // Best-effort fallback keeps data somewhere durable.
            try { localStorage.setItem(LEGACY_KEY, data); } catch { /* quota */ }
        }
    }

    async function clear(): Promise<void> {
        localStorage.removeItem(LEGACY_KEY);
        if (!useIDB) return;
        try {
            const db = await getDB();
            await idbDelete(db, ROOT_KEY);
        } catch { /* ignore */ }
    }

    return { load, save, clear, usingIndexedDB: () => useIDB };
})();
