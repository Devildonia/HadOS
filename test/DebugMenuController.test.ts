import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupDebugMenu, resetDebugMenuState } from '../js/core/DebugMenuController';

describe('DebugMenuController', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.restoreAllMocks();

        // Setup DOM
        document.body.innerHTML = `
            <div id="dialog-debug" style="display: none;"></div>
            <button id="btn-reset-desktop"></button>
        `;

        window.playBlip = vi.fn();
        window.openDialog = vi.fn();
        
        // Mock global location reload
        const mockReload = vi.fn();
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { reload: mockReload }
        });
    });

    afterEach(() => {
        resetDebugMenuState();
        vi.useRealTimers();
        document.body.innerHTML = '';
        delete window.playBlip;
        delete window.openDialog;
    });

    it('should open debug dialog on Ctrl+Alt+W keypress', () => {
        setupDebugMenu();
        const dialog = document.getElementById('dialog-debug')!;

        const event = new KeyboardEvent('keydown', {
            ctrlKey: true,
            altKey: true,
            key: 'w',
            cancelable: true
        });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

        document.dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(window.playBlip).toHaveBeenCalledWith(600);
        expect(window.openDialog).toHaveBeenCalledWith('dialog-debug');
        expect(dialog.style.display).toBe('block');
        expect(dialog.style.top).toBe('50%');
    });

    it('should reset desktop state when confirming reset', () => {
        setupDebugMenu();
        const btn = document.getElementById('btn-reset-desktop')!;
        
        // Mock localStorage
        localStorage.setItem('test-key', 'value');

        // Case 1: Cancel reset
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        btn.click();
        expect(localStorage.getItem('test-key')).toBe('value');
        expect(window.location.reload).not.toHaveBeenCalled();

        // Case 2: Confirm reset
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        btn.click();
        
        expect(localStorage.getItem('test-key')).toBeNull(); // Cleared
        expect(window.playBlip).toHaveBeenCalledWith(900);

        vi.advanceTimersByTime(200);
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('should remove event listeners and bindings on resetDebugMenuState', () => {
        setupDebugMenu();
        resetDebugMenuState();

        const dialog = document.getElementById('dialog-debug')!;
        const btn = document.getElementById('btn-reset-desktop')!;

        // 1. Dispatch keypress
        const event = new KeyboardEvent('keydown', {
            ctrlKey: true,
            altKey: true,
            key: 'w'
        });
        document.dispatchEvent(event);
        expect(dialog.style.display).toBe('none'); // Not opened

        // 2. Click button
        const confirmSpy = vi.spyOn(window, 'confirm');
        btn.click();
        expect(confirmSpy).not.toHaveBeenCalled();
    });
});
