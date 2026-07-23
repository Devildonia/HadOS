import { EventBus } from './EventBus';
import { Services } from './ServiceContainer';
import { i18n } from '../services/i18n';

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
        // The start button wears the HadOS mark. It replaced an inline SVG of four
        // coloured squares — Microsoft's logo, in Microsoft's colours.
        const hadosStartIcon = `<img src="assets/icons/pwa_icon_512.png" alt="" width="24" height="24">`;

        // Icon definitions for both themes
        const icons = {
            hados: {
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
            },
            modern: {
                // Desktop Icons
                'icon-mycomputer': '<img src="assets/themes/winui/my_pc.webp" alt="My Computer" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-recyclebin': '<img src="assets/themes/winui/recycle_bin.webp" alt="Recycle Bin" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-notepad': '<img src="assets/themes/winui/notepad.webp" alt="Notepad" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-paint': '<img src="assets/themes/winui/paint.webp" alt="Paint" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-explorer': '<img src="assets/themes/winui/file_explorer.webp" alt="Explorer" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-games-folder': '<img src="assets/themes/winui/games.webp" alt="Games" style="width: 64px; height: 64px; object-fit: contain;">',
                'icon-internet': '<img src="assets/themes/winui/brave.webp" alt="Internet" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-display': '<img src="assets/themes/winui/display.webp" alt="Display" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-winamp': '<img src="assets/themes/winui/Winamp.webp" draggable="false" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-terminal': '<img src="assets/themes/winui/ms-dos.webp" alt="MS-DOS" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-taskmanager': '<img src="assets/themes/winui/task_manager.webp" alt="Task Manager" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-pluginmanager': '<span style="font-size: 38px; display: block; text-align: center;">🧩</span>',
                'icon-hnscout': '<img src="assets/icons/nova.webp" alt="Nova" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-messenger': '<img src="assets/icons/tavern_chat.webp" alt="Tavern Chat" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-audiostudio': '<img src="assets/icons/voxcribe.webp" alt="Voxcribe" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-docexplorer': '<img src="assets/icons/doc_query.webp" alt="Doc Query" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-mediaplayer': '<img src="assets/icons/mediaplayer.png" alt="Media Player" style="width: 48px; height: 48px; object-fit: contain;">',
                // Start Menu Items
                'start-menu-btn-icon': hadosStartIcon,
                'menu-icon-notepad': '<img src="assets/themes/winui/notepad.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.notepad'),
                'menu-icon-paint': '<img src="assets/themes/winui/paint.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.paint'),
                'menu-icon-explorer': '<img src="assets/themes/winui/file_explorer.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.explorer'),
                'menu-icon-games-folder': '<img src="assets/themes/winui/games.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.games_folder'),
                'menu-icon-terminal': '<img src="assets/themes/winui/ms-dos.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.terminal'),
                'menu-icon-taskmanager': '<img src="assets/themes/winui/task_manager.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.taskmanager'),
                'menu-icon-pluginmanager': '🧩 ' + i18n.t('app.pluginmanager'),
                'menu-img-internet': 'assets/themes/winui/brave.webp',
                'menu-img-display': 'assets/themes/winui/display.webp'
            }
        } as Record<string, Record<string, string>>;

        const themeIcons = icons[theme] || icons[DEFAULT_THEME] || {};

        for (const [id, content] of Object.entries(themeIcons)) {
            const iconEl = document.getElementById(id);
            if (iconEl) {
                if (id === 'start-menu-btn-icon') {
                    iconEl.innerHTML = content;
                } else if (id.startsWith('menu-img-') && iconEl instanceof HTMLImageElement) {
                    // Update src for <img> elements
                    iconEl.src = content;
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
