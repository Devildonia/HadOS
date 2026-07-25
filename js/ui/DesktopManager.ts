/**
 * WINDOWS 95 APP CENTER - DESKTOP MANAGER
 * Manages wallpaper, taskbar, and desktop interactions
 * Version: 1.2 (ES Modules — Services-based, no window.* globals)
 */

import { Utils } from '../utils';
import { Services, type IServiceRegistry } from '../core/ServiceContainer';
import { Store } from '../core/EventBus';

/**
 * Interface detailing the desktop manager component operations (wallpaper, colors, drag-and-drop uploads).
 */
export interface IDesktopManager {
    /** Preloads startup audio clips, binds drag-and-drop uploads, and restores wallpaper and taskbar styles. */
    init(): void;
    /** Releases drop zone event handlers and destroys variables. */
    destroy(): void;
    /** Hides the bootloader splashscreen and reveals the desktop container. */
    showDesktop(): void;
    /** Updates desktop background wallpaper styles. */
    setWallpaper(url: string | null, isSilent?: boolean): void;
    /** Updates the CSS property defining taskbar background coloration. */
    setTaskbarColor(color: string, isSilent?: boolean): void;
    /** Removes a taskbar-colour override so the active theme paints the bar again. */
    clearTaskbarColor(): void;
    /** Processes custom wallpaper image file uploads, restricting sizing to under 2MB. */
    handleWallpaperUpload(input: HTMLInputElement | { files: FileList | File[] }): void;
}

/**
 * The Windows 95 grey that init() used to apply and save as its default taskbar
 * colour. An install carrying exactly this value never chose it, so it is treated
 * as "no preference" rather than as an override of the HadOS theme.
 */
const LEGACY_DEFAULT_TASKBAR_COLOR = '#c0c0c0';

