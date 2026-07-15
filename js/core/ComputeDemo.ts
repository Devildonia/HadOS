/**
 * COMPUTE DEMO — spawns the demo compute worker as an isolated Kernel process.
 * Serves two purposes: it is the module that references the worker via a Vite
 * `new URL(..., import.meta.url)` so the worker gets bundled, and it is the entry
 * point used to demonstrate off-main-thread compute (Fase 1). Kept tiny and
 * UI-free; a window app can wrap it later.
 */

import { Kernel } from './Kernel';
import { workerTransportFromWorker, type WorkerProcess } from './WorkerProcess';

export interface ComputeDemoHandle {
    pid: number;
    worker: WorkerProcess;
}

/** Spawns the compute worker as a Kernel process and returns its handle. */
export function spawnComputeDemo(): ComputeDemoHandle {
    // Keep `new Worker(new URL(...))` together so Vite bundles the worker.
    const worker = new Worker(new URL('../workers/compute.worker.ts', import.meta.url), { type: 'module' });
    const { pid, worker: proc } = Kernel.spawnWorker('compute-demo', workerTransportFromWorker(worker));
    return { pid, worker: proc };
}
