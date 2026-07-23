import { Utils } from '../utils.js';
import { WindowManager, type IWindowManager } from '../ui/WindowManager.js';
import type { INotify } from '../ui/NotificationManager.js';
import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { VFS } from '../core/VFS.js';

import { NOTEPAD_BODY_HTML } from './notepad/templates.js';
import * as actions from './notepad/actions.js';
import * as aiActions from './notepad/ai.js';
import * as dialogs from './notepad/dialogs.js';
import * as files from './notepad/files.js';

export interface INotepadParams {
    file?: string;
    content?: string;
    path?: string; // VFS path where file resides
    windowId?: string;
    textareaId?: string;
    onClose?: () => void;
}

// Default save directory in VFS
const VFS_SAVE_DIR = 'C:\\DOCUMENTS';

class Notepad {
    public windowId: string = 'win-notepad';
    private textareaId: string = 'notepad-textarea';
    private currentFile: string;
    private currentPath: string; // full VFS path (dir only)
    private isModified: boolean = false;
    private textarea: HTMLTextAreaElement | null = null;

    // Find state
    private _lastFindIndex: number = -1;
    private _lastFindTerm: string = '';

    private registerResource(kind: 'webgl' | 'audio' | 'listener' | 'timer' | 'other', resource: { dispose(): void }): void {
        const resManager = Services.get('ResourceManager');
        if (resManager && this.windowId) {
            resManager.register(this.windowId, kind, resource);
        }
    }

    constructor(params: INotepadParams = {}) {
        if (params.windowId) this.windowId = params.windowId;
        if (params.textareaId) this.textareaId = params.textareaId;
        this.currentFile = params.file || 'Untitled';
        this.currentPath = params.path || VFS_SAVE_DIR;
        this.init(params.content || '');
        if (params.onClose) {
            this.registerResource('other', { dispose: params.onClose });
        }
    }

    // Legacy compatibility surface used by tests and older callers.
    public saveFile(): void {
        const name = window.prompt('Save as', this.currentFile === 'Untitled' ? '' : this.currentFile.replace(/\.txt$/, ''));
        if (!name) return;

        const key = `notepad_${name}`;
        const content = this.textarea?.value ?? '';
        localStorage.setItem(key, JSON.stringify(content));
        this.currentFile = name;
        this.isModified = false;
        this.updateTitle();
    }

    public openFile(): void {
        const name = window.prompt('Open file', '');
        if (!name) return;

        const key = `notepad_${name}`;
        const raw = localStorage.getItem(key);
        const notify = Services.get('Notify') as INotify | undefined;

        if (raw === null) {
            if (notify) notify.warn('File not found');
            return;
        }

        const content = JSON.parse(raw) as string;
        if (this.textarea) this.textarea.value = content;
        this.currentFile = name;
        this.isModified = false;
        this.updateTitle();
        this._updateStatus();
    }

    public newFile(): void {
        if (this.textarea) this.textarea.value = '';
        this.currentFile = 'Untitled';
        this.currentPath = VFS_SAVE_DIR;
        this.isModified = false;
        this._lastFindIndex = -1;
        this.updateTitle();
        this._updateStatus();
    }

