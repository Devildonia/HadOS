/**
 * WINDOWS 95 APP CENTER - DISPLAY PROPERTIES
 * Settings opened on its display category, presented as its own app (own name
 * and icon). Was a broken self-killing proxy — see TaskManager for the full
 * story; as a real Settings subclass it closes and reopens correctly.
 */

import { Kernel } from '../core/Kernel.js';
import { Settings } from './Settings.js';

export class DisplayPropertiesApp extends Settings {
    constructor() {
        super({
            category: 'display',
            windowTitle: 'Display Properties',
            windowIcon: '🖥️',
        });
    }
}

Kernel.registerApp('display-props', DisplayPropertiesApp, {
    name: 'Display Properties',
    icon: 'assets/icons/Display.webp',
    singleton: true
});
