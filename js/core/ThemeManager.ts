import { EventBus } from './EventBus';
import { Services } from './ServiceContainer';
import { i18n } from '../services/i18n';
import { Utils } from '../utils';

/** The Windows 95 theme HadOS replaced. Anyone still on it is moved to 'hados'. */
const LEGACY_THEME = 'win95';
const DEFAULT_THEME = 'hados';

export class ThemeManager {
    public currentTheme: string;
    public themes: string[];
    private initialized: boolean;
    private onDomReady: (() => void) | null;

    private boundLanguageChanged = () => this.swapIcons(this.currentTheme);
    /** Unsubscribe for the EventBus 'languagechanged' subscription. */
    private langUnsub: (() => void) | null = null;

    /**
     * Reads the saved theme, adopting installs from before the rename: 'win95' no
     * longer exists, and left alone it would fall through to the default on every
     * boot without ever being rewritten.
     */
    private static readStoredTheme(): string {
        const stored = localStorage.getItem('os-theme');
        if (stored === LEGACY_THEME || stored === null) {
            localStorage.setItem('os-theme', DEFAULT_THEME);
            return DEFAULT_THEME;
        }
        return stored;
    }

    constructor() {
        this.themes = ['hados', 'modern'];
        this.currentTheme = ThemeManager.readStoredTheme();
        this.initialized = false;
        this.onDomReady = null;

        // Ensure DOM is ready or wait for it
        if (document.readyState === 'loading') {
            this.onDomReady = () => this.init();
            document.addEventListener('DOMContentLoaded', this.onDomReady, { once: true });
        } else {
            this.init();
        }
    }

    init(): void {
        if (this.initialized) return;
        this.initialized = true;
        if (this.onDomReady) {
            document.removeEventListener('DOMContentLoaded', this.onDomReady);
            this.onDomReady = null;
        }
        // 'languagechanged' now flows on the EventBus (not window) since the
        // v1.0.8_fix event unification — subscribe there or the icons never
        // re-localise on a language switch.
        this.langUnsub = EventBus.on('languagechanged', this.boundLanguageChanged);
        this.applyTheme(this.currentTheme);
    }

    destroy(): void {
        if (this.onDomReady) {
            document.removeEventListener('DOMContentLoaded', this.onDomReady);
            this.onDomReady = null;
        }
        this.langUnsub?.();
        this.langUnsub = null;
        this.initialized = false;
    }

    applyTheme(themeName: string): void {
        if (!this.themes.includes(themeName)) {
            themeName = DEFAULT_THEME; // fallback
        }

        // Remove all previous theme classes, including the retired Win95 one that
        // may still be on the body from a session started before the rename.
        this.themes.forEach(t => document.body.classList.remove(`theme-${t}`));
        document.body.classList.remove(`theme-${LEGACY_THEME}`);

        // Add new theme class
        document.body.classList.add(`theme-${themeName}`);

        // Persist
        localStorage.setItem('os-theme', themeName);
        this.currentTheme = themeName;

        // Apply Shader if available
        const sw = Services.get('ShaderWallpaper');
        if (sw) {
            try {
                sw.setFragmentShader(themeName);
            } catch (err) {
                console.error("[ThemeManager] Failed to apply fragment shader:", err);
            }
        }

        // Update Start Menu Text
        const startMenuTitle = document.getElementById('start-menu-title');
        if (startMenuTitle) {
            startMenuTitle.textContent = themeName === 'modern' ? 'HadOS UI' : 'HadOS';
        }

        // Update Sticky Note Text
        const welcomeText = document.getElementById('welcome-text');
        if (welcomeText) {
            const key = themeName === 'modern' ? 'sticky.welcome_modern' : 'sticky.welcome_hados';
            welcomeText.setAttribute('data-i18n', key);
            welcomeText.textContent = i18n.t(key);
        }

        // Swap Icons
        this.swapIcons(themeName);

        // Notify components so UI rendering can react
        EventBus.emit('themechanged', { theme: themeName });
    }

