// fake-indexeddb/auto must precede the store imports: they capture whether
// IndexedDB exists at module-load time.
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { VFS } from '../js/core/VFS';
import { VFSStore } from '../js/core/VFSStore';

/**
 * The HadOS rename must not cost an existing user their files. Two independent
 * migrations cover that:
 *   1. the storage location  (win95-vfs / win95_vfs_root -> hados-vfs)
 *   2. the system directory  (C:\WINDOWS -> C:\HADOS) inside the tree
 */

const LEGACY_LOCAL_KEY = 'win95_vfs_root';
const LEGACY_DB = 'win95-vfs';
const NEW_DB = 'hados-vfs';

const idb = {
    put(dbName: string, key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const open = indexedDB.open(dbName, 1);
            open.onupgradeneeded = () => open.result.createObjectStore('kv');
            open.onsuccess = () => {
                const db = open.result;
                const tx = db.transaction('kv', 'readwrite');
                tx.objectStore('kv').put(value, key);
                tx.oncomplete = () => { db.close(); resolve(); };
                tx.onerror = () => reject(tx.error);
            };
            open.onerror = () => reject(open.error);
        });
    },
    get(dbName: string, key: string): Promise<string | null> {
        return new Promise((resolve) => {
            const open = indexedDB.open(dbName, 1);
            open.onupgradeneeded = () => open.result.createObjectStore('kv');
            open.onsuccess = () => {
                const db = open.result;
                const req = db.transaction('kv', 'readonly').objectStore('kv').get(key);
                req.onsuccess = () => { db.close(); resolve(req.result ?? null); };
                req.onerror = () => { db.close(); resolve(null); };
            };
            open.onerror = () => resolve(null);
        });
    },
    drop(dbName: string): Promise<void> {
        return new Promise((resolve) => {
            const req = indexedDB.deleteDatabase(dbName);
            req.onsuccess = req.onerror = req.onblocked = () => resolve();
        });
    },
};

/** A minimal pre-rename tree: system dir under WINDOWS, with a user file inside. */
const legacyTree = () => JSON.stringify({
    name: 'C:', type: 'dir', children: {
        WINDOWS: {
            name: 'WINDOWS', type: 'dir', children: {
                SYSTEM: {
                    name: 'SYSTEM', type: 'dir', children: {
                        'crash.log': { name: 'crash.log', type: 'file', content: 'old crash' },
                    },
                },
                DESKTOP: { name: 'DESKTOP', type: 'dir', children: {} },
            },
        },
        GAMES: { name: 'GAMES', type: 'dir', children: { g: { name: 'g', type: 'dir', children: {} } } },
        DESKTOP: { name: 'DESKTOP', type: 'dir', children: { d: { name: 'd', type: 'dir', children: {} } } },
        DOCUMENTS: {
            name: 'DOCUMENTS', type: 'dir', children: {
                'mine.txt': { name: 'mine.txt', type: 'file', content: 'my data' },
            },
        },
    },
});

async function freshStorage() {
    localStorage.clear();
    (VFS as any).__reset();
    // Close the store's cached handle FIRST: an open connection blocks
    // deleteDatabase, and the stalled delete would hang every later open().
    await (VFSStore as any).__closeForTesting();
    await idb.drop(NEW_DB);
    await idb.drop(LEGACY_DB);
}

