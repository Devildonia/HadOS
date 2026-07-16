import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WindowZStack } from '../js/ui/WindowZStack';
import { CONFIG } from '../js/config';
import { Utils } from '../js/utils';

describe('WindowZStack', () => {
    let zStack: WindowZStack;
    let win1: HTMLDivElement;
    let win2: HTMLDivElement;

    beforeEach(() => {
        vi.restoreAllMocks();
        zStack = new WindowZStack();

        win1 = document.createElement('div');
        win1.id = 'win-1';
        win2 = document.createElement('div');
        win2.id = 'win-2';

        document.body.appendChild(win1);
        document.body.appendChild(win2);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should ignore bringToFront if window is null', () => {
        expect(() => zStack.bringToFront(null)).not.toThrow();
    });

    it('should calculate correct real z-index on bringToFront and remove', () => {
        zStack.bringToFront(win1);
        expect(win1.style.zIndex).toBe((CONFIG.WINDOWS.Z_INDEX_BASE + CONFIG.WINDOWS.Z_INDEX_INCREMENT).toString());
        expect((zStack as any)._windowOrder.get('win-1')).toBe(1);

        zStack.bringToFront(win2);
        expect(win2.style.zIndex).toBe((CONFIG.WINDOWS.Z_INDEX_BASE + 2 * CONFIG.WINDOWS.Z_INDEX_INCREMENT).toString());
        expect((zStack as any)._windowOrder.get('win-2')).toBe(2);

        // Remove
        zStack.remove('win-1');
        expect((zStack as any)._windowOrder.has('win-1')).toBe(false);
    });

    it('should compact and reorder active windows', () => {
        zStack.bringToFront(win1);
        zStack.bringToFront(win2);

        // Remove win1 physically from active set but keep win2
        const activeSet = new Set(['win-2']);

        // Spy on getElement to resolve win2
        vi.spyOn(Utils, 'getElement').mockImplementation((id) => {
            if (id === 'win-2') return win2;
            if (id === 'win-1') return win1;
            return null;
        });

        zStack.compact(activeSet);

        // win2 is active, so its z-index order is compacted to 1
        expect(win2.style.zIndex).toBe((CONFIG.WINDOWS.Z_INDEX_BASE + CONFIG.WINDOWS.Z_INDEX_INCREMENT).toString());
        expect((zStack as any)._windowOrder.has('win-1')).toBe(false); // Removed during compacting
        expect((zStack as any)._windowOrder.get('win-2')).toBe(1);
    });
});
