import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Store, EventBus, createStateBridge } from '../js/core/EventBus.js';

describe('Store (Reactive State)', () => {
    beforeEach(() => {
        Store.__reset();
        EventBus.__reset();
        localStorage.clear();
    });

    describe('init', () => {
        it('should initialize with default values', () => {
            Store.init({ lang: 'en', screen: 'desktop' });
            expect(Store.get('lang')).toBe('en');
            expect(Store.get('screen')).toBe('desktop');
        });

        it('should restore persisted wallpaper from localStorage', () => {
            localStorage.setItem('desktop-wallpaper', 'saved-bg.jpg');
            Store.init({ wallpaper: '' });
            expect(Store.get('wallpaper')).toBe('saved-bg.jpg');
        });

        it('should restore persisted taskbarColor from localStorage', () => {
            localStorage.setItem('taskbar-color', '"#ff0000"');
            Store.init({ taskbarColor: '#c0c0c0' });
            expect(Store.get('taskbarColor')).toBe('#ff0000');
        });

        it('should use defaults when nothing is persisted', () => {
            Store.init({ wallpaper: 'default.jpg' });
            expect(Store.get('wallpaper')).toBe('default.jpg');
        });
    });

    describe('get / set', () => {
        it('should store and retrieve values', () => {
            Store.init({});
            Store.set('foo', 'bar');
            expect(Store.get('foo')).toBe('bar');
        });

        it('should return fallback for missing keys', () => {
            Store.init({});
            expect(Store.get('missing', 42)).toBe(42);
        });

        it('should return undefined when no fallback given', () => {
            Store.init({});
            expect(Store.get('missing')).toBeUndefined();
        });
    });

    describe('reactivity — change events', () => {
        it('should emit key:changed event on set', () => {
            Store.init({});
            const handler = vi.fn();
            EventBus.on('theme:changed', handler);

            Store.set('theme', 'modern');
            expect(handler).toHaveBeenCalledWith('modern', undefined);
        });

        it('should emit store:changed generic event', () => {
            Store.init({});
            const handler = vi.fn();
            EventBus.on('store:changed', handler);

            Store.set('x', 123);
            expect(handler).toHaveBeenCalledWith('x', 123, undefined);
        });

        it('should pass old value in change event', () => {
            Store.init({});
            Store.set('count', 1);

            const handler = vi.fn();
            EventBus.on('count:changed', handler);
            Store.set('count', 2);

            expect(handler).toHaveBeenCalledWith(2, 1);
        });

        it('should NOT emit when value is unchanged (shallow compare)', () => {
            Store.init({});
            Store.set('stable', 'same');

            const handler = vi.fn();
            EventBus.on('stable:changed', handler);
            Store.set('stable', 'same');

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('persistence', () => {
        it('should auto-persist wallpaper to localStorage', () => {
            Store.init({ wallpaper: '' });
            Store.set('wallpaper', 'new-bg.jpg');
            expect(localStorage.getItem('desktop-wallpaper')).toBe('new-bg.jpg');
        });

        it('should auto-persist taskbarColor to localStorage', () => {
            Store.init({ taskbarColor: '#c0c0c0' });
            Store.set('taskbarColor', '#000080');
            const stored = localStorage.getItem('taskbar-color');
            expect(stored).toContain('#000080');
        });

        it('should NOT persist non-configured keys', () => {
            Store.init({});
            Store.set('tempValue', 'volatile');
            expect(localStorage.getItem('tempValue')).toBeNull();
        });
    });

    describe('has / getAll', () => {
        it('should report key existence', () => {
            Store.init({ a: 1 });
            expect(Store.has('a')).toBe(true);
            expect(Store.has('b')).toBe(false);
        });

        it('should return full state snapshot', () => {
            Store.init({ x: 10, y: 20 });
            const all = Store.getAll();
            expect(all.x).toBe(10);
            expect(all.y).toBe(20);
        });

        it('should return a copy, not live reference', () => {
            Store.init({ z: 'original' });
            const snap = Store.getAll();
            snap.z = 'mutated';
            expect(Store.get('z')).toBe('original');
        });
    });

    describe('State Bridge (Proxy)', () => {
        it('should create a proxy that reads from Store', () => {
            Store.init({ lang: 'en', screen: 'desktop', bootComplete: false, wallpaper: '', taskbarColor: '#c0c0c0' });
            const proxy = createStateBridge();
            expect(proxy.lang).toBe('en');
        });

        it('should proxy writes to Store.set', () => {
            Store.init({ lang: 'en', screen: 'desktop', bootComplete: false, wallpaper: '', taskbarColor: '#c0c0c0' });
            const proxy = createStateBridge();

            const handler = vi.fn();
            EventBus.on('screen:changed', handler);

            proxy.screen = 'boot';
            expect(Store.get('screen')).toBe('boot');
            expect(handler).toHaveBeenCalledWith('boot', 'desktop');
        });

        it('should support "in" operator', () => {
            Store.init({ lang: 'en', screen: 'desktop', bootComplete: false, wallpaper: '', taskbarColor: '#c0c0c0' });
            const proxy = createStateBridge();
            expect('lang' in proxy).toBe(true);
            expect('nonexistent' in proxy).toBe(false);
        });
    });
});
