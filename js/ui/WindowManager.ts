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

export interface IWindowManager {
    open(windowId: string): void;
    close(windowId: string): void;
    minimize(windowId: string): void;
    maximize(windowId: string): void;
    bringToFront(win: HTMLElement | null): void;
    makeDraggable(windowId: string): void;
    destroyDraggable(windowId: string): void;
    destroyResizable(windowId: string): void;
    destroyWindowInteractions(windowId: string): void;
    initializeControls(): void;
    destroy(): void;
    getActive(): string[];
    closeAll(): void;
}

const WindowManager: IWindowManager = (function () {
    'use strict';

    const activeWindows = new Set<string>();

    // Colaboradores (composición)
    const zstack = new WindowZStack();
    const interactions = new WindowInteractions((win) => zstack.bringToFront(win));
    const iframeProc = new IframeProcessManager();
    const legacyBridge = new LegacyProcessBridge();
    const controls = new WindowControls({
        makeDraggable: (id) => interactions.makeDraggable(id),
        makeResizable: (id) => interactions.makeResizable(id),
        bringToFront: (win) => zstack.bringToFront(win),
        minimize: (id) => minimizeWindow(id),
        maximize: (id) => toggleMaximize(id),
        close: (id) => closeWindow(id),
    });

    /** Reproduce el sonido de ventana solo cuando el tema activo es "modern". */
    function playThemeSound(name: string): void {
        const tm: any = Services.get('ThemeManager');
        if (tm?.currentTheme === 'modern') {
            const audio: any = Services.get('AudioManager');
            if (audio) audio.play(name, { volume: 0.7 });
        }
    }

    /**
     * Opens a window by ID
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

    /** Make window visible and manage z-index */
    function showWindow(win: HTMLElement, windowId: string): void {
        if (win.classList.contains('win95-window')) {
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
     * Closes a window by ID
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

        if (win.classList.contains('win95-window')) {
            win.classList.remove('window-opening');
            win.classList.add('window-closing');

            const finalizeClose = (e?: AnimationEvent) => {
                // `animationend` bubbles: ignore events from child elements finishing
                // their own animations, otherwise the window closes prematurely.
                if (e && e.target !== win) return;
                win.classList.remove('window-closing');

                const wf: any = Services.get('WindowFactory');
                if (wf && (win as any)._onCloseCallback) {
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
            const wf: any = Services.get('WindowFactory');
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

    /** Toggles window maximized state */
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

    /** Minimizes window (hides it) */
    function minimizeWindow(windowId: string): void {
        const win = Utils.getElement(windowId) as HTMLElement | null;
        if (!win) return;

        Utils.Logger.window(`Window ${windowId} minimized`);
        win.style.display = 'none';
        // We don't remove it from activeWindows so the taskbar button stays
    }

    /** Gets list of active windows */
    function getActiveWindows(): string[] {
        return Array.from(activeWindows);
    }

    /** Closes all windows */
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