describe('HadOS migration — storage location', () => {
    beforeEach(freshStorage);

    it('adopts a tree left in the pre-rename IndexedDB', async () => {
        await idb.put(LEGACY_DB, 'root', legacyTree());

        await VFS.init();

        expect(VFS.readFile('C:\\DOCUMENTS\\mine.txt')).toBe('my data');
        // ...and it is now stored under the HadOS name.
        await VFS.flush();
        expect(await idb.get(NEW_DB, 'root')).toContain('mine.txt');
    });

    it('retires the legacy database once adopted', async () => {
        await idb.put(LEGACY_DB, 'root', legacyTree());
        await VFS.init();
        expect(await idb.get(LEGACY_DB, 'root')).toBeNull();
    });

    it('adopts the even older localStorage tree', async () => {
        localStorage.setItem(LEGACY_LOCAL_KEY, legacyTree());

        await VFS.init();

        expect(VFS.readFile('C:\\DOCUMENTS\\mine.txt')).toBe('my data');
        expect(localStorage.getItem(LEGACY_LOCAL_KEY)).toBeNull(); // consumed
    });

    it('leaves an existing HadOS store alone (no clobbering by a stale legacy one)', async () => {
        await idb.put(NEW_DB, 'root', JSON.stringify({
            name: 'C:', type: 'dir', children: {
                HADOS: { name: 'HADOS', type: 'dir', children: { SYSTEM: { name: 'SYSTEM', type: 'dir', children: {} } } },
                GAMES: { name: 'GAMES', type: 'dir', children: { g: { name: 'g', type: 'dir', children: {} } } },
                DESKTOP: { name: 'DESKTOP', type: 'dir', children: { d: { name: 'd', type: 'dir', children: {} } } },
                DOCUMENTS: { name: 'DOCUMENTS', type: 'dir', children: { 'new.txt': { name: 'new.txt', type: 'file', content: 'current' } } },
            },
        }));
        await idb.put(LEGACY_DB, 'root', legacyTree());

        await VFS.init();

        expect(VFS.readFile('C:\\DOCUMENTS\\new.txt')).toBe('current');
        expect(VFS.resolve('C:\\DOCUMENTS\\mine.txt')).toBeNull(); // legacy not adopted
    });

    it('starts from defaults when there is nothing to adopt', async () => {
        await VFS.init();
        expect(VFS.getRoot()!.name).toBe('C:');
        expect(VFS.resolve('C:\\HADOS')).toBeDefined();
    });
});

describe('HadOS migration — system directory rename', () => {
    beforeEach(freshStorage);

    it('moves C:\\WINDOWS to C:\\HADOS, keeping its contents', async () => {
        await idb.put(NEW_DB, 'root', legacyTree());

        await VFS.init();

        expect(VFS.resolve('C:\\WINDOWS')).toBeNull();          // gone
        expect(VFS.resolve('C:\\HADOS')).toBeDefined();          // moved
        expect(VFS.resolve('C:\\HADOS')!.name).toBe('HADOS');     // and renamed
        expect(VFS.readFile('C:\\HADOS\\SYSTEM\\crash.log')).toBe('old crash'); // contents kept
        expect(VFS.resolve('C:\\HADOS\\DESKTOP')).toBeDefined();
    });

    it('persists the rename, so it happens once', async () => {
        await idb.put(NEW_DB, 'root', legacyTree());
        await VFS.init();
        await VFS.flush();

        const stored = await idb.get(NEW_DB, 'root');
        expect(stored).toContain('HADOS');
        expect(JSON.parse(stored!).children.WINDOWS).toBeUndefined();
    });

    it('is a no-op on a tree that is already HadOS-shaped', async () => {
        await VFS.init();                       // defaults: already HADOS
        expect(VFS.resolve('C:\\HADOS')).toBeDefined();
        expect(VFS.resolve('C:\\WINDOWS')).toBeNull();
    });

    it('never merges into an existing HADOS dir — the legacy one is left in place', async () => {
        const both = JSON.parse(legacyTree());
        both.children.HADOS = { name: 'HADOS', type: 'dir', children: { SYSTEM: { name: 'SYSTEM', type: 'dir', children: {} } } };
        await idb.put(NEW_DB, 'root', JSON.stringify(both));

        await VFS.init();

        // Ambiguous state: keep both rather than silently overwrite user data.
        expect(VFS.resolve('C:\\HADOS')).toBeDefined();
        expect(VFS.resolve('C:\\WINDOWS')).toBeDefined();
        expect(VFS.readFile('C:\\WINDOWS\\SYSTEM\\crash.log')).toBe('old crash');
    });
});

/**
 * The desktop shortcuts were renamed in DEFAULT_FS, which only reaches fresh
 * installs — an existing tree keeps its persisted copy. `migrateDesktopShortcuts`
 * is the other half, on the same "rename the data, never reset it" principle as
 * the C:\WINDOWS move above.
 */
