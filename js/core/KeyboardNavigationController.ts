import { Services } from './ServiceContainer';

let globalKeyboardListenersAttached = false;
let keyboardHandler: ((e: KeyboardEvent) => void) | null = null;

export function setupKeyboardNavigation(): void {
    if (!globalKeyboardListenersAttached) {
        keyboardHandler = (e: KeyboardEvent) => {
            // Alt+Tab window switcher
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                const wm: any = Services.get('WindowManager');
                if (wm) {
                    const activeIds = (wm.getActive() as string[]).map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
                    if (activeIds.length > 0) {
                        // Sort by zIndex to cycle in order
                        activeIds.sort((a, b) => {
                            const zA = parseInt(a.style.zIndex || '0', 10);
                            const zB = parseInt(b.style.zIndex || '0', 10);
                            return zA - zB;
                        });

                        const activeEl = document.activeElement;
                        let focusedWinIndex = -1;
                        for (let i = 0; i < activeIds.length; i++) {
                            const winEl = activeIds[i];
                            if (winEl && (winEl === activeEl || winEl.contains(activeEl))) {
                                focusedWinIndex = i;
                                break;
                            }
                        }

                        let nextIndex: number;
                        if (focusedWinIndex === -1) {
                            nextIndex = e.shiftKey ? activeIds.length - 1 : 0;
                        } else {
                            const step = e.shiftKey ? -1 : 1;
                            nextIndex = (focusedWinIndex + step + activeIds.length) % activeIds.length;
                        }

                        const nextWin = activeIds[nextIndex];
                        if (nextWin) {
                            wm.bringToFront(nextWin);
                            
                            const interactive = nextWin.querySelector('[tabindex]:not([tabindex="-1"]), button, input, textarea, select') as HTMLElement | null;
                            if (interactive) {
                                interactive.focus();
                            } else {
                                nextWin.setAttribute('tabindex', '-1');
                                nextWin.focus();
                            }
                        }
                    }
                }
                return;
            }

            const target = e.target as HTMLElement;
            // Ignore if user is typing in an input or textarea
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            if (target.tabIndex === 0 && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                // Trigger dblclick or click action
                if (target.ondblclick) target.ondblclick(new MouseEvent('dblclick') as any);
                else if (target.onclick) target.onclick(new MouseEvent('click') as any);
                else {
                    const event = new MouseEvent('dblclick', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    target.dispatchEvent(event);
                }
            }
        };
        document.addEventListener('keydown', keyboardHandler);
        globalKeyboardListenersAttached = true;
    }
}

export function resetKeyboardNavigationState(): void {
    if (keyboardHandler) {
        document.removeEventListener('keydown', keyboardHandler);
        keyboardHandler = null;
    }
    globalKeyboardListenersAttached = false;
}
