import { EventBus } from '../js/core/EventBus';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel';
import { Services } from '../js/core/ServiceContainer';

describe('Kernel', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        (Kernel as any).__reset();

        // Mock global dependencies
        (globalThis as any).VFS = { init: vi.fn() };
        (globalThis as any).WindowManager = { open: vi.fn() };
        (globalThis as any).Utils = (globalThis as any).Utils || { Logger: { log: vi.fn(), error: vi.fn() } };

        // Register mock in Services so Services.get('WindowManager') resolves
        Services.register('WindowManager', (globalThis as any).WindowManager);
    });

    describe('registerApp', () => {
        it('should register an app class with metadata', () => {
            class TestApp {}
            Kernel.registerApp('test', TestApp, { name: 'Test', icon: '📝' });

            const registry = Kernel.getRegistry();
            expect(registry.apps['test']).toBeDefined();
            expect(registry.apps['test']!.appClass).toBe(TestApp);
            expect(registry.apps['test']!.metadata.name).toBe('Test');
        });

        it('should register without metadata', () => {
            class Bare {}
            Kernel.registerApp('bare', Bare, { name: 'Bare', icon: '' });
            expect(Kernel.getRegistry().apps['bare']!.appClass).toBe(Bare);
        });

        it('should overwrite existing registration', () => {
            class V1 {}
            class V2 {}
            Kernel.registerApp('evolving', V1, { name: 'Evolving', icon: '' });
            Kernel.registerApp('evolving', V2, { name: 'Evolving', icon: '' });

            expect(Kernel.getRegistry().apps['evolving']!.appClass).toBe(V2);
        });
    });

    describe('launch', () => {
        it('should create instance and return process', () => {
            class MockApp {
                params: any;
                windowId = 'win-test';
                constructor(params: any) {
                    this.params = params;
                }
            }

            Kernel.registerApp('mock', MockApp, { name: 'Mock', icon: '' });
            const proc = Kernel.launch('mock', { foo: 'bar' });

            expect(proc).not.toBeNull();
            expect(proc!.appId).toBe('mock');
            expect(proc!.instance instanceof MockApp).toBe(true);
            expect((proc!.instance as MockApp).params.foo).toBe('bar');
            expect(proc!.status).toBe('running');
            expect(proc!.windowId).toBe('win-test');
        });

        it('should auto-open window via WindowManager', () => {
            class WinApp {
                windowId = 'win-auto';
            }
            Kernel.registerApp('winable', WinApp, { name: 'Winable', icon: '' });
            Kernel.launch('winable');

            expect((globalThis as any).WindowManager.open).toHaveBeenCalledWith('win-auto');
        });

        it('should emit kernel:process-started event on EventBus', () => {
            class EvtApp {}
            Kernel.registerApp('evt', EvtApp, { name: 'Evt', icon: '' });

            const listener = vi.fn();
            const unbind = EventBus.on('kernel:process-started', listener);

            Kernel.launch('evt');
            expect(listener).toHaveBeenCalled();
            unbind();
        });

        it('should return null for unregistered app', () => {
            const result = Kernel.launch('ghost-app');
            expect(result).toBeNull();
        });

        it('should handle constructor errors gracefully', () => {
            class Broken {
                constructor() { throw new Error('Exploded'); }
            }
            Kernel.registerApp('broken', Broken, { name: 'Broken', icon: '' });
            const result = Kernel.launch('broken');

            expect(result).toBeNull();
        });

        it('should assign sequential PIDs starting from 0', () => {
            class Simple {}
            Kernel.registerApp('s', Simple, { name: 'Simple', icon: '' });

            const p1 = Kernel.launch('s');
            const p2 = Kernel.launch('s');
            const p3 = Kernel.launch('s');

            expect(p1!.pid).toBe(0);
            expect(p2!.pid).toBe(1);
            expect(p3!.pid).toBe(2);
        });

        it('should increment active process count on launch', () => {
            class A {}
            Kernel.registerApp('a', A, { name: 'A', icon: '' });

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
                terminateCalled = false;
                terminate() { this.terminateCalled = true; }
            }

            Kernel.registerApp('killable', Killable, { name: 'Killable', icon: '' });
            const proc = Kernel.launch('killable');

            const success = Kernel.kill(proc!.pid);
            expect(success).toBe(true);
            expect(proc!.status).toBe('terminated');
            expect((proc!.instance as Killable).terminateCalled).toBe(true);
        });

        it('should return false for invalid PID', () => {
            expect(Kernel.kill(999)).toBe(false);
        });

        it('should work even without terminate method', () => {
            class NoTerminate {}
            Kernel.registerApp('nt', NoTerminate, { name: 'NT', icon: '' });
            const proc = Kernel.launch('nt');

            const success = Kernel.kill(proc!.pid);
            expect(success).toBe(true);
            expect(proc!.status).toBe('terminated');
        });

        it('should emit kernel:process-stopped event on EventBus', () => {
            class Stoppable {}
            Kernel.registerApp('stop', Stoppable, { name: 'Stop', icon: '' });
            const proc = Kernel.launch('stop');

            const listener = vi.fn();
            const unbind = EventBus.on('kernel:process-stopped', listener);
            Kernel.kill(proc!.pid);

            expect(listener).toHaveBeenCalled();
            unbind();
        });

        // ── Sprint 2: Map-based process cleanup ──────────────────────────
        it('should remove process from Map after kill (no memory leak)', () => {
            class App {}
            Kernel.registerApp('app', App, { name: 'App', icon: '' });

            const proc = Kernel.launch('app');
            expect(Kernel.getActiveCount()).toBe(1);
            expect(Kernel.getProcess(proc!.pid)).toBeDefined();

            Kernel.kill(proc!.pid);

            // Process must be gone from the Map
            expect(Kernel.getActiveCount()).toBe(0);
            expect(Kernel.getProcess(proc!.pid)).toBeUndefined();
        });

        it('should only remove the killed process, leaving others intact', () => {
            class App {}
            Kernel.registerApp('app', App, { name: 'App', icon: '' });

            const p1 = Kernel.launch('app');
            const p2 = Kernel.launch('app');
            const p3 = Kernel.launch('app');

            Kernel.kill(p2!.pid);

            expect(Kernel.getActiveCount()).toBe(2);
            expect(Kernel.getProcess(p1!.pid)).toBeDefined();
            expect(Kernel.getProcess(p2!.pid)).toBeUndefined();  // removed
            expect(Kernel.getProcess(p3!.pid)).toBeDefined();
        });

        it('should not accumulate processes over many launch/kill cycles', () => {
            class Cycled {}
            Kernel.registerApp('cycled', Cycled, { name: 'Cycled', icon: '' });

            for (let i = 0; i < 50; i++) {
                const proc = Kernel.launch('cycled');
                Kernel.kill(proc!.pid);
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
            class A {}
            Kernel.registerApp('a', A, { name: 'A', icon: '' });
            Kernel.launch('a');

            const reg = Kernel.getRegistry();
            expect(Object.keys(reg.apps)).toContain('a');
            expect(Array.isArray(reg.processes)).toBe(true);
            expect(reg.processes.length).toBe(1);
        });
    });

    describe('getProcess', () => {
        it('should return a running process by PID', () => {
            class App {}
            Kernel.registerApp('app', App, { name: 'App', icon: '' });
            const proc = Kernel.launch('app');

            expect(Kernel.getProcess(proc!.pid)).toBe(proc);
        });

        it('should return undefined for unknown PID', () => {
            expect(Kernel.getProcess(9999)).toBeUndefined();
        });
    });

    describe('__reset', () => {
        it('should clear apps, processes and reset PID counter', () => {
            class A {}
            Kernel.registerApp('a', A, { name: 'A', icon: '' });
            Kernel.launch('a');
            (Kernel as any).__reset();

            expect(Kernel.getActiveCount()).toBe(0);
            expect(Object.keys(Kernel.getRegistry().apps)).toHaveLength(0);

            // PID counter resets to 0
            Kernel.registerApp('b', class {}, { name: 'B', icon: '' });
            const proc = Kernel.launch('b');
            expect(proc!.pid).toBe(0);
        });
    });

    describe('launch — singleton dedup', () => {
        it('should return same pid when launching singleton app twice, and not increment active count', () => {
            const listener = vi.fn();
            const unbind = EventBus.on('kernel:process-started', listener);
            class SingletonApp {
                get windowId() { return 'win-singleton'; }
            }
            Kernel.registerApp('singleton-app', SingletonApp, { name: 'Singleton', icon: '📝', singleton: true });

            const p1 = Kernel.launch('singleton-app');
            const p2 = Kernel.launch('singleton-app');

            expect(p1!.pid).toBe(p2!.pid);
            expect(Kernel.getActiveCount()).toBe(1);
            
            // Check process started event emitted only once
            expect(listener).toHaveBeenCalledTimes(1);
            unbind();
        });

        it('should launch separate instances for non-singleton apps', () => {
            class MultiApp {}
            Kernel.registerApp('multi-app', MultiApp, { name: 'Multi', icon: '📝', singleton: false });

            const p1 = Kernel.launch('multi-app');
            const p2 = Kernel.launch('multi-app');

            expect(p1!.pid).not.toBe(p2!.pid);
            expect(Kernel.getActiveCount()).toBe(2);
        });

        it('should invoke bringToFront on WindowManager on second launch of singleton', () => {
            const dummyElement = document.createElement('div');
            vi.spyOn(document, 'getElementById').mockReturnValue(dummyElement);
            (globalThis as any).WindowManager.bringToFront = vi.fn();

            class SingletonApp {
                get windowId() { return 'win-singleton-btf'; }
            }
            Kernel.registerApp('singleton-btf', SingletonApp, { name: 'Singleton BTF', icon: '📝', singleton: true });

            Kernel.launch('singleton-btf');
            Kernel.launch('singleton-btf');

            expect((globalThis as any).WindowManager.bringToFront).toHaveBeenCalledWith(dummyElement);
        });

        it('should only have one running process to kill for a singleton app launched multiple times', () => {
            class SingletonApp {
                get windowId() { return 'win-singleton-kill'; }
            }
            Kernel.registerApp('singleton-kill', SingletonApp, { name: 'Singleton Kill', icon: '📝', singleton: true });

            const p1 = Kernel.launch('singleton-kill');
            Kernel.launch('singleton-kill');
            Kernel.launch('singleton-kill');

            expect(Kernel.getActiveCount()).toBe(1);

            Kernel.kill(p1!.pid);
            expect(Kernel.getActiveCount()).toBe(0);
        });
    });
});
