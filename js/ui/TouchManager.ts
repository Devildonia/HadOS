/**
 * WINDOWS 95 APP CENTER - TOUCH MANAGER
 * Unified pointer handling for mouse AND touch on windows and icons.
 * Supports drag, double-tap (as dblclick), and long-press (as right-click).
 * Version: 1.0
 */
import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import { WindowManager } from './WindowManager';

export interface ITouchManager {
    init(): void;
    destroy(): void;
    destroyDraggable(windowId: string): void;
    addPointerEvents(element: HTMLElement, handlers: { onStart?: (e: any) => void, onMove?: (e: any) => void, onEnd?: (e: any) => void }): void;
    DOUBLE_TAP_DELAY: number;
    LONG_PRESS_DELAY: number;
}


const TouchManager: ITouchManager = (() => {
    'use strict';

    // Double-tap detection
    const DOUBLE_TAP_DELAY = 300; // ms
    const LONG_PRESS_DELAY = 500; // ms
    const DRAG_THRESHOLD = 8;     // px before drag starts

    let _lastTapTime = 0;
    let _lastTapTarget: Element | null = null;
    let _longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let _initialized = false;
    let _originalMakeDraggable: ((windowId: string) => void) | null = null;

    const _touchDragRegistry = new Map<string, {
        header: HTMLElement;
        touchstart: EventListener;
        touchmove: EventListener;
        touchend: EventListener;
    }>();

    const _registeredListeners: { element: any, event: string, handler: any }[] = [];

    function addListener(element: any, event: string, handler: any, options?: any): void {
        Utils.eventManager.add(element, event, handler, options);
        _registeredListeners.push({ element, event, handler });
    }

    function clearRegisteredListeners(): void {
        _registeredListeners.forEach(({ element, event, handler }) => {
            Utils.eventManager.remove(element, event, handler);
        });
        _registeredListeners.length = 0;
    }

    /**
     * Initialize touch support
     */
    function init(): void {
        if (_initialized) return;

        // Patch WindowManager.makeDraggable to also handle touch
        patchWindowDragging();

        // Patch desktop icon dragging for touch
        patchIconDragging();

        // Add double-tap detection for icons
        setupDoubleTap();

        _initialized = true;

        Utils.Logger.log('[TouchManager] Initialized');
    }

    function destroy(): void {
        if (_longPressTimer) {
            clearTimeout(_longPressTimer);
            _longPressTimer = null;
        }

        _lastTapTime = 0;
        _lastTapTarget = null;

        // Clean up all active window drag listeners
        for (const windowId of _touchDragRegistry.keys()) {
            destroyDraggable(windowId);
        }

        clearRegisteredListeners();

        const wm: any = Services.get('WindowManager');
        if (wm && _originalMakeDraggable) {
            wm.makeDraggable = _originalMakeDraggable;
        }

        _originalMakeDraggable = null;
        _initialized = false;
    }

    function destroyDraggable(windowId: string): void {
        const entry = _touchDragRegistry.get(windowId);
        if (entry) {
            Utils.eventManager.remove(entry.header, 'touchstart', entry.touchstart);
            Utils.eventManager.remove(document, 'touchmove', entry.touchmove);
            Utils.eventManager.remove(document, 'touchend', entry.touchend);
            _touchDragRegistry.delete(windowId);
        }
    }

    /**
     * Patches WindowManager's draggable to support touch events
     */
    function patchWindowDragging(): void {
        // Override makeDraggable to add touch support
        const wm: any = Services.get('ThemeManager'); // Just testing/accessing services safely
        const wmService: any = Services.get('WindowManager');
        const originalMakeDraggable = wmService?.makeDraggable;
        if (!originalMakeDraggable) return;

        if (!_originalMakeDraggable) {
            _originalMakeDraggable = originalMakeDraggable;
        }

        wmService.makeDraggable = function (windowId: string): void {
            // Call original mouse-based draggable
            originalMakeDraggable(windowId);

            // Clean up previous touch dragging for this window
            destroyDraggable(windowId);

            // Add touch dragging
            const win = document.getElementById(windowId);
            if (!win) return;

            const header = win.querySelector('.window-header') as HTMLElement | null;
            if (!header) return;

            let isDragging = false;
            let startX: number, startY: number, initialX: number, initialY: number;
            let hasMoved = false;

            const onTouchStart = ((e: TouchEvent) => {
                // Ignore if touching buttons
                if ((e.target as HTMLElement).closest('.window-btn')) return;

                const touch = e.touches[0];
                if (!touch) return;
                isDragging = true;
                hasMoved = false;
                startX = touch.clientX;
                startY = touch.clientY;

                const rect = win.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;

                // Bring to front
                const wmRef: any = Services.get('WindowManager');
                if (wmRef) {
                    wmRef.bringToFront(win);
                }

                e.preventDefault();
            }) as EventListener;

            const onTouchMove = ((e: TouchEvent) => {
                if (!isDragging) return;

                const touch = e.touches[0];
                if (!touch) return;
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;

                // Only start dragging after threshold
                if (!hasMoved && Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) {
                    return;
                }
                hasMoved = true;

                win.style.left = (initialX + deltaX) + 'px';
                win.style.top = (initialY + deltaY) + 'px';
                win.style.transform = 'none';

                e.preventDefault();
            }) as EventListener;

            const onTouchEnd = (() => {
                isDragging = false;
            }) as EventListener;

            // Use eventManager to prevent leaks
            Utils.eventManager.add(header, 'touchstart', onTouchStart, { passive: false });
            Utils.eventManager.add(document, 'touchmove', onTouchMove, { passive: false });
            Utils.eventManager.add(document, 'touchend', onTouchEnd);

            _touchDragRegistry.set(windowId, {
                header,
                touchstart: onTouchStart,
                touchmove: onTouchMove,
                touchend: onTouchEnd
            });

            Utils.Logger.log(`[TouchManager] Touch dragging enabled for ${windowId}`);
        };
    }

    /**
     * Adds touch support to desktop icon dragging
     */
    function patchIconDragging(): void {
        // This supplements the existing mouse-based icon dragging in event_listeners.js
        const icons = document.querySelectorAll('#system-icons .icon, #app-launch-zone .icon');
        let draggedIcon: HTMLElement | null = null;
        let offsetX = 0, offsetY = 0;
        let startTouchX = 0, startTouchY = 0;
        let hasMoved = false;

        icons.forEach(iconEl => {
            const icon = iconEl as HTMLElement;
            
            const onStart = ((e: TouchEvent) => {
                const touch = e.touches[0];
                if (!touch) return;
                startTouchX = touch.clientX;
                startTouchY = touch.clientY;
                hasMoved = false;

                _longPressTimer = setTimeout(() => {
                    draggedIcon = icon;
                    icon.style.cursor = 'move';
                    const rect = icon.getBoundingClientRect();
                    offsetX = touch.clientX - rect.left;
                    offsetY = touch.clientY - rect.top;
                    icon.style.zIndex = '100';
                    icon.style.transition = 'none';
                    icon.style.opacity = '0.8';
                }, LONG_PRESS_DELAY);
            }) as EventListener;

            const onMove = ((e: TouchEvent) => {
                const touch = e.touches[0];
                if (!touch) return;
                const dx = touch.clientX - startTouchX;
                const dy = touch.clientY - startTouchY;

                if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                    hasMoved = true;
                    if (_longPressTimer) clearTimeout(_longPressTimer);

                    if (!draggedIcon) {
                        draggedIcon = icon;
                        const rect = icon.getBoundingClientRect();
                        offsetX = startTouchX - rect.left;
                        offsetY = startTouchY - rect.top;
                        icon.style.zIndex = '100';
                        icon.style.transition = 'none';
                        icon.style.opacity = '0.8';
                    }
                }

                if (!draggedIcon) return;
                e.preventDefault();

                let currentX = touch.clientX - offsetX;
                let currentY = touch.clientY - offsetY;

                const desktopRect = document.getElementById('desktop')?.getBoundingClientRect();
                const taskbarHeight = document.getElementById('taskbar')?.offsetHeight || 40;

                if (desktopRect) {
                    currentX = Math.max(0, Math.min(currentX, desktopRect.width - icon.offsetWidth));
                    currentY = Math.max(0, Math.min(currentY, desktopRect.height - taskbarHeight - icon.offsetHeight));
                }

                icon.style.left = currentX + 'px';
                icon.style.top = currentY + 'px';
            }) as EventListener;

            const onEnd = (() => {
                if (_longPressTimer) clearTimeout(_longPressTimer);

                if (draggedIcon) {
                    draggedIcon.style.cursor = '';
                    draggedIcon.style.zIndex = '';
                    draggedIcon.style.transition = '';
                    draggedIcon.style.opacity = '';

                    const position = {
                        x: parseInt(draggedIcon.style.left || '0'),
                        y: parseInt(draggedIcon.style.top || '0')
                    };
                    localStorage.setItem(`icon-pos-${draggedIcon.id}`, JSON.stringify(position));
                    draggedIcon = null;
                }
            }) as EventListener;

            addListener(icon, 'touchstart', onStart, { passive: true });
            addListener(icon, 'touchmove', onMove, { passive: false });
            addListener(icon, 'touchend', onEnd);
        });
    }

    /**
     * Sets up double-tap detection for desktop icons (maps to dblclick action)
     */
    function setupDoubleTap(): void {
        const icons = document.querySelectorAll('#system-icons .icon, #app-launch-zone .icon');

        icons.forEach(iconEl => {
            const icon = iconEl as HTMLElement;
            const onEnd = ((e: TouchEvent) => {
                // Don't trigger dblclick if we were dragging
                if ((e.target as HTMLElement).closest && parseInt(icon.style.zIndex || '0') === 100) return;

                const now = Date.now();
                const isDoubleTap = (
                    now - _lastTapTime < DOUBLE_TAP_DELAY &&
                    _lastTapTarget === icon
                );

                if (isDoubleTap) {
                    // Fire the ondblclick handler
                    e.preventDefault();
                    icon.dispatchEvent(new MouseEvent('dblclick', {
                        bubbles: true,
                        cancelable: true
                    }));
                    _lastTapTime = 0; // Reset to prevent triple-tap
                    _lastTapTarget = null;
                } else {
                    _lastTapTime = now;
                    _lastTapTarget = icon;
                }
            }) as EventListener;

            addListener(icon, 'touchend', onEnd);
        });
    }

    /**
     * Utility: Add unified pointer events (mouse + touch) to an element
     * @param {HTMLElement} element
     * @param {object} handlers - { onStart, onMove, onEnd }
     */
    function addPointerEvents(element: HTMLElement, handlers: { onStart?: (e: any) => void, onMove?: (e: any) => void, onEnd?: (e: any) => void }): void {
        const { onStart, onMove, onEnd } = handlers;

        // Mouse
        if (onStart) addListener(element, 'mousedown', onStart as EventListener);
        if (onMove) addListener(document, 'mousemove', onMove);
        if (onEnd) addListener(document, 'mouseup', onEnd as EventListener);

        // Touch
        if (onStart) {
            const onTouchStart = ((e: TouchEvent) => {
                const touch = e.touches[0];
                if (!touch) return;
                const synth = { clientX: touch.clientX, clientY: touch.clientY, target: e.target, preventDefault: () => e.preventDefault() };
                onStart(synth);
            }) as EventListener;
            addListener(element, 'touchstart', onTouchStart, { passive: false });
        }

        if (onMove) {
            const onTouchMove = ((e: TouchEvent) => {
                if (!e.touches[0]) return;
                const touch = e.touches[0];
                const synth = { clientX: touch.clientX, clientY: touch.clientY, target: e.target, preventDefault: () => e.preventDefault() };
                onMove(synth);
            }) as EventListener;
            addListener(document, 'touchmove', onTouchMove, { passive: false });
        }

        if (onEnd) {
            const onTouchEnd = ((e: TouchEvent) => {
                const synth = { target: e.target, preventDefault: () => e.preventDefault() };
                onEnd(synth);
            }) as EventListener;
            addListener(document, 'touchend', onTouchEnd);
        }
    }

    return {
        init,
        destroy,
        destroyDraggable,
        addPointerEvents,
        DOUBLE_TAP_DELAY,
        LONG_PRESS_DELAY
    };
})();

export { TouchManager };

if (typeof window !== 'undefined') {
    Services.register('TouchManager', TouchManager);
}

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        TouchManager.destroy();
    });
}
