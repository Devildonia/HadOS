import type { IWindowsApp } from '../core/Types.js';
import { Kernel } from '../core/Kernel.js';

export class TaskManager implements IWindowsApp {
    public windowId: string = 'win-taskmanager-proxy';

    constructor() {
        Kernel.launch('settings', { category: 'taskmanager' });
        const proc = Kernel.getRegistry().processes.find(p => p.appId === 'taskmanager');
        if (proc) {
            Kernel.kill(proc.pid);
        }
    }

    public terminate(): void {}
}

// Auto-register
Kernel.registerApp('taskmanager', TaskManager, {
    name: 'Task Pilot',
    icon: '📊',
    description: 'System monitor and process manager.',
    singleton: true
});
