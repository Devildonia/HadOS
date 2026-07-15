import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeManager } from '../js/core/ThemeManager.js';
import { Services } from '../js/core/ServiceContainer.js';

describe('ThemeManager', () => {
    let themeManager;

    beforeEach(() => {
        // Reset DOM and Mock Environment
        document.body.className = '';
        localStorage.clear();

        // Clear registry to avoid overlapping service issues
        Services.unregister('ShaderWallpaper');

        // Mock DOM elements that ThemeManager interacts with
        document.body.innerHTML = `
            <div id="start-menu-title"></div>
            <div id="welcome-text"></div>
        `;

        // Mock window.ShaderWallpaper
        window.ShaderWallpaper = {
            setFragmentShader: vi.fn()
        };
        Services.register('ShaderWallpaper', window.ShaderWallpaper);

        // Suppress console errors or missing icons warning during tests
        vi.spyOn(console, 'warn').mockImplementation(() => { });

        themeManager = new ThemeManager();
        // Since document is not "loading", constructor calls init() immediately
    });

    describe('Constructor & Init', () => {
        it('should load default theme if localStorage is empty', () => {
            expect(themeManager.currentTheme).toBe('win95');
            expect(document.body.classList.contains('theme-win95')).toBe(true);
        });

        it('should load theme from localStorage if present', () => {
            localStorage.setItem('os-theme', 'modern');
            const manager = new ThemeManager();
            expect(manager.currentTheme).toBe('modern');
            expect(document.body.classList.contains('theme-modern')).toBe(true);
        });
    });

    describe('applyTheme', () => {
        it('should fallback to win95 if themeName is invalid', () => {
            themeManager.applyTheme('non-existent-theme');
            expect(themeManager.currentTheme).toBe('win95');
            expect(document.body.classList.contains('theme-win95')).toBe(true);
            expect(document.body.classList.contains('theme-modern')).toBe(false);
        });

        it('should swap body CSS classes and persist to localStorage', () => {
            themeManager.applyTheme('modern');
            expect(document.body.classList.contains('theme-modern')).toBe(true);
            expect(document.body.classList.contains('theme-win95')).toBe(false);
            expect(localStorage.getItem('os-theme')).toBe('modern');

            // Swap back
            themeManager.applyTheme('win95');
            expect(document.body.classList.contains('theme-win95')).toBe(true);
            expect(document.body.classList.contains('theme-modern')).toBe(false);
            expect(localStorage.getItem('os-theme')).toBe('win95');
        });

        it('should call ShaderWallpaper.setFragmentShader', () => {
            themeManager.applyTheme('modern');
            expect(window.ShaderWallpaper.setFragmentShader).toHaveBeenCalledWith('modern');
        });

        it('should dispatch "themechanged" custom event', () => {
            const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

            // Mock swapIcons since it errors out if elements are missing from the test DOM
            const originalSwapIcons = themeManager.swapIcons;
            themeManager.swapIcons = vi.fn();

            themeManager.applyTheme('modern');

            expect(dispatchSpy).toHaveBeenCalled();
            // Check that it's a CustomEvent named 'themechanged' and it has theme 'modern'
            // We need to find the correct call because it also triggers on init() for win95
            const modernEventCall = dispatchSpy.mock.calls.find(call =>
                call[0].type === 'themechanged' && call[0].detail.theme === 'modern'
            );
            expect(modernEventCall).toBeDefined();
            expect(modernEventCall[0].detail.theme).toBe('modern');

            // Restore
            themeManager.swapIcons = originalSwapIcons;
            dispatchSpy.mockRestore();
        });

        it('should correctly mutate DOM text content for specific IDs', () => {
            const startMenuTitle = document.getElementById('start-menu-title');
            const welcomeText = document.getElementById('welcome-text');

            // Modern theme text
            themeManager.applyTheme('modern');
            expect(startMenuTitle.textContent).toBe('Windows UI');
            expect(welcomeText.textContent).toBe('Welcome to Windows UI App Center v1.6.7!');

            // Win95 theme text
            themeManager.applyTheme('win95');
            expect(startMenuTitle.textContent).toBe('Windows 95');
            expect(welcomeText.textContent).toBe('Welcome to Windows App Center v1.6.7!');
        });
    });
});
