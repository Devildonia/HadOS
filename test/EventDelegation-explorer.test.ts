/**
 * Regression: the Games shortcut opened FileX TWICE (once at C:\GAMES via the
 * icon's ondblclick, once at C:\HADOS\DESKTOP\GAMES via data-launch="games-folder"
 * → a second bespoke window). Folder shortcuts now use a declarative
 * `data-explorer-path` handled here, opening the single FileX explorer once.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const { launch } = vi.hoisted(() => ({ launch: vi.fn() }));
vi.mock('../js/core/Kernel', () => ({ Kernel: { launch, registerApp: vi.fn() } }));
vi.mock('../js/core/ServiceContainer', () => ({
    Services: { get: vi.fn(() => undefined), register: vi.fn() },
}));

import { initEventDelegation } from '../js/core/EventDelegation';

describe('data-explorer-path (Games opens FileX once, not a second window)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = `
            <div id="icon-games-folder" data-explorer-path="C:\\GAMES"><span>Games</span></div>
            <div id="start-menu" style="display:block">
                <div id="menu-games" data-explorer-path="C:\\GAMES"><span>Games</span></div>
            </div>`;
        initEventDelegation();
    });

    it('a desktop-icon double click opens the explorer at the path (no live instance → Kernel.launch fallback)', () => {
        document.getElementById('icon-games-folder')!
            .dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        expect(launch).toHaveBeenCalledWith('explorer', { path: 'C:\\GAMES' });
        // Exactly one launch — never a second `games-folder` window.
        expect(launch).toHaveBeenCalledTimes(1);
    });

    it('never launches the legacy games-folder app', () => {
        document.getElementById('icon-games-folder')!
            .dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        expect(launch).not.toHaveBeenCalledWith('games-folder');
    });

    it('a Start-Menu single click on a folder shortcut opens the explorer and closes the menu', () => {
        document.getElementById('menu-games')!
            .dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(launch).toHaveBeenCalledWith('explorer', { path: 'C:\\GAMES' });
        expect(document.getElementById('start-menu')!.style.display).toBe('none');
    });
});
