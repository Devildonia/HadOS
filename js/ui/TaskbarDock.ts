/**
 * TASKBAR DOCK
 * Makes the taskbar draggable and magnetic: grab an empty part of the bar, drag it
 * loose, and it snaps to whichever of the four desktop edges the cursor is nearest,
 * reorienting horizontal or vertical to match.
 *
 * `data-edge` on #taskbar is the single source of truth. Setting it positions and
 * orients the bar (see taskbar.css) AND updates the --work-* insets that both
 * `.hados-window.maximized` and WindowInteractions' snapping read — so a moved bar
 * never gets overlapped by a maximized or snapped window. The chosen edge persists.
 */

import { Utils } from '../utils';

export type TaskbarEdge = 'top' | 'right' | 'bottom' | 'left';

const EDGES: readonly TaskbarEdge[] = ['top', 'right', 'bottom', 'left'];
const STORAGE_KEY = 'hados-taskbar-edge';
/** Must match --taskbar-size in taskbar.css. Read from CSS so the two can't drift. */
function taskbarSize(): number {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--taskbar-size');
    const n = parseFloat(v);
    return Number.isFinite(n) && n > 0 ? n : 48;
}

function isEdge(v: unknown): v is TaskbarEdge {
    return typeof v === 'string' && (EDGES as readonly string[]).includes(v);
}

/** The edge nearest the cursor — pure distance to each viewport side. Exported for
 *  tests: this is the magnetism, and it should be pinned. */
export function nearestEdge(x: number, y: number): TaskbarEdge {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const d: Record<TaskbarEdge, number> = { top: y, bottom: vh - y, left: x, right: vw - x };
    return EDGES.reduce((best, e) => (d[e] < d[best] ? e : best), 'bottom');
}

export const TaskbarDock = (() => {
    let bar: HTMLElement | null = null;
    let preview: HTMLElement | null = null;
    let dragging = false;
    let pointerId: number | null = null;

    /**
     * Applies an edge: positions/orients the bar and rewrites the work-area insets so
     * only the docked side is inset. This is the one function that keeps the bar,
     * window-maximize and window-snapping in agreement.
     */
    function applyEdge(edge: TaskbarEdge, persist = true): void {
        if (!bar) return;
        bar.dataset.edge = edge;

        const s = `${taskbarSize()}px`;
        const root = document.documentElement.style;
        root.setProperty('--work-top', edge === 'top' ? s : '0px');
        root.setProperty('--work-right', edge === 'right' ? s : '0px');
        root.setProperty('--work-bottom', edge === 'bottom' ? s : '0px');
        root.setProperty('--work-left', edge === 'left' ? s : '0px');

        if (persist) Utils.setStorage(STORAGE_KEY, edge);
        // Let anything tracking the layout (the ragdoll floor, desktop icons) react.
        window.dispatchEvent(new CustomEvent('taskbar:edge-changed', { detail: { edge } }));
    }

    /** True when the pointer landed on something interactive, not bare bar. */
    function onInteractive(target: EventTarget | null): boolean {
        const el = target as HTMLElement | null;
        return !!el?.closest('button, a, input, select, #system-tray, #start-menu, .taskbar-button');
    }

    function ensurePreview(): HTMLElement {
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'taskbar-drop-preview';
            document.body.appendChild(preview);
        }
        return preview;
    }

    /** Shows the ghost of where the bar will land, on the given edge. */
    function showPreview(edge: TaskbarEdge): void {
        const p = ensurePreview();
        const s = taskbarSize();
        Object.assign(p.style, {
            position: 'fixed', zIndex: '999', pointerEvents: 'none',
            background: 'rgba(127, 210, 255, 0.18)',
            outline: '1px solid rgba(127, 210, 255, 0.5)',
            borderRadius: '10px', transition: 'all 0.12s ease', display: 'block',
            top: edge === 'bottom' ? 'auto' : '0', bottom: edge === 'top' ? 'auto' : '0',
            left: edge === 'right' ? 'auto' : '0', right: edge === 'left' ? 'auto' : '0',
            width: edge === 'left' || edge === 'right' ? `${s}px` : '100%',
            height: edge === 'top' || edge === 'bottom' ? `${s}px` : '100%',
        });
    }

    function hidePreview(): void {
        if (preview) preview.style.display = 'none';
    }

    function onPointerDown(e: PointerEvent): void {
        if (!bar || e.button !== 0 || onInteractive(e.target)) return;
        dragging = true;
        pointerId = e.pointerId;
        bar.classList.add('dragging');
        // Keep receiving moves even if the cursor outruns the bar. Never fatal: a
        // stale/synthetic pointer id throws here, and an unhandled throw in a pointer
        // handler would take down the whole OS via the ErrorBoundary.
        try { bar.setPointerCapture(e.pointerId); } catch { /* no active pointer */ }
        moveFloat(e.clientX, e.clientY);
    }

    /** Float the detached bar so its centre tracks the cursor. */
    function moveFloat(x: number, y: number): void {
        if (!bar) return;
        // .dragging frees the bar from its edge (width/height auto, see CSS); place it
        // centred on the cursor.
        const r = bar.getBoundingClientRect();
        bar.style.left = `${x - r.width / 2}px`;
        bar.style.top = `${y - r.height / 2}px`;
        bar.style.right = 'auto';
        bar.style.bottom = 'auto';
    }

    function onPointerMove(e: PointerEvent): void {
        if (!dragging) return;
        moveFloat(e.clientX, e.clientY);
        showPreview(nearestEdge(e.clientX, e.clientY));
    }

    function onPointerUp(e: PointerEvent): void {
        if (!dragging || !bar) return;
        dragging = false;
        if (pointerId !== null) { try { bar.releasePointerCapture(pointerId); } catch { /* gone */ } }
        pointerId = null;

        bar.classList.remove('dragging');
        // Clear the floating inline position so the docked CSS takes over.
        bar.style.left = bar.style.top = bar.style.right = bar.style.bottom = '';
        hidePreview();
        applyEdge(nearestEdge(e.clientX, e.clientY));
    }

    function init(): void {
        bar = document.getElementById('taskbar');
        if (!bar) return;

        const saved = Utils.getStorage(STORAGE_KEY, 'bottom');
        applyEdge(isEdge(saved) ? saved : 'bottom', false);

        bar.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        Utils.Logger.log('TaskbarDock: initialized');
    }

    /** Test/programmatic hook. */
    function setEdge(edge: TaskbarEdge): void { applyEdge(edge); }
    function getEdge(): TaskbarEdge { return isEdge(bar?.dataset.edge) ? bar!.dataset.edge as TaskbarEdge : 'bottom'; }

    return { init, setEdge, getEdge };
})();
