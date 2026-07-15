import { describe, it, expect } from 'vitest';
import { WorkerProcess, messagePortTransport } from '../js/core/WorkerProcess.js';
import { AppRuntime, messagePortGuestTransport } from '../js/sdk/appRuntime.js';

/**
 * End-to-end over a real MessagePort (the same channel type an iframe process
 * uses): host WorkerProcess on port1, guest AppRuntime on port2. Proves the SDK
 * and the host handle interoperate over a dedicated point-to-point channel —
 * no global window bus. Phase 1.y.
 */
function connectHostAndGuest(configureGuest) {
    const channel = new MessageChannel();
    const host = new WorkerProcess(messagePortTransport(channel.port1));
    const guest = new AppRuntime(messagePortGuestTransport(channel.port2));
    configureGuest(guest);
    guest.start();
    return { host, guest };
}

describe('Process over MessagePort (Fase 1.y)', () => {
    it('host.ready resolves from the guest SDK sys:ready over the port', async () => {
        const { host } = connectHostAndGuest(g => g.on('noop', () => null));
        await host.ready;
        expect(host.isReady).toBe(true);
    });

    it('round-trips an app request/response over the port', async () => {
        const { host } = connectHostAndGuest(g =>
            g.on('mul', (p) => p.a * p.b)
        );
        await host.ready;
        expect(await host.request('mul', { a: 6, b: 7 })).toBe(42);
    });

    it('host.ping succeeds against the guest SDK auto-pong', async () => {
        const { host } = connectHostAndGuest(g => g.on('noop', () => null));
        await host.ready;
        expect(await host.ping(200)).toBe(true);
    });

    it('propagates handler errors as a rejected request', async () => {
        const { host } = connectHostAndGuest(g =>
            g.on('fail', () => { throw new Error('guest exploded'); })
        );
        await host.ready;
        await expect(host.request('fail')).rejects.toThrow('guest exploded');
    });
});
