/**
 * WINDOWS 95 APP CENTER - SYSTEM BRIDGE
 * Minimal legacy bridge for remaining window.* consumers.
 */

import { Utils } from '../utils';
import { Services } from './ServiceContainer';
import { EventBus, createStateBridge } from './EventBus';
import { AudioManager } from '../audio/AudioManager';
import { i18n } from '../services/i18n';
import { updateRecycleBinUI } from './StickyNotesController';
import { setupDebugMenu } from './DebugMenuController';

const DIALOG_CONFIGS: Record<string, { title: string, html: string }> = {
    'dialog-mycomputer': {
        title: 'System Error',
        html: `
            <div class="dialog-content">
                <span class="dialog-icon">❌</span>
                <span class="dialog-message">Access Denied. Unauthorized User.</span>
            </div>
            <div class="dialog-buttons">
                <button class="win95-btn" data-close-dialog="dialog-mycomputer">OK</button>
            </div>
        `
    },
    'dialog-recyclebin': {
        title: 'Recycle Bin',
        html: `
            <div class="dialog-content">
                <span class="dialog-icon">🗑️</span>
                <span class="dialog-message">The Recycle Bin is empty.</span>
            </div>
            <div class="dialog-buttons">
                <button class="win95-btn" data-close-dialog="dialog-recyclebin">OK</button>
            </div>
        `
    },
    'dialog-shutdown': {
        title: 'Critical Error',
        html: `
            <div class="dialog-content">
                <span class="dialog-icon">❌</span>
                <span class="dialog-message">FATAL ERROR: System shutdown failed. Rebooting...</span>
            </div>
        `
    },
    'dialog-debug': {
        title: 'Debug Menu',
        html: `
            <div class="dialog-content" style="flex-direction: column; text-align: center; gap: 10px;">
                <span class="dialog-icon">⚠</span>
                <span class="dialog-message" style="width: 100%;">Debug Menu</span>
                <hr style="width: 100%; border-top: 1px solid #808080; border-bottom: 1px solid #fff;">
                <p>Restore the desktop to its initial state?</p>
                <p style="font-size: 11px; color: #555;">(All positions and settings will be deleted)</p>
            </div>
            <div class="dialog-buttons">
                <button class="win95-btn" id="btn-reset-desktop">Reset All</button>
                <button class="win95-btn" data-close-dialog="dialog-debug">Cancel</button>
            </div>
        `
    },
    'dialog-encryption': {
        title: 'Secrets File',
        html: `
            <div class="dialog-content">
                <span class="dialog-icon">🔒</span>
                <span class="dialog-message">This file is encrypted. Access denied.</span>
            </div>
            <div class="dialog-buttons">
                <button class="win95-btn" data-close-dialog="dialog-encryption">OK</button>
            </div>
        `
    }
};

function _ensureDialog(dialogId: string): void {
    if (document.getElementById(dialogId)) return;
    const config = DIALOG_CONFIGS[dialogId];
    if (!config) return;

    const dialog = document.createElement('div');
    dialog.className = 'win95-dialog';
    dialog.id = dialogId;
    dialog.style.display = 'none';
    if (dialogId === 'dialog-debug') {
        dialog.style.width = '300px';
        dialog.style.zIndex = '99999';
    }

    const showClose = dialogId !== 'dialog-shutdown';
    dialog.innerHTML = `
        <div class="window-header">
            <span>${config.title}</span>
            ${showClose ? `<button class="close-btn" data-close-dialog="${dialogId}">×</button>` : ''}
        </div>
        <div class="window-body">
            ${config.html}
        </div>
    `;

    document.getElementById('desktop')?.appendChild(dialog);

    if (dialogId === 'dialog-debug') {
        setupDebugMenu();
    }
}

type LegacyStateBridge = {
    lang: string;
    screen: string;
    bootComplete: boolean;
    wallpaper: string;
    taskbarColor: string;
    [key: string]: unknown;
};

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

type LegacyWindowFlags = {
    state?: LegacyStateBridge;
    familyData?: unknown;
    __legacyWrappersInitialized?: boolean;
    __clockIntervalId?: number;
    AudioManager?: typeof AudioManager;
};

const legacyWindow = window as Window & LegacyWindowActions & LegacyWindowFlags;
const legacyWindowTarget = legacyWindow as Window & LegacyWindowActions & LegacyWindowFlags & Record<string, unknown>;

