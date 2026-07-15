import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';

// ============================================
// WINDOW INTERACTIONS
// Arrastre (por la cabecera) y redimensionado (por el handle) de ventanas.
// Extraído de WindowManager. Registra y limpia los listeners de mouse por
// ventana. Recibe `bringToFront` como dependencia para elevar la ventana al
// interactuar sin acoplarse al z-stack.
// ============================================

interface IInteractionEntry {
    triggerElement: HTMLElement;
    mousedown: EventListener;
}

interface IActiveInteraction {
    onMove: (e: MouseEvent) => void;
    onUp: () => void;
}

export class WindowInteractions {
    /** Distance from a work-area edge (px) that triggers a snap on drag release. */
    private static readonly SNAP_EDGE = 12;

    private readonly _dragRegistry = new Map<string, IInteractionEntry>();
    private readonly _resizeRegistry = new Map<string, IInteractionEntry>();

    // Global drag/resize delegation: exactly ONE mousemove + ONE mouseup on
    // document for the whole app, regardless of how many windows exist. The
    // currently-dragging (or -resizing) window registers itself as `_active`
    // on mousedown; the globals dispatch to it. Previously every window added
    // its own document-level move/up pair, so N windows meant 2N handlers all
    // firing on every mouse move.
    private _active: IActiveInteraction | null = null;
    private _globalInstalled = false;

    constructor(private readonly bringToFront: (win: HTMLElement) => void) {}

    private ensureGlobalListeners(): void {
        if (this._globalInstalled) return;
        this._globalInstalled = true;

        Utils.eventManager.add(document, 'mousemove', ((e: Event) => {
            this._active?.onMove(e as MouseEvent);
        }) as EventListener);

        Utils.eventManager.add(document, 'mouseup', (() => {
            if (!this._active) return;
            const up = this._active.onUp;
            this._active = null;
            up();
        }) as EventListener);
    }

    private bind(
        windowId: string,
        triggerElement: HTMLElement,
        registry: Map<string, IInteractionEntry>,
        onMouseDown: (e: MouseEvent) => boolean | void,
        onMouseMove: (e: MouseEvent) => void,
        onMouseUp: () => void
    ): void {
        this.ensureGlobalListeners();

        const mousedown = (e: Event): void => {
            const mouseEvt = e as MouseEvent;
            const proceed = onMouseDown(mouseEvt);
            if (proceed === false) return;
            this._active = { onMove: onMouseMove, onUp: onMouseUp };
        };

        Utils.eventManager.add(triggerElement, 'mousedown', mousedown);
        registry.set(windowId, { triggerElement, mousedown });
    }

    private unbind(windowId: string, registry: Map<string, IInteractionEntry>): void {
        const entry = registry.get(windowId);
        if (entry) {
            Utils.eventManager.remove(entry.triggerElement, 'mousedown', entry.mousedown);
            registry.delete(windowId);
        }
    }

    public destroyDraggable(windowId: string): void {
        this.unbind(windowId, this._dragRegistry);

        // Also clean up touch dragging if touch manager is active
        const tm: any = Services.get('TouchManager');
        if (tm && typeof tm.destroyDraggable === 'function') {
            tm.destroyDraggable(windowId);
        }
    }

    public destroyResizable(windowId: string): void {
        this.unbind(windowId, this._resizeRegistry);
    }

    public destroyWindowInteractions(windowId: string): void {
        this.destroyDraggable(windowId);
        this.destroyResizable(windowId);
    }

