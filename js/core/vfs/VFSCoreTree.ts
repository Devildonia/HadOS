import type { IVFSNode } from './VFSTypes.js';

export const MAX_DEPTH = 32;

export const DEFAULT_FS: IVFSNode = {
    name: 'C:',
    type: 'dir',
    children: {
        'HADOS': {
            name: 'HADOS', type: 'dir', children: {
                'SYSTEM': { name: 'SYSTEM', type: 'dir', hidden: true, children: {} }
            }
        },
        'DOCUMENTS': {
            name: 'DOCUMENTS', type: 'dir', i18nKey: 'fs.documents', children: {
                'README.txt': { name: 'README.txt', type: 'file', content: 'Welcome to HadOS v1.0.5' }
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

export class VFSCoreTree {
    private root: IVFSNode | null = null;

    public getRoot(): IVFSNode | null {
        return this.root;
    }

    public setRoot(newRoot: IVFSNode | null): void {
        this.root = newRoot;
    }

    public cloneDefaultFS(): IVFSNode {
        if (typeof structuredClone === 'function') {
            return structuredClone(DEFAULT_FS);
        }
        return JSON.parse(JSON.stringify(DEFAULT_FS));
    }

    public isValidTree(node: unknown, depth = 0): node is IVFSNode {
        if (depth > MAX_DEPTH) return false;
        if (!node || typeof node !== 'object') return false;
        const n = node as Record<string, unknown>;
        if (typeof n.name !== 'string') return false;
        if (n.type !== 'dir' && n.type !== 'file' && n.type !== 'shortcut') return false;
        if (n.type === 'dir') {
            if (n.children === undefined) return false;
            if (typeof n.children !== 'object' || n.children === null) return false;
            for (const child of Object.values(n.children as Record<string, unknown>)) {
                if (!this.isValidTree(child, depth + 1)) return false;
            }
        }
        return true;
    }

    public resolve(path: string): IVFSNode | null {
        if (!path || path === 'C:' || path === 'C:\\') return this.root;

        const parts = path.replace('C:', '').split(/[/\\]/).filter(p => p !== '');
        let current = this.root;

        for (const part of parts) {
            if (current && current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }
}
