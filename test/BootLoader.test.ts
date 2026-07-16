import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BootLoader } from '../js/core/BootLoader';

describe('BootLoader', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        document.body.innerHTML = `
            <div id="boot-screen" style="display:none;">
                <pre id="bios-text"></pre>
            </div>
            <div id="splash-screen" style="display:none;">
                <p class="splash-title">loading HadOS</p>
                <div class="splash-progress" role="progressbar" aria-valuenow="0">
                    <div class="splash-progress-bar"></div>
                </div>
                <div class="splash-percent">0%</div>
            </div>
        `;
    });

    /**
     * Runs the POST phase and lands on the splash. Async because the hardware
     * probe resolves between start() and the first printed line.
     */
    async function reachSplash(onComplete = vi.fn()) {
        BootLoader.start(onComplete);
        await vi.advanceTimersByTimeAsync(2500);
        return onComplete;
    }

    const percent = () => document.querySelector('.splash-percent')!.textContent;
    const barWidth = () => (document.querySelector('.splash-progress-bar') as HTMLElement).style.width;

    describe('init', () => {
        it('should initialize without errors', () => {
            expect(() => BootLoader.init()).not.toThrow();
        });
    });

    describe('start (boot sequence)', () => {
        it('should show boot screen when started', () => {
            vi.useFakeTimers();
            BootLoader.start(vi.fn());
            expect(document.getElementById('boot-screen')!.style.display).toBe('block');
            vi.useRealTimers();
        });

        it('should write POST lines to bios-text element', async () => {
            vi.useFakeTimers();
            BootLoader.start(vi.fn());

            // Advance through all POST lines (19 lines × 100ms each + buffer)
            await vi.advanceTimersByTimeAsync(2000);

            const text = document.getElementById('bios-text')!.textContent;
            expect(text).toContain('HadOS BIOS');
            expect(text).toContain('Starting HadOS');
            vi.useRealTimers();
        });

        it('should report the real machine, not a hardcoded 1995 one', async () => {
            vi.useFakeTimers();
            BootLoader.start(vi.fn());
            await vi.advanceTimersByTimeAsync(2000);

            const text = document.getElementById('bios-text')!.textContent;
            // The probe reads this machine's core count; jsdom always reports one.
            expect(text).toContain(`${navigator.hardwareConcurrency} logical processors`);
            expect(text).toContain('Video Mode');
            expect(text).toContain(`${navigator.hardwareConcurrency}`);
            // The fantasy Pentium is gone for good.
            expect(text).not.toContain('Pentium');
            expect(text).not.toContain('850MB HDD');
            vi.useRealTimers();
        });

        it('should call onComplete callback once the OS reports ready', async () => {
            vi.useFakeTimers();
            const onComplete = await reachSplash();

            BootLoader.signalReady();
            // Splash dwell: 4000ms of brand time before the desktop appears.
            await vi.advanceTimersByTimeAsync(4100);

            expect(onComplete).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        it('should transition from boot screen to splash screen', async () => {
            vi.useFakeTimers();
            BootLoader.start(vi.fn());

            // Advance past POST phase
            await vi.advanceTimersByTimeAsync(2500);

            const boot = document.getElementById('boot-screen')!;
            const splash = document.getElementById('splash-screen')!;

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

    describe('splash progress', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('drives the bar and the readout together', async () => {
            await reachSplash();
            await vi.advanceTimersByTimeAsync(1000);

            const shown = parseInt(percent()!, 10);
            expect(shown).toBeGreaterThan(0);
            expect(shown).toBeLessThan(90);
            expect(parseFloat(barWidth())).toBeCloseTo(shown, 0);
        });

        it('holds at 90% while the OS has not reported ready', async () => {
            const onComplete = await reachSplash();

            // Well past the dwell: without a ready signal it must not claim 100%.
            await vi.advanceTimersByTimeAsync(6000);

            expect(percent()).toBe('90%');
            expect(onComplete).not.toHaveBeenCalled();
        });

        it('completes to 100% once ready lands', async () => {
            const onComplete = await reachSplash();
            await vi.advanceTimersByTimeAsync(6000);
            expect(percent()).toBe('90%');

            BootLoader.signalReady();
            await vi.advanceTimersByTimeAsync(100);

            expect(percent()).toBe('100%');
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it('still serves the full dwell when the OS is ready immediately', async () => {
            const onComplete = await reachSplash();
            BootLoader.signalReady();

            await vi.advanceTimersByTimeAsync(500);
            expect(parseInt(percent()!, 10)).toBeLessThan(100);
            expect(onComplete).not.toHaveBeenCalled();
        });

        it('gives up on a ready signal that never arrives', async () => {
            const onComplete = await reachSplash();

            await vi.advanceTimersByTimeAsync(13000); // past SPLASH_MAX_MS

            expect(percent()).toBe('100%');
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it('exposes progress to assistive tech', async () => {
            await reachSplash();
            BootLoader.signalReady();
            await vi.advanceTimersByTimeAsync(5000);

            const track = document.querySelector('.splash-progress')!;
            expect(track.getAttribute('aria-valuenow')).toBe('100');
        });

        it('boots a splash that has no progress bar', async () => {
            document.body.innerHTML = `
                <div id="boot-screen"><pre id="bios-text"></pre></div>
                <div id="splash-screen"></div>
            `;
            const onComplete = vi.fn();

            BootLoader.start(onComplete);
            await vi.advanceTimersByTimeAsync(2500);
            BootLoader.signalReady();
            await vi.advanceTimersByTimeAsync(4100);

            expect(onComplete).toHaveBeenCalledTimes(1);
        });
    });
});
