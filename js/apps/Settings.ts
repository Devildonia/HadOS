import { Kernel } from '../core/Kernel.js';
import { EventBus } from '../core/EventBus.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { Services } from '../core/ServiceContainer.js';
import { initEventDelegation } from '../core/EventDelegation.js';
import { ProcessesTab } from './taskmanager/ProcessesTab.js';
import { PerformanceTab } from './taskmanager/PerformanceTab.js';
import { SystemTab } from './taskmanager/SystemTab.js';

/**
 * WINDOWS APP CENTER - SETTINGS
 * Windows-style settings hub. Currently hosts the language switcher;
 * designed so new categories (nav entries + panels) can be added over time.
 */

interface ISettingsCategory {
    id: string;
    labelKey: string;
    icon: string;
    render: () => string;
}

// Native display names for known language codes (fallback: uppercased code).
const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    it: 'Italiano',
    de: 'Deutsch',
    sv: 'Svenska',
    no: 'Norsk',
    da: 'Dansk',
    nl: 'Nederlands',
    pt: 'Português',
    el: 'Ελληνικά',
    hu: 'Magyar',
    cs: 'Čeština',
    ro: 'Română',
    ru: 'Русский',
    pl: 'Polski',
    sq: 'Shqip',
    uk: 'Українська',
    mt: 'Malti',
    tr: 'Türkçe',
    gl: 'Galego',
    ca: 'Català',
    eu: 'Euskara',
    zh: '中文',
    ja: '日本語',
    id: 'Bahasa Indonesia',
    th: 'ไทย',
    vi: 'Tiếng Việt',
    hi: 'हिन्दी',
    bn: 'বাংলা',
    ar: 'العربية',
    ko: '한국어',
    fi: 'Suomi',
    sk: 'Slovenčina',
    bg: 'Български',
    hr: 'Hrvatski',
    tl: 'Tagalog',
    ms: 'Bahasa Melayu',
    fa: 'فارسی',
    he: 'עברית'
};

export interface ISettingsParams {
    category?: string;
    /** Window title/icon override — lets Task Pilot / Display Properties present
     *  as their own app (own name in the title bar) while reusing this class. */
    windowTitle?: string;
    windowIcon?: string;
}

