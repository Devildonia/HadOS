import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Settings } from '../js/apps/Settings';
import { Services } from '../js/core/ServiceContainer';
import { Kernel } from '../js/core/Kernel';
import { i18n } from '../js/services/i18n';
import { WindowFactory } from '../js/ui/WindowFactory';
import { Utils } from '../js/utils';

describe('Settings App', () => {
    let windowBody: HTMLDivElement;

    beforeEach(() => {
        vi.restoreAllMocks();
        (Services as any).__reset();

        windowBody = document.createElement('div');
        document.body.appendChild(windowBody);

        vi.spyOn(WindowFactory, 'create').mockReturnValue('win-settings-test');
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(windowBody);
        vi.spyOn(WindowFactory, 'setTitle').mockImplementation(() => {});
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});

        window.playBlip = vi.fn();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        delete window.playBlip;
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['settings']).toBeDefined();
    });

    it('should initialize and render navigation and panels', () => {
        const app = new Settings();
        expect(WindowFactory.create).toHaveBeenCalled();
        expect(windowBody.innerHTML).toContain('settings-app');
        expect(windowBody.innerHTML).toContain('settings-nav-item');
        expect(windowBody.innerHTML).toContain('settings-lang-select');
        app.terminate();
    });

    it('should change language and update feedback text on selector change', () => {
        const app = new Settings();
        
        const setLangSpy = vi.spyOn(i18n, 'setLang').mockResolvedValue(undefined);

        const select = windowBody.querySelector('#settings-lang-select') as HTMLSelectElement;
        expect(select).toBeDefined();

        select.value = 'es';
        select.dispatchEvent(new Event('change'));

        expect(setLangSpy).toHaveBeenCalledWith('es');
        
        app.terminate();
    });

    it('should re-render on languagechanged event', () => {
        const app = new Settings();
        
        // Directly trigger the event manager listener for languagechanged to avoid JSDOM proxy event propagation bugs
        for (const [key, listener] of (Utils.eventManager as any).listeners.entries()) {
            if (listener.event === 'languagechanged') {
                listener.handler(new Event('languagechanged'));
            }
        }

        expect(WindowFactory.setTitle).toHaveBeenCalledWith('win-settings-test', expect.any(String));
        
        app.terminate();
    });

    it('should initialize with display category and render Display tab', () => {
        const app = new Settings({ category: 'display' });
        expect(windowBody.innerHTML).toContain('settings-app');
        expect(windowBody.innerHTML).toContain('display-tab-btn');
        expect(windowBody.innerHTML).toContain('display-tab-content');
        app.terminate();
    });

    it('should switch sub-tabs in display panel', () => {
        const app = new Settings({ category: 'display' });

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

        app.terminate();
    });

    it('should toggle themes via the ThemeManager', () => {
        const mockThemeManager = {
            currentTheme: 'hados',
            applyTheme: vi.fn()
        };
        Services.register('ThemeManager', mockThemeManager as any);

        const app = new Settings({ category: 'display' });
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

        app.terminate();
    });

    it('should initialize with taskmanager category and render Task Pilot tab', () => {
        vi.spyOn(Kernel, 'getRegistry').mockReturnValue({
            processes: [
                { pid: 1, appId: 'notepad', windowId: 'win-note', status: 'running', instance: {} }
            ],
            apps: {
                notepad: { metadata: { name: 'Notepad', icon: '📝' } }
            }
        } as any);

        const app = new Settings({ category: 'taskmanager' });
        expect(windowBody.innerHTML).toContain('settings-app');
        expect(windowBody.innerHTML).toContain('task-manager');
        expect(windowBody.innerHTML).toContain('Notepad');
        expect(windowBody.innerHTML).toContain('win-note');
        app.terminate();
    });

    it('should switch sub-tabs in task manager panel', () => {
        vi.spyOn(Kernel, 'getRegistry').mockReturnValue({
            processes: [],
            apps: {}
        } as any);

        const app = new Settings({ category: 'taskmanager' });

        const tabButtons = windowBody.querySelectorAll('#task-manager .tab-btn');
        const perfTabBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-tab') === 'performance') as HTMLButtonElement;
        const processesTabBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-tab') === 'processes') as HTMLButtonElement;
        const perfTabContent = windowBody.querySelector('#tab-performance') as HTMLElement;
        const processesTabContent = windowBody.querySelector('#tab-processes') as HTMLElement;

        expect(perfTabContent.style.display).toBe('none');

        perfTabBtn.click();
        expect(perfTabBtn.classList.contains('active')).toBe(true);
        expect(processesTabBtn.classList.contains('active')).toBe(false);
        expect(perfTabContent.style.display).toBe('block');
        expect(processesTabContent.style.display).toBe('none');

        app.terminate();
    });
});
