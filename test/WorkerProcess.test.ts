import { EventBus } from '../js/core/EventBus';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WorkerProcess } from '../js/core/WorkerProcess';
import { ProcessWatchdog } from '../js/core/ProcessWatchdog';
import { Kernel } from '../js/core/Kernel';
import type { IProcessTransport } from '../js/core/WorkerProcess';

/**
 * A loopback transport backed by a controllable fake guest that speaks the IPC
 * protocol. No real Worker (jsdom has none) — WorkerProcess talks to an
 * IProcessTransport, so this exercises the real host-side logic.
 */
function makeFakeTransport({ autoReady = true } = {}) {
    let hostHandler: any = null;
    let terminated = false;
    const state = { hang: false };

    const guestSend = (msg: any) => { if (hostHandler && !terminated) hostHandler(msg); };

    function guestReceive(msg: any) {
        if (terminated || state.hang) return; // hung guest ignores everything
        if (msg.ch === 'sys' && msg.type === 'ping') {
            guestSend({ ch: 'sys', type: 'pong', id: msg.id });
        } else if (msg.ch === 'app') {
            if (msg.type === 'echo') {
                guestSend({ ch: 'app', type: 'response', id: msg.id, payload: msg.payload });
            } else if (msg.type === 'boom') {
                guestSend({ ch: 'app', type: 'response', id: msg.id, error: 'kaboom' });
            }
        }
    }

    const transport: IProcessTransport = {
        postMessage: (msg: any) => queueMicrotask(() => guestReceive(msg)),
        onMessage: (h: any) => { hostHandler = h; },
        terminate: () => { terminated = true; },
    };

    if (autoReady) queueMicrotask(() => guestSend({ ch: 'sys', type: 'ready' }));
    return { transport, state, isTerminated: () => terminated };
}

describe('WorkerProcess (Fase 1)', () => {
    it('resolves ready when the guest announces sys:ready', async () => {
        const { transport } = makeFakeTransport();
        const wp = new WorkerProcess(transport);
        await wp.ready;
        expect(wp.isReady).toBe(true);
    });

    it('round-trips an app request/response by id', async () => {
        const { transport } = makeFakeTransport();
        const wp = new WorkerProcess(transport);
        await wp.ready;
        const res = await wp.request('echo', { n: 42 });
        expect(res).toEqual({ n: 42 });
    });

    it('rejects when the guest returns an error', async () => {
        const { transport } = makeFakeTransport();
        const wp = new WorkerProcess(transport);
        await expect(wp.request('boom')).rejects.toThrow('kaboom');
    });

    it('ping returns true for a live guest and false for a hung one', async () => {
        const { transport, state } = makeFakeTransport();
        const wp = new WorkerProcess(transport);
        await wp.ready;
        expect(await wp.ping(100)).toBe(true);
        state.hang = true;
        expect(await wp.ping(50)).toBe(false);
    });

    it('terminate rejects pending requests and marks terminated', async () => {
        const { transport } = makeFakeTransport();
        const wp = new WorkerProcess(transport);
        const p = wp.request('never', {}, 1000);
        wp.terminate();
        await expect(p).rejects.toThrow('terminated');
        expect(wp.isTerminated).toBe(true);
    });
});

describe('ProcessWatchdog (Fase 1)', () => {
    it('kills a process after maxMisses consecutive missed pings', async () => {
        const killed: number[] = [];
        const deadProc = { ping: async () => false };
        const wd = new ProcessWatchdog({
            maxMisses: 3,
            getTargets: () => [{ pid: 7, proc: deadProc as any }],
            onKill: (pid) => killed.push(pid),
        });
        await wd.tick(); // miss 1
        await wd.tick(); // miss 2
        expect(killed).toEqual([]);
        await wd.tick(); // miss 3 -> kill
        expect(killed).toEqual([7]);
    });

    it('resets the miss counter when a process responds', async () => {
        const killed: number[] = [];
        let alive = false;
        const flaky = { ping: async () => alive };
        const wd = new ProcessWatchdog({
            maxMisses: 2,
            getTargets: () => [{ pid: 1, proc: flaky as any }],
            onKill: (pid) => killed.push(pid),
        });
        await wd.tick();          // miss 1
        alive = true;
        await wd.tick();          // recover -> reset
        alive = false;
        await wd.tick();          // miss 1 again
        expect(killed).toEqual([]); // never reached 2 consecutive
    });
});

describe('Kernel.spawnWorker (Fase 1)', () => {
    beforeEach(() => (Kernel as any).__reset());

    it('spawns a worker process visible in the registry and kills it cleanly', async () => {
        const { transport, isTerminated } = makeFakeTransport();
        const { pid, worker, process } = Kernel.spawnWorker('compute-demo', transport);

        expect(process.kind).toBe('worker');
        expect(Kernel.getProcess(pid)).toBeDefined();
        expect(Kernel.getWorker(pid)).toBe(worker);

        await worker.ready;
        expect(await worker.request('echo', 'hi')).toBe('hi');

        const ok = Kernel.kill(pid);
        expect(ok).toBe(true);
        expect(Kernel.getProcess(pid)).toBeUndefined();
        expect(Kernel.getWorker(pid)).toBeUndefined();
        expect(isTerminated()).toBe(true);
    });

    it('emits kernel:process-started on EventBus for a spawned worker', () => {
        const listener = vi.fn();
        const unbind = EventBus.on('kernel:process-started', listener);
        const { transport } = makeFakeTransport();
        Kernel.spawnWorker('compute-demo', transport);
        expect(listener).toHaveBeenCalled();
        expect(listener.mock.calls[0]![0].kind).toBe('worker');
        unbind();
    });
});
