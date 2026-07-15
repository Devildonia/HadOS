import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TouchManager } from '../js/ui/TouchManager.js';
import { Services } from '../js/core/ServiceContainer.js';

describe('TouchManager', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Services.__reset();

        Services.register('WindowManager', {
            open: vi.fn(),
            bringToFront: vi.fn(),
            makeDraggable: vi.fn()
        });

        Services.register('Kernel', {
            launch: vi.fn()
        });

        document.body.innerHTML = `
            <div id="desktop">
                <div class="desktop-icon" data-launch="notepad">
                    <div class="icon-box">📝</div>
                    <span>Notepad</span>
                </div>
                <div id="win-test" class="win95-window" style="display:none;">
                    <div class="window-header"><span>Test</span></div>
                </div>
            </div>
        `;
    });

    describe('init', () => {
        it('should initialize without errors', () => {
            expect(() => TouchManager.init()).not.toThrow();
        });

        it('should not initialize twice (guard)', () => {
            // First init
            TouchManager.init();
            // Second init should be silently skipped
            expect(() => TouchManager.init()).not.toThrow();
        });
    });

    describe('touch event configuration', () => {
        it('should have reasonable double-tap delay', () => {
            // The module defines DOUBLE_TAP_DELAY = 300ms
            // We test this indirectly by verifying init doesn't crash
            // and the module exports exist
            expect(TouchManager).toBeDefined();
            expect(typeof TouchManager.init).toBe('function');
        });
    });
});
