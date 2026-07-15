import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import { WindowManager } from './WindowManager';
import { Kernel } from '../core/Kernel';
import type { IProcess } from '../core/Types';

export interface ITaskbarManager {
    init(): void;
    __test_update(process: IProcess): void;
    __test_remove(process: IProcess | { pid?: number, windowId?: string, appId?: string }): void;
}

const TaskbarManager: ITaskbarManager = (() => {
    'use strict';

    const containerId = 'taskbar-apps'; // We need to add this to index.html
    let container: HTMLElement | null = null;
    let listenersAttached = false;
    let onProcessStarted: ((e: Event) => void) | null = null;
    let onProcessStopped: ((e: Event) => void) | null = null;

    function init(): void {
        container = document.getElementById(containerId);
        if (!container) {
            // Create container if missing (migration)
            container = document.createElement('div');
            container.id = containerId;
            container.style.display = 'flex';
            container.style.gap = '2px';
            container.style.marginLeft = '5px';
            container.style.flex = '1';

            const startBtn = document.getElementById('start-button');
            if (startBtn) startBtn.after(container);
        }

        // Listen for Kernel events
        if (!listenersAttached && !onProcessStarted) {
            onProcessStarted = (e: Event) => update((e as CustomEvent<IProcess>).detail);
            window.addEventListener('kernel:process-started', onProcessStarted);
        }
        if (!listenersAttached && !onProcessStopped) {
            onProcessStopped = (e: Event) => remove((e as CustomEvent<IProcess>).detail);
            window.addEventListener('kernel:process-stopped', onProcessStopped);
        }

        listenersAttached = true;
        Utils.Logger.log('TaskbarManager: Initialized');
    }

    function update(process: IProcess): void {
        if (!process) return;
        if (!container) {
            return;
        }

        // Check if button already exists (by PID or WindowID)
        const existingPid = document.getElementById(`task-btn-${process.pid}`);
        const existingWin = Array.from(container.children).find((btn: Element) => (btn as HTMLElement).dataset.windowId === process.windowId);

        if (existingPid || existingWin) {
            Utils.Logger.log(`Taskbar: Skipping duplicate button for ${process.appId}`);
            return;
        }

        const btn = document.createElement('div');
        btn.id = `task-btn-${process.pid}`;
        btn.dataset.windowId = process.windowId || undefined; // Store windowId for duplicate checks
        btn.className = 'taskbar-button active';

        const appInfo = Kernel.getRegistry().apps[process.appId];
        // v3.1: Support for legacy windows (synthetic processes)
        let icon = appInfo ? (appInfo.metadata?.icon || '📦') : ((process as any).metadata?.icon || '📦');
        const name = appInfo ? (appInfo.metadata?.name || process.appId) : ((process as any).metadata?.name || process.appId);

        const iconSpan = document.createElement('span');
        iconSpan.className = 'task-icon';
        if (icon.includes('/') || icon.includes('.')) {
            const img = document.createElement('img');
            img.src = icon;
            img.style.cssText = 'width:16px; height:16px; object-fit:contain;';
            img.alt = '';
            iconSpan.appendChild(img);
        } else {
            iconSpan.textContent = icon;
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'task-name';
        nameSpan.textContent = name;

        btn.appendChild(iconSpan);
        btn.appendChild(nameSpan);

        btn.onclick = () => {
            if (!process.windowId) return;
            const win = document.getElementById(process.windowId);
            if (win) {
                if (win.style.display === 'none') {
                    WindowManager.open(process.windowId);
                } else {
                    WindowManager.bringToFront(win);
                }
            }
        };

        container.appendChild(btn);
    }

    function remove(process: IProcess | { pid?: number, windowId?: string, appId?: string }): void {
        // Find by PID
        let btn: HTMLElement | null = typeof process.pid === 'number' ? document.getElementById(`task-btn-${process.pid}`) : null;

        // Fallback: Find by windowId if PID doesn't match (crucial for legacy processes)
        if (!btn && process.windowId && container) {
            btn = Array.from(container.children).find((b: Element) => (b as HTMLElement).dataset.windowId === process.windowId) as HTMLElement | null;
        }

        if (btn) {
            Utils.Logger.log(`Taskbar: Removing button for ${process.appId || 'unknown'}`);
            btn.remove();
        } else {
            Utils.Logger.warn(`Taskbar: Could not find button to remove for PID ${process.pid}`);
        }
    }

    return {
        init,
        __test_update: update,
        __test_remove: remove
    };
})();

export { TaskbarManager };

if (typeof window !== 'undefined') {
    Services.register('TaskbarManager', TaskbarManager);
}
