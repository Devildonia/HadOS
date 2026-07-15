import { Kernel } from '../core/Kernel.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';

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

export class Settings implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    private activeCategory: string = 'language';

    private boundLanguageChanged: EventListener;
    /** Panel listeners (nav items + select) added on each renderInto(); tracked
     *  so they are removed before every re-bind and on terminate(), otherwise the
     *  EventManager Map accumulates entries for detached DOM on each re-render. */
    private panelListeners: Array<{ el: Element; event: string; handler: EventListener }> = [];

    constructor() {
        this.boundLanguageChanged = () => this.onLanguageChanged();
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
            }
            // Future categories (appearance, storage, about...) plug in here.
        ];
    }

    private init(): void {
        this.windowId = WindowFactory.create({
            title: i18n.t('settings.title'),
            width: 560,
            height: 400,
            resizable: true,
            icon: '⚙️'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.renderInto();

        // Re-render when the language changes elsewhere so labels stay in sync.
        Utils.eventManager.add(window, 'languagechanged', this.boundLanguageChanged);
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

    private bindEvents(): void {
        if (!this.container) return;

        // Drop listeners from a previous render (their elements are now detached).
        this.clearPanelListeners();

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
                i18n.setLang(select.value);
                // setLang dispatches 'languagechanged' -> onLanguageChanged() re-renders.
                const feedback = this.container?.querySelector('#settings-lang-feedback');
                if (feedback) feedback.textContent = i18n.t('settings.applied');
            });
        }
    }

    private onLanguageChanged(): void {
        // Keep the window title and all panel labels in the active language.
        WindowFactory.setTitle(this.windowId, `⚙️ ${i18n.t('settings.title')}`);
        this.renderInto();
        const feedback = this.container?.querySelector('#settings-lang-feedback');
        if (feedback) feedback.textContent = i18n.t('settings.applied');
    }

    public terminate(): void {
        this.clearPanelListeners();
        Utils.eventManager.remove(window, 'languagechanged', this.boundLanguageChanged);
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
