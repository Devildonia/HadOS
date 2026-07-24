import { Utils } from '../utils.js';
import { VFS } from '../core/VFS.js';
import { Kernel } from '../core/Kernel.js';
import { EventBus } from '../core/EventBus.js';
import { Services } from '../core/ServiceContainer.js';
import { WindowApp } from '../core/WindowApp.js';
import { ExplorerGrid } from './explorer/ExplorerGrid.js';
import { ExplorerAddress } from './explorer/ExplorerAddress.js';

export interface IFileExplorerParams {
    path?: string;
}

export const THIS_PC = 'This PC';

let liveInstance: FileExplorer | null = null;

export function openExplorerAt(path: string): void {
    if (liveInstance) {
        liveInstance.navigate(path);
        const wm = Services.get('WindowManager') as any;
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
    
    public history: string[] = [];
    private grid: ExplorerGrid | null = null;
    private address: ExplorerAddress | null = null;

    private view: HTMLElement | null = null;
    private addressInput: HTMLInputElement | null = null;
    private backBtn: HTMLElement | null = null;

    constructor(params: IFileExplorerParams = {}) {
        super();
        this.currentPath = params.path || 'C:\\';
        this.history = [];
        liveInstance = this;
        this.init();
    }

    public navigate(path: string): void {
        if (path === this.currentPath) return;
        this.history.push(this.currentPath);
        this.currentPath = path;
        this.render();
    }

    public navigateTo(dirName: string): void {
        this.history.push(this.currentPath);
        this.currentPath += (this.currentPath.endsWith('\\') ? '' : '\\') + dirName;
        this.render();
    }

    public executeFile(name: string): void {
        this.grid?.executeFile(name);
    }

    public executeAction(actionType: string, actionTarget: string): void {
        this.grid?.executeAction(actionType, actionTarget);
    }

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory') as any;
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'C:\\',
            width: 600,
            height: 400,
            icon: 'assets/icons/filex.webp'
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

        if (this.view) {
            this.grid = new ExplorerGrid(
                this.view,
                (path) => this.navigate(path),
                () => this.currentPath
            );
        }

        if (this.addressInput && this.grid) {
            this.address = new ExplorerAddress(
                this.addressInput,
                () => this.currentPath,
                (path) => this.navigate(path),
                (file) => this.grid?.executeFile(file)
            );
        }

        // Back button
        if (this.backBtn) {
            const backHandler = () => this.goBack();
            this.backBtn.addEventListener('click', backHandler);
            this.addCleanup(() => this.backBtn?.removeEventListener('click', backHandler));
        }

        // Re-render on language change so an open window's folder labels update live.
        // 'languagechanged' rides the EventBus since the event unification.
        const unsubLang = EventBus.on('languagechanged', () => this.render());
        this.addCleanup(unsubLang);

        if (this.addressInput && this.address) {
            const addressHandler = (e: KeyboardEvent) => this.address?.handleKeyDown(e);
            this.addressInput.addEventListener('keydown', addressHandler);
            this.addCleanup(() => this.addressInput?.removeEventListener('keydown', addressHandler));
        }

        this.render();
        Utils.Logger.log('File Explorer initialized');
    }

    public render(): void {
        if (!this.view || !this.grid) return;

        if (this.currentPath === THIS_PC) {
            this.grid.renderThisPc();
            if (this.addressInput) this.addressInput.value = THIS_PC;
            this.setTitle(THIS_PC);
            return;
        }

        this.grid.renderFolder(this.currentPath);

        if (this.addressInput) {
            this.addressInput.value = this.currentPath;
        }
        this.setTitle(this.currentPath);
    }

    private setTitle(title: string): void {
        const header = document.querySelector(`#${this.windowId} .window-header span`);
        if (header) header.textContent = title;
    }

    public goBack(): void {
        if (this.history.length > 0) {
            const prev = this.history.pop();
            if (prev) {
                this.currentPath = prev;
                this.render();
            }
        }
    }

    public override terminate(): void {
        super.terminate();
        if (liveInstance === this) liveInstance = null;
        this.view = null;
        this.addressInput = null;
        this.backBtn = null;
        this.grid = null;
        this.address = null;
        Utils.Logger.log('[Explorer] Terminated — all listeners removed');
    }
}

// Register with Kernel
Kernel.registerApp('explorer', FileExplorer, {
    name: 'FileX',
    icon: 'assets/icons/filex.webp',
    description: 'File management',
    singleton: true
});

export { FileExplorer };
