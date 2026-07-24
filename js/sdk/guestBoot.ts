/**
 * IFRAME GUEST BOOTSTRAP (Fase 1.y)
 * Loaded inside a process iframe. Waits for the authenticated MessagePort
 * handshake from the host (parent), then runs an App Runtime over that dedicated
 * port using the SDK — demonstrating "the SDK inside the iframe runtime".
 *
 * Isolation model — real opaque origin, NOT a first-party realm:
 * This is the entry that `vite.guest.config.ts` bundles into a single self-
 * contained CLASSIC IIFE (`public/process-guest.js`, loaded by
 * `public/process-guest.html`). The host runs it in an iframe with
 * `sandbox="allow-scripts"` and NO `allow-same-origin` — an opaque (`null`)
 * origin. The blocker for opaque origins was never the CSP: it's that an opaque
 * origin cannot fetch ES modules (CORS refuses them from a null origin), which
 * is what used to force `allow-same-origin`. A classic script executes without a
 * CORS check, so shipping the guest as one inlined IIFE is exactly what lets us
 * drop `allow-same-origin` and get true origin isolation — no separate origin
 * required. Per-process auth (host transfers the port only to the frame it
 * created; the guest accepts only from `window.parent`) rides on top.
 * See IframeProcess.ts, vite.guest.config.ts, and docs/webos-roadmap.
 */

import { createPortRuntime } from './appRuntime';
import { IFRAME_CONNECT_TYPE } from '../core/ipc/protocol';

// NOTE: deliberately NOT `{ once: true }`. With `once` the listener is consumed
// by the FIRST message of any kind, so a stray postMessage from another frame
// would burn it and the real handshake from the host would never be seen. Keep
// listening until a valid handshake arrives, then detach.
function onConnect(e: MessageEvent): void {
    // Per-process auth: only accept the port from our host (the parent frame).
    if (e.source !== window.parent) return;
    if (!e.data || e.data.type !== IFRAME_CONNECT_TYPE) return;
    const port = e.ports[0];
    if (!port) return;

    window.removeEventListener('message', onConnect); // handshake done
    const rt = createPortRuntime(port);
    rt.on('echo', (payload) => payload)
        .on('reverse', (payload) => String(payload).split('').reverse().join(''))
        // Demonstrates a syscall: the guest asks the host to write a file via the
        // mediated fs.write syscall (the guest can't touch the VFS directly).
        .on('save', (payload) => rt.syscall('fs.write', payload))
        .start();
}

window.addEventListener('message', onConnect);
