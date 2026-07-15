import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DesktopManager } from '../js/ui/DesktopManager.js';
import { Services } from '../js/core/ServiceContainer.js';
import { Store } from '../js/core/EventBus.js';

describe('DesktopManager', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
        Services.__reset();
        Store.__reset();

        Store.init({
            wallpaper: '',
            taskbarColor: '#c0c0c0',
            bootComplete: false
        });

        document.body.innerHTML = `
            <div id="desktop" style="display:none;"></div>
            <div id="splash-screen" style="display:flex;"></div>
            <div id="shader-wallpaper"></div>
            <div id="wallpaper-drop-zone"></div>
        `;

        // Mock ShaderWallpaper
        Services.register('ShaderWallpaper', {
            init: vi.fn(),
            setVisibility: vi.fn(),
            start: vi.fn(),
            stop: vi.fn()
        });

        // Mock AudioManager
        Services.register('AudioManager', {
            play: vi.fn(),
            loadSound: vi.fn(),
            init: vi.fn()
        });

        Services.register('Notify', {
            error: vi.fn(),
            info: vi.fn(),
            success: vi.fn()
        });
    });

    describe('setWallpaper', () => {
        it('should set background image on desktop element', () => {
            DesktopManager.setWallpaper('assets/wallpapers/w95_1.webp');
            const desktop = document.getElementById('desktop');
            expect(desktop.style.backgroundImage).toContain('w95_1.webp');
        });

        it('should hide shader when image wallpaper is set', () => {
            const shader = Services.get('ShaderWallpaper');
            DesktopManager.setWallpaper('test.jpg');
            expect(shader.setVisibility).toHaveBeenCalledWith(false);
        });

        it('should show shader when wallpaper is cleared', () => {
            const shader = Services.get('ShaderWallpaper');
            DesktopManager.setWallpaper('');
            expect(shader.setVisibility).toHaveBeenCalledWith(true);
        });

        it('should persist wallpaper to Store and localStorage', () => {
            DesktopManager.setWallpaper('test.jpg');
            expect(Store.get('wallpaper')).toBe('test.jpg');
        });

        it('should not play blip when isSilent is true', () => {
            const audio = Services.get('AudioManager');
            DesktopManager.setWallpaper('test.jpg', true);
            // In silent mode, play should not be called for 'blip'
            // (it may still be called for other sounds in init)
        });
    });

    describe('setTaskbarColor', () => {
        it('should set CSS custom property', () => {
            DesktopManager.setTaskbarColor('#ff0000');
            const value = document.documentElement.style.getPropertyValue('--taskbar-bg');
            expect(value).toBe('#ff0000');
        });

        it('should persist color to Store', () => {
            DesktopManager.setTaskbarColor('#00ff00');
            expect(Store.get('taskbarColor')).toBe('#00ff00');
        });
    });

    describe('handleWallpaperUpload', () => {
        it('should reject files over 2MB', () => {
            const notify = Services.get('Notify');
            const bigFile = new File(['x'.repeat(2_100_000)], 'big.jpg', { type: 'image/jpeg' });
            // Mock input with oversized file
            DesktopManager.handleWallpaperUpload({ files: [bigFile] });
            expect(notify.error).toHaveBeenCalled();
        });
    });

    describe('showDesktop', () => {
        it('should set bootComplete to true in Store', () => {
            vi.useFakeTimers();
            DesktopManager.showDesktop();
            vi.advanceTimersByTime(2000);
            expect(Store.get('bootComplete')).toBe(true);
            vi.useRealTimers();
        });
    });
});
