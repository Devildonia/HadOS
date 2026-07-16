import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Services } from '../js/core/ServiceContainer';

// We need to test the individual exported functions
// Mock EventBus first
vi.mock('../js/core/EventBus', () => ({
    EventBus: { on: vi.fn(), emit: vi.fn(), __reset: vi.fn() },
    Store: { get: vi.fn(), set: vi.fn(), on: vi.fn(), __reset: vi.fn() },
    createStateBridge: vi.fn(() => ({
        lang: 'en',
        screen: 'desktop',
        bootComplete: false,
        wallpaper: '',
        taskbarColor: '#c0c0c0'
    }))
}));

vi.mock('../js/audio/AudioManager', () => ({
    AudioManager: {
        play: vi.fn(),
        init: vi.fn()
    }
}));

const { initSystemState, initAudioBridge, initLegacyWrappers, initClock } = await import('../js/core/SystemBridge');

describe('SystemBridge', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        (Services as any).__reset();
        document.body.innerHTML = '';
    });

    describe('initSystemState', () => {
        it('should create window.state with reactive bridge', () => {
            initSystemState();
            expect(window.state).toBeDefined();
            expect(window.state.lang).toBe('en');
            expect(window.state.screen).toBe('desktop');
            expect(window.state.bootComplete).toBe(false);
        });

        it('should create window.familyData', () => {
            initSystemState();
            expect((window as any).familyData).toBeDefined();
            expect((window as any).familyData.parents.mother.name).toBe('Mary');
            expect((window as any).familyData.parents.father.name).toBe('John');
        });
    });

    describe('initAudioBridge', () => {
        it('should create window.playBlip function', () => {
            initAudioBridge();
            expect(typeof (window as any).playBlip).toBe('function');
        });

        it('should play blip through AudioManager service', () => {
            const mockPlay = vi.fn();
            const mockAM = { play: mockPlay };
            Services.register('AudioManager', mockAM as any);

            initAudioBridge();
            (window as any).playBlip(600);

            expect(mockPlay).toHaveBeenCalledWith('blip', { frequency: 600 });
        });
    });

    describe('initLegacyWrappers', () => {
        beforeEach(() => {
            initAudioBridge();
            initLegacyWrappers();
        });

        it('should create window.setWallpaper wrapper', () => {
            const mockDM = { setWallpaper: vi.fn() };
            Services.register('DesktopManager', mockDM as any);

            (window as any).setWallpaper('test.jpg');
            expect(mockDM.setWallpaper).toHaveBeenCalledWith('test.jpg', false);
        });

        it('should create window.openWindow wrapper', () => {
            const mockWM = { open: vi.fn() };
            Services.register('WindowManager', mockWM as any);

            (window as any).openWindow('win-test');
            expect(mockWM.open).toHaveBeenCalledWith('win-test');
        });

        it('should create window.closeWindow wrapper', () => {
            const mockWM = { close: vi.fn() };
            Services.register('WindowManager', mockWM as any);

            (window as any).closeWindow('win-test');
            expect(mockWM.close).toHaveBeenCalledWith('win-test');
        });

        it('should create window.openDialog that shows element', () => {
            document.body.innerHTML = '<div id="test-dialog" style="display:none"></div>';
            (window as any).openDialog('test-dialog');
            expect(document.getElementById('test-dialog')!.style.display).toBe('block');
        });

        it('should create window.closeDialog that hides element', () => {
            document.body.innerHTML = '<div id="test-dialog" style="display:block"></div>';
            (window as any).closeDialog('test-dialog');
            expect(document.getElementById('test-dialog')!.style.display).toBe('none');
        });

        it('should create window.handleShutdown function', () => {
            expect(typeof (window as any).handleShutdown).toBe('function');
        });
    });

    describe('initClock', () => {
        it('should set clock text', () => {
            document.body.innerHTML = '<span id="taskbar-clock"></span>';
            initClock();

            const clockText = document.getElementById('taskbar-clock')!.textContent;
            // Should match HH:MM format
            expect(clockText).toMatch(/^\d{2}:\d{2}$/);
        });

        it('should expose window.updateClock', () => {
            document.body.innerHTML = '<span id="taskbar-clock"></span>';
            initClock();
            expect(typeof (window as any).updateClock).toBe('function');
        });

        it('should handle missing clock element gracefully', () => {
            document.body.innerHTML = '';
            expect(() => initClock()).not.toThrow();
        });
    });
});