    swapIcons(theme: string): void {
        const hadosStartIcon = `<img src="${Utils.getAssetUrl('assets/icons/pwa_icon_512.png')}" alt="" width="24" height="24">`;

        // ONE icon set, worn by every theme.
        //
        // There used to be a second full copy pointing at `assets/themes/winui/` —
        // Microsoft's product icons. That is the borrowed identity the Start-button
        // logo and the Windows wallpaper were already removed for, and keeping two
        // parallel maps is what let the rename batches land on one and miss the
        // other: under `modern`, an icon still read "MS-DOS" while its label already
        // said "Shell Core" (known-issues #3/#4). A theme is a skin — a different
        // palette, chrome and sound set for the same apps — so the apps keep their
        // own icons. The `winui` sound set stays; only the artwork was borrowed.
        const hadosIcons: Record<string, string> = {
            // Desktop Icons
            'icon-mycomputer': '<img src="assets/icons/mi_pc.webp" alt="" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-recyclebin': '<img src="assets/icons/eco_bin_empty.webp" alt="" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-notepad': '<img src="assets/icons/notapad.webp" alt="Notapad" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-paint': '<img src="assets/icons/pinta.webp" alt="Pinta" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-explorer': '<img src="assets/icons/filex.webp" alt="FileX" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-games-folder': '<img src="assets/icons/games.webp" alt="" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-internet': '<img src="assets/icons/navea.webp" alt="Navea" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-display': '<img src="assets/icons/Display.webp" alt="Display" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-winamp': '<img src="assets/icons/winamp_icon.webp" draggable="false" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-terminal': '<img src="assets/icons/shell_core.webp" alt="Shell Core" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-taskmanager': '<img src="assets/icons/task_pilot.webp" alt="Task Pilot" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-pluginmanager': '<img src="assets/icons/plugin_manager.webp" alt="" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-hnscout': '<img src="assets/icons/nova.webp" alt="Nova" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-messenger': '<img src="assets/icons/tavern_chat.webp" alt="Tavern Chat" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-audiostudio': '<img src="assets/icons/voxcribe.webp" alt="Voxcribe" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-docexplorer': '<img src="assets/icons/doc_query.webp" alt="Doc Query" style="width: 48px; height: 48px; object-fit: contain;">',
            'icon-mediaplayer': '<img src="assets/icons/mediaplayer.png" alt="Media Player" style="width: 48px; height: 48px; object-fit: contain;">',
            // Start Menu Items
            'start-menu-btn-icon': hadosStartIcon,
            'menu-icon-notepad': '<img src="assets/icons/notapad.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.notepad'),
            'menu-icon-paint': '<img src="assets/icons/pinta.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.paint'),
            'menu-icon-explorer': '<img src="assets/icons/filex.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.explorer'),
            'menu-icon-games-folder': '<img src="assets/icons/games.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.games_folder'),
            'menu-icon-terminal': '<img src="assets/icons/shell_core.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.terminal'),
            'menu-icon-taskmanager': '<img src="assets/icons/task_pilot.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.taskmanager'),
            'menu-icon-pluginmanager': '<img src="assets/icons/plugin_manager.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.pluginmanager'),
            'menu-img-internet': 'assets/icons/navea.webp',
            'menu-img-display': 'assets/icons/Display.webp'
        };

        const icons: Record<string, Record<string, string>> = {
            hados: hadosIcons,
            modern: hadosIcons,
        };

        const themeIcons = icons[theme] || icons[DEFAULT_THEME] || {};

        const resolveHtmlAssetUrls = (htmlStr: string): string => {
            return htmlStr.replace(/src="(assets\/[^"]+)"/g, (_, p: string) => `src="${Utils.getAssetUrl(p)}"`);
        };

        for (const [id, rawContent] of Object.entries(themeIcons)) {
            const content = resolveHtmlAssetUrls(rawContent);
            const iconEl = document.getElementById(id);
            if (iconEl) {
                if (id === 'start-menu-btn-icon') {
                    iconEl.innerHTML = content;
                } else if (id.startsWith('menu-img-') && iconEl instanceof HTMLImageElement) {
                    // Update src for <img> elements
                    iconEl.src = Utils.getAssetUrl(content);
                } else if (id.startsWith('menu-icon-')) {
                    // Update innerHTML for start menu items with text/emojis vs images
                    iconEl.innerHTML = content;
                } else {
                    // Desktop icons have a .icon-box wrapper
                    const box = iconEl.querySelector('.icon-box') as HTMLElement;
                    if (box) {
                        box.innerHTML = content;
                        // Ensure image containers use flex for centering
                        if (content.includes('<img')) {
                            box.style.display = 'flex';
                            box.style.alignItems = 'center';
                            box.style.justifyContent = 'center';
                        } else {
                            box.style.display = 'block'; // Reset for emojis
                        }
                    }
                }
            }
        }
    }

    setAccentColor(colorHex: string): void {
        document.documentElement.style.setProperty('--accent-color', colorHex);
        localStorage.setItem('os-accent-color', colorHex);
    }

    loadSavedAccentColor(): void {
        const saved = localStorage.getItem('os-accent-color');
        if (saved) {
            this.setAccentColor(saved);
        }
    }
}

// Instantiate and register
const themeManager = new ThemeManager();
Services.register('ThemeManager', themeManager);

// Legacy bridge for gradual migration
if (typeof window !== 'undefined') {
    window.themeManager = themeManager;
}

themeManager.loadSavedAccentColor();