    /** Makes a window draggable by its header */
    public makeDraggable(windowId: string): void {
        const win = Utils.getElement(windowId) as HTMLElement | null;
        if (!win) return;

        const header = win.querySelector('.window-header') as HTMLElement | null;
        if (!header) {
            Utils.Logger.warn(`No header found for window: ${windowId}`);
            return;
        }

        // Clean up previous draggable listeners if any
        this.destroyDraggable(windowId);

        let isDragging = false;
        let startX: number, startY: number, initialX: number, initialY: number;
        let lastX = 0, lastY = 0;

        this.bind(
            windowId,
            header,
            this._dragRegistry,
            (mouseEvt) => {
                // Ignore if clicking on buttons
                if ((mouseEvt.target as HTMLElement).classList.contains('window-btn')) return false;

                isDragging = true;
                startX = mouseEvt.clientX;
                startY = mouseEvt.clientY;
                lastX = mouseEvt.clientX;
                lastY = mouseEvt.clientY;

                // Get current position
                const rect = win.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;

                // Bring to front
                this.bringToFront(win);

                // Prevent text selection
                mouseEvt.preventDefault();
            },
            (mouseEvt) => {
                if (!isDragging) return;

                lastX = mouseEvt.clientX;
                lastY = mouseEvt.clientY;

                const deltaX = mouseEvt.clientX - startX;
                const deltaY = mouseEvt.clientY - startY;

                win.style.left = (initialX + deltaX) + 'px';
                win.style.top = (initialY + deltaY) + 'px';
                win.style.transform = 'none'; // Remove centering transform
            },
            () => {
                if (isDragging) this.applySnap(win, lastX, lastY);
                isDragging = false;
            }
        );

        Utils.Logger.window(`Window ${windowId} is now draggable`);
    }

    /** The usable desktop area (excludes the taskbar when #desktop is present). */
    private workArea(): { width: number; height: number } {
        const desktop = document.getElementById('desktop');
        return {
            width: desktop?.clientWidth || window.innerWidth,
            height: desktop?.clientHeight || window.innerHeight,
        };
    }

    /**
     * Aero-style snapping (Fase 5): releasing a drag against the top edge
     * maximizes the window; against the left/right edge it fills that half of
     * the work area. Returns the applied geometry, or null when no snap applies.
     */
    public applySnap(win: HTMLElement, x: number, y: number): { left: number; top: number; width: number; height: number } | null {
        const { width: W, height: H } = this.workArea();
        const E = WindowInteractions.SNAP_EDGE;

        let geo: { left: number; top: number; width: number; height: number } | null = null;
        if (y <= E) geo = { left: 0, top: 0, width: W, height: H };                                      // maximize
        else if (x <= E) geo = { left: 0, top: 0, width: Math.round(W / 2), height: H };                 // left half
        else if (x >= W - E) geo = { left: Math.round(W / 2), top: 0, width: Math.round(W / 2), height: H }; // right half
        if (!geo) return null;

        win.style.transform = 'none';
        win.style.left = `${geo.left}px`;
        win.style.top = `${geo.top}px`;
        win.style.width = `${geo.width}px`;
        win.style.height = `${geo.height}px`;
        Utils.Logger.window(`Window snapped to ${geo.width}x${geo.height} @ ${geo.left},${geo.top}`);
        return geo;
    }

    public makeResizable(windowId: string): void {
        const win = Utils.getElement(windowId) as HTMLElement | null;
        if (!win) return;

        // Clean up previous resizable listeners if any
        this.destroyResizable(windowId);

        // Add resize handle if it doesn't exist
        let resizeHandle = win.querySelector('.window-resize-handle') as HTMLElement | null;
        if (!resizeHandle) {
            resizeHandle = document.createElement('div');
            resizeHandle.className = 'window-resize-handle';
            win.appendChild(resizeHandle);
        }

        let isResizing = false;
        let startX: number, startY: number, startWidth: number, startHeight: number;

        this.bind(
            windowId,
            resizeHandle,
            this._resizeRegistry,
            (mouseEvt) => {
                isResizing = true;
                startX = mouseEvt.clientX;
                startY = mouseEvt.clientY;

                const rect = win.getBoundingClientRect();
                startWidth = rect.width;
                startHeight = rect.height;

                // Bring to front
                this.bringToFront(win);

                mouseEvt.preventDefault();
                mouseEvt.stopPropagation();
            },
            (mouseEvt) => {
                if (!isResizing) return;

                const deltaX = mouseEvt.clientX - startX;
                const deltaY = mouseEvt.clientY - startY;

                const newWidth = Math.max(200, startWidth + deltaX);
                const newHeight = Math.max(150, startHeight + deltaY);

                win.style.width = newWidth + 'px';
                win.style.height = newHeight + 'px';
            },
            () => {
                isResizing = false;
            }
        );

        Utils.Logger.window(`Window ${windowId} is now resizable`);
    }
}
