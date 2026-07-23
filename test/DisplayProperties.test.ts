import { describe, it, expect } from 'vitest';
import { DisplayPropertiesApp } from '../js/apps/DisplayProperties';
import { Settings } from '../js/apps/Settings';
import { Kernel } from '../js/core/Kernel';

describe('DisplayPropertiesApp', () => {
    it('should register with the Kernel', () => {
        expect(Kernel.getRegistry().apps['display-props']).toBeDefined();
    });

    it('is a Settings subclass now, not a self-killing proxy', () => {
        expect(Object.getPrototypeOf(DisplayPropertiesApp.prototype)).toBe(Settings.prototype);
    });
});
