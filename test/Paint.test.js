import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel.js';
import { Services } from '../js/core/ServiceContainer.js';

// Import Paint (registers with Kernel)
import '../js/apps/Paint.js';

describe('Paint', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        Services.__reset();

        // Mock canvas getContext
        const mockCtx = {
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            fill: vi.fn(),
            clearRect: vi.fn(),
            fillRect: vi.fn(),
            drawImage: vi.fn(),
            getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })),
            putImageData: vi.fn(),
            arc: vi.fn(),
            rect: vi.fn(),
            strokeRect: vi.fn(),
            set lineWidth(v) { },
            set strokeStyle(v) { },
            set fillStyle(v) { },
            set lineCap(v) { },
            set lineJoin(v) { },
            set globalCompositeOperation(v) { }
        };

        HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx);

        document.body.innerHTML = `
            <div id="win-paint" class="win95-window" style="display:none;">
                <div class="window-header"><span>Paint</span></div>
                <div class="window-body">
                    <div class="paint-toolbar">
                        <button class="paint-tool" data-tool="pencil" title="Pencil">✏️</button>
                        <button class="paint-tool" data-tool="brush" title="Brush">🖌️</button>
                        <button class="paint-tool" data-tool="eraser" title="Eraser">🧹</button>
                        <button class="paint-tool" data-tool="rectangle" title="Rectangle">▭</button>
                        <button class="paint-tool" data-tool="line" title="Line">╱</button>
                        <button id="btn-undo" title="Undo">↶</button>
                        <button id="btn-redo" title="Redo">↷</button>
                        <button id="btn-clear" title="Clear">🗑</button>
                        <input type="range" id="brush-size" min="1" max="20" value="2">
                    </div>
                    <div class="paint-colors">
                        <div class="color-swatch" data-color="#000000"></div>
                        <div class="color-swatch" data-color="#ff0000"></div>
                    </div>
                    <div class="paint-canvas-container">
                        <canvas id="paint-canvas" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        `;

        // Override getContext to return mock
        const canvas = document.getElementById('paint-canvas');
        canvas.getContext = vi.fn(() => mockCtx);
    });

    describe('registration', () => {
        it('should register as "paint" in Kernel', () => {
            const registry = Kernel.getRegistry();
            expect(registry.apps['paint']).toBeDefined();
            expect(registry.apps['paint'].metadata.name).toBe('Paint');
            expect(registry.apps['paint'].metadata.icon).toBe('🎨');
        });
    });

    describe('launch', () => {
        it('should create instance with correct windowId', () => {
            const proc = Kernel.launch('paint');
            expect(proc).not.toBeNull();
            expect(proc.instance.windowId).toBe('win-paint');
        });

        it('should initialize canvas context', () => {
            const proc = Kernel.launch('paint');
            expect(proc.instance.ctx).toBeDefined();
        });
    });

    describe('undo/redo', () => {
        it('should have initial state in undo stack after launch', () => {
            const proc = Kernel.launch('paint');
            expect(proc.instance._undoStack.length).toBeGreaterThanOrEqual(1);
        });

        it('should clear redo stack when new action is saved', () => {
            const proc = Kernel.launch('paint');
            proc.instance._redoStack.push('fake');
            proc.instance._saveState();
            expect(proc.instance._redoStack.length).toBe(0);
        });

        it('should limit undo stack to MAX_HISTORY', () => {
            const proc = Kernel.launch('paint');
            for (let i = 0; i < 50; i++) {
                proc.instance._saveState();
            }
            expect(proc.instance._undoStack.length).toBeLessThanOrEqual(30);
        });
    });
});