function treeWithLegacyShortcuts(): string {
    return JSON.stringify({
        name: 'C:', type: 'dir', children: {
            HADOS: { name: 'HADOS', type: 'dir', children: { SYSTEM: { name: 'SYSTEM', type: 'dir', children: {} } } },
            DOCUMENTS: { name: 'DOCUMENTS', type: 'dir', children: { 'mine.txt': { name: 'mine.txt', type: 'file', content: 'keep me' } } },
            GAMES: { name: 'GAMES', type: 'dir', children: { Doom: { name: 'Doom', type: 'dir', children: {} } } },
            DESKTOP: {
                name: 'DESKTOP', type: 'dir', children: {
                    'Notepad': { name: 'Notepad', type: 'shortcut', actionType: 'launch', actionTarget: 'notepad' },
                    'Paint': { name: 'Paint', type: 'shortcut', actionType: 'launch', actionTarget: 'paint' },
                    'Recycle Bin': { name: 'Recycle Bin', type: 'shortcut', actionType: 'openDialog', actionTarget: 'dialog-recyclebin' },
                    'My Computer': { name: 'My Computer', type: 'shortcut', actionType: 'explorer', actionTarget: 'This PC' },
                    'Holiday.txt': { name: 'Holiday.txt', type: 'file', content: 'user file' },
                }
            }
        }
    });
}

describe('HadOS migration — desktop shortcut names', () => {
    beforeEach(freshStorage);

    it('renames the legacy shortcuts in an existing tree', async () => {
        await idb.put(NEW_DB, 'root', treeWithLegacyShortcuts());
        await VFS.init();

        expect(VFS.resolve('C:\\DESKTOP\\Notapad')).not.toBeNull();
        expect(VFS.resolve('C:\\DESKTOP\\Pinta')).not.toBeNull();
        expect(VFS.resolve('C:\\DESKTOP\\Eco Bin')).not.toBeNull();
        expect(VFS.resolve('C:\\DESKTOP\\Mi PC')).not.toBeNull();

        expect(VFS.resolve('C:\\DESKTOP\\Notepad')).toBeNull();
        expect(VFS.resolve('C:\\DESKTOP\\Paint')).toBeNull();
        expect(VFS.resolve('C:\\DESKTOP\\Recycle Bin')).toBeNull();
        expect(VFS.resolve('C:\\DESKTOP\\My Computer')).toBeNull();
    });

    it('carries the node across rather than recreating it', async () => {
        await idb.put(NEW_DB, 'root', treeWithLegacyShortcuts());
        await VFS.init();

        const moved = VFS.resolve('C:\\DESKTOP\\Notapad')!;
        expect(moved.name).toBe('Notapad');          // the node's own name follows
        expect(moved.actionTarget).toBe('notepad');  // and its behaviour is intact
    });

    it('leaves everything that is not one of those shortcuts alone', async () => {
        await idb.put(NEW_DB, 'root', treeWithLegacyShortcuts());
        await VFS.init();

        expect(VFS.readFile('C:\\DESKTOP\\Holiday.txt')).toBe('user file');
        expect(VFS.readFile('C:\\DOCUMENTS\\mine.txt')).toBe('keep me');
    });

    it('does not clobber a new name the user already has', async () => {
        const tree = JSON.parse(treeWithLegacyShortcuts());
        tree.children.DESKTOP.children['Notapad'] = { name: 'Notapad', type: 'file', content: 'mine, not a shortcut' };
        await idb.put(NEW_DB, 'root', JSON.stringify(tree));

        await VFS.init();

        expect(VFS.readFile('C:\\DESKTOP\\Notapad')).toBe('mine, not a shortcut');
        expect(VFS.resolve('C:\\DESKTOP\\Notepad')).not.toBeNull();   // legacy left in place
    });

    it('is a no-op on a tree that already uses the new names', async () => {
        await VFS.init();   // defaults
        expect(VFS.resolve('C:\\DESKTOP\\Notapad')).not.toBeNull();
        expect(VFS.resolve('C:\\DESKTOP\\Notepad')).toBeNull();
    });
});
