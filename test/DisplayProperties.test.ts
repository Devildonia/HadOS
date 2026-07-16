import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DisplayPropertiesApp } from '../js/apps/DisplayProperties';
import { Services } from '../js/core/ServiceContainer';
import { Kernel } from '../js/core/Kernel';

describe('DisplayPropertiesApp', () => {
    let mockWindowFactory: any;
    let mockThemeManager: any;
    let windowBody: HTMLDivElement;

    beforeEach(() => {
        vi.restoreAllMocks();
        (Services as any).__reset();

        windowBody = document.createElement('div');
        document.body.appendChild(windowBody); // MUST append to document for querySelectorAll / getElementById to work
        
        mockWindowFactory = {
            create: vi.fn(),
            getBody: vi.fn().mockReturnValue(windowBody)
        };

        mockThemeManager = {
            currentTheme: 'hados',
            applyTheme: vi.fn()
        };

        Services.register('WindowFactory', mockWindowFactory);
        Services.register('ThemeManager', mockThemeManager);

        // Mock window functions
        window.playBlip = vi.fn();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        delete window.playBlip;
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['display-props']).toBeDefined();
    });

    it('should create the window and render HTML structure', () => {
        const app = new DisplayPropertiesApp();
        expect(mockWindowFactory.create).toHaveBeenCalledWith({
            id: 'win-display-props',
            title: 'Display Properties',
            width: 450,
            icon: '🖥️'
        });
        expect(windowBody.innerHTML).toContain('display-tab-btn');
        expect(windowBody.innerHTML).toContain('display-tab-content');
    });

    it('should switch tabs when clicking tab buttons', () => {
        const app = new DisplayPropertiesApp();

        const appearanceTabBtn = windowBody.querySelector('button[data-target="display-tab-appearance"]') as HTMLButtonElement;
        const backgroundTabBtn = windowBody.querySelector('button[data-target="display-tab-background"]') as HTMLButtonElement;
        const appearanceTabContent = windowBody.querySelector('#display-tab-appearance') as HTMLElement;
        const backgroundTabContent = windowBody.querySelector('#display-tab-background') as HTMLElement;

        expect(appearanceTabContent.style.display).toBe('none');

        // Click Appearance
        appearanceTabBtn.click();
        expect(appearanceTabBtn.classList.contains('active')).toBe(true);
        expect(backgroundTabBtn.classList.contains('active')).toBe(false);
        expect(appearanceTabContent.style.display).toBe('block');
        expect(backgroundTabContent.style.display).toBe('none');
        expect(window.playBlip).toHaveBeenCalledWith(900);

        // Click Background
        backgroundTabBtn.click();
        expect(backgroundTabBtn.classList.contains('active')).toBe(true);
        expect(appearanceTabContent.style.display).toBe('none');
    });

    it('should toggle themes via the ThemeManager', () => {
        const app = new DisplayPropertiesApp();
        const themeBtn = windowBody.querySelector('#theme-toggle') as HTMLButtonElement;
        
        // 1. Theme modern to hados
        mockThemeManager.currentTheme = 'modern';
        themeBtn.click();
        expect(mockThemeManager.applyTheme).toHaveBeenCalledWith('hados');
        expect(window.playBlip).toHaveBeenCalledWith(600);

        // 2. Theme hados to modern
        mockThemeManager.currentTheme = 'hados';
        themeBtn.click();
        expect(mockThemeManager.applyTheme).toHaveBeenCalledWith('modern');
    });
});
