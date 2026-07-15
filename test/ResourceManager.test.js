import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResourceManager } from '../js/core/ResourceManager';
import { Services } from '../js/core/ServiceContainer';

describe('ResourceManager', () => {
    let manager;

    beforeEach(() => {
        manager = new ResourceManager();
    });

    it('should register resources and return unregister callback', () => {
        const resource = { dispose: vi.fn() };
        const unregister = manager.register('owner1', 'webgl', resource);
        
        expect(manager.stats().total).toBe(1);
        expect(manager.stats().webgl).toBe(1);
        expect(manager.stats().owners).toBe(1);

        unregister();

        expect(manager.stats().total).toBe(0);
        expect(manager.stats().webgl).toBe(0);
        expect(manager.stats().owners).toBe(0);
    });

    it('should dispose resources in LIFO order on disposeOwner', () => {
        const log = [];
        const res1 = { dispose: () => log.push(1) };
        const res2 = { dispose: () => log.push(2) };

        manager.register('owner1', 'listener', res1);
        manager.register('owner1', 'listener', res2);

        manager.disposeOwner('owner1');

        expect(log).toEqual([2, 1]);
        expect(manager.stats().total).toBe(0);
    });

    it('should isolate errors in disposeOwner', () => {
        const log = [];
        const resErr = {
            dispose: () => {
                log.push('error');
                throw new Error('Test Error');
            }
        };
        const resGood = { dispose: () => log.push('good') };

        manager.register('owner1', 'other', resErr);
        manager.register('owner1', 'other', resGood);

        // Should not throw
        expect(() => manager.disposeOwner('owner1')).not.toThrow();
        expect(log).toEqual(['good', 'error']);
        expect(manager.stats().total).toBe(0);
    });

    it('should register as service in Services container', () => {
        const service = Services.get('ResourceManager');
        expect(service).toBeDefined();
        expect(typeof service.register).toBe('function');
    });
});