export class Settings implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    private activeCategory: string = 'language';

    private boundLanguageChanged: () => void;
    /** Unsubscribe handles for the EventBus subscriptions (the events moved off
     *  window in the v1.0.8_fix event unification). */
    private langUnsub: (() => void) | null = null;
    private tmStartedUnsub: (() => void) | null = null;
    private tmStoppedUnsub: (() => void) | null = null;
    /** Panel listeners (nav items + select) added on each renderInto(); tracked
     *  so they are removed before every re-bind and on terminate(), otherwise the
     *  EventManager Map accumulates entries for detached DOM on each re-render. */
    private panelListeners: Array<{ el: Element; event: string; handler: EventListener }> = [];

    // TaskManager properties
    private tmIntervalId: number | null = null;
    private tmProcessesTab: ProcessesTab | null = null;
    private tmPerformanceTab: PerformanceTab | null = null;
    private tmSystemTab: SystemTab | null = null;
    private boundTmProcessStarted: () => void;
    private boundTmProcessStopped: () => void;

    /** Title/icon shown in this instance's window chrome (overridable so Task
     *  Pilot and Display Properties present as themselves). */
    private windowTitle: string;
    private windowIcon: string;

    constructor(params: ISettingsParams = {}) {
        this.boundLanguageChanged = () => this.onLanguageChanged();
        this.boundTmProcessStarted = () => this.refreshTmUI();
        this.boundTmProcessStopped = () => this.refreshTmUI();
        if (params.category) {
            this.activeCategory = params.category;
        }
        this.windowTitle = params.windowTitle ?? i18n.t('settings.title');
        this.windowIcon = params.windowIcon ?? '⚙️';
        this.init();
    }

    /** Adds a panel listener and tracks it for later cleanup. */
    private addPanelListener(el: Element, event: string, handler: EventListener): void {
        Utils.eventManager.add(el, event, handler);
        this.panelListeners.push({ el, event, handler });
    }

    /** Removes every tracked panel listener (called before re-bind and on terminate). */
    private clearPanelListeners(): void {
        for (const { el, event, handler } of this.panelListeners) {
            Utils.eventManager.remove(el, event, handler);
        }
        this.panelListeners = [];
    }

    private get categories(): ISettingsCategory[] {
        return [
            {
                id: 'language',
                labelKey: 'settings.nav_language',
                icon: '🌐',
                render: () => this.renderLanguagePanel()
            },
            {
                id: 'display',
                labelKey: 'settings.nav_display',
                icon: '🖥️',
                render: () => this.renderDisplayPanel()
            },
            {
                id: 'taskmanager',
                labelKey: 'settings.nav_taskmanager',
                icon: '📊',
                render: () => this.renderTaskManagerPanel()
            }
            // Future categories (appearance, storage, about...) plug in here.
        ];
    }

    private init(): void {
        this.windowId = WindowFactory.create({
            title: this.windowTitle,
            width: 560,
            height: 400,
            resizable: true,
            icon: this.windowIcon
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.renderInto();

        // Re-render when the language changes elsewhere so labels stay in sync.
        this.langUnsub = EventBus.on('languagechanged', this.boundLanguageChanged);
    }

    private renderInto(): void {
        if (!this.container) return;

        const nav = this.categories.map(cat => {
            const active = cat.id === this.activeCategory ? ' active' : '';
            return `<div class="settings-nav-item${active}" data-category="${cat.id}">
                        <span class="settings-nav-icon">${cat.icon}</span>
                        <span>${i18n.t(cat.labelKey)}</span>
                    </div>`;
        }).join('');

        const current = this.categories.find(c => c.id === this.activeCategory) || this.categories[0];
        const panel = current ? current.render() : '';

        this.container.innerHTML = `
            <div class="settings-app">
                <nav class="settings-nav">${nav}</nav>
                <section class="settings-content">${panel}</section>
            </div>
        `;

        this.bindEvents();
    }

    private renderLanguagePanel(): string {
        const currentLang = i18n.getLang();
        const options = i18n.getAvailable().map(code => {
            const name = LANGUAGE_NAMES[code] || code.toUpperCase();
            const selected = code === currentLang ? ' selected' : '';
            return `<option value="${code}"${selected}>${name}</option>`;
        }).join('');

        return `
            <h2 class="settings-heading">${i18n.t('settings.nav_language')}</h2>
            <div class="settings-row">
                <label class="settings-label" for="settings-lang-select">${i18n.t('settings.language_label')}</label>
                <select class="settings-select" id="settings-lang-select">${options}</select>
            </div>
            <p class="settings-desc">${i18n.t('settings.language_desc')}</p>
            <p class="settings-hint" id="settings-lang-feedback" aria-live="polite"></p>
            <hr class="settings-divider">
            <p class="settings-desc settings-muted">${i18n.t('settings.more_soon')}</p>
        `;
    }

    private renderDisplayPanel(): string {
        return `
            <h2 class="settings-heading">${i18n.t('settings.nav_display')}</h2>
            <div class="tabs-container">
                <button class="display-tab-btn active" data-target="display-tab-background">${i18n.t('settings.display_background')}</button>
                <button class="display-tab-btn" data-target="display-tab-appearance">${i18n.t('settings.display_appearance')}</button>
            </div>
            <div id="display-tab-background" class="display-tab-content">
                <p>${i18n.t('settings.display_select_wallpaper')}</p>
                <div id="wallpaper-grid" class="wallpaper-grid">
                    <div class="wallpaper-item" data-wallpaper="">
                        <div class="wallpaper-preview" style="background-color: #008080;"></div>
                        <span>${i18n.t('settings.display_none')}</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_01.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_01.webp');">
                        </div>
                        <span>HadOS 1</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_02.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_02.webp');">
                        </div>
                        <span>HadOS 2</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_03.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_03.webp');">
                        </div>
                        <span>HadOS 3</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_04.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_04.webp');">
                        </div>
                        <span>HadOS 4</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_05.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_05.webp');">
                        </div>
                        <span>HadOS 5</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_06.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_06.webp');">
                        </div>
                        <span>HadOS 6</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_07.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_07.webp');">
                        </div>
                        <span>HadOS 7</span>
                    </div>
                    <div class="wallpaper-item" data-wallpaper="assets/wallpapers/Had_08.webp">
                        <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/Had_08.webp');">
                        </div>
                        <span>HadOS 8</span>
                    </div>
                </div>
            </div>

            <div id="wallpaper-drop-zone"
                style="margin: 10px 0; display: flex; align-items: center; justify-content: center; gap: 10px; border: 2px dashed transparent; padding: 5px; transition: all 0.2s;">
                <button class="hados-btn" data-action="wallpaper-browse">${i18n.t('dialog.browse')}</button>
                <button class="hados-btn" data-wallpaper="">${i18n.t('dialog.default_shader')}</button>
                <span style="font-style: italic; color: #666;">${i18n.t('settings.display_drag_drop')}</span>
                <input type="file" id="wallpaper-upload" accept="image/*" style="display: none;">
            </div>

            <div id="display-tab-appearance" class="display-tab-content" style="display: none;">
                <p style="margin-bottom: 15px;">${i18n.t('settings.display_select_theme')}</p>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                    <button class="hados-btn" id="theme-toggle" title="${i18n.t('settings.display_toggle_theme')}"
                        style="padding: 6px 15px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">🎨</span>
                        <span>${i18n.t('settings.display_toggle_theme')}</span>
                    </button>
                </div>

                <hr class="menu-separator" style="margin: 15px 0;">
                <p style="margin-left: 5px;">${i18n.t('settings.display_taskbar_color')}</p>
                <div class="color-presets" style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px; margin-left: 5px; flex-wrap: wrap;">
                    <div class="color-swatch" data-taskbar-color="#c0c0c0"
                        style="width: 20px; height: 20px; background: #c0c0c0; border: 1px solid #000; cursor: pointer;"
                        title="${i18n.t('settings.display_color_gray')}"></div>
                    <div class="color-swatch" data-taskbar-color="#008080"
                        style="width: 20px; height: 20px; background: #008080; border: 1px solid #000; cursor: pointer;"
                        title="${i18n.t('settings.display_color_teal')}"></div>
                    <div class="color-swatch" data-taskbar-color="#000080"
                        style="width: 20px; height: 20px; background: #000080; border: 1px solid #000; cursor: pointer;"
                        title="${i18n.t('settings.display_color_blue')}"></div>
                    <div class="color-swatch" data-taskbar-color="#800000"
                        style="width: 20px; height: 20px; background: #800000; border: 1px solid #000; cursor: pointer;"
                        title="${i18n.t('settings.display_color_maroon')}"></div>
                    <div class="color-swatch" data-taskbar-color="#808080"
                        style="width: 20px; height: 20px; background: #808080; border: 1px solid #000; cursor: pointer;"
                        title="${i18n.t('settings.display_color_darkgray')}"></div>
                    <div class="color-swatch" data-taskbar-color="#ffffff"
                        style="width: 20px; height: 20px; background: #ffffff; border: 1px solid #000; cursor: pointer;"
                        title="${i18n.t('settings.display_color_white')}"></div>
                    <input type="color" id="taskbar-color-picker"
                        style="width: 24px; height: 24px; padding: 0; border: 1px solid #808080; cursor: pointer;"
                        title="${i18n.t('settings.display_color_custom')}">
                    <button class="hados-btn" data-action="taskbar-color-reset" style="margin-left: 10px; padding: 2px 8px; font-size: 11px;">
                        ${i18n.t('settings.display_color_reset')}
                    </button>
                </div>
            </div>
            <div
                style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px; margin-right: 15px; margin-bottom: 10px;">
                <button class="hados-btn" data-close-window="${this.windowId}">${i18n.t('dialog.ok')}</button>
                <button class="hados-btn" data-close-window="${this.windowId}">${i18n.t('dialog.cancel')}</button>
            </div>
        `;
    }

    private renderTaskManagerPanel(): string {
        const tabProcName = i18n.t('taskmanager.processes');
        const tabPerfName = i18n.t('taskmanager.performance');
        const tabSystName = i18n.t('taskmanager.system');

        return `
            <h2 class="settings-heading">${i18n.t('settings.nav_taskmanager')}</h2>
            <div id="task-manager" style="height: calc(100% - 40px); display: flex; flex-direction: column;">
                <div class="tabs-container">
                    <button class="tab-btn active" data-tab="processes">${tabProcName}</button>
                    <button class="tab-btn" data-tab="performance">${tabPerfName}</button>
                    <button class="tab-btn" data-tab="system">${tabSystName}</button>
                </div>
                
                <!-- Tab: Processes -->
                <div class="tab-content active" id="tab-processes" style="display: flex; flex-direction: column; height: calc(100% - 30px); overflow-y: auto;">
                    <div class="tm-table-container" style="flex: 1; min-height: 120px;">
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
                    <div style="font-family: var(--os-font-family); font-size: 11px; margin-top: 5px;" id="tm-process-footer">
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
    }

    private refreshTmUI(): void {
        if (this.activeCategory !== 'taskmanager' || !this.container) return;

        const registry = Kernel.getRegistry();
        const processes = registry.processes;
        const apps = registry.apps;

        const resManager = Services.get('ResourceManager');
        const stats = resManager ? resManager.stats() : { webgl: 0, audio: 0, listener: 0, timer: 0, total: 0 };

        this.tmProcessesTab?.render(processes, apps);
        this.tmPerformanceTab?.renderResourceMetrics(stats);
        this.tmPerformanceTab?.renderSystemHealth();
        this.tmSystemTab?.renderHardwareSpecs();
        this.tmSystemTab?.renderRealtimeUsage(processes.length, stats);
    }

    private bindEvents(): void {
        if (!this.container) return;

        // Drop listeners from a previous render (their elements are now detached).
        this.clearPanelListeners();

        // Clean up TaskManager interval & event listeners (in case we switched tabs)
        if (this.tmIntervalId !== null) {
            window.clearInterval(this.tmIntervalId);
            this.tmIntervalId = null;
        }
        this.tmStartedUnsub?.(); this.tmStartedUnsub = null;
        this.tmStoppedUnsub?.(); this.tmStoppedUnsub = null;
        this.tmProcessesTab = null;
        this.tmPerformanceTab = null;
        this.tmSystemTab = null;

        // Category navigation
        this.container.querySelectorAll('.settings-nav-item').forEach(item => {
            this.addPanelListener(item, 'click', () => {
                const cat = (item as HTMLElement).dataset.category;
                if (cat && cat !== this.activeCategory) {
                    this.activeCategory = cat;
                    this.renderInto();
                }
            });
        });

        // Language selector
        const select = this.container.querySelector('#settings-lang-select') as HTMLSelectElement | null;
        if (select) {
            this.addPanelListener(select, 'change', () => {
                void i18n.setLang(select.value);
                // setLang dispatches 'languagechanged' -> onLanguageChanged() re-renders.
                const feedback = this.container?.querySelector('#settings-lang-feedback');
                if (feedback) feedback.textContent = i18n.t('settings.applied');
            });
        }

        // Display category specific events
        if (this.activeCategory === 'display') {
            const themeBtn = this.container.querySelector('#theme-toggle') as HTMLButtonElement | null;
            if (themeBtn) {
                this.addPanelListener(themeBtn, 'click', () => {
                    if (window.playBlip) window.playBlip(600);
                    const tm = Services.get<{ currentTheme: string, applyTheme: (t: string) => void }>('ThemeManager');
                    if (tm) {
                        const nextTheme = tm.currentTheme === 'modern' ? 'hados' : 'modern';
                        tm.applyTheme(nextTheme);
                    }
                });
            }

            this.container.querySelectorAll('.display-tab-btn').forEach(btn => {
                this.addPanelListener(btn, 'click', (e) => {
                    const targetBtn = e.currentTarget as HTMLElement;
                    const targetId = targetBtn.dataset.target;
                    if (!targetId) return;

                    if (window.playBlip) window.playBlip(900);

                    // Deactivate all tab buttons & hide content
                    this.container?.querySelectorAll('.display-tab-btn').forEach(b => b.classList.remove('active'));
                    this.container?.querySelectorAll('.display-tab-content').forEach(c => (c as HTMLElement).style.display = 'none');

                    // Activate chosen one
                    targetBtn.classList.add('active');
                    const targetContent = this.container?.querySelector(`#${targetId}`) as HTMLElement | null;
                    if (targetContent) targetContent.style.display = 'block';
                });
            });

            // Re-bind file upload and color picker DOM event listeners
            initEventDelegation();
        }

        // TaskManager category specific events
        if (this.activeCategory === 'taskmanager') {
            this.tmProcessesTab = new ProcessesTab(this.container);
            this.tmPerformanceTab = new PerformanceTab(this.container, 20, 100);
            this.tmSystemTab = new SystemTab(this.container);

            this.refreshTmUI();

            this.tmIntervalId = window.setInterval(() => this.refreshTmUI(), 1000);

            const resManager = Services.get('ResourceManager');
            if (resManager) {
                resManager.register('settings-taskmanager', 'timer', {
                    dispose: () => {
                        if (this.tmIntervalId !== null) {
                            window.clearInterval(this.tmIntervalId);
                            this.tmIntervalId = null;
                        }
                    }
                });
            }

            this.tmStartedUnsub = EventBus.on('kernel:process-started', this.boundTmProcessStarted);
            this.tmStoppedUnsub = EventBus.on('kernel:process-stopped', this.boundTmProcessStopped);

            // Bind inner tab buttons inside Task Manager
            this.container.querySelectorAll('#task-manager .tab-btn').forEach(btn => {
                this.addPanelListener(btn, 'click', (e) => {
                    const targetBtn = e.currentTarget as HTMLElement;
                    const tabButtons = this.container?.querySelectorAll('#task-manager .tab-btn');
                    const tabContents = this.container?.querySelectorAll('#task-manager .tab-content');
                    if (tabButtons && tabContents) {
                        tabButtons.forEach(b => b.classList.remove('active'));
                        tabContents.forEach(c => {
                            c.classList.remove('active');
                            (c as HTMLElement).style.display = 'none';
                        });
                        targetBtn.classList.add('active');
                        const targetTab = targetBtn.getAttribute('data-tab');
                        const targetContent = this.container?.querySelector(`#tab-${targetTab}`) as HTMLElement | null;
                        if (targetContent) {
                            targetContent.classList.add('active');
                            targetContent.style.display = targetTab === 'processes' ? 'flex' : 'block';
                        }
                    }
                });
            });

            // Delegate actions inside process list
            const tbody = this.container.querySelector('#tm-process-list');
            if (tbody) {
                this.addPanelListener(tbody, 'click', (e) => {
                    if (this.tmProcessesTab) {
                        this.tmProcessesTab.handleClick(e);
                    }
                });
            }
        }
    }

    private onLanguageChanged(): void {
        // Keep the window title and all panel labels in the active language.
        WindowFactory.setTitle(this.windowId, `${this.windowIcon} ${this.windowTitle}`);
        this.renderInto();
        const feedback = this.container?.querySelector('#settings-lang-feedback');
        if (feedback) feedback.textContent = i18n.t('settings.applied');
    }

    public terminate(): void {
        this.clearPanelListeners();
        this.langUnsub?.(); this.langUnsub = null;

        if (this.tmIntervalId !== null) {
            window.clearInterval(this.tmIntervalId);
            this.tmIntervalId = null;
        }
        this.tmStartedUnsub?.(); this.tmStartedUnsub = null;
        this.tmStoppedUnsub?.(); this.tmStoppedUnsub = null;

        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.disposeOwner('settings-taskmanager');
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('settings', Settings, {
    name: 'Settings',
    icon: '⚙️',
    description: 'System settings and configuration.',
    singleton: true
});
