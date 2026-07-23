/**
 * Regression tests for the v1.0.9 window bugs:
 *   1. Task Pilot / Display Properties were self-killing proxies that left a
 *      zombie process (windowId of a window that never existed) — a phantom
 *      taskbar button and a singleton that refused to reopen.
 *   3. WindowFactory never called makeResizable, so `resizable: true` windows
 *      had no resize grip.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TaskManager } from '../js/apps/TaskManager';
import { DisplayPropertiesApp } from '../js/apps/DisplayProperties';
import { Settings } from '../js/apps/Settings';
import { WindowFactory } from '../js/ui/WindowFactory';
import { Services } from '../js/core/ServiceContainer';

describe('Task Pilot / Display Properties are real Settings subclasses (no proxy zombie)', () => {
    it('Task Pilot IS a Settings instance with a real, existing window', () => {
        const app = new TaskManager();
        expect(app).toBeInstanceOf(Settings);
        // A real window in the DOM — not the phantom `win-taskmanager-proxy` id.
        expect(app.windowId).toBeTruthy();
        expect(WindowFactory.getBody(app.windowId)).not.toBeNull();
        app.terminate();
        // After terminate the window is gone — closing kills the right thing.
        expect(WindowFactory.getBody(app.windowId)).toBeNull();
    });

    it('opens on the taskmanager category and titles itself', () => {
        const app = new TaskManager();
        expect((app as unknown as { activeCategory: string }).activeCategory).toBe('taskmanager');
        expect((app as unknown as { windowTitle: string }).windowTitle).toBe('Task Pilot');
        app.terminate();
    });

    it('Display Properties is a Settings subclass on the display category', () => {
        const app = new DisplayPropertiesApp();
        expect(app).toBeInstanceOf(Settings);
        expect((app as unknown as { activeCategory: string }).activeCategory).toBe('display');
        expect((app as unknown as { windowTitle: string }).windowTitle).toBe('Display Properties');
        expect(WindowFactory.getBody(app.windowId)).not.toBeNull();
        app.terminate();
    });

    it('does not use the old phantom proxy windowId', () => {
        const app = new TaskManager();
        expect(app.windowId).not.toBe('win-taskmanager-proxy');
        app.terminate();
    });
});

describe('WindowFactory makes windows resizable by default', () => {
    let makeResizable: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        const wm = Services.get('WindowManager') as { makeResizable?: unknown } | undefined;
        if (wm) makeResizable = vi.spyOn(wm as { makeResizable: (id: string) => void }, 'makeResizable') as unknown as ReturnType<typeof vi.fn>;
    });

    afterEach(() => vi.restoreAllMocks());

    it('calls makeResizable for a default (resizable) window', () => {
        const id = WindowFactory.create({ title: 'Resizable', width: 300, height: 200 });
        expect(makeResizable).toHaveBeenCalledWith(id);
        WindowFactory.destroy(id);
    });

    it('does not add the grip when resizable is explicitly false', () => {
        const id = WindowFactory.create({ title: 'Fixed', width: 300, height: 200, resizable: false });
        expect(makeResizable).not.toHaveBeenCalledWith(id);
        WindowFactory.destroy(id);
    });
});
