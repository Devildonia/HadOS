/**
 * IFRAME GUEST BOOTSTRAP (Fase 1.y)
 * Loaded inside a process iframe. Waits for the authenticated MessagePort
 * handshake from the host (parent), then runs an App Runtime over that dedicated
 * port using the SDK — demonstrating "the SDK inside the iframe runtime".
 *
 * Served from 'self' so it loads under the app's strict CSP (`script-src 'self'`),
 * which blocks inline/cross-origin guest scripts. Paired with an iframe that has
 * `allow-same-origin` (first-party realm/document isolation + a dedicated,
 * spoof-proof channel). True opaque-origin isolation would require serving guests
 * from a separate origin — see docs/webos-roadmap.
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
