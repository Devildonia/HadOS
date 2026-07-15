import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PluginManagerApp } from '../js/apps/PluginManagerApp';
import { Kernel } from '../js/core/Kernel';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('PluginManagerApp UI', () => {
    let mockBody;
    const windowId = 'win-pm-test';

    beforeEach(() => {
        mockBody = document.createElement('div');
        vi.spyOn(WindowFactory, 'create').mockReturnValue(windowId);
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(mockBody);
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});
        Kernel.__reset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should boot and list core apps with disabled uninstall buttons', () => {
        Kernel.registerApp('core-note', class {}, { name: 'Core Note', icon: '📝' });
        const app = new PluginManagerApp();

        const html = mockBody.innerHTML;
        expect(html).toContain('Core Note');
        expect(html).toContain('disabled');
        expect(html).toContain('core app');
        app.terminate();
    });

    it('should validate and install a new iframe plugin structure', () => {
        const app = new PluginManagerApp();
        const input = mockBody.querySelector('#pm-manifest-url');
        const installBtn = mockBody.querySelector('#pm-install-btn');

        input.value = JSON.stringify({
            id: 'my-ui-plugin',
            metadata: { name: 'My UI Plugin', icon: '🔌' },
            windowDef: { id: 'win-plug', src: '/plugins/my-ui-plugin/index.html' }
        });

        installBtn.click();

        const html = mockBody.innerHTML;
        expect(html).toContain('Successfully installed plugin');
        expect(html).toContain('My UI Plugin');
        expect(Kernel.getRegistry().apps['my-ui-plugin']).toBeDefined();
        app.terminate();
    });

    it('should enable uninstalling plugins from list', () => {
        Kernel.installPlugin({
            id: 'custom-plug',
            component: class { constructor() {} },
            metadata: { name: 'Custom Plug', icon: '🔌' }
        });

        const app = new PluginManagerApp();
        expect(mockBody.innerHTML).toContain('Custom Plug');

        const uninstallBtn = mockBody.querySelector('.pm-uninstall-btn');
        expect(uninstallBtn).toBeDefined();

        uninstallBtn.click();
        expect(Kernel.getRegistry().apps['custom-plug']).toBeUndefined();
        app.terminate();
    });
});
