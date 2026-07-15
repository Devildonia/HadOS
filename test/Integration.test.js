import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Services } from '../js/core/ServiceContainer.js';
import { EventBus, Store } from '../js/core/EventBus.js';
import { Kernel } from '../js/core/Kernel.js';
import { VFS } from '../js/core/VFS.js';

/**
 * INTEGRATION TESTS
 * Verify that multiple modules work together correctly.
 * These go beyond unit tests to validate the contract between subsystems.
 */

describe('Integration: Kernel ↔ Services', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Services.__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        EventBus.__reset();
        Store.__reset();

        // Register Kernel in Services (as production does)
        Services.register('Kernel', Kernel);
    });

    it('should resolve Kernel from Services after registration', () => {
        const kernel = Services.get('Kernel');
        expect(kernel).toBe(Kernel);
        expect(typeof kernel.launch).toBe('function');
    });

    it('should support full app lifecycle: register → launch → kill', () => {
        class TestApp {
            constructor() { this.windowId = 'win-test'; this.alive = true; }
            terminate() { this.alive = false; }
        }

        Kernel.registerApp('test', TestApp, { name: 'Test', icon: '🧪' });
        const proc = Kernel.launch('test');

        expect(proc.status).toBe('running');
        expect(proc.instance.alive).toBe(true);
        expect(Kernel.getActiveCount()).toBe(1);

        Kernel.kill(proc.pid);
        expect(proc.instance.alive).toBe(false);
        expect(Kernel.getActiveCount()).toBe(0);
        expect(Kernel.getProcess(proc.pid)).toBeUndefined();
    });
});

describe('Integration: Store ↔ EventBus', () => {
    beforeEach(() => {
        EventBus.__reset();
        Store.__reset();
        localStorage.clear();
    });

    it('should emit change events through EventBus when Store value changes', () => {
        Store.init({ theme: 'win95' });

        const changes = [];
        EventBus.on('theme:changed', (newVal, oldVal) => {
            changes.push({ newVal, oldVal });
        });

        Store.set('theme', 'modern');
        Store.set('theme', 'win95');

        expect(changes).toEqual([
            { newVal: 'modern', oldVal: 'win95' },
            { newVal: 'win95', oldVal: 'modern' }
        ]);
    });

    it('should not emit when setting same value (dedup)', () => {
        Store.init({ count: 0 });
        const handler = vi.fn();
        EventBus.on('count:changed', handler);

        Store.set('count', 0);
        expect(handler).not.toHaveBeenCalled();

        Store.set('count', 1);
        expect(handler).toHaveBeenCalledTimes(1);
    });
});

describe('Integration: Services.whenReady (async boot ordering)', () => {
    beforeEach(() => {
        Services.__reset();
    });

    it('should fire callback when service is registered later', () => {
        const handler = vi.fn();

        // Request service BEFORE it's registered
        Services.whenReady('LateService', handler);
        expect(handler).not.toHaveBeenCalled();

        // Now register it
        const svc = { doStuff: () => 'done' };
        Services.register('LateService', svc);

        expect(handler).toHaveBeenCalledWith(svc);
    });

    it('should fire immediately if service already registered', () => {
        const svc = { ready: true };
        Services.register('EarlyService', svc);

        const handler = vi.fn();
        Services.whenReady('EarlyService', handler);

        expect(handler).toHaveBeenCalledWith(svc);
    });

    it('should handle multiple waiters for the same service', () => {
        const h1 = vi.fn();
        const h2 = vi.fn();
        const h3 = vi.fn();

        Services.whenReady('SharedDep', h1);
        Services.whenReady('SharedDep', h2);
        Services.whenReady('SharedDep', h3);

        const dep = { id: 42 };
        Services.register('SharedDep', dep);

        expect(h1).toHaveBeenCalledWith(dep);
        expect(h2).toHaveBeenCalledWith(dep);
        expect(h3).toHaveBeenCalledWith(dep);
    });
});

describe('Integration: Kernel process events → window.dispatchEvent', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Services.__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        Services.register('Kernel', Kernel);
    });

    it('should dispatch kernel:process-started on launch', () => {
        const spy = vi.spyOn(window, 'dispatchEvent');

        class App { constructor() { } }
        Kernel.registerApp('evt-test', App, { name: 'EvtTest', icon: '🔔' });
        Kernel.launch('evt-test');

        expect(spy).toHaveBeenCalled();
        const callArgs = spy.mock.calls.find(args => args[0].type === 'kernel:process-started');
        expect(callArgs).toBeDefined();
        const detail = callArgs[0].detail;
        expect(detail.appId).toBe('evt-test');
        expect(detail.status).toBe('running');

        window.removeEventListener('kernel:process-started', spy);
    });

    it('should dispatch kernel:process-stopped on kill', () => {
        const spy = vi.spyOn(window, 'dispatchEvent');

        class App { constructor() { } }
        Kernel.registerApp('evt-kill', App, { name: 'EvtKill', icon: '💀' });
        const proc = Kernel.launch('evt-kill');

        Kernel.kill(proc.pid);
        expect(spy).toHaveBeenCalled();
        const callArgs = spy.mock.calls.find(args => args[0].type === 'kernel:process-stopped');
        expect(callArgs).toBeDefined();
    });
});