    // ─── Init ─────────────────────────────────────────────────────────────────

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'Untitled - Notapad',
            width: 500,
            height: 400,
            icon: '📝'
        });
        const body = wf.getBody(this.windowId);
        if (body) {
            body.classList.add('notepad-body');
            body.innerHTML = NOTEPAD_BODY_HTML;
        }
    }

    private init(initialContent: string): void {
        this._ensureWindow();

        this.textarea = document.getElementById(this.textareaId) as HTMLTextAreaElement | null;
        if (!this.textarea) return;

        if (initialContent) {
            this.textarea.value = initialContent;
        }

        this._setupTextareaListeners();
        this._setupMenuListeners();
        this._setupDialogListeners();
        this._setupKeyboardShortcuts();
        this._closeMenusOnOutsideClick();

        this.updateTitle();
        this._updateStatus();
        Utils.Logger.log('[Notepad] v5.0 initialized');
    }

    // ─── Textarea ─────────────────────────────────────────────────────────────

    private _setupTextareaListeners(): void {
        const inputHandler = () => {
            if (!this.isModified) {
                this.isModified = true;
                this.updateTitle();
            }
            this._updateStatus();
        };
        this.textarea!.addEventListener('input', inputHandler);
        this.registerResource('listener', { dispose: () => this.textarea?.removeEventListener('input', inputHandler) });
    }

    private _updateStatus(): void {
        const win = document.getElementById(this.windowId);
        const status = win ? win.querySelector('.window-statusbar span') : null;
        if (!status || !this.textarea) return;
        const text = this.textarea.value;
        const lines = text.split('\n').length;
        const chars = text.length;
        status.textContent = `Ln ${lines}, Ch ${chars}`;
    }

    // ─── Dropdown Menu ────────────────────────────────────────────────────────

    private _setupMenuListeners(): void {
        actions.setupMenuListeners(this);
    }

    private _closeAllDropdowns(): void {
        actions.closeAllDropdowns(this);
    }

    private _closeMenusOnOutsideClick(): void {
        actions.closeMenusOnOutsideClick(this);
    }

    // ─── Dialog Listeners ─────────────────────────────────────────────────────

    private _setupDialogListeners(): void {
        dialogs.setupDialogListeners(this);
    }

    private _bindBtn(id: string, fn: () => void): void {
        dialogs.bindBtn(this, id, fn);
    }

    // ─── Keyboard Shortcuts ───────────────────────────────────────────────────

    private _setupKeyboardShortcuts(): void {
        actions.setupKeyboardShortcuts(this);
    }

    // ─── Action Dispatcher ────────────────────────────────────────────────────

    private _executeAction(action: string): void {
        actions.executeAction(this, action);
    }

    // ─── File Operations ──────────────────────────────────────────────────────

    private _newFile(): void {
        if (this.isModified) {
            if (!confirm(`Save changes to ${this.currentFile}?`)) {
                // Discard
            } else {
                this._saveFile();
                return;
            }
        }
        if (this.textarea) this.textarea.value = '';
        this.currentFile = 'Untitled';
        this.currentPath = VFS_SAVE_DIR;
        this.isModified = false;
        this._lastFindIndex = -1;
        this.updateTitle();
        this._updateStatus();
    }

    private _newWindow(): void {
        files.newWindow(this);
    }

    private _saveFile(): void {
        if (this.currentFile === 'Untitled') {
            this._showSaveAsDialog();
            return;
        }
        files.writeToVFS(this, this.currentPath, this.currentFile);
    }

    private _writeToVFS(dir: string, name: string): void {
        files.writeToVFS(this, dir, name);
    }

    // ─── Open Dialog ──────────────────────────────────────────────────────────

    private _showOpenDialog(): void {
        dialogs.showOpenDialog(this);
    }

    private _confirmOpen(): void {
        dialogs.confirmOpen(this);
    }

    // ─── Save As Dialog ───────────────────────────────────────────────────────

    private _showSaveAsDialog(): void {
        dialogs.showSaveAsDialog(this);
    }

    private _confirmSaveAs(): void {
        dialogs.confirmSaveAs(this);
    }

    // ─── Find Dialog ──────────────────────────────────────────────────────────

    private _showFindDialog(): void {
        dialogs.showFindDialog(this);
    }

    private _findNext(): void {
        dialogs.findNext(this);
    }

    // ─── Dialog helpers ───────────────────────────────────────────────────────

    private _hideDialog(id: string): void {
        dialogs.hideDialog(id);
    }

    // ─── About ────────────────────────────────────────────────────────────────

    /** AI writing actions (phase 6) — the model proposes, the user applies. */
    public _aiAction(kind: 'summarize' | 'rewrite' | 'translate' | 'title'): void {
        void aiActions.runAiAction({ windowId: this.windowId, textarea: this.textarea }, kind);
    }

    private _showAbout(): void {
        dialogs.showAbout(this);
    }

    // ─── Exit ────────────────────────────────────────────────────────────────

    private _exitApp(): void {
        files.exitApp(this);
    }

    // ─── Title ────────────────────────────────────────────────────────────────

    public updateTitle(): void {
        const titleSpan = document.querySelector(`#${this.windowId} .window-header span`);
        if (titleSpan) {
            titleSpan.textContent = `${this.isModified ? '*' : ''}${this.currentFile} - Notapad`;
        }
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    public terminate(): void {
        const resManager = Services.get('ResourceManager');
        if (resManager && this.windowId) {
            resManager.disposeOwner(this.windowId);
        }
        this.textarea = null;
        Utils.Logger.log('[Notepad] Terminated — all listeners removed');
    }
}

// Register with Kernel
Kernel.registerApp('notepad', Notepad, {
    name: 'Notapad',
    icon: '📝',
    description: 'Simple text editor',
    singleton: true
});

export { Notepad };
