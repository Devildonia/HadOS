/**
 * WINDOWS 95 APP CENTER - WINDOW FACTORY
 * Creates hados-window DOM elements dynamically.
 * Apps call WindowFactory.create() instead of relying on static HTML.
 * Version: 1.1 (ES Modules)
 */

import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import { WindowManager, type IWindowManager } from './WindowManager';

/**
 * Configuration options specifying styling, menus, positioning, and content for created windows.
 */
export interface IWindowOptions {
    /** Unique container ID. Auto-generated if omitted. */
    id?: string;
    /** Title bar display string. */
    title?: string;
    /** Target window width in pixels. */
    width?: number;
    /** Target window height in pixels. */
    height?: number;
    /** Prefix icon symbol or char character displayed in header. */
    icon?: string;
    /** If true, resizability handlers are attached to container borders. */
    resizable?: boolean;
    /** Optional top menu bar item labels. */
    menu?: string[];
    /** Custom CSS class names applied to the wrapper element. */
    className?: string;
    /** Target layout coordinates relative to desktop space. */
    position?: { x: number, y: number };
    /** Prepared DOM node container to append inside the window body directly. */
    bodyElement?: HTMLElement;
    /** Raw HTML/text string injected inside the window body (sanitized). */
    body?: string;
    /** Configures a status bar layout at the bottom of the container. */
    statusBar?: { id?: string, text?: string };
    /** Custom element ID assigned to the guest iframe window. */
    iframeId?: string;
    /** Guest document URL path loaded by the iframe. */
    src?: string;
    /** Custom sandboxing properties applied to the iframe. */
    sandbox?: string;
}

/**
 * Interface detailing window container builder operations.
 */
export interface IWindowFactory {
    /** Instantiates a custom window container element, registers interactions, and appends it to the page. */
    create(opts?: IWindowOptions): string;
    /** Instantiates a custom sandboxed iframe-based app container window. */
    createGameWindow(opts?: IWindowOptions): string;
    /** Permanently removes a window container element from the page and cleans up listeners. */
    destroy(windowId: string): void;
    /** Resolves the body element container handle of a window. */
    getBody(windowId: string): HTMLElement | null;
    /** Modifies the header display title string of a window. */
    setTitle(windowId: string, newTitle: string): void;
    /** Captures the list of created dynamic window identifiers. */
    getCreated(): Set<string>;
    /** Resets the factory counter and purges all created windows from DOM (for tests). */
    __reset(): void;
}

export const WindowFactory: IWindowFactory = (function () {
    'use strict';

    /** Track created window IDs for HMR and cleanup. */
    const createdWindows = new Set<string>();

    /** Ticker counter for auto-generating unique element IDs. */
    let _idCounter = 0;

    /**
     * Creates a hados-window element and appends it to the desktop.
     * @param opts Window configuration.
     * @returns Window ID.
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
        win.className = `hados-window ${className}`.trim();
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
                item.className = 'window-menu-item';
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
     * Creates an iframe-based game window.
     * @param opts Option configurations.
     * @returns Window ID.
     */
    function createGameWindow(opts: IWindowOptions = {}): string {
        const iframeId = opts.iframeId || `${opts.id}-frame`;

        const iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.className = 'game-frame';
        iframe.style.cssText = 'width:100%; height:100%; border:none; background:#000;';
        const sandboxValue = opts.sandbox !== undefined ? opts.sandbox : 'allow-scripts allow-popups';
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
     * Destroys a dynamically created window and removes from DOM.
     * @param windowId Unique ID of the window to destroy.
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
     * Get body element of a window.
     * @param windowId Target window.
     */
    function getBody(windowId: string): HTMLElement | null {
        const win = document.getElementById(windowId);
        return win ? win.querySelector('.window-body') as HTMLElement : null;
    }

    /**
     * Update window title.
     * @param windowId Target window.
     * @param newTitle Target string.
     */
    function setTitle(windowId: string, newTitle: string): void {
        const win = document.getElementById(windowId);
        if (win) {
            const span = win.querySelector('.window-header span');
            if (span) span.textContent = newTitle;
        }
    }

    // --- Private helpers ---
    /** Builds a titlebar header control button element. */
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
            const windows = document.querySelectorAll('.hados-window');
            windows.forEach(w => w.remove());
        }
    };
})();

if (typeof window !== 'undefined') {
    Services.register('WindowFactory', WindowFactory);
}
