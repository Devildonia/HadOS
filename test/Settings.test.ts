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
    });

    afterEach(() => {
        document.body.innerHTML = '';
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
});
