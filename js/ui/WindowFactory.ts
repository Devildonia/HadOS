/**
 * WINDOWS 95 APP CENTER - WINDOW FACTORY
 * Creates win95-window DOM elements dynamically.
 * Apps call WindowFactory.create() instead of relying on static HTML.
 * Version: 1.1 (ES Modules)
 */

import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import { WindowManager, type IWindowManager } from './WindowManager';

export interface IWindowOptions {
    id?: string;
    title?: string;
    width?: number;
    height?: number;
    icon?: string;
    resizable?: boolean;
    menu?: string[];
    className?: string;
    position?: { x: number, y: number };
    bodyElement?: HTMLElement;
    body?: string;
    statusBar?: { id?: string, text?: string };
    iframeId?: string;
    src?: string;
    sandbox?: string;
}

export interface IWindowFactory {
    create(opts?: IWindowOptions): string;
    createGameWindow(opts?: IWindowOptions): string;
    destroy(windowId: string): void;
    getBody(windowId: string): HTMLElement | null;
    setTitle(windowId: string, newTitle: string): void;
    getCreated(): Set<string>;
    __reset(): void;
}

export const WindowFactory: IWindowFactory = (function () {
    'use strict';

    // Track created windows for cleanup
    const createdWindows = new Set<string>();

    // Counter for auto-generating unique IDs
    let _idCounter = 0;

    /**
     * Creates a win95-window element and appends it to the desktop
     * @param {IWindowOptions} opts - Window configuration
     * @returns {string} Window ID
     */
    function create(opts: IWindowOptions = {}): string {
        const id = opts.id || `win-dynamic-${++_idCounter}`;

        // Don't create duplicate
        if (document.getElementById(id)) {
            Utils.Logger.window(`WindowFactory: ${id} already exists, skipping creation`);
            return id;
        }

        const title = opts.title || 'Window';
        const width = opts.width ? `${opts.width}px` : '';
        const height = opts.height ? `${opts.height}px` : '';
        const icon = opts.icon || '';
        const menu = opts.menu || null;
        const className = opts.className || '';

        // Build window DOM
        const win = document.createElement('div');
        win.className = `win95-window ${className}`.trim();
        win.id = id;
        win.style.display = 'none';
        win.setAttribute('role', 'dialog');
        win.setAttribute('aria-labelledby', `${id}-title`);
        if (width) win.style.width = width;
        if (height) win.style.height = height;

        // Position
        if (opts.position) {
            win.style.left = `${opts.position.x}px`;
            win.style.top = `${opts.position.y}px`;
        }

        // --- HEADER ---
        const header = document.createElement('div');
        header.className = 'window-header';

        const titleSpan = document.createElement('span');
        titleSpan.id = `${id}-title`;
        titleSpan.textContent = icon ? `${icon} ${title}` : title;
        header.appendChild(titleSpan);

        const controls = document.createElement('div');
        controls.className = 'window-controls';

        const minBtn = _createBtn('minimize-btn', '_', 'Minimize');
        const maxBtn = _createBtn('maximize-btn', '□', 'Maximize');
        const closeBtn = _createBtn('close-btn', '×', 'Close');

        minBtn.setAttribute('aria-label', 'Minimize');
        maxBtn.setAttribute('aria-label', 'Maximize');
        closeBtn.setAttribute('aria-label', 'Close');

        controls.appendChild(minBtn);
        controls.appendChild(maxBtn);
        controls.appendChild(closeBtn);
        header.appendChild(controls);
        win.appendChild(header);

        // --- MENU BAR (optional) ---
        if (menu && Array.isArray(menu)) {
            const menuBar = document.createElement('div');
            menuBar.className = 'window-menu';
            menu.forEach(label => {
                const item = document.createElement('span');
                item.className = 'menu-item';
                item.textContent = label;
                menuBar.appendChild(item);
            });
            win.appendChild(menuBar);
        }

        // --- BODY ---
        const body = document.createElement('div');
        body.className = 'window-body';

        if (opts.bodyElement) {
            body.appendChild(opts.bodyElement);
        } else if (opts.body) {
            // Sanitize HTML content before injection
            body.innerHTML = typeof (Utils as any).sanitizeHTML === 'function'
                ? (Utils as any).sanitizeHTML(opts.body)
                : opts.body;
        }

        win.appendChild(body);

        // --- STATUS BAR (optional) ---
        if (opts.statusBar) {
            const status = document.createElement('div');
            status.className = 'window-status';
            status.id = opts.statusBar.id || `${id}-status`;
            status.textContent = opts.statusBar.text || 'Ready';
            win.appendChild(status);
        }

        // Append to desktop (or body if desktop not found)
        const desktop = document.getElementById('desktop') || document.body;
        desktop.appendChild(win);

        // Register with WindowManager
        const wm = Services.get('WindowManager') as IWindowManager | undefined;
        if (wm) {
            wm.makeDraggable(id);
            // Resize handle is added by makeResizable if needed
        }

        createdWindows.add(id);
        Utils.Logger.window(`WindowFactory: Created "${title}" [${id}]`);

        return id;
    }

    /**
     * Creates an iframe-based game window
     * @param {IWindowOptions} opts - { id, title, src, width, height, icon }
     * @returns {string} Window ID
     */
    function createGameWindow(opts: IWindowOptions = {}): string {
        const iframeId = opts.iframeId || `${opts.id}-frame`;

        const iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.className = 'game-frame';
        iframe.style.cssText = 'width:100%; height:100%; border:none; background:#000;';
        const sandboxValue = opts.sandbox !== undefined ? opts.sandbox : 'allow-scripts allow-same-origin allow-popups';
        if (sandboxValue) {
            iframe.setAttribute('sandbox', sandboxValue);
        }
        iframe.setAttribute('loading', 'lazy');
        // Don't set src yet — only load when window opens (lazy)
        iframe.setAttribute('data-src', opts.src || '');

        return create({
            ...opts,
            bodyElement: iframe,
            className: `game-window ${opts.className || ''}`.trim()
        });
    }

    /**
     * Destroys a dynamically created window and removes from DOM
     * @param {string} windowId
     */
    function destroy(windowId: string): void {
        const win = document.getElementById(windowId);
        if (win) {
            // Terminate any iframes first
            const iframes = win.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    iframe.contentWindow?.stop();
                } catch (e) { /* cross-origin */ }
                iframe.src = 'about:blank';
            });

            // Clean up drag and resize events to prevent memory leaks
            WindowManager.destroyWindowInteractions(windowId);

            // Execute custom onClose callback if registered on the element
            if ((win as any)._onCloseCallback) {
                try {
                    (win as any)._onCloseCallback();
                } catch (e) { /* ignore */ }
            }

            win.remove();
            createdWindows.delete(windowId);
            Utils.Logger.window(`WindowFactory: Destroyed [${windowId}]`);
        }
    }

    /**
     * Get body element of a window
     * @param {string} windowId
     * @returns {HTMLElement|null}
     */
    function getBody(windowId: string): HTMLElement | null {
        const win = document.getElementById(windowId);
        return win ? win.querySelector('.window-body') as HTMLElement : null;
    }

    /**
     * Update window title
     * @param {string} windowId
     * @param {string} newTitle
     */
    function setTitle(windowId: string, newTitle: string): void {
        const win = document.getElementById(windowId);
        if (win) {
            const span = win.querySelector('.window-header span');
            if (span) span.textContent = newTitle;
        }
    }

    // --- Private helpers ---
    function _createBtn(className: string, text: string, title: string): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.className = `window-btn ${className}`;
        btn.textContent = text;
        btn.title = title;
        return btn;
    }

    return {
        create,
        createGameWindow,
        destroy,
        getBody,
        setTitle,
        getCreated: () => new Set(createdWindows),
        __reset: () => {
            createdWindows.clear();
            _idCounter = 0;
            // Clear DOM windows if any
            const windows = document.querySelectorAll('.win95-window');
            windows.forEach(w => w.remove());
        }
    };
})();

if (typeof window !== 'undefined') {
    Services.register('WindowFactory', WindowFactory);
}
