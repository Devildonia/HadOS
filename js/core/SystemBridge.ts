/**
 * WINDOWS 95 APP CENTER - SYSTEM BRIDGE
 * Minimal legacy bridge for remaining window.* consumers.
 */

import { Utils } from '../utils';
import { Services } from './ServiceContainer';
import { EventBus, createStateBridge } from './EventBus';
import { AudioManager } from '../audio/AudioManager';
import { i18n } from '../services/i18n';
import { openDialog, closeDialog } from './bridges/DialogBridge';
import { setWallpaper, setTaskbarColor, handleWallpaperUpload } from './bridges/DesktopBridge';

/**
 * Type defining the reactive state mapping bound to the legacy window interface.
 */
type LegacyStateBridge = {
    lang: string;
    screen: string;
    bootComplete: boolean;
    wallpaper: string;
    taskbarColor: string;
    [key: string]: unknown;
};

/**
 * Type defining the actions/functions bound to the legacy window interface for backward compatibility.
 */
type LegacyWindowActions = {
    playBlip?: (freq?: number) => void;
    openDialog?: (dialogId: string) => void;
    openWindow?: (id: string) => void;
    closeWindow?: (id: string) => void;
    closeDialog?: (dialogId: string) => void;
    handleShutdown?: () => void;
    setWallpaper?: (url: string, silent?: boolean) => void;
    setTaskbarColor?: (color: string, silent?: boolean) => void;
    handleWallpaperUpload?: (input: HTMLInputElement) => void;
    updateClock?: () => void;
};

/**
 * Type defining control and system instance references attached to the legacy window interface.
 */
type LegacyWindowFlags = {
    state?: LegacyStateBridge;
    __legacyWrappersInitialized?: boolean;
    __clockIntervalId?: number;
    AudioManager?: typeof AudioManager;
};

const legacyWindow = window as Window & LegacyWindowActions & LegacyWindowFlags;
const legacyWindowTarget = legacyWindow as Window & LegacyWindowActions & LegacyWindowFlags & Record<string, unknown>;

// ============================================
// 1. GLOBAL OS STATE (reactive via Store proxy)
// ============================================
/**
 * Initializes the global reactive state store bridge and loads localizations.
 */
export function initSystemState(): void {
    if (typeof createStateBridge === 'function') {
        legacyWindow.state = createStateBridge() as LegacyStateBridge;
        Utils.Logger.log("[SystemBridge] Reactive Store bridge active");
    } else {
        legacyWindow.state = {
            lang: 'en',
            screen: 'desktop',
            bootComplete: false,
            wallpaper: localStorage.getItem('desktop-wallpaper') || '',
            taskbarColor: localStorage.getItem('taskbar-color') || '#c0c0c0'
        };
        Utils.Logger.log("[SystemBridge] Using plain state (EventBus not loaded)");
    }

    // Initialize i18n
    i18n.init();
    if (legacyWindow.state) legacyWindow.state.lang = i18n.getLang();
}

// ============================================
// 2. AUDIO BRIDGE
// ============================================
/**
 * Binds the legacy `playBlip` system sound player helper to the global window object.
 */
export function initAudioBridge(): void {
    legacyWindow.playBlip = (freq: number = 800): void => {
        const isModern = getThemeManager()?.currentTheme === 'modern';
        if (isModern) return;

        const am = getAudioManager();
        if (am) {
            am.play('blip', { frequency: freq });
        }
    };
}

/**
 * Resolves the global ThemeManager service.
 */
function getThemeManager() {
    return Services.get('ThemeManager');
}

/**
 * Resolves the global AudioManager service without legacy fallback.
 */
function getAudioManager(): AudioManager | undefined {
    return Services.get('AudioManager') ?? undefined;
}

/**
 * Helper to bind a custom handler method to a legacy action name in the global window context.
 */
function bindLegacyAction<T extends unknown[]>(name: keyof LegacyWindowActions, handler: (...args: T) => void): void {
    (legacyWindowTarget as Record<string, unknown>)[name as string] = (...args: T): void => handler(...args);
}

/**
 * Sets the display style visibility of a dialog element.
 * @param dialogId ID of the dialog.
 * @param visible Boolean visibility state flag.
 */
function setDialogVisibility(dialogId: string, visible: boolean): void {
    const dialog = document.getElementById(dialogId);
    if (dialog) dialog.style.display = visible ? 'block' : 'none';
}

// ============================================
// 3. LEGACY WRAPPERS (decomposed sub-bridges)
// ============================================
/** Bridges service container modules (RagdollMemory, AudioManager) to legacy global window properties. */
function _bridgeServices(): void {
    const ragdollMemory = Services.get('RagdollMemory');
    if (ragdollMemory) {
        (legacyWindow as any).RagdollMemory = ragdollMemory;
    }

    const audioManager = Services.get('AudioManager');
    if (audioManager) {
        (legacyWindow as any).AudioManager = {
            getInstance: () => audioManager
        };
    }
}

