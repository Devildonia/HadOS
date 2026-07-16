import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Services } from '../js/core/ServiceContainer';
import { WindowManager } from '../js/ui/WindowManager';

vi.mock('../js/core/Kernel', () => ({
    Kernel: { launch: vi.fn() }
}));
vi.mock('../js/ui/WindowManager', () => ({
    WindowManager: { close: vi.fn() }
}));

import { Kernel } from '../js/core/Kernel';

// Load script under test
import '../js/core/event_listeners';

describe('Global Event Listeners', () => {
    let mockAudioInstance: any;
    let mockThemeManager: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup JSDOM body with required elements
        document.body.innerHTML = `
            <button id="start-button"></button>
            <div id="start-menu" style="display: none;"></div>
            
            <div id="icon-games-folder" class="icon" tabindex="0"></div>
            <div id="icon-vlrs-folder" class="icon"></div>
            <div id="icon-flappy-neon-exe" class="icon"></div>
            
            <button id="back-to-games-from-flappy"></button>
            
            <button id="theme-toggle"></button>
            
            <div class="display-tab-btn" data-target="tab1">Tab 1</div>
            <div class="display-tab-btn" data-target="tab2">Tab 2</div>
            <div id="tab1" class="display-tab-content"></div>
            <div id="tab2" class="display-tab-content"></div>
            
            <div class="hados-window">
                <button class="close-btn"></button>
            </div>
            
            <button class="icon-box"></button>
        `;

        // Mock globally expected functions
        (window as any).playBlip = vi.fn();
        (window as any).openWindow = vi.fn();
        (window as any).openDialog = vi.fn();
        (window as any).state = { bootComplete: true };

        // Mock Services
        (Services as any).__reset();
        mockAudioInstance = { play: vi.fn() };
        Services.register('AudioManager', mockAudioInstance);

        mockThemeManager = { currentTheme: 'hados', applyTheme: vi.fn() };
        Services.register('ThemeManager', mockThemeManager);

        // Run the setup routine
        (window as any).setupEventListeners();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        delete (window as any).playBlip;
        delete (window as any).openWindow;
        delete (window as any).openDialog;
        delete (window as any).state;
    });

    it('should toggle start menu on start-button click and play sound', () => {
        const startBtn = document.getElementById('start-button')!;
        const startMenu = document.getElementById('start-menu')!;

        // Test opening
        startBtn.click();
        expect(startMenu.style.display).toBe('block');
        expect((window as any).playBlip).toHaveBeenCalledWith(600);

        // Test closing
        startBtn.click();
        expect(startMenu.style.display).toBe('none');
    });

    it('should handle icon double clicks (folders and executables)', () => {
        const gamesFolder = document.getElementById('icon-games-folder')!;
        const vlrsFolder = document.getElementById('icon-vlrs-folder')!;
        const flappyExe = document.getElementById('icon-flappy-neon-exe')!;

        (gamesFolder as any).ondblclick();
        expect((window as any).openWindow).toHaveBeenCalledWith('win-games-folder');

        (vlrsFolder as any).ondblclick();
        expect(WindowManager.close).toHaveBeenCalledWith('win-games-folder');
        expect((window as any).openWindow).toHaveBeenCalledWith('win-vlrs-folder');

        (flappyExe as any).ondblclick();
        expect(WindowManager.close).toHaveBeenCalledWith('win-flappy-folder');
        expect(Kernel.launch).toHaveBeenCalledWith('flappy-neon');
    });

    it('should handle back buttons correctly', () => {
        const backBtn = document.getElementById('back-to-games-from-flappy')!;
        (backBtn as any).onclick();
        expect(WindowManager.close).toHaveBeenCalledWith('win-flappy-folder');
        expect((window as any).openWindow).toHaveBeenCalledWith('win-games-folder');
    });

    it('should toggle themes and play sound on theme button click', () => {
        const themeBtn = document.getElementById('theme-toggle')!;

        themeBtn.click();
        expect(mockThemeManager.applyTheme).toHaveBeenCalledWith('modern'); // Swaps from hados to modern
        expect((window as any).playBlip).toHaveBeenCalledWith(600);

        mockThemeManager.currentTheme = 'modern';
        themeBtn.click();
        expect(mockThemeManager.applyTheme).toHaveBeenCalledWith('hados'); // Swaps back
    });

    it('should handle Display Properties Tabs switching', () => {
        const tabs = document.querySelectorAll('.display-tab-btn');
        const tab1 = tabs[0] as HTMLElement;
        const tab2 = tabs[1] as HTMLElement;

        tab2.click();
        expect(tab2.classList.contains('active')).toBe(true);
        expect(tab1.classList.contains('active')).toBe(false);
        expect(document.getElementById('tab2')!.style.display).toBe('block');
        expect(document.getElementById('tab1')!.style.display).toBe('none');
        expect((window as any).playBlip).toHaveBeenCalledWith(900);
    });

    it('should close windows on generic close button click', () => {
        const closeBtn = document.querySelector('.close-btn')!;
        const win = document.querySelector('.hados-window') as HTMLElement;

        (closeBtn as any).onclick({ target: closeBtn });
        expect(win.style.display).toBe('none');
        expect((window as any).playBlip).toHaveBeenCalledWith(700);
    });

    it('should play global click sound for buttons and icons', () => {
        const iconBtn = document.querySelector('.icon-box')!;

        // Dispatch click events instead of direct method calls to trigger global listener
        const clickEvent = new MouseEvent('click', { bubbles: true });
        iconBtn.dispatchEvent(clickEvent);

        // It should play blip since theme is win95
        expect((window as any).playBlip).toHaveBeenCalledWith(800);
    });

    it('should close the Start Menu when clicking outside of it', () => {
        const startMenu = document.getElementById('start-menu')!;

        startMenu.style.display = 'block'; // Open menu manually

        // Click elsewhere on the body
        const clickEvent = new MouseEvent('click', { bubbles: true });
        document.body.dispatchEvent(clickEvent);

        expect(startMenu.style.display).toBe('none');
    });

    it('should trigger double clicks via Keyboard (Enter/Space)', () => {
        const gamesFolder = document.getElementById('icon-games-folder')!;

        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        gamesFolder.dispatchEvent(enterEvent);

        expect((window as any).openWindow).toHaveBeenCalledWith('win-games-folder');
    });
});
