import { Utils } from '../utils';

// ============================================
// IFRAME PROCESS MANAGER
// Trata cada iframe de una ventana como un "proceso": lo termina por completo
// al cerrar (detiene red, rAFs, timers, audio y descarga el src guardándolo) y
// lo restaura al reabrir. Extraído de WindowManager. Sin estado propio.
// ============================================

export class IframeProcessManager {
    /**
     * Restore iframe sources if they were unloaded (process restoration)
     */
    public restoreIframes(win: HTMLElement, windowId: string): void {
        const iframes = win.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const savedSrc = iframe.getAttribute('data-src');
            const isBlank = !iframe.src || iframe.src === 'about:blank' || iframe.src.startsWith('about:blank');

            if (savedSrc && isBlank) {
                iframe.src = savedSrc;
                Utils.Logger.window(`Restored process in ${windowId}`);
            } else if (!savedSrc && !isBlank) {
                iframe.setAttribute('data-src', iframe.src);
            }
        });
    }

    /**
     * Terminates all iframes of a window (stops rAF, intervals, audio, unloads).
     */
    public terminateWindowIframes(win: HTMLElement, windowId: string): void {
        const iframes = win.querySelectorAll('iframe');
        iframes.forEach(iframe => this.terminateIframe(iframe, windowId));
    }

    /**
     * Terminates an iframe completely — stops execution, clears intervals/rAFs, unloads
     */
    public terminateIframe(iframe: HTMLIFrameElement, context: string): void {
        try {
            const iframeWindow = iframe.contentWindow as any;
            if (iframeWindow) {
                // Stop all network requests and parsing.
                iframeWindow.stop();

                // Give the game a chance to tear itself down cleanly if it opts in.
                if (typeof iframeWindow.__teardown === 'function') {
                    try { iframeWindow.__teardown(); } catch { /* ignore */ }
                }

                // Close any AudioContext (games may store it under a couple of names).
                try {
                    const audioCtx = iframeWindow._audioContext || iframeWindow.audioContext;
                    if (audioCtx && audioCtx.state !== 'closed') {
                        audioCtx.close();
                    }
                } catch { /* ignore */ }

                // NOTE: pending rAFs, timeouts and intervals are NOT swept by ID here.
                // Setting `iframe.src = 'about:blank'` below discards the entire
                // browsing context, which cancels all of them automatically. The old
                // brute-force `for (i=0; i<=highestId; i++)` loops ran up to hundreds
                // of thousands of synchronous calls on the main thread — visible jank
                // on close — for zero benefit over the src reset.
            }
        } catch {
            // Cross-origin iframe — cannot access contentWindow, just unload
            Utils.Logger.window(`Cross-origin iframe in ${context}, unloading directly`);
        }

        // Save src for potential restoration and unload
        if (iframe.src && iframe.src !== 'about:blank' && !iframe.src.startsWith('about:blank')) {
            iframe.setAttribute('data-src', iframe.src);
        }
        iframe.src = 'about:blank';
        Utils.Logger.window(`Terminated process in ${context}`);
    }
}
