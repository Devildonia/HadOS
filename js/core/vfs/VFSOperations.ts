import { Utils } from '../../utils.js';
import type { IVFSNode } from './VFSTypes.js';
import { VFSBlobStore } from '../VFSBlobStore.js';
import { VFSCoreTree } from './VFSCoreTree.js';

export class VFSOperations {
    private tree: VFSCoreTree;
    private onSave: () => void;

    public readonly MAX_FILE_BYTES = 1_000_000; // ~1 MB
    public readonly MAX_BLOB_BYTES = 50 * 1024 * 1024; // 50 MB

    constructor(tree: VFSCoreTree, onSave: () => void) {
        this.tree = tree;
        this.onSave = onSave;
    }

    public releaseBlob(node: IVFSNode | undefined): void {
        if (node && node.blobRef) void VFSBlobStore.delete(node.blobRef);
    }

    public releaseSubtreeBlobs(node: IVFSNode): void {
        this.releaseBlob(node);
        if (node.children) {
            for (const child of Object.values(node.children)) {
                this.releaseSubtreeBlobs(child);
            }
        }
    }

    public sanitize(name: string): string {
        return (typeof Utils !== 'undefined' && Utils.sanitizePath)
            ? Utils.sanitizePath(name) : name;
    }

    public isSystemPath(parentPath: string, name: string): boolean {
        const fullPath = parentPath + (parentPath.endsWith('\\') ? '' : '\\') + name;
        const upper = fullPath.toUpperCase();
        return upper === 'C:\\HADOS\\SYSTEM' || upper.startsWith('C:\\HADOS\\SYSTEM\\');
    }

    public mkdir(path: string, name: string): boolean {
        const safeName = this.sanitize(name);
        if (!safeName) return false;
        const parent = this.tree.resolve(path);
        if (parent && parent.type === 'dir' && parent.children) {
            const existing = parent.children[safeName];
            if (existing) {
                if (existing.type === 'dir') return true;
                Utils.Logger.warn(`VFS: cannot mkdir "${safeName}" — a file with that name exists`);
                return false;
            }
            const hidden = this.isSystemPath(path, safeName);
            parent.children[safeName] = { name: safeName, type: 'dir', children: {}, ...(hidden ? { hidden: true } : {}) };
            this.onSave();
            return true;
        }
        return false;
    }

    public writeFile(path: string, name: string, content: string): boolean {
        const safeName = this.sanitize(name);
        if (!safeName) return false;
        if (typeof content === 'string' && content.length > this.MAX_FILE_BYTES) {
            Utils.Logger.warn(`VFS: refusing to write "${safeName}" — exceeds ${this.MAX_FILE_BYTES} bytes`);
            return false;
        }
        const parent = this.tree.resolve(path);
        if (parent && parent.type === 'dir' && parent.children) {
            const existing = parent.children[safeName];
            if (existing && existing.type !== 'file') {
                Utils.Logger.warn(`VFS: cannot write "${safeName}" — a ${existing.type} with that name exists`);
                return false;
            }
            this.releaseBlob(existing);
            const hidden = this.isSystemPath(path, safeName);
            parent.children[safeName] = { name: safeName, type: 'file', content, ...(hidden ? { hidden: true } : {}) };
            this.onSave();
            return true;
        }
        return false;
    }

    public readFile(path: string): string | null {
        const node = this.tree.resolve(path);
        return (node && node.type === 'file') ? (node.content ?? '') : null;
    }

    public async readFileAsync(path: string): Promise<string | Blob | null> {
        const node = this.tree.resolve(path);
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

    public async writeFileAsync(path: string, name: string, data: string | Blob): Promise<boolean> {
        if (typeof data === 'string') {
            return this.writeFile(path, name, data);
        }
        const safeName = this.sanitize(name);
        if (!safeName) return false;
        if (data.size > this.MAX_BLOB_BYTES) {
            Utils.Logger.warn(`VFS: refusing to write "${safeName}" — blob exceeds ${this.MAX_BLOB_BYTES} bytes`);
            return false;
        }
        const parent = this.tree.resolve(path);
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
        const current = this.tree.resolve(path);
        if (!current || current.type !== 'dir' || !current.children) {
            void VFSBlobStore.delete(blobRef);
            return false;
        }
        this.releaseBlob(current.children[safeName]);
        const hidden = this.isSystemPath(path, safeName);
        current.children[safeName] = { name: safeName, type: 'file', blobRef, size: data.size, mime: data.type || '', ...(hidden ? { hidden: true } : {}) };
        this.onSave();
        return true;
    }

    public deleteNode(parentPath: string, name: string): boolean {
        const parent = this.tree.resolve(parentPath);
        if (parent && parent.type === 'dir' && parent.children && parent.children[name]) {
            this.releaseSubtreeBlobs(parent.children[name]);
            delete parent.children[name];
            this.onSave();
            return true;
        }
        return false;
    }

    public rename(parentPath: string, oldName: string, newName: string): boolean {
        const safeName = this.sanitize(newName);
        if (!safeName) return false;
        const parent = this.tree.resolve(parentPath);
        if (!parent || parent.type !== 'dir' || !parent.children || !parent.children[oldName]) return false;
        if (safeName === oldName) return true;
        if (parent.children[safeName]) return false;

        const node = parent.children[oldName];
        node.name = safeName;
        parent.children[safeName] = node;
        delete parent.children[oldName];
        this.onSave();
        return true;
    }

    public listDir(path: string): string[] | null {
        const node = this.tree.resolve(path);
        if (node && node.type === 'dir' && node.children) {
            const children = node.children;
            return Object.keys(children).filter(name => !children[name]?.hidden);
        }
        return null;
    }
}
