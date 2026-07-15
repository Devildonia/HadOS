import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResourceManager } from '../js/core/ResourceManager.js';

// Regression guard for audit finding #2: the desktop 3D pet and the Ragdoll
// Workshop viewer register their WebGL contexts under DISTINCT owner keys, so
// disposing one window must never tear down the other's context. Previously a
// shared magic string ('ragdoll3d') meant closing the Workshop disposed the
// live desktop pet (and leaked the Workshop's own renderer).
describe('ResourceManager owner isolation (finding #2)', () => {
    let rm;

    beforeEach(() => {
        rm = new ResourceManager();
    });

    it('disposing one owner leaves another owner\'s WebGL context alive', () => {
        const petDispose = vi.fn();
        const viewerDispose = vi.fn();

        rm.register('ragdoll3d-desktop', 'webgl', { dispose: petDispose });
        rm.register('win-ragdoll-skins', 'webgl', { dispose: viewerDispose });

        expect(rm.stats().webgl).toBe(2);

        // Close the Workshop viewer only.
        rm.disposeOwner('win-ragdoll-skins');

        expect(viewerDispose).toHaveBeenCalledTimes(1);
        expect(petDispose).not.toHaveBeenCalled();      // desktop pet untouched
        expect(rm.stats().webgl).toBe(1);               // only the pet's context remains
    });

    it('disposes every resource of an owner (WebGL + listener) with no leak', () => {
        rm.register('win-ragdoll-skins', 'webgl', { dispose: vi.fn() });
        rm.register('win-ragdoll-skins', 'listener', { dispose: vi.fn() });

        expect(rm.stats().total).toBe(2);
        rm.disposeOwner('win-ragdoll-skins');
        expect(rm.stats().total).toBe(0);
        expect(rm.stats().webgl).toBe(0);
    });
});
