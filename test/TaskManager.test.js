import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TaskManager } from '../js/apps/TaskManager';
import { Kernel } from '../js/core/Kernel';
import { Services } from '../js/core/ServiceContainer';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('TaskManager', () => {
    let mockBody;
    let windowId = 'win-task-manager-test';

    beforeEach(() => {
        mockBody = document.createElement('div');
        vi.spyOn(WindowFactory, 'create').mockReturnValue(windowId);
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(mockBody);
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});
        vi.spyOn(Kernel, 'getRegistry').mockReturnValue({
            processes: [
                { pid: 1, appId: 'notepad', windowId: 'win-note', status: 'running', instance: {} }
            ],
            apps: {
                notepad: { metadata: { name: 'Notepad', icon: '📝' } }
            }
        });
        vi.spyOn(Kernel, 'kill').mockImplementation(() => true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize and render layout with processes list', () => {
        const tm = new TaskManager();

        expect(WindowFactory.create).toHaveBeenCalled();
        expect(mockBody.querySelector('#tm-process-list')).not.toBeNull();
        
        // Check if notepad process is listed
        const html = mockBody.innerHTML;
        expect(html).toContain('Notepad');
        expect(html).toContain('win-note');
        
        tm.terminate();
    });

    it('should kill process on End Task button click', () => {
        const tm = new TaskManager();
        const killBtn = mockBody.querySelector('.tm-kill-btn');
        expect(killBtn).toBeDefined();

        killBtn.click();
        expect(Kernel.kill).toHaveBeenCalledWith(1);

        tm.terminate();
    });
});
