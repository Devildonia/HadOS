import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Utils } from '../js/utils';
import { Services } from '../js/core/ServiceContainer';

// We must mock all dependencies before importing os_engine.js
vi.mock('../js/core/BootLoader', () => ({
    BootLoader: { init: vi.fn(), start: vi.fn((cb) => cb()) }
}));
vi.mock('../js/core/Kernel', () => ({
    Kernel: { init: vi.fn() }
}));
vi.mock('../js/core/HDRManager', () => ({
    HDRManager: { init: vi.fn() }
}));
vi.mock('../js/ui/windows', () => ({
    WindowManager: { initializeControls: vi.fn() }
}));
vi.mock('../js/ui/DesktopManager', () => ({
    DesktopManager: { init: vi.fn(), showDesktop: vi.fn() }
}));
vi.mock('../js/ui/TaskbarManager', () => ({
    TaskbarManager: { init: vi.fn() }
}));
vi.mock('../js/ui/TouchManager', () => ({
    TouchManager: { init: vi.fn() }
}));
vi.mock('../js/ui/ShaderWallpaper', () => ({
    ShaderWallpaper: { start: vi.fn(), stop: vi.fn() }
}));
const mockAudioInstance = { init: vi.fn(), loadSound: vi.fn() };
vi.mock('../js/audio/AudioManager', () => ({
    AudioManager: { getInstance: vi.fn(() => mockAudioInstance) }
}));
vi.mock('../js/core/EventDelegation', () => ({
    initEventDelegation: vi.fn()
}));
vi.mock('../js/core/SystemBridge', () => ({
    initSystemState: vi.fn(),
    initAudioBridge: vi.fn(),
    initLegacyWrappers: vi.fn(),
    initClock: vi.fn()
}));

// Now we can import os_engine
import '../js/core/os_engine';
import { BootLoader } from '../js/core/BootLoader';
import { DesktopManager } from '../js/ui/DesktopManager';
import { AudioManager } from '../js/audio/AudioManager';
import { initEventDelegation } from '../js/core/EventDelegation';

describe('OS Engine (Bootloader)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAudioInstance.init.mockClear();
        mockAudioInstance.loadSound.mockClear();
        vi.useFakeTimers(); // For the 100ms ThemeManager sync

        // Mock global functions
        (window as any).setupEventListeners = vi.fn();
        (window as any).initializeWindowControls = vi.fn();

        // Mock ThemeManager in Services
        (Services as any).__reset();
        Services.register('ThemeManager', {
            currentTheme: 'win95',
            applyTheme: vi.fn()
        } as any);
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
        delete (window as any).setupEventListeners;
        delete (window as any).initializeWindowControls;
    });

    it('should expose initOS globally', () => {
        expect((window as any).initOS).toBeTypeOf('function');
    });

    it('should execute the boot sequence sequentially without errors', () => {
        const loggerSpy = vi.spyOn(Utils.Logger, 'log');
        const warnSpy = vi.spyOn(Utils.Logger, 'warn');
        const errorSpy = vi.spyOn(console, 'error');

        (window as any).initOS();

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
        expect((window as any).setupEventListeners).toHaveBeenCalled();
        expect((window as any).initializeWindowControls).toHaveBeenCalled();

        // Boot Report Log
        expect(errorSpy).not.toHaveBeenCalled();
        expect(warnSpy).not.toHaveBeenCalled();
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('0 errors'));
    });

    it('should catch errors in individual boot steps without crashing the whole OS', () => {
        // Force a crash in BootLoader
        (BootLoader.init as any).mockImplementationOnce(() => {
            throw new Error('Simulated Boot Crash');
        });

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const warnSpy = vi.spyOn(Utils.Logger, 'warn');

        (window as any).initOS();

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Boot Sequence FAILED:'), expect.any(Error));
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WITH 1 ERROR(S)'));

        // DesktopManager should still initialize because bootStep isolates errors
        expect(DesktopManager.init).toHaveBeenCalled();

        errorSpy.mockRestore();
    });

    it('should synchronize ThemeManager after a 100ms delay', () => {
        const tm = Services.get('ThemeManager') as any;
        (window as any).initOS();

        // Immediately after initOS, it should not have been called yet
        expect(tm.applyTheme).not.toHaveBeenCalled();

        // Fast-forward 100ms
        vi.advanceTimersByTime(100);

        expect(tm.applyTheme).toHaveBeenCalledWith('win95');
    });
});
