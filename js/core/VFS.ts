/**
 * WINDOWS 95 APP CENTER - VFS (Virtual File System)
 * Hierarchical data management with localStorage persistence
 * Version: 3.1 (ES Modules)
 */

import { Utils } from '../utils';
import { Services } from './ServiceContainer';
import { VFSStore } from './VFSStore';
import { VFSBlobStore } from './VFSBlobStore';

export interface IVFSNode {
    name: string;
    type: 'dir' | 'file' | 'shortcut';
    children?: Record<string, IVFSNode>;
    content?: string;
    /** Binary/large files store their bytes in the VFSBlobStore (OPFS/IDB); the
     *  tree keeps only this reference plus size/mime. Mutually exclusive with `content`. */
    blobRef?: string;
    size?: number;
    mime?: string;
    icon?: string;
    actionType?: string;
    actionTarget?: string;
}

export interface IVFS {
    /** Hydrates the in-memory tree from the durable backend (IndexedDB / fallback). */
    init(): Promise<void>;
    resolve(path: string): IVFSNode | null;
    mkdir(path: string, name: string): boolean;
    writeFile(path: string, name: string, content: string): boolean;
    readFile(path: string): string | null;
    /** Reads a file's content: a Blob when it is blob-backed, else its inline text. */
    readFileAsync(path: string): Promise<string | Blob | null>;
    /** Writes a file. String content is stored inline; a Blob goes to the blob store. */
    writeFileAsync(path: string, name: string, data: string | Blob): Promise<boolean>;
    deleteNode(parentPath: string, name: string): boolean;
    rename(parentPath: string, oldName: string, newName: string): boolean;
    listDir(path: string): string[] | null;
    /** Persists pending changes immediately (awaitable). */
    flush(): Promise<void>;
    /** Best-effort synchronous-style flush for unload paths (fire-and-forget). */
    flushSync(): void;
    getRoot(): IVFSNode | null;
    __reset(): void;
}

