import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PluginBridge } from '../js/core/PluginBridge';
import { VFS } from '../js/core/VFS';
import { Kernel } from '../js/core/Kernel';
import { WindowManager } from '../js/ui/WindowManager';
import { Utils } from '../js/utils';

describe('PluginBridge trust boundary & event routing', () => {
    let messageHandler: ((event: any) => void) | null = null;

    beforeEach(async () => {
        localStorage.clear();
        (VFS as any).__reset();
        await VFS.init();
        (PluginBridge as any)._trustedFrames.clear();
        (PluginBridge as any)._initialized = false;

        // Capture the message event listener
        vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
            if (event === 'message') {
                messageHandler = handler as any;
            }
        });

        PluginBridge.init();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        (PluginBridge as any)._trustedFrames.clear();
        messageHandler = null;
    });

    function makeIframe() {
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        return iframe;
    }

    describe('Trust Checks', () => {
        it('trusts the contentWindow of a registered, connected plugin frame', () => {
            const plugin = makeIframe();
            PluginBridge.registerPluginFrame(plugin);
            expect((PluginBridge as any)._isTrustedSource(plugin.contentWindow)).toBe(true);
        });

        it('does NOT trust an unregistered frame (e.g. the IE browser iframe)', () => {
            const ie = makeIframe(); // never registered
            expect((PluginBridge as any)._isTrustedSource(ie.contentWindow)).toBe(false);
        });

        it('does NOT trust a null source', () => {
            expect((PluginBridge as any)._isTrustedSource(null)).toBe(false);
        });

        it('stops trusting (and prunes) a frame once removed from the DOM', () => {
            const plugin = makeIframe();
            PluginBridge.registerPluginFrame(plugin);
            const win = plugin.contentWindow;
            plugin.remove(); // detached → not connected
            expect((PluginBridge as any)._isTrustedSource(win)).toBe(false);
            expect((PluginBridge as any)._trustedFrames.has(plugin)).toBe(false); // pruned
        });

        it('allows unregistering a plugin frame explicitly', () => {
            const plugin = makeIframe();
            PluginBridge.registerPluginFrame(plugin);
            expect((PluginBridge as any)._isTrustedSource(plugin.contentWindow)).toBe(true);
            PluginBridge.unregisterPluginFrame(plugin);
            expect((PluginBridge as any)._isTrustedSource(plugin.contentWindow)).toBe(false);
        });

        it('should skip registration of null frame', () => {
            expect(() => PluginBridge.registerPluginFrame(null)).not.toThrow();
            expect(() => PluginBridge.unregisterPluginFrame(null)).not.toThrow();
        });

        it('should skip duplicate initialization', () => {
            (PluginBridge as any)._initialized = true;
            const spy = vi.spyOn(window, 'addEventListener');
            spy.mockClear();
            PluginBridge.init();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('Message Dispatch & Routing', () => {
        it('rejects messages from untrusted source', () => {
            const warnSpy = vi.spyOn(Utils.Logger, 'warn');
            const ie = makeIframe();
            
            messageHandler!({
                data: {
                    type: 'plugin:log',
                    payload: { message: 'hello' }
                },
                source: ie.contentWindow
            });
            
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Rejected plugin:log from untrusted frame'));
        });

        it('ignores messages without valid type', () => {
            vi.spyOn(PluginBridge as any, '_isTrustedSource').mockReturnValue(true);
            const logSpy = vi.spyOn(Utils.Logger, 'log');
            
            // Non-plugin type
            messageHandler!({
                data: { type: 'notplugin:log', payload: {} }
            });
            
            // Empty data
            messageHandler!({
                data: null
            });
            
            expect(logSpy).not.toHaveBeenCalled();
        });

        it('logs plugin warning for unknown message types', () => {
            vi.spyOn(PluginBridge as any, '_isTrustedSource').mockReturnValue(true);
            const warnSpy = vi.spyOn(Utils.Logger, 'warn');
            
            messageHandler!({
                data: { type: 'plugin:unknown-action', payload: {} }
            });

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown message type: plugin:unknown-action'));
        });

        it('handles plugin:close-window', () => {
            vi.spyOn(PluginBridge as any, '_isTrustedSource').mockReturnValue(true);
            const closeSpy = vi.spyOn(WindowManager, 'close').mockImplementation(() => {});

            messageHandler!({
                data: {
                    type: 'plugin:close-window',
                    payload: { windowId: 'win-test-plugin' }
                }
            });

            expect(closeSpy).toHaveBeenCalledWith('win-test-plugin');
        });

        it('handles plugin:launch-app', () => {
            vi.spyOn(PluginBridge as any, '_isTrustedSource').mockReturnValue(true);
            const launchSpy = vi.spyOn(Kernel, 'launch').mockResolvedValue(true as any);

            messageHandler!({
                data: {
                    type: 'plugin:launch-app',
                    payload: { appId: 'notepad', params: { file: 'test.txt' } }
                }
            });

            expect(launchSpy).toHaveBeenCalledWith('notepad', { file: 'test.txt' });
        });

        it('handles plugin:vfs-write', () => {
            vi.spyOn(PluginBridge as any, '_isTrustedSource').mockReturnValue(true);
            const writeSpy = vi.spyOn(VFS, 'writeFile');

            messageHandler!({
                data: {
                    type: 'plugin:vfs-write',
                    payload: { path: 'C:\\', name: 'plugin.txt', content: 'hello from plugin' }
                }
            });

            expect(writeSpy).toHaveBeenCalledWith('C:\\', 'plugin.txt', 'hello from plugin');
        });

        it('handles plugin:log', () => {
            vi.spyOn(PluginBridge as any, '_isTrustedSource').mockReturnValue(true);
            const logSpy = vi.spyOn(Utils.Logger, 'log');

            messageHandler!({
                data: {
                    type: 'plugin:log',
                    payload: { message: 'lorem ipsum' }
                }
            });

            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[PluginLog] lorem ipsum'));
        });

        it('handles exceptions in event loop gracefully', () => {
            vi.spyOn(PluginBridge as any, '_isTrustedSource').mockReturnValue(true);
            const errSpy = vi.spyOn(Utils.Logger, 'error').mockImplementation(() => {});
            
            vi.spyOn(VFS, 'writeFile').mockImplementation(() => {
                throw new Error('VFS Crash');
            });

            messageHandler!({
                data: {
                    type: 'plugin:vfs-write',
                    payload: { path: 'C:\\', name: 'a.txt', content: 'x' }
                }
            });

            expect(errSpy).toHaveBeenCalledWith(
                expect.stringContaining('Error handling message plugin:vfs-write:'),
                expect.any(Error)
            );
        });
    });
});