/** Bridges desktop customization actions (wallpaper, taskbar color) to global window helpers. */
function _bridgeDesktop(): void {
    bindLegacyAction('setWallpaper', (url: string, silent: boolean = false): void => {
        setWallpaper(url, silent);
    });
    bindLegacyAction('setTaskbarColor', (color: string, silent: boolean = false): void => {
        setTaskbarColor(color, silent);
    });
    bindLegacyAction('handleWallpaperUpload', (input: HTMLInputElement): void => {
        handleWallpaperUpload(input);
    });
}

/** Bridges window management and dialog rendering operations to global window actions. */
function _bridgeWindows(): void {
    bindLegacyAction('openWindow', (id: string): void => {
        legacyWindow.playBlip?.();
        Services.get('WindowManager')?.open(id);
    });
    bindLegacyAction('closeWindow', (id: string): void => {
        legacyWindow.playBlip?.();
        Services.get('WindowManager')?.close(id);
    });

    bindLegacyAction('openDialog', (dialogId: string): void => {
        legacyWindow.playBlip?.();
        openDialog(dialogId);
    });
    bindLegacyAction('closeDialog', (dialogId: string): void => {
        legacyWindow.playBlip?.();
        closeDialog(dialogId);
    });
}

/** Bridges system shutdown routine execution and shutdown sound feedback. */
function _bridgeShutdown(): void {
    bindLegacyAction('handleShutdown', (): void => {
        const am = getAudioManager();
        if (am) {
            const isModernTheme = getThemeManager()?.currentTheme === 'modern';
            const shutdownSound = isModernTheme ? 'shutdown_modern' : 'shutdown';
            am.play(shutdownSound, { volume: 0.8 });
        } else {
            legacyWindow.playBlip?.();
        }

        const startMenu = document.getElementById('start-menu');
        if (startMenu) startMenu.style.display = 'none';

        setTimeout(() => {
            legacyWindow.openDialog?.('dialog-shutdown');
            setTimeout(() => location.reload(), 4000);
        }, 500);
    });
}

/** Bridges event bus actions to drive animations, skins, and emotional states for the 3D/2D Ragdoll companion. */
function _bridgeRagdollEvents(): void {
    EventBus.on('action:shutdown', () => {
        legacyWindow.handleShutdown?.();
    });

    EventBus.on('action:wallpaper-browse', () => {
        const upload = document.getElementById('wallpaper-upload');
        if (upload) upload.click();
    });

    // Ragdoll Skins
    EventBus.on('action:ragdoll-skin-standard', () => {
        EventBus.emit('ragdoll:action', 'skin-standard');
    });
    EventBus.on('action:ragdoll-skin-custom', () => {
        EventBus.emit('ragdoll:action', 'skin-custom');
    });

    // Ragdoll Animations
    ['dancing', 'moonwalk', 'backflip', 'jumping', 'waving', 'sitting', 'laughing', 'eating', 'crying', 'yawning'].forEach(anim => {
        EventBus.on(`action:ragdoll-anim-${anim}`, () => {
            const methodMap: Record<string, string> = {
                dancing: 'startDancing',
                moonwalk: 'startMoonwalk',
                backflip: 'startBackflip',
                jumping: 'startJumping',
                waving: 'startWaving',
                sitting: 'startSitting',
                laughing: 'startLaughing',
                eating: 'startEating',
                crying: 'startCrying',
                yawning: 'startYawning'
            };
            const method = methodMap[anim];
            if (method) {
                EventBus.emit('ragdoll:action', method);
            }
        });
    });

    // Ragdoll Emotions
    ['happy', 'neutral', 'sad', 'angry', 'panic', 'hurt'].forEach(emotion => {
        EventBus.on(`action:ragdoll-emotion-${emotion}`, () => {
            EventBus.emit('ragdoll:action', 'emotion', emotion);
        });
    });
}

/**
 * Initializes and wires all decomposed legacy global window bridges and event routing.
 */
export function initLegacyWrappers(): void {
    if (legacyWindow.__legacyWrappersInitialized) return;
    legacyWindow.__legacyWrappersInitialized = true;

    _bridgeServices();
    _bridgeDesktop();
    _bridgeWindows();
    _bridgeShutdown();
    _bridgeRagdollEvents();
}

// ============================================
// 4. CLOCK
// ============================================
/**
 * Starts the taskbar clock ticker interval, updating every second.
 */
export function initClock(): void {
    const existingInterval = legacyWindow.__clockIntervalId;
    if (typeof existingInterval === 'number') {
        clearInterval(existingInterval);
    }

    function updateClock(): void {
        const clock = document.getElementById('taskbar-clock');
        if (!clock) return;

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}`;
    }

    // Expose for legacy usage
    legacyWindow.updateClock = updateClock;

    updateClock();
    legacyWindow.__clockIntervalId = window.setInterval(updateClock, 1000);
}
