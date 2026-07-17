import { VFS } from '../../core/VFS';
import { Services } from '../../core/ServiceContainer';
import { Utils } from '../../utils';
import type { INotify } from '../../ui/NotificationManager';

const VFS_SAVE_DIR = 'C:\\DOCUMENTS';

export function setupDialogListeners(instance: any): void {
    // Open dialog
    bindBtn(instance, 'notepad-open-ok', () => instance._confirmOpen());
    bindBtn(instance, 'notepad-open-cancel', () => hideDialog('notepad-open-dialog'));

    const openInput = document.getElementById('notepad-open-input') as HTMLInputElement;
    if (openInput) {
        const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') instance._confirmOpen(); };
        openInput.addEventListener('keydown', enterHandler);
        instance.registerResource('listener', { dispose: () => openInput.removeEventListener('keydown', enterHandler) });
    }

    // Save As dialog
    bindBtn(instance, 'notepad-saveas-ok', () => instance._confirmSaveAs());
    bindBtn(instance, 'notepad-saveas-cancel', () => hideDialog('notepad-saveas-dialog'));

    const saveInput = document.getElementById('notepad-saveas-input') as HTMLInputElement;
    if (saveInput) {
        const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') instance._confirmSaveAs(); };
        saveInput.addEventListener('keydown', enterHandler);
        instance.registerResource('listener', { dispose: () => saveInput.removeEventListener('keydown', enterHandler) });
    }

    // Find dialog
    bindBtn(instance, 'notepad-find-next', () => instance._findNext());
    bindBtn(instance, 'notepad-find-cancel', () => hideDialog('notepad-find-dialog'));

    const findInput = document.getElementById('notepad-find-input') as HTMLInputElement;
    if (findInput) {
        const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') instance._findNext(); };
        findInput.addEventListener('keydown', enterHandler);
        instance.registerResource('listener', { dispose: () => findInput.removeEventListener('keydown', enterHandler) });
    }
}

export function bindBtn(instance: any, id: string, fn: () => void): void {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', fn);
    instance.registerResource('listener', { dispose: () => btn.removeEventListener('click', fn) });
}

export function showOpenDialog(instance: any): void {
    const dialog = document.getElementById('notepad-open-dialog');
    const input = document.getElementById('notepad-open-input') as HTMLInputElement;
    const fileList = document.getElementById('notepad-dialog-filelist');
    if (!dialog) return;

    // Populate file list from VFS DOCUMENTS
    if (fileList) {
        fileList.innerHTML = '';
        const files = VFS.listDir(VFS_SAVE_DIR) || [];
        files
            .filter(f => f.toLowerCase().endsWith('.txt'))
            .forEach(fname => {
                const entry = document.createElement('div');
                entry.className = 'notepad-dialog-file-entry';
                entry.textContent = fname;
                entry.addEventListener('click', () => {
                    if (input) input.value = fname;
                });
                entry.addEventListener('dblclick', () => {
                    if (input) input.value = fname;
                    instance._confirmOpen();
                });
                fileList.appendChild(entry);
            });

        if (fileList.children.length === 0) {
            fileList.innerHTML = '<div style="padding:4px;color:#808080;font-size:10px;">(no .txt files)</div>';
        }
    }

    if (input) input.value = '';
    dialog.style.display = 'block';
    if (input) setTimeout(() => input.focus(), 50);
}

export function confirmOpen(instance: any): void {
    const input = document.getElementById('notepad-open-input') as HTMLInputElement;
    const name = input?.value?.trim();
    if (!name) return;

    const safeName = name.endsWith('.txt') ? name : name + '.txt';
    const fullPath = `${VFS_SAVE_DIR}\\${safeName}`;
    const content = VFS.readFile(fullPath);

    const notify = Services.get('Notify') as INotify | undefined;

    if (content !== null) {
        if (instance.textarea) instance.textarea.value = content;
        instance.currentFile = safeName;
        instance.currentPath = VFS_SAVE_DIR;
        instance.isModified = false;
        instance._lastFindIndex = -1;
        instance.updateTitle();
        instance._updateStatus();
        hideDialog('notepad-open-dialog');
        Utils.Logger.log(`[Notepad] Opened from VFS: ${fullPath}`);
    } else {
        if (notify) notify.warn(`File not found: ${safeName}`);
        else Utils.Logger.warn(`[Notepad] File not found: ${fullPath}`);
    }
}

export function showSaveAsDialog(instance: any): void {
    const dialog = document.getElementById('notepad-saveas-dialog');
    const input = document.getElementById('notepad-saveas-input') as HTMLInputElement;
    if (!dialog) return;

    if (input) {
        input.value = instance.currentFile === 'Untitled' ? '' : instance.currentFile.replace(/\.txt$/, '');
    }
    dialog.style.display = 'block';
    if (input) setTimeout(() => { input.focus(); input.select(); }, 50);
}

export function confirmSaveAs(instance: any): void {
    const input = document.getElementById('notepad-saveas-input') as HTMLInputElement;
    const name = input?.value?.trim();
    if (!name) return;

    hideDialog('notepad-saveas-dialog');
    instance._writeToVFS(VFS_SAVE_DIR, name);
}

export function showFindDialog(instance: any): void {
    const dialog = document.getElementById('notepad-find-dialog');
    const input = document.getElementById('notepad-find-input') as HTMLInputElement;
    if (!dialog) return;

    if (input && instance._lastFindTerm) input.value = instance._lastFindTerm;
    dialog.style.display = 'block';
    if (input) setTimeout(() => { input.focus(); input.select(); }, 50);
}

export function findNext(instance: any): void {
    const input = document.getElementById('notepad-find-input') as HTMLInputElement;
    const term = input?.value?.trim();
    if (!term || !instance.textarea) return;

    const text = instance.textarea.value.toLowerCase();
    const search = term.toLowerCase();

    // If term changed, reset
    if (term !== instance._lastFindTerm) {
        instance._lastFindTerm = term;
        instance._lastFindIndex = -1;
    }

    const startFrom = instance._lastFindIndex + 1;
    const idx = text.indexOf(search, startFrom);

    if (idx !== -1) {
        instance.textarea.focus();
        instance.textarea.setSelectionRange(idx, idx + term.length);
        instance._lastFindIndex = idx;

        // Scroll into view
        const linesBefore = text.substring(0, idx).split('\n').length;
        const lineHeight = parseInt(getComputedStyle(instance.textarea).lineHeight) || 16;
        instance.textarea.scrollTop = (linesBefore - 2) * lineHeight;
    } else {
        // Wrap around
        instance._lastFindIndex = -1;
        const notify = Services.get('Notify') as INotify | undefined;
        if (notify) notify.info(`Cannot find "${term}". Wrapped to top.`);
    }
}

export function hideDialog(id: string): void {
    const dialog = document.getElementById(id);
    if (dialog) dialog.style.display = 'none';
}

export function showAbout(instance: any): void {
    const notify = Services.get('Notify') as INotify | undefined;
    const msg = 'Notapad v5.0 — HadOS';
    if (notify) notify.info(msg);
    else Utils.Logger.log('[Notepad]', msg);
}
