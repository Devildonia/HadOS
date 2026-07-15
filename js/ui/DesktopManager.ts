/**
 * WINDOWS 95 APP CENTER - DESKTOP MANAGER
 * Manages wallpaper, taskbar, and desktop interactions
 * Version: 1.2 (ES Modules — Services-based, no window.* globals)
 */

import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import { Store } from '../core/EventBus';

export interface IDesktopManager {
    init(): void;
    destroy(): void;
    showDesktop(): void;
    setWallpaper(url: string | null, isSilent?: boolean): void;
    setTaskbarColor(color: string, isSilent?: boolean): void;
    handleWallpaperUpload(input: HTMLInputElement | { files: FileList | File[] }): void;
}

const DesktopManager: IDesktopManager = (() => {
    'use strict';

    // Helper: resolve a service by name (avoids window.* lookups)
    const svc = (name: string): any => Services.get(name);
    let initialized = false;
    let wallpaperDropZone: HTMLElement | null = null;

    function preventDefaults(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlightDropZone(): void {
        if (!wallpaperDropZone) return;
        wallpaperDropZone.style.borderColor = '#000080';
        wallpaperDropZone.style.backgroundColor = '#e0e0e0';
    }

    function resetDropZone(): void {
        if (!wallpaperDropZone) return;
        wallpaperDropZone.style.borderColor = 'transparent';
        wallpaperDropZone.style.backgroundColor = 'transparent';
    }

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
            audio.loadSound('startup', 'assets/audio/w95_startup.opus');
            audio.loadSound('startup_modern', 'assets/themes/winui/audio/start_winui.opus');
            audio.loadSound('open_window_modern', 'assets/themes/winui/audio/open_window_winui.opus');
            audio.loadSound('close_window_modern', 'assets/themes/winui/audio/close_window_winui.opus');
            audio.loadSound('click_modern', 'assets/themes/winui/audio/onclick.opus');
            audio.loadSound('menu_modern', 'assets/themes/winui/audio/menu.opus');
        }

        // Restore state (Only set image wallpaper if user specifically set one)
        const wallpaper = Store.get('wallpaper', '') || Utils.getStorage('desktop-wallpaper', '');
        const taskbarColor = Store.get('taskbarColor', '') || Utils.getStorage('taskbar-color', '#c0c0c0');

        if (wallpaper) {
            setWallpaper(wallpaper, true);
        } else {
            setWallpaper('', true);
        }

        if (taskbarColor) setTaskbarColor(taskbarColor, true);
    }

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

    function handleDrop(e: DragEvent): void {
            const dt = e.dataTransfer;
            if (!dt) return;
            const files = dt.files;
            if (files && files.length > 0) {
                handleWallpaperUpload({ files: files });
            }
    }

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
        handleWallpaperUpload
    };
})();

export { DesktopManager };

if (typeof window !== "undefined") {
    Services.register('DesktopManager', DesktopManager);
}
