import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../js/ui/WindowManager', () => ({
    WindowManager: {
        makeDraggable: vi.fn(),
        makeResizable: vi.fn(),
        destroyWindowInteractions: vi.fn(),
        open: vi.fn()
    }
}));

import { WindowFactory } from '../js/ui/WindowFactory';
import { Services } from '../js/core/ServiceContainer';
import { WindowManager } from '../js/ui/WindowManager';

describe('WindowFactory', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="desktop"></div>';
        vi.clearAllMocks();
        (Services as any).__reset();
        (WindowFactory as any).__reset();
        Services.register('WindowManager', WindowManager as any);
    });

    it('should create a window with correct structure', () => {
        const id = WindowFactory.create({
            title: 'Test Window',
            body: '<p>Content</p>'
        });

        const win = document.getElementById(id);
        expect(win).not.toBeNull();
        expect(win!.classList.contains('hados-window')).toBe(true);
        expect(win!.querySelector('.window-header span')!.textContent).toBe('Test Window');
        expect(win!.querySelector('.window-body')!.innerHTML).toBe('<p>Content</p>');
    });

    it('should not create duplicate windows by ID', () => {
        const id1 = WindowFactory.create({ id: 'unique-win', title: 'First' });
        const id2 = WindowFactory.create({ id: 'unique-win', title: 'Second' });

        expect(id1).toBe(id2);
        const windows = document.querySelectorAll('.hados-window');
        expect(windows.length).toBe(1);
    });

    it('should create game windows with lazy loading attributes', () => {
        const id = WindowFactory.createGameWindow({
            id: 'my-game',
            src: 'game.html'
        });

        const win = document.getElementById(id);
        const iframe = win!.querySelector('iframe');
        expect(iframe).not.toBeNull();
        expect(iframe!.getAttribute('loading')).toBe('lazy');
        expect(iframe!.getAttribute('data-src')).toBe('game.html');
        // In JSDOM, setting src to empty might reflect differently depending on version
        expect(iframe!.getAttribute('src') || '').toBe(''); // Should be empty initially (lazy)
    });

    it('should destroy windows correctly and clean up interactions', () => {
        const id = WindowFactory.create({ title: 'Kill Me' });
        expect(document.getElementById(id)).not.toBeNull();

        WindowFactory.destroy(id);
        expect(document.getElementById(id)).toBeNull();
        expect(WindowManager.destroyWindowInteractions).toHaveBeenCalledWith(id);
    });

    it('should update window title', () => {
        const id = WindowFactory.create({ title: 'Old Title' });
        WindowFactory.setTitle(id, 'New Title');

        const span = document.querySelector('.window-header span')!;
        expect(span.textContent).toBe('New Title');
    });

    it('keeps the app icon out of the title span so retitling never clobbers it', () => {
        const id = WindowFactory.create({ id: 'iconed-win', title: 'Paint', icon: '🎨' });
        const win = document.getElementById(id)!;

        // Icon lives in its own <i>, not in the title <span>.
        const iconEl = win.querySelector('.window-header .window-icon')!;
        expect(iconEl.tagName).toBe('I');
        expect(iconEl.textContent).toBe('🎨');
        expect(win.querySelector('.window-header span')!.textContent).toBe('Paint');

        // Retitling (as FileExplorer/Notepad do) must not wipe the icon.
        WindowFactory.setTitle(id, 'C:\\');
        expect(win.querySelector('.window-header span')!.textContent).toBe('C:\\');
        expect(win.querySelector('.window-header .window-icon')!.textContent).toBe('🎨');
    });

    it('setTitleIcon renders an asset path as an <img> (matching the taskbar)', () => {
        const id = WindowFactory.create({ id: 'img-icon-win', title: 'Ragdoll', icon: '🎭' });
        WindowFactory.setTitleIcon(id, 'assets/icons/ragdoll_workshop.webp');

        const iconEl = document.querySelector('#img-icon-win .window-icon')!;
        const img = iconEl.querySelector('img');
        expect(img).not.toBeNull();
        expect(img!.getAttribute('src')).toBe('assets/icons/ragdoll_workshop.webp');
        // The emoji placeholder is gone — one icon, not two.
        expect(iconEl.textContent).toBe('');

        // A falsy icon is a no-op (keeps the existing one).
        WindowFactory.setTitleIcon(id, '');
        expect(document.querySelector('#img-icon-win .window-icon img')).not.toBeNull();
    });
});
