import { Kernel } from './Kernel.js';
import { WindowManager } from '../ui/WindowManager.js';
import { VFS } from './VFS.js';
import { Utils } from '../utils.js';

/**
 * Bridge that lets sandboxed plugin iframes drive a curated slice of the
 * system (VFS writes, app launches, window close) via `postMessage`.
 *
 * SECURITY: plugin iframes run with a `null` (opaque) origin, so `event.origin`
 * cannot be trusted to gate messages. Instead we keep an allow-list of the
 * iframe *elements* we ourselves created for installed plugins and only accept
 * a message whose `event.source` matches one of their live `contentWindow`s.
 * This blocks arbitrary frames — notably the Internet Explorer browser iframe,
 * which loads untrusted third-party pages with `allow-scripts` — from reaching
 * the bridge. We compare the element's `contentWindow` at message time (rather
 * than caching the Window) so it stays correct across iframe reloads.
 */
export const PluginBridge = {
    _trustedFrames: new Set<HTMLIFrameElement>(),
    _initialized: false,

    /** Marks an iframe element as a trusted plugin surface. */
    registerPluginFrame(iframe: HTMLIFrameElement | null): void {
        if (iframe) this._trustedFrames.add(iframe);
    },

    /** Revokes trust for a plugin iframe (on uninstall / window destroy). */
    unregisterPluginFrame(iframe: HTMLIFrameElement | null): void {
        if (iframe) this._trustedFrames.delete(iframe);
    },

    /** True when `source` is the live content window of a trusted plugin iframe. */
    _isTrustedSource(source: MessageEventSource | null): boolean {
        if (!source) return false;
        let trusted = false;
        for (const frame of this._trustedFrames) {
            // Prune iframes that were removed from the DOM as we go.
            if (!frame.isConnected) {
                this._trustedFrames.delete(frame);
                continue;
            }
            if (frame.contentWindow === source) trusted = true;
        }
        return trusted;
    },

    init(): void {
        if (this._initialized) return;
        this._initialized = true;

        window.addEventListener('message', (event: MessageEvent) => {
            const data = event.data;
            if (!data || typeof data !== 'object') return;

            const { type, payload } = data;
            if (typeof type !== 'string' || !type.startsWith('plugin:')) return;

            // Reject any frame we did not create for an installed plugin.
            if (!this._isTrustedSource(event.source)) {
                Utils.Logger.warn(`[PluginBridge] Rejected ${type} from untrusted frame`);
                return;
            }

            Utils.Logger.log(`[PluginBridge] Message received: ${type}`, payload);

            try {
                switch (type) {
                    case 'plugin:close-window':
                        if (payload && typeof payload.windowId === 'string') {
                            WindowManager.close(payload.windowId);
                        }
                        break;
                    case 'plugin:launch-app':
                        if (payload && typeof payload.appId === 'string') {
                            Kernel.launch(payload.appId, payload.params || {});
                        }
                        break;
                    case 'plugin:vfs-write':
                        if (payload && typeof payload.path === 'string' && typeof payload.name === 'string' && typeof payload.content === 'string') {
                            VFS.writeFile(payload.path, payload.name, payload.content);
                            VFS.flushSync();
                        }
                        break;
                    case 'plugin:log':
                        if (payload && typeof payload.message === 'string') {
                            Utils.Logger.log(`[PluginLog] ${payload.message}`);
                        }
                        break;
                    default:
                        Utils.Logger.warn(`[PluginBridge] Unknown message type: ${type}`);
                }
            } catch (err) {
                Utils.Logger.error(`[PluginBridge] Error handling message ${type}:`, err);
            }
        });
        Utils.Logger.log('[PluginBridge] Sandbox message bridge initialized.');
    }
};
