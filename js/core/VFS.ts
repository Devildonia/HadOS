import { Utils } from '../utils.js';
import { Services } from './ServiceContainer.js';
import { VFSStore } from './VFSStore.js';
import { VFSBlobStore } from './VFSBlobStore.js';
import { VFSCoreTree } from './vfs/VFSCoreTree.js';
import { VFSOperations } from './vfs/VFSOperations.js';
import { VFSTrash } from './vfs/VFSTrash.js';
import type { IVFS, IVFSNode, ITrashEntry } from './vfs/VFSTypes.js';

export type { IVFS, IVFSNode, ITrashEntry };

export const VFS: IVFS = (() => {
    'use strict';

    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    let initPromise: Promise<void> | null = null;

    const tree = new VFSCoreTree();

    function onMutationSave(): void {
        if (saveTimer) {
            clearTimeout(saveTimer);
        }
        saveTimer = setTimeout(() => {
            saveTimer = null;
            void persist();
        }, 100);
    }

    const ops = new VFSOperations(tree, onMutationSave);
    const trash = new VFSTrash(tree, ops, onMutationSave);

    // When neither OPFS nor IndexedDB is available, blobs live in a bounded RAM map
    // that evicts its least-recently-used entry to make room. The store knows only
    // about ids, so it tells us which one it dropped and we take the node with it —
    // otherwise the tree keeps a blobRef resolving to nothing, and the user gets a
    // file that lists fine and opens empty (audit v1.0.0-rc.1, M-13).
    VFSBlobStore.onEvict((blobRef) => {
        const name = ops.dropNodeByBlobRef(blobRef);
        if (!name) return;
        Utils.Logger.warn(`VFS: dropped "${name}" — no durable storage and the memory budget is full`);
        const notify = Services.get<{ warn: (msg: string) => void }>('Notify');
        notify?.warn(`Storage full: "${name}" was removed to make room.`);
    });

    function init(): Promise<void> {
        if (!initPromise) initPromise = hydrate();
        return initPromise;
    }

    function migrateSystemDirName(): void {
        const root = tree.getRoot();
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
        onMutationSave();
    }

    const DEFAULT_GAMES: Array<{ name: string; target: string; readme?: string }> = [
        { name: 'Virtual Life Restart Simulator', target: 'win-vlrs-folder' },
        { name: 'Flappy Neon', target: 'win-flappy-folder' },
        { name: 'Football Rush', target: 'win-football-folder', readme: 'FOOTBALL RUSH\n\nA high-speed football game for Windows 95.\nUse ARROW KEYS to move and SPACE to kick.\n\nGood luck!' },
        { name: 'Ultimate DOOM', target: 'win-doom-folder' },
        { name: 'Tetris Tryhard', target: 'win-tetris-folder' },
        { name: 'Chapas Prime', target: 'win-chapas-folder' },
        { name: 'Nocturna', target: 'win-nocturna-folder' },
        { name: 'H.I.P. Game Boy', target: 'win-gameboy-folder' },
    ];

    function seedDefaultGames(gamesNode: IVFSNode): void {
        if (!gamesNode.children) gamesNode.children = {};
        DEFAULT_GAMES.forEach(g => {
            if (!gamesNode.children![g.name]) {
                gamesNode.children![g.name] = {
                    name: g.name,
                    type: 'dir',
                    children: g.readme ? {
                        'README.TXT': { name: 'README.TXT', type: 'file', content: g.readme }
                    } : {},
                    actionType: 'openWindow',
                    actionTarget: g.target
                };
            }
        });
    }

    async function hydrate(): Promise<void> {
        const saved = await VFSStore.load();
        let needsReset = false;

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (!tree.isValidTree(parsed)) {
                    Utils.Logger.error('VFS: Stored tree failed schema validation, resetting...');
                    throw new Error('invalid VFS schema');
                }
                tree.setRoot(parsed);

                migrateSystemDirName();

                const root = tree.getRoot();
                if (root && root.children) {
                    const gamesFolder = root.children['GAMES'];
                    const desktopFolder = root.children['DESKTOP'];

                    if (!gamesFolder || !gamesFolder.children || Object.keys(gamesFolder.children).length === 0) {
                        Utils.Logger.log('VFS: GAMES folder empty, performing targeted reset...');
                        const defaultFS = tree.cloneDefaultFS();
                        if (root.children['GAMES']) ops.releaseSubtreeBlobs(root.children['GAMES']);
                        if (defaultFS.children?.['GAMES']) root.children['GAMES'] = defaultFS.children['GAMES'];
                    }

                    if (!desktopFolder || !desktopFolder.children || Object.keys(desktopFolder.children).length === 0) {
                        Utils.Logger.log('VFS: DESKTOP folder empty, performing targeted reset...');
                        const defaultFS = tree.cloneDefaultFS();
                        if (root.children['DESKTOP']) ops.releaseSubtreeBlobs(root.children['DESKTOP']);
                        if (defaultFS.children?.['DESKTOP']) root.children['DESKTOP'] = defaultFS.children['DESKTOP'];
                    }

                    const docs = root.children['DOCUMENTS'];
                    if (docs && docs.children && !docs.children['README.txt']) {
                        docs.children['README.txt'] = { name: 'README.txt', type: 'file', content: 'Welcome to HadOS.' };
                    }

                    const games = root.children['GAMES'];
                    if (games) seedDefaultGames(games);

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
                            if (winGames) seedDefaultGames(winGames);
                        }
                    }
                    onMutationSave();
                }
            } catch (e) {
                Utils.Logger.error('VFS: Corrupted storage, resetting...', e);
                needsReset = true;
            }
        } else {
            needsReset = true;
        }

        if (needsReset) {
            const oldRoot = tree.getRoot();
            if (oldRoot) ops.releaseSubtreeBlobs(oldRoot);
            tree.setRoot(tree.cloneDefaultFS());
            onMutationSave();
        }

        Utils.Logger.log('VFS: Initialized');
    }

    async function persist(): Promise<void> {
        const root = tree.getRoot();
        if (!root) return;
        try {
            await VFSStore.save(JSON.stringify(root));
        } catch (err) {
            Utils.Logger.error('VFS: Failed to persist tree', err);
            const notify = Services.get<{ error: (msg: string) => void }>('Notify');
            if (notify) {
                notify.error('VFS write failed: storage quota exceeded!');
            }
        }
    }

    function flush(): Promise<void> {
        if (saveTimer) {
            clearTimeout(saveTimer);
            saveTimer = null;
        }
        return persist();
    }

    function flushBestEffort(): void {
        const root = tree.getRoot();
        if (root) {
            VFSStore.saveSync(JSON.stringify(root));
        }
        void flush();
    }

    return {
        init,
        resolve: (path: string) => tree.resolve(path),
        mkdir: (path: string, name: string) => ops.mkdir(path, name),
        writeFile: (path: string, name: string, content: string) => ops.writeFile(path, name, content),
        readFile: (path: string) => ops.readFile(path),
        readFileAsync: (path: string) => ops.readFileAsync(path),
        writeFileAsync: (path: string, name: string, data: string | Blob) => ops.writeFileAsync(path, name, data),
        deleteNode: (parentPath: string, name: string) => ops.deleteNode(parentPath, name),
        rename: (parentPath: string, oldName: string, newName: string) => ops.rename(parentPath, oldName, newName),
        listDir: (path: string) => ops.listDir(path),
        trashNode: (parentPath: string, name: string) => trash.trashNode(parentPath, name),
        listTrash: () => trash.listTrash(),
        trashCount: () => trash.trashCount(),
        restoreFromTrash: (id: string) => trash.restoreFromTrash(id),
        emptyTrash: () => trash.emptyTrash(),
        flush,
        flushBestEffort,
        getRoot: () => tree.getRoot(),
        __reset: () => {
            if (saveTimer) {
                clearTimeout(saveTimer);
                saveTimer = null;
            }
            tree.setRoot(null);
            initPromise = null;
        }
    };
})();

if (typeof window !== 'undefined') {
    Services.register('VFS', VFS);
    window.addEventListener('beforeunload', () => { VFS.flushBestEffort(); });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') VFS.flushBestEffort();
    });
}
