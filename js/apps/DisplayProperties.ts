/**
 * WINDOWS 95 APP CENTER - DISPLAY PROPERTIES APP
 * Dynamic window creation and tab switcher setup
 * Version: 1.0 (TypeScript)
 */

import { Services } from '../core/ServiceContainer.js';
import { WindowApp } from '../core/WindowApp.js';
import { Kernel } from '../core/Kernel.js';
import { setupDisplayProperties } from '../core/DisplayPropertiesController.js';
import { initEventDelegation } from '../core/EventDelegation.js';

const DISPLAY_PROPS_BODY_HTML = `
    <div class="tabs-container" style="display: flex; border-bottom: 1px solid #808080; margin-bottom: 10px;">
        <button class="display-tab-btn active" data-target="display-tab-background"
            style="padding: 3px 10px; border: 1px solid #808080; border-bottom: none; background: #c0c0c0; cursor: pointer;">Background</button>
        <button class="display-tab-btn" data-target="display-tab-appearance"
            style="padding: 3px 10px; border: 1px solid #808080; border-bottom: none; background: #c0c0c0; cursor: pointer;">Appearance</button>
    </div>
    <div id="display-tab-background" class="display-tab-content">
        <p>Select an image to use as your desktop wallpaper:</p>
        <div id="wallpaper-grid" class="wallpaper-grid">
            <div class="wallpaper-item" data-wallpaper="">
                <div class="wallpaper-preview" style="background-color: #008080;"></div>
                <span>(None)</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_1.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_1.webp');">
                </div>
                <span>Windows 95</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_2.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_2.webp');">
                </div>
                <span>Classics</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_3.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_3.webp');">
                </div>
                <span>Logo 1</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_4.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_4.webp');">
                </div>
                <span>Prism Blue</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_5.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_5.webp');">
                </div>
                <span>Waving Logo</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_6.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_6.webp');">
                </div>
                <span>Windows 1.0</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_7.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_7.webp');">
                </div>
                <span>Logo Green</span>
            </div>
            <div class="wallpaper-item" data-wallpaper="assets/wallpapers/w95_8.webp">
                <div class="wallpaper-preview" style="background-image: url('assets/wallpapers/w95_8.webp');">
                </div>
                <span>Win 10 Retro</span>
            </div>
        </div>
    </div>

    <div id="wallpaper-drop-zone"
        style="margin: 10px 0; display: flex; align-items: center; justify-content: center; gap: 10px; border: 2px dashed transparent; padding: 5px; transition: all 0.2s;">
        <button class="win95-btn" data-action="wallpaper-browse">Browse...</button>
        <button class="win95-btn" data-wallpaper="">Default Shader</button>
        <span style="font-style: italic; color: #666;">or Drag & Drop Image</span>
        <input type="file" id="wallpaper-upload" accept="image/*" style="display: none;">
    </div>

    <div id="display-tab-appearance" class="display-tab-content" style="display: none;">
        <p style="margin-bottom: 15px;">Select your OS Theme:</p>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <button class="win95-btn" id="theme-toggle" title="Toggle OS Theme"
                style="padding: 6px 15px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🎨</span>
                <span>Toggle Modern/Classic Theme</span>
            </button>
        </div>

        <hr class="menu-separator" style="margin: 15px 0;">
        <p style="margin-left: 5px;">Taskbar & Start Menu Color:</p>
        <div class="color-presets" style="display: flex; gap: 8px; margin-bottom: 5px; margin-left: 5px;">
            <div class="color-swatch" data-taskbar-color="#c0c0c0"
                style="width: 20px; height: 20px; background: #c0c0c0; border: 1px solid #000; cursor: pointer;"
                title="Standard Gray"></div>
            <div class="color-swatch" data-taskbar-color="#008080"
                style="width: 20px; height: 20px; background: #008080; border: 1px solid #000; cursor: pointer;"
                title="Teal"></div>
            <div class="color-swatch" data-taskbar-color="#000080"
                style="width: 20px; height: 20px; background: #000080; border: 1px solid #000; cursor: pointer;"
                title="Dark Blue"></div>
            <div class="color-swatch" data-taskbar-color="#800000"
                style="width: 20px; height: 20px; background: #800000; border: 1px solid #000; cursor: pointer;"
                title="Maroon"></div>
            <div class="color-swatch" data-taskbar-color="#808080"
                style="width: 20px; height: 20px; background: #808080; border: 1px solid #000; cursor: pointer;"
                title="Dark Gray"></div>
            <div class="color-swatch" data-taskbar-color="#ffffff"
                style="width: 20px; height: 20px; background: #ffffff; border: 1px solid #000; cursor: pointer;"
                title="White"></div>
            <input type="color" id="taskbar-color-picker"
                style="width: 24px; height: 24px; padding: 0; border: 1px solid #808080; cursor: pointer;"
                title="Custom Color">
        </div>
    </div>
    <div
        style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px; margin-right: 15px; margin-bottom: 10px;">
        <button class="win95-btn" data-close-window="win-display-props">OK</button>
        <button class="win95-btn" data-close-window="win-display-props">Cancel</button>
    </div>
`;

export class DisplayPropertiesApp extends WindowApp {
    public windowId: string = 'win-display-props';

    constructor() {
        super();
        this._ensureWindow();
        initEventDelegation();
        setupDisplayProperties();
    }

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'Display Properties',
            width: 450,
            icon: '🖥️'
        });
        const body = wf.getBody(this.windowId);
        if (body) {
            body.setAttribute('style', 'padding: 10px;');
            body.innerHTML = DISPLAY_PROPS_BODY_HTML;
        }
    }
}

// Register with Kernel
Kernel.registerApp('display-props', DisplayPropertiesApp, {
    name: 'Display Properties',
    icon: 'assets/icons/Display.webp',
    singleton: true
});
