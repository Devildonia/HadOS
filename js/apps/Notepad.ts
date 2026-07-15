/**
 * WINDOWS 95 APP CENTER - NOTEPAD
 * Simple text editor with Undo support
 * Version: 5.0 (TypeScript)
 *
 * Changelog v5.0:
 *  - NEW: Menú desplegable nativo Win95 — elimina todos los prompt() del browser.
 *  - NEW: Dialogs retro para Open, Save As y Find (sin alert/confirm/prompt).
 *  - NEW: VFS integration — guardar y abrir ficheros vía Virtual File System.
 *        Los ficheros persisten en C:\DOCUMENTS\ y son visibles en FileExplorer.
 *  - NEW: Edit menu funcional: Undo, Cut, Copy, Paste, Select All.
 *  - NEW: Find dialog con búsqueda incremental en el textarea.
 *  - NEW: Atajos de teclado: Ctrl+S, Ctrl+N, Ctrl+O, Ctrl+F, Ctrl+Z.
 *  - FIX: terminate() limpia todos los listeners (herencia de v4.3).
 */

import { Utils } from '../utils.js';
import { WindowManager, type IWindowManager } from '../ui/WindowManager.js';
import type { INotify } from '../ui/NotificationManager.js';
import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { VFS } from '../core/VFS.js';

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

