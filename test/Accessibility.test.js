import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { WindowManager } from '../js/ui/WindowManager.js';
import { Services } from '../js/core/ServiceContainer.js';
import { Utils } from '../js/utils.js';
import { setupEventListeners, __resetEventListenersState } from '../js/core/event_listeners.js';

describe('Accessibility & Keyboard Navigation', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        Services.__reset();
        document.body.innerHTML = `
            <div id="a11y-announcer" aria-live="assertive" class="sr-only"></div>
            <div id="desktop" role="application">
                <div class="icon" data-launch="notepad" tabindex="0">Notepad</div>
                <div class="win95-window" id="win-notepad" style="display:none;">
                    <div class="window-header">
                        <span>Notepad Title</span>
                        <div class="window-controls">
                            <button class="window-btn minimize-btn">_</button>
                            <button class="window-btn maximize-btn">□</button>
                            <button class="window-btn close-btn">×</button>
                        </div>
                    </div>
                    <div class="window-body">
                        <textarea id="notepad-textarea"></textarea>
                    </div>
                </div>
            </div>
        `;

        // Register window manager and test mocks
        Services.register('WindowManager', WindowManager);
        WindowManager.destroy();
        WindowManager.initializeControls();

        // Initialize event listeners for testing keyboard shortcuts like Alt+Tab
        __resetEventListenersState();
        setupEventListeners();
    });

    afterEach(() => {
        vi.useRealTimers();
        WindowManager.destroy();
    });

    describe('Window Semantics & Focuser', () => {
        it('should move focus to first interactive element when window is shown', () => {
            const textarea = document.getElementById('notepad-textarea');

            // Initially focus is not on textarea
            expect(document.activeElement).not.toBe(textarea);

            // Open window via WindowManager
            WindowManager.open('win-notepad');

            // Active element should be the interactive textarea
            expect(document.activeElement).toBe(textarea);
        });

        it('should restore focus to desktop icon or body when window is closed', () => {
            const textarea = document.getElementById('notepad-textarea');
            const icon = document.querySelector('.icon[data-launch="notepad"]');

            WindowManager.open('win-notepad');
            expect(document.activeElement).toBe(textarea);

            // Close window
            WindowManager.close('win-notepad');

            // Focus should restore to the launch icon
            expect(document.activeElement).toBe(icon);
        });
    });

    describe('Alt+Tab switching', () => {
        it('should cycle focus between multiple open windows on Alt+Tab', () => {
            // Re-setup with 3 mock windows in DOM
            document.body.innerHTML = `
                <div id="desktop">
                    <div class="win95-window" id="win-1" style="display: flex; z-index: 100;">
                        <div class="window-header"><span>Win 1</span></div>
                        <button id="btn-1">Button 1</button>
                    </div>
                    <div class="win95-window" id="win-2" style="display: flex; z-index: 110;">
                        <div class="window-header"><span>Win 2</span></div>
                        <button id="btn-2">Button 2</button>
                    </div>
                    <div class="win95-window" id="win-3" style="display: flex; z-index: 120;">
                        <div class="window-header"><span>Win 3</span></div>
                        <button id="btn-3">Button 3</button>
                    </div>
                </div>
            `;

            // Setup mock implementation of WindowManager
            const mockActive = ['win-1', 'win-2', 'win-3'];
            const bringToFrontSpy = vi.spyOn(WindowManager, 'bringToFront');
            vi.spyOn(WindowManager, 'getActive').mockReturnValue(mockActive);

            // Let's manually focus button 2 inside win-2
            const btn2 = document.getElementById('btn-2');
            btn2.focus();
            expect(document.activeElement).toBe(btn2);

            // Dispatch Alt+Tab keydown event
            const altTabEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                altKey: true,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(altTabEvent);

            // Next window in order (from z-index 110 -> 120) should be win-3
            expect(bringToFrontSpy).toHaveBeenCalledWith(document.getElementById('win-3'));
        });
    });

    describe('Utils.announce', () => {
        it('should write message to announcer and clear it after timeout', () => {
            Utils.announce('Test announcement');
            const announcer = document.getElementById('a11y-announcer');

            expect(announcer.textContent).toBe('Test announcement');

            // Advance timers by 1 second
            vi.advanceTimersByTime(1000);

            // Should be cleared
            expect(announcer.textContent).toBe('');
        });
    });
});
