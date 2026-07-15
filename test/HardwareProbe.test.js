import { describe, it, expect, afterEach, vi } from 'vitest';
import { probeHardware } from '../js/core/HardwareProbe.js';

/**
 * The POST screen reports the real machine, so the probe has to cope with every
 * browser: Chromium hands over UA Client Hints and deviceMemory, Firefox and
 * Safari hand over neither, and privacy modes mask the GPU. None of that may
 * throw, hang, or invent a number.
 */

/** Installs a navigator/window property for one test, restoring it afterwards. */
const restores = [];
function stub(obj, prop, value) {
    const had = Object.prototype.hasOwnProperty.call(obj, prop);
    const original = Object.getOwnPropertyDescriptor(obj, prop);
    Object.defineProperty(obj, prop, { value, configurable: true, writable: true });
    restores.push(() => {
        if (had && original) Object.defineProperty(obj, prop, original);
        else delete obj[prop];
    });
}

afterEach(() => {
    while (restores.length) restores.pop()();
    vi.restoreAllMocks();
});

describe('HardwareProbe', () => {
    it('reports this machine rather than a fixed fantasy', async () => {
        const hw = await probeHardware();

        expect(hw.cpu).toContain(`${navigator.hardwareConcurrency} logical processors`);
        expect(hw.display).toContain(`${screen.width}x${screen.height}`);
        expect(hw.pointer).toBe('Mouse detected');
    });

    it('reads UA Client Hints when the browser offers them', async () => {
        stub(navigator, 'userAgentData', {
            platform: 'Windows',
            getHighEntropyValues: async () => ({
                architecture: 'x86', bitness: '64', platform: 'Windows', platformVersion: '15.0.0',
            }),
        });

        const hw = await probeHardware();

        expect(hw.cpu).toContain('x86-64');
        // Chromium reports Windows 11 as compatibility version 15, not "11".
        expect(hw.host).toBe('Windows 11 (15.0.0)');
    });

    it('maps the Windows 10 compatibility version correctly', async () => {
        stub(navigator, 'userAgentData', {
            getHighEntropyValues: async () => ({ platform: 'Windows', platformVersion: '10.0.0' }),
        });

        expect((await probeHardware()).host).toBe('Windows 10 (10.0.0)');
    });

    it('falls back gracefully where UA Client Hints do not exist', async () => {
        // Firefox / Safari shape: no userAgentData at all.
        stub(navigator, 'userAgentData', undefined);
        stub(navigator, 'platform', 'MacIntel');

        const hw = await probeHardware();

        expect(hw.host).toBe('MacIntel');
        expect(hw.cpu).toContain('logical processors');
    });

    it('says so plainly when memory is not reported, instead of guessing', async () => {
        stub(navigator, 'deviceMemory', undefined);
        expect((await probeHardware()).memory).toBe('Not reported');
    });

    it('renders reported memory in POST-style kilobytes', async () => {
        stub(navigator, 'deviceMemory', 8);
        expect((await probeHardware()).memory).toBe('8388608KB OK');
    });

    it('reports the storage quota when the browser exposes one', async () => {
        stub(navigator, 'storage', {
            estimate: async () => ({ quota: 2 * 1024 ** 3, usage: 50 * 1024 ** 2 }),
        });

        expect((await probeHardware()).storage).toBe('2.0GB quota, 50MB used');
    });

    it('survives a storage estimate that rejects', async () => {
        stub(navigator, 'storage', { estimate: async () => { throw new Error('denied'); } });
        expect((await probeHardware()).storage).toBe('Quota not reported');
    });

    it('never lets a hanging probe stall the boot', async () => {
        vi.useFakeTimers();
        stub(navigator, 'storage', { estimate: () => new Promise(() => { /* never settles */ }) });

        const pending = probeHardware(1500);
        await vi.advanceTimersByTimeAsync(1600);

        expect((await pending).storage).toBe('Quota not reported');
        vi.useRealTimers();
    });

    it('detects a touch digitizer', async () => {
        stub(navigator, 'maxTouchPoints', 10);
        expect((await probeHardware()).pointer).toBe('Touch digitizer (10 points)');
    });

    it('reports the network state', async () => {
        stub(navigator, 'onLine', false);
        expect((await probeHardware()).network).toBe('Offline');

        stub(navigator, 'onLine', true);
        stub(navigator, 'connection', { effectiveType: '4g', downlink: 10 });
        expect((await probeHardware()).network).toBe('Online (4G, ~10Mbps)');
    });

    it('says WebGL is unavailable rather than naming a card it cannot see', async () => {
        // jsdom has no WebGL — exactly the masked-GPU case.
        expect((await probeHardware()).gpu).toMatch(/None \(WebGL unavailable\)|Unknown/);
    });

    it('unwraps the ANGLE scaffolding around the adapter name', async () => {
        const gl = {
            getExtension: (name) => (name === 'WEBGL_debug_renderer_info' ? { UNMASKED_RENDERER_WEBGL: 37446 } : null),
            getParameter: () => 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)',
        };
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(gl);

        expect((await probeHardware()).gpu).toBe('NVIDIA GeForce RTX 4070');
    });

    it('passes through a plain renderer string untouched', async () => {
        const gl = {
            getExtension: () => null,
            getParameter: () => 'Apple M2 Pro',
        };
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(gl);

        expect((await probeHardware()).gpu).toBe('Apple M2 Pro');
    });
});
