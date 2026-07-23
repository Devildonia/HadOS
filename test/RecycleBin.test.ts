import { EventBus } from '../js/core/EventBus';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VFS } from '../js/core/VFS';

/**
 * The real recycle bin: user deletes move to a restorable trash rather than
 * vanishing. These lock the behaviour that the dialog and the desktop icon rely
 * on — most importantly that a system delete (uninstall, session cleanup) never
 * lands in the bin, and that a trashed item comes back where it came from.
 */
describe('VFS recycle bin', () => {
    beforeEach(async () => {
        localStorage.clear();
        vi.resetAllMocks();
        (VFS as any).__reset();
        await VFS.init();
    });

    afterEach(() => vi.restoreAllMocks());

    it('moves a deleted file to the bin instead of destroying it', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'note.txt', 'keep me');

        expect(VFS.trashNode('C:\\DOCUMENTS', 'note.txt')).toBe(true);

        // Gone from its folder…
        expect(VFS.resolve('C:\\DOCUMENTS\\note.txt')).toBeNull();
        // …but present in the bin, remembering where it came from.
        const trash = VFS.listTrash();
        expect(trash).toHaveLength(1);
        expect(trash[0]!.name).toBe('note.txt');
        expect(trash[0]!.origin).toBe('C:\\DOCUMENTS');
        expect(VFS.trashCount()).toBe(1);
    });

    it('restores a trashed file to its origin with content intact', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'note.txt', 'keep me');
        VFS.trashNode('C:\\DOCUMENTS', 'note.txt');

        const id = VFS.listTrash()[0]!.id;
        expect(VFS.restoreFromTrash(id)).toBe(true);

        expect(VFS.readFile('C:\\DOCUMENTS\\note.txt')).toBe('keep me');
        expect(VFS.trashCount()).toBe(0);
    });

    it('restores a whole directory subtree', () => {
        VFS.mkdir('C:\\DOCUMENTS', 'Sub');
        VFS.writeFile('C:\\DOCUMENTS\\Sub', 'inner.txt', 'nested');
        VFS.trashNode('C:\\DOCUMENTS', 'Sub');
        expect(VFS.resolve('C:\\DOCUMENTS\\Sub')).toBeNull();

        VFS.restoreFromTrash(VFS.listTrash()[0]!.id);
        expect(VFS.readFile('C:\\DOCUMENTS\\Sub\\inner.txt')).toBe('nested');
    });

    it('renames on restore when the name is taken again', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'first');
        VFS.trashNode('C:\\DOCUMENTS', 'a.txt');
        // A new file takes the freed name before the restore.
        VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'second');

        VFS.restoreFromTrash(VFS.listTrash()[0]!.id);

        expect(VFS.readFile('C:\\DOCUMENTS\\a.txt')).toBe('second');       // untouched
        expect(VFS.readFile('C:\\DOCUMENTS\\a.txt (2)')).toBe('first');    // restored copy
    });

    it('refuses to restore when the origin folder is gone', () => {
        VFS.mkdir('C:\\DOCUMENTS', 'Folder');
        VFS.writeFile('C:\\DOCUMENTS\\Folder', 'f.txt', 'x');
        VFS.trashNode('C:\\DOCUMENTS\\Folder', 'f.txt');
        // The origin folder is deleted while the file sits in the bin.
        VFS.deleteNode('C:\\DOCUMENTS', 'Folder');

        expect(VFS.restoreFromTrash(VFS.listTrash()[0]!.id)).toBe(false);
        expect(VFS.trashCount()).toBe(1); // still safely in the bin
    });

    it('empties the bin permanently', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'x');
        VFS.writeFile('C:\\DOCUMENTS', 'b.txt', 'y');
        VFS.trashNode('C:\\DOCUMENTS', 'a.txt');
        VFS.trashNode('C:\\DOCUMENTS', 'b.txt');
        expect(VFS.trashCount()).toBe(2);

        VFS.emptyTrash();
        expect(VFS.trashCount()).toBe(0);
        expect(VFS.listTrash()).toEqual([]);
    });

    it('survives two files of the same name from different folders', () => {
        VFS.mkdir('C:\\DOCUMENTS', 'One');
        VFS.mkdir('C:\\DOCUMENTS', 'Two');
        VFS.writeFile('C:\\DOCUMENTS\\One', 'dup.txt', 'from one');
        VFS.writeFile('C:\\DOCUMENTS\\Two', 'dup.txt', 'from two');

        expect(VFS.trashNode('C:\\DOCUMENTS\\One', 'dup.txt')).toBe(true);
        expect(VFS.trashNode('C:\\DOCUMENTS\\Two', 'dup.txt')).toBe(true);
        expect(VFS.trashCount()).toBe(2);

        // Both restore to their own origins.
        for (const entry of VFS.listTrash()) VFS.restoreFromTrash(entry.id);
        expect(VFS.readFile('C:\\DOCUMENTS\\One\\dup.txt')).toBe('from one');
        expect(VFS.readFile('C:\\DOCUMENTS\\Two\\dup.txt')).toBe('from two');
    });

    it('persists the bin across a flush + reload', async () => {
        VFS.writeFile('C:\\DOCUMENTS', 'note.txt', 'keep me');
        VFS.trashNode('C:\\DOCUMENTS', 'note.txt');

        await VFS.flush();
        (VFS as any).__reset();
        await VFS.init();

        expect(VFS.trashCount()).toBe(1);
        expect(VFS.listTrash()[0]!.origin).toBe('C:\\DOCUMENTS');
    });

    // --- The boundary that keeps uninstall/session cleanup out of the bin ---

    it('a system deleteNode does NOT fill the bin', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'gone.txt', 'x');
        expect(VFS.deleteNode('C:\\DOCUMENTS', 'gone.txt')).toBe(true);
        expect(VFS.trashCount()).toBe(0);
    });

    it('trashNode is a no-op on a missing node', () => {
        expect(VFS.trashNode('C:\\DOCUMENTS', 'nope.txt')).toBe(false);
        expect(VFS.trashCount()).toBe(0);
    });

    it('refuses to trash something already in the bin', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'x');
        VFS.trashNode('C:\\DOCUMENTS', 'a.txt');
        const id = VFS.listTrash()[0]!.id;

        expect(VFS.trashNode('C:\\HADOS\\SYSTEM\\RECYCLED', id)).toBe(false);
        expect(VFS.trashCount()).toBe(1);
    });

    it('fires a vfs:trash-changed signal on every mutation', () => {
        const listener = vi.fn();
        const unbind = EventBus.on('vfs:trash-changed', listener);

        VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'x');
        listener.mockClear();

        VFS.trashNode('C:\\DOCUMENTS', 'a.txt');
        VFS.restoreFromTrash(VFS.listTrash()[0]!.id);
        VFS.trashNode('C:\\DOCUMENTS', 'a.txt');
        VFS.emptyTrash();

        expect(listener).toHaveBeenCalledTimes(4);
        unbind();
    });
});
