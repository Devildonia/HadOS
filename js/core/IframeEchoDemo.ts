/**
 * IFRAME PROCESS DEMO (Fase 1.y)
 * Spawns a sandboxed iframe process running the App SDK (see js/sdk/guestBoot.ts)
 * over a dedicated, authenticated MessagePort — proving the iframe-process path
 * end-to-end with the SDK inside the guest.
 *
 * The guest runs with an OPAQUE ORIGIN (`sandbox="allow-scripts"`, no
 * `allow-same-origin`): it cannot reach the host DOM, localStorage or IndexedDB —
 * only its dedicated port. That works because the guest is served as a classic
 * IIFE bundle (see vite.guest.config.js); an ES module would be CORS-refused from
 * a null origin. See docs/webos-roadmap/phase-1-process-model.md.
 */

import { Kernel } from './Kernel';
import type { WorkerProcess } from './WorkerProcess';

/** URL of the served guest document (resolved relative to the app base). */
export const PROCESS_GUEST_URL = new URL('process-guest.html', document.baseURI).href;

export interface EchoIframeHandle {
    pid: number;
    worker: WorkerProcess;
    iframe: HTMLIFrameElement;
}

/** Spawns the SDK-based guest as an isolated iframe process (opaque origin). */
export function spawnEchoIframe(): Promise<EchoIframeHandle> {
    // No extra sandbox tokens: IframeProcess applies `allow-scripts` alone, which
    // keeps the guest on an opaque origin.
    return Kernel.spawnIframe('echo-iframe', { src: PROCESS_GUEST_URL });
}
