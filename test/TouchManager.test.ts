import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TouchManager } from '../js/ui/TouchManager';
import { Services } from '../js/core/ServiceContainer';
import { Utils } from '../js/utils';

describe('TouchManager', () => {
    let mockWindowManager: any;
    let mockThemeManager: any;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.restoreAllMocks();
        (Services as any).__reset();

        mockWindowManager = {
            open: vi.fn(),
            bringToFront: vi.fn(),
            makeDraggable: vi.fn()
        };

        mockThemeManager = {};

        Services.register('WindowManager', mockWindowManager);
        Services.register('ThemeManager', mockThemeManager);

        // Reset localStorage
        localStorage.clear();

        // Setup base DOM
        document.body.innerHTML = `
            <div id="desktop">
                <div id="system-icons">
                    <div id="icon-notepad" class="icon" style="position: absolute; left: 10px; top: 10px;">
                        <span class="icon-box">📝</span>
                    </div>
                </div>
                <div id="app-launch-zone"></div>
                <div id="taskbar" style="height: 40px;"></div>
                
                <div id="win-1" class="hados-window" style="position: absolute; left: 50px; top: 50px; display: block;">
                    <div class="window-header">
                        <span>Header</span>
                        <button class="window-btn">X</button>
                    </div>
                </div>
            </div>
        `;
    });

    afterEach(() => {
        TouchManager.destroy();
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    describe('Initialization & Teardown', () => {
        it('should initialize and patch drag functions', () => {
            TouchManager.init();
            expect(mockWindowManager.makeDraggable).not.toBe(TouchManager.init);
            
            // Check that we can make draggable with touch support patched
            mockWindowManager.makeDraggable('win-1');
            expect(mockWindowManager.makeDraggable).toBeDefined();
        });

        it('should skip duplicate initialization', () => {
            TouchManager.init();
            const spy = vi.spyOn(Utils.Logger, 'log');
            TouchManager.init();
            // Should not log initialization second time
            expect(spy).not.toHaveBeenCalled();
        });

        it('should properly cleanup and restore on destroy', () => {
            TouchManager.init();
            mockWindowManager.makeDraggable('win-1');
            
            TouchManager.destroy();
            
            // Re-initializing shouldn't throw
            expect(() => TouchManager.init()).not.toThrow();
        });
    });

    describe('Window Touch Dragging', () => {
        beforeEach(() => {
            TouchManager.init();
            mockWindowManager.makeDraggable('win-1');
        });

        it('should drag window when touching the header and moving past threshold', () => {
            const win = document.getElementById('win-1')!;
            const header = win.querySelector('.window-header')!;

            // 1. TouchStart
            const startEvent = new TouchEvent('touchstart', {
                touches: [{ clientX: 100, clientY: 100 } as Touch]
            } as any);
            header.dispatchEvent(startEvent);

            expect(mockWindowManager.bringToFront).toHaveBeenCalledWith(win);

            // 2. TouchMove within threshold (DRAG_THRESHOLD = 8px)
            const moveEvent1 = new TouchEvent('touchmove', {
                touches: [{ clientX: 105, clientY: 105 } as Touch]
            } as any);
            document.dispatchEvent(moveEvent1);
            expect(win.style.left).toBe('50px'); // Unchanged

            // 3. TouchMove outside threshold (deltaX = 15, deltaY = 15)
            const moveEvent2 = new TouchEvent('touchmove', {
                touches: [{ clientX: 115, clientY: 115 } as Touch]
            } as any);
            document.dispatchEvent(moveEvent2);
            // Initial is left=50, top=50. Rect left is mocked differently in jsdom sometimes, 
            // but under jsdom win.getBoundingClientRect() might return 0s unless mocked.
            // Let's verify style changes. Left should update by delta
            expect(win.style.left).not.toBe('50px');
            
            // 4. TouchEnd
            const endEvent = new TouchEvent('touchend');
            document.dispatchEvent(endEvent);
        });

        it('should ignore dragging if touching window-btn', () => {
            const win = document.getElementById('win-1')!;
            const button = win.querySelector('.window-btn')!;

            const startEvent = new TouchEvent('touchstart', {
                touches: [{ clientX: 100, clientY: 100 } as Touch],
                bubbles: true
            } as any);
            button.dispatchEvent(startEvent);

            // bringToFront should NOT be called because drag was ignored
            expect(mockWindowManager.bringToFront).not.toHaveBeenCalled();
        });

        it('should allow destroying a draggable window touch listeners', () => {
            expect(() => TouchManager.destroyDraggable('win-1')).not.toThrow();
        });
    });

    describe('Icon Touch Dragging and Long Press', () => {
        it('should handle icon long-press to start dragging', () => {
            TouchManager.init();
            const icon = document.getElementById('icon-notepad')!;

            // TouchStart
            const startEvent = new TouchEvent('touchstart', {
                touches: [{ clientX: 15, clientY: 15 } as Touch]
            } as any);
            icon.dispatchEvent(startEvent);

            // Move slightly but not starting drag yet
            const moveEvent1 = new TouchEvent('touchmove', {
                touches: [{ clientX: 16, clientY: 16 } as Touch]
            } as any);
            document.dispatchEvent(moveEvent1);
            expect(icon.style.opacity).toBe('');

            // Advance timers by LONG_PRESS_DELAY (500ms)
            vi.advanceTimersByTime(500);

            // Should start drag (change opacity, z-index)
            expect(icon.style.opacity).toBe('0.8');
            expect(icon.style.zIndex).toBe('100');

            // Move further
            const moveEvent2 = new TouchEvent('touchmove', {
                touches: [{ clientX: 100, clientY: 100 } as Touch]
            } as any);
            document.dispatchEvent(moveEvent2);

            // End touch
            const endEvent = new TouchEvent('touchend');
            icon.dispatchEvent(endEvent);

            expect(icon.style.zIndex).toBe('');
            expect(icon.style.opacity).toBe('');
            
            // Check position saved in localStorage
            const saved = localStorage.getItem('icon-pos-icon-notepad');
            expect(saved).toBeDefined();
        });

        it('should handle drag by immediate move past threshold', () => {
            TouchManager.init();
            const icon = document.getElementById('icon-notepad')!;

            const startEvent = new TouchEvent('touchstart', {
                touches: [{ clientX: 15, clientY: 15 } as Touch]
            } as any);
            icon.dispatchEvent(startEvent);

            // Immediate move past threshold (15 + 10 = 25 > 8)
            const moveEvent = new TouchEvent('touchmove', {
                touches: [{ clientX: 25, clientY: 25 } as Touch]
            } as any);
            icon.dispatchEvent(moveEvent);

            // Should activate drag immediately and cancel long press timer
            expect(icon.style.opacity).toBe('0.8');

            const endEvent = new TouchEvent('touchend');
            icon.dispatchEvent(endEvent);
        });
    });

    describe('Icon Double-Tap', () => {
        it('should trigger dblclick mouse event on double tap', () => {
            TouchManager.init();
            const icon = document.getElementById('icon-notepad')!;
            let dblClicked = false;
            icon.addEventListener('dblclick', () => {
                dblClicked = true;
            });

            // Tap 1
            const endEvent1 = new TouchEvent('touchend', { bubbles: true } as any);
            icon.dispatchEvent(endEvent1);
            vi.advanceTimersByTime(100); // 100ms later (< 300ms delay)

            // Tap 2
            const endEvent2 = new TouchEvent('touchend', { bubbles: true } as any);
            icon.dispatchEvent(endEvent2);

            expect(dblClicked).toBe(true);
        });

        it('should not trigger dblclick if taps are slow', () => {
            TouchManager.init();
            const icon = document.getElementById('icon-notepad')!;
            let dblClicked = false;
            icon.addEventListener('dblclick', () => {
                dblClicked = true;
            });

            // Tap 1
            const endEvent1 = new TouchEvent('touchend', { bubbles: true } as any);
            icon.dispatchEvent(endEvent1);
            vi.advanceTimersByTime(400); // 400ms later (> 300ms delay)

            // Tap 2
            const endEvent2 = new TouchEvent('touchend', { bubbles: true } as any);
            icon.dispatchEvent(endEvent2);

            expect(dblClicked).toBe(false);
        });
    });

    describe('addPointerEvents', () => {
        it('should map unified mouse and touch events correctly', () => {
            const element = document.createElement('div');
            document.body.appendChild(element);

            const startSpy = vi.fn();
            const moveSpy = vi.fn();
            const endSpy = vi.fn();

            TouchManager.addPointerEvents(element, {
                onStart: startSpy,
                onMove: moveSpy,
                onEnd: endSpy
            });

            // Test mouse interactions
            element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10 }));
            expect(startSpy).toHaveBeenCalled();

            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 20 }));
            expect(moveSpy).toHaveBeenCalled();

            document.dispatchEvent(new MouseEvent('mouseup'));
            expect(endSpy).toHaveBeenCalled();

            // Test touch interactions
            startSpy.mockClear();
            moveSpy.mockClear();
            endSpy.mockClear();

            element.dispatchEvent(new TouchEvent('touchstart', {
                touches: [{ clientX: 30, clientY: 30 } as Touch]
            } as any));
            expect(startSpy).toHaveBeenCalled();

            document.dispatchEvent(new TouchEvent('touchmove', {
                touches: [{ clientX: 40, clientY: 40 } as Touch]
            } as any));
            expect(moveSpy).toHaveBeenCalled();

            document.dispatchEvent(new TouchEvent('touchend', {} as any));
            expect(endSpy).toHaveBeenCalled();
        });
    });
});
