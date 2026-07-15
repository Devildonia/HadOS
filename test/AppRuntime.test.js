import { describe, it, expect } from 'vitest';
import { AppRuntime } from '../js/sdk/appRuntime.js';

/**
 * Drives the guest-side SDK through a fake transport that captures what the app
 * posts back to the host and lets the test inject host->guest messages.
 */
function makeHarness() {
    const sent = [];
    let guestHandler = null;
    const transport = {
        post: (msg) => sent.push(msg),
        onMessage: (h) => { guestHandler = h; },
    };
    return {
        transport,
        sent,
        // Simulate the host delivering a message to the guest.
        deliver: (msg) => guestHandler && guestHandler(msg),
    };
}

const nextTick = () => new Promise(r => setTimeout(r, 0));

describe('AppRuntime SDK (Fase 1.x)', () => {
    it('announces sys:ready on start()', () => {
        const h = makeHarness();
        new AppRuntime(h.transport).start();
        expect(h.sent).toContainEqual({ ch: 'sys', type: 'ready' });
    });

    it('auto-answers sys:ping with a matching pong', () => {
        const h = makeHarness();
        new AppRuntime(h.transport).start();
        h.deliver({ ch: 'sys', type: 'ping', id: 7 });
        expect(h.sent).toContainEqual({ ch: 'sys', type: 'pong', id: 7 });
    });

    it('routes an app request to its handler and replies with the result', async () => {
        const h = makeHarness();
        new AppRuntime(h.transport)
            .on('sum', (payload) => (payload.a + payload.b))
            .start();
        h.deliver({ ch: 'app', type: 'sum', id: 1, payload: { a: 2, b: 3 } });
        await nextTick();
        expect(h.sent).toContainEqual({ ch: 'app', type: 'response', id: 1, payload: 5 });
    });

    it('awaits async handlers', async () => {
        const h = makeHarness();
        new AppRuntime(h.transport)
            .on('slow', async () => { await nextTick(); return 'ok'; })
            .start();
        h.deliver({ ch: 'app', type: 'slow', id: 9 });
        await nextTick(); await nextTick();
        expect(h.sent).toContainEqual({ ch: 'app', type: 'response', id: 9, payload: 'ok' });
    });

    it('replies with an error when a handler throws', async () => {
        const h = makeHarness();
        new AppRuntime(h.transport)
            .on('boom', () => { throw new Error('nope'); })
            .start();
        h.deliver({ ch: 'app', type: 'boom', id: 2 });
        await nextTick();
        expect(h.sent).toContainEqual({ ch: 'app', type: 'response', id: 2, error: 'nope' });
    });

    it('replies with an error for an unknown request type', async () => {
        const h = makeHarness();
        new AppRuntime(h.transport).start();
        h.deliver({ ch: 'app', type: 'mystery', id: 3 });
        await nextTick();
        const reply = h.sent.find(m => m.ch === 'app' && m.id === 3);
        expect(reply.error).toMatch(/unknown request/);
    });

    it('ignores response-typed messages (does not echo them)', async () => {
        const h = makeHarness();
        new AppRuntime(h.transport).on('x', () => 1).start();
        h.deliver({ ch: 'app', type: 'response', id: 5, payload: 'from-host' });
        await nextTick();
        expect(h.sent.filter(m => m.ch === 'app').length).toBe(0);
    });
});
