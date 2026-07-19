import type { ITrashEntry, IVFSNode } from './VFSTypes.js';
import { VFSCoreTree } from './VFSCoreTree.js';
import { VFSOperations } from './VFSOperations.js';

export class VFSTrash {
    private tree: VFSCoreTree;
    private ops: VFSOperations;
    private onSave: () => void;

    public readonly RECYCLE_PARENT = 'C:\\HADOS\\SYSTEM';
    public readonly RECYCLE_NAME = 'RECYCLED';
    public readonly RECYCLE_PATH = 'C:\\HADOS\\SYSTEM\\RECYCLED';

    constructor(tree: VFSCoreTree, ops: VFSOperations, onSave: () => void) {
        this.tree = tree;
        this.ops = ops;
        this.onSave = onSave;
    }

    private signalTrashChanged(): void {
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new CustomEvent('vfs:trash-changed'));
        }
    }

    private ensureRecycleBin(): IVFSNode | null {
        const existing = this.tree.resolve(this.RECYCLE_PATH);
        if (existing && existing.type === 'dir') return existing;
        if (!this.ops.mkdir(this.RECYCLE_PARENT, this.RECYCLE_NAME)) return null;
        const bin = this.tree.resolve(this.RECYCLE_PATH);
        return (bin && bin.type === 'dir') ? bin : null;
    }

    public uniqueKey(container: IVFSNode, base: string): string {
        if (!container.children || !container.children[base]) return base;
        let i = 2;
        while (container.children[`${base} (${i})`]) i++;
        return `${base} (${i})`;
    }

    public trashNode(parentPath: string, name: string): boolean {
        if (parentPath.toUpperCase().startsWith(this.RECYCLE_PATH.toUpperCase())) return false;

        const fullPath = parentPath + (parentPath.endsWith('\\') ? '' : '\\') + name;
        const fullPathUpper = fullPath.toUpperCase();
        const systemPathUpper = 'C:\\HADOS\\SYSTEM';
        if (fullPathUpper === systemPathUpper || fullPathUpper.startsWith(systemPathUpper + '\\')) return false;

        const parent = this.tree.resolve(parentPath);
        if (!(parent && parent.type === 'dir' && parent.children && parent.children[name])) return false;
        const bin = this.ensureRecycleBin();
        if (!bin || !bin.children) return false;

        const node = parent.children[name];
        const key = this.uniqueKey(bin, node.name);
        node.trashOrigin = parentPath;
        node.trashedAt = Date.now();
        bin.children[key] = node;
        delete parent.children[name];
        this.onSave();
        this.signalTrashChanged();
        return true;
    }

    public listTrash(): ITrashEntry[] {
        const bin = this.tree.resolve(this.RECYCLE_PATH);
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

    public trashCount(): number {
        const bin = this.tree.resolve(this.RECYCLE_PATH);
        return (bin && bin.type === 'dir' && bin.children) ? Object.keys(bin.children).length : 0;
    }

    public restoreFromTrash(id: string): boolean {
        const bin = this.tree.resolve(this.RECYCLE_PATH);
        if (!bin || bin.type !== 'dir' || !bin.children || !bin.children[id]) return false;
        const node = bin.children[id];
        const origin = node.trashOrigin;
        if (!origin) return false;
        const dest = this.tree.resolve(origin);
        if (!dest || dest.type !== 'dir' || !dest.children) return false;

        const targetKey = this.uniqueKey(dest, node.name);
        if (targetKey !== node.name) node.name = targetKey;
        delete node.trashOrigin;
        delete node.trashedAt;
        dest.children[targetKey] = node;
        delete bin.children[id];
        this.onSave();
        this.signalTrashChanged();
        return true;
    }

    public emptyTrash(): void {
        const bin = this.tree.resolve(this.RECYCLE_PATH);
        if (!bin || bin.type !== 'dir' || !bin.children) return;
        for (const child of Object.values(bin.children)) {
            this.ops.releaseSubtreeBlobs(child);
        }
        bin.children = {};
        this.onSave();
        this.signalTrashChanged();
    }
}
