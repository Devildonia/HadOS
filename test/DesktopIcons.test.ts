import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initializeDraggableIcons, resetDraggableIconsState } from '../js/core/DesktopIconController';
import { VFS } from '../js/core/VFS';

/**
 * Desktop icon placement. Regression guard for v1.6.7: Prime Lab's icon had no
 * entry in the position map, so it kept `position:absolute` with no coordinates
 * and rendered at (0,0) — right on top of My Computer.
 */
function mountIcons(ids: string[]) {
    document.body.innerHTML = `<div id="desktop"><div id="system-icons"></div></div>`;
    const host = document.getElementById('system-icons')!;
    for (const id of ids) {
        const el = document.createElement('div');
        el.id = id;
        el.className = 'icon';
        host.appendChild(el);
    }
}

const posOf = (id: string) => {
    const el = document.getElementById(id) as HTMLElement;
    return { left: el.style.left, top: el.style.top };
};

describe('Desktop icon placement', () => {
    beforeEach(() => { localStorage.clear(); document.body.innerHTML = ''; });
    afterEach(() => { document.body.innerHTML = ''; });

    it('places Prime Lab in its own grid slot, not on top of My Computer', () => {
        mountIcons(['icon-mycomputer', 'icon-primelab']);
        initializeDraggableIcons();

        expect(posOf('icon-mycomputer')).toEqual({ left: '20px', top: '20px' });
        expect(posOf('icon-primelab')).toEqual({ left: '120px', top: '420px' });
    });

    it('never leaves an icon unpositioned at the origin', () => {
        mountIcons(['icon-mycomputer', 'icon-primelab', 'icon-taskmanager']);
        initializeDraggableIcons();

        for (const id of ['icon-mycomputer', 'icon-primelab', 'icon-taskmanager']) {
            const { left, top } = posOf(id);
            expect(left).toBeTruthy();
            expect(top).toBeTruthy();
        }
    });

    it('gives every known icon a distinct slot (no overlaps)', () => {
        const ids = [
            'icon-mycomputer', 'icon-recyclebin', 'icon-notepad', 'icon-paint',
            'icon-explorer', 'icon-display', 'icon-internet', 'icon-ragdoll-skins',
            'icon-winamp', 'icon-games-folder', 'icon-terminal', 'icon-taskmanager',
            'icon-pluginmanager', 'icon-primelab',
        ];
        mountIcons(ids);
        initializeDraggableIcons();

        const slots = ids.map(id => `${posOf(id).left},${posOf(id).top}`);
        expect(new Set(slots).size).toBe(ids.length);
    });

    it('auto-places an icon with no entry in a free slot instead of (0,0)', () => {
        // The underlying bug: any future icon added without touching the position
        // map would silently stack on My Computer.
        mountIcons(['icon-mycomputer', 'icon-brand-new-app']);
        initializeDraggableIcons();

        const p = posOf('icon-brand-new-app');
        expect(p).not.toEqual({ left: '0px', top: '0px' });
        expect(p).not.toEqual(posOf('icon-mycomputer'));
        expect(p.left).toBeTruthy();
        expect(p.top).toBeTruthy();
    });

    it('two unknown icons do not land on the same slot', () => {
        mountIcons(['icon-unknown-a', 'icon-unknown-b']);
        initializeDraggableIcons();
        expect(posOf('icon-unknown-a')).not.toEqual(posOf('icon-unknown-b'));
    });

    it('a saved position wins over the default slot', () => {
        localStorage.setItem('icon-pos-icon-primelab', JSON.stringify({ x: 555, y: 666 }));
        mountIcons(['icon-primelab']);
        initializeDraggableIcons();
        expect(posOf('icon-primelab')).toEqual({ left: '555px', top: '666px' });
    });

    it('falls back to the default slot when the saved position is corrupt', () => {
        localStorage.setItem('icon-pos-icon-primelab', '{ not json');
        mountIcons(['icon-primelab']);
        initializeDraggableIcons();
        expect(posOf('icon-primelab')).toEqual({ left: '120px', top: '420px' });
    });
});

/**
 * Dropping a desktop icon on the Eco Bin. jsdom reports every rect as all-zero,
 * which the overlap test reads as "always overlapping" — convenient here, since it
 * means these exercise the decision that follows the hit test rather than the
 * geometry.
 */
describe('Drag an icon onto the Eco Bin', () => {
    const drag = (id: string) => {
        const el = document.getElementById(id)!;
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0, clientY: 0 }));
        document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 5, clientY: 5 }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    };

    beforeEach(async () => {
        localStorage.clear();
        document.body.innerHTML = '';
        resetDraggableIconsState();
        (VFS as unknown as { __reset: () => void }).__reset();
        await VFS.init();
    });
    afterEach(() => { document.body.innerHTML = ''; });

    it('trashes the file and takes the icon off the desktop', () => {
        mountIcons(['icon-recyclebin', 'icon-notepad']);
        document.getElementById('icon-notepad')!.setAttribute('data-vfs-name', 'Notapad');
        initializeDraggableIcons();

        expect(VFS.resolve('C:\\DESKTOP\\Notapad')).not.toBeNull();
        drag('icon-notepad');

        expect(VFS.resolve('C:\\DESKTOP\\Notapad')).toBeNull();   // in the bin
        expect(VFS.trashCount()).toBe(1);
        expect(document.getElementById('icon-notepad')).toBeNull(); // and off the desktop
    });

    it('ignores chrome icons that have no file behind them', () => {
        mountIcons(['icon-recyclebin', 'icon-display']);   // no data-vfs-name
        initializeDraggableIcons();

        drag('icon-display');

        expect(VFS.trashCount()).toBe(0);
        expect(document.getElementById('icon-display')).not.toBeNull();
    });

    it('never falls back to the visible label as a VFS key', () => {
        // The label is a `<span data-i18n>` that i18n rewrites per locale. Reading it
        // as a VFS key deleted the user's file in whichever language happened to
        // match the tree and did nothing in the other 39 — so the key must come from
        // `data-vfs-name` or not at all. This icon deliberately has no such
        // attribute, and a label that DOES name a real node.
        mountIcons(['icon-recyclebin', 'icon-notepad']);
        document.getElementById('icon-notepad')!.innerHTML =
            '<span data-i18n="app.notepad">Notapad</span>';
        initializeDraggableIcons();

        drag('icon-notepad');

        expect(VFS.resolve('C:\\DESKTOP\\Notapad')).not.toBeNull();   // untouched
        expect(VFS.trashCount()).toBe(0);
        expect(document.getElementById('icon-notepad')).not.toBeNull();
    });

    it('leaves the bin itself alone', () => {
        mountIcons(['icon-recyclebin']);
        document.getElementById('icon-recyclebin')!.setAttribute('data-vfs-name', 'Eco Bin');
        initializeDraggableIcons();

        drag('icon-recyclebin');
        expect(VFS.trashCount()).toBe(0);
        expect(document.getElementById('icon-recyclebin')).not.toBeNull();
    });
});
