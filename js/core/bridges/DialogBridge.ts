/**
 * WINDOWS 95 APP CENTER - DIALOG BRIDGE
 * Manages system dialog templates, dynamic creation, and visibility.
 */

import { Services } from '../ServiceContainer';
import { i18n } from '../../services/i18n';
import { updateRecycleBinUI } from '../StickyNotesController';
import { setupDebugMenu } from '../DebugMenuController';

const DIALOG_CONFIGS: Record<string, { title: () => string, html: () => string }> = {
    'dialog-mycomputer': {
        title: () => i18n.t('dialog.error.title'),
        html: () => `
            <div class="dialog-content">
                <span class="dialog-icon">❌</span>
                <span class="dialog-message">${i18n.t('dialog.mycomputer.message')}</span>
            </div>
            <div class="dialog-buttons">
                <button class="hados-btn" data-close-dialog="dialog-mycomputer">${i18n.t('dialog.ok')}</button>
            </div>
        `
    },
    'dialog-recyclebin': {
        title: () => i18n.t('dialog.recyclebin.title'),
        html: () => `
            <div class="dialog-content">
                <span class="dialog-icon">🗑️</span>
                <span class="dialog-message">${i18n.t('dialog.recyclebin.message')}</span>
            </div>
            <div class="dialog-buttons">
                <button class="hados-btn" data-close-dialog="dialog-recyclebin">${i18n.t('dialog.ok')}</button>
            </div>
        `
    },
    'dialog-shutdown': {
        title: () => i18n.t('dialog.shutdown.title'),
        html: () => `
            <div class="dialog-content">
                <span class="dialog-icon">❌</span>
                <span class="dialog-message">${i18n.t('dialog.shutdown.message')}</span>
            </div>
        `
    },
    'dialog-debug': {
        title: () => i18n.t('dialog.debug.title'),
        html: () => `
            <div class="dialog-content" style="flex-direction: column; text-align: center; gap: 10px;">
                <span class="dialog-icon">⚠</span>
                <span class="dialog-message" style="width: 100%;">${i18n.t('dialog.debug.title')}</span>
                <hr style="width: 100%; border-top: 1px solid #808080; border-bottom: 1px solid #fff;">
                <p>${i18n.t('dialog.debug.restore_prompt')}</p>
                <p style="font-size: 11px; color: #555;">${i18n.t('dialog.debug.restore_hint')}</p>
            </div>
            <div class="dialog-buttons">
                <button class="hados-btn" id="btn-reset-desktop">${i18n.t('dialog.debug.reset_all')}</button>
                <button class="hados-btn" data-close-dialog="dialog-debug">${i18n.t('dialog.cancel')}</button>
            </div>
        `
    },
    'dialog-encryption': {
        title: () => i18n.t('dialog.encryption.title'),
        html: () => `
            <div class="dialog-content">
                <span class="dialog-icon">🔒</span>
                <span class="dialog-message">${i18n.t('dialog.encryption.message')}</span>
            </div>
            <div class="dialog-buttons">
                <button class="hados-btn" data-close-dialog="dialog-encryption">${i18n.t('dialog.ok')}</button>
            </div>
        `
    }
};

export function ensureDialog(dialogId: string): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById(dialogId)) return;
    const config = DIALOG_CONFIGS[dialogId];
    if (!config) return;

    const dialog = document.createElement('div');
    dialog.className = 'hados-dialog';
    dialog.id = dialogId;
    dialog.style.display = 'none';
    if (dialogId === 'dialog-debug') {
        dialog.style.width = '300px';
        dialog.style.zIndex = '99999';
    }

    const showClose = dialogId !== 'dialog-shutdown';
    dialog.innerHTML = `
        <div class="window-header">
            <span>${config.title()}</span>
            ${showClose ? `<button class="close-btn" data-close-dialog="${dialogId}">×</button>` : ''}
        </div>
        <div class="window-body">
            ${config.html()}
        </div>
    `;

    document.getElementById('desktop')?.appendChild(dialog);

    if (dialogId === 'dialog-debug') {
        setupDebugMenu();
    }
}

export function setDialogVisibility(dialogId: string, visible: boolean): void {
    if (typeof document === 'undefined') return;
    const dialog = document.getElementById(dialogId);
    if (dialog) dialog.style.display = visible ? 'block' : 'none';
}

export function openDialog(dialogId: string): void {
    ensureDialog(dialogId);
    if (dialogId === 'dialog-recyclebin') {
        updateRecycleBinUI();
    }
    setDialogVisibility(dialogId, true);
}

export function closeDialog(dialogId: string): void {
    setDialogVisibility(dialogId, false);
}
