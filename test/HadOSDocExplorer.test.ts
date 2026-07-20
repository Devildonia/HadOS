import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HadOSDocExplorer } from '../js/apps/HadOSDocExplorer.js';
import { VFS } from '../js/core/VFS.js';
import { WindowFactory } from '../js/ui/WindowFactory.js';

describe('HadOSDocExplorer', () => {
    beforeEach(() => {
        // Mock VFS listDir, readFile, etc.
        vi.spyOn(VFS, 'listDir').mockImplementation((path) => {
            if (path === 'C:\\') return ['README_TETRIS.TXT'];
            return ['note-12345.txt'];
        });

        vi.spyOn(VFS, 'readFile').mockImplementation((path) => {
            return "Tetris is a game of blocks.\nYou can move blocks left and right.\nTry to clear rows to score points.";
        });

        // Mock canvas methods
        const mockContext = {
            clearRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            fillStyle: '',
            shadowBlur: 0,
            shadowColor: ''
        };

        vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => setTimeout(cb, 0)));
        vi.stubGlobal('cancelAnimationFrame', vi.fn());

        HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);
        HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({ width: 200, height: 200 });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize and display elements correctly', () => {
        const app = new HadOSDocExplorer();
        const body = WindowFactory.getBody(app.windowId);
        expect(body).not.toBeNull();
        expect(body!.querySelector('#docexplorer-file-select')).not.toBeNull();
        expect(body!.querySelector('#docexplorer-open-btn')).not.toBeNull();
        expect(body!.querySelector('#docexplorer-canvas')).not.toBeNull();
        expect(body!.querySelector('#docexplorer-console')).not.toBeNull();
        app.terminate();
    });

    it('should populate file select list and read VFS file on open click', () => {
        const app = new HadOSDocExplorer();
        const body = WindowFactory.getBody(app.windowId)!;
        const select = body.querySelector('#docexplorer-file-select') as HTMLSelectElement;
        const openBtn = body.querySelector('#docexplorer-open-btn') as HTMLButtonElement;

        expect(select.options.length).toBeGreaterThan(1);
        select.value = "C:\\README_TETRIS.TXT";

        openBtn.click();

        expect(VFS.readFile).toHaveBeenCalledWith("C:\\README_TETRIS.TXT");
        expect(app['points'].length).toBe(3); // 3 non-empty lines
        app.terminate();
    });

    it('should query index and find matching chunk inside Grounded Chat', () => {
        const app = new HadOSDocExplorer();
        const body = WindowFactory.getBody(app.windowId)!;
        const select = body.querySelector('#docexplorer-file-select') as HTMLSelectElement;
        const openBtn = body.querySelector('#docexplorer-open-btn') as HTMLButtonElement;
        const input = body.querySelector('#docexplorer-chat-input') as HTMLInputElement;
        const sendBtn = body.querySelector('#docexplorer-send-btn') as HTMLButtonElement;

        select.value = "C:\\README_TETRIS.TXT";
        openBtn.click();

        input.value = "score points";
        sendBtn.click();

        // Check search logs
        const consoleLogs = body.querySelector('#docexplorer-console')!.innerHTML;
        expect(consoleLogs).toContain('Best Match: Chunk #2'); // "Try to clear rows to score points"
        app.terminate();
    });
});
