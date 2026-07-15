/**
 * WINDOWS 95 APP CENTER - EVENT DELEGATION
 * Handles all data-* attribute actions via event delegation.
 * Replaces inline onclick/ondblclick handlers.
 * v1.0 — Fase 2 Refactor
 */

import { Services } from './ServiceContainer.js';
import { Utils } from '../utils.js';
import { EventBus } from './EventBus.js';

let documentListenersAttached = false;
let boundWallpaperUpload: HTMLInputElement | null = null;
let boundColorPicker: HTMLInputElement | null = null;
let boundIeAddressInput: HTMLInputElement | null = null;

function onDocumentDblClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const el = target.closest('[data-launch]') as HTMLElement;
    if (!el) return;

    const appId = el.dataset.launch;
    if (!appId) return;

    const kernel: any = Services.get('Kernel');
    if (kernel) {
        kernel.launch(appId);
    } else {
        Utils.Logger.error(`[EventDelegation] Kernel not available for launch: ${appId}`);
    }
}

function onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    // data-launch via single click (Start Menu items)
    const launchEl = target.closest('[data-launch]') as HTMLElement;
    if (launchEl && launchEl.closest('#start-menu')) {
        const appId = launchEl.dataset.launch;
        const kernel: any = Services.get('Kernel');
        if (kernel && appId) kernel.launch(appId);
        // Close start menu after launch
        const menu = document.getElementById('start-menu');
        if (menu) menu.style.display = 'none';
        return;
    }

    // data-wallpaper (setWallpaper)
    const wpEl = target.closest('[data-wallpaper]') as HTMLElement;
    if (wpEl) {
        const url = wpEl.dataset.wallpaper;
        const dm: any = Services.get('DesktopManager');
        if (dm && url !== undefined) dm.setWallpaper(url);
        return;
    }

    // data-taskbar-color (setTaskbarColor)
    const tcEl = target.closest('[data-taskbar-color]') as HTMLElement;
    if (tcEl) {
        const color = tcEl.dataset.taskbarColor;
        const dm: any = Services.get('DesktopManager');
        if (dm && color !== undefined) dm.setTaskbarColor(color);
        return;
    }

    // data-close-window (closeWindow)
    const cwEl = target.closest('[data-close-window]') as HTMLElement;
    if (cwEl) {
        const winId = cwEl.dataset.closeWindow;
        _playBlip();
        const wm: any = Services.get('WindowManager');
        if (wm && winId) wm.close(winId);
        return;
    }

    // data-close-dialog (closeDialog)
    const cdEl = target.closest('[data-close-dialog]') as HTMLElement;
    if (cdEl) {
        const dialogId = cdEl.dataset.closeDialog;
        _playBlip();
        if (dialogId) {
            const dialog = document.getElementById(dialogId);
            if (dialog) dialog.style.display = 'none';
        }
        return;
    }

    // data-action (generic actions)
    const actionEl = target.closest('[data-action]') as HTMLElement;
    if (actionEl) {
        const action = actionEl.dataset.action;
        if (action) {
            _handleAction(action);
        }
        return;
    }
}

function onWallpaperUploadChange(): void {
    const dm: any = Services.get('DesktopManager');
    if (dm && boundWallpaperUpload) dm.handleWallpaperUpload(boundWallpaperUpload);
}

function onColorPickerChange(): void {
    const dm: any = Services.get('DesktopManager');
    if (dm && boundColorPicker) dm.setTaskbarColor(boundColorPicker.value);
}

function onIeAddressKeypress(e: KeyboardEvent): void {
    if (e.key === 'Enter' && boundIeAddressInput) {
        _navigateIE(boundIeAddressInput.value);
    }
}

/** Play UI blip sound via AudioManager service */
function _playBlip(freq: number = 800): void {
    const tm: any = Services.get('ThemeManager');
    const isModern = tm?.currentTheme === 'modern';
    if (isModern) return;

    const am: any = Services.get('AudioManager');
    if (am) {
        am.play('blip', { frequency: freq });
    }
}

/** Navigate Internet Explorer iframe */
function _navigateIE(url: string): void {
    const ie: any = Services.get('InternetExplorerApp');
    if (ie?.navigate) {
        ie.navigate(url);
    }
}

/**
 * Initialize global event delegation.
 * Call once after DOM is ready.
 */
export function initEventDelegation(): void {
    Utils.Logger.log('[EventDelegation] Initializing...');

    if (!documentListenersAttached) {
        document.addEventListener('dblclick', onDocumentDblClick);
        document.addEventListener('click', onDocumentClick);
        documentListenersAttached = true;
    }

    Utils.Logger.log('[EventDelegation] Ready — handling data-launch, data-wallpaper, data-taskbar-color, data-close-window, data-close-dialog, data-action');

    bindCurrentDom();
}

function bindCurrentDom(): void {
    const wallpaperUpload = document.getElementById('wallpaper-upload') as HTMLInputElement;
    if (boundWallpaperUpload && boundWallpaperUpload !== wallpaperUpload) {
        boundWallpaperUpload.removeEventListener('change', onWallpaperUploadChange);
    }
    if (wallpaperUpload && boundWallpaperUpload !== wallpaperUpload) {
        wallpaperUpload.addEventListener('change', onWallpaperUploadChange);
    }
    boundWallpaperUpload = wallpaperUpload;

    // === CHANGE: Wallpaper file upload ===
    const colorPicker = document.getElementById('taskbar-color-picker') as HTMLInputElement;
    if (boundColorPicker && boundColorPicker !== colorPicker) {
        boundColorPicker.removeEventListener('change', onColorPickerChange);
        boundColorPicker.removeEventListener('input', onColorPickerChange);
    }
    if (colorPicker && boundColorPicker !== colorPicker) {
        colorPicker.addEventListener('change', onColorPickerChange);
        colorPicker.addEventListener('input', onColorPickerChange);
    }
    boundColorPicker = colorPicker;

    // === CHANGE: Taskbar color picker ===
    const ieAddressInput = document.getElementById('ie-address-input') as HTMLInputElement;
    if (boundIeAddressInput && boundIeAddressInput !== ieAddressInput) {
        boundIeAddressInput.removeEventListener('keypress', onIeAddressKeypress);
    }
    if (ieAddressInput && boundIeAddressInput !== ieAddressInput) {
        ieAddressInput.addEventListener('keypress', onIeAddressKeypress);
    }
    boundIeAddressInput = ieAddressInput;

    // === KEYPRESS: IE address bar Enter key ===
}

export function destroyEventDelegation(): void {
    if (documentListenersAttached) {
        document.removeEventListener('dblclick', onDocumentDblClick);
        document.removeEventListener('click', onDocumentClick);
        documentListenersAttached = false;
    }

    if (boundWallpaperUpload) {
        boundWallpaperUpload.removeEventListener('change', onWallpaperUploadChange);
        boundWallpaperUpload = null;
    }

    if (boundColorPicker) {
        boundColorPicker.removeEventListener('change', onColorPickerChange);
        boundColorPicker.removeEventListener('input', onColorPickerChange);
        boundColorPicker = null;
    }

    if (boundIeAddressInput) {
        boundIeAddressInput.removeEventListener('keypress', onIeAddressKeypress);
        boundIeAddressInput = null;
    }
}

/**
 * Handle generic data-action values
 * Emits an event on the EventBus so individual modules can handle their own actions.
 */
function _handleAction(action: string): void {
    Utils.Logger.log(`[EventDelegation] Dispatching action: ${action}`);
    EventBus.emit(`action:${action}`);
}