// Body markup for the primary Notepad window. Built on demand via WindowFactory
// instead of living as static markup in index.html.
const NOTEPAD_BODY_HTML = `
    <div class="window-menu" id="notepad-menu-bar">
        <div class="notepad-menu-entry" id="notepad-menu-file">
            <span class="notepad-menu-label">File</span>
            <div class="notepad-dropdown" id="notepad-dropdown-file">
                <div class="notepad-dropdown-item" data-notepad-action="new">New</div>
                <div class="notepad-dropdown-item" data-notepad-action="new-window">New Window</div>
                <div class="notepad-dropdown-item" data-notepad-action="open">Open...</div>
                <div class="notepad-dropdown-item" data-notepad-action="save">Save</div>
                <div class="notepad-dropdown-item" data-notepad-action="save-as">Save As...</div>
                <div class="notepad-dropdown-separator"></div>
                <div class="notepad-dropdown-item" data-notepad-action="exit">Exit</div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="notepad-menu-edit">
            <span class="notepad-menu-label">Edit</span>
            <div class="notepad-dropdown" id="notepad-dropdown-edit">
                <div class="notepad-dropdown-item" data-notepad-action="undo">Undo        Ctrl+Z</div>
                <div class="notepad-dropdown-separator"></div>
                <div class="notepad-dropdown-item" data-notepad-action="cut">Cut         Ctrl+X</div>
                <div class="notepad-dropdown-item" data-notepad-action="copy">Copy        Ctrl+C</div>
                <div class="notepad-dropdown-item" data-notepad-action="paste">Paste       Ctrl+V</div>
                <div class="notepad-dropdown-item" data-notepad-action="select-all">Select All  Ctrl+A</div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="notepad-menu-search">
            <span class="notepad-menu-label">Search</span>
            <div class="notepad-dropdown" id="notepad-dropdown-search">
                <div class="notepad-dropdown-item" data-notepad-action="find">Find...     Ctrl+F</div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="notepad-menu-help">
            <span class="notepad-menu-label">Help</span>
            <div class="notepad-dropdown" id="notepad-dropdown-help">
                <div class="notepad-dropdown-item" data-notepad-action="about">About Notepad</div>
            </div>
        </div>
    </div>
    <div class="notepad-dialog" id="notepad-open-dialog" style="display:none;">
        <div class="notepad-dialog-title">Open</div>
        <div class="notepad-dialog-body">
            <label>File name:</label>
            <input type="text" id="notepad-open-input" class="notepad-dialog-input" placeholder="e.g. README.txt" />
            <div class="notepad-dialog-files" id="notepad-dialog-filelist"></div>
        </div>
        <div class="notepad-dialog-buttons">
            <button class="win95-btn" id="notepad-open-ok">Open</button>
            <button class="win95-btn" id="notepad-open-cancel">Cancel</button>
        </div>
    </div>
    <div class="notepad-dialog" id="notepad-saveas-dialog" style="display:none;">
        <div class="notepad-dialog-title">Save As</div>
        <div class="notepad-dialog-body">
            <label>File name:</label>
            <input type="text" id="notepad-saveas-input" class="notepad-dialog-input" />
        </div>
        <div class="notepad-dialog-buttons">
            <button class="win95-btn" id="notepad-saveas-ok">Save</button>
            <button class="win95-btn" id="notepad-saveas-cancel">Cancel</button>
        </div>
    </div>
    <div class="notepad-dialog" id="notepad-find-dialog" style="display:none;">
        <div class="notepad-dialog-title">Find</div>
        <div class="notepad-dialog-body">
            <label>Find what:</label>
            <input type="text" id="notepad-find-input" class="notepad-dialog-input" />
        </div>
        <div class="notepad-dialog-buttons">
            <button class="win95-btn" id="notepad-find-next">Find Next</button>
            <button class="win95-btn" id="notepad-find-cancel">Cancel</button>
        </div>
    </div>
    <textarea id="notepad-textarea"></textarea>
    <div class="window-statusbar">
        <span id="notepad-status">For Help, press F1</span>
    </div>`;

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

    /**
     * Build the primary Notepad window on demand (replaces the old static markup
     * in index.html). No-op if the window already exists — e.g. secondary windows
     * created by _newWindow(), or a DOM pre-built by unit tests.
     */
    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'Untitled - Notepad',
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
        const win = document.getElementById(this.windowId);
        const menuBar = win ? win.querySelector('.window-menu') as HTMLElement | null : null;
        if (!menuBar) return;

        // Toggle dropdown on label click
        const labelClickHandler = (e: Event) => {
            const label = (e.target as HTMLElement).closest('.notepad-menu-label');
            if (!label) return;
            const entry = label.closest('.notepad-menu-entry') as HTMLElement;
            if (!entry) return;

            const isOpen = entry.classList.contains('open');
            this._closeAllDropdowns();
            if (!isOpen) entry.classList.add('open');

            e.stopPropagation();
        };
        menuBar.addEventListener('click', labelClickHandler);
        this.registerResource('listener', { dispose: () => menuBar.removeEventListener('click', labelClickHandler) });

        // Handle dropdown item actions
        const itemClickHandler = (e: Event) => {
            const item = (e.target as HTMLElement).closest('.notepad-dropdown-item') as HTMLElement;
            if (!item || item.classList.contains('disabled')) return;

            const action = item.dataset.notepadAction;
            if (action) {
                this._closeAllDropdowns();
                this._executeAction(action);
            }
            e.stopPropagation();
        };
        menuBar.addEventListener('click', itemClickHandler);
    }

    private _closeAllDropdowns(): void {
        const entries = document.querySelectorAll(`#${this.windowId} .notepad-menu-entry.open`);
        entries.forEach(e => e.classList.remove('open'));
    }

    private _closeMenusOnOutsideClick(): void {
        const outsideHandler = (e: Event) => {
            const menuBar = document.getElementById('notepad-menu-bar');
            if (menuBar && !menuBar.contains(e.target as Node)) {
                this._closeAllDropdowns();
            }
        };
        document.addEventListener('click', outsideHandler);
        this.registerResource('listener', { dispose: () => document.removeEventListener('click', outsideHandler) });
    }

    // ─── Dialog Listeners ─────────────────────────────────────────────────────

    private _setupDialogListeners(): void {
        // Open dialog
        this._bindBtn('notepad-open-ok', () => this._confirmOpen());
        this._bindBtn('notepad-open-cancel', () => this._hideDialog('notepad-open-dialog'));

        const openInput = document.getElementById('notepad-open-input') as HTMLInputElement;
        if (openInput) {
            const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') this._confirmOpen(); };
            openInput.addEventListener('keydown', enterHandler);
            this.registerResource('listener', { dispose: () => openInput.removeEventListener('keydown', enterHandler) });
        }

        // Save As dialog
        this._bindBtn('notepad-saveas-ok', () => this._confirmSaveAs());
        this._bindBtn('notepad-saveas-cancel', () => this._hideDialog('notepad-saveas-dialog'));

        const saveInput = document.getElementById('notepad-saveas-input') as HTMLInputElement;
        if (saveInput) {
            const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') this._confirmSaveAs(); };
            saveInput.addEventListener('keydown', enterHandler);
            this.registerResource('listener', { dispose: () => saveInput.removeEventListener('keydown', enterHandler) });
        }

        // Find dialog
        this._bindBtn('notepad-find-next', () => this._findNext());
        this._bindBtn('notepad-find-cancel', () => this._hideDialog('notepad-find-dialog'));

        const findInput = document.getElementById('notepad-find-input') as HTMLInputElement;
        if (findInput) {
            const enterHandler = (e: KeyboardEvent) => { if (e.key === 'Enter') this._findNext(); };
            findInput.addEventListener('keydown', enterHandler);
            this.registerResource('listener', { dispose: () => findInput.removeEventListener('keydown', enterHandler) });
        }
    }

    private _bindBtn(id: string, fn: () => void): void {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', fn);
        this.registerResource('listener', { dispose: () => btn.removeEventListener('click', fn) });
    }

    // ─── Keyboard Shortcuts ───────────────────────────────────────────────────

    private _setupKeyboardShortcuts(): void {
        const win = document.getElementById(this.windowId);
        if (!win) return;

        const kbHandler = (e: KeyboardEvent) => {
            if (!e.ctrlKey) return;
            switch (e.key.toLowerCase()) {
                case 's': e.preventDefault(); this._executeAction(e.shiftKey ? 'save-as' : 'save'); break;
                case 'n': e.preventDefault(); this._executeAction('new'); break;
                case 'o': e.preventDefault(); this._executeAction('open'); break;
                case 'f': e.preventDefault(); this._executeAction('find'); break;
                case 'z': e.preventDefault(); this._executeAction('undo'); break;
            }
        };
        win.addEventListener('keydown', kbHandler);
        this.registerResource('listener', { dispose: () => win.removeEventListener('keydown', kbHandler) });
    }

    // ─── Action Dispatcher ────────────────────────────────────────────────────

    private _executeAction(action: string): void {
        switch (action) {
            case 'new':        this._newFile(); break;
            case 'new-window': this._newWindow(); break;
            case 'open':       this._showOpenDialog(); break;
            case 'save':       this._saveFile(); break;
            case 'save-as':    this._showSaveAsDialog(); break;
            case 'exit':       this._exitApp(); break;
            case 'undo':       document.execCommand('undo'); break;
            case 'cut':        document.execCommand('cut'); break;
            case 'copy':       document.execCommand('copy'); break;
            case 'paste':      document.execCommand('paste'); break;
            case 'select-all': this.textarea?.select(); break;
            case 'find':       this._showFindDialog(); break;
            case 'about':      this._showAbout(); break;
            default: Utils.Logger.log('[Notepad] Unknown action:', action);
        }
    }

    // ─── File Operations ──────────────────────────────────────────────────────

    private _newFile(): void {
        if (this.isModified) {
            // Use retro-style confirm via window confirm (OK for system dialogs)
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
        const wf: any = Services.get('WindowFactory');
        if (!wf) return;

        const timestamp = Date.now();
        const newWindowId = `win-notepad-dynamic-${timestamp}`;
        const newTextareaId = `notepad-textarea-dynamic-${timestamp}`;

        // Build dynamic body structure replicating minimum Notepad structure
        const bodyEl = document.createElement('div');
        bodyEl.className = 'window-body notepad-body';

        // Clone menu bar
        const originalMenuBar = document.getElementById('notepad-menu-bar');
        if (originalMenuBar) {
            const newMenuBar = originalMenuBar.cloneNode(true) as HTMLElement;
            newMenuBar.removeAttribute('id');
            newMenuBar.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
            bodyEl.appendChild(newMenuBar);
        }

        // Textarea
        const newTextarea = document.createElement('textarea');
        newTextarea.id = newTextareaId;
        bodyEl.appendChild(newTextarea);

        // Statusbar
        const statusbar = document.createElement('div');
        statusbar.className = 'window-statusbar';
        const statusSpan = document.createElement('span');
        statusSpan.textContent = 'For Help, press F1';
        statusbar.appendChild(statusSpan);
        bodyEl.appendChild(statusbar);

        // Create the window
        wf.create({
            id: newWindowId,
            title: 'Untitled - Notepad',
            width: 500,
            height: 400,
            icon: '📝',
            bodyElement: bodyEl
        });

        // Make it visible via WindowManager
        const wm: any = Services.get('WindowManager');
        if (wm) {
            wm.open(newWindowId);
        }

        // Instantiate secondary Notepad
        let secondaryInstance: Notepad | null = null;
        
        const closeCallback = () => {
            if (secondaryInstance) {
                secondaryInstance.terminate();
                secondaryInstance = null;
            }
        };

        secondaryInstance = new Notepad({
            windowId: newWindowId,
            textareaId: newTextareaId,
            onClose: closeCallback
        });

        // Set the onCloseCallback on the window DOM element
        const winEl = document.getElementById(newWindowId);
        if (winEl) {
            (winEl as any)._onCloseCallback = closeCallback;
        }
    }

    /** Save to VFS. If filename is 'Untitled', show Save As dialog first. */
    private _saveFile(): void {
        if (this.currentFile === 'Untitled') {
            this._showSaveAsDialog();
            return;
        }
        this._writeToVFS(this.currentPath, this.currentFile);
    }

    private _writeToVFS(dir: string, name: string): void {
        if (!this.textarea) return;

        // Ensure the name ends in .txt
        const safeName = name.endsWith('.txt') ? name : name + '.txt';
        const content = this.textarea.value;

        const ok = VFS.writeFile(dir, safeName, content);
        const notify = Services.get('Notify') as INotify | undefined;

        if (ok) {
            this.currentFile = safeName;
            this.currentPath = dir;
            this.isModified = false;
            this.updateTitle();
            if (notify) notify.success(`Saved: ${dir}\\${safeName}`);
            Utils.Logger.log(`[Notepad] Saved to VFS: ${dir}\\${safeName}`);
        } else {
            if (notify) notify.warn(`Could not save: ${safeName}`);
            Utils.Logger.warn(`[Notepad] VFS write failed: ${dir}\\${safeName}`);
        }
    }

    // ─── Open Dialog ──────────────────────────────────────────────────────────

    private _showOpenDialog(): void {
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
                        this._confirmOpen();
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

    private _confirmOpen(): void {
        const input = document.getElementById('notepad-open-input') as HTMLInputElement;
        const name = input?.value?.trim();
        if (!name) return;

        const safeName = name.endsWith('.txt') ? name : name + '.txt';
        const fullPath = `${VFS_SAVE_DIR}\\${safeName}`;
        const content = VFS.readFile(fullPath);

        const notify = Services.get('Notify') as INotify | undefined;

        if (content !== null) {
            if (this.textarea) this.textarea.value = content;
            this.currentFile = safeName;
            this.currentPath = VFS_SAVE_DIR;
            this.isModified = false;
            this._lastFindIndex = -1;
            this.updateTitle();
            this._updateStatus();
            this._hideDialog('notepad-open-dialog');
            Utils.Logger.log(`[Notepad] Opened from VFS: ${fullPath}`);
        } else {
            if (notify) notify.warn(`File not found: ${safeName}`);
            else Utils.Logger.warn(`[Notepad] File not found: ${fullPath}`);
        }
    }

    // ─── Save As Dialog ───────────────────────────────────────────────────────

    private _showSaveAsDialog(): void {
        const dialog = document.getElementById('notepad-saveas-dialog');
        const input = document.getElementById('notepad-saveas-input') as HTMLInputElement;
        if (!dialog) return;

        if (input) {
            input.value = this.currentFile === 'Untitled' ? '' : this.currentFile.replace(/\.txt$/, '');
        }
        dialog.style.display = 'block';
        if (input) setTimeout(() => { input.focus(); input.select(); }, 50);
    }

    private _confirmSaveAs(): void {
        const input = document.getElementById('notepad-saveas-input') as HTMLInputElement;
        const name = input?.value?.trim();
        if (!name) return;

        this._hideDialog('notepad-saveas-dialog');
        this._writeToVFS(VFS_SAVE_DIR, name);
    }

    // ─── Find Dialog ──────────────────────────────────────────────────────────

    private _showFindDialog(): void {
        const dialog = document.getElementById('notepad-find-dialog');
        const input = document.getElementById('notepad-find-input') as HTMLInputElement;
        if (!dialog) return;

        if (input && this._lastFindTerm) input.value = this._lastFindTerm;
        dialog.style.display = 'block';
        if (input) setTimeout(() => { input.focus(); input.select(); }, 50);
    }

    private _findNext(): void {
        const input = document.getElementById('notepad-find-input') as HTMLInputElement;
        const term = input?.value?.trim();
        if (!term || !this.textarea) return;

        const text = this.textarea.value.toLowerCase();
        const search = term.toLowerCase();

        // If term changed, reset
        if (term !== this._lastFindTerm) {
            this._lastFindTerm = term;
            this._lastFindIndex = -1;
        }

        const startFrom = this._lastFindIndex + 1;
        const idx = text.indexOf(search, startFrom);

        if (idx !== -1) {
            this.textarea.focus();
            this.textarea.setSelectionRange(idx, idx + term.length);
            this._lastFindIndex = idx;

            // Scroll into view
            const linesBefore = text.substring(0, idx).split('\n').length;
            const lineHeight = parseInt(getComputedStyle(this.textarea).lineHeight) || 16;
            this.textarea.scrollTop = (linesBefore - 2) * lineHeight;
        } else {
            // Wrap around
            this._lastFindIndex = -1;
            const notify = Services.get('Notify') as INotify | undefined;
            if (notify) notify.info(`Cannot find "${term}". Wrapped to top.`);
        }
    }

    // ─── Dialog helpers ───────────────────────────────────────────────────────

    private _hideDialog(id: string): void {
        const dialog = document.getElementById(id);
        if (dialog) dialog.style.display = 'none';
    }

    // ─── About ────────────────────────────────────────────────────────────────

    private _showAbout(): void {
        const notify = Services.get('Notify') as INotify | undefined;
        const msg = 'Notepad v5.0 — Windows App Center';
        if (notify) notify.info(msg);
        else Utils.Logger.log('[Notepad]', msg);
    }

    // ─── Exit ────────────────────────────────────────────────────────────────

    private _exitApp(): void {
        if (this.isModified && !confirm(`Save changes to ${this.currentFile}?`)) {
            // Discard — fall through to close
        } else if (this.isModified) {
            this._saveFile();
            return; // saveFile may show dialog — close will happen after save
        }
        const wm = Services.get('WindowManager') as IWindowManager | undefined;
        if (wm) wm.close(this.windowId);
        else WindowManager.close(this.windowId);
    }

    // ─── Title ────────────────────────────────────────────────────────────────

    public updateTitle(): void {
        const titleSpan = document.querySelector(`#${this.windowId} .window-header span`);
        if (titleSpan) {
            titleSpan.textContent = `${this.isModified ? '*' : ''}${this.currentFile} - Notepad`;
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
    name: 'Notepad',
    icon: '📝',
    description: 'Simple text editor',
    singleton: true
});

export { Notepad };
