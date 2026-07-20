import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskManager } from '../js/apps/TaskManager';
import { Services } from '../js/core/ServiceContainer';
import { Kernel } from '../js/core/Kernel';

describe('TaskManager', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        (Services as any).__reset();
        vi.spyOn(Kernel, 'launch').mockImplementation(() => ({} as any));
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['taskmanager']).toBeDefined();
    });

    it('should redirect to settings display tab and terminate', () => {
        const app = new TaskManager();
        expect(Kernel.launch).toHaveBeenCalledWith('settings', { category: 'taskmanager' });
    });
});
