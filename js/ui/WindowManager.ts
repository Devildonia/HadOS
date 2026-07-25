import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import { WindowZStack } from './WindowZStack';
import { WindowInteractions } from './WindowInteractions';
import { IframeProcessManager } from './IframeProcessManager';
import { LegacyProcessBridge } from './LegacyProcessBridge';
import { WindowControls } from './WindowControls';

// ============================================
// WINDOW MANAGER — fachada
// Coordina el ciclo de vida de las ventanas (abrir/cerrar/minimizar/maximizar)
// y compone colaboradores enfocados: z-stack, interacciones (drag/resize),
// terminación/restauración de iframes, puente de procesos legacy y controles.
// La API pública (IWindowManager) y el registro en Services NO cambian.
// ============================================

/**
 * Interface coordinating the desktop window container lifecycle and snap/z-stack/drag interactions.
 */
export interface IWindowManager {
    /** Instantiates or restores, and brings to focus, the window container matching the given ID. */
    open(windowId: string): void;
    /** Triggers window closing animation sequences and releases associated resources. */
    close(windowId: string): void;
    /** Hides the window container from view without removing it from active trackers. */
    minimize(windowId: string): void;
    /** Toggles the maximized/fullscreen state styling classes for the container. */
    maximize(windowId: string): void;
    /** Adjusts container layers to present the target window at the foreground. */
    bringToFront(win: HTMLElement | null): void;
    /** Enables drag handlers on the window titlebar. */
    makeDraggable(windowId: string): void;
    /** Adds the resize grip and its drag logic to the window. */
    makeResizable(windowId: string): void;
    /** Removes drag handlers from the window titlebar. */
    destroyDraggable(windowId: string): void;
    /** Removes resizing handlers from the window container borders. */
    destroyResizable(windowId: string): void;
    /** Removes all resizing and dragging interactions from the target window container. */
    destroyWindowInteractions(windowId: string): void;
    /** Attaches drag, maximize, minimize, and close click delegation triggers on the page. */
    initializeControls(): void;
    /** Detaches global window controls click delegation handlers. */
    destroy(): void;
    /** Captures the list of active window IDs. */
    getActive(): string[];
    /** Recursively closes all active window containers. */
    closeAll(): void;
}

