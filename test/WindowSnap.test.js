import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WindowInteractions } from '../js/ui/WindowInteractions.js';

/**
 * Aero-style window snapping (Fase 5). The work area comes from #desktop when
 * present (so the taskbar isn't covered), else the viewport.
 */
describe('Window snapping (Fase 5)', () => {
    let wi, win;

    beforeEach(() => {
        document.body.innerHTML = '';
        // A 1000x700 work area (jsdom reports clientWidth/Height from the mock below)
        const desktop = document.createElement('div');
        desktop.id = 'desktop';
        Object.defineProperty(desktop, 'clientWidth', { value: 1000, configurable: true });
        Object.defineProperty(desktop, 'clientHeight', { value: 700, configurable: true });
        document.body.appendChild(desktop);

        win = document.createElement('div');
        win.id = 'win-x';
        win.style.cssText = 'position:fixed;left:300px;top:200px;width:400px;height:300px;transform:translate(-50%,-50%);';
        desktop.appendChild(win);

        wi = new WindowInteractions(() => {});
    });

    afterEach(() => { document.body.innerHTML = ''; });

    it('snaps to the left half when released against the left edge', () => {
        const geo = wi.applySnap(win, 4, 300);
        expect(geo).toEqual({ left: 0, top: 0, width: 500, height: 700 });
        expect(win.style.left).toBe('0px');
        expect(win.style.width).toBe('500px');
        expect(win.style.transform).toBe('none'); // centering transform dropped
    });

    it('snaps to the right half when released against the right edge', () => {
        const geo = wi.applySnap(win, 998, 300);
        expect(geo).toEqual({ left: 500, top: 0, width: 500, height: 700 });
        expect(win.style.left).toBe('500px');
    });

    it('maximizes when released against the top edge', () => {
        const geo = wi.applySnap(win, 500, 2);
        expect(geo).toEqual({ left: 0, top: 0, width: 1000, height: 700 });
        expect(win.style.width).toBe('1000px');
        expect(win.style.height).toBe('700px');
    });

    it('does not snap when released away from any edge', () => {
        expect(wi.applySnap(win, 500, 400)).toBeNull();
        expect(win.style.left).toBe('300px'); // untouched
        expect(win.style.width).toBe('400px');
    });

    it('top edge wins over a corner (maximize beats half-snap)', () => {
        expect(wi.applySnap(win, 2, 2)).toEqual({ left: 0, top: 0, width: 1000, height: 700 });
    });

    it('uses the work area, not the viewport, so the taskbar stays clear', () => {
        // #desktop is 700 tall while the jsdom viewport is 768 — snapping must use 700.
        const geo = wi.applySnap(win, 4, 300);
        expect(geo.height).toBe(700);
        expect(geo.height).not.toBe(window.innerHeight);
    });
});
