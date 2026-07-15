/**
 * WINDOWS 95 APP CENTER - GENERIC WINDOW APP
 * Wrapper for simple window-based apps
 */
import { Kernel } from '../core/Kernel';
import { Ragdoll3DViewer } from './Ragdoll3DViewer';

let ragdollViewerBootstrapped = false;

export interface IGenericAppParams {
    windowId: string;
}

class GenericWindowApp {
    public windowId: string;

    constructor(params: IGenericAppParams) {
        this.windowId = params.windowId;
        // No init logic needed, Kernel opens the window
    }
}

// Generic windows
Kernel.registerApp('games-folder', class extends GenericWindowApp {
    constructor() { super({ windowId: 'win-games-folder' }); }
}, { name: 'Games', icon: '📂', singleton: true });

// Games folder registration remains here
