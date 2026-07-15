/**
 * WINDOWS 95 APP CENTER - OS CORE ENGINE
 * Single entry point for system initialization.
 * Version: 3.0 (ES Modules — Refactored)
 *
 * Responsibilities: boot sequence orchestration ONLY.
 * State, wrappers, and clock extracted to SystemBridge.js
 */

import { Utils } from '../utils';
import { Services } from './ServiceContainer';
import { Kernel } from './Kernel';
import { BootLoader } from './BootLoader';
import { HDRManager } from './HDRManager';
import { WindowManager } from '../ui/WindowManager';
import { DesktopManager } from '../ui/DesktopManager';
import { TaskbarManager } from '../ui/TaskbarManager';
import { TouchManager } from '../ui/TouchManager';
import { ShaderWallpaper } from '../ui/ShaderWallpaper';
import { AudioManager } from '../audio/AudioManager';
import { initEventDelegation } from './EventDelegation';
import { initSystemState, initAudioBridge, initLegacyWrappers, initClock } from './SystemBridge';
import { buildDynamicFolderWindows, buildDynamicGameWindows } from '../ui/WindowRegistry';

Utils.Logger.log("[OS_ENGINE] Module loaded");

let visibilityHandler: ((event: Event) => void) | null = null;
let themeSyncTimer: ReturnType<typeof setTimeout> | null = null;

// ============================================
// SYSTEM STATE & BRIDGES (must run at import time)
// ============================================
initSystemState();
initAudioBridge();
initLegacyWrappers();

// ============================================
// INITIALIZATION — SINGLE ENTRY POINT
// Order: Audio → Boot → Desktop → Kernel → UI → Events → Clock
// ============================================
let _booted = false;

window.initOS = function (): void {
    const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    if (_booted && !isTest) return;
    _booted = true;

    Utils.Logger.log("[INIT] ========================================");
    Utils.Logger.log("[INIT] OS v3.0 — Starting initialization...");
    Utils.Logger.log("[INIT] ========================================");

    const errors: Array<{ step: string, error: Error }> = [];

    /**
     * Error boundary: run a boot step, log and continue on failure.
     * @param {string} name - Step name for logging
     * @param {Function} fn - Step function
     */
    function bootStep(name: string, fn: () => void): void {
        try {
            fn();
            Utils.Logger.log(`[INIT] ✓ ${name}`);
        } catch (err: any) {
            errors.push({ step: name, error: err });
            console.error(`[INIT] ✗ ${name} FAILED:`, err);
        }
    }

    // 1. Audio system (must be first for boot sounds)
    bootStep('Audio System', () => {
        if (AudioManager) {
            AudioManager.getInstance().init();
            AudioManager.getInstance().loadSound('shutdown', 'assets/audio/w95_shutdown.opus');
            AudioManager.getInstance().loadSound('shutdown_modern', 'assets/themes/winui/audio/logoff_winui.opus');
        }
    });

    // 2. Boot sequence
    bootStep('Boot Sequence', () => {
        if (BootLoader) {
            BootLoader.init();
            BootLoader.start(() => {
                if (DesktopManager) DesktopManager.showDesktop();
            });
        }
    });

    // 3. Desktop (wallpaper, drag-drop, shader)
    bootStep('Desktop Manager', () => {
        if (DesktopManager) DesktopManager.init();
    });

    // 3.5 Dynamic Windows Creation
    bootStep('Window Registry Generation', () => {
        buildDynamicFolderWindows();
        buildDynamicGameWindows();
    });

    // 4. Core systems
    bootStep('Kernel', () => { if (Kernel) Kernel.init(); });
    bootStep('HDR Manager', () => { if (HDRManager) HDRManager.init(); });
    bootStep('Taskbar Manager', () => { if (TaskbarManager) TaskbarManager.init(); });

    // 5. Event listeners (legacy icon handlers, start menu, sticky notes)
    bootStep('Event Listeners', () => {
        if (window.setupEventListeners) window.setupEventListeners();
    });

    // 6. Event Delegation (data-* attributes — replaces inline handlers)
    bootStep('Event Delegation', () => {
        initEventDelegation();
    });

    // 7. Window controls
    bootStep('Window Controls', () => {
        if (WindowManager?.initializeControls) {
            WindowManager.initializeControls();
        }
        if (window.initializeWindowControls) window.initializeWindowControls();
    });

    // 8. Clock
    bootStep('System Clock', () => { initClock(); });

    // 9. Touch support (mobile/tablet)
    bootStep('Touch Manager', () => {
        if (TouchManager) TouchManager.init();
    });

    // 10. Pause shader when tab is hidden (performance)
    bootStep('Visibility Handler', () => {
        if (visibilityHandler) {
            document.removeEventListener('visibilitychange', visibilityHandler);
        }

        visibilityHandler = () => {
            if (ShaderWallpaper) {
                if (document.hidden) {
                    ShaderWallpaper.stop();
                } else if (!window.state.wallpaper) {
                    ShaderWallpaper.start();
                }
            }
        };

        document.addEventListener('visibilitychange', visibilityHandler);
    });

    // 11. Sync ThemeManager state after all UI components and shaders have loaded
    bootStep('Theme Synchronization', () => {
        if (themeSyncTimer) {
            clearTimeout(themeSyncTimer);
        }

        themeSyncTimer = setTimeout(() => {
            const tm: any = Services.get('ThemeManager');
            if (tm) {
                tm.applyTheme(tm.currentTheme);
            }
            themeSyncTimer = null;
        }, 100);
    });

    // === BOOT REPORT ===
    Utils.Logger.log("[INIT] ========================================");
    if (errors.length === 0) {
        Utils.Logger.log(`[INIT] Boot complete — ${Services.list().length} services, 0 errors`);
    } else {
        Utils.Logger.warn(`[INIT] Boot complete WITH ${errors.length} ERROR(S):`);
        errors.forEach(({ step, error }) => {
            Utils.Logger.warn(`  → ${step}: ${error.message}`);
        });
    }
    Utils.Logger.log("[INIT] ========================================");
};
