import { Kernel } from '../core/Kernel.js';
import { Settings } from './Settings.js';

/**
 * Task Pilot — the system monitor. It is Settings opened on its taskmanager
 * category, but presented as its own app: its own name and icon in the title
 * bar and the taskbar.
 *
 * It used to be a "proxy" that launched a separate `settings` process and then
 * tried to kill itself — but the self-kill searched for its own process BEFORE
 * the kernel had registered it (registration happens after the constructor
 * returns), so it never died. The result was a zombie process whose windowId
 * (`win-taskmanager-proxy`) named a window that never existed: a phantom taskbar
 * button that could not be closed, and a singleton that refused to reopen. As a
 * real Settings subclass it has a real window, so closing it kills the right
 * process and reopening just works.
 */
export class TaskManager extends Settings {
    constructor() {
        super({
            category: 'taskmanager',
            windowTitle: 'Task Pilot',
            windowIcon: '📊',
        });
    }
}

Kernel.registerApp('taskmanager', TaskManager, {
    name: 'Task Pilot',
    icon: 'assets/icons/task_pilot.webp',
    description: 'System monitor and process manager.',
    singleton: true
});