const WindowManager: IWindowManager = (function () {
    'use strict';

    /** Map tracking active open window identifiers. */
    const activeWindows = new Set<string>();

    // Colaboradores (composición)
    /** Layer stack manager regulating active window z-indexes. */
    const zstack = new WindowZStack();
    /** Handles resizing and dragging interactions on target windows. */
    const interactions = new WindowInteractions((win) => zstack.bringToFront(win));
    /** Lifecycle monitor tracking isolated iframe process lifespans. */
    const iframeProc = new IframeProcessManager();
    /** Legacy process bridge linking kernel PIDs to desktop window closures. */
    const legacyBridge = new LegacyProcessBridge();
    /** Coordinator executing snap actions triggered from header title bar button clicks. */
    const controls = new WindowControls({
        makeDraggable: (id) => interactions.makeDraggable(id),
        makeResizable: (id) => interactions.makeResizable(id),
        bringToFront: (win) => zstack.bringToFront(win),
        minimize: (id) => minimizeWindow(id),
        maximize: (id) => toggleMaximize(id),
        close: (id) => closeWindow(id),
    });

    /**
     * Reproduce el sonido de ventana solo cuando el tema activo es "modern".
     * @param name Name of the sound key to play.
     */
    function playThemeSound(name: string): void {
        const tm = Services.get<{ currentTheme: string }>('ThemeManager');
        if (tm?.currentTheme === 'modern') {
            const audio = Services.get<{ play: (sound: string, opts?: unknown) => void }>('AudioManager');
            if (audio) audio.play(name, { volume: 0.7 });
        }
    }

    /**
     * Opens a window by ID.
     * @param windowId Target window identifier.
     */
    function openWindow(windowId: string): void {
        const win = Utils.getElement(windowId) as HTMLElement | null;
        if (!win) {
            Utils.Logger.error(`Window not found: ${windowId}`);
            return;
        }

        Utils.Logger.window(`Opening window: ${windowId}`);

        playThemeSound('open_window_modern');

        iframeProc.restoreIframes(win, windowId);
        showWindow(win, windowId);
        legacyBridge.registerLegacyProcess(win, windowId);
    }

    /**
     * Make window visible and manage z-index.
     * @param win Window element.
     * @param windowId Unique window string key.
     */
    function showWindow(win: HTMLElement, windowId: string): void {
        if (win.classList.contains('hados-window')) {
            win.style.display = 'flex';

            // Start open animation
            win.classList.remove('window-closing');
            win.classList.add('window-opening');

            const onAnimationEnd = () => {
                win.classList.remove('window-opening');
                win.removeEventListener('animationend', onAnimationEnd);
            };
            win.addEventListener('animationend', onAnimationEnd);
        } else {
            win.style.display = 'block';
        }
        zstack.bringToFront(win);
        activeWindows.add(windowId);

        // Move focus to first interactive element or the window itself
        const interactive = win.querySelector('[tabindex]:not([tabindex="-1"]), button:not(.window-btn), input, textarea, select') as HTMLElement | null;
        if (interactive) {
            interactive.focus();
        } else {
            win.setAttribute('tabindex', '-1');
            win.focus();
        }
    }

    /**
     * Closes a window by ID.
     * @param windowId Unique window string key to close.
     */
    function closeWindow(windowId: string): void {
        const win = Utils.getElement(windowId) as HTMLElement | null;
        if (!win) return;

        // Restore focus before window is hidden/closed
        const activeEl = document.activeElement;
        if (activeEl && win.contains(activeEl)) {
            let fallbackFocusTarget: HTMLElement | null = null;
            const appId = windowId.replace('win-', '');
            if (appId) {
                fallbackFocusTarget = document.querySelector(`.icon[data-launch="${appId}"]`) as HTMLElement | null;
            }
            if (!fallbackFocusTarget) {
                fallbackFocusTarget = document.getElementById('desktop');
            }
            if (!fallbackFocusTarget) {
                fallbackFocusTarget = document.body;
            }
            if (fallbackFocusTarget) {
                fallbackFocusTarget.focus();
            }
        }

        Utils.Logger.window(`Closing window: ${windowId}`);

        playThemeSound('close_window_modern');

        // PROCESS TERMINATION: Fully terminate iframes (stop rAF, intervals, audio)
        iframeProc.terminateWindowIframes(win, windowId);

        if (win.classList.contains('hados-window')) {
            win.classList.remove('window-opening');
            win.classList.add('window-closing');

            const finalizeClose = (e?: AnimationEvent) => {
                // `animationend` bubbles: ignore events from child elements finishing
                // their own animations, otherwise the window closes prematurely.
                if (e && e.target !== win) return;
                win.classList.remove('window-closing');

                const wf = Services.get<{ destroy: (id: string) => void, getCreated: () => Set<string> }>('WindowFactory');
                const winNode = win as unknown as Record<string, unknown>;
                if (wf && winNode._onCloseCallback) {
                    wf.destroy(windowId);
                } else {
                    win.style.display = 'none';
                }

                activeWindows.delete(windowId);
                zstack.remove(windowId);
                legacyBridge.notifyKernelProcessKilled(windowId);
                win.removeEventListener('animationend', finalizeClose as EventListener);
            };

            // Bypass in testing environment (jsdom does not fire CSS animations automatically)
            if (process.env.NODE_ENV === 'test' || typeof window.navigator === 'undefined' || window.navigator.userAgent.includes('jsdom')) {
                finalizeClose();
            } else {
                win.addEventListener('animationend', finalizeClose as EventListener);
            }
        } else {
            const wf = Services.get<{ destroy: (id: string) => void, getCreated: () => Set<string> }>('WindowFactory');
            if (wf && wf.getCreated().has(windowId)) {
                wf.destroy(windowId);
            } else {
                win.style.display = 'none';
            }
            activeWindows.delete(windowId);
            zstack.remove(windowId);
            legacyBridge.notifyKernelProcessKilled(windowId);
        }
    }

    /**
     * Toggles window maximized state.
     * @param windowId Target window key.
     */
    function toggleMaximize(windowId: string): void {
        const win = Utils.getElement(windowId) as HTMLElement | null;
        if (!win) return;

        const isMaximized = win.classList.contains('maximized');

        if (isMaximized) {
            win.classList.remove('maximized');
            Utils.Logger.window(`Window ${windowId} restored`);
        } else {
            win.classList.add('maximized');
            Utils.Logger.window(`Window ${windowId} maximized`);
        }
    }

    /**
     * Minimizes window (hides it).
     * @param windowId Target window key.
     */
    function minimizeWindow(windowId: string): void {
        const win = Utils.getElement(windowId) as HTMLElement | null;
        if (!win) return;

        Utils.Logger.window(`Window ${windowId} minimized`);
        win.style.display = 'none';
        // We don't remove it from activeWindows so the taskbar button stays
    }

    /**
     * Gets list of active windows.
     */
    function getActiveWindows(): string[] {
        return Array.from(activeWindows);
    }

    /**
     * Closes all windows.
     */
    function closeAllWindows(): void {
        Utils.Logger.window('Closing all windows');
        activeWindows.forEach(windowId => closeWindow(windowId));
    }

    // Public API
    return {
        open: openWindow,
        close: closeWindow,
        minimize: minimizeWindow,
        maximize: toggleMaximize,
        bringToFront: (win: HTMLElement | null) => zstack.bringToFront(win),
        makeDraggable: (id: string) => interactions.makeDraggable(id),
        makeResizable: (id: string) => interactions.makeResizable(id),
        destroyDraggable: (id: string) => interactions.destroyDraggable(id),
        destroyResizable: (id: string) => interactions.destroyResizable(id),
        destroyWindowInteractions: (id: string) => interactions.destroyWindowInteractions(id),
        initializeControls: () => controls.initialize(),
        destroy: () => controls.destroy(),
        getActive: getActiveWindows,
        closeAll: closeAllWindows
    };
})();

// Make globally available
export { WindowManager };

if (typeof window !== 'undefined') {
    Services.register('WindowManager', WindowManager);
}
