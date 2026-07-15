import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Utils } from '../js/utils.js';

describe('Utils', () => {

    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();
    });

    // ============================================
    // LOGGER
    // ============================================
    describe('Logger', () => {
        it('should prefix all logs with [Win95]', () => {
            const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
            Utils.Logger.enabled = true;
            Utils.Logger.log('test message');
            expect(spy).toHaveBeenCalledWith('[Win95]', 'test message');
            spy.mockRestore();
        });

        it('should always show errors regardless of enabled flag', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            Utils.Logger.enabled = false;
            Utils.Logger.error('critical');
            expect(spy).toHaveBeenCalledWith('[Win95 ERROR]', 'critical');
            spy.mockRestore();
            Utils.Logger.enabled = true;
        });

        it('should suppress non-error logs when disabled', () => {
            const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
            Utils.Logger.enabled = false;
            Utils.Logger.log('hidden');
            Utils.Logger.info('hidden');
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
            Utils.Logger.enabled = true;
        });

        it('should have specialized loggers (game, ragdoll, audio, window)', () => {
            expect(typeof Utils.Logger.game).toBe('function');
            expect(typeof Utils.Logger.ragdoll).toBe('function');
            expect(typeof Utils.Logger.audio).toBe('function');
            expect(typeof Utils.Logger.window).toBe('function');
        });
    });

    // ============================================
    // HTML SANITIZATION
    // ============================================
    describe('escapeHTML', () => {
        it('should escape angle brackets', () => {
            const result = Utils.escapeHTML('<script>alert("xss")</script>');
            expect(result).not.toContain('<script>');
            expect(result).toContain('&lt;script&gt;');
        });

        it('should escape ampersands', () => {
            const result = Utils.escapeHTML('A & B');
            expect(result).toContain('&amp;');
        });

        it('should return empty string for non-string input', () => {
            expect(Utils.escapeHTML(null)).toBe('');
            expect(Utils.escapeHTML(undefined)).toBe('');
            expect(Utils.escapeHTML(42)).toBe('');
        });

        it('should handle empty string', () => {
            expect(Utils.escapeHTML('')).toBe('');
        });
    });

    describe('sanitizeHTML', () => {
        it('should remove script tags', () => {
            const result = Utils.sanitizeHTML('<div>safe</div><script>evil()</script>');
            expect(result).not.toContain('script');
            expect(result).toContain('safe');
        });

        it('should remove dangerous event handlers', () => {
            const result = Utils.sanitizeHTML('<img onclick="hack()" src="img.jpg">');
            expect(result).not.toContain('onclick');
        });

        it('should preserve safe HTML', () => {
            const safe = '<p>Hello <strong>world</strong></p>';
            const result = Utils.sanitizeHTML(safe);
            expect(result).toContain('<p>');
            expect(result).toContain('<strong>');
        });

        it('should return empty string for non-string input', () => {
            expect(Utils.sanitizeHTML(null)).toBe('');
            expect(Utils.sanitizeHTML(123)).toBe('');
        });
    });

    describe('sanitizePath', () => {
        it('should remove path traversal sequences', () => {
            const result = Utils.sanitizePath('../../etc/passwd');
            expect(result).not.toContain('..');
        });

        it('should replace filesystem-dangerous characters', () => {
            const result = Utils.sanitizePath('file<>:"/\\|?*name');
            expect(result).not.toMatch(/[<>:"\/\\|?*]/);
        });

        it('should truncate to 255 characters', () => {
            const long = 'a'.repeat(300);
            expect(Utils.sanitizePath(long).length).toBe(255);
        });

        it('should trim whitespace', () => {
            expect(Utils.sanitizePath('  hello  ')).toBe('hello');
        });

        it('should return empty string for non-string input', () => {
            expect(Utils.sanitizePath(null)).toBe('');
        });
    });

    // ============================================
    // DEBOUNCE / THROTTLE
    // ============================================
    describe('debounce', () => {
        it('should delay function execution', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const debounced = Utils.debounce(fn, 100);

            debounced();
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);
            expect(fn).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        it('should reset timer on subsequent calls', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const debounced = Utils.debounce(fn, 100);

            debounced();
            vi.advanceTimersByTime(50);
            debounced(); // reset
            vi.advanceTimersByTime(50);
            expect(fn).not.toHaveBeenCalled(); // still waiting

            vi.advanceTimersByTime(50);
            expect(fn).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });
    });

    describe('throttle', () => {
        it('should execute immediately on first call', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const throttled = Utils.throttle(fn, 100);

            throttled();
            expect(fn).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        it('should block subsequent calls within the interval', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const throttled = Utils.throttle(fn, 100);

            throttled();
            throttled();
            throttled();
            expect(fn).toHaveBeenCalledTimes(1);

            vi.advanceTimersByTime(100);
            throttled();
            expect(fn).toHaveBeenCalledTimes(2);
            vi.useRealTimers();
        });
    });

    // ============================================
    // DOM UTILITIES
    // ============================================
    describe('getElement', () => {
        it('should return element by ID', () => {
            document.body.innerHTML = '<div id="test-el">hello</div>';
            const el = Utils.getElement('test-el');
            expect(el).not.toBeNull();
            expect(el.textContent).toBe('hello');
        });

        it('should return null for non-existent element', () => {
            const el = Utils.getElement('does-not-exist');
            expect(el).toBeNull();
        });
    });

    describe('showElement / hideElement / toggleElement', () => {
        beforeEach(() => {
            document.body.innerHTML = '<div id="toggle-me" style="display:none;">content</div>';
        });

        it('should show a hidden element', () => {
            Utils.showElement('toggle-me');
            expect(document.getElementById('toggle-me').style.display).toBe('block');
        });

        it('should hide a visible element', () => {
            document.getElementById('toggle-me').style.display = 'block';
            Utils.hideElement('toggle-me');
            expect(document.getElementById('toggle-me').style.display).toBe('none');
        });

        it('should toggle visibility', () => {
            Utils.toggleElement('toggle-me'); // was none → block
            expect(document.getElementById('toggle-me').style.display).toBe('block');
            Utils.toggleElement('toggle-me'); // block → none
            expect(document.getElementById('toggle-me').style.display).toBe('none');
        });

        it('should return false for non-existent elements', () => {
            expect(Utils.showElement('ghost')).toBe(false);
            expect(Utils.hideElement('ghost')).toBe(false);
            expect(Utils.toggleElement('ghost')).toBe(false);
        });
    });

    // ============================================
    // RANDOM UTILITIES
    // ============================================
    describe('randomInt', () => {
        it('should return value within range (inclusive)', () => {
            for (let i = 0; i < 100; i++) {
                const val = Utils.randomInt(5, 10);
                expect(val).toBeGreaterThanOrEqual(5);
                expect(val).toBeLessThanOrEqual(10);
                expect(Number.isInteger(val)).toBe(true);
            }
        });
    });

    describe('randomFloat', () => {
        it('should return value within range', () => {
            for (let i = 0; i < 50; i++) {
                const val = Utils.randomFloat(0.0, 1.0);
                expect(val).toBeGreaterThanOrEqual(0.0);
                expect(val).toBeLessThanOrEqual(1.0);
            }
        });
    });

    describe('randomChoice', () => {
        it('should return an element from the array', () => {
            const arr = ['a', 'b', 'c'];
            for (let i = 0; i < 20; i++) {
                expect(arr).toContain(Utils.randomChoice(arr));
            }
        });

        it('should return null for empty array', () => {
            expect(Utils.randomChoice([])).toBeNull();
        });

        it('should return null for non-array input', () => {
            expect(Utils.randomChoice('not-array')).toBeNull();
            expect(Utils.randomChoice(null)).toBeNull();
        });
    });

    // ============================================
    // VALIDATION UTILITIES
    // ============================================
    describe('inRange', () => {
        it('should return true for values within range', () => {
            expect(Utils.inRange(5, 0, 10)).toBe(true);
            expect(Utils.inRange(0, 0, 10)).toBe(true);  // boundary
            expect(Utils.inRange(10, 0, 10)).toBe(true); // boundary
        });

        it('should return false for values outside range', () => {
            expect(Utils.inRange(-1, 0, 10)).toBe(false);
            expect(Utils.inRange(11, 0, 10)).toBe(false);
        });
    });

    describe('clamp', () => {
        it('should clamp values to range', () => {
            expect(Utils.clamp(15, 0, 10)).toBe(10);
            expect(Utils.clamp(-5, 0, 10)).toBe(0);
            expect(Utils.clamp(5, 0, 10)).toBe(5);
        });
    });

    describe('validateObject', () => {
        it('should return true when all required props exist', () => {
            expect(Utils.validateObject({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toBe(true);
        });

        it('should return false when a required prop is missing', () => {
            expect(Utils.validateObject({ a: 1 }, ['a', 'b'])).toBe(false);
        });

        it('should return false for null/non-objects', () => {
            expect(Utils.validateObject(null, ['a'])).toBe(false);
            expect(Utils.validateObject('string', ['a'])).toBe(false);
        });
    });

    // ============================================
    // STORAGE UTILITIES
    // ============================================
    describe('getStorage / setStorage / removeStorage', () => {
        it('should roundtrip JSON values', () => {
            Utils.setStorage('key1', { name: 'test', value: 42 });
            const result = Utils.getStorage('key1');
            expect(result).toEqual({ name: 'test', value: 42 });
        });

        it('should return default for missing keys', () => {
            expect(Utils.getStorage('nope', 'fallback')).toBe('fallback');
        });

        it('should remove keys', () => {
            Utils.setStorage('temp', 'data');
            Utils.removeStorage('temp');
            expect(Utils.getStorage('temp')).toBeNull();
        });

        it('should handle localStorage errors gracefully', () => {
            const original = localStorage.setItem;
            localStorage.setItem = vi.fn(() => { throw new Error('quota exceeded'); });
            expect(Utils.setStorage('fail', 'data')).toBe(false);
            localStorage.setItem = original;
        });
    });

    // ============================================
    // EVENT MANAGER
    // ============================================
    describe('EventManager', () => {
        it('should track and remove event listeners', () => {
            const el = document.createElement('div');
            const handler = vi.fn();

            Utils.eventManager.add(el, 'click', handler);
            expect(Utils.eventManager.count()).toBeGreaterThan(0);

            el.click();
            expect(handler).toHaveBeenCalledTimes(1);

            Utils.eventManager.remove(el, 'click', handler);
            el.click();
            expect(handler).toHaveBeenCalledTimes(1); // not called again
        });

        it('should remove all listeners at once', () => {
            const el = document.createElement('div');
            Utils.eventManager.add(el, 'click', vi.fn());
            Utils.eventManager.add(el, 'mouseover', vi.fn());

            const before = Utils.eventManager.count();
            Utils.eventManager.removeAll();
            expect(Utils.eventManager.count()).toBe(0);
            expect(before).toBeGreaterThan(0);
        });

        it('should replace duplicate listeners on same element/event/handler', () => {
            const el = document.createElement('div');
            const handler = vi.fn();

            Utils.eventManager.add(el, 'click', handler);
            Utils.eventManager.add(el, 'click', handler); // should replace
            el.click();
            expect(handler).toHaveBeenCalledTimes(1); // only once
        });
    });
});
