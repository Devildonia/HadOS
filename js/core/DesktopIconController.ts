import { Utils } from '../utils';

let draggableListenersAttached = false;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let mouseUpHandler: (() => void) | null = null;

/** Desktop grid: icons sit on 100px columns/rows starting at (20, 20). */
const GRID = { x0: 20, y0: 20, dx: 100, dy: 100, rowsPerColumn: 9 };

const slotKey = (x: number, y: number): string => `${x},${y}`;

/**
 * Picks the next unclaimed grid slot (top-to-bottom, then next column) and marks
 * it taken. Used for icons with no explicit default: without this they keep
 * `position:absolute` and no left/top, so they pile up at (0,0) on top of My
 * Computer — which is exactly what happened when Prime Lab was added.
 */
function nextFreeSlot(occupied: Set<string>): { x: number, y: number } {
    for (let col = 0; col < 50; col++) {
        for (let row = 0; row < GRID.rowsPerColumn; row++) {
            const x = GRID.x0 + col * GRID.dx;
            const y = GRID.y0 + row * GRID.dy;
            if (!occupied.has(slotKey(x, y))) {
                occupied.add(slotKey(x, y));
                return { x, y };
            }
        }
    }
    return { x: GRID.x0, y: GRID.y0 };
}

export function initializeDraggableIcons(): void {
    Utils.Logger.log("[DRAG] Initializing draggable icons...");

    const defaultPositions: Record<string, { x: number, y: number }> = {
        'icon-mycomputer': { x: 20, y: 20 },
        'icon-recyclebin': { x: 20, y: 120 },
        'icon-notepad': { x: 20, y: 220 },
        'icon-paint': { x: 20, y: 320 },
        'icon-explorer': { x: 20, y: 420 },
        'icon-display': { x: 20, y: 520 },
        'icon-internet': { x: 20, y: 620 },
        'icon-ragdoll-skins': { x: 20, y: 720 },
        'icon-winamp': { x: 20, y: 820 },
        'icon-games-folder': { x: 120, y: 20 },
        'icon-terminal': { x: 120, y: 120 },
        'icon-taskmanager': { x: 120, y: 220 },
        'icon-pluginmanager': { x: 120, y: 320 },
        'icon-primelab': { x: 120, y: 420 }
    };

    // Every slot a default already claims — so auto-placed icons land beside them,
    // never on top of them.
    const occupied = new Set<string>(
        Object.values(defaultPositions).map(p => slotKey(p.x, p.y))
    );

    const icons = document.querySelectorAll('#system-icons .icon, #app-launch-zone .icon');
    let draggedIcon: HTMLElement | null = null;
    let offsetX = 0, offsetY = 0;

    icons.forEach(iconEl => {
        const icon = iconEl as HTMLElement;
        const savedPosition = localStorage.getItem(`icon-pos-${icon.id}`);
        icon.style.position = 'absolute';

        let placed = false;
        if (savedPosition) {
            try {
                const pos = JSON.parse(savedPosition);
                icon.style.left = pos.x + 'px';
                icon.style.top = pos.y + 'px';
                placed = true;
            } catch (_) { /* corrupt entry — fall through to a default/free slot */ }
        }
        if (!placed) {
            const pos = defaultPositions[icon.id] ?? nextFreeSlot(occupied);
            icon.style.left = pos.x + 'px';
            icon.style.top = pos.y + 'px';
        }

        icon.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0 || e.detail === 2) return;
            draggedIcon = icon;
            icon.style.cursor = 'move';
            const rect = icon.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            icon.style.zIndex = '100';
            icon.style.transition = 'none';
            if (window.playBlip) window.playBlip(1000);
            e.preventDefault();
            e.stopPropagation();
        });
        icon.addEventListener('dragstart', (e: DragEvent) => e.preventDefault());
    });

    if (!draggableListenersAttached) {
        mouseMoveHandler = (e: MouseEvent) => {
            if (!draggedIcon) return;
            let currentX = e.clientX - offsetX;
            let currentY = e.clientY - offsetY;
            const desktopRect = document.getElementById('desktop')?.getBoundingClientRect();
            if (!desktopRect) return;
            const taskbarHeight = document.getElementById('taskbar')?.offsetHeight || 40;

            currentX = Math.max(0, Math.min(currentX, desktopRect.width - draggedIcon.offsetWidth));
            currentY = Math.max(0, Math.min(currentY, desktopRect.height - taskbarHeight - draggedIcon.offsetHeight));

            draggedIcon.style.left = currentX + 'px';
            draggedIcon.style.top = currentY + 'px';
        };

        mouseUpHandler = () => {
            if (!draggedIcon) return;
            draggedIcon.style.cursor = 'default';
            draggedIcon.style.zIndex = '';
            draggedIcon.style.transition = '';
            const position = { x: parseInt(draggedIcon.style.left || '0'), y: parseInt(draggedIcon.style.top || '0') };
            localStorage.setItem(`icon-pos-${draggedIcon.id}`, JSON.stringify(position));
            if (window.playBlip) window.playBlip(800);
            draggedIcon = null;
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        draggableListenersAttached = true;
    }
}

export function resetDraggableIconsState(): void {
    if (mouseMoveHandler) {
        document.removeEventListener('mousemove', mouseMoveHandler);
        mouseMoveHandler = null;
    }
    if (mouseUpHandler) {
        document.removeEventListener('mouseup', mouseUpHandler);
        mouseUpHandler = null;
    }
    draggableListenersAttached = false;
}
