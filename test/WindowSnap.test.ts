import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WindowInteractions } from '../js/ui/WindowInteractions';

/**
 * Aero-style window snapping (Fase 5). The work area is the viewport minus the
 * taskbar, wherever it is docked — read from the same --work-* insets that
 * `.hados-window.maximized` uses, so a snapped and a maximized window agree.
 */
describe('Window snapping (Fase 5)', () => {
    let wi: WindowInteractions, win: HTMLDivElement;

    /** Pins the viewport and the taskbar insets the snapper reads. */
    function setViewport(w: number, h: number, insets: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>> = {}): void {
        Object.defineProperty(window, 'innerWidth', { value: w, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: h, configurable: true });
        const s = document.documentElement.style;
        for (const edge of ['top', 'right', 'bottom', 'left'] as const) {
            s.setProperty(`--work-${edge}`, `${insets[edge] ?? 0}px`);
        }
    }

    beforeEach(() => {
        document.body.innerHTML = '';
        // 1000-wide viewport with a 48px taskbar at the bottom → a 1000x700 work area.
        setViewport(1000, 748, { bottom: 48 });

        win = document.createElement('div');
        win.id = 'win-x';
        win.style.cssText = 'position:fixed;left:300px;top:200px;width:400px;height:300px;transform:translate(-50%,-50%);';
        document.body.appendChild(win);

        wi = new WindowInteractions(() => {});
    });

    afterEach(() => {
        document.body.innerHTML = '';
        const s = document.documentElement.style;
        for (const e of ['top', 'right', 'bottom', 'left']) s.removeProperty(`--work-${e}`);
    });

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

    it('leaves the taskbar clear: work height is the viewport minus the bar', () => {
        const geo = wi.applySnap(win, 4, 300) as { height: number };
        expect(geo.height).toBe(700);
        expect(geo.height).not.toBe(window.innerHeight); // 748
    });

    it('offsets the snap by the taskbar when it is docked to the left', () => {
        // Bar on the left: a 48px inset on the left, none at the bottom.
        setViewport(1000, 700, { left: 48 });
        // Maximize-snap should start at x=48 and be 952 wide, full height.
        expect(wi.applySnap(win, 500, 2)).toEqual({ left: 48, top: 0, width: 952, height: 700 });
        // Right-half snap sits in the right half of the *work* area, not the viewport.
        expect(wi.applySnap(win, 998, 300)).toEqual({ left: 48 + 476, top: 0, width: 476, height: 700 });
    });

    it('offsets vertically when the bar is docked to the top', () => {
        setViewport(1000, 700, { top: 40 });
        expect(wi.applySnap(win, 500, 2)).toEqual({ left: 0, top: 40, width: 1000, height: 660 });
    });
});
