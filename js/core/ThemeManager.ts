import { Services } from './ServiceContainer';
import { i18n } from '../services/i18n';

export class ThemeManager {
    public currentTheme: string;
    public themes: string[];
    private initialized: boolean;
    private onDomReady: (() => void) | null;

    private boundLanguageChanged = () => this.swapIcons(this.currentTheme);

    constructor() {
        this.currentTheme = localStorage.getItem('os-theme') || 'win95';
        this.themes = ['win95', 'modern'];
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
        window.addEventListener('languagechanged', this.boundLanguageChanged);
        this.applyTheme(this.currentTheme);
    }

    destroy(): void {
        if (this.onDomReady) {
            document.removeEventListener('DOMContentLoaded', this.onDomReady);
            this.onDomReady = null;
        }
        window.removeEventListener('languagechanged', this.boundLanguageChanged);
        this.initialized = false;
    }

    applyTheme(themeName: string): void {
        if (!this.themes.includes(themeName)) {
            themeName = 'win95'; // fallback
        }

        // Remove all previous theme classes
        this.themes.forEach(t => document.body.classList.remove(`theme-${t}`));

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
            startMenuTitle.textContent = themeName === 'modern' ? 'Windows UI' : 'Windows 95';
        }

        // Update Sticky Note Text
        const welcomeText = document.getElementById('welcome-text');
        if (welcomeText) {
            const key = themeName === 'modern' ? 'sticky.welcome_modern' : 'sticky.welcome_win95';
            welcomeText.setAttribute('data-i18n', key);
            welcomeText.textContent = i18n.t(key);
        }

        // Swap Icons
        this.swapIcons(themeName);

        // Optional: Dispatch event so other components (like UI rendering) can react
        window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme: themeName } }));
    }

    swapIcons(theme: string): void {
        // SVG for Win95 start icon
        const win95StartSvg = `<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="10" height="10" fill="#F65314" /><rect x="13" y="1" width="10" height="10" fill="#7CBB00" /><rect x="1" y="13" width="10" height="10" fill="#00A1F1" /><rect x="13" y="13" width="10" height="10" fill="#FFBB00" /></svg>`;

        // Icon definitions for both themes
        const icons = {
            win95: {
                // Desktop Icons
                'icon-mycomputer': '🖥️',
                'icon-recyclebin': '🗑️',
                'icon-notepad': '📝',
                'icon-paint': '🎨',
                'icon-explorer': '🗂️',
                'icon-games-folder': '📂',
                'icon-internet': '<img src="assets/icons/iexplorer.webp" alt="IE" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-display': '<img src="assets/icons/Display.webp" alt="Display" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-winamp': '<img src="assets/icons/winamp_icon.webp" draggable="false" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-terminal': '<img src="assets/icons/ms-dos.webp" alt="MS-DOS" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-taskmanager': '<img src="assets/icons/task_manager.webp" alt="Task Manager" style="width: 48px; height: 48px; object-fit: contain;">',
                'icon-pluginmanager': '🧩',
                // Start Menu Items
                'start-menu-btn-icon': win95StartSvg,
                'menu-icon-notepad': '📝 ' + i18n.t('app.notepad'),
                'menu-icon-paint': '🎨 ' + i18n.t('app.paint'),
                'menu-icon-explorer': '📂 ' + i18n.t('app.explorer'),
                'menu-icon-games-folder': '📂 ' + i18n.t('app.games_folder'),
                'menu-icon-terminal': '<img src="assets/icons/ms-dos.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.terminal'),
                'menu-icon-taskmanager': '<img src="assets/icons/task_manager.webp" style="width:16px; height:16px; vertical-align:middle; margin-right:5px;"> ' + i18n.t('app.taskmanager'),
                'menu-icon-pluginmanager': '🧩 ' + i18n.t('app.pluginmanager'),
                'menu-img-internet': 'assets/icons/iexplorer.webp',
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
                // Start Menu Items
                'start-menu-btn-icon': '<img src="assets/themes/winui/start.webp" style="width:28px; height:28px; object-fit:contain;">',
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

        const themeIcons = icons[theme] || icons['win95'] || {};

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
