import { Kernel } from '../../core/Kernel.js';
import { Utils } from '../../utils.js';
import { i18n } from '../../services/i18n.js';

export class ProcessesTab {
    private container: HTMLElement;
    private activeRowPid: number | null = null;
    private _lastProcessesState: string = '';

    constructor(container: HTMLElement) {
        this.container = container;
    }

    public getActiveRowPid(): number | null {
        return this.activeRowPid;
    }

    public setActiveRowPid(pid: number | null): void {
        this.activeRowPid = pid;
    }

    public highlightRow(): void {
        const rows = this.container.querySelectorAll('#tm-process-list tr');
        rows.forEach(tr => {
            const pidStr = tr.getAttribute('data-pid');
            if (pidStr && parseInt(pidStr, 10) === this.activeRowPid) {
                tr.classList.add('active');
            } else {
                tr.classList.remove('active');
            }
        });
    }

    public render(processes: any[], apps: any): void {
        const tbody = this.container.querySelector('#tm-process-list') as HTMLElement | null;
        if (!tbody) return;

        // Incremental rendering check: compare PIDs/statuses
        const stateStr = processes.map(p => `${p.pid}:${p.appId}:${p.status}:${p.windowId}`).join(',');
        if (stateStr === this._lastProcessesState) {
            return;
        }
        this._lastProcessesState = stateStr;

        const endTaskLabel = i18n.t('taskmanager.endtask');
        tbody.innerHTML = '';
        processes.forEach(proc => {
            const appEntry = apps[proc.appId];
            const appName = appEntry ? appEntry.metadata.name : 'Unknown';
            const icon = appEntry ? appEntry.metadata.icon || '⚙️' : '⚙️';

            const tr = document.createElement('tr');
            tr.setAttribute('data-pid', String(proc.pid));
            tr.tabIndex = 0; // Focusable row

            const statusClass = proc.status === 'running' ? 'tm-status-running' : 'tm-status-terminated';

            tr.innerHTML = `
                <td>${proc.pid}</td>
                <td><span style="margin-right: 4px;">${icon}</span>${Utils.escapeHTML(appName)}</td>
                <td>${Utils.escapeHTML(proc.windowId || '—')}</td>
                <td class="${statusClass}">${proc.status}</td>
                <td>
                    <button class="hados-btn tm-kill-btn" data-pid="${proc.pid}" style="padding: 1px 6px; min-height: 18px; font-size: 10px;">
                        ${endTaskLabel}
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        this.highlightRow();

        // Update process count footer
        const footer = this.container.querySelector('#tm-process-footer');
        if (footer) {
            footer.textContent = `Processes: ${Kernel.getActiveCount()}`;
        }
    }

    public handleClick(e: Event): void {
        const target = e.target as HTMLElement;
        
        // End task execution
        if (target.classList.contains('tm-kill-btn') || target.closest('.tm-kill-btn')) {
            const btn = target.classList.contains('tm-kill-btn') ? target : target.closest('.tm-kill-btn') as HTMLElement;
            const pidStr = btn.getAttribute('data-pid');
            if (pidStr) {
                Kernel.kill(parseInt(pidStr, 10));
            }
            e.stopPropagation();
            return;
        }

        // Row selection
        const tr = target.closest('tr');
        if (tr) {
            const pidStr = tr.getAttribute('data-pid');
            if (pidStr) {
                this.activeRowPid = parseInt(pidStr, 10);
                this.highlightRow();
            }
        }
    }
}
