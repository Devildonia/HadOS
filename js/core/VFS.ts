import { Utils } from '../utils.js';
import { Services } from './ServiceContainer.js';
import { VFSStore } from './VFSStore.js';
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
                        docs.children['README.txt'].content = 'Welcome to HadOS.';
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
                    onMutationSave();
                }
            } catch (e) {
                Utils.Logger.error('VFS: Corrupted storage, resetting...');
                needsReset = true;
            }
        } else {
            needsReset = true;
        }

        if (needsReset) {
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
            const notify: any = Services.get('Notify');
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

    function flushSync(): void {
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
        flushSync,
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
    window.addEventListener('beforeunload', () => { VFS.flushSync(); });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') VFS.flushSync();
    });
}
