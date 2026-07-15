import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PluginBridge } from '../js/core/PluginBridge.js';
import { VFS } from '../js/core/VFS.js';

// Regression guard for audit finding #1: the PluginBridge must only act on
// messages coming from iframes we explicitly trust (installed plugins), never
// from arbitrary frames such as the Internet Explorer browser iframe.
//
// NOTE: jsdom does not preserve `iframe.contentWindow === MessageEvent.source`
// identity (it wraps the source), whereas real browsers do. So the positive
// path is asserted directly against the trust predicate `_isTrustedSource`,
// and the end-to-end handler is exercised for the rejection paths.
describe('PluginBridge trust boundary (finding #1)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PluginBridge._trustedFrames.clear();
        PluginBridge._initialized = false;
        PluginBridge.init();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        PluginBridge._trustedFrames.clear();
        document.body.innerHTML = '';
    });

    function makeIframe() {
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        return iframe;
    }

    it('trusts the contentWindow of a registered, connected plugin frame', () => {
        const plugin = makeIframe();
        PluginBridge.registerPluginFrame(plugin);
        expect(PluginBridge._isTrustedSource(plugin.contentWindow)).toBe(true);
    });

    it('does NOT trust an unregistered frame (e.g. the IE browser iframe)', () => {
        const ie = makeIframe(); // never registered
        expect(PluginBridge._isTrustedSource(ie.contentWindow)).toBe(false);
    });

    it('does NOT trust a null source', () => {
        expect(PluginBridge._isTrustedSource(null)).toBe(false);
    });

    it('stops trusting (and prunes) a frame once removed from the DOM', () => {
        const plugin = makeIframe();
        PluginBridge.registerPluginFrame(plugin);
        const win = plugin.contentWindow;
        plugin.remove(); // detached → not connected
        expect(PluginBridge._isTrustedSource(win)).toBe(false);
        expect(PluginBridge._trustedFrames.has(plugin)).toBe(false); // pruned
    });

    it('end-to-end: rejects a vfs-write from an untrusted frame', () => {
        const ie = makeIframe();
        window.dispatchEvent(new MessageEvent('message', {
            data: {
                type: 'plugin:vfs-write',
                payload: { path: 'C:\\DOCUMENTS', name: 'pwned.txt', content: 'x' }
            },
            source: ie.contentWindow
        }));
        expect(VFS.resolve('C:\\DOCUMENTS\\pwned.txt')).toBeNull();
    });
});
