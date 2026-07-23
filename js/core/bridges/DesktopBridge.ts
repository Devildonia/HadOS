/**
 * WINDOWS 95 APP CENTER - DESKTOP BRIDGE
 * Bridges desktop customization actions (wallpaper, taskbar color) to service handlers.
 */

import { Services } from '../ServiceContainer';

export function setWallpaper(url: string, silent: boolean = false): void {
    Services.get('DesktopManager')?.setWallpaper(url, silent);
}

export function setTaskbarColor(color: string, silent: boolean = false): void {
    Services.get('DesktopManager')?.setTaskbarColor(color, silent);
}

export function handleWallpaperUpload(input: HTMLInputElement): void {
    Services.get('DesktopManager')?.handleWallpaperUpload(input);
}
