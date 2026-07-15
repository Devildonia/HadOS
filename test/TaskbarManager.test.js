import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskbarManager } from '../js/ui/TaskbarManager.js';
import { Services } from '../js/core/ServiceContainer.js';
import { Kernel } from '../js/core/Kernel.js';

describe('TaskbarManager', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Services.__reset();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));

        document.body.innerHTML = `
            <div id="taskbar">
                <button id="start-button">Start</button>
            </div>
        `;

        // Register a test app
        class TestApp {
            constructor() { this.windowId = 'win-test'; }
        }
        Kernel.registerApp('test-app', TestApp, { name: 'Test App', icon: '📝' });

        // Register Kernel in window (TaskbarManager uses window.Kernel)
        window.Kernel = Kernel;
        Services.register('Kernel', Kernel);
        Services.register('WindowManager', {
            open: vi.fn(),
            bringToFront: vi.fn()
        });
    });

    describe('init', () => {
        it('should create taskbar-apps container if missing', () => {
            TaskbarManager.init();
            const container = document.getElementById('taskbar-apps');
            expect(container).not.toBeNull();
        });

        it('should not duplicate container on multiple inits', () => {
            TaskbarManager.init();
            const first = document.getElementById('taskbar-apps');
            // Second init should reuse
            TaskbarManager.init();
            expect(document.querySelectorAll('#taskbar-apps').length).toBe(1);
        });
    });

    describe('process lifecycle', () => {
        it('should add a button when process starts', () => {
            TaskbarManager.init();
            const process = {
                pid: 0,
                appId: 'test-app',
                windowId: 'win-test',
                status: 'running'
            };
            TaskbarManager.__test_update(process);
            const btn = document.getElementById('task-btn-0');
            expect(btn).not.toBeNull();
            expect(btn.textContent).toContain('Test App');
        });

        it('should remove button when process stops', () => {
            TaskbarManager.init();
            const process = { pid: 1, appId: 'test-app', windowId: 'win-test', status: 'running' };
            TaskbarManager.__test_update(process);
            expect(document.getElementById('task-btn-1')).not.toBeNull();

            TaskbarManager.__test_remove(process);
            expect(document.getElementById('task-btn-1')).toBeNull();
        });

        it('should not create duplicate buttons for same window', () => {
            TaskbarManager.init();
            const process = { pid: 2, appId: 'test-app', windowId: 'win-dup', status: 'running' };
            TaskbarManager.__test_update(process);
            TaskbarManager.__test_update(process);

            const container = document.getElementById('taskbar-apps');
            const btns = container.querySelectorAll('[data-window-id="win-dup"]');
            expect(btns.length).toBe(1);
        });
    });
});
