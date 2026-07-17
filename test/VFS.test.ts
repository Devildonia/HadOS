import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VFS } from '../js/core/VFS';

describe('VFS (Virtual File System)', () => {
    beforeEach(async () => {
        // Clear localStorage and reset VFS before each test
        localStorage.clear();
        vi.resetAllMocks();
        (VFS as any).__reset();

        // init() is async (IndexedDB-backed, localStorage fallback under jsdom)
        await VFS.init();
    });

    it('should initialize with default structure if storage is empty', () => {
        const root = VFS.getRoot() as any;
        expect(root).toBeDefined();
        expect(root.name).toBe('C:');
        expect(root.children.HADOS).toBeDefined();
    });

    it('should resolve absolute paths correctly', () => {
        const systemDirNode = VFS.resolve('C:\\HADOS') as any;
        expect(systemDirNode).toBeDefined();
        expect(systemDirNode.name).toBe('HADOS');

        const systemNode = VFS.resolve('C:\\HADOS\\SYSTEM') as any;
        expect(systemNode).toBeDefined();
        expect(systemNode.name).toBe('SYSTEM');
    });

    it('should return null for non-existent paths', () => {
        const invalidNode = VFS.resolve('C:\\NON_EXISTENT');
        expect(invalidNode).toBeNull();
    });

    it('should be able to create directories', () => {
        const success = VFS.mkdir('C:\\HADOS', 'TEMP');
        expect(success).toBe(true);

        const tempNode = VFS.resolve('C:\\HADOS\\TEMP') as any;
        expect(tempNode).toBeDefined();
        expect(tempNode.type).toBe('dir');
    });

    it('should be able to write and read files', () => {
        const success = VFS.writeFile('C:\\DOCUMENTS', 'test.txt', 'Hello Vitest');
        expect(success).toBe(true);

        const content = VFS.readFile('C:\\DOCUMENTS\\test.txt');
        expect(content).toBe('Hello Vitest');
    });

    it('should persist data across flush + reload', async () => {
        VFS.mkdir('C:\\', 'PERSISTENT');

        // Round-trip: flush to the backend, drop the in-memory tree, reload.
        await VFS.flush();
        (VFS as any).__reset();
        await VFS.init();

        const persistentNode = VFS.resolve('C:\\PERSISTENT');
        expect(persistentNode).toBeDefined();
    });

    // --- Audit hardening (findings #4, #5, #10) ---

    it('should NOT let writeFile silently overwrite a directory (finding #4)', () => {
        VFS.mkdir('C:\\DOCUMENTS', 'MyFolder');
        VFS.writeFile('C:\\DOCUMENTS\\MyFolder', 'keep.txt', 'important');

        // Writing a file named like the existing folder must be refused.
        const ok = VFS.writeFile('C:\\DOCUMENTS', 'MyFolder', 'clobber');
        expect(ok).toBe(false);

        const node = VFS.resolve('C:\\DOCUMENTS\\MyFolder') as any;
        expect(node.type).toBe('dir'); // still a directory
        expect(VFS.readFile('C:\\DOCUMENTS\\MyFolder\\keep.txt')).toBe('important'); // subtree intact
    });

    it('should NOT let mkdir clobber an existing file, and be idempotent on dirs (finding #4)', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'note.txt', 'data');
        expect(VFS.mkdir('C:\\DOCUMENTS', 'note.txt')).toBe(false);
        expect((VFS.resolve('C:\\DOCUMENTS\\note.txt') as any).type).toBe('file');

        VFS.mkdir('C:\\DOCUMENTS', 'Sub');
        expect(VFS.mkdir('C:\\DOCUMENTS', 'Sub')).toBe(true); // idempotent, keeps subtree
    });

    it('should overwrite an existing file of the same name (normal save)', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'v1');
        expect(VFS.writeFile('C:\\DOCUMENTS', 'a.txt', 'v2')).toBe(true);
        expect(VFS.readFile('C:\\DOCUMENTS\\a.txt')).toBe('v2');
    });

    it('should sanitize the new name in rename (finding #5)', () => {
        VFS.writeFile('C:\\DOCUMENTS', 'old.txt', 'x');
        const ok = VFS.rename('C:\\DOCUMENTS', 'old.txt', 'ev<il>.txt');
        expect(ok).toBe(true);
        // Dangerous chars are replaced with '_', matching mkdir/writeFile.
        expect(VFS.resolve('C:\\DOCUMENTS\\ev_il_.txt')).toBeDefined();
        expect(VFS.resolve('C:\\DOCUMENTS\\ev<il>.txt')).toBeNull();
    });

    it('should reject files exceeding the size limit (finding #10)', () => {
        const huge = 'x'.repeat(1_000_001);
        expect(VFS.writeFile('C:\\DOCUMENTS', 'big.bin', huge)).toBe(false);
        expect(VFS.resolve('C:\\DOCUMENTS\\big.bin')).toBeNull();
    });

    it('should reset to defaults when stored tree fails schema validation (finding #10)', async () => {
        localStorage.setItem('win95_vfs_root', JSON.stringify({ garbage: true }));
        (VFS as any).__reset();
        await VFS.init();
        const root = VFS.getRoot() as any;
        expect(root.name).toBe('C:');
        expect(root.children.HADOS).toBeDefined();
    });

    it('should filter out hidden files/folders in listDir (L3)', () => {
        // SYSTEM should be hidden by default
        const hadosDir = VFS.listDir('C:\\HADOS');
        expect(hadosDir).not.toContain('SYSTEM');

        // Create a custom file in SYSTEM, it should be marked hidden and filtered in listDir
        VFS.writeFile('C:\\HADOS\\SYSTEM', 'dummy.txt', 'data');
        const systemDir = VFS.listDir('C:\\HADOS\\SYSTEM');
        expect(systemDir).not.toContain('dummy.txt');
    });

    it('should reject trashing C:\\HADOS\\SYSTEM or any of its subpaths (L5)', () => {
        // Create dummy file inside SYSTEM
        VFS.writeFile('C:\\HADOS\\SYSTEM', 'secret.txt', 'secret data');

        // Try to trash the secret.txt inside SYSTEM
        const result1 = VFS.trashNode('C:\\HADOS\\SYSTEM', 'secret.txt');
        expect(result1).toBe(false);

        // Try to trash SYSTEM itself
        const result2 = VFS.trashNode('C:\\HADOS', 'SYSTEM');
        expect(result2).toBe(false);
    });
});
