import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';

export class TaskManager implements IWindowsApp {
    public windowId: string = '';
    private intervalId: number | null = null;
    private container: HTMLElement | null = null;
    private activeRowPid: number | null = null;
    
    private boundProcessStarted: EventListener;
    private boundProcessStopped: EventListener;
    private boundTabClick: EventListener;
    private boundProcessListClick: EventListener;

    constructor() {
        this.boundProcessStarted = () => this.refreshUI();
        this.boundProcessStopped = () => this.refreshUI();
        this.boundTabClick = (e: Event) => {
            const btn = e.currentTarget as HTMLElement;
            const tabButtons = this.container?.querySelectorAll('.tab-btn');
            const tabContents = this.container?.querySelectorAll('.tab-content');
            if (tabButtons && tabContents) {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => {
                    c.classList.remove('active');
                    (c as HTMLElement).style.display = 'none';
                });
                btn.classList.add('active');
                const targetTab = btn.getAttribute('data-tab');
                const targetContent = this.container?.querySelector(`#tab-${targetTab}`) as HTMLElement | null;
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.style.display = targetTab === 'processes' ? 'flex' : 'block';
                }
            }
        };
        this.boundProcessListClick = (e: Event) => {
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
        };
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.taskmanager');

        this.windowId = WindowFactory.create({
            title: title,
            width: 480,
            height: 420,
            resizable: true,
            icon: '📊'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupLayout();
        this.refreshUI();

        this.intervalId = window.setInterval(() => this.refreshUI(), 1000);

        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.register('taskmanager', 'timer', {
                dispose: () => {
                    if (this.intervalId !== null) {
                        window.clearInterval(this.intervalId);
                        this.intervalId = null;
                    }
                }
            });
        }

        Utils.eventManager.add(window, 'kernel:process-started', this.boundProcessStarted);
        Utils.eventManager.add(window, 'kernel:process-stopped', this.boundProcessStopped);
    }

    private setupLayout(): void {
        if (!this.container) return;

        const tabProcName = i18n.t('taskmanager.processes');
        const tabPerfName = i18n.t('taskmanager.performance');
        const tabSystName = i18n.t('taskmanager.system');

        this.container.innerHTML = `
            <div id="task-manager">
                <div class="tabs-container">
                    <button class="tab-btn active" data-tab="processes">${tabProcName}</button>
                    <button class="tab-btn" data-tab="performance">${tabPerfName}</button>
                    <button class="tab-btn" data-tab="system">${tabSystName}</button>
                </div>
                
                <!-- Tab: Processes -->
                <div class="tab-content active" id="tab-processes" style="display: flex; flex-direction: column; height: calc(100% - 30px);">
                    <div class="tm-table-container">
                        <table class="tm-table" aria-label="Active processes list">
                            <thead>
                                <tr>
                                    <th>PID</th>
                                    <th>App</th>
                                    <th>Window ID</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="tm-process-list"></tbody>
                        </table>
                    </div>
                    <div style="font-family: var(--os-font-family); font-size: 11px;" id="tm-process-footer">
                        Processes: 0
                    </div>
                </div>

                <!-- Tab: Performance -->
                <div class="tab-content" id="tab-performance" style="display: none; height: calc(100% - 30px); overflow-y: auto;">
                    <fieldset style="border: 2px solid var(--border-light); padding: 8px; margin: 0; margin-bottom: 8px;">
                        <legend style="font-family: var(--os-font-family); font-size: 11px;">Tracked Resources</legend>
                        <div id="tm-performance-metrics"></div>
                    </fieldset>
                    
                    <fieldset style="border: 2px solid var(--border-light); padding: 8px; margin: 0;">
                        <legend style="font-family: var(--os-font-family); font-size: 11px;">System Health</legend>
                        <div class="tm-meter-row">
                            <span class="tm-meter-label">Tracked Listeners:</span>
                            <span class="tm-meter-val" id="tm-perf-listeners">0</span>
                            <div class="tm-meter-container">
                                <div class="tm-meter-fill" id="tm-fill-listeners" style="width: 0%;"></div>
                            </div>
                        </div>
                        <div class="tm-meter-row">
                            <span class="tm-meter-label">JS Heap Usage:</span>
                            <span class="tm-meter-val" id="tm-perf-heap">n/a</span>
                            <div class="tm-meter-container">
                                <div class="tm-meter-fill" id="tm-fill-heap" style="width: 0%;"></div>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <!-- Tab: System -->
                <div class="tab-content" id="tab-system" style="display: none; height: calc(100% - 30px); overflow-y: auto;">
                    <fieldset style="border: 2px solid var(--border-light); padding: 8px; margin: 0; margin-bottom: 8px;">
                        <legend style="font-family: var(--os-font-family); font-size: 11px;">Hardware Specifications</legend>
                        <div id="tm-system-specs" style="font-family: var(--os-font-family); font-size: 11px; line-height: 1.6; color: var(--text-dark);">
                            <!-- Dynamic specifications -->
                        </div>
                    </fieldset>
                    
                    <fieldset style="border: 2px solid var(--border-light); padding: 8px; margin: 0;">
                        <legend style="font-family: var(--os-font-family); font-size: 11px;">Hardware Real-time Usage</legend>
                        <div class="tm-meter-row">
                            <span class="tm-meter-label">CPU Load:</span>
                            <span class="tm-meter-val" id="tm-sys-cpu-val">0%</span>
                            <div class="tm-meter-container">
                                <div class="tm-meter-fill" id="tm-sys-cpu-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                        <div class="tm-meter-row">
                            <span class="tm-meter-label">RAM Usage:</span>
                            <span class="tm-meter-val" id="tm-sys-ram-val">0%</span>
                            <div class="tm-meter-container">
                                <div class="tm-meter-fill" id="tm-sys-ram-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                        <div class="tm-meter-row">
                            <span class="tm-meter-label">GPU Load:</span>
                            <span class="tm-meter-val" id="tm-sys-gpu-val">0%</span>
                            <div class="tm-meter-container">
                                <div class="tm-meter-fill" id="tm-sys-gpu-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                        <div class="tm-meter-row">
                            <span class="tm-meter-label">VRAM Usage:</span>
                            <span class="tm-meter-val" id="tm-sys-vram-val">0%</span>
                            <div class="tm-meter-container">
                                <div class="tm-meter-fill" id="tm-sys-vram-fill" style="width: 0%;"></div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        `;

        // Bind tab switching
        const tabButtons = this.container.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            Utils.eventManager.add(btn, 'click', this.boundTabClick);
        });

        // Delegate actions inside process list
        const tbody = this.container.querySelector('#tm-process-list');
        if (tbody) {
            Utils.eventManager.add(tbody, 'click', this.boundProcessListClick);
        }
    }

    private highlightRow(): void {
        if (!this.container) return;
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

    private refreshUI(): void {
        if (!this.container) return;

        const tbody = this.container.querySelector('#tm-process-list');
        if (!tbody) return;

        const endTaskLabel = i18n.t('taskmanager.endtask');

        // 1. Render processes
        const registry = Kernel.getRegistry();
        const processes = registry.processes;
        const apps = registry.apps;

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
                    <button class="win95-btn tm-kill-btn" data-pid="${proc.pid}" style="padding: 1px 6px; min-height: 18px; font-size: 10px;">
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

        // 2. Render performance metrics
        const resManager = Services.get('ResourceManager');
        const stats = resManager ? resManager.stats() : { webgl: 0, audio: 0, listener: 0, timer: 0, total: 0 };
        
        const metricsContainer = this.container.querySelector('#tm-performance-metrics');
        if (metricsContainer) {
            const limit = 20; // Normal display scale limit
            const renderMeterRow = (label: string, value: number) => {
                const percent = Math.min(100, Math.round((value / limit) * 100));
                return `
                    <div class="tm-meter-row">
                        <span class="tm-meter-label">${label}:</span>
                        <span class="tm-meter-val">${value}</span>
                        <div class="tm-meter-container">
                            <div class="tm-meter-fill" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                `;
            };

            metricsContainer.innerHTML = `
                ${renderMeterRow('Tracked WebGL Contexts', stats.webgl)}
                ${renderMeterRow('Tracked Audio Contexts', stats.audio)}
                ${renderMeterRow('Tracked Event Listeners', stats.listener)}
                ${renderMeterRow('Tracked Timers/Intervals', stats.timer)}
                ${renderMeterRow('Total Active Disposables', stats.total)}
            `;
        }

        // Update system health tab fields
        const totalListeners = Utils.eventManager.count();
        const perfListeners = this.container.querySelector('#tm-perf-listeners');
        const fillListeners = this.container.querySelector('#tm-fill-listeners') as HTMLElement | null;
        if (perfListeners) perfListeners.textContent = String(totalListeners);
        if (fillListeners) fillListeners.style.width = `${Math.min(100, Math.round((totalListeners / 100) * 100))}%`;

        const perfHeap = this.container.querySelector('#tm-perf-heap');
        const fillHeap = this.container.querySelector('#tm-fill-heap') as HTMLElement | null;
        const perf = (window.performance as any);
        if (perf && perf.memory && typeof perf.memory.usedJSHeapSize === 'number') {
            const usedMB = (perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
            const totalMB = (perf.memory.jsHeapSizeLimit / (1024 * 1024)) || 4096;
            const heapPercent = Math.min(100, Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100));

            if (perfHeap) perfHeap.textContent = `${usedMB} MB`;
            if (fillHeap) fillHeap.style.width = `${heapPercent}%`;
        } else {
            if (perfHeap) perfHeap.textContent = 'n/a';
            if (fillHeap) fillHeap.style.width = '0%';
        }

        // 3. Render System Specifications & Real-time Usage
        const isModern = document.body.classList.contains('theme-modern');
        const specsContainer = this.container.querySelector('#tm-system-specs');
        if (specsContainer) {
            if (isModern) {
                specsContainer.innerHTML = `
                    <strong>CPU:</strong> AMD Ryzen 9 7950X @ 4.5 GHz (16 Cores)<br>
                    <strong>RAM:</strong> 32 GB DDR5 @ 6000 MHz<br>
                    <strong>GPU:</strong> NVIDIA GeForce RTX 4090 (24 GB GDDR6X)<br>
                    <strong>OS Architecture:</strong> x64 WebOS System (HTML5/TS)<br>
                    <strong>Graphics API:</strong> WebGL 2.0 (Three.js Active)
                `;
            } else {
                specsContainer.innerHTML = `
                    <strong>CPU:</strong> Intel Pentium MMX @ 200 MHz<br>
                    <strong>RAM:</strong> 32.0 MB EDO RAM @ 66 MHz<br>
                    <strong>GPU:</strong> S3 Trio64V+ (2 MB VRAM)<br>
                    <strong>OS Architecture:</strong> x86 RealMode Simulation<br>
                    <strong>Graphics API:</strong> Software Rendering & Canvas2D
                `;
            }
        }

        // Real-time calculations (Deterministic based on active processes & resource usage):
        const activeProcesses = processes.length;
        const webglCount = stats.webgl || 0;
        const timerCount = stats.timer || 0;
        const tick = Math.floor(Date.now() / 1000);
        
        // Fluctuations generated using a deterministic combination of sine and cosine waves based on current tick:
        const timeFluctuation1 = Math.sin(tick) * 2 + Math.cos(tick * 0.7) * 1.5;
        const timeFluctuation2 = Math.cos(tick * 1.2) * 1.8 + Math.sin(tick * 0.5) * 1.2;

        const baseCpu = 5 + (activeProcesses * 3) + (webglCount * 8) + (timerCount * 0.5);
        const cpuUsage = Math.max(1, Math.min(99, Math.round(baseCpu + timeFluctuation1)));

        // If performance.memory is available, use real JS Heap Usage % of limit, otherwise use processes-based estimate
        let ramUsage: number;
        if (perf && perf.memory && typeof perf.memory.usedJSHeapSize === 'number') {
            ramUsage = Math.max(1, Math.min(99, Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100)));
        } else {
            const baseRam = 15 + (activeProcesses * 4) + (webglCount * 10);
            ramUsage = Math.max(1, Math.min(99, Math.round(baseRam + timeFluctuation2)));
        }

        const baseGpu = webglCount > 0 ? (25 + webglCount * 20) : (1 + activeProcesses * 2);
        const gpuUsage = Math.max(1, Math.min(99, Math.round(baseGpu + timeFluctuation2)));

        const baseVram = webglCount > 0 ? (20 + webglCount * 15) : (1 + activeProcesses * 1.5);
        const vramUsage = Math.max(1, Math.min(99, Math.round(baseVram + timeFluctuation1)));

        // Update DOM elements:
        const cpuVal = this.container.querySelector('#tm-sys-cpu-val');
        const cpuFill = this.container.querySelector('#tm-sys-cpu-fill') as HTMLElement | null;
        if (cpuVal) cpuVal.textContent = `${cpuUsage}%`;
        if (cpuFill) cpuFill.style.width = `${cpuUsage}%`;

        const ramVal = this.container.querySelector('#tm-sys-ram-val');
        const ramFill = this.container.querySelector('#tm-sys-ram-fill') as HTMLElement | null;
        if (ramVal) ramVal.textContent = `${ramUsage}%`;
        if (ramFill) ramFill.style.width = `${ramUsage}%`;

        const gpuVal = this.container.querySelector('#tm-sys-gpu-val');
        const gpuFill = this.container.querySelector('#tm-sys-gpu-fill') as HTMLElement | null;
        if (gpuVal) gpuVal.textContent = `${gpuUsage}%`;
        if (gpuFill) gpuFill.style.width = `${gpuUsage}%`;

        const vramVal = this.container.querySelector('#tm-sys-vram-val');
        const vramFill = this.container.querySelector('#tm-sys-vram-fill') as HTMLElement | null;
        if (vramVal) vramVal.textContent = `${vramUsage}%`;
        if (vramFill) vramFill.style.width = `${vramUsage}%`;
    }

    public terminate(): void {
        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.disposeOwner('taskmanager');
        }

        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }

        Utils.eventManager.remove(window, 'kernel:process-started', this.boundProcessStarted);
        Utils.eventManager.remove(window, 'kernel:process-stopped', this.boundProcessStopped);

        if (this.container) {
            const tabButtons = this.container.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => {
                Utils.eventManager.remove(btn, 'click', this.boundTabClick);
            });

            const tbody = this.container.querySelector('#tm-process-list');
            if (tbody) {
                Utils.eventManager.remove(tbody, 'click', this.boundProcessListClick);
            }
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('taskmanager', TaskManager, {
    name: 'Task Manager',
    icon: '📊',
    description: 'System monitor and process manager.',
    singleton: true
});
