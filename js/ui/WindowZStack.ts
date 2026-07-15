import { CONFIG } from '../config';
import { Utils } from '../utils';

// ============================================
// WINDOW Z-STACK
// Gestiona el orden lógico (apilado) de las ventanas y traduce ese orden a un
// z-index real. Extraído de WindowManager.
//
// z-index lógico: en lugar de un contador absoluto con "reset visible",
// mantenemos Map<windowId, logicalOrder>. El z-index real se calcula al aplicar:
// Z_INDEX_BASE + order * Z_INDEX_INCREMENT. El reset nunca es necesario — la
// reordenación es instantánea e invisible.
// ============================================

export class WindowZStack {
    private _windowOrder: Map<string, number> = new Map();
    private _orderCounter: number = 0;

    /** Calcula el z-index real de una ventana dado su logical order */
    private zIndexFor(order: number): number {
        return CONFIG.WINDOWS.Z_INDEX_BASE + (order * CONFIG.WINDOWS.Z_INDEX_INCREMENT);
    }

    /** Asigna a la ventana el orden superior de la pila y aplica su z-index. */
    public bringToFront(win: HTMLElement | null): void {
        if (!win) return;
        const order = ++this._orderCounter;
        if (win.id) this._windowOrder.set(win.id, order);
        win.style.zIndex = this.zIndexFor(order).toString();
    }

    /** Olvida el orden de una ventana (al cerrarse). */
    public remove(windowId: string): void {
        this._windowOrder.delete(windowId);
    }

    /**
     * Reordena las ventanas activas manteniendo su orden relativo pero
     * compactando los valores absolutos. Operación instantánea e invisible.
     * Ya no es necesaria para prevenir overflow — sólo se expone para debug.
     */
    public compact(activeWindows: Set<string>): void {
        Utils.Logger.window('Compacting z-index order (logical reset)');

        const sorted = Array.from(this._windowOrder.entries())
            .sort(([, a], [, b]) => a - b);

        let newOrder = 1;
        const newMap = new Map<string, number>();
        sorted.forEach(([id]) => {
            const win = Utils.getElement(id) as HTMLElement | null;
            if (win && activeWindows.has(id)) {
                newMap.set(id, newOrder);
                win.style.zIndex = this.zIndexFor(newOrder).toString();
                newOrder++;
            }
        });

        this._windowOrder = newMap;
        this._orderCounter = newOrder;
    }
}
