import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Services } from '../js/core/ServiceContainer.js';
import { initEventDelegation } from '../js/core/EventDelegation.js';
import { EventBus } from '../js/core/EventBus.js';

describe('EventDelegation', () => {
    beforeEach(() => {
        Services.__reset();
        document.body.innerHTML = '<div id="desktop"></div>';
        // Reset any previous listeners by recreating the container
        // (in real env, initEventDelegation adds to document, which persists)
    });

    describe('data-launch (dblclick)', () => {
        it('should call Kernel.launch on dblclick of data-launch element', () => {
            const mockKernel = { launch: vi.fn() };
            Services.register('Kernel', mockKernel);

            document.body.innerHTML = `
                <div id="app-zone">
                    <div class="icon" data-launch="notepad">
                        <span>Notepad</span>
                    </div>
                </div>
            `;

            initEventDelegation();

            const icon = document.querySelector('[data-launch="notepad"]');
            icon.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

            expect(mockKernel.launch).toHaveBeenCalledWith('notepad');
        });

        it('should work when clicking a child element (bubbling)', () => {
            const mockKernel = { launch: vi.fn() };
            Services.register('Kernel', mockKernel);

            document.body.innerHTML = `
                <div data-launch="paint"><span class="label">Paint</span></div>
            `;

            initEventDelegation();

            const child = document.querySelector('.label');
            child.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

            expect(mockKernel.launch).toHaveBeenCalledWith('paint');
        });
    });

    describe('data-launch (click in start menu)', () => {
        it('should launch app and close start menu on single click', () => {
            const mockKernel = { launch: vi.fn() };
            Services.register('Kernel', mockKernel);

            document.body.innerHTML = `
                <div id="start-menu" style="display:block">
                    <div class="menu-item" data-launch="explorer">Explorer</div>
                </div>
            `;

            initEventDelegation();

            const menuItem = document.querySelector('[data-launch="explorer"]');
            menuItem.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(mockKernel.launch).toHaveBeenCalledWith('explorer');
            expect(document.getElementById('start-menu').style.display).toBe('none');
        });
    });

    describe('data-wallpaper', () => {
        it('should call DesktopManager.setWallpaper on click', () => {
            const mockDM = { setWallpaper: vi.fn() };
            Services.register('DesktopManager', mockDM);

            document.body.innerHTML = `
                <div data-wallpaper="assets/wallpapers/w95_1.webp">Mountain</div>
            `;

            initEventDelegation();

            document.querySelector('[data-wallpaper]').dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );

            expect(mockDM.setWallpaper).toHaveBeenCalledWith('assets/wallpapers/w95_1.webp');
        });

        it('should handle empty wallpaper (default shader)', () => {
            const mockDM = { setWallpaper: vi.fn() };
            Services.register('DesktopManager', mockDM);

            document.body.innerHTML = `<div data-wallpaper="">Default</div>`;
            initEventDelegation();

            document.querySelector('[data-wallpaper]').dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );

            expect(mockDM.setWallpaper).toHaveBeenCalledWith('');
        });
    });

    describe('data-close-dialog', () => {
        it('should hide the target dialog', () => {
            window.playBlip = vi.fn();

            document.body.innerHTML = `
                <div id="dialog-test" style="display:block">
                    <button data-close-dialog="dialog-test">OK</button>
                </div>
            `;

            initEventDelegation();

            document.querySelector('[data-close-dialog]').dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );

            expect(document.getElementById('dialog-test').style.display).toBe('none');
        });
    });

    describe('data-close-window', () => {
        it('should call WindowManager.close', () => {
            window.playBlip = vi.fn();
            const mockWM = { close: vi.fn() };
            Services.register('WindowManager', mockWM);

            document.body.innerHTML = `
                <button data-close-window="win-notepad">Close</button>
            `;

            initEventDelegation();

            document.querySelector('[data-close-window]').dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );

            expect(mockWM.close).toHaveBeenCalledWith('win-notepad');
        });
    });

    describe('data-action', () => {
        it('should emit action:shutdown for shutdown action', () => {
            const emitSpy = vi.spyOn(EventBus, 'emit');

            document.body.innerHTML = `
                <div data-action="shutdown">Shut Down</div>
            `;

            initEventDelegation();

            document.querySelector('[data-action]').dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );

            expect(emitSpy).toHaveBeenCalledWith('action:shutdown');
            emitSpy.mockRestore();
        });

        it('should emit action:hdr-toggle for hdr-toggle action', () => {
            const emitSpy = vi.spyOn(EventBus, 'emit');

            document.body.innerHTML = `
                <button data-action="hdr-toggle">HDR</button>
            `;

            initEventDelegation();

            document.querySelector('[data-action]').dispatchEvent(
                new MouseEvent('click', { bubbles: true })
            );

            expect(emitSpy).toHaveBeenCalledWith('action:hdr-toggle');
            emitSpy.mockRestore();
        });
    });
});
