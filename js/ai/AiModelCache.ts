/**
 * AI MODEL CACHE
 * Downloads a model's bytes once and serves them from local storage forever after.
 * Models are tens of MB and immutable, so re-fetching one per boot would be a waste
 * of the user's bandwidth and several seconds of their time.
 *
 * This is a SYSTEM cache, not user data, which is why it does not reuse
 * `VFSBlobStore`: models live in their own OPFS subdirectory / their own IndexedDB.
 * The two stores must not share a namespace — a future "collect unreferenced blobs"
 * pass over the VFS would otherwise delete every cached model, since no VFS node
 * ever references one.
 *
 * Backend selection mirrors VFSBlobStore (first available wins):
 *   1. OPFS   — real files, ideal for large binaries.
 *   2. IndexedDB — when OPFS is unavailable (older browsers, jsdom + fake-indexeddb).
 *   3. In-memory Map — last resort so the API never throws (non-durable).
 */

export type ModelBackend = 'opfs' | 'indexeddb' | 'memory';

/** Where a model comes from and how to know the bytes arrived intact. */
export interface IModelSpec {
    /** Stable cache key. Also the on-disk filename, hence the strict charset. */
    id: string;
    /** Fetched on a cache miss. */
    url: string;
    /** Expected byte length. A truncated download that we cached would be poison. */
    bytes?: number;
    /** Lowercase hex SHA-256. Verified when the platform exposes SubtleCrypto. */
    sha256?: string;
}

export type ProgressFn = (loaded: number, total: number) => void;

export interface IAiModelCache {
    load(spec: IModelSpec, onProgress?: ProgressFn): Promise<ArrayBuffer>;
    /** Reads cached bytes WITHOUT any download path — for user-imported models. */
    get(id: string): Promise<ArrayBuffer | null>;
    /** Stores caller-supplied bytes (a user-imported model file). */
    put(id: string, data: ArrayBuffer): Promise<void>;
    has(id: string): Promise<boolean>;
    evict(id: string): Promise<void>;
    list(): Promise<string[]>;
    backend(): ModelBackend;
    __reset(): void;
}

const OPFS_DIR = 'hados-ai-models';
const IDB_NAME = 'hados-ai-models';
const IDB_VERSION = 1;
const IDB_STORE = 'models';

/**
 * A model id becomes a filename, so it may not be able to escape its directory or
 * collide with a sibling. Rejecting outright beats sanitising: a silently rewritten
 * id would cache the same model twice under two names.
 */
const VALID_ID = /^[a-z0-9][a-z0-9._-]{0,127}$/i;

export function isValidModelId(id: string): boolean {
    return VALID_ID.test(id) && !id.includes('..');
}

function assertValidId(id: string): void {
    if (!isValidModelId(id)) throw new Error(`AiModelCache: invalid model id '${id}'`);
}

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
    const root = await navigator.storage.getDirectory();
    return root.getDirectoryHandle(OPFS_DIR, { create: true });
}

async function opfsPut(id: string, data: ArrayBuffer): Promise<void> {
    const dir = await opfsDir();
    const handle = await dir.getFileHandle(id, { create: true });
    const writable = await (handle as any).createWritable();
    await writable.write(data);
    await writable.close();
}

