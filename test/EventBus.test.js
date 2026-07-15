import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from '../js/core/EventBus.js';

describe('EventBus', () => {
    beforeEach(() => {
        EventBus.__reset();
    });

    describe('on / emit', () => {
        it('should call handler when event is emitted', () => {
            const handler = vi.fn();
            EventBus.on('test:event', handler);
            EventBus.emit('test:event', 'payload');

            expect(handler).toHaveBeenCalledWith('payload');
        });

        it('should support multiple handlers for same event', () => {
            const h1 = vi.fn();
            const h2 = vi.fn();

            EventBus.on('multi', h1);
            EventBus.on('multi', h2);
            EventBus.emit('multi', 42);

            expect(h1).toHaveBeenCalledWith(42);
            expect(h2).toHaveBeenCalledWith(42);
        });

        it('should pass multiple arguments to handlers', () => {
            const handler = vi.fn();
            EventBus.on('args', handler);
            EventBus.emit('args', 'a', 'b', 'c');

            expect(handler).toHaveBeenCalledWith('a', 'b', 'c');
        });

        it('should not throw if no handlers exist for event', () => {
            expect(() => EventBus.emit('nobody-listening')).not.toThrow();
        });

        it('should isolate errors in handlers without breaking others', () => {
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const bad = vi.fn(() => { throw new Error('boom'); });
            const good = vi.fn();

            EventBus.on('risky', bad);
            EventBus.on('risky', good);
            EventBus.emit('risky');

            expect(bad).toHaveBeenCalled();
            expect(good).toHaveBeenCalled();
            expect(errorSpy).toHaveBeenCalled();
            errorSpy.mockRestore();
        });
    });

    describe('off', () => {
        it('should unsubscribe a handler', () => {
            const handler = vi.fn();
            EventBus.on('removable', handler);
            EventBus.off('removable', handler);
            EventBus.emit('removable');

            expect(handler).not.toHaveBeenCalled();
        });

        it('should return unsubscribe function from on()', () => {
            const handler = vi.fn();
            const unsub = EventBus.on('auto-unsub', handler);

            unsub();
            EventBus.emit('auto-unsub');

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('once', () => {
        it('should fire handler only once', () => {
            const handler = vi.fn();
            EventBus.once('one-shot', handler);

            EventBus.emit('one-shot', 'first');
            EventBus.emit('one-shot', 'second');

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith('first');
        });
    });
});

