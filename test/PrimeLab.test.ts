import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrimeLab } from '../js/apps/PrimeLab';
import { Services } from '../js/core/ServiceContainer';
import { Kernel } from '../js/core/Kernel';
import * as ComputeDemo from '../js/core/ComputeDemo';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('PrimeLab App', () => {
    let windowBody: HTMLDivElement;
    let mockHandle: any;

    beforeEach(() => {
        vi.restoreAllMocks();
        (Services as any).__reset();

        windowBody = document.createElement('div');
        document.body.appendChild(windowBody);

        vi.spyOn(WindowFactory, 'create').mockReturnValue('win-prime-lab-test');
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(windowBody);
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});

        // Mock spawnComputeDemo to bypass missing Worker implementation in JSDOM
        mockHandle = {
            pid: 42,
            worker: {
                ready: Promise.resolve(),
                request: vi.fn().mockResolvedValue({ count: 20000, last: 224737 })
            }
        };

        vi.spyOn(ComputeDemo, 'spawnComputeDemo').mockReturnValue(mockHandle);
        vi.spyOn(Kernel, 'kill').mockImplementation(() => true);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['prime-lab']).toBeDefined();
    });

    it('should mount window UI and load worker on start', async () => {
        const app = new PrimeLab();
        
        // Wait for ready promise to resolve
        await mockHandle.worker.ready;
        
        // Wait for microtask queue to verify status change
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(windowBody.innerHTML).toContain('Find the first');
        expect(windowBody.innerHTML).toContain('Worker process PID 42 ready.');
        
        app.terminate();
    });

    it('should request calculations from worker on click', async () => {
        const app = new PrimeLab();
        
        await mockHandle.worker.ready;
        await new Promise(resolve => setTimeout(resolve, 0));

        const runBtn = windowBody.querySelector('#prime-lab-run') as HTMLButtonElement;
        expect(runBtn).toBeDefined();

        await runBtn.click();
        
        expect(mockHandle.worker.request).toHaveBeenCalledWith('compute:primes', { count: 20000 }, 60000);
        expect(windowBody.innerHTML).toContain('prime = 224737');

        app.terminate();
    });

    it('should handle calculation error gracefully', async () => {
        mockHandle.worker.request.mockRejectedValue(new Error('IPC Timeout'));
        
        const app = new PrimeLab();
        await mockHandle.worker.ready;
        await new Promise(resolve => setTimeout(resolve, 0));

        const runBtn = windowBody.querySelector('#prime-lab-run') as HTMLButtonElement;
        await runBtn.click();

        expect(windowBody.innerHTML).toContain('Compute failed: IPC Timeout');
        app.terminate();
    });
});
