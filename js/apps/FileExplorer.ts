/**
 * WINDOWS 95 APP CENTER - FILE EXPLORER
 * Navigation of virtual file system
 * Version: 3.2 (TypeScript)
 *
 * Changelog v3.2:
 *  - FIX: Address bar ahora es funcional — pulsar Enter navega a la ruta escrita.
 *  - NEW: terminate() implementado — limpia backBtn.onclick y address bar listener.
 *  - NEW: _cleanups[] pattern para evitar memory leaks al cerrar la ventana.
 */

import { Utils } from '../utils.js';
import { VFS, type IVFSNode } from '../core/VFS.js';
import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import type { IWindowManager } from '../ui/WindowManager.js';
import type { INotify } from '../ui/NotificationManager.js';
import { WindowApp } from '../core/WindowApp.js';

export interface IFileExplorerParams {
    path?: string;
}

const EXPLORER_BODY_HTML = `
    <div class="explorer-toolbar">
        <button class="win95-btn" id="explorer-back" data-i18n="folder.back">⬅ Back</button>
        <span class="explorer-menu-hint" data-i18n="folder.menu">📁 File 📝 Edit 👁️ View ❓ Help</span>
    </div>
    <div class="explorer-address">
        <span data-i18n="folder.address">Address:</span>
        <input type="text" id="explorer-address-input" value="C:\\" readonly>
    </div>
    <div class="explorer-content" id="explorer-view-area">
        <!-- Dynamic icons here -->
    </div>
    <div class="window-statusbar">
        <span id="explorer-status">0 object(s)</span>
    </div>
`;

class FileExplorer extends WindowApp {
    public windowId: string = 'win-explorer';
    private viewId: string = 'explorer-view-area';
    private addressId: string = 'explorer-address-input';
    private currentPath: string;
    private history: string[] = [];
    private view: HTMLElement | null = null;
    private addressInput: HTMLInputElement | null = null;
    private backBtn: HTMLElement | null = null;

