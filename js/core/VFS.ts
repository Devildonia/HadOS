/**
 * HadOS — VFS (Virtual File System)
 * Hierarchical tree kept in memory, persisted asynchronously to IndexedDB
 * (see VFSStore) with binary content stored out-of-tree in OPFS (VFSBlobStore).
 */

import { Utils } from '../utils';
import { Services } from './ServiceContainer';
import { VFSStore } from './VFSStore';
import { VFSBlobStore } from './VFSBlobStore';

/**
 * Represents a node in the Virtual File System tree (directory, file, or shortcut).
 */
export interface IVFSNode {
    /** The display name of the node. */
    name: string;
    /** The node type. */
    type: 'dir' | 'file' | 'shortcut';
    /** A map of child nodes, present only for directory nodes. */
    children?: Record<string, IVFSNode>;
    /** Inline text content, present only for text-based file nodes. */
    content?: string;
    /**
     * Reference key pointing to out-of-tree binary content in the VFSBlobStore.
     * Mutually exclusive with `content`.
     */
    blobRef?: string;
    /** Size of the binary blob in bytes, if applicable. */
    size?: number;
    /** MIME type of the file content, if applicable. */
    mime?: string;
    /** Presentation icon character/image path, typically for shortcuts. */
    icon?: string;
    /** Event execution action type triggered by launching this node. */
    actionType?: string;
    /** Target argument passed to the action handler. */
    actionTarget?: string;
    /** If true, this node is hidden from directory listings. */
    hidden?: boolean;
    /**
     * i18n key for the DISPLAY label shown in the explorer. The node's `name` stays
     * canonical (it is the path segment used for navigation), so translating the
     * label never breaks a path. Absent for brand/proper names (HADOS, game titles).
     */
    i18nKey?: string;
    /** Original path of the node before it was moved to the recycle bin. */
    trashOrigin?: string;
    /** Epoch timestamp in milliseconds when the node was deleted. */
    trashedAt?: number;
}

/**
 * Represents a trashed item entry as exposed to the UI layers.
 */
export interface ITrashEntry {
    /** The unique ID of the trashed item key. */
    id: string;
    /** Original display name of the deleted file. */
    name: string;
    /** Original VFS directory path where the item was deleted from. */
    origin: string;
    /** Node type (dir, file, shortcut). */
    type: 'dir' | 'file' | 'shortcut';
    /** Epoch timestamp in milliseconds of the deletion event. */
    deletedAt: number;
}

/**
 * Interface detailing all Virtual File System operations.
 */
export interface IVFS {
    /** Hydrates the in-memory tree from the durable backend (IndexedDB / fallback). */
    init(): Promise<void>;
    /** Resolves a canonical path string to a VFS node reference. */
    resolve(path: string): IVFSNode | null;
    /** Creates a new directory at the specified target path. */
    mkdir(path: string, name: string): boolean;
    /** Writes string content inline into a file node at the target path. */
    writeFile(path: string, name: string, content: string): boolean;
    /** Synchronously reads inline string content from a file node. */
    readFile(path: string): string | null;
    /** Reads a file's content asynchronously, returning a Blob for binary files or text string. */
    readFileAsync(path: string): Promise<string | Blob | null>;
    /** Writes a file asynchronously. Small strings go inline; binary Blobs go out-of-tree. */
    writeFileAsync(path: string, name: string, data: string | Blob): Promise<boolean>;
    /** Permanently deletes a VFS node and releases any associated blob storage assets. */
    deleteNode(parentPath: string, name: string): boolean;
    /** Moves a VFS node to the recycle bin, preserving blob references for restoration. */
    trashNode(parentPath: string, name: string): boolean;
    /** Retrieves all entries inside the recycle bin, sorted newest first. */
    listTrash(): ITrashEntry[];
    /** Returns the current count of items in the recycle bin. */
    trashCount(): number;
    /** Restores a trashed item back to its original location path. Handles collisions. */
    restoreFromTrash(id: string): boolean;
    /** Permanently purges all items inside the recycle bin and clears their storage blobs. */
    emptyTrash(): void;
    /** Renames a file or directory node under the specified parent directory. */
    rename(parentPath: string, oldName: string, newName: string): boolean;
    /** Lists child names of a directory path, omitting hidden files. */
    listDir(path: string): string[] | null;
    /** Immediately persists all pending tree state modifications to IndexedDB. */
    flush(): Promise<void>;
    /** Best-effort synchronous flush of pending VFS changes during page unloads. */
    flushSync(): void;
    /** Returns the root directory node of the Virtual File System. */
    getRoot(): IVFSNode | null;
    /** Resets the in-memory VFS state (primarily for testing purposes). */
    __reset(): void;
}

