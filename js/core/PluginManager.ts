import type { IAppPlugin } from './Types.js';
import { Kernel } from './Kernel.js';
import { Utils } from '../utils.js';

export const PluginManager = {
    validatePlugin(plugin: IAppPlugin): { ok: boolean; error?: string } {
        if (!plugin || typeof plugin !== 'object') {
            return { ok: false, error: 'Plugin must be an object' };
        }

        if (!plugin.id || typeof plugin.id !== 'string' || !/^[a-z0-9-]+$/.test(plugin.id)) {
            return { ok: false, error: 'Plugin ID must be a non-empty string matching ^[a-z0-9-]+$' };
        }

        const registry = Kernel.getRegistry();
        if (registry.apps[plugin.id]) {
            return { ok: false, error: `App ID '${plugin.id}' is already registered` };
        }

        if (!plugin.metadata || typeof plugin.metadata !== 'object') {
            return { ok: false, error: 'Plugin metadata is missing or invalid' };
        }

        if (!plugin.metadata.name || typeof plugin.metadata.name !== 'string') {
            return { ok: false, error: 'Plugin metadata.name is required and must be a string' };
        }

        if (!plugin.metadata.icon || typeof plugin.metadata.icon !== 'string') {
            return { ok: false, error: 'Plugin metadata.icon is required and must be a string' };
        }

        if (typeof plugin.component !== 'function' && plugin.windowDef && typeof plugin.windowDef.src === 'string') {
            if (!plugin.windowDef.id) {
                (plugin.windowDef as any).id = `win-plugin-${plugin.id}`;
            }
            const winId = plugin.windowDef.id || `win-plugin-${plugin.id}`;
            (plugin as any).component = class DefaultIframeApp {
                public windowId: string = winId;
            };
        }

        if (typeof plugin.component !== 'function') {
            return { ok: false, error: 'Plugin component must be a constructor function' };
        }

        return { ok: true };
    }
};
