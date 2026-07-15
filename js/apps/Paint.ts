/**
 * WINDOWS 95 APP CENTER - PAINT
 * Basic drawing application with Undo/Redo
 * Version: 4.1 (TypeScript)
 */

import { Utils } from '../utils.js';
import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';

const PAINT_BODY_HTML = `
    <div class="window-menu">
        <span class="menu-item">File</span>
        <span class="menu-item">Edit</span>
        <span class="menu-item">View</span>
        <span class="menu-item">Image</span>
        <span class="menu-item">Colors</span>
        <span class="menu-item">Help</span>
    </div>
    <div class="paint-main-area">
        <div class="paint-toolbar">
            <!-- Toolbar buttons will be added by JS -->
        </div>
        <div class="paint-canvas-container">
            <canvas id="paint-canvas" width="400" height="300"></canvas>
        </div>
    </div>
    <div class="paint-color-bar">
        <!-- Color palette will be added by JS -->
    </div>
`;

const MAX_HISTORY = 30;

export interface IPaintParams {
    [key: string]: any;
}

export type PaintTool = 'pencil' | 'brush' | 'eraser' | 'rect' | 'line' | 'clear' | 'undo' | 'redo' | 'save' | 'separator';

class Paint {
    public windowId: string = 'win-paint';
    private canvasId: string = 'paint-canvas';
    private color: string = '#000000';
    private isDrawing: boolean = false;
    private brushSize: number = 2;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private currentTool: PaintTool = 'pencil';
    private startX: number = 0;
    private startY: number = 0;
    private canvasRectLeft: number = 0;
    private canvasRectTop: number = 0;
    private startImageData: ImageData | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private onResize = (): void => this.resizeCanvas();
    private onKeyDown = (e: KeyboardEvent): void => {
        const win = document.getElementById(this.windowId);
        if (!win || win.style.display === 'none') return;

        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                this.redo();
            } else {
                this.undo();
            }
        }
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            this.redo();
        }
    };
    private onMouseUp = (): void => this.stopDrawing();

    // Undo/Redo stacks (ImageData snapshots)
    private _undoStack: ImageData[] = [];
    private _redoStack: ImageData[] = [];

    constructor(params: IPaintParams = {}) {
        this.init();
    }

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'untitled - Paint',
            width: 600,
            height: 450,
            icon: '🎨'
        });
        const body = wf.getBody(this.windowId);
        if (body) {
            body.classList.add('paint-body');
            body.innerHTML = PAINT_BODY_HTML;
        }
    }

    private init(): void {
        this._ensureWindow();

        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        if (!this.canvas) return;

        this.resizeCanvas();
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        this.setupToolbar();
        this.setupColors();
        this.setupCanvasEvents();
        this._setupKeyboardShortcuts();

        // Save initial blank state
        this._saveState();
        this.selectTool('pencil');

        window.addEventListener('resize', this.onResize);

        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
            const container = document.querySelector(`#${this.windowId} .paint-canvas-container`);
            if (container) this.resizeObserver.observe(container);
        }

        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.register(this.windowId, 'listener', {
                dispose: () => {
                    if (this.resizeObserver) {
                        this.resizeObserver.disconnect();
                    }
                    window.removeEventListener('resize', this.onResize);
                    document.removeEventListener('keydown', this.onKeyDown);
                    Utils.eventManager.remove(document, 'mouseup', this.onMouseUp);
                }
            });
        }

        Utils.Logger.log('Paint initialized with Undo/Redo');
    }

    // ========================================
    // UNDO / REDO
    // ========================================

    private _saveState(): void {
        if (!this.ctx || !this.canvas || !this.canvas.width || !this.canvas.height) return;

        try {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this._undoStack.push(imageData);

            // Trim to max history
            if (this._undoStack.length > MAX_HISTORY) {
                this._undoStack.shift();
            }

            // Any new action clears the redo stack
            this._redoStack = [];

            this._updateUndoRedoButtons();
        } catch (e) {
            Utils.Logger.error('Failed to save paint state:', e);
        }
    }

    public undo(): void {
        if (this._undoStack.length <= 1 || !this.ctx) return;

        const current = this._undoStack.pop();
        if (current) this._redoStack.push(current);

        const prev = this._undoStack[this._undoStack.length - 1];
        if (prev) this.ctx.putImageData(prev, 0, 0);

        this._updateUndoRedoButtons();
        Utils.Logger.log('[Paint] Undo');
    }

    public redo(): void {
        if (this._redoStack.length === 0 || !this.ctx) return;

        const next = this._redoStack.pop();
        if (next) {
            this._undoStack.push(next);
            this.ctx.putImageData(next, 0, 0);
        }

        this._updateUndoRedoButtons();
        Utils.Logger.log('[Paint] Redo');
    }

    private _updateUndoRedoButtons(): void {
        const undoBtn = document.getElementById('paint-undo-btn') as HTMLButtonElement;
        const redoBtn = document.getElementById('paint-redo-btn') as HTMLButtonElement;
        if (undoBtn) undoBtn.disabled = this._undoStack.length <= 1;
        if (redoBtn) redoBtn.disabled = this._redoStack.length === 0;
    }

    private _setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', this.onKeyDown);
    }

    // ========================================
    // CANVAS
    // ========================================

    private resizeCanvas(): void {
        if (!this.canvas) return;

        const container = this.canvas.parentElement;
        if (!container) return;

        const width = container.clientWidth - 20;
        const height = container.clientHeight - 20;

        if (this.canvas.width !== width || this.canvas.height !== height) {
            let tempCanvas: HTMLCanvasElement | null = null;
            if (this.canvas.width > 0 && this.canvas.height > 0) {
                tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.canvas.width;
                tempCanvas.height = this.canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                if (tempCtx) tempCtx.drawImage(this.canvas, 0, 0);
            }

            this.canvas.width = width;
            this.canvas.height = height;

            if (tempCanvas) {
                this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
                if (this.ctx) this.ctx.drawImage(tempCanvas, 0, 0);
            }

            if (this.ctx) {
                this.ctx.lineCap = 'round';
                this.ctx.lineWidth = this.brushSize;
                this.ctx.strokeStyle = this.color;
            }
        }
    }

    private setupToolbar(): void {
        const toolbar = document.querySelector(`#${this.windowId} .paint-toolbar`);
        if (!toolbar) return;

        toolbar.innerHTML = ''; // Clear to prevent duplication

        const tools: { id: PaintTool, icon: string }[] = [
            { id: 'pencil', icon: '✏️' },
            { id: 'brush', icon: '🖌️' },
            { id: 'eraser', icon: '🧽' },
            { id: 'rect', icon: '⬜' },
            { id: 'line', icon: '📏' },
            { id: 'clear', icon: '🗑️' },
            { id: 'separator', icon: '' },
            { id: 'undo', icon: '↩️' },
            { id: 'redo', icon: '↪️' },
            { id: 'save', icon: '💾' }
        ];

        tools.forEach(tool => {
            if (tool.id === 'separator') {
                const sep = document.createElement('span');
                sep.style.cssText = 'grid-column: span 2; width: 100%; height: 1px; background: #808080; margin: 4px 0;';
                toolbar.appendChild(sep);
                return;
            }

            const btn = document.createElement('button');
            btn.className = 'win95-btn paint-tool-btn';
            btn.style.cssText = 'width: 24px; height: 24px; padding: 0;';
            btn.title = tool.id;
            const iconSpan = document.createElement('span');
            iconSpan.style.fontSize = '14px';
            iconSpan.textContent = tool.icon;
            btn.appendChild(iconSpan);

            if (tool.id === 'undo') {
                btn.id = 'paint-undo-btn';
                btn.disabled = true;
                btn.onclick = () => this.undo();
            } else if (tool.id === 'redo') {
                btn.id = 'paint-redo-btn';
                btn.disabled = true;
                btn.onclick = () => this.redo();
            } else if (tool.id === 'save') {
                btn.id = 'paint-save-btn';
                btn.title = 'Save as PNG to My Documents';
                btn.onclick = () => { void this.saveAsPng(); };
            } else {
                btn.onclick = () => this.selectTool(tool.id);
            }

            toolbar.appendChild(btn);
        });
    }

    /**
     * Exports the canvas as a PNG blob and saves it to C:\DOCUMENTS via the VFS
     * binary API (blob-backed, stored in OPFS/IndexedDB out of the JSON tree).
     * First real consumer of Phase 0.2's blob storage.
     */
    private async saveAsPng(): Promise<void> {
        if (!this.canvas) return;
        const vfs = Services.get('VFS');
        const notify = Services.get('Notify');
        try {
            const blob = await new Promise<Blob | null>(resolve =>
                this.canvas!.toBlob(b => resolve(b), 'image/png')
            );
            if (!blob) {
                notify?.error('Paint: could not render the image');
                return;
            }
            const name = `painting-${Date.now()}.png`;
            const ok = vfs ? await vfs.writeFileAsync('C:\\DOCUMENTS', name, blob) : false;
            if (ok) {
                notify?.success(`Saved ${name} to My Documents`);
                Utils.Logger.log(`[Paint] Saved ${name} (${blob.size} bytes) to C:\\DOCUMENTS`);
            } else {
                notify?.error('Paint: save failed');
            }
        } catch (err) {
            Utils.Logger.error('[Paint] saveAsPng failed', err);
            notify?.error('Paint: save failed');
        }
    }

    private setupColors(): void {
        const colorBar = document.querySelector(`#${this.windowId} .paint-color-bar`);
        if (!colorBar) return;

        colorBar.innerHTML = ''; // Clear to prevent duplication

        const colors = [
            '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
            '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
        ];

        colors.forEach(col => {
            const box = document.createElement('div');
            box.style.cssText = `width: 15px; height: 15px; background: ${col}; border: 1px solid #808080; margin: 1px; cursor: pointer;`;
            box.onclick = () => { this.color = col; };
            colorBar.appendChild(box);
        });
    }

    private setupCanvasEvents(): void {
        if (!this.canvas) return;
        this.canvas.addEventListener('mousedown', (e: MouseEvent) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => this.draw(e));
        Utils.eventManager.add(document, 'mouseup', this.onMouseUp);
    }

    private startDrawing(e: MouseEvent): void {
        if (!this.ctx || !this.canvas) return;
        this.isDrawing = true;
        
        const rect = this.canvas.getBoundingClientRect();
        this.canvasRectLeft = rect.left;
        this.canvasRectTop = rect.top;
        
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;

        // Save state/snapshot for line and rect preview
        this.startImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
    }

    private draw(e: MouseEvent): void {
        if (!this.isDrawing || !this.ctx || !this.canvas) return;
        const x = e.clientX - this.canvasRectLeft;
        const y = e.clientY - this.canvasRectTop;

        if (this.currentTool === 'line' || this.currentTool === 'rect') {
            if (this.startImageData) {
                this.ctx.putImageData(this.startImageData, 0, 0);
            }
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.brushSize;
            
            if (this.currentTool === 'line') {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            } else if (this.currentTool === 'rect') {
                this.ctx.beginPath();
                this.ctx.rect(this.startX, this.startY, x - this.startX, y - this.startY);
                this.ctx.stroke();
            }
        } else {
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.brushSize;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        }
    }

    private stopDrawing(): void {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.startImageData = null;
        // Save state after each stroke for undo
        this._saveState();
    }

    private selectTool(tool: PaintTool): void {
        if (!this.ctx || !this.canvas) return;

        // Remove active styling from other buttons
        const btns = document.querySelectorAll(`#${this.windowId} .paint-toolbar button`);
        btns.forEach(b => {
            const btnEl = b as HTMLButtonElement;
            if (btnEl.title !== 'undo' && btnEl.title !== 'redo') {
                btnEl.style.border = '';
                btnEl.style.background = '';
            }
        });

        // Add active style to the selected button
        const activeBtn = Array.from(btns).find(b => (b as HTMLButtonElement).title === tool) as HTMLButtonElement | undefined;
        if (activeBtn) {
            activeBtn.style.border = '1px inset #fff';
            activeBtn.style.background = '#e0e0e0';
        }

        if (tool === 'undo' || tool === 'redo' || tool === 'clear' || tool === 'separator') {
            // Do not switch currentTool for actions
        } else {
            this.currentTool = tool;
        }

        switch (tool) {
            case 'eraser':
                this.color = '#ffffff';
                this.brushSize = 10;
                break;
            case 'pencil':
                this.brushSize = 1;
                break;
            case 'brush':
                this.brushSize = 5;
                break;
            case 'rect':
                this.brushSize = 2;
                break;
            case 'line':
                this.brushSize = 2;
                break;
            case 'clear':
                this._saveState(); // Save before clearing for undo
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this._saveState();
                break;
            default:
                Utils.Logger.log(`Tool selected: ${tool}`);
        }
    }

    public terminate(): void {
        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.disposeOwner(this.windowId);
        }
    }
}

// Register with Kernel
Kernel.registerApp('paint', Paint, {
    name: 'Paint',
    icon: '🎨',
    description: 'Basic drawing application with Undo/Redo',
    singleton: true
});

export { Paint };
