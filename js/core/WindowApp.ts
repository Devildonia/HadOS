import type { IWindowsApp } from './Types';
import { Services } from './ServiceContainer.js';

export abstract class WindowApp implements IWindowsApp {
    public abstract readonly windowId: string;
    protected readonly _cleanups: Array<() => void> = [];

    /**
     * Registers a cleanup callback.
     */
    protected addCleanup(fn: () => void): void {
        const resManager = Services.get('ResourceManager');
        if (resManager && this.windowId) {
            resManager.register(this.windowId, 'listener', { dispose: fn });
        } else {
            this._cleanups.push(fn);
        }
    }

    /**
     * Helper to add an event listener and auto-register its cleanup.
     */
    protected addEventListener(
        target: EventTarget,
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        target.addEventListener(type, listener, options);
        this._cleanups.push(() => {
            target.removeEventListener(type, listener, options);
        });
    }

    /**
     * Standardizes termination and runs all cleanup callbacks.
     */
    public terminate(): void {
        const resManager = Services.get('ResourceManager');
        if (resManager && this.windowId) {
            resManager.disposeOwner(this.windowId);
        }

        // Run remaining cleanups in reverse order
        for (let i = this._cleanups.length - 1; i >= 0; i--) {
            try {
                const cleanup = this._cleanups[i];
                if (cleanup) cleanup();
            } catch (err) {
                console.error('Error during app cleanup:', err);
            }
        }
        this._cleanups.length = 0;
        this.onTerminate();
    }

    /**
     * Optional hook for subclasses to implement custom cleanup logic.
     */
    protected onTerminate(): void {}
}