export const VFS: IVFS = (() => {
    'use strict';

    /** Reject any single file whose content exceeds this (protects the shared
     *  localStorage quota from a runaway plugin or oversized paste). */
    const MAX_FILE_BYTES = 1_000_000; // ~1 MB (inline text)
    /** Cap for blob-backed (binary) files stored out-of-tree. */
    const MAX_BLOB_BYTES = 50 * 1024 * 1024; // 50 MB
    /** Guard against pathological / malicious deep nesting. */
    const MAX_DEPTH = 32;

    /** Fire-and-forget removal of a blob backing a file node, if any. */
    function releaseBlob(node: IVFSNode | undefined): void {
        if (node && node.blobRef) void VFSBlobStore.delete(node.blobRef);
    }

    /** Collects and releases every blob under a subtree (for recursive delete). */
    function releaseSubtreeBlobs(node: IVFSNode): void {
        releaseBlob(node);
        if (node.children) {
            for (const child of Object.values(node.children)) releaseSubtreeBlobs(child);
        }
    }

    // Default initial FS
    const DEFAULT_FS: IVFSNode = {
        name: 'C:',
        type: 'dir',
        children: {
            'WINDOWS': {
                name: 'WINDOWS', type: 'dir', children: {
                    'SYSTEM': { name: 'SYSTEM', type: 'dir', children: {} },
                    'DESKTOP': {
                        name: 'DESKTOP',
                        type: 'dir',
                        children: {
                            'GAMES': {
                                name: 'GAMES',
                                type: 'dir',
                                children: {
                                    'Virtual Life Restart Simulator': { name: 'Virtual Life Restart Simulator', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-vlrs-folder' },
                                    'Flappy Neon': { name: 'Flappy Neon', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-flappy-folder' },
                                    'Football Rush': {
                                        name: 'Football Rush',
                                        type: 'dir',
                                        children: {
                                            'README.TXT': { name: 'README.TXT', type: 'file', content: 'FOOTBALL RUSH\n\nA high-speed football game for Windows 95.\nUse ARROW KEYS to move and SPACE to kick.\n\nGood luck!' }
                                        },
                                        actionType: 'openWindow',
                                        actionTarget: 'win-football-folder'
                                    },
                                    'Ultimate DOOM': { name: 'Ultimate DOOM', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-doom-folder' },
                                    'Tetris Tryhard': { name: 'Tetris Tryhard', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-tetris-folder' }
                                }
                            }
                        }
                    }
                }
            },
            'DOCUMENTS': {
                name: 'DOCUMENTS', type: 'dir', children: {
                    'README.txt': { name: 'README.txt', type: 'file', content: 'Welcome to Windows App Center v1.6.7' }
                }
            },
            'GAMES': {
                name: 'GAMES',
                type: 'dir',
                children: {
                    'Virtual Life Restart Simulator': { name: 'Virtual Life Restart Simulator', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-vlrs-folder' },
                    'Flappy Neon': { name: 'Flappy Neon', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-flappy-folder' },
                    'Football Rush': {
                        name: 'Football Rush',
                        type: 'dir',
                        children: {
                            'README.TXT': { name: 'README.TXT', type: 'file', content: 'FOOTBALL RUSH\n\nA high-speed football game for Windows 95.\nUse ARROW KEYS to move and SPACE to kick.\n\nGood luck!' }
                        },
                        actionType: 'openWindow',
                        actionTarget: 'win-football-folder'
                    },
                    'Ultimate DOOM': { name: 'Ultimate DOOM', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-doom-folder' },
                    'Tetris Tryhard': { name: 'Tetris Tryhard', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-tetris-folder' },
                    'Chapas Prime': { name: 'Chapas Prime', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-chapas-folder' },
                    'Nocturna': { name: 'Nocturna', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-nocturna-folder' },
                    'H.I.P. Game Boy': { name: 'H.I.P. Game Boy', type: 'dir', children: {}, actionType: 'openWindow', actionTarget: 'win-gameboy-folder' }
                }
            },
            'DESKTOP': {
                name: 'DESKTOP',
                type: 'dir',
                children: {
                    'My Computer': { name: 'My Computer', type: 'shortcut', icon: '💻', actionType: 'openDialog', actionTarget: 'dialog-mycomputer' },
                    'Recycle Bin': { name: 'Recycle Bin', type: 'shortcut', icon: '🗑️', actionType: 'openDialog', actionTarget: 'dialog-recyclebin' },
                    'Games': { name: 'Games', type: 'shortcut', icon: '📂', actionType: 'openWindow', actionTarget: 'win-games-folder' },
                    'Notepad': { name: 'Notepad', type: 'shortcut', icon: '📝', actionType: 'launch', actionTarget: 'notepad' },
                    'Paint': { name: 'Paint', type: 'shortcut', icon: '🎨', actionType: 'launch', actionTarget: 'paint' },
                    'Explorer': { name: 'Explorer', type: 'shortcut', icon: '🗂️', actionType: 'launch', actionTarget: 'explorer' }
                }
            }
        }
    };

    let root: IVFSNode | null = null;
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    // Shared hydration promise so concurrent/repeated init() calls await one load.
    let initPromise: Promise<void> | null = null;

    function cloneDefaultFS(): IVFSNode {
        // structuredClone is unavailable on older engines; a JSON round-trip is a
        // safe fallback here because the FS tree is plain, cycle-free JSON data.
        if (typeof structuredClone === 'function') {
            return structuredClone(DEFAULT_FS);
        }
        return JSON.parse(JSON.stringify(DEFAULT_FS));
    }

    /**
     * Validates a parsed tree loaded from storage: root must be a dir, and every
     * node must have a valid `type` and a `children` map when it is a dir. Rejects
     * structurally broken/oversized trees so we fall back to a clean default
     * instead of operating on garbage. Also enforces MAX_DEPTH.
     */
    function isValidTree(node: unknown, depth = 0): node is IVFSNode {
        if (depth > MAX_DEPTH) return false;
        if (!node || typeof node !== 'object') return false;
        const n = node as Record<string, unknown>;
        if (typeof n.name !== 'string') return false;
        if (n.type !== 'dir' && n.type !== 'file' && n.type !== 'shortcut') return false;
        if (n.type === 'dir') {
            if (n.children === undefined) return false;
            if (typeof n.children !== 'object' || n.children === null) return false;
            for (const child of Object.values(n.children as Record<string, unknown>)) {
                if (!isValidTree(child, depth + 1)) return false;
            }
        }
        return true;
    }

    function init(): Promise<void> {
        // Idempotent: repeated calls share one hydration (boot + Kernel both call it).
        if (!initPromise) initPromise = hydrate();
        return initPromise;
    }

    async function hydrate(): Promise<void> {
        const saved = await VFSStore.load();
        let needsReset = false;

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // Reject structurally invalid trees instead of operating on garbage.
                if (!isValidTree(parsed)) {
                    Utils.Logger.error('VFS: Stored tree failed schema validation, resetting...');
                    throw new Error('invalid VFS schema');
                }
                root = parsed;

                // v1.0.7.5: Check if GAMES and DESKTOP are properly populated
                const gamesFolder = root?.children ? root.children['GAMES'] : null;
                const desktopFolder = root?.children ? root.children['DESKTOP'] : null;

                if (!gamesFolder || !gamesFolder.children || Object.keys(gamesFolder.children).length === 0) {
                    Utils.Logger.log('VFS: GAMES folder empty, resetting...');
                    needsReset = true;
                }

                if (!desktopFolder || !desktopFolder.children || Object.keys(desktopFolder.children).length === 0) {
                    Utils.Logger.log('VFS: DESKTOP folder empty, resetting...');
                    needsReset = true;
                }

                // Dynamic updates & migrations for existing localStorage
                if (root && root.children && !needsReset) {
                    // Update README.txt version if needed
                    const docs = root.children['DOCUMENTS'];
                    if (docs && docs.children && docs.children['README.txt']) {
                        docs.children['README.txt'].content = 'Welcome to Windows App Center v1.6.7';
                    }

                    // Populate C:\GAMES
                    const games = root.children['GAMES'];
                    if (games && games.children) {
                        const expectedGames = ['Virtual Life Restart Simulator', 'Flappy Neon', 'Football Rush', 'Ultimate DOOM', 'Tetris Tryhard', 'Chapas Prime', 'Nocturna', 'H.I.P. Game Boy'];
                        expectedGames.forEach(gName => {
                            if (!games.children![gName]) {
                                let actionTarget = '';
                                if (gName === 'Virtual Life Restart Simulator') actionTarget = 'win-vlrs-folder';
                                else if (gName === 'Flappy Neon') actionTarget = 'win-flappy-folder';
                                else if (gName === 'Football Rush') actionTarget = 'win-football-folder';
                                else if (gName === 'Ultimate DOOM') actionTarget = 'win-doom-folder';
                                else if (gName === 'Tetris Tryhard') actionTarget = 'win-tetris-folder';
                                else if (gName === 'Chapas Prime') actionTarget = 'win-chapas-folder';
                                else if (gName === 'Nocturna') actionTarget = 'win-nocturna-folder';
                                else if (gName === 'H.I.P. Game Boy') actionTarget = 'win-gameboy-folder';

                                games.children![gName] = {
                                    name: gName,
                                    type: 'dir',
                                    children: gName === 'Football Rush' ? {
                                        'README.TXT': { name: 'README.TXT', type: 'file', content: 'FOOTBALL RUSH\n\nA high-speed football game for Windows 95.\nUse ARROW KEYS to move and SPACE to kick.\n\nGood luck!' }
                                    } : {},
                                    actionType: 'openWindow',
                                    actionTarget
                                };
                            }
                        });
                    }

                    // Populate C:\WINDOWS\DESKTOP\GAMES
                    let windows = root.children['WINDOWS'];
                    if (!windows) {
                        root.children['WINDOWS'] = { name: 'WINDOWS', type: 'dir', children: {} };
                        windows = root.children['WINDOWS'];
                    }
                    if (windows && windows.children) {
                        let winDesktop = windows.children['DESKTOP'];
                        if (!winDesktop) {
                            windows.children['DESKTOP'] = { name: 'DESKTOP', type: 'dir', children: {} };
                            winDesktop = windows.children['DESKTOP'];
                        }
                        if (winDesktop && winDesktop.children) {
                            let winGames = winDesktop.children['GAMES'];
                            if (!winGames) {
                                winDesktop.children['GAMES'] = { name: 'GAMES', type: 'dir', children: {} };
                                winGames = winDesktop.children['GAMES'];
                            }
                            if (winGames && winGames.children) {
                                const expectedGames = ['Virtual Life Restart Simulator', 'Flappy Neon', 'Football Rush', 'Ultimate DOOM', 'Tetris Tryhard', 'Chapas Prime', 'Nocturna', 'H.I.P. Game Boy'];
                                expectedGames.forEach(gName => {
                                    if (!winGames.children![gName]) {
                                        let actionTarget = '';
                                        if (gName === 'Virtual Life Restart Simulator') actionTarget = 'win-vlrs-folder';
                                        else if (gName === 'Flappy Neon') actionTarget = 'win-flappy-folder';
                                        else if (gName === 'Football Rush') actionTarget = 'win-football-folder';
                                        else if (gName === 'Ultimate DOOM') actionTarget = 'win-doom-folder';
                                        else if (gName === 'Tetris Tryhard') actionTarget = 'win-tetris-folder';
                                        else if (gName === 'Chapas Prime') actionTarget = 'win-chapas-folder';
                                        else if (gName === 'Nocturna') actionTarget = 'win-nocturna-folder';
                                        else if (gName === 'H.I.P. Game Boy') actionTarget = 'win-gameboy-folder';

                                        winGames.children![gName] = {
                                            name: gName,
                                            type: 'dir',
                                            children: gName === 'Football Rush' ? {
                                                'README.TXT': { name: 'README.TXT', type: 'file', content: 'FOOTBALL RUSH\n\nA high-speed football game for Windows 95.\nUse ARROW KEYS to move and SPACE to kick.\n\nGood luck!' }
                                            } : {},
                                            actionType: 'openWindow',
                                            actionTarget
                                        };
                                    }
                                });
                            }
                        }
                    }
                    save();
                }
            } catch (e) {
                Utils.Logger.error('VFS: Corrupted storage, resetting...');
                needsReset = true;
            }
        } else {
            needsReset = true;
        }

        if (needsReset) {
            root = cloneDefaultFS();
            save();
        }

        Utils.Logger.log('VFS: Initialized');
    }

    async function persist(): Promise<void> {
        if (!root) return;
        try {
            await VFSStore.save(JSON.stringify(root));
        } catch (err) {
            Utils.Logger.error('VFS: Failed to persist tree', err);
            const notify: any = Services.get('Notify');
            if (notify) {
                notify.error('VFS write failed: storage quota exceeded!');
            }
        }
    }

    function save(): void {
        if (saveTimer) {
            clearTimeout(saveTimer);
        }
        saveTimer = setTimeout(() => {
            saveTimer = null;
            void persist();
        }, 100);
    }

    /** Persists pending changes immediately; awaitable. */
    function flush(): Promise<void> {
        if (saveTimer) {
            clearTimeout(saveTimer);
            saveTimer = null;
        }
        return persist();
    }

    /**
     * Best-effort immediate persist for unload paths. IndexedDB cannot flush
     * synchronously, so durability on abrupt close is best-effort — the
     * `visibilitychange → hidden` handler below is the more reliable trigger.
     */
    function flushSync(): void {
        void flush();
    }

    /**
     * Resolves a path string to a VFS node
     * @param {string} path - Absolute path (e.g. "C:\WINDOWS\SYSTEM")
     */
    function resolve(path: string): IVFSNode | null {
        if (!path || path === 'C:' || path === 'C:\\') return root;

        const parts = path.replace('C:', '').split(/[/\\]/).filter(p => p !== '');
        let current = root;

        for (const part of parts) {
            if (current && current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }

    function sanitize(name: string): string {
        return (typeof Utils !== 'undefined' && Utils.sanitizePath)
            ? Utils.sanitizePath(name) : name;
    }

    function mkdir(path: string, name: string): boolean {
        const safeName = sanitize(name);
        if (!safeName) return false;
        const parent = resolve(path);
        if (parent && parent.type === 'dir' && parent.children) {
            const existing = parent.children[safeName];
            if (existing) {
                // Directory already present → keep its subtree (idempotent).
                if (existing.type === 'dir') return true;
                // Refuse to clobber a file of the same name with a directory.
                Utils.Logger.warn(`VFS: cannot mkdir "${safeName}" — a file with that name exists`);
                return false;
            }
            parent.children[safeName] = { name: safeName, type: 'dir', children: {} };
            save();
            return true;
        }
        return false;
    }

    function writeFile(path: string, name: string, content: string): boolean {
        const safeName = sanitize(name);
        if (!safeName) return false;
        if (typeof content === 'string' && content.length > MAX_FILE_BYTES) {
            Utils.Logger.warn(`VFS: refusing to write "${safeName}" — exceeds ${MAX_FILE_BYTES} bytes`);
            return false;
        }
        const parent = resolve(path);
        if (parent && parent.type === 'dir' && parent.children) {
            const existing = parent.children[safeName];
            // Never let a file silently replace a directory (which destroys its
            // whole subtree). Overwriting an existing file is fine.
            if (existing && existing.type !== 'file') {
                Utils.Logger.warn(`VFS: cannot write "${safeName}" — a ${existing.type} with that name exists`);
                return false;
            }
            // Overwriting a blob-backed file with inline text: free the old blob.
            releaseBlob(existing);
            parent.children[safeName] = { name: safeName, type: 'file', content };
            save();
            return true;
        }
        return false;
    }

    /** Reads a file's content: a Blob when blob-backed, else its inline text. */
    async function readFileAsync(path: string): Promise<string | Blob | null> {
        const node = resolve(path);
        if (!node || node.type !== 'file') return null;
        if (node.blobRef) {
            const blob = await VFSBlobStore.get(node.blobRef);
            // OPFS Files carry no MIME; restore it from the node metadata so
            // callers see the type they wrote (the IDB backend already preserves it).
            if (blob && !blob.type && node.mime) {
                return new Blob([blob], { type: node.mime });
            }
            return blob;
        }
        return node.content ?? '';
    }

    /**
     * Writes a file. A string is stored inline (delegates to writeFile); a Blob is
     * written to the out-of-tree blob store (OPFS/IndexedDB) with only metadata kept
     * in the tree, so large binaries don't bloat the serialized JSON.
     */
    async function writeFileAsync(path: string, name: string, data: string | Blob): Promise<boolean> {
        if (typeof data === 'string') {
            return writeFile(path, name, data);
        }
        const safeName = sanitize(name);
        if (!safeName) return false;
        if (data.size > MAX_BLOB_BYTES) {
            Utils.Logger.warn(`VFS: refusing to write "${safeName}" — blob exceeds ${MAX_BLOB_BYTES} bytes`);
            return false;
        }
        const parent = resolve(path);
        if (!parent || parent.type !== 'dir' || !parent.children) return false;
        if (parent.children[safeName] && parent.children[safeName]!.type !== 'file') {
            Utils.Logger.warn(`VFS: cannot write "${safeName}" — a ${parent.children[safeName]!.type} with that name exists`);
            return false;
        }
        const blobRef = `blob-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        try {
            await VFSBlobStore.put(blobRef, data);
        } catch (err) {
            Utils.Logger.error(`VFS: failed to store blob for "${safeName}"`, err);
            return false;
        }
        // Re-resolve AFTER the await: a concurrent write to the same path could
        // have swapped the node while the blob was being stored, and releasing a
        // stale reference would free the winner's blob.
        const current = resolve(path);
        if (!current || current.type !== 'dir' || !current.children) {
            void VFSBlobStore.delete(blobRef); // parent vanished — don't orphan our blob
            return false;
        }
        releaseBlob(current.children[safeName]);
        current.children[safeName] = { name: safeName, type: 'file', blobRef, size: data.size, mime: data.type || '' };
        save();
        return true;
    }

    function readFile(path: string): string | null {
        const node = resolve(path);
        return (node && node.type === 'file') ? (node.content ?? '') : null;
    }

    function deleteNode(parentPath: string, name: string): boolean {
        const parent = resolve(parentPath);
        if (parent && parent.type === 'dir' && parent.children && parent.children[name]) {
            // Free any blob content held by the node (or its subtree) to avoid orphans.
            releaseSubtreeBlobs(parent.children[name]);
            delete parent.children[name];
            save();
            return true;
        }
        return false;
    }

    function rename(parentPath: string, oldName: string, newName: string): boolean {
        // Sanitize the new name for parity with mkdir/writeFile — otherwise
        // rename is a back door for the dangerous chars (`<>:"/\|?*`, `..`) the
        // rest of the API forbids.
        const safeName = sanitize(newName);
        if (!safeName) return false;
        const parent = resolve(parentPath);
        if (!parent || parent.type !== 'dir' || !parent.children || !parent.children[oldName]) return false;
        if (safeName === oldName) return true; // no-op
        if (parent.children[safeName]) return false; // Name already taken

        const node = parent.children[oldName];
        node.name = safeName;
        parent.children[safeName] = node;
        delete parent.children[oldName];
        save();
        return true;
    }

    function listDir(path: string): string[] | null {
        const node = resolve(path);
        if (node && node.type === 'dir' && node.children) {
            return Object.keys(node.children);
        }
        return null;
    }

    return {
        init,
        resolve,
        mkdir,
        writeFile,
        readFile,
        readFileAsync,
        writeFileAsync,
        deleteNode,
        rename,
        listDir,
        flush,
        flushSync,
        getRoot: () => root,
        __reset: () => {
            if (saveTimer) {
                clearTimeout(saveTimer);
                saveTimer = null;
            }
            root = null;
            initPromise = null;
        }
    };
})();

if (typeof window !== 'undefined') {
    Services.register('VFS', VFS);
    // beforeunload is unreliable for async writes; visibilitychange → hidden is the
    // more dependable durability trigger. Both fire a best-effort flush.
    window.addEventListener('beforeunload', () => { VFS.flushSync(); });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') VFS.flushSync();
    });
}
