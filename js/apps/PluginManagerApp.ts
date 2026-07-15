import { Kernel } from '../core/Kernel.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';

export class PluginManagerApp implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    
    private boundPluginUninstalled: EventListener;
    private boundInstallBtnClick: EventListener;
    private boundListClick: EventListener;

    constructor() {
        this.boundPluginUninstalled = () => this.refreshUI();
        this.boundInstallBtnClick = () => this.handleInstall();
        this.boundListClick = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('pm-uninstall-btn')) {
                const id = target.getAttribute('data-id');
                if (id) {
                    this.handleUninstall(id);
                }
            }
        };
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.pluginmanager');

        this.windowId = WindowFactory.create({
            title: title,
            width: 520,
            height: 400,
            resizable: true,
            icon: '🧩'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupLayout();
        this.refreshUI();

        window.addEventListener('kernel:plugin-uninstalled', this.boundPluginUninstalled);
    }

    private setupLayout(): void {
        if (!this.container) return;

        const installText = i18n.t('pluginmanager.install');

        this.container.innerHTML = `
            <div id="plugin-manager">
                <!-- Installation Bar -->
                <div class="pm-install-bar">
                    <input type="text" class="pm-input" id="pm-manifest-url" placeholder="Manifest URL or plugin object structure..." />
                    <button class="win95-btn" id="pm-install-btn" style="min-width: 80px;">${installText}</button>
                </div>
                
                <!-- Status/Validation Message -->
                <div class="plugin-msg" id="pm-msg-panel"></div>

                <!-- Installed list -->
                <div class="pm-list" id="pm-installed-list"></div>
            </div>
        `;

        const installBtn = this.container.querySelector('#pm-install-btn');
        if (installBtn) {
            Utils.eventManager.add(installBtn, 'click', this.boundInstallBtnClick);
        }

        const listEl = this.container.querySelector('#pm-installed-list');
        if (listEl) {
            Utils.eventManager.add(listEl, 'click', this.boundListClick);
        }
    }

    private setMessage(text: string, type: 'success' | 'error'): void {
        const msgPanel = this.container?.querySelector('#pm-msg-panel');
        if (msgPanel) {
            msgPanel.className = `plugin-msg ${type}`;
            msgPanel.textContent = text;
        }
    }

    private handleInstall(): void {
        const inputEl = this.container?.querySelector('#pm-manifest-url') as HTMLInputElement | null;
        if (!inputEl) return;

        const val = inputEl.value.trim();
        if (!val) {
            this.setMessage('Error: Manifest source cannot be empty.', 'error');
            return;
        }

        try {
            // Check if it looks like JSON structure for testing, otherwise it's URL
            let pluginData: any;
            if (val.startsWith('{')) {
                pluginData = JSON.parse(val);
            } else {
                this.setMessage(`Installing from URL: ${val}`, 'success');
                // Real URL import can be simulated or handled. For now mock manifest evaluation
                return;
            }

            Kernel.installPlugin(pluginData);
            this.setMessage(`Successfully installed plugin: ${pluginData.id}`, 'success');
            inputEl.value = '';
            this.refreshUI();
        } catch (e: any) {
            this.setMessage(`Error: ${e.message || e}`, 'error');
        }
    }

    private handleUninstall(id: string): void {
        const success = Kernel.uninstallPlugin(id);
        if (success) {
            this.setMessage(`Successfully uninstalled plugin: ${id}`, 'success');
            this.refreshUI();
        } else {
            this.setMessage(`Error: Failed to uninstall plugin: ${id}`, 'error');
        }
    }

    private refreshUI(): void {
        if (!this.container) return;

        const listEl = this.container.querySelector('#pm-installed-list');
        if (!listEl) return;

        const uninstallText = i18n.t('pluginmanager.uninstall');
        const coreAppText = i18n.t('pluginmanager.coreapp');

        const registry = Kernel.getRegistry();
        const apps = registry.apps;

        listEl.innerHTML = '';

        Object.keys(apps).forEach(id => {
            const entry = apps[id];
            if (!entry) return;

            const isPlugin = (entry.metadata as any).isPlugin === true;
            const icon = entry.metadata.icon || '⚙️';
            const name = entry.metadata.name;
            const desc = entry.metadata.description || 'No description provided.';

            const row = document.createElement('div');
            row.className = 'pm-row';

            const buttonHtml = isPlugin
                ? `<button class="win95-btn pm-uninstall-btn" data-id="${id}" style="padding: 2px 8px; min-height: 20px; font-size: 10px;">${uninstallText}</button>`
                : `<button class="win95-btn" disabled style="padding: 2px 8px; min-height: 20px; font-size: 10px;" title="${coreAppText}">${coreAppText}</button>`;

            row.innerHTML = `
                <div class="pm-row-info">
                    <div class="pm-row-title">
                        <span>${icon}</span>
                        <span>${Utils.escapeHTML(name)}</span>
                        <span style="font-weight: normal; color: var(--border-dark); font-size: 10px;">(${Utils.escapeHTML(id)})</span>
                    </div>
                    <div class="pm-row-desc">${Utils.escapeHTML(desc)}</div>
                </div>
                <div>
                    ${buttonHtml}
                </div>
            `;

            listEl.appendChild(row);
        });
    }

    public terminate(): void {
        window.removeEventListener('kernel:plugin-uninstalled', this.boundPluginUninstalled);
        if (this.container) {
            const installBtn = this.container.querySelector('#pm-install-btn');
            if (installBtn) {
                Utils.eventManager.remove(installBtn, 'click', this.boundInstallBtnClick);
            }
            const listEl = this.container.querySelector('#pm-installed-list');
            if (listEl) {
                Utils.eventManager.remove(listEl, 'click', this.boundListClick);
            }
        }
        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('pluginmanager', PluginManagerApp, {
    name: 'Plugin Manager',
    icon: '🧩',
    description: 'Install and manage applications and modules.',
    singleton: true
});
