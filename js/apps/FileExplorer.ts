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
import { i18n } from '../services/i18n.js';
import { Services } from '../core/ServiceContainer.js';
import type { IWindowManager } from '../ui/WindowManager.js';
import type { INotify } from '../ui/NotificationManager.js';
import { WindowApp } from '../core/WindowApp.js';

export interface IFileExplorerParams {
    path?: string;
}

/**
 * The virtual root above the drives — "This PC". It is not a VFS node (the VFS is
 * rooted at C:); FileExplorer special-cases it to render the drive list instead of a
 * folder. Navigating up from C:\ lands here.
 */
export const THIS_PC = 'This PC';

/** Human-readable byte size. Kept local — HardwareProbe's copy is module-private. */
function formatBytes(n: number): string {
    if (!Number.isFinite(n) || n <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
    return `${(n / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * The one live explorer instance (it's a singleton). Entry points use
 * `openExplorerAt` so that clicking "My Computer" or "Games" navigates the window
 * that is already open, instead of Kernel.launch merely re-focusing it at its old
 * path.
 */
let liveInstance: FileExplorer | null = null;

/** Opens FileX at `path`, navigating an already-open window rather than re-focusing it. */
export function openExplorerAt(path: string): void {
    if (liveInstance) {
        liveInstance.navigate(path);
        const wm = Services.get('WindowManager') as IWindowManager | undefined;
        if (wm) {
            wm.open('win-explorer');
            const win = document.getElementById('win-explorer');
            if (win) wm.bringToFront(win);
        }
    } else {
        Kernel.launch('explorer', { path });
    }
}

const EXPLORER_BODY_HTML = `
    <div class="explorer-toolbar">
        <button class="hados-btn" id="explorer-back" data-i18n="folder.back">⬅ Back</button>
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
        liveInstance = this;
        this.init();
    }

    /** Navigates to a path (a VFS folder or the virtual "This PC" root), pushing
     *  history so Back returns. Public entry point used by openExplorerAt. */
    public navigate(path: string): void {
        if (path === this.currentPath) return;
        this.history.push(this.currentPath);
        this.currentPath = path;
        this.render();
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

        // Re-render on language change so an open window's folder labels update live.
        const onLangChange = (): void => this.render();
        window.addEventListener('languagechanged', onLangChange);
        this.addCleanup(() => window.removeEventListener('languagechanged', onLangChange));

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

        if (this.currentPath === THIS_PC) {
            this.renderThisPc();
            return;
        }

        const folderNode = VFS.resolve(this.currentPath);

        if (folderNode && folderNode.type === 'dir' && folderNode.children) {
            Object.keys(folderNode.children).forEach(name => {
                const item = (folderNode.children as Record<string, IVFSNode>)[name];
                if (item && !item.hidden) {
                    this.createIcon(name, item);
                }
            });
        }

        if (this.addressInput) {
            this.addressInput.value = this.currentPath;
        }
        this.setTitle(this.currentPath);

        const statusLabel = document.getElementById('explorer-status');
        if (statusLabel) {
            const children = folderNode?.children || {};
            const visibleCount = Object.values(children).filter(item => !item.hidden).length;
            statusLabel.textContent = `${visibleCount} object(s)`;
        }
    }

    /**
     * The "This PC" view: the machine's drives. The browser sandbox cannot see the
     * host's physical disks, so there is exactly one honest drive — HadOS (C:),
     * backed by the VFS — and its capacity is the REAL storage quota/usage reported
     * by `navigator.storage.estimate()`, the same figure the BIOS reads.
     */
    private renderThisPc(): void {
        if (this.addressInput) this.addressInput.value = THIS_PC;
        this.setTitle(THIS_PC);

        const card = document.createElement('div');
        card.className = 'explorer-drive';
        card.innerHTML = `
            <div class="drive-icon">🖴</div>
            <div class="drive-info">
                <div class="drive-name">HadOS (C:)</div>
                <div class="drive-meter"><div class="drive-meter-fill" style="width:0%"></div></div>
                <div class="drive-caption">Reading storage…</div>
            </div>`;
        card.ondblclick = () => this.navigate('C:\\');
        if (this.view) this.view.appendChild(card);

        const status = document.getElementById('explorer-status');
        if (status) status.textContent = '1 drive';

        // Fill in the real numbers once the async estimate resolves.
        void this.fillDriveCapacity(card);
    }

    private async fillDriveCapacity(card: HTMLElement): Promise<void> {
        const fill = card.querySelector('.drive-meter-fill') as HTMLElement | null;
        const caption = card.querySelector('.drive-caption') as HTMLElement | null;
        try {
            const est = await navigator.storage?.estimate?.();
            const quota = est?.quota ?? 0;
            const usage = est?.usage ?? 0;
            if (quota > 0) {
                const pct = Math.min(100, Math.round((usage / quota) * 100));
                if (fill) fill.style.width = `${pct}%`;
                if (caption) caption.textContent = `${formatBytes(quota - usage)} free of ${formatBytes(quota)}`;
                return;
            }
        } catch { /* fall through to the unknown-capacity caption */ }
        if (caption) caption.textContent = 'Local storage';
    }

    /** Retitles the window (falls back silently if the WindowManager can't). */
    private setTitle(title: string): void {
        const header = document.querySelector(`#${this.windowId} .window-header span`);
        if (header) header.textContent = title;
    }

    private createIcon(name: string, data: IVFSNode): void {
        const div = document.createElement('div');
        div.className = 'explorer-icon';
        const icon = data.type === 'dir' ? '📂' : (data.icon || '📄');

        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon-img';
        iconDiv.textContent = icon;
        const nameSpan = document.createElement('span');
        // The DISPLAY label is translated when the node carries an i18nKey; the raw
        // `name` stays the path segment used for navigation (dblclick → navigateTo).
        nameSpan.textContent = data.i18nKey ? i18n.t(data.i18nKey) : name;
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
            case 'explorer':
                // A shortcut that opens the explorer at a path (or "This PC").
                openExplorerAt(actionTarget);
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

        // "This PC" is the virtual drive root, not a VFS node — accept it by name.
        if (path === THIS_PC) {
            this.navigate(THIS_PC);
            return;
        }

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
        if (liveInstance === this) liveInstance = null;
        this.view = null;
        this.addressInput = null;
        this.backBtn = null;
        Utils.Logger.log('[Explorer] Terminated — all listeners removed');
    }
}

// Register with Kernel
Kernel.registerApp('explorer', FileExplorer, {
    name: 'FileX',
    icon: '📂',
    description: 'File management',
    singleton: true
});

export { FileExplorer };
