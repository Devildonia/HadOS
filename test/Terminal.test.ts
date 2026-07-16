import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Terminal } from '../js/apps/Terminal';
import { VFS } from '../js/core/VFS';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('Terminal CLI', () => {
    let mockBody: HTMLDivElement;
    const windowId = 'win-terminal-test';

    beforeEach(() => {
        mockBody = document.createElement('div');
        vi.spyOn(WindowFactory, 'create').mockReturnValue(windowId);
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(mockBody);
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});
        
        // Mock VFS implementation
        vi.spyOn(VFS, 'resolve').mockImplementation((path) => {
            if (path === 'C:\\HADOS\\DESKTOP') {
                return { name: 'DESKTOP', type: 'dir', children: {} } as any;
            }
            if (path === 'C:\\HADOS\\DESKTOP\\test') {
                return { name: 'test', type: 'dir', children: {} } as any;
            }
            if (path === 'C:\\HADOS\\DESKTOP\\test.txt') {
                return { name: 'test.txt', type: 'file', content: 'hello world' } as any;
            }
            return null;
        });
        vi.spyOn(VFS, 'listDir').mockReturnValue(['test', 'test.txt']);
        vi.spyOn(VFS, 'readFile').mockReturnValue('hello world');
        vi.spyOn(VFS, 'writeFile').mockReturnValue(true);
        vi.spyOn(VFS, 'mkdir').mockReturnValue(true);
        vi.spyOn(VFS, 'deleteNode').mockReturnValue(true);
        vi.spyOn(VFS, 'trashNode').mockReturnValue(true);
        vi.spyOn(VFS, 'rename').mockReturnValue(true);
        vi.spyOn(VFS, 'flushSync').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should boot and show welcome text and prompt', () => {
        const term = new Terminal();
        const html = mockBody.innerHTML;
        expect(html).toContain('HadOS');
        expect(html).toContain('C:\\HADOS\\DESKTOP&gt;');
        term.terminate();
    });

    it('should parse and run command cd test', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;
        
        input.value = 'cd test';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const html = mockBody.innerHTML;
        expect(html).toContain('C:\\HADOS\\DESKTOP\\test&gt;');
        term.terminate();
    });

    it('should handle cd with no arguments', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'cd';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('C:\\HADOS\\DESKTOP');
        term.terminate();
    });

    it('should show error when cd target not found', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'cd nonexistent';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('Error: Directory not found: nonexistent');
        term.terminate();
    });

    it('should display file content with cat/type', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'type test.txt';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const html = mockBody.innerHTML;
        expect(html).toContain('hello world');
        term.terminate();
    });

    it('should handle type file not found', () => {
        // The shared beforeEach mocks readFile to always return 'hello world';
        // override it so `type` reaches its not-found branch.
        vi.spyOn(VFS, 'readFile').mockReturnValue(null);
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'type nonexistent.txt';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('Error: File not found: nonexistent.txt');
        term.terminate();
    });

    it('del sends a file to the recycle bin, not oblivion', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'del test.txt';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(VFS.trashNode).toHaveBeenCalledWith('C:\\HADOS\\DESKTOP', 'test.txt');
        expect(VFS.deleteNode).not.toHaveBeenCalled();
        expect(mockBody.innerHTML).toContain('Moved to Eco Bin');
        term.terminate();
    });

    it('del /f permanently deletes, bypassing the bin', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'del /f test.txt';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(VFS.deleteNode).toHaveBeenCalledWith('C:\\HADOS\\DESKTOP', 'test.txt');
        expect(VFS.trashNode).not.toHaveBeenCalled();
        expect(mockBody.innerHTML).toContain('Permanently deleted');
        term.terminate();
    });

    it('del command shows error when target missing', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'del';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('Error: No target specified.');
        term.terminate();
    });

    it('should prevent XSS when printing data', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'echo <script>alert(1)</script>';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const output = mockBody.querySelector('.terminal-output')!;
        expect(output.innerHTML).not.toContain('<script>');
        expect(output.innerHTML).toContain('&lt;script&gt;');
        term.terminate();
    });

    it('should support redirection to write a file', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'echo hello redirection > output.txt';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(VFS.writeFile).toHaveBeenCalledWith('C:\\HADOS\\DESKTOP', 'output.txt', 'hello redirection');
        expect(mockBody.innerHTML).toContain('File written:');
        term.terminate();
    });

    it('should support rename command', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'ren test.txt newtest.txt';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(VFS.rename).toHaveBeenCalledWith('C:\\HADOS\\DESKTOP', 'test.txt', 'newtest.txt');
        expect(mockBody.innerHTML).toContain('Renamed test.txt to newtest.txt');
        term.terminate();
    });

    it('should support clear / cls', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'cls';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const output = mockBody.querySelector('.terminal-output')!;
        expect(output.innerHTML).toBe('');
        term.terminate();
    });

    it('should support mkdir command', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'mkdir newdir';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(VFS.mkdir).toHaveBeenCalledWith('C:\\HADOS\\DESKTOP', 'newdir');
        term.terminate();
    });

    it('should list directory contents with ls / dir', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'ls';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('&lt;DIR&gt;  test');
        expect(mockBody.innerHTML).toContain('test.txt');
        term.terminate();
    });

    it('should navigate history with Up and Down arrows', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        // Run 2 commands
        input.value = 'cmd1';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        input.value = 'cmd2';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Press Up
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        expect(input.value).toBe('cmd2');

        // Press Up again
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        expect(input.value).toBe('cmd1');

        // Press Down
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(input.value).toBe('cmd2');

        // Press Down again (resets input)
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(input.value).toBe('');

        term.terminate();
    });

    it('should focus input when container is clicked', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;
        
        const focusSpy = vi.spyOn(input, 'focus');
        mockBody.click();

        expect(focusSpy).toHaveBeenCalled();
        term.terminate();
    });

    it('should print version info with ver', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'ver';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('HadOS Terminal');
        term.terminate();
    });

    it('should print help menu with help', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'help';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('Supported commands:');
        term.terminate();
    });

    it('should show error for bad commands', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input') as HTMLInputElement;

        input.value = 'invalidcommand';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(mockBody.innerHTML).toContain('Bad command or file name: invalidcommand');
        term.terminate();
    });
});