const DesktopManager: IDesktopManager = (() => {
    'use strict';

    /** Helper resolving a service instance by key name. */
    const svc = <K extends keyof IServiceRegistry>(name: K): IServiceRegistry[K] | undefined => Services.get(name);
    /** Guard tracking if the manager has initialized. */
    let initialized = false;
    /** DOM node reference hosting file drop events for custom wallpapers. */
    let wallpaperDropZone: HTMLElement | null = null;

    /**
     * Prevents standard browser drag/drop behavior.
     * @param e Event context.
     */
    function preventDefaults(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Colors the drop zone border on dragenter.
     */
    function highlightDropZone(): void {
        if (!wallpaperDropZone) return;
        wallpaperDropZone.style.borderColor = '#000080';
        wallpaperDropZone.style.backgroundColor = '#e0e0e0';
    }

    /**
     * Resets the drop zone border on dragleave.
     */
    function resetDropZone(): void {
        if (!wallpaperDropZone) return;
        wallpaperDropZone.style.borderColor = 'transparent';
        wallpaperDropZone.style.backgroundColor = 'transparent';
    }

    /**
     * Restores state and preloads desktop assets.
     */
    function init(): void {
        if (initialized) return;
        initialized = true;

        Utils.Logger.log("[DESKTOP] DesktopManager initialized");
        setupWallpaperDragDrop();

        // Initialize Shader Wallpaper
        const shader = svc('ShaderWallpaper');
        if (shader) shader.init('shader-wallpaper');

        // Preload Startup Sound and Window Sounds
        const audio = svc('AudioManager');
        if (audio) {
            void audio.loadSound('startup', 'assets/audio/HadOS_startup.opus');
            void audio.loadSound('startup_modern', 'assets/themes/winui/audio/start_winui.opus');
            void audio.loadSound('open_window_modern', 'assets/themes/winui/audio/open_window_winui.opus');
            void audio.loadSound('close_window_modern', 'assets/themes/winui/audio/close_window_winui.opus');
            void audio.loadSound('click_modern', 'assets/themes/winui/audio/onclick.opus');
            void audio.loadSound('menu_modern', 'assets/themes/winui/audio/menu.opus');
        }

        // Restore state (Only set image wallpaper if user specifically set one)
        const wallpaper = Store.get('wallpaper', '') || Utils.getStorage('desktop-wallpaper', '');
        const taskbarColor = Store.get('taskbarColor', '') || Utils.getStorage('taskbar-color', '');

        if (wallpaper) {
            setWallpaper(wallpaper, true);
        } else {
            setWallpaper('', true);
        }

        // A colour is a user override, pinned inline on <body>, which by definition
        // beats the theme. Init used to default it to Win95 grey and save that, so
        // every install ended up overriding its own theme with a colour nobody
        // picked. Only honour a real choice; drop the old auto-written default.
        if (taskbarColor && taskbarColor.toLowerCase() !== LEGACY_DEFAULT_TASKBAR_COLOR) {
            setTaskbarColor(taskbarColor, true);
        } else if (taskbarColor) {
            clearTaskbarColor();
        }
    }

    /**
     * Cleans up wallpaper drag and drop event listeners.
     */
    function destroy(): void {
        if (wallpaperDropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                wallpaperDropZone?.removeEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                wallpaperDropZone?.removeEventListener(eventName, highlightDropZone, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                wallpaperDropZone?.removeEventListener(eventName, resetDropZone, false);
            });

            wallpaperDropZone.removeEventListener('drop', handleDrop, false);
        }

        wallpaperDropZone = null;
        initialized = false;
    }

    /**
     * Shows the desktop and fades out splash screen.
     */
    function showDesktop(): void {
        const splashScreen = document.getElementById('splash-screen');
        const desktop = document.getElementById('desktop');

        if (!desktop) return;

        if (splashScreen) {
            splashScreen.style.transition = 'opacity 1s';
            splashScreen.style.opacity = '0';

            setTimeout(() => {
                splashScreen.style.display = 'none';
                revealDesktop(desktop);
            }, 1000);
        } else {
            revealDesktop(desktop);
        }
    }

    /**
     * Displays desktop container and plays startup sound.
     * @param desktopElement Desktop DOM node.
     */
    function revealDesktop(desktopElement: HTMLElement): void {
        desktopElement.style.display = 'block';

        Store.set('bootComplete', true);

        setTimeout(() => {
            desktopElement.classList.add('visible');

            const audio = svc('AudioManager');
            if (audio) {
                // Play startup sound based on theme
                const tm = svc('ThemeManager');
                const isModernTheme = tm?.currentTheme === 'modern';
                const startupSound = isModernTheme ? 'startup_modern' : 'startup';
                audio.play(startupSound, { volume: 0.6 });
            }

            window.dispatchEvent(new Event('resize'));
        }, 50);
    }

    /**
     * Sets the desktop background wallpaper.
     * @param url Image location path or Base64 data URL.
     * @param isSilent If true, plays no audios.
     */
    function setWallpaper(url: string | null, isSilent: boolean = false): void {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        const shader = svc('ShaderWallpaper');

        if (url) {
            desktop.style.backgroundImage = `url('${url}')`;
            desktop.style.backgroundSize = 'cover';
            desktop.style.backgroundPosition = 'center';
            if (shader) shader.setVisibility(false);
        } else {
            desktop.style.backgroundImage = 'none';
            desktop.style.backgroundColor = 'transparent';
            if (shader) shader.setVisibility(true);
        }

        Store.set('wallpaper', url || '');
        Utils.setStorage('desktop-wallpaper', url || '');

        if (!isSilent) {
            Utils.Logger.log(`[DESKTOP] Wallpaper changed: ${url || 'Standard'}`);
            _playBlip();
        }
    }

    /**
     * Removes a taskbar-colour override so the active theme paints the bar again.
     */
    function clearTaskbarColor(): void {
        document.documentElement.style.removeProperty('--taskbar-bg');
        document.body?.style.removeProperty('--taskbar-bg');
        Store.set('taskbarColor', '');
        Utils.setStorage('taskbar-color', '');
    }

    /**
     * Sets taskbar background color style.
     * @param color Target hex or CSS color string.
     * @param isSilent If true, plays no audios.
     */
    function setTaskbarColor(color: string, isSilent: boolean = false): void {
        document.documentElement.style.setProperty('--taskbar-bg', color);
        if (document.body) {
            document.body.style.setProperty('--taskbar-bg', color);
        }

        Store.set('taskbarColor', color);
        Utils.setStorage('taskbar-color', color);

        if (!isSilent) {
            Utils.Logger.log(`[DESKTOP] Taskbar color changed: ${color}`);
            _playBlip();
        }
    }

    /** Play UI blip sound via AudioManager service */
    function _playBlip(): void {
        const tm = svc('ThemeManager');
        const isModern = tm?.currentTheme === 'modern';
        if (isModern) return;

        const audio = svc('AudioManager');
        if (audio) {
            audio.play('blip');
        }
    }

    /** Binds dragenter, dragover, dragleave, and drop event handlers on drop zone. */
    function setupWallpaperDragDrop(): void {
        wallpaperDropZone = document.getElementById('wallpaper-drop-zone');
        if (!wallpaperDropZone) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            wallpaperDropZone?.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            wallpaperDropZone?.addEventListener(eventName, highlightDropZone, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            wallpaperDropZone?.addEventListener(eventName, resetDropZone, false);
        });

        wallpaperDropZone.addEventListener('drop', handleDrop, false);
    }

    /**
     * Handles dropping files.
     * @param e Drag event metadata.
     */
    function handleDrop(e: DragEvent): void {
        const dt = e.dataTransfer;
        if (!dt) return;
        const files = dt.files;
        if (files && files.length > 0) {
            handleWallpaperUpload({ files: files });
        }
    }

    /**
     * Validates and reads wallpaper files.
     * @param input Input element containing file list.
     */
    function handleWallpaperUpload(input: HTMLInputElement | { files: FileList | File[] }): void {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            if (file.size > 2000000) {
                const notify = svc('Notify');
                if (notify) notify.error("File is too large! Please choose an image under 2MB.");
                else alert("File is too large! Please choose an image under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e: ProgressEvent<FileReader>): void {
                try {
                    setWallpaper(e.target?.result as string);
                } catch (error) {
                    Utils.Logger.error("Error saving wallpaper:", error);
                    const notify = svc('Notify');
                    if (notify) notify.error("Could not save wallpaper. Storage may be full.");
                    else alert("Could not save wallpaper. It might be too large for storage.");
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return {
        init,
        destroy,
        showDesktop,
        setWallpaper,
        setTaskbarColor,
        clearTaskbarColor,
        handleWallpaperUpload
    };
})();

export { DesktopManager };

if (typeof window !== "undefined") {
    Services.register('DesktopManager', DesktopManager);
}
