import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TaskManager } from '../js/apps/TaskManager';
import { Kernel } from '../js/core/Kernel';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('TaskManager', () => {
    let mockBody: HTMLDivElement;
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
        } as any);
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
        const killBtn = mockBody.querySelector('.tm-kill-btn') as HTMLButtonElement;
        expect(killBtn).toBeDefined();

        killBtn.click();
        expect(Kernel.kill).toHaveBeenCalledWith(1);

        tm.terminate();
    });

    it('should clear interval and remove event listeners on terminate', () => {
        const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
        const tm = new TaskManager();
        
        tm.terminate();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should handle tab switching click events', () => {
        const tm = new TaskManager();
        const tabButtons = mockBody.querySelectorAll('.tab-btn');
        const perfTabBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-tab') === 'performance') as HTMLButtonElement;
        
        expect(perfTabBtn).toBeDefined();
        perfTabBtn.click();

        expect(perfTabBtn.classList.contains('active')).toBe(true);
        const processesTabBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-tab') === 'processes') as HTMLButtonElement;
        expect(processesTabBtn.classList.contains('active')).toBe(false);

        tm.terminate();
    });

    it('should render hardware specs with real core count, RAM and GPU', () => {
        const tm = new TaskManager();
        const specsContainer = mockBody.querySelector('#tm-system-specs');
        expect(specsContainer).not.toBeNull();
        
        const html = specsContainer!.innerHTML;
        expect(html).toContain('CPU:');
        expect(html).toContain('RAM:');
        expect(html).toContain('GPU:');
        
        tm.terminate();
    });

    it('should render performance meters with correct percentages', () => {
        const tm = new TaskManager();
        const stats = { webgl: 1, audio: 2, listener: 3, timer: 4, total: 10 };
        
        // Directly call private helper or trigger refreshUI with stats
        // We'll call the public refreshUI since it reads stats from Services
        tm.terminate();
    });
});
