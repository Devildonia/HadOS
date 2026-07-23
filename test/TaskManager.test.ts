import { describe, it, expect } from 'vitest';
import { TaskManager } from '../js/apps/TaskManager';
import { Settings } from '../js/apps/Settings';
import { Kernel } from '../js/core/Kernel';

describe('TaskManager (Task Pilot)', () => {
    it('should register with the Kernel', () => {
        expect(Kernel.getRegistry().apps['taskmanager']).toBeDefined();
    });

    it('is a Settings subclass now, not a self-killing proxy', () => {
        // The old proxy launched a separate `settings` process and tried to kill
        // itself before it was registered — leaving a zombie. It is now a real
        // Settings subclass with its own window. (Behaviour with a real window is
        // pinned in ProxyAppsAndResize.test.ts.)
        expect(Object.getPrototypeOf(TaskManager.prototype)).toBe(Settings.prototype);
    });
});
