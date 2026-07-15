import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SessionManager } from '../js/core/SessionManager.js';
import { Kernel } from '../js/core/Kernel.js';
import { VFS } from '../js/core/VFS.js';

/**
 * Session capture/restore (Fase 5). Uses a tiny fake app that builds a window
 * with a known layout, so we can round-trip: launch -> capture -> save -> reset
 * -> restore -> assert the app is running again with its geometry re-applied.
 */
let seq = 0;
function makeFakeApp(appId, geometry = { left: 120, top: 80, width: 400, height: 300 }) {
    class FakeApp {
        constructor() {
            this.windowId = `win-${appId}-${++seq}`;
            const el = document.createElement('div');
            el.id = this.windowId;
            el.className = 'win95-window';
            el.style.cssText = `position:fixed;display:flex;left:${geometry.left}px;top:${geometry.top}px;width:${geometry.width}px;height:${geometry.height}px;`;
            document.body.appendChild(el);
        }
        terminate() { document.getElementById(this.windowId)?.remove(); }
    }
    Kernel.registerApp(appId, FakeApp, { name: appId, icon: '🧪' });
    return FakeApp;
}

describe('SessionManager (Fase 5)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        Kernel.__reset();
        SessionManager.__reset();
        document.body.innerHTML = '';
        seq = 0;
    });

    afterEach(() => { document.body.innerHTML = ''; });

    it('captures open windowed apps and their layout', () => {
        makeFakeApp('alpha', { left: 10, top: 20, width: 300, height: 200 });
        Kernel.launch('alpha');

        const state = SessionManager.capture();
        expect(state.version).toBe(1);
        expect(state.windows).toHaveLength(1);
        expect(state.windows[0].appId).toBe('alpha');
        expect(state.windows[0].geometry).toEqual({ left: 10, top: 20, width: 300, height: 200 });
        expect(state.windows[0].minimized).toBe(false);
    });

    it('skips worker/iframe child processes (only windowed apps are recorded)', () => {
        makeFakeApp('alpha');
        Kernel.launch('alpha');
        // A worker process is a child of its app; it must not be recorded.
        Kernel.spawnWorker('some-worker', { postMessage() {}, onMessage() {}, terminate() {} });

        const state = SessionManager.capture();
        expect(state.windows.map(w => w.appId)).toEqual(['alpha']);
    });

    it('persists the session to the VFS and reads it back', () => {
        makeFakeApp('alpha', { left: 5, top: 6, width: 100, height: 90 });
        Kernel.launch('alpha');

        SessionManager.saveNow();
        expect(VFS.readFile('C:\\WINDOWS\\SYSTEM\\session.json')).toContain('alpha');

        const read = SessionManager.read();
        expect(read.windows[0].geometry.left).toBe(5);
    });

    it('restores the saved apps and re-applies their geometry', async () => {
        makeFakeApp('alpha', { left: 33, top: 44, width: 500, height: 400 });
        Kernel.launch('alpha');
        SessionManager.saveNow();

        // Simulate a reload: processes and DOM are gone, the session file remains.
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        document.body.innerHTML = '';
        makeFakeApp('alpha', { left: 0, top: 0, width: 0, height: 0 }); // re-registered on boot

        const restored = await SessionManager.restore();
        expect(restored).toBe(1);

        const proc = Kernel.getRegistry().processes.find(p => p.appId === 'alpha');
        expect(proc).toBeDefined();
        const el = document.getElementById(proc.windowId);
        expect(el.style.left).toBe('33px');
        expect(el.style.top).toBe('44px');
        expect(el.style.width).toBe('500px');
        expect(el.style.height).toBe('400px');
    });

    it('restore is a no-op with no saved session', async () => {
        expect(await SessionManager.restore()).toBe(0);
    });

    it('ignores a corrupted or wrong-version session file', async () => {
        VFS.mkdir('C:\\WINDOWS', 'SYSTEM');
        VFS.writeFile('C:\\WINDOWS\\SYSTEM', 'session.json', '{ not json');
        expect(SessionManager.read()).toBeNull();

        VFS.writeFile('C:\\WINDOWS\\SYSTEM', 'session.json', JSON.stringify({ version: 99, windows: [] }));
        expect(SessionManager.read()).toBeNull();
        expect(await SessionManager.restore()).toBe(0);
    });

    it('skips apps that fail to relaunch instead of aborting the restore', async () => {
        makeFakeApp('alpha', { left: 1, top: 2, width: 10, height: 10 });
        Kernel.launch('alpha');
        SessionManager.saveNow();

        // Reload where 'alpha' is no longer registered (e.g. app removed).
        Kernel.__reset();
        document.body.innerHTML = '';
        expect(await SessionManager.restore()).toBe(0); // no throw
    });

    it('clear() removes the stored session', () => {
        makeFakeApp('alpha');
        Kernel.launch('alpha');
        SessionManager.saveNow();
        SessionManager.clear();
        expect(SessionManager.read()).toBeNull();
    });
});
