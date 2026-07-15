import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Services } from '../js/core/ServiceContainer.js';

describe('ServiceContainer', () => {
    beforeEach(() => {
        Services.__reset();
    });

    describe('register & get', () => {
        it('should register and retrieve a service', () => {
            const mockService = { name: 'TestService', doWork: vi.fn() };
            Services.register('TestService', mockService);
            expect(Services.get('TestService')).toBe(mockService);
        });

        it('should return undefined for unregistered services', () => {
            expect(Services.get('NonExistent')).toBeUndefined();
        });

        it('should allow overwriting a service (with warning)', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const first = { v: 1 };
            const second = { v: 2 };

            Services.register('Svc', first);
            Services.register('Svc', second);

            expect(Services.get('Svc')).toBe(second);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('Overwriting'));
            warn.mockRestore();
        });
    });

    describe('has', () => {
        it('should return true for registered services', () => {
            Services.register('Exists', {});
            expect(Services.has('Exists')).toBe(true);
        });

        it('should return false for unregistered services', () => {
            expect(Services.has('Ghost')).toBe(false);
        });
    });

    describe('whenReady', () => {
        it('should fire immediately if service is already registered', () => {
            const callback = vi.fn();
            const svc = { ready: true };
            Services.register('EarlySvc', svc);

            Services.whenReady('EarlySvc', callback);
            expect(callback).toHaveBeenCalledWith(svc);
        });

        it('should defer callback until service is registered', () => {
            const callback = vi.fn();
            Services.whenReady('LateSvc', callback);

            expect(callback).not.toHaveBeenCalled();

            const svc = { late: true };
            Services.register('LateSvc', svc);

            expect(callback).toHaveBeenCalledWith(svc);
        });

        it('should support multiple callbacks for the same service', () => {
            const cb1 = vi.fn();
            const cb2 = vi.fn();

            Services.whenReady('Multi', cb1);
            Services.whenReady('Multi', cb2);

            Services.register('Multi', { id: 'multi' });

            expect(cb1).toHaveBeenCalledTimes(1);
            expect(cb2).toHaveBeenCalledTimes(1);
        });
    });

    describe('list', () => {
        it('should list all registered service names', () => {
            Services.register('A', {});
            Services.register('B', {});
            Services.register('C', {});

            const names = Services.list();
            expect(names).toContain('A');
            expect(names).toContain('B');
            expect(names).toContain('C');
            expect(names.length).toBe(3);
        });

        it('should return empty array when no services registered', () => {
            expect(Services.list()).toEqual([]);
        });
    });

    describe('unregister', () => {
        it('should remove a registered service and return true', () => {
            Services.register('ServiceToUnregister', { val: 123 });
            expect(Services.has('ServiceToUnregister')).toBe(true);

            const result = Services.unregister('ServiceToUnregister');
            expect(result).toBe(true);
            expect(Services.has('ServiceToUnregister')).toBe(false);
            expect(Services.get('ServiceToUnregister')).toBeUndefined();
        });

        it('should return false if service does not exist', () => {
            const result = Services.unregister('NonExistentService');
            expect(result).toBe(false);
        });
    });

    describe('__reset', () => {
        it('should clear all services and pending callbacks', () => {
            Services.register('Temp', {});
            const cb = vi.fn();
            Services.whenReady('Future', cb);

            Services.__reset();

            expect(Services.has('Temp')).toBe(false);
            expect(Services.list()).toEqual([]);
            // After reset, registering 'Future' should NOT fire old callback
            Services.register('Future', {});
            expect(cb).not.toHaveBeenCalled();
        });
    });
});
