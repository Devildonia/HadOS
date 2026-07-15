import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PluginManager } from '../js/core/PluginManager';
import { Kernel } from '../js/core/Kernel';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('PluginManager & Plugin API', () => {
    beforeEach(() => {
        Kernel.__reset();
        vi.spyOn(WindowFactory, 'create').mockReturnValue('win-mock');
        vi.spyOn(WindowFactory, 'createGameWindow').mockReturnValue('win-game-mock');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should validate valid plugins correctly', () => {
        const plugin = {
            id: 'my-plugin',
            component: class {},
            metadata: { name: 'My Plugin', icon: '🔌' }
        };

        const res = PluginManager.validatePlugin(plugin);
        expect(res.ok).toBe(true);
    });

    it('should reject invalid plugin IDs', () => {
        const plugin = {
            id: 'My_Plugin!',
            component: class {},
            metadata: { name: 'My Plugin', icon: '🔌' }
        };

        const res = PluginManager.validatePlugin(plugin);
        expect(res.ok).toBe(false);
        expect(res.error).toContain('Plugin ID must be a non-empty string');
    });

    it('should prevent installPlugin on validation failure', () => {
        const plugin = {
            id: 'invalid_id!',
            component: class {},
            metadata: { name: 'My Plugin', icon: '🔌' }
        };

        Kernel.installPlugin(plugin);
        expect(Kernel.getRegistry().apps['invalid_id!']).toBeUndefined();
    });

    it('should register and apply sandbox constraints to iframe plugins', () => {
        const plugin = {
            id: 'game-plugin',
            component: class {},
            metadata: { name: 'Game Plugin', icon: '🎮' },
            windowDef: { id: 'game-win', src: '/games/neon/index.html' }
        };

        Kernel.installPlugin(plugin);

        expect(Kernel.getRegistry().apps['game-plugin']).toBeDefined();
        expect(WindowFactory.createGameWindow).toHaveBeenCalledWith(
            expect.objectContaining({
                sandbox: 'allow-scripts allow-forms'
            })
        );
    });

    it('should uninstall plugins, kill processes, and dispatch event', () => {
        const plugin = {
            id: 'test-plugin',
            component: class {
                constructor() {
                    this.windowId = 'win-test';
                }
            },
            metadata: { name: 'Test Plugin', icon: '🧪' }
        };

        Kernel.installPlugin(plugin);
        
        // Launch process
        const process = Kernel.launch('test-plugin');
        expect(process).toBeDefined();
        expect(Kernel.getActiveCount()).toBe(1);

        // Detect if window.dispatchEvent was mocked by a previous test suite
        const isMock = vi.isMockFunction(window.dispatchEvent);
        const uninstallSpy = isMock ? window.dispatchEvent : vi.fn();

        if (!isMock) {
            window.addEventListener('kernel:plugin-uninstalled', uninstallSpy);
        }

        // Uninstall
        const uninstalled = Kernel.uninstallPlugin('test-plugin');
        expect(uninstalled).toBe(true);

        expect(Kernel.getActiveCount()).toBe(0);
        expect(Kernel.getRegistry().apps['test-plugin']).toBeUndefined();
        expect(uninstallSpy).toHaveBeenCalled();
        
        if (!isMock) {
            window.removeEventListener('kernel:plugin-uninstalled', uninstallSpy);
        }
    });
});
