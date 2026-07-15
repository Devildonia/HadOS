import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WindowManager } from '../js/ui/WindowManager.js';
import { Services } from '../js/core/ServiceContainer.js';

describe('WindowManager', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Services.__reset();

        // Register WindowManager itself in Services (as done in production)
        Services.register('WindowManager', WindowManager);

        // Mock Kernel with process tracking
        const mockProcesses = [];
        const mockKernel = {
            getRegistry: () => ({
                apps: {},
                processes: mockProcesses
            }),
            kill: vi.fn((pid) => {
                const idx = mockProcesses.findIndex(p => p.pid === pid);
                if (idx >= 0) mockProcesses.splice(idx, 1);
            })
        };
        Services.register('Kernel', mockKernel);

        // Mock AudioManager
        Services.register('AudioManager', {
            play: vi.fn(),
            loadSound: vi.fn(),
            init: vi.fn()
        });

        // Build a minimal desktop with windows
        document.body.innerHTML = `
            <div id="desktop">
                <div id="win-test1" class="win95-window" style="display:none;">
                    <div class="window-header">
                        <span>Test Window 1</span>
                        <div class="window-controls">
                            <button class="window-btn minimize-btn">_</button>
                            <button class="window-btn maximize-btn">□</button>
                            <button class="window-btn close-btn">×</button>
                        </div>
                    </div>
                    <div class="window-body">Content 1</div>
                </div>
                <div id="win-test2" class="win95-window" style="display:none;">
                    <div class="window-header">
                        <span>Test Window 2</span>
                        <div class="window-controls">
                            <button class="window-btn close-btn">×</button>
                        </div>
                    </div>
                    <div class="window-body">Content 2</div>
                </div>
                <div id="win-with-iframe" class="win95-window" style="display:none;">
                    <div class="window-header"><span>Game Window</span></div>
                    <div class="window-body">
                        <iframe id="game-frame" src="about:blank"></iframe>
                    </div>
                </div>
            </div>
        `;
    });

    describe('open', () => {
        it('should make a hidden window visible', () => {
            WindowManager.open('win-test1');
            const win = document.getElementById('win-test1');
            expect(win.style.display).not.toBe('none');
        });

        it('should assign z-index on open', () => {
            WindowManager.open('win-test1');
            const win = document.getElementById('win-test1');
            expect(parseInt(win.style.zIndex)).toBeGreaterThanOrEqual(100);
        });

        it('should track window in active list', () => {
            WindowManager.open('win-test1');
            expect(WindowManager.getActive()).toContain('win-test1');
        });

        it('should handle non-existent window gracefully', () => {
            expect(() => WindowManager.open('win-ghost')).not.toThrow();
        });

        it('should dispatch kernel:process-started for legacy windows', () => {
            const spy = vi.spyOn(window, 'dispatchEvent');
            WindowManager.open('win-test1');
            const callArgs = spy.mock.calls.find(args => args[0]?.type === 'kernel:process-started');
            expect(callArgs).toBeDefined();
        });
    });

    describe('close', () => {
        it('should hide window on close', () => {
            WindowManager.open('win-test1');
            WindowManager.close('win-test1');
            expect(document.getElementById('win-test1').style.display).toBe('none');
        });

        it('should remove from active list', () => {
            WindowManager.open('win-test1');
            WindowManager.close('win-test1');
            expect(WindowManager.getActive()).not.toContain('win-test1');
        });

        it('should unload iframes on close (process termination)', () => {
            const iframe = document.getElementById('game-frame');
            iframe.src = 'https://example.com';

            WindowManager.open('win-with-iframe');
            WindowManager.close('win-with-iframe');

            // Iframe should be set to about:blank
            expect(iframe.src).toContain('about:blank');
        });

        it('should handle closing non-existent window gracefully', () => {
            expect(() => WindowManager.close('win-ghost')).not.toThrow();
        });
    });

    describe('minimize', () => {
        it('should hide window but keep it in active list', () => {
            WindowManager.open('win-test1');
            WindowManager.minimize('win-test1');
            const win = document.getElementById('win-test1');
            expect(win.style.display).toBe('none');
            // Should still be tracked (taskbar button persists)
            expect(WindowManager.getActive()).toContain('win-test1');
        });
    });

    describe('maximize / toggle', () => {
        it('should toggle maximized class', () => {
            WindowManager.open('win-test1');
            const win = document.getElementById('win-test1');

            WindowManager.maximize('win-test1');
            expect(win.classList.contains('maximized')).toBe(true);

            WindowManager.maximize('win-test1');
            expect(win.classList.contains('maximized')).toBe(false);
        });
    });

    describe('bringToFront', () => {
        it('should increase z-index when bringing window to front', () => {
            WindowManager.open('win-test1');
            WindowManager.open('win-test2');
            const win1 = document.getElementById('win-test1');
            const z1Before = parseInt(win1.style.zIndex);

            WindowManager.bringToFront(win1);
            const z1After = parseInt(win1.style.zIndex);
            expect(z1After).toBeGreaterThan(z1Before);
        });
    });

    describe('closeAll', () => {
        it('should close all active windows', () => {
            WindowManager.open('win-test1');
            WindowManager.open('win-test2');
            expect(WindowManager.getActive().length).toBe(2);

            WindowManager.closeAll();
            expect(WindowManager.getActive().length).toBe(0);
        });
    });

    describe('z-index management', () => {
        it('should assign incrementing z-indices', () => {
            WindowManager.open('win-test1');
            WindowManager.open('win-test2');

            const z1 = parseInt(document.getElementById('win-test1').style.zIndex);
            const z2 = parseInt(document.getElementById('win-test2').style.zIndex);
            expect(z2).toBeGreaterThan(z1);
        });
    });
});
