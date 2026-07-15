import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initializeDraggableIcons } from '../js/core/DesktopIconController.js';

/**
 * Desktop icon placement. Regression guard for v1.6.7: Prime Lab's icon had no
 * entry in the position map, so it kept `position:absolute` with no coordinates
 * and rendered at (0,0) — right on top of My Computer.
 */
function mountIcons(ids) {
    document.body.innerHTML = `<div id="desktop"><div id="system-icons"></div></div>`;
    const host = document.getElementById('system-icons');
    for (const id of ids) {
        const el = document.createElement('div');
        el.id = id;
        el.className = 'icon';
        host.appendChild(el);
    }
}

const posOf = (id) => {
    const el = document.getElementById(id);
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
