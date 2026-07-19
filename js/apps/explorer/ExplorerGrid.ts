import { VFS, type IVFSNode } from '../../core/VFS.js';
import { Kernel } from '../../core/Kernel.js';
import { Services } from '../../core/ServiceContainer.js';
import { Utils } from '../../utils.js';
import { i18n } from '../../services/i18n.js';
import type { IWindowManager } from '../../ui/WindowManager.js';
import type { INotify } from '../../ui/NotificationManager.js';
import { openExplorerAt } from '../FileExplorer.js';

export class ExplorerGrid {
    private view: HTMLElement;
    private onNavigate: (path: string) => void;
    private getPath: () => string;

    constructor(view: HTMLElement, onNavigate: (path: string) => void, getPath: () => string) {
        this.view = view;
        this.onNavigate = onNavigate;
        this.getPath = getPath;
    }

    private formatBytes(n: number): string {
        if (!Number.isFinite(n) || n <= 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
        return `${(n / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
    }

    public renderThisPc(): void {
        this.view.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'explorer-drive';
        card.innerHTML = `
            <div class="drive-icon">🖴</div>
            <div class="drive-info">
                <div class="drive-name">HadOS (C:)</div>
                <div class="drive-meter"><div class="drive-meter-fill" style="width:0%"></div></div>
                <div class="drive-caption">Reading storage…</div>
            </div>`;
        card.ondblclick = () => this.onNavigate('C:\\');
        this.view.appendChild(card);

        const status = document.getElementById('explorer-status');
        if (status) status.textContent = '1 drive';

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
                if (caption) caption.textContent = `${this.formatBytes(quota - usage)} free of ${this.formatBytes(quota)}`;
                return;
            }
        } catch { /* fallback */ }
        if (caption) caption.textContent = 'Local storage';
    }

    public renderFolder(currentPath: string): void {
        this.view.innerHTML = '';
        const folderNode = VFS.resolve(currentPath);

        if (folderNode && folderNode.type === 'dir' && folderNode.children) {
            Object.keys(folderNode.children).forEach(name => {
                const item = (folderNode.children as Record<string, IVFSNode>)[name];
                if (item && !item.hidden) {
                    this.createIcon(name, item);
                }
            });
        }

        const statusLabel = document.getElementById('explorer-status');
        if (statusLabel) {
            const children = folderNode?.children || {};
            const visibleCount = Object.values(children).filter(item => !item.hidden).length;
            statusLabel.textContent = `${visibleCount} object(s)`;
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
        nameSpan.textContent = data.i18nKey ? i18n.t(data.i18nKey) : name;
        div.appendChild(iconDiv);
        div.appendChild(nameSpan);

        div.ondblclick = () => {
            if (data.actionType && data.actionTarget) {
                this.executeAction(data.actionType, data.actionTarget);
            } else if (data.type === 'dir') {
                const current = this.getPath();
                const nextPath = current + (current.endsWith('\\') ? '' : '\\') + name;
                this.onNavigate(nextPath);
            } else {
                this.executeFile(name);
            }
        };

        this.view.appendChild(div);
    }

    public executeAction(actionType: string, actionTarget: string): void {
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
                openExplorerAt(actionTarget);
                break;
            default:
                Utils.Logger.warn(`Unknown action type: ${actionType}`);
        }
    }

    public executeFile(name: string): void {
        const lowerName = name.toLowerCase();
        const current = this.getPath();
        if (lowerName.endsWith('.exe')) {
            const firstPart = name.split('.')[0];
            const appId = (firstPart || '').toLowerCase();
            Kernel.launch(appId);
        } else if (lowerName.endsWith('.txt')) {
            const fullPath = current + (current.endsWith('\\') ? '' : '\\') + name;
            const content = VFS.readFile(fullPath);
            Kernel.launch('notepad', { file: name, content: content || '' });
        } else {
            const notify = Services.get('Notify') as INotify | undefined;
            if (notify) {
                notify.info(`Opening file: ${name} (Mock)`);
            }
        }
    }
}