describe('Integration: VFS ↔ Kernel', () => {
    beforeEach(() => {
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        localStorage.clear();
    });

    it('should initialize VFS when Kernel.init() is called', () => {
        // VFS.init() creates the root filesystem
        expect(() => Kernel.init()).not.toThrow();
    });
});

describe('Integration: Full app round-trip (register → launch → use → kill → re-launch)', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Services.__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        EventBus.__reset();

        Services.register('Kernel', Kernel);
        Services.register('WindowManager', { open: vi.fn(), close: vi.fn() });
    });

    it('should support full lifecycle with PIDs that never collide', () => {
        class CounterApp {
            constructor() { this.windowId = 'win-counter'; this.count = 0; }
            increment() { this.count++; }
            terminate() { this.count = -1; }
        }

        Kernel.registerApp('counter', CounterApp, { name: 'Counter', icon: '🔢' });

        // First session
        const p1 = Kernel.launch('counter');
        p1.instance.increment();
        p1.instance.increment();
        expect(p1.instance.count).toBe(2);

        Kernel.kill(p1.pid);
        expect(p1.instance.count).toBe(-1); // terminate was called
        expect(Kernel.getActiveCount()).toBe(0);

        // Second session — fresh instance, new PID
        const p2 = Kernel.launch('counter');
        expect(p2.pid).not.toBe(p1.pid); // PIDs never reuse
        expect(p2.instance.count).toBe(0); // fresh instance
        expect(Kernel.getActiveCount()).toBe(1);

        Kernel.kill(p2.pid);
        expect(Kernel.getActiveCount()).toBe(0);
    });

    it('should handle rapid launch/kill cycles without state corruption', () => {
        class QuickApp { constructor() { this.windowId = null; } }
        Kernel.registerApp('quick', QuickApp, { name: 'Quick', icon: '⚡' });

        const pids = new Set();
        for (let i = 0; i < 100; i++) {
            const proc = Kernel.launch('quick');
            expect(pids.has(proc.pid)).toBe(false); // No PID collision
            pids.add(proc.pid);
            Kernel.kill(proc.pid);
        }

        expect(Kernel.getActiveCount()).toBe(0);
        expect(pids.size).toBe(100);
    });
});

describe('Integration: Multiple services depending on each other', () => {
    beforeEach(() => {
        Services.__reset();
    });

    it('should allow services to discover each other via whenReady', () => {
        const initOrder = [];

        // Service A depends on Service B
        Services.whenReady('ServiceB', (b) => {
            initOrder.push(`A got B (value=${b.value})`);
            Services.register('ServiceA', { ready: true, bRef: b });
        });

        // Service B depends on nothing
        Services.register('ServiceB', { value: 42 });

        expect(initOrder).toEqual(['A got B (value=42)']);
        expect(Services.get('ServiceA').ready).toBe(true);
        expect(Services.get('ServiceA').bRef.value).toBe(42);
    });
});

describe('Integration: Kernel plugin system', () => {
    beforeEach(() => {
        Services.__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        Kernel.__reset();
    });

    it('should install a plugin and register it successfully in Kernel', () => {
        class MockPluginApp {
            constructor() {
                this.windowId = 'win-mock-plugin';
            }
        }
        const plugin = {
            id: 'mock-plugin',
            metadata: { name: 'Mock Plugin', icon: '🔌' },
            component: MockPluginApp,
            windowDef: {
                id: 'win-mock-plugin',
                title: 'Mock Plugin Window',
                body: '<div>Mock Plugin Content</div>'
            }
        };

        Kernel.installPlugin(plugin);

        const registry = Kernel.getRegistry();
        expect(registry.apps['mock-plugin']).toBeDefined();
        expect(registry.apps['mock-plugin'].metadata.name).toBe('Mock Plugin');

        // Check if dynamic window element was created on the desktop/DOM
        const winEl = document.getElementById('win-mock-plugin');
        expect(winEl).not.toBeNull();
        expect(winEl.querySelector('.window-header span').textContent).toContain('Mock Plugin Window');
    });
});

