import { detectGPU } from '../../core/HardwareProbe';

export class SystemTab {
    private container: HTMLElement;
    private cachedGpuName: string | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    private getGPUName(): string {
        if (!this.cachedGpuName) {
            this.cachedGpuName = detectGPU();
        }
        return this.cachedGpuName;
    }

    public renderHardwareSpecs(): void {
        const specsContainer = this.container.querySelector('#tm-system-specs');
        if (specsContainer) {
            const nav = navigator as unknown as { hardwareConcurrency?: number; deviceMemory?: number };
            const cpuCores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Cores` : 'Unknown Cores';
            const ramGB = nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Standard';
            const gpuName = this.getGPUName();

            specsContainer.innerHTML = `
                <strong>CPU:</strong> Host CPU (${cpuCores})<br>
                <strong>RAM:</strong> ${ramGB} RAM<br>
                <strong>GPU:</strong> ${gpuName}<br>
                <strong>OS Architecture:</strong> WebOS (HTML5/TS/JS)<br>
                <strong>Graphics API:</strong> WebGL (Three.js Active)
            `;
        }
    }

    public renderRealtimeUsage(processesCount: number, stats: Record<string, number>): void {
        const webglCount = stats.webgl || 0;
        const timerCount = stats.timer || 0;
        const tick = Math.floor(Date.now() / 1000);
        
        const timeFluctuation1 = Math.sin(tick) * 2 + Math.cos(tick * 0.7) * 1.5;
        const timeFluctuation2 = Math.cos(tick * 1.2) * 1.8 + Math.sin(tick * 0.5) * 1.2;

        const baseCpu = 5 + (processesCount * 3) + (webglCount * 8) + (timerCount * 0.5);
        const cpuUsage = Math.max(1, Math.min(99, Math.round(baseCpu + timeFluctuation1)));

        const perf = window.performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } };
        let ramUsage: number;
        if (perf && perf.memory && typeof perf.memory.usedJSHeapSize === 'number') {
            ramUsage = Math.max(1, Math.min(99, Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100)));
        } else {
            const baseRam = 15 + (processesCount * 4) + (webglCount * 10);
            ramUsage = Math.max(1, Math.min(99, Math.round(baseRam + timeFluctuation2)));
        }

        const baseGpu = webglCount > 0 ? (25 + webglCount * 20) : (1 + processesCount * 2);
        const gpuUsage = Math.max(1, Math.min(99, Math.round(baseGpu + timeFluctuation2)));

        const baseVram = webglCount > 0 ? (20 + webglCount * 15) : (1 + processesCount * 1.5);
        const vramUsage = Math.max(1, Math.min(99, Math.round(baseVram + timeFluctuation1)));

        // Update UI meters
        const cpuVal = this.container.querySelector('#tm-sys-cpu-val');
        const cpuFill = this.container.querySelector('#tm-sys-cpu-fill') as HTMLElement | null;
        if (cpuVal) cpuVal.textContent = `${cpuUsage}%`;
        if (cpuFill) cpuFill.style.width = `${cpuUsage}%`;

        const ramVal = this.container.querySelector('#tm-sys-ram-val');
        const ramFill = this.container.querySelector('#tm-sys-ram-fill') as HTMLElement | null;
        if (ramVal) ramVal.textContent = `${ramUsage}%`;
        if (ramFill) ramFill.style.width = `${ramUsage}%`;

        const gpuVal = this.container.querySelector('#tm-sys-gpu-val');
        const gpuFill = this.container.querySelector('#tm-sys-gpu-fill') as HTMLElement | null;
        if (gpuVal) gpuVal.textContent = `${gpuUsage}%`;
        if (gpuFill) gpuFill.style.width = `${gpuUsage}%`;

        const vramVal = this.container.querySelector('#tm-sys-vram-val');
        const vramFill = this.container.querySelector('#tm-sys-vram-fill') as HTMLElement | null;
        if (vramVal) vramVal.textContent = `${vramUsage}%`;
        if (vramFill) vramFill.style.width = `${vramUsage}%`;
    }
}
