import { Utils } from '../../utils.js';

export class PerformanceTab {
    private container: HTMLElement;
    private scaleLimit: number;
    private listenerMax: number;

    constructor(container: HTMLElement, scaleLimit: number, listenerMax: number) {
        this.container = container;
        this.scaleLimit = scaleLimit;
        this.listenerMax = listenerMax;
    }

    private renderMeterRow(label: string, value: number, limit: number): string {
        const percent = Math.min(100, Math.round((value / limit) * 100));
        return `
            <div class="tm-meter-row">
                <span class="tm-meter-label">${label}:</span>
                <span class="tm-meter-val">${value}</span>
                <div class="tm-meter-container">
                    <div class="tm-meter-fill" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    }

    public renderResourceMetrics(stats: Record<string, number>): void {
        const metricsContainer = this.container.querySelector('#tm-performance-metrics');
        if (metricsContainer) {
            metricsContainer.innerHTML = `
                ${this.renderMeterRow('Tracked WebGL Contexts', stats.webgl || 0, this.scaleLimit)}
                ${this.renderMeterRow('Tracked Audio Contexts', stats.audio || 0, this.scaleLimit)}
                ${this.renderMeterRow('Tracked Event Listeners', stats.listener || 0, this.scaleLimit)}
                ${this.renderMeterRow('Tracked Timers/Intervals', stats.timer || 0, this.scaleLimit)}
                ${this.renderMeterRow('Total Active Disposables', stats.total || 0, this.scaleLimit)}
            `;
        }
    }

    public renderSystemHealth(): void {
        const totalListeners = Utils.eventManager.count();
        const perfListeners = this.container.querySelector('#tm-perf-listeners');
        const fillListeners = this.container.querySelector('#tm-fill-listeners') as HTMLElement | null;
        if (perfListeners) perfListeners.textContent = String(totalListeners);
        if (fillListeners) fillListeners.style.width = `${Math.min(100, Math.round((totalListeners / this.listenerMax) * 100))}%`;

        const perfHeap = this.container.querySelector('#tm-perf-heap');
        const fillHeap = this.container.querySelector('#tm-fill-heap') as HTMLElement | null;
        const perf = window.performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } };
        if (perf && perf.memory && typeof perf.memory.usedJSHeapSize === 'number') {
            const usedMB = (perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
            const heapPercent = Math.min(100, Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100));

            if (perfHeap) perfHeap.textContent = `${usedMB} MB`;
            if (fillHeap) fillHeap.style.width = `${heapPercent}%`;
        } else {
            if (perfHeap) perfHeap.textContent = 'n/a';
            if (fillHeap) fillHeap.style.width = '0%';
        }
    }
}
