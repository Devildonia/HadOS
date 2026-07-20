/**
 * WINDOWS 95 APP CENTER - DISPLAY PROPERTIES APP
 * Redirection to Settings (Display panel)
 * Version: 2.0 (TypeScript)
 */

import { WindowApp } from '../core/WindowApp.js';
import { Kernel } from '../core/Kernel.js';

export class DisplayPropertiesApp extends WindowApp {
    public windowId: string = 'win-display-props';

    constructor() {
        super();
        Kernel.launch('settings', { category: 'display' });
        const proc = Kernel.getRegistry().processes.find(p => p.appId === 'display-props');
        if (proc) {
            Kernel.kill(proc.pid);
        }
    }
}

// Register with Kernel
Kernel.registerApp('display-props', DisplayPropertiesApp, {
    name: 'Display Properties',
    icon: 'assets/icons/Display.webp',
    singleton: true
});
