import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Utils } from '../js/utils.js';
import { Services } from '../js/core/ServiceContainer.js';

// We must mock all dependencies before importing os_engine.js
vi.mock('../js/core/BootLoader.js', () => ({
    BootLoader: { init: vi.fn(), start: vi.fn((cb) => cb()) }
}));
vi.mock('../js/core/Kernel.js', () => ({
    Kernel: { init: vi.fn() }
}));
vi.mock('../js/core/HDRManager.js', () => ({
    HDRManager: { init: vi.fn() }
}));
vi.mock('../js/ui/windows.js', () => ({
    WindowManager: { initializeControls: vi.fn() }
}));
vi.mock('../js/ui/DesktopManager.js', () => ({
    DesktopManager: { init: vi.fn(), showDesktop: vi.fn() }
}));
vi.mock('../js/ui/TaskbarManager.js', () => ({
    TaskbarManager: { init: vi.fn() }
}));
vi.mock('../js/ui/TouchManager.js', () => ({
    TouchManager: { init: vi.fn() }
}));
vi.mock('../js/ui/ShaderWallpaper.js', () => ({
    ShaderWallpaper: { start: vi.fn(), stop: vi.fn() }
}));
const mockAudioInstance = { init: vi.fn(), loadSound: vi.fn() };
vi.mock('../js/audio/AudioManager.js', () => ({
    AudioManager: { getInstance: vi.fn(() => mockAudioInstance) }
}));
vi.mock('../js/core/EventDelegation.js', () => ({
    initEventDelegation: vi.fn()
}));
vi.mock('../js/core/SystemBridge.js', () => ({
    initSystemState: vi.fn(),
    initAudioBridge: vi.fn(),
    initLegacyWrappers: vi.fn(),
    initClock: vi.fn()
}));

// Now we can import os_engine
import '../js/core/os_engine.js';
import { BootLoader } from '../js/core/BootLoader.js';
import { DesktopManager } from '../js/ui/DesktopManager.js';
import { AudioManager } from '../js/audio/AudioManager.js';
import { initEventDelegation } from '../js/core/EventDelegation.js';

describe('OS Engine (Bootloader)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAudioInstance.init.mockClear();
        mockAudioInstance.loadSound.mockClear();
        vi.useFakeTimers(); // For the 100ms ThemeManager sync

        // Mock global functions
        window.setupEventListeners = vi.fn();
        window.initializeWindowControls = vi.fn();

        // Mock ThemeManager in Services
        Services.__reset();
        Services.register('ThemeManager', {
            currentTheme: 'win95',
            applyTheme: vi.fn()
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
        delete window.setupEventListeners;
        delete window.initializeWindowControls;
    });

    it('should expose initOS globally', () => {
        expect(window.initOS).toBeTypeOf('function');
    });

    it('should execute the boot sequence sequentially without errors', () => {
        const loggerSpy = vi.spyOn(Utils.Logger, 'log');
        const warnSpy = vi.spyOn(Utils.Logger, 'warn');
        const errorSpy = vi.spyOn(console, 'error');

        window.initOS();

        // Audio System
        const audioMock = AudioManager.getInstance();
        expect(audioMock.init).toHaveBeenCalled();
        expect(audioMock.loadSound).toHaveBeenCalledWith('shutdown', expect.any(String));

        // BootLoader & Desktop
        expect(BootLoader.init).toHaveBeenCalled();
        expect(BootLoader.start).toHaveBeenCalled();
        expect(DesktopManager.showDesktop).toHaveBeenCalled(); // Triggered by BootLoader callback
        expect(DesktopManager.init).toHaveBeenCalled();

        // Event Delegation
        expect(initEventDelegation).toHaveBeenCalled();

        // Legacy Globals
        expect(window.setupEventListeners).toHaveBeenCalled();
        expect(window.initializeWindowControls).toHaveBeenCalled();

        // Boot Report Log
        expect(errorSpy).not.toHaveBeenCalled();
        expect(warnSpy).not.toHaveBeenCalled();
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('0 errors'));
    });

    it('should catch errors in individual boot steps without crashing the whole OS', () => {
        // Force a crash in BootLoader
        BootLoader.init.mockImplementationOnce(() => {
            throw new Error('Simulated Boot Crash');
        });

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const warnSpy = vi.spyOn(Utils.Logger, 'warn');

        window.initOS();

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Boot Sequence FAILED:'), expect.any(Error));
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WITH 1 ERROR(S)'));

        // DesktopManager should still initialize because bootStep isolates errors
        expect(DesktopManager.init).toHaveBeenCalled();

        errorSpy.mockRestore();
    });

    it('should synchronize ThemeManager after a 100ms delay', () => {
        const tm = Services.get('ThemeManager');
        window.initOS();

        // Immediately after initOS, it should not have been called yet
        expect(tm.applyTheme).not.toHaveBeenCalled();

        // Fast-forward 100ms
        vi.advanceTimersByTime(100);

        expect(tm.applyTheme).toHaveBeenCalledWith('win95');
    });
});
