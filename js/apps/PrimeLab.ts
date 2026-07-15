import { Kernel } from '../core/Kernel.js';
import { Utils } from '../utils.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { spawnComputeDemo, type ComputeDemoHandle } from '../core/ComputeDemo.js';

/**
 * WINDOWS APP CENTER - PRIME LAB (Fase 1.x demo)
 * A real app whose heavy work runs in an ISOLATED Web Worker process. The window
 * (UI) lives on the main thread; pressing "Compute" delegates the prime search to
 * a Kernel-managed worker over IPC, so the UI never freezes. The worker process is
 * killed when this window closes. Shows the Fase 1 process model end-to-end.
 */

const PRIME_LAB_HTML = `
    <div style="padding:12px; font-family:'MS Sans Serif',sans-serif; font-size:12px;">
        <p style="margin:0 0 8px;">Find the first <strong>N</strong> primes in an isolated worker process.</p>
        <div style="display:flex; gap:6px; align-items:center; margin-bottom:8px;">
            <label for="prime-lab-count">N =</label>
            <input id="prime-lab-count" type="number" value="20000" min="1" max="100000"
                   style="width:90px;" />
            <button id="prime-lab-run" class="win95-btn">Compute (off-thread)</button>
        </div>
        <p id="prime-lab-status" style="margin:8px 0; min-height:16px;">Worker process: starting…</p>
        <p id="prime-lab-result" style="margin:0; font-weight:bold;"></p>
    </div>
`;

export class PrimeLab implements IWindowsApp {
    public windowId: string = 'win-prime-lab';
    private container: HTMLElement | null = null;
    private handle: ComputeDemoHandle | null = null;
    private busy = false;
    private listeners: Array<{ el: Element; ev: string; fn: EventListener }> = [];

    constructor() {
        this.windowId = WindowFactory.create({
            title: 'Prime Lab',
            width: 380,
            height: 240,
            icon: '🧮',
        });
        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;
        this.container.innerHTML = PRIME_LAB_HTML;

        const runBtn = this.container.querySelector('#prime-lab-run');
        if (runBtn) this.addListener(runBtn, 'click', () => { void this.compute(); });

        void this.startWorker();
    }

    private addListener(el: Element, ev: string, fn: EventListener): void {
        Utils.eventManager.add(el, ev, fn);
        this.listeners.push({ el, ev, fn });
    }

    private setStatus(text: string): void {
        const s = this.container?.querySelector('#prime-lab-status');
        if (s) s.textContent = text;
    }

    private async startWorker(): Promise<void> {
        try {
            this.handle = spawnComputeDemo();
            await this.handle.worker.ready;
            this.setStatus(`Worker process PID ${this.handle.pid} ready.`);
        } catch (err) {
            Utils.Logger.error('[PrimeLab] worker failed to start', err);
            this.setStatus('Failed to start the worker process.');
        }
    }

    private async compute(): Promise<void> {
        if (this.busy || !this.handle) return;
        const input = this.container?.querySelector('#prime-lab-count') as HTMLInputElement | null;
        const count = Math.max(1, Math.min(100_000, Number(input?.value) || 1000));
        const resultEl = this.container?.querySelector('#prime-lab-result');

        this.busy = true;
        this.setStatus(`Computing ${count} primes off-thread…`);
        if (resultEl) resultEl.textContent = '';
        const t0 = performance.now();
        try {
            const res = await this.handle.worker.request('compute:primes', { count }, 60_000) as { count: number; last: number };
            const ms = Math.round(performance.now() - t0);
            this.setStatus(`Done — UI stayed responsive (worker PID ${this.handle.pid}).`);
            if (resultEl) resultEl.textContent = `#${res.count} prime = ${res.last}  (${ms} ms off-thread)`;
        } catch (err) {
            this.setStatus(`Compute failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            this.busy = false;
        }
    }

    public terminate(): void {
        for (const { el, ev, fn } of this.listeners) Utils.eventManager.remove(el, ev, fn);
        this.listeners = [];
        // Kill the isolated worker process this window owns.
        if (this.handle) {
            Kernel.kill(this.handle.pid);
            this.handle = null;
        }
        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register (glob-imported at boot).
Kernel.registerApp('prime-lab', PrimeLab, {
    name: 'Prime Lab',
    icon: '🧮',
    description: 'Compute primes in an isolated worker process.',
    singleton: true,
});
