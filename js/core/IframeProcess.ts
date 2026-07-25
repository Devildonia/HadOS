/**
 * IFRAME PROCESS (host side)
 * Spawns a sandboxed iframe as an isolated process and hands it a dedicated
 * MessagePort over which it speaks the IPC protocol — no global `window` bus.
 *
 * Per-process authentication (generalizes the PluginBridge contentWindow trust):
 *   - the host transfers the port ONLY to the specific iframe it created
 *     (`iframe.contentWindow.postMessage(..., [port])`), never a broadcast;
 *   - the guest accepts the port ONLY from `window.parent`.
 * So each process gets its own authenticated channel; other frames can't reach it.
 *
 * `sandbox="allow-scripts"` (no `allow-same-origin`) gives the guest an opaque
 * origin — real isolation from the host DOM/storage. Phase 1.y.
 */

import { IPC_VERSION, IFRAME_CONNECT_TYPE } from './ipc/protocol';
import { messagePortTransport, type IProcessTransport } from './WorkerProcess';

export { IFRAME_CONNECT_TYPE };

export interface IframeSpawnOptions {
    /** Inline guest document (opaque-origin, no server module loading needed). */
    srcdoc?: string;
    /** OR a guest page URL. */
    src?: string;
    /** Where to mount the iframe (default: hidden in <body> for headless processes). */
    container?: HTMLElement;
    /** Show the iframe (UI apps) instead of hiding it. */
    visible?: boolean;
    /** Extra sandbox tokens if the app needs them (e.g. 'allow-forms'). */
    sandbox?: string;
}

export interface IframeTransportResult {
    transport: IProcessTransport;
    iframe: HTMLIFrameElement;
}

const DANGEROUS_SANDBOX_TOKENS = [
    'allow-same-origin',
    'allow-top-navigation',
    'allow-top-navigation-by-user-activation',
    'allow-modals',
    'allow-pointer-lock'
];

export function sanitizeSandboxTokens(rawSandbox?: string): string {
    if (!rawSandbox) return 'allow-scripts';
    const tokens = rawSandbox.split(/\s+/).filter(t => t.length > 0);
    const safeTokens = tokens.filter(t => !DANGEROUS_SANDBOX_TOKENS.includes(t.toLowerCase()));
    if (!safeTokens.includes('allow-scripts')) {
        safeTokens.unshift('allow-scripts');
    }
    return safeTokens.join(' ');
}

/**
 * Creates the iframe, waits for it to load, then transfers a fresh MessagePort
 * to it and returns a transport over the host end.
 */
export function createIframeTransport(opts: IframeSpawnOptions): Promise<IframeTransportResult> {
    return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('sandbox', sanitizeSandboxTokens(opts.sandbox));
        if (!opts.visible) {
            iframe.style.cssText = 'position:absolute; width:0; height:0; border:0; visibility:hidden;';
        }

        iframe.addEventListener('load', () => {
            const win = iframe.contentWindow;
            if (!win) { reject(new Error('iframe has no contentWindow')); return; }
            const channel = new MessageChannel();
            // Transfer port2 to THIS iframe only (opaque origin → targetOrigin '*').
            win.postMessage({ type: IFRAME_CONNECT_TYPE, v: IPC_VERSION }, '*', [channel.port2]);
            resolve({ transport: messagePortTransport(channel.port1), iframe });
        }, { once: true });

        iframe.addEventListener('error', () => reject(new Error('iframe failed to load')), { once: true });

        if (opts.srcdoc !== undefined) iframe.srcdoc = opts.srcdoc;
        else if (opts.src) iframe.src = opts.src;
        else { reject(new Error('createIframeTransport needs srcdoc or src')); return; }

        (opts.container ?? document.body).appendChild(iframe);
    });
}
