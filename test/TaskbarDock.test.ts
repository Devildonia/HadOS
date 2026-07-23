import { EventBus } from '../js/core/EventBus';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskbarDock, nearestEdge, type TaskbarEdge } from '../js/ui/TaskbarDock';

/** Re-create the taskbar element the module binds to. */
function mountTaskbar(): HTMLElement {
    document.body.innerHTML = '<div id="taskbar" data-edge="bottom"></div>';
    return document.getElementById('taskbar')!;
}

function workVars(): Record<'top' | 'right' | 'bottom' | 'left', string> {
    const s = document.documentElement.style;
    return {
        top: s.getPropertyValue('--work-top'),
        right: s.getPropertyValue('--work-right'),
        bottom: s.getPropertyValue('--work-bottom'),
        left: s.getPropertyValue('--work-left'),
    };
}

describe('nearestEdge — the magnetism', () => {
    beforeEach(() => {
        // jsdom default viewport is 1024x768; pin it so distances are predictable.
        Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    });

    it('snaps to whichever edge the cursor is closest to', () => {
        expect(nearestEdge(500, 40)).toBe('top');       // near top
        expect(nearestEdge(500, 760)).toBe('bottom');   // near bottom
        expect(nearestEdge(30, 400)).toBe('left');      // near left
        expect(nearestEdge(970, 400)).toBe('right');    // near right
    });

    it('resolves a corner by the nearer of the two edges', () => {
        // Top-left but closer to the top (y=20 < x=60) → top.
        expect(nearestEdge(60, 20)).toBe('top');
        // Top-left but closer to the left (x=15 < y=50) → left.
        expect(nearestEdge(15, 50)).toBe('left');
    });

    it('is stable dead-centre (does not throw, returns an edge)', () => {
        expect((['top', 'right', 'bottom', 'left'] as TaskbarEdge[])).toContain(nearestEdge(500, 400));
    });
});

describe('TaskbarDock — docking keeps the layout in agreement', () => {
    beforeEach(() => {
        mountTaskbar();
        localStorage.clear();
        // reset the work vars between tests
        for (const v of ['--work-top', '--work-right', '--work-bottom', '--work-left']) {
            document.documentElement.style.removeProperty(v);
        }
        TaskbarDock.init();
    });

    it('insets ONLY the docked edge, so a maximized window never overlaps the bar', () => {
        TaskbarDock.setEdge('left');
        expect(workVars()).toEqual({ top: '0px', right: '0px', bottom: '0px', left: '48px' });

        TaskbarDock.setEdge('top');
        expect(workVars()).toEqual({ top: '48px', right: '0px', bottom: '0px', left: '0px' });

        TaskbarDock.setEdge('right');
        expect(workVars()).toEqual({ top: '0px', right: '48px', bottom: '0px', left: '0px' });

        TaskbarDock.setEdge('bottom');
        expect(workVars()).toEqual({ top: '0px', right: '0px', bottom: '48px', left: '0px' });
    });

    it('mirrors the edge onto the DOM so the CSS can position/orient the bar', () => {
        TaskbarDock.setEdge('right');
        expect(document.getElementById('taskbar')!.dataset.edge).toBe('right');
        expect(TaskbarDock.getEdge()).toBe('right');
    });

    it('persists the chosen edge and restores it on the next boot', () => {
        TaskbarDock.setEdge('top');
        expect(JSON.parse(localStorage.getItem('hados-taskbar-edge')!)).toBe('top');

        // A fresh boot with the same storage should come up on the saved edge.
        mountTaskbar();
        TaskbarDock.init();
        expect(TaskbarDock.getEdge()).toBe('top');
        expect(workVars().top).toBe('48px');
    });

    it('defaults to the bottom when nothing is stored', () => {
        localStorage.clear();
        mountTaskbar();
        TaskbarDock.init();
        expect(TaskbarDock.getEdge()).toBe('bottom');
    });

    it('ignores a corrupt stored value rather than breaking', () => {
        localStorage.setItem('hados-taskbar-edge', JSON.stringify('sideways'));
        mountTaskbar();
        TaskbarDock.init();
        expect(TaskbarDock.getEdge()).toBe('bottom'); // falls back, no throw
    });

    it('announces the change so other layout consumers can react', () => {
        const listener = vi.fn();
        const unbind = EventBus.on('taskbar:edge-changed', listener);
        TaskbarDock.setEdge('left');
        expect(listener).toHaveBeenCalledWith({ edge: 'left' });
        unbind();
    });
});
