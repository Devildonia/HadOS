import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel.js';
import { Services } from '../js/core/ServiceContainer.js';

describe('Kernel', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Kernel.__reset();

        // Mock global dependencies
        global.VFS = { init: vi.fn() };
        global.WindowManager = { open: vi.fn() };
        global.Utils = global.Utils || { Logger: { log: vi.fn(), error: vi.fn() } };

        // Register mock in Services so Services.get('WindowManager') resolves
        Services.register('WindowManager', global.WindowManager);
    });

    describe('registerApp', () => {
        it('should register an app class with metadata', () => {
            class TestApp {}
            Kernel.registerApp('test', TestApp, { name: 'Test', icon: '📝' });

            const registry = Kernel.getRegistry();
            expect(registry.apps['test']).toBeDefined();
            expect(registry.apps['test'].appClass).toBe(TestApp);
            expect(registry.apps['test'].metadata.name).toBe('Test');
        });

        it('should register without metadata', () => {
            class Bare {}
            Kernel.registerApp('bare', Bare);
            expect(Kernel.getRegistry().apps['bare'].appClass).toBe(Bare);
        });

        it('should overwrite existing registration', () => {
            class V1 {}
            class V2 {}
            Kernel.registerApp('evolving', V1);
            Kernel.registerApp('evolving', V2);

            expect(Kernel.getRegistry().apps['evolving'].appClass).toBe(V2);
        });
    });

    describe('launch', () => {
        it('should create instance and return process', () => {
            class MockApp {
                constructor(params) {
                    this.params = params;
                    this.windowId = 'win-test';
                }
            }

            Kernel.registerApp('mock', MockApp);
            const proc = Kernel.launch('mock', { foo: 'bar' });

            expect(proc).not.toBeNull();
            expect(proc.appId).toBe('mock');
            expect(proc.instance instanceof MockApp).toBe(true);
            expect(proc.instance.params.foo).toBe('bar');
            expect(proc.status).toBe('running');
            expect(proc.windowId).toBe('win-test');
        });

        it('should auto-open window via WindowManager', () => {
            class WinApp { constructor() { this.windowId = 'win-auto'; } }
            Kernel.registerApp('winable', WinApp);
            Kernel.launch('winable');

            expect(global.WindowManager.open).toHaveBeenCalledWith('win-auto');
        });

        it('should dispatch kernel:process-started event', () => {
            class EvtApp { constructor() {} }
            Kernel.registerApp('evt', EvtApp);

            window.addEventListener = vi.fn();
            window.dispatchEvent = vi.fn();

            Kernel.launch('evt');
            expect(window.dispatchEvent).toHaveBeenCalled();

            const call = window.dispatchEvent.mock.calls[0][0];
            expect(call.type || call.constructor.name).toBeDefined();
        });

        it('should return null for unregistered app', () => {
            const result = Kernel.launch('ghost-app');
            expect(result).toBeNull();
        });

        it('should handle constructor errors gracefully', () => {
            class Broken {
                constructor() { throw new Error('Exploded'); }
            }
            Kernel.registerApp('broken', Broken);
            const result = Kernel.launch('broken');

            expect(result).toBeNull();
        });

        it('should assign sequential PIDs starting from 0', () => {
            class Simple { constructor() {} }
            Kernel.registerApp('s', Simple);

            const p1 = Kernel.launch('s');
            const p2 = Kernel.launch('s');
            const p3 = Kernel.launch('s');

            expect(p1.pid).toBe(0);
            expect(p2.pid).toBe(1);
            expect(p3.pid).toBe(2);
        });

        it('should increment active process count on launch', () => {
            class A { constructor() {} }
            Kernel.registerApp('a', A);

            expect(Kernel.getActiveCount()).toBe(0);
            Kernel.launch('a');
            expect(Kernel.getActiveCount()).toBe(1);
            Kernel.launch('a');
            expect(Kernel.getActiveCount()).toBe(2);
        });
    });

    describe('kill', () => {
        it('should terminate a running process', () => {
            class Killable {
                constructor() { this.terminateCalled = false; }
                terminate() { this.terminateCalled = true; }
            }

            Kernel.registerApp('killable', Killable);
            const proc = Kernel.launch('killable');

            const success = Kernel.kill(proc.pid);
            expect(success).toBe(true);
            expect(proc.status).toBe('terminated');
            expect(proc.instance.terminateCalled).toBe(true);
        });

        it('should return false for invalid PID', () => {
            expect(Kernel.kill(999)).toBe(false);
        });

        it('should work even without terminate method', () => {
            class NoTerminate { constructor() {} }
            Kernel.registerApp('nt', NoTerminate);
            const proc = Kernel.launch('nt');

            const success = Kernel.kill(proc.pid);
            expect(success).toBe(true);
            expect(proc.status).toBe('terminated');
        });

        it('should dispatch kernel:process-stopped event', () => {
            class Stoppable { constructor() {} }
            Kernel.registerApp('stop', Stoppable);
            const proc = Kernel.launch('stop');

            window.dispatchEvent = vi.fn();
            Kernel.kill(proc.pid);

            expect(window.dispatchEvent).toHaveBeenCalled();
        });

        // ── Sprint 2: Map-based process cleanup ──────────────────────────
        it('should remove process from Map after kill (no memory leak)', () => {
            class App { constructor() {} }
            Kernel.registerApp('app', App);

            const proc = Kernel.launch('app');
            expect(Kernel.getActiveCount()).toBe(1);
            expect(Kernel.getProcess(proc.pid)).toBeDefined();

            Kernel.kill(proc.pid);

            // Process must be gone from the Map
            expect(Kernel.getActiveCount()).toBe(0);
            expect(Kernel.getProcess(proc.pid)).toBeUndefined();
        });

        it('should only remove the killed process, leaving others intact', () => {
            class App { constructor() {} }
            Kernel.registerApp('app', App);

            const p1 = Kernel.launch('app');
            const p2 = Kernel.launch('app');
            const p3 = Kernel.launch('app');

            Kernel.kill(p2.pid);

            expect(Kernel.getActiveCount()).toBe(2);
            expect(Kernel.getProcess(p1.pid)).toBeDefined();
            expect(Kernel.getProcess(p2.pid)).toBeUndefined();  // removed
            expect(Kernel.getProcess(p3.pid)).toBeDefined();
        });

        it('should not accumulate processes over many launch/kill cycles', () => {
            class Cycled { constructor() {} }
            Kernel.registerApp('cycled', Cycled);

            for (let i = 0; i < 50; i++) {
                const proc = Kernel.launch('cycled');
                Kernel.kill(proc.pid);
            }

            // After 50 launch+kill cycles, zero active processes
            expect(Kernel.getActiveCount()).toBe(0);
        });
    });

    describe('init', () => {
        it('should call VFS.init without throwing', () => {
            expect(() => Kernel.init()).not.toThrow();
        });
    });

    describe('getRegistry', () => {
        it('should return processes as an array snapshot (not the live Map)', () => {
            class A { constructor() {} }
            Kernel.registerApp('a', A);
            Kernel.launch('a');

            const reg = Kernel.getRegistry();
            expect(Object.keys(reg.apps)).toContain('a');
            expect(Array.isArray(reg.processes)).toBe(true);
            expect(reg.processes.length).toBe(1);
        });
    });

    describe('getProcess', () => {
        it('should return a running process by PID', () => {
            class App { constructor() {} }
            Kernel.registerApp('app', App);
            const proc = Kernel.launch('app');

            expect(Kernel.getProcess(proc.pid)).toBe(proc);
        });

        it('should return undefined for unknown PID', () => {
            expect(Kernel.getProcess(9999)).toBeUndefined();
        });
    });

    describe('__reset', () => {
        it('should clear apps, processes and reset PID counter', () => {
            class A { constructor() {} }
            Kernel.registerApp('a', A);
            Kernel.launch('a');
            Kernel.__reset();

            expect(Kernel.getActiveCount()).toBe(0);
            expect(Object.keys(Kernel.getRegistry().apps)).toHaveLength(0);

            // PID counter resets to 0
            Kernel.registerApp('b', class { constructor() {} });
            const proc = Kernel.launch('b');
            expect(proc.pid).toBe(0);
        });
    });

    describe('launch — singleton dedup', () => {
        it('should return same pid when launching singleton app twice, and not increment active count', () => {
            const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
            class SingletonApp {
                get windowId() { return 'win-singleton'; }
            }
            Kernel.registerApp('singleton-app', SingletonApp, { name: 'Singleton', icon: '📝', singleton: true });

            const p1 = Kernel.launch('singleton-app');
            const p2 = Kernel.launch('singleton-app');

            expect(p1.pid).toBe(p2.pid);
            expect(Kernel.getActiveCount()).toBe(1);
            
            // Check process started event dispatched only once
            const startEvents = dispatchSpy.mock.calls.filter(call => call[0].type === 'kernel:process-started');
            expect(startEvents.length).toBe(1);
        });

        it('should launch separate instances for non-singleton apps', () => {
            class MultiApp {}
            Kernel.registerApp('multi-app', MultiApp, { name: 'Multi', icon: '📝', singleton: false });

            const p1 = Kernel.launch('multi-app');
            const p2 = Kernel.launch('multi-app');

            expect(p1.pid).not.toBe(p2.pid);
            expect(Kernel.getActiveCount()).toBe(2);
        });

        it('should invoke bringToFront on WindowManager on second launch of singleton', () => {
            const dummyElement = document.createElement('div');
            vi.spyOn(document, 'getElementById').mockReturnValue(dummyElement);
            global.WindowManager.bringToFront = vi.fn();

            class SingletonApp {
                get windowId() { return 'win-singleton-btf'; }
            }
            Kernel.registerApp('singleton-btf', SingletonApp, { name: 'Singleton BTF', icon: '📝', singleton: true });

            Kernel.launch('singleton-btf');
            Kernel.launch('singleton-btf');

            expect(global.WindowManager.bringToFront).toHaveBeenCalledWith(dummyElement);
        });

        it('should only have one running process to kill for a singleton app launched multiple times', () => {
            class SingletonApp {
                get windowId() { return 'win-singleton-kill'; }
            }
            Kernel.registerApp('singleton-kill', SingletonApp, { name: 'Singleton Kill', icon: '📝', singleton: true });

            const p1 = Kernel.launch('singleton-kill');
            const p2 = Kernel.launch('singleton-kill');
            const p3 = Kernel.launch('singleton-kill');

            expect(Kernel.getActiveCount()).toBe(1);

            Kernel.kill(p1.pid);
            expect(Kernel.getActiveCount()).toBe(0);
        });
    });
});

