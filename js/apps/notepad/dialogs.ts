import { VFS } from '../../core/VFS';
import { Services } from '../../core/ServiceContainer';
import { Utils } from '../../utils';
import type { INotify } from '../../ui/NotificationManager';

const VFS_SAVE_DIR = 'C:\\DOCUMENTS';

export function setupDialogListeners(instance: unknown): void {
    const inst = instance as unknown as { _confirmOpen: () => void; _confirmSaveAs: () => void; _findNext: () => void; registerResource: (t: string, r: unknown) => void };
    // Open dialog
    bindBtn(instance, 'notepad-open-ok', () => inst._confirmOpen());
    bindBtn(instance, 'notepad-open-cancel', () => hideDialog('notepad-open-dialog'));

    const openInput = document.getElementById('notepad-open-input') as HTMLInputElement;
    if (openInput) {
        const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') inst._confirmOpen(); };
        openInput.addEventListener('keydown', enterHandler);
        inst.registerResource('listener', { dispose: () => openInput.removeEventListener('keydown', enterHandler) });
    }

    // SaveAs dialog
    bindBtn(instance, 'notepad-saveas-ok', () => inst._confirmSaveAs());
    bindBtn(instance, 'notepad-saveas-cancel', () => hideDialog('notepad-saveas-dialog'));

    const saveInput = document.getElementById('notepad-saveas-input') as HTMLInputElement;
    if (saveInput) {
        const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') inst._confirmSaveAs(); };
        saveInput.addEventListener('keydown', enterHandler);
        inst.registerResource('listener', { dispose: () => saveInput.removeEventListener('keydown', enterHandler) });
    }

    // Find dialog
    bindBtn(instance, 'notepad-find-next', () => inst._findNext());
    bindBtn(instance, 'notepad-find-cancel', () => hideDialog('notepad-find-dialog'));

    const findInput = document.getElementById('notepad-find-input') as HTMLInputElement;
    if (findInput) {
        const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') inst._findNext(); };
        findInput.addEventListener('keydown', enterHandler);
        inst.registerResource('listener', { dispose: () => findInput.removeEventListener('keydown', enterHandler) });
    }
}

export function bindBtn(instance: unknown, id: string, fn: () => void): void {
    const inst = instance as unknown as { registerResource: (t: string, r: unknown) => void };
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', fn);
    inst.registerResource('listener', { dispose: () => btn.removeEventListener('click', fn) });
}

export function showOpenDialog(instance: unknown): void {
    const inst = instance as unknown as { _confirmOpen: () => void };
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
                    inst._confirmOpen();
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

export function confirmOpen(instance: unknown): void {
    const inst = instance as unknown as {
        textarea?: HTMLTextAreaElement;
        currentFile: string;
        currentPath: string;
        isModified: boolean;
        _lastFindIndex: number;
        updateTitle: () => void;
        _updateStatus: () => void;
    };
    const input = document.getElementById('notepad-open-input') as HTMLInputElement;
    const name = input?.value?.trim();
    if (!name) return;

    const safeName = name.endsWith('.txt') ? name : name + '.txt';
    const fullPath = `${VFS_SAVE_DIR}\\${safeName}`;
    const content = VFS.readFile(fullPath);

    const notify = Services.get('Notify') as INotify | undefined;

    if (content !== null) {
        if (inst.textarea) inst.textarea.value = content;
        inst.currentFile = safeName;
        inst.currentPath = VFS_SAVE_DIR;
        inst.isModified = false;
        inst._lastFindIndex = -1;
        inst.updateTitle();
        inst._updateStatus();
        hideDialog('notepad-open-dialog');
        Utils.Logger.log(`[Notepad] Opened from VFS: ${fullPath}`);
    } else {
        if (notify) notify.warn(`File not found: ${safeName}`);
        else Utils.Logger.warn(`[Notepad] File not found: ${fullPath}`);
    }
}

export function showSaveAsDialog(instance: unknown): void {
    const inst = instance as unknown as { currentFile: string };
    const dialog = document.getElementById('notepad-saveas-dialog');
    const input = document.getElementById('notepad-saveas-input') as HTMLInputElement;
    if (!dialog) return;

    if (input) {
        input.value = inst.currentFile === 'Untitled' ? '' : inst.currentFile.replace(/\.txt$/, '');
    }
    dialog.style.display = 'block';
    if (input) setTimeout(() => { input.focus(); input.select(); }, 50);
}

export function confirmSaveAs(instance: unknown): void {
    const inst = instance as unknown as { _writeToVFS: (dir: string, name: string) => void };
    const input = document.getElementById('notepad-saveas-input') as HTMLInputElement;
    const name = input?.value?.trim();
    if (!name) return;

    hideDialog('notepad-saveas-dialog');
    inst._writeToVFS(VFS_SAVE_DIR, name);
}

export function showFindDialog(instance: unknown): void {
    const inst = instance as unknown as { _lastFindTerm?: string };
    const dialog = document.getElementById('notepad-find-dialog');
    const input = document.getElementById('notepad-find-input') as HTMLInputElement;
    if (!dialog) return;

    if (input && inst._lastFindTerm) input.value = inst._lastFindTerm;
    dialog.style.display = 'block';
    if (input) setTimeout(() => { input.focus(); input.select(); }, 50);
}

export function findNext(instance: unknown): void {
    const inst = instance as unknown as { textarea?: HTMLTextAreaElement; _lastFindTerm: string; _lastFindIndex: number };
    const input = document.getElementById('notepad-find-input') as HTMLInputElement;
    const term = input?.value?.trim();
    if (!term || !inst.textarea) return;

    const text = inst.textarea.value.toLowerCase();
    const search = term.toLowerCase();

    // If term changed, reset
    if (term !== inst._lastFindTerm) {
        inst._lastFindTerm = term;
        inst._lastFindIndex = -1;
    }

    const startFrom = inst._lastFindIndex + 1;
    const idx = text.indexOf(search, startFrom);

    if (idx !== -1) {
        inst.textarea.focus();
        inst.textarea.setSelectionRange(idx, idx + term.length);
        inst._lastFindIndex = idx;

        // Scroll into view
        const linesBefore = text.substring(0, idx).split('\n').length;
        const lineHeight = parseInt(getComputedStyle(inst.textarea).lineHeight) || 16;
        inst.textarea.scrollTop = (linesBefore - 2) * lineHeight;
    } else {
        // Wrap around
        inst._lastFindIndex = -1;
        const notify = Services.get('Notify') as INotify | undefined;
        if (notify) notify.info(`Cannot find "${term}". Wrapped to top.`);
    }
}

export function hideDialog(id: string): void {
    const dialog = document.getElementById(id);
    if (dialog) dialog.style.display = 'none';
}

export function showAbout(_instance: unknown): void {
    const notify = Services.get('Notify') as INotify | undefined;
    const msg = 'Notapad v5.0 — HadOS';
    if (notify) notify.info(msg);
    else Utils.Logger.log('[Notepad]', msg);
}
