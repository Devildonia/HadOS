import { Utils } from '../js/utils';

declare global {
    interface Window {
        Utils: typeof Utils;
        CONFIG: any;
        Kernel: any;
        VFS: any;
        BootLoader: any;
        themeManager: any; // Add more specific typing as we migrate
        audioManager: any;
    }
}
