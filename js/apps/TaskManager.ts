import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { ProcessesTab } from './taskmanager/ProcessesTab.js';
import { PerformanceTab } from './taskmanager/PerformanceTab.js';
import { SystemTab } from './taskmanager/SystemTab.js';

export class TaskManager implements IWindowsApp {
    private static readonly REFRESH_INTERVAL_MS = 1000;
    private static readonly PERF_SCALE_LIMIT = 20;
    private static readonly LISTENER_MAX = 100;
    private static readonly WIN_WIDTH = 480;
    private static readonly WIN_HEIGHT = 420;

    public windowId: string = '';
    private intervalId: number | null = null;
    private container: HTMLElement | null = null;
    
    private processesTab: ProcessesTab | null = null;
    private performanceTab: PerformanceTab | null = null;
    private systemTab: SystemTab | null = null;

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
            if (this.processesTab) {
                this.processesTab.handleClick(e);
            }
        };

        // Note: Kernel contract instantiates apps directly, so we run initialization at construction time.
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.taskmanager');

        this.windowId = WindowFactory.create({
            title: title,
            width: TaskManager.WIN_WIDTH,
            height: TaskManager.WIN_HEIGHT,
            resizable: true,
            icon: '📊'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupLayout();

        // Instantiate tab sub-controllers
        this.processesTab = new ProcessesTab(this.container);
        this.performanceTab = new PerformanceTab(this.container, TaskManager.PERF_SCALE_LIMIT, TaskManager.LISTENER_MAX);
        this.systemTab = new SystemTab(this.container);

        this.refreshUI();

        this.intervalId = window.setInterval(() => this.refreshUI(), TaskManager.REFRESH_INTERVAL_MS);

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

    private refreshUI(): void {
        if (!this.container) return;

        const registry = Kernel.getRegistry();
        const processes = registry.processes;
        const apps = registry.apps;

        const resManager = Services.get('ResourceManager');
        const stats = resManager ? resManager.stats() : { webgl: 0, audio: 0, listener: 0, timer: 0, total: 0 };

        this.processesTab?.render(processes, apps);
        this.performanceTab?.renderResourceMetrics(stats);
        this.performanceTab?.renderSystemHealth();
        this.systemTab?.renderHardwareSpecs();
        this.systemTab?.renderRealtimeUsage(processes.length, stats);
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
    name: 'Task Pilot',
    icon: '📊',
    description: 'System monitor and process manager.',
    singleton: true
});
