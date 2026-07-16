import { Utils } from '../js/utils';

declare global {
    interface Window {
        Utils: typeof Utils;
        CONFIG: HadOSConfig;
        Kernel: any;
        VFS: any;
        BootLoader: any;
        themeManager: any;
        audioManager: any;
        WindowManager: any;
        dispatchEvent(event: Event): boolean;
        CustomEvent: typeof CustomEvent;
    }

    var CONFIG: HadOSConfig;
    var Utils: typeof import('../js/utils').Utils;
    var VFS: any;
    var WindowManager: any;
    var BootLoader: any;
    var Kernel: any;

    interface HadOSConfig {
        APP: { readonly VERSION: string; readonly NAME: string; readonly LANGUAGE: string };
        DEBUG: {
            readonly ENABLED: boolean;
            readonly SKIP_INTRO: boolean;
            readonly LOG_EVENTS: boolean;
            readonly LOG_RAGDOLL: boolean;
            readonly LOG_AUDIO: boolean;
            readonly SHOW_PHYSICS_DEBUG: boolean;
        };
        TASKBAR: { readonly HEIGHT: number; readonly Z_INDEX: number };
        WINDOWS: {
            readonly Z_INDEX_BASE: number;
            readonly Z_INDEX_INCREMENT: number;
            readonly MAX_Z_INDEX: number;
            readonly DEFAULT_WIDTH: number;
            readonly DEFAULT_HEIGHT: number;
        };
        RAGDOLL: Record<string, number | boolean>;
        Z_INDEX: Record<string, number>;
        COLORS: Record<string, string>;
        AUDIO: {
            readonly ENABLED: boolean;
            readonly MASTER_VOLUME: number;
            readonly BLIP_DURATION: number;
            readonly BLIP_FREQUENCY_MIN: number;
            readonly BLIP_FREQUENCY_MAX: number;
        };
        PERFORMANCE: {
            readonly RESIZE_DEBOUNCE_MS: number;
            readonly SCROLL_DEBOUNCE_MS: number;
        };
    }
}
export {};
