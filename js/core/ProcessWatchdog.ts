/**
 * PROCESS WATCHDOG
 * Periodically pings isolated (worker) processes and kills any that stop
 * responding — the "unresponsive process" guard of a real OS. Transport- and
 * Kernel-agnostic (dependencies injected) so it is unit-testable. Phase 1.
 */

import type { WorkerProcess } from './WorkerProcess';

export interface WatchdogTarget {
    pid: number;
    proc: WorkerProcess;
}

export interface WatchdogOptions {
    /** How often to ping, ms. */
    intervalMs?: number;
    /** Consecutive missed pings before a process is killed. */
    maxMisses?: number;
    /** Per-ping timeout, ms. */
    pingTimeoutMs?: number;
    /** Supplies the current worker processes to probe. */
    getTargets: () => WatchdogTarget[];
    /** Called to terminate an unresponsive process. */
    onKill: (pid: number) => void;
}

export class ProcessWatchdog {
    private timer: ReturnType<typeof setInterval> | null = null;
    private ticking = false;
    private readonly misses = new Map<number, number>();
    private readonly intervalMs: number;
    private readonly maxMisses: number;
    private readonly pingTimeoutMs: number;

    constructor(private readonly opts: WatchdogOptions) {
        this.intervalMs = opts.intervalMs ?? 4_000;
        this.maxMisses = opts.maxMisses ?? 3;
        this.pingTimeoutMs = opts.pingTimeoutMs ?? 2_000;
    }

    get running(): boolean { return this.timer !== null; }

    start(): void {
        if (this.timer !== null) return;
        this.timer = setInterval(() => { void this.tick(); }, this.intervalMs);
    }

    stop(): void {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.misses.clear();
    }

    /** One probe round. Exposed for deterministic testing. */
    async tick(): Promise<void> {
        if (this.ticking) return; // don't overlap slow rounds
        this.ticking = true;
        try {
            const targets = this.opts.getTargets();
            const seen = new Set<number>();
            await Promise.all(targets.map(async ({ pid, proc }) => {
                seen.add(pid);
                const alive = await proc.ping(this.pingTimeoutMs);
                if (alive) {
                    this.misses.set(pid, 0);
                    return;
                }
                const n = (this.misses.get(pid) ?? 0) + 1;
                this.misses.set(pid, n);
                if (n >= this.maxMisses) {
                    this.misses.delete(pid);
                    this.opts.onKill(pid);
                }
            }));
            // Forget processes that no longer exist.
            for (const pid of [...this.misses.keys()]) {
                if (!seen.has(pid)) this.misses.delete(pid);
            }
        } finally {
            this.ticking = false;
        }
    }
}