export const VFS: IVFS = (() => {
    'use strict';

    /** Max file size in bytes allowed for inline text files. */
    const MAX_FILE_BYTES = 1_000_000; // ~1 MB (inline text)
    /** Cap for blob-backed (binary) files stored out-of-tree. */
    const MAX_BLOB_BYTES = 50 * 1024 * 1024; // 50 MB
    /** Guard against pathological / malicious deep nesting. */
    const MAX_DEPTH = 32;

    /**
     * Deletes the binary file content from the out-of-tree blob store if it exists.
     * @param node The file node reference to evaluate.
     */
    function releaseBlob(node: IVFSNode | undefined): void {
        if (node && node.blobRef) void VFSBlobStore.delete(node.blobRef);
    }

    /**
     * Recursively traverses a node's children and releases all associated binary blobs.
     * @param node The root node of the subtree to purge.
     */
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
            'HADOS': {
                name: 'HADOS', type: 'dir', children: {
                    // System dir — recycle bin and permissions.json live here; keep the
                    // path stable. The old HADOS\DESKTOP\GAMES subtree was a stale
                    // duplicate of C:\GAMES (fewer games) and has been removed.
                    'SYSTEM': { name: 'SYSTEM', type: 'dir', hidden: true, children: {} }
                }
            },
            'DOCUMENTS': {
                name: 'DOCUMENTS', type: 'dir', i18nKey: 'fs.documents', children: {
                    'README.txt': { name: 'README.txt', type: 'file', content: 'Welcome to HadOS v1.1.0' }
                }
            },
            'GAMES': {
                name: 'GAMES',
                type: 'dir',
                i18nKey: 'app.games_folder',
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
                i18nKey: 'fs.desktop',
                children: {
                    'My Computer': { name: 'My Computer', type: 'shortcut', icon: '💻', i18nKey: 'app.mycomputer', actionType: 'explorer', actionTarget: 'This PC' },
                    'Recycle Bin': { name: 'Recycle Bin', type: 'shortcut', icon: '🗑️', i18nKey: 'app.recyclebin', actionType: 'openDialog', actionTarget: 'dialog-recyclebin' },
                    'Games': { name: 'Games', type: 'shortcut', icon: '📂', i18nKey: 'app.games_folder', actionType: 'explorer', actionTarget: 'C:\\GAMES' },
                    'Notepad': { name: 'Notepad', type: 'shortcut', icon: '📝', i18nKey: 'app.notepad', actionType: 'launch', actionTarget: 'notepad' },
                    'Paint': { name: 'Paint', type: 'shortcut', icon: '🎨', i18nKey: 'app.paint', actionType: 'launch', actionTarget: 'paint' },
                    'Explorer': { name: 'Explorer', type: 'shortcut', icon: '🗂️', i18nKey: 'app.explorer', actionType: 'launch', actionTarget: 'explorer' }
                }
            }
        }
    };

    /** The internal VFS directory root pointer. */
    let root: IVFSNode | null = null;
    /** Delayed timer ID for auto-persisting tree changes. */
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    /** Shared initialization promise for hydration requests. */
    let initPromise: Promise<void> | null = null;

    /**
     * Clones the default VFS configuration tree structure safely.
     */
    function cloneDefaultFS(): IVFSNode {
        if (typeof structuredClone === 'function') {
            return structuredClone(DEFAULT_FS);
        }
        return JSON.parse(JSON.stringify(DEFAULT_FS));
    }

    /**
     * Validates structural integrity of a loaded tree.
     * Enforces depth constraints and verifies directory schema mappings.
     * @param node The VFS node object to check.
     * @param depth Current depth index tracking path recursion.
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

    /**
     * Triggers the VFS tree hydration cycle.
     */
    function init(): Promise<void> {
        if (!initPromise) initPromise = hydrate();
        return initPromise;
    }

    /**
     * Migrates the legacy WINDOWS directory to HADOS.
     * Leaves the original in place if a target HADOS directory already exists.
     */
    function migrateSystemDirName(): void {
        if (!root?.children) return;
        const legacy = root.children['WINDOWS'];
        if (!legacy) return;
        if (root.children['HADOS']) {
            Utils.Logger.warn('VFS: both WINDOWS and HADOS exist; leaving the legacy dir in place');
            return;
        }
        legacy.name = 'HADOS';
        root.children['HADOS'] = legacy;
        delete root.children['WINDOWS'];
        Utils.Logger.log('VFS: migrated C:\\WINDOWS -> C:\\HADOS');
        save();
    }

    /**
     * Asynchronously loads tree state from local storage, running updates and migrations.
     */
    async function hydrate(): Promise<void> {
        const saved = await VFSStore.load();
        let needsReset = false;

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (!isValidTree(parsed)) {
                    Utils.Logger.error('VFS: Stored tree failed schema validation, resetting...');
                    throw new Error('invalid VFS schema');
                }
                root = parsed;

                migrateSystemDirName();

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

                if (root && root.children && !needsReset) {
                    const docs = root.children['DOCUMENTS'];
                    if (docs && docs.children && docs.children['README.txt']) {
                        docs.children['README.txt'].content = 'Welcome to HadOS v1.1.0';
                    }

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

                    let windows = root.children['HADOS'];
                    if (!windows) {
                        root.children['HADOS'] = { name: 'HADOS', type: 'dir', children: {} };
                        windows = root.children['HADOS'];
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

    /**
     * Executes the VFS database write transaction immediately.
     */
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

    /**
     * Debounces and schedules a lazy auto-save write routine.
     */
    function save(): void {
        if (saveTimer) {
            clearTimeout(saveTimer);
        }
        saveTimer = setTimeout(() => {
            saveTimer = null;
            void persist();
        }, 100);
    }

    function flush(): Promise<void> {
        if (saveTimer) {
            clearTimeout(saveTimer);
            saveTimer = null;
        }
        return persist();
    }

    function flushSync(): void {
        void flush();
    }

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

    /**
     * Helper to sanitize file names using VFS directory specifications.
     * @param name Path name string.
     */
    function sanitize(name: string): string {
        return (typeof Utils !== 'undefined' && Utils.sanitizePath)
            ? Utils.sanitizePath(name) : name;
    }

    /**
     * Utility mapping system directory boundaries to evaluate directory modifications.
     * @param parentPath Target folder directory path.
     * @param name Directory name check.
     */
    function isSystemPath(parentPath: string, name: string): boolean {
        const fullPath = parentPath + (parentPath.endsWith('\\') ? '' : '\\') + name;
        const upper = fullPath.toUpperCase();
        return upper === 'C:\\HADOS\\SYSTEM' || upper.startsWith('C:\\HADOS\\SYSTEM\\');
    }

    function mkdir(path: string, name: string): boolean {
        const safeName = sanitize(name);
        if (!safeName) return false;
        const parent = resolve(path);
        if (parent && parent.type === 'dir' && parent.children) {
            const existing = parent.children[safeName];
            if (existing) {
                if (existing.type === 'dir') return true;
                Utils.Logger.warn(`VFS: cannot mkdir "${safeName}" — a file with that name exists`);
                return false;
            }
            const hidden = isSystemPath(path, safeName);
            parent.children[safeName] = { name: safeName, type: 'dir', children: {}, ...(hidden ? { hidden: true } : {}) };
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
            if (existing && existing.type !== 'file') {
                Utils.Logger.warn(`VFS: cannot write "${safeName}" — a ${existing.type} with that name exists`);
                return false;
            }
            releaseBlob(existing);
            const hidden = isSystemPath(path, safeName);
            parent.children[safeName] = { name: safeName, type: 'file', content, ...(hidden ? { hidden: true } : {}) };
            save();
            return true;
        }
        return false;
    }

    async function readFileAsync(path: string): Promise<string | Blob | null> {
        const node = resolve(path);
        if (!node || node.type !== 'file') return null;
        if (node.blobRef) {
            const blob = await VFSBlobStore.get(node.blobRef);
            if (blob && !blob.type && node.mime) {
                return new Blob([blob], { type: node.mime });
            }
            return blob;
        }
        return node.content ?? '';
    }

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
        const current = resolve(path);
        if (!current || current.type !== 'dir' || !current.children) {
            void VFSBlobStore.delete(blobRef);
            return false;
        }
        releaseBlob(current.children[safeName]);
        const hidden = isSystemPath(path, safeName);
        current.children[safeName] = { name: safeName, type: 'file', blobRef, size: data.size, mime: data.type || '', ...(hidden ? { hidden: true } : {}) };
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
            releaseSubtreeBlobs(parent.children[name]);
            delete parent.children[name];
            save();
            return true;
        }
        return false;
    }

    const RECYCLE_PARENT = 'C:\\HADOS\\SYSTEM';
    const RECYCLE_NAME = 'RECYCLED';
    const RECYCLE_PATH = RECYCLE_PARENT + '\\' + RECYCLE_NAME;

    /** Dispatches a global event notifying the shell that recycle bin contents have changed. */
    function signalTrashChanged(): void {
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new CustomEvent('vfs:trash-changed'));
        }
    }

    /**
     * Ensures that the virtual recycle bin directory exists.
     */
    function ensureRecycleBin(): IVFSNode | null {
        const existing = resolve(RECYCLE_PATH);
        if (existing && existing.type === 'dir') return existing;
        if (!mkdir(RECYCLE_PARENT, RECYCLE_NAME)) return null;
        const bin = resolve(RECYCLE_PATH);
        return (bin && bin.type === 'dir') ? bin : null;
    }

    /**
     * Appends an incremental index to a duplicate directory entry name.
     * @param container Parent node containing child list.
     * @param base Starting name query.
     */
    function uniqueKey(container: IVFSNode, base: string): string {
        if (!container.children || !container.children[base]) return base;
        let i = 2;
        while (container.children[`${base} (${i})`]) i++;
        return `${base} (${i})`;
    }

    function trashNode(parentPath: string, name: string): boolean {
        if (parentPath.toUpperCase().startsWith(RECYCLE_PATH.toUpperCase())) return false;

        const fullPath = parentPath + (parentPath.endsWith('\\') ? '' : '\\') + name;
        const fullPathUpper = fullPath.toUpperCase();
        const systemPathUpper = 'C:\\HADOS\\SYSTEM';
        if (fullPathUpper === systemPathUpper || fullPathUpper.startsWith(systemPathUpper + '\\')) return false;

        const parent = resolve(parentPath);
        if (!(parent && parent.type === 'dir' && parent.children && parent.children[name])) return false;
        const bin = ensureRecycleBin();
        if (!bin || !bin.children) return false;

        const node = parent.children[name];
        const key = uniqueKey(bin, node.name);
        node.trashOrigin = parentPath;
        node.trashedAt = Date.now();
        bin.children[key] = node;
        delete parent.children[name];
        save();
        signalTrashChanged();
        return true;
    }

    function listTrash(): ITrashEntry[] {
        const bin = resolve(RECYCLE_PATH);
        if (!bin || bin.type !== 'dir' || !bin.children) return [];
        return Object.entries(bin.children)
            .map(([id, node]) => ({
                id,
                name: node.name,
                origin: node.trashOrigin ?? '',
                type: node.type,
                deletedAt: node.trashedAt ?? 0,
            }))
            .sort((a, b) => b.deletedAt - a.deletedAt);
    }

    function trashCount(): number {
        const bin = resolve(RECYCLE_PATH);
        return (bin && bin.type === 'dir' && bin.children) ? Object.keys(bin.children).length : 0;
    }

    function restoreFromTrash(id: string): boolean {
        const bin = resolve(RECYCLE_PATH);
        if (!bin || bin.type !== 'dir' || !bin.children || !bin.children[id]) return false;
        const node = bin.children[id];
        const origin = node.trashOrigin;
        if (!origin) return false;
        const dest = resolve(origin);
        if (!dest || dest.type !== 'dir' || !dest.children) return false;

        const targetKey = uniqueKey(dest, node.name);
        if (targetKey !== node.name) node.name = targetKey;
        delete node.trashOrigin;
        delete node.trashedAt;
        dest.children[targetKey] = node;
        delete bin.children[id];
        save();
        signalTrashChanged();
        return true;
    }

    function emptyTrash(): void {
        const bin = resolve(RECYCLE_PATH);
        if (!bin || bin.type !== 'dir' || !bin.children) return;
        for (const child of Object.values(bin.children)) releaseSubtreeBlobs(child);
        bin.children = {};
        save();
        signalTrashChanged();
    }

    function rename(parentPath: string, oldName: string, newName: string): boolean {
        const safeName = sanitize(newName);
        if (!safeName) return false;
        const parent = resolve(parentPath);
        if (!parent || parent.type !== 'dir' || !parent.children || !parent.children[oldName]) return false;
        if (safeName === oldName) return true;
        if (parent.children[safeName]) return false;

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
            const children = node.children;
            return Object.keys(children).filter(name => !children[name]?.hidden);
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
        trashNode,
        listTrash,
        trashCount,
        restoreFromTrash,
        emptyTrash,
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
