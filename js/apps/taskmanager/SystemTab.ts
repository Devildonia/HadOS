export class SystemTab {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    private getGPUName(): string {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as any;
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_RENDERER_ID);
                    if (renderer) return renderer;
                }
            }
        } catch {
            // Fallback on security/context errors
        }
        return 'Standard WebGL Renderer';
    }

    public renderHardwareSpecs(): void {
        const specsContainer = this.container.querySelector('#tm-system-specs');
        if (specsContainer) {
            const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Unknown Cores';
            const ramGB = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Standard';
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

    public renderRealtimeUsage(processesCount: number, stats: any): void {
        const webglCount = stats.webgl || 0;
        const timerCount = stats.timer || 0;
        const tick = Math.floor(Date.now() / 1000);
        
        const timeFluctuation1 = Math.sin(tick) * 2 + Math.cos(tick * 0.7) * 1.5;
        const timeFluctuation2 = Math.cos(tick * 1.2) * 1.8 + Math.sin(tick * 0.5) * 1.2;

        const baseCpu = 5 + (processesCount * 3) + (webglCount * 8) + (timerCount * 0.5);
        const cpuUsage = Math.max(1, Math.min(99, Math.round(baseCpu + timeFluctuation1)));

        const perf = (window.performance as any);
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
