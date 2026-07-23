import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Services } from '../js/core/ServiceContainer';
import { EventBus, Store } from '../js/core/EventBus';
import { Kernel } from '../js/core/Kernel';
import { VFS } from '../js/core/VFS';

/**
 * INTEGRATION TESTS
 * Verify that multiple modules work together correctly.
 * These go beyond unit tests to validate the contract between subsystems.
 */

describe('Integration: Kernel ↔ Services', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        (Services as any).__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        (EventBus as any).__reset();
        (Store as any).__reset();

        // Register Kernel in Services (as production does)
        Services.register('Kernel', Kernel as any);
    });

    it('should resolve Kernel from Services after registration', () => {
        const kernel = Services.get('Kernel');
        expect(kernel).toBe(Kernel);
        expect(typeof (kernel as any).launch).toBe('function');
    });

    it('should support full app lifecycle: register → launch → kill', () => {
        class TestApp {
            windowId = 'win-test';
            alive = true;
            terminate() { this.alive = false; }
        }

        Kernel.registerApp('test', TestApp as any, { name: 'Test', icon: '🧪' });
        const proc = Kernel.launch('test')!;

        expect(proc.status).toBe('running');
        expect((proc.instance as any).alive).toBe(true);
        expect(Kernel.getActiveCount()).toBe(1);

        Kernel.kill(proc.pid);
        expect((proc.instance as any).alive).toBe(false);
        expect(Kernel.getActiveCount()).toBe(0);
        expect(Kernel.getProcess(proc.pid)).toBeUndefined();
    });
});

describe('Integration: Store ↔ EventBus', () => {
    beforeEach(() => {
        (EventBus as any).__reset();
        (Store as any).__reset();
        localStorage.clear();
    });

    it('should emit change events through EventBus when Store value changes', () => {
        Store.init({ theme: 'win95' });

        const changes: any[] = [];
        EventBus.on('theme:changed', (newVal: any, oldVal: any) => {
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
        (Services as any).__reset();
    });

    it('should fire callback when service is registered later', () => {
        const handler = vi.fn();

        // Request service BEFORE it's registered
        Services.whenReady('LateService', handler);
        expect(handler).not.toHaveBeenCalled();

        // Now register it
        const svc = { doStuff: () => 'done' };
        Services.register('LateService', svc as any);

        expect(handler).toHaveBeenCalledWith(svc);
    });

    it('should fire immediately if service already registered', () => {
        const svc = { ready: true };
        Services.register('EarlyService', svc as any);

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
        Services.register('SharedDep', dep as any);

        expect(h1).toHaveBeenCalledWith(dep);
        expect(h2).toHaveBeenCalledWith(dep);
        expect(h3).toHaveBeenCalledWith(dep);
    });
});

describe('Integration: Kernel process events → window.dispatchEvent', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        (Services as any).__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        Services.register('Kernel', Kernel as any);
    });

    it('should emit kernel:process-started on launch via EventBus', () => {
        const listener = vi.fn();
        const unbind = EventBus.on('kernel:process-started', listener);

        class App { constructor() { } }
        Kernel.registerApp('evt-test', App as any, { name: 'EvtTest', icon: '🔔' });
        Kernel.launch('evt-test');

        expect(listener).toHaveBeenCalled();
        const proc = listener.mock.calls[0]![0] as any;
        expect(proc.appId).toBe('evt-test');
        expect(proc.status).toBe('running');

        unbind();
    });

    it('should emit kernel:process-stopped on kill via EventBus', () => {
        const listener = vi.fn();
        const unbind = EventBus.on('kernel:process-stopped', listener);

        class App { constructor() { } }
        Kernel.registerApp('evt-kill', App as any, { name: 'EvtKill', icon: '💀' });
        const proc = Kernel.launch('evt-kill')!;

        Kernel.kill(proc.pid);
        expect(listener).toHaveBeenCalled();
        unbind();
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
        (Services as any).__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        (EventBus as any).__reset();

        Services.register('Kernel', Kernel as any);
        Services.register('WindowManager', { open: vi.fn(), close: vi.fn() } as any);
    });

    it('should support full lifecycle with PIDs that never collide', () => {
        class CounterApp {
            windowId = 'win-counter';
            count = 0;
            increment() { this.count++; }
            terminate() { this.count = -1; }
        }

        Kernel.registerApp('counter', CounterApp as any, { name: 'Counter', icon: '🔢' });

        // First session
        const p1 = Kernel.launch('counter')!;
        (p1.instance as any).increment();
        (p1.instance as any).increment();
        expect((p1.instance as any).count).toBe(2);

        Kernel.kill(p1.pid);
        expect((p1.instance as any).count).toBe(-1); // terminate was called
        expect(Kernel.getActiveCount()).toBe(0);

        // Second session — fresh instance, new PID
        const p2 = Kernel.launch('counter')!;
        expect(p2.pid).not.toBe(p1.pid); // PIDs never reuse
        expect((p2.instance as any).count).toBe(0); // fresh instance
        expect(Kernel.getActiveCount()).toBe(1);

        Kernel.kill(p2.pid);
        expect(Kernel.getActiveCount()).toBe(0);
    });

    it('should handle rapid launch/kill cycles without state corruption', () => {
        class QuickApp { windowId = null; }
        Kernel.registerApp('quick', QuickApp as any, { name: 'Quick', icon: '⚡' });

        const pids = new Set();
        for (let i = 0; i < 100; i++) {
            const proc = Kernel.launch('quick')!;
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
        (Services as any).__reset();
    });

    it('should allow services to discover each other via whenReady', () => {
        const initOrder: string[] = [];

        // Service A depends on Service B
        Services.whenReady('ServiceB', (b: any) => {
            initOrder.push(`A got B (value=${b.value})`);
            Services.register('ServiceA', { ready: true, bRef: b } as any);
        });

        // Service B depends on nothing
        Services.register('ServiceB', { value: 42 } as any);

        expect(initOrder).toEqual(['A got B (value=42)']);
        expect((Services.get('ServiceA') as any).ready).toBe(true);
        expect((Services.get('ServiceA') as any).bRef.value).toBe(42);
    });
});

describe('Integration: Kernel plugin system', () => {
    beforeEach(() => {
        (Services as any).__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        (Kernel as any).__reset();
    });

    it('should install a plugin and register it successfully in Kernel', () => {
        class MockPluginApp {
            windowId = 'win-mock-plugin';
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

        Kernel.installPlugin(plugin as any);

        const registry = Kernel.getRegistry();
        expect(registry.apps['mock-plugin']).toBeDefined();
        expect(registry.apps['mock-plugin']!.metadata.name).toBe('Mock Plugin');

        // Check if dynamic window element was created on the desktop/DOM
        const winEl = document.getElementById('win-mock-plugin')!;
        expect(winEl).not.toBeNull();
        expect(winEl.querySelector('.window-header span')!.textContent).toContain('Mock Plugin Window');
    });
});
