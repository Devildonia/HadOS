import { Utils } from '../utils';

// ============================================
// WINDOW CONTROLS
// Inicializa la semántica/accesibilidad de las ventanas existentes y monta la
// delegación de eventos (un único listener de click en document) para los
// botones minimizar/maximizar/cerrar y el traer-al-frente por cabecera.
// Extraído de WindowManager. Recibe las acciones como dependencias.
// ============================================

export interface IWindowControlsDeps {
    makeDraggable: (windowId: string) => void;
    makeResizable: (windowId: string) => void;
    bringToFront: (win: HTMLElement) => void;
    minimize: (windowId: string) => void;
    maximize: (windowId: string) => void;
    close: (windowId: string) => void;
}

export class WindowControls {
    private _initialized = false;
    private onDocumentClick: ((e: Event) => void) | null = null;
    /** Per-window bring-to-front listeners, tracked so destroy() can remove them. */
    private windowListeners: Array<{ win: HTMLElement; handler: EventListener }> = [];

    constructor(private readonly deps: IWindowControlsDeps) {}

    /** Initializes window controls (using Event Delegation) */
    public initialize(): void {
        // Guard: prevent multiple initializations (was being called 3x)
        if (this._initialized) {
            Utils.Logger.window('Window controls already initialized, skipping.');
            return;
        }
        this._initialized = true;

        Utils.Logger.window('Initializing window controls (Event Delegation)...');

        const windows = document.querySelectorAll('.win95-window');

        windows.forEach(node => {
            const win = node as HTMLElement;
            const windowId = win.id;
            if (!windowId) return;

            // Make sure role and aria-labelledby are present (Semantics of windows)
            if (!win.getAttribute('role')) {
                win.setAttribute('role', 'dialog');
            }
            if (!win.getAttribute('aria-labelledby')) {
                const header = win.querySelector('.window-header');
                if (header) {
                    const titleSpan = header.querySelector('span:not(.window-btn)');
                    if (titleSpan) {
                        if (!titleSpan.id) titleSpan.id = `${windowId}-title`;
                        win.setAttribute('aria-labelledby', titleSpan.id);
                    }
                }
            }
            // Ensure control buttons have aria-label
            const minBtn = win.querySelector('.minimize-btn');
            if (minBtn && !minBtn.getAttribute('aria-label')) minBtn.setAttribute('aria-label', 'Minimize');
            const maxBtn = win.querySelector('.maximize-btn');
            if (maxBtn && !maxBtn.getAttribute('aria-label')) maxBtn.setAttribute('aria-label', 'Maximize');
            const closeBtn = win.querySelector('.close-btn');
            if (closeBtn && !closeBtn.getAttribute('aria-label')) closeBtn.setAttribute('aria-label', 'Close');

            // Make draggable
            this.deps.makeDraggable(windowId);

            // Make resizable
            this.deps.makeResizable(windowId);

            // Bring to front on click
            const bringToFront = ((_e: Event) => this.deps.bringToFront(win)) as EventListener;
            Utils.eventManager.add(win, 'mousedown', bringToFront);
            this.windowListeners.push({ win, handler: bringToFront });
        });

        this.onDocumentClick = (e: Event): void => {
            const target = e.target as HTMLElement;

            // Check if clicked element is a window button (or inside one)
            const btn = target.closest('.window-btn') as HTMLElement | null;
            if (!btn) {
                // Check if it was a window header to bring to front
                const winHeader = target.closest('.window-header') as HTMLElement | null;
                if (winHeader) {
                    const win = winHeader.closest('.win95-window') as HTMLElement | null;
                    if (win) this.deps.bringToFront(win);
                }
                return;
            }

            // Find which window this button belongs to
            const win = btn.closest('.win95-window') as HTMLElement | null;
            if (!win) {
                Utils.Logger.error('[WindowManager] Button clicked but no parent window found!');
                return;
            }

            const windowId = win.id;
            Utils.Logger.window(`Action on ${windowId}:`, btn.className);

            if (btn.classList.contains('minimize-btn')) {
                this.deps.minimize(windowId);
            } else if (btn.classList.contains('maximize-btn')) {
                this.deps.maximize(windowId);
            } else if (btn.classList.contains('close-btn')) {
                this.deps.close(windowId);
            }
        };

        document.addEventListener('click', this.onDocumentClick);

        Utils.Logger.window(`Initialized controls for ${windows.length} existing windows`);
    }

    public destroy(): void {
        if (this.onDocumentClick) {
            document.removeEventListener('click', this.onDocumentClick);
            this.onDocumentClick = null;
        }
        // Remove the per-window mousedown listeners added in initialize().
        for (const { win, handler } of this.windowListeners) {
            Utils.eventManager.remove(win, 'mousedown', handler);
        }
        this.windowListeners = [];
        this._initialized = false;
    }
}
