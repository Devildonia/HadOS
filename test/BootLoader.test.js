import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BootLoader } from '../js/core/BootLoader.js';

describe('BootLoader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        document.body.innerHTML = `
            <div id="boot-screen" style="display:none;">
                <pre id="bios-text"></pre>
            </div>
            <div id="splash-screen" style="display:none;"></div>
        `;
    });

    describe('init', () => {
        it('should initialize without errors', () => {
            expect(() => BootLoader.init()).not.toThrow();
        });
    });

    describe('start (boot sequence)', () => {
        it('should show boot screen when started', () => {
            vi.useFakeTimers();
            BootLoader.start(vi.fn());
            expect(document.getElementById('boot-screen').style.display).toBe('block');
            vi.useRealTimers();
        });

        it('should write BIOS lines to bios-text element', () => {
            vi.useFakeTimers();
            BootLoader.start(vi.fn());

            // Advance through all BIOS lines (17 lines × 100ms each + buffer)
            vi.advanceTimersByTime(2000);

            const text = document.getElementById('bios-text').textContent;
            expect(text).toContain('AMIBIOS');
            expect(text).toContain('Pentium');
            expect(text).toContain('Starting Windows');
            vi.useRealTimers();
        });

        it('should call onComplete callback after boot sequence finishes', () => {
            vi.useFakeTimers();
            const onComplete = vi.fn();
            BootLoader.start(onComplete);

            // BIOS phase: ~17 lines × 100ms = 1700ms + 200ms transition + 4000ms splash
            vi.advanceTimersByTime(7000);

            expect(onComplete).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        it('should transition from boot screen to splash screen', () => {
            vi.useFakeTimers();
            BootLoader.start(vi.fn());

            // Advance past BIOS phase
            vi.advanceTimersByTime(2500);

            const boot = document.getElementById('boot-screen');
            const splash = document.getElementById('splash-screen');

            expect(boot.style.display).toBe('none');
            expect(splash.style.display).toBe('flex');
            vi.useRealTimers();
        });

        it('should handle missing DOM elements gracefully', () => {
            document.body.innerHTML = ''; // No boot elements
            const onComplete = vi.fn();

            expect(() => BootLoader.start(onComplete)).not.toThrow();
            expect(onComplete).toHaveBeenCalled(); // Should call immediately
        });
    });
});