// ============================================
// 1. GLOBAL OS STATE (reactive via Store proxy)
// ============================================
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

    legacyWindow.familyData = {
        parents: {
            mother: { name: 'Mary', status: 'alive', occupation: 'System Admin', stats: { happiness: 85, health: 90, intelligence: 80, money: 70, appearance: 75 } },
            father: { name: 'John', status: 'alive', occupation: 'Hardware Engineer', stats: { happiness: 80, health: 85, intelligence: 90, money: 80, appearance: 70 } }
        },
        heritageBonus: { intelligence: 5, appearance: 5, money: 100 }
    };
}

// ============================================
// 2. AUDIO BRIDGE
// ============================================
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

export function destroyAudioBridge(): void {
    delete legacyWindow.playBlip;
}

function getThemeManager() {
    return Services.get('ThemeManager');
}

function getAudioManager(): AudioManager | undefined {
    const serviceAudio = Services.get('AudioManager');
    if (serviceAudio) return serviceAudio;
    if (legacyWindow.AudioManager && typeof legacyWindow.AudioManager.getInstance === 'function') {
        return legacyWindow.AudioManager.getInstance();
    }
    return undefined;
}

function bindLegacyAction<T extends unknown[]>(name: keyof LegacyWindowActions, handler: (...args: T) => void): void {
    (legacyWindowTarget as Record<string, unknown>)[name as string] = (...args: T): void => handler(...args);
}

function setDialogVisibility(dialogId: string, visible: boolean): void {
    const dialog = document.getElementById(dialogId);
    if (dialog) dialog.style.display = visible ? 'block' : 'none';
}

export function destroyLegacyWrappers(): void {
    if (!legacyWindow.__legacyWrappersInitialized) return;

    ['setWallpaper', 'setTaskbarColor', 'handleWallpaperUpload', 'openWindow', 'closeWindow', 'openDialog', 'closeDialog', 'handleShutdown'].forEach((name) => {
        delete legacyWindowTarget[name as string];
    });

    delete (legacyWindow as any).RagdollMemory;
    delete (legacyWindow as any).AudioManager;

    legacyWindow.__legacyWrappersInitialized = false;
}

// ============================================
// 3. LEGACY WRAPPERS (for remaining HTML onclick handlers)
// ============================================
export function initLegacyWrappers(): void {
    if (legacyWindow.__legacyWrappersInitialized) return;
    legacyWindow.__legacyWrappersInitialized = true;

    // Bridge RagdollMemory for legacy Stickman.js/RagdollPet.js code
    const ragdollMemory = Services.get('RagdollMemory');
    if (ragdollMemory) {
        (legacyWindow as any).RagdollMemory = ragdollMemory;
    }

    // Bridge AudioManager for legacy games/code (like RagdollPet.js)
    const audioManager = Services.get('AudioManager');
    if (audioManager) {
        (legacyWindow as any).AudioManager = {
            getInstance: () => audioManager
        };
    }

    bindLegacyAction('setWallpaper', (url: string, silent: boolean = false): void => {
        Services.get('DesktopManager')?.setWallpaper(url, silent);
    });
    bindLegacyAction('setTaskbarColor', (color: string, silent: boolean = false): void => {
        Services.get('DesktopManager')?.setTaskbarColor(color, silent);
    });
    bindLegacyAction('handleWallpaperUpload', (input: HTMLInputElement): void => {
        Services.get('DesktopManager')?.handleWallpaperUpload(input);
    });

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
        _ensureDialog(dialogId);
        if (dialogId === 'dialog-recyclebin') {
            updateRecycleBinUI();
        }
        setDialogVisibility(dialogId, true);
    });
    bindLegacyAction('closeDialog', (dialogId: string): void => {
        legacyWindow.playBlip?.();
        setDialogVisibility(dialogId, false);
    });

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

    // --- DELEGATED ACTIONS VIA EVENTBUS ---
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

// ============================================
// 4. CLOCK
// ============================================
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

export function destroyClock(): void {
    const existingInterval = legacyWindow.__clockIntervalId;
    if (typeof existingInterval === 'number') {
        clearInterval(existingInterval);
        delete legacyWindow.__clockIntervalId;
    }
    delete legacyWindow.updateClock;
}