    constructor(params: IFileExplorerParams = {}) {
        super();
        this.currentPath = params.path || 'C:\\';
        this.init();
    }

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'C:\\',
            width: 600,
            height: 400,
            icon: '🗂️'
        });
        const body = wf.getBody(this.windowId);
        if (body) {
            body.classList.add('explorer-window');
            body.innerHTML = EXPLORER_BODY_HTML;
        }
    }

    private init(): void {
        this._ensureWindow();

        this.view = document.getElementById(this.viewId);
        this.addressInput = document.getElementById(this.addressId) as HTMLInputElement | null;
        this.backBtn = document.getElementById('explorer-back');

        // Back button
        if (this.backBtn) {
            const backHandler = () => this.goBack();
            this.backBtn.addEventListener('click', backHandler);
            this.addCleanup(() => this.backBtn?.removeEventListener('click', backHandler));
        }

        // FIX v3.2: Address bar — navegar al escribir ruta y pulsar Enter
        if (this.addressInput) {
            const addressHandler = (e: KeyboardEvent) => {
                if (e.key === 'Enter' && this.addressInput) {
                    this.navigateToPath(this.addressInput.value.trim());
                }
            };
            this.addressInput.addEventListener('keydown', addressHandler);
            this.addCleanup(() => this.addressInput?.removeEventListener('keydown', addressHandler));
        }

        this.render();
        Utils.Logger.log('File Explorer initialized');
    }

    public render(): void {
        if (!this.view) return;
        this.view.innerHTML = '';

        const folderNode = VFS.resolve(this.currentPath);

        if (folderNode && folderNode.type === 'dir' && folderNode.children) {
            Object.keys(folderNode.children).forEach(name => {
                const item = (folderNode.children as Record<string, IVFSNode>)[name];
                if (item) {
                    this.createIcon(name, item);
                }
            });
        }

        if (this.addressInput) {
            this.addressInput.value = this.currentPath;
        }

        const statusLabel = document.getElementById('explorer-status');
        if (statusLabel) {
            const children = folderNode?.children || {};
            statusLabel.textContent = `${Object.keys(children).length} object(s)`;
        }
    }

    private createIcon(name: string, data: IVFSNode): void {
        const div = document.createElement('div');
        div.className = 'explorer-icon';
        const icon = data.type === 'dir' ? '📂' : (data.icon || '📄');

        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon-img';
        iconDiv.textContent = icon;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        div.appendChild(iconDiv);
        div.appendChild(nameSpan);

        div.ondblclick = () => {
            if (data.actionType && data.actionTarget) {
                this.executeAction(data.actionType, data.actionTarget);
            } else if (data.type === 'dir') {
                this.navigateTo(name);
            } else {
                this.executeFile(name);
            }
        };

        if (this.view) this.view.appendChild(div);
    }

    private executeAction(actionType: string, actionTarget: string): void {
        const wm = Services.get('WindowManager') as IWindowManager | undefined;
        switch (actionType) {
            case 'openWindow':
                if (wm) wm.open(actionTarget);
                break;
            case 'openDialog': {
                const dialog = document.getElementById(actionTarget);
                if (dialog) dialog.style.display = 'block';
                break;
            }
            case 'launch':
                Kernel.launch(actionTarget);
                break;
            default:
                Utils.Logger.warn(`Unknown action type: ${actionType}`);
        }
    }

    private navigateTo(dirName: string): void {
        this.history.push(this.currentPath);
        this.currentPath += (this.currentPath.endsWith('\\') ? '' : '\\') + dirName;
        this.render();
    }

    /**
     * FIX v3.2: Navega a una ruta absoluta escrita manualmente en la address bar.
     * Valida que la ruta exista en el VFS antes de cambiar la vista.
     */
    private navigateToPath(path: string): void {
        if (!path) return;

        const node = VFS.resolve(path);
        if (!node) {
            const notify = Services.get('Notify') as INotify | undefined;
            if (notify) notify.warn(`Path not found: ${path}`);
            else Utils.Logger.warn(`[Explorer] Path not found: ${path}`);

            // Restaurar la ruta actual en el input
            if (this.addressInput) this.addressInput.value = this.currentPath;
            return;
        }

        if (node.type !== 'dir') {
            // Si es un fichero, abrir directamente
            const fileName = path.split('\\').pop() || '';
            this.executeFile(fileName);
            if (this.addressInput) this.addressInput.value = this.currentPath;
            return;
        }

        this.history.push(this.currentPath);
        this.currentPath = path;
        this.render();
    }

    private goBack(): void {
        if (this.history.length > 0) {
            const prev = this.history.pop();
            if (prev) {
                this.currentPath = prev;
                this.render();
            }
        }
    }

    private executeFile(name: string): void {
        const lowerName = name.toLowerCase();
        if (lowerName.endsWith('.exe')) {
            const firstPart = name.split('.')[0];
            const appId = (firstPart || '').toLowerCase();
            Kernel.launch(appId);
        } else if (lowerName.endsWith('.txt')) {
            const fullPath = this.currentPath + (this.currentPath.endsWith('\\') ? '' : '\\') + name;
            const content = VFS.readFile(fullPath);
            Kernel.launch('notepad', { file: name, content: content || '' });
        } else {
            const notify = Services.get('Notify') as INotify | undefined;
            if (notify) {
                notify.info(`Opening file: ${name} (Mock)`);
            }
        }
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    public override terminate(): void {
        super.terminate();
        this.view = null;
        this.addressInput = null;
        this.backBtn = null;
        Utils.Logger.log('[Explorer] Terminated — all listeners removed');
    }
}

// Register with Kernel
Kernel.registerApp('explorer', FileExplorer, {
    name: 'Windows Explorer',
    icon: '📂',
    description: 'File management',
    singleton: true
});

export { FileExplorer };
