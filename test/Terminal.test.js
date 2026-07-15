import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Terminal } from '../js/apps/Terminal';
import { VFS } from '../js/core/VFS';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('Terminal CLI', () => {
    let mockBody;
    const windowId = 'win-terminal-test';

    beforeEach(() => {
        mockBody = document.createElement('div');
        vi.spyOn(WindowFactory, 'create').mockReturnValue(windowId);
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(mockBody);
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});
        
        // Mock VFS implementation
        vi.spyOn(VFS, 'resolve').mockImplementation((path) => {
            if (path === 'C:\\WINDOWS\\DESKTOP') {
                return { name: 'DESKTOP', type: 'dir', children: {} };
            }
            if (path === 'C:\\WINDOWS\\DESKTOP\\test') {
                return { name: 'test', type: 'dir', children: {} };
            }
            if (path === 'C:\\WINDOWS\\DESKTOP\\test.txt') {
                return { name: 'test.txt', type: 'file', content: 'hello world' };
            }
            return null;
        });
        vi.spyOn(VFS, 'listDir').mockReturnValue(['test', 'test.txt']);
        vi.spyOn(VFS, 'readFile').mockReturnValue('hello world');
        vi.spyOn(VFS, 'writeFile').mockReturnValue(true);
        vi.spyOn(VFS, 'mkdir').mockReturnValue(true);
        vi.spyOn(VFS, 'deleteNode').mockReturnValue(true);
        vi.spyOn(VFS, 'rename').mockReturnValue(true);
        vi.spyOn(VFS, 'flushSync').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should boot and show welcome text and prompt', () => {
        const term = new Terminal();
        const html = mockBody.innerHTML;
        expect(html).toContain('Microsoft(R) Windows 95');
        expect(html).toContain('C:\\WINDOWS\\DESKTOP&gt;');
        term.terminate();
    });

    it('should parse and run command cd test', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input');
        
        input.value = 'cd test';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const html = mockBody.innerHTML;
        expect(html).toContain('C:\\WINDOWS\\DESKTOP\\test&gt;');
        term.terminate();
    });

    it('should display file content with cat/type', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input');

        input.value = 'type test.txt';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const html = mockBody.innerHTML;
        expect(html).toContain('hello world');
        term.terminate();
    });

    it('should prevent XSS when printing data', () => {
        const term = new Terminal();
        const input = mockBody.querySelector('.terminal-input');

        // echo payload > test.txt redirection or direct output
        input.value = 'echo <script>alert(1)</script>';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        const output = mockBody.querySelector('.terminal-output');
        expect(output.innerHTML).not.toContain('<script>');
        expect(output.innerHTML).toContain('&lt;script&gt;');
        term.terminate();
    });
});
