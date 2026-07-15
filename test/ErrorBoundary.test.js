/**
 * TESTS: ErrorBoundary
 * Sprint 2 — covers the global JS error → BSOD pipeline
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VFS } from '../js/core/VFS.js';
import { showBSOD, initErrorBoundary, __resetErrorBoundaryState } from '../js/core/ErrorBoundary.js';

// ─── DOM Setup ────────────────────────────────────────────────────────────────

function setupBSODDom() {
    document.body.innerHTML = `
        <div id="bsod-screen" style="display:none;">
            <div id="bsod-content"></div>
        </div>
    `;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ErrorBoundary — showBSOD()', () => {
    beforeEach(async () => {
        setupBSODDom();
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        __resetErrorBoundaryState();
    });

    it('shows the bsod-screen element', () => {
        showBSOD('Test error', 'test.js', 42, '');
        const screen = document.getElementById('bsod-screen');
        expect(screen.style.display).toBe('flex');
    });

    it('populates bsod-content with the error message', () => {
        showBSOD('Something went wrong', 'app.js', 100, '');
        const content = document.getElementById('bsod-content');
        expect(content.innerHTML).toContain('Something went wrong');
    });

    it('includes source and line in the BSOD content', () => {
        showBSOD('Crash!', 'module.js', 77, '');
        const content = document.getElementById('bsod-content');
        expect(content.innerHTML).toContain('module.js');
        expect(content.innerHTML).toContain('77');
    });

    it('XSS-sanitizes message, source and line', () => {
        showBSOD('<script>alert(1)</script>', '<evil>', '<line>', '');
        const content = document.getElementById('bsod-content');
        expect(content.innerHTML).not.toContain('<script>');
        expect(content.innerHTML).toContain('&lt;script&gt;');
    });

    it('handles missing BSOD DOM gracefully (no throw)', () => {
        document.body.innerHTML = '';  // remove BSOD elements
        __resetErrorBoundaryState();
        expect(() => showBSOD('error', 'f.js', 1)).not.toThrow();
    });

    describe('VFS logging', () => {
        it('saves crash log to VFS', () => {
            showBSOD('VFS Error message', 'test_vfs.js', 99, 'Dummy Stack');
            const logContent = VFS.readFile('C:\\WINDOWS\\SYSTEM\\crash.log');
            expect(logContent).not.toBeNull();
            expect(logContent).toContain('VFS Error message');
            expect(logContent).toContain('test_vfs.js:99');
            expect(logContent).toContain('Dummy Stack');
        });

        it('appends multiple crashes to the log without overwriting', () => {
            showBSOD('First error', 'file1.js', 10, 'Stack 1');
            
            __resetErrorBoundaryState();
            showBSOD('Second error', 'file2.js', 20, 'Stack 2');

            const logContent = VFS.readFile('C:\\WINDOWS\\SYSTEM\\crash.log');
            expect(logContent).toContain('First error');
            expect(logContent).toContain('Second error');
        });

        it('truncates log if it exceeds 50KB', () => {
            const padding = 'a'.repeat(52 * 1024); // 52KB (exceeds 50KB limit)
            VFS.writeFile('C:\\WINDOWS\\SYSTEM', 'crash.log', padding);

            showBSOD('Triggers truncation', 'file.js', 30, 'Stack trace');

            const logContent = VFS.readFile('C:\\WINDOWS\\SYSTEM\\crash.log');
            expect(logContent.length).toBeLessThan(51 * 1024);
            expect(logContent).toContain('Triggers truncation');
        });

        it('still displays BSOD even if VFS.writeFile throws', () => {
            const spy = vi.spyOn(VFS, 'writeFile').mockImplementation(() => {
                throw new Error('Disk full simulated');
            });

            showBSOD('Should not crash showBSOD itself', 'file.js', 40);
            
            const screen = document.getElementById('bsod-screen');
            expect(screen.style.display).toBe('flex');
            spy.mockRestore();
        });
    });
});

describe('ErrorBoundary — initErrorBoundary()', () => {
    it('attaches error and unhandledrejection listeners', async () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        vi.resetModules();
        const mod = await import('../js/core/ErrorBoundary.js');
        mod.initErrorBoundary();

        const events = addSpy.mock.calls.map(c => c[0]);
        expect(events).toContain('error');
        expect(events).toContain('unhandledrejection');
    });
});