async function opfsGet(id: string): Promise<ArrayBuffer | null> {
    try {
        const dir = await opfsDir();
        const handle = await dir.getFileHandle(id);
        const file = await handle.getFile();
        return await file.arrayBuffer();
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

async function opfsList(): Promise<string[]> {
    try {
        const dir = await opfsDir() as any;
        const names: string[] = [];
        for await (const key of dir.keys()) names.push(key as string);
        return names;
    } catch {
        return [];
    }
}

// ── IndexedDB backend ─────────────────────────────────────────────────────────
let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
    if (!dbPromise) {
        dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
            const req = indexedDB.open(IDB_NAME, IDB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    return dbPromise;
}

async function idbPut(id: string, data: ArrayBuffer): Promise<void> {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(data, id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

async function idbGet(id: string): Promise<ArrayBuffer | null> {
    const db = await openDB();
    return new Promise<ArrayBuffer | null>((resolve, reject) => {
        const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(id);
        req.onsuccess = () => resolve((req.result as ArrayBuffer | undefined) ?? null);
        req.onerror = () => reject(req.error);
    });
}

async function idbDelete(id: string): Promise<void> {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function idbList(): Promise<string[]> {
    const db = await openDB();
    return new Promise<string[]>((resolve, reject) => {
        const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).getAllKeys();
        req.onsuccess = () => resolve((req.result as IDBValidKey[]).map(String));
        req.onerror = () => reject(req.error);
    });
}

// ── Memory backend (last resort) ──────────────────────────────────────────────
const memory = new Map<string, ArrayBuffer>();

// ── Integrity ─────────────────────────────────────────────────────────────────
async function sha256Hex(data: ArrayBuffer): Promise<string | null> {
    try {
        const subtle = (globalThis.crypto as Crypto | undefined)?.subtle;
        if (!subtle) return null; // insecure context or a shim without SubtleCrypto
        const digest = await subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
        return null;
    }
}

/**
 * Throws unless the bytes are what the spec promised. Called before anything is
 * written, so a bad download is never cached — a poisoned cache would fail on every
 * later boot with no way for the user to know why.
 */
async function verify(spec: IModelSpec, data: ArrayBuffer): Promise<void> {
    if (spec.bytes !== undefined && data.byteLength !== spec.bytes) {
        throw new Error(`AiModelCache: '${spec.id}' is ${data.byteLength} bytes, expected ${spec.bytes}`);
    }
    if (spec.sha256) {
        const actual = await sha256Hex(data);
        // A platform without SubtleCrypto cannot check the hash. Downgrading to
        // "unverified" beats refusing to run; the transport is already HTTPS.
        if (actual !== null && actual !== spec.sha256.toLowerCase()) {
            throw new Error(`AiModelCache: '${spec.id}' failed its SHA-256 check`);
        }
    }
}

// ── Download ──────────────────────────────────────────────────────────────────
/**
 * Fetches the model, reporting progress as the bytes land. Streaming exists purely
 * so a first-run download can show real progress instead of a frozen UI; when the
 * body is not a readable stream (a mocked fetch, or no Content-Length) it falls
 * back to a single arrayBuffer() and one final progress tick.
 */
async function download(spec: IModelSpec, onProgress?: ProgressFn): Promise<ArrayBuffer> {
    const res = await fetch(spec.url);
    if (!res.ok) throw new Error(`AiModelCache: '${spec.id}' download failed — HTTP ${res.status}`);

    const declared = Number(res.headers?.get?.('content-length') ?? 0);
    const total = declared || spec.bytes || 0;
    const reader = res.body?.getReader?.();

    if (!reader) {
        const buf = await res.arrayBuffer();
        onProgress?.(buf.byteLength, buf.byteLength);
        return buf;
    }

    const chunks: Uint8Array[] = [];
    let loaded = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
            chunks.push(value);
            loaded += value.byteLength;
            onProgress?.(loaded, total || loaded);
        }
    }

    const out = new Uint8Array(loaded);
    let offset = 0;
    for (const c of chunks) { out.set(c, offset); offset += c.byteLength; }
    onProgress?.(loaded, total || loaded);
    return out.buffer;
}

// ── The cache ─────────────────────────────────────────────────────────────────
export const AiModelCache: IAiModelCache = (() => {
    const backend: ModelBackend = opfsAvailable() ? 'opfs' : (idbAvailable() ? 'indexeddb' : 'memory');

    // Two apps asking for the same model at once must not download it twice.
    const inFlight = new Map<string, Promise<ArrayBuffer>>();

    async function readStored(id: string): Promise<ArrayBuffer | null> {
        try {
            if (backend === 'opfs') { const b = await opfsGet(id); if (b) return b; }
            if (backend === 'indexeddb') { const b = await idbGet(id); if (b) return b; }
        } catch { /* fall through to memory */ }
        return memory.get(id) ?? null;
    }

    async function writeStored(id: string, data: ArrayBuffer): Promise<void> {
        try {
            if (backend === 'opfs') { await opfsPut(id, data); return; }
            if (backend === 'indexeddb') { await idbPut(id, data); return; }
        } catch {
            // A failed write is not fatal: serve from memory and re-download next boot.
        }
        memory.set(id, data);
    }

    async function load(spec: IModelSpec, onProgress?: ProgressFn): Promise<ArrayBuffer> {
        assertValidId(spec.id);

        const cached = await readStored(spec.id);
        if (cached) {
            onProgress?.(cached.byteLength, cached.byteLength);
            return cached;
        }

        const pending = inFlight.get(spec.id);
        if (pending) return pending;

        const job = (async () => {
            const data = await download(spec, onProgress);
            await verify(spec, data);   // before the write: never cache a bad model
            await writeStored(spec.id, data);
            return data;
        })();

        inFlight.set(spec.id, job);
        try {
            return await job;
        } finally {
            // Clear on failure too, so a transient network error is retryable.
            inFlight.delete(spec.id);
        }
    }

    /**
     * Read-only lookup for models that were IMPORTED rather than downloaded — a
     * user-supplied Gemma bundle has no URL, so on a miss there is nothing to
     * fetch and the caller must ask the user to import again.
     */
    async function get(id: string): Promise<ArrayBuffer | null> {
        if (!isValidModelId(id)) return null;
        return readStored(id);
    }

    /**
     * Stores caller-supplied bytes under an id. The main thread writes an import
     * here; the ai-runtime worker reads it back through `get` — OPFS/IndexedDB
     * are origin-scoped and shared across both. (The in-memory last resort is
     * per-realm and therefore NOT shared; on that backend a chat model works
     * only where it was imported, which jsdom tests account for.)
     */
    async function put(id: string, data: ArrayBuffer): Promise<void> {
        assertValidId(id);
        await writeStored(id, data);
    }

    async function has(id: string): Promise<boolean> {
        if (!isValidModelId(id)) return false;
        return (await readStored(id)) !== null;
    }

    async function evict(id: string): Promise<void> {
        assertValidId(id);
        memory.delete(id);
        try {
            if (backend === 'opfs') return await opfsDelete(id);
            if (backend === 'indexeddb') return await idbDelete(id);
        } catch { /* ignore */ }
    }

    async function list(): Promise<string[]> {
        try {
            if (backend === 'opfs') return await opfsList();
            if (backend === 'indexeddb') return await idbList();
        } catch { /* fall through */ }
        return [...memory.keys()];
    }

    /** Test seam: drops in-memory state. Durable backends are cleared by the test env. */
    function __reset(): void {
        memory.clear();
        inFlight.clear();
        dbPromise = null;
    }

    return { load, get, put, has, evict, list, backend: () => backend, __reset };
})();
