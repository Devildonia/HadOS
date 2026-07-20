import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DisplayPropertiesApp } from '../js/apps/DisplayProperties';
import { Services } from '../js/core/ServiceContainer';
import { Kernel } from '../js/core/Kernel';

describe('DisplayPropertiesApp', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        (Services as any).__reset();
        vi.spyOn(Kernel, 'launch').mockImplementation(() => ({} as any));
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['display-props']).toBeDefined();
    });

    it('should redirect to settings display tab and terminate', () => {
        const app = new DisplayPropertiesApp();
        expect(Kernel.launch).toHaveBeenCalledWith('settings', { category: 'display' });
    });
});
