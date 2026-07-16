import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Utils } from '../js/utils';

// Mock Kernel before imports
vi.mock('../js/core/Kernel', () => {
    return {
        Kernel: {
            registerApp: vi.fn(),
            launch: vi.fn()
        }
    };
});

import { Kernel } from '../js/core/Kernel';

// Import apps under test
import '../js/apps/GenericApps';
import '../js/apps/DisplayProperties';
import '../js/apps/Ragdoll3DViewer';
import { WebampApp } from '../js/apps/WebampApp';

describe('Application Modules', () => {

    describe('GenericApps', () => {
        it('should register generic window applications with the Kernel', () => {
            // GenericApps.js runs on import, we just check the mock calls
            expect(Kernel.registerApp).toHaveBeenCalledWith('games-folder', expect.any(Function), expect.any(Object));
            expect(Kernel.registerApp).toHaveBeenCalledWith('display-props', expect.any(Function), expect.any(Object));
            expect(Kernel.registerApp).toHaveBeenCalledWith('ragdoll-skins', expect.any(Function), expect.any(Object));
        });

        it('should assign the correct windowId when instantiated', () => {
            // Find the class registered for games-folder
            const gamesFolderCall = vi.mocked(Kernel.registerApp).mock.calls.find(call => call[0] === 'games-folder');
            expect(gamesFolderCall).toBeDefined();

            const AppClass = gamesFolderCall![1];
            const instance = new AppClass();
            expect(instance.windowId).toBe('win-games-folder');
        });
    });

    describe('WebampApp', () => {
        let mockWebampInstance: any;

        beforeEach(() => {
            // Mock DOM
            document.body.innerHTML = '<div id="webamp-container"></div><div id="webamp"></div>';

            // Mock Global Fetch for Radio API
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve([
                        { name: 'Mock 90s Radio', url_resolved: 'http://stream.mock/radio' }
                    ])
                } as any)
            );

            // Mock Webamp Library
            mockWebampInstance = {
                renderWhenReady: vi.fn(() => Promise.resolve()),
                onClose: vi.fn(),
                dispose: vi.fn()
            };
            (window as any).Webamp = vi.fn().mockImplementation(function () {
                return mockWebampInstance;
            });

            // Mock CustomEvent dispatcher
            window.dispatchEvent = vi.fn();
        });

        afterEach(() => {
            document.body.innerHTML = '';
            vi.restoreAllMocks();
            delete (window as any).Webamp;
        });

        it('should register Webamp with the Kernel', () => {
            expect(Kernel.registerApp).toHaveBeenCalledWith('webamp', expect.any(Function), expect.any(Object));
        });

        it('should fetch radio stations and initialize Webamp when launched', async () => {
            // Call the launch method
            await WebampApp.launch();

            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('radio-browser.info'));
            expect((window as any).Webamp).toHaveBeenCalled();
            expect(mockWebampInstance.renderWhenReady).toHaveBeenCalled();
            expect(mockWebampInstance.onClose).toHaveBeenCalled();

            // Cleanup state for the next tests
            if (mockWebampInstance.onClose.mock.calls.length > 0) {
                mockWebampInstance.onClose.mock.calls[0][0]();
            }
        });

        it('should handle radio API failures gracefully by using a fallback track', async () => {
            // Override fetch to fail
            global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));
            const loggerSpy = vi.spyOn(Utils.Logger, 'log');

            await WebampApp.launch();

            expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Using default demo track'));

            // Cleanup state
            if (mockWebampInstance.onClose.mock.calls.length > 0) {
                mockWebampInstance.onClose.mock.calls[0][0]();
            }
        });

        it('should dispatch kernel:process-stopped when Webamp is closed', async () => {
            // Launch first
            await WebampApp.launch();

            expect(mockWebampInstance.onClose).toHaveBeenCalled();
            const closeCallback = mockWebampInstance.onClose.mock.calls[0]![0];

            closeCallback();

            expect(mockWebampInstance.dispose).toHaveBeenCalled();
            expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));

            const eventArg = vi.mocked(window.dispatchEvent).mock.calls[0]![0] as CustomEvent;
            expect(eventArg.type).toBe('kernel:process-stopped');
            expect(eventArg.detail.pid).toBe('webamp');
        });

        it('should just bring Webamp to front if already initialized', async () => {
            // Set up state from scratch
            await WebampApp.launch();

            // Clear mocks to detect second call
            mockWebampInstance.renderWhenReady.mockClear();

            // Launch again
            await WebampApp.launch();

            // Shouldn't render again
            expect(mockWebampInstance.renderWhenReady).not.toHaveBeenCalled();

            const webampDiv = document.getElementById('webamp')!;
            expect(webampDiv.style.display).toBe('block');
            expect(webampDiv.style.zIndex).toBe('9005');

            // Cleanup state
            if (mockWebampInstance.onClose.mock.calls.length > 0) {
                mockWebampInstance.onClose.mock.calls[0][0]();
            }
        });
    });
});
