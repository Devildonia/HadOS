import { Services } from '../../core/ServiceContainer.js';
import { Utils } from '../../utils.js';

export class PaintCore {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public color: string = '#000000';
    public brushSize: number = 2;
    
    private undoStack: ImageData[] = [];
    private redoStack: ImageData[] = [];
    private maxHistory = 30;
    
    public get _undoStack(): ImageData[] { return this.undoStack; }
    public get _redoStack(): ImageData[] { return this.redoStack; }
    
    private onStateChange: () => void;

    constructor(canvas: HTMLCanvasElement, onStateChange: () => void) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Could not get 2D context');
        this.ctx = ctx;
        this.onStateChange = onStateChange;
        
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.brushSize;
    }
    
    public resize(width: number, height: number): void {
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
            this.ctx.drawImage(tempCanvas, 0, 0);
        }
        
        // Reapply stroke configurations
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeStyle = this.color;
    }

    public setColor(color: string): void {
        this.color = color;
        this.ctx.strokeStyle = color;
    }

    public setBrushSize(size: number): void {
        this.brushSize = size;
        this.ctx.lineWidth = size;
    }

    public saveState(): void {
        try {
            const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.undoStack.push(imgData);
            if (this.undoStack.length > this.maxHistory) {
                this.undoStack.shift();
            }
            this.redoStack = [];
            this.onStateChange();
        } catch (e) {
            Utils.Logger.error('Failed to save paint state:', e);
        }
    }

    public canUndo(): boolean {
        return this.undoStack.length > 1;
    }

    public canRedo(): boolean {
        return this.redoStack.length > 0;
    }

    public undo(): void {
        if (!this.canUndo()) return;
        const current = this.undoStack.pop();
        if (current) this.redoStack.push(current);
        const prev = this.undoStack[this.undoStack.length - 1];
        if (prev) this.ctx.putImageData(prev, 0, 0);
        this.onStateChange();
    }

    public redo(): void {
        if (!this.canRedo()) return;
        const next = this.redoStack.pop();
        if (next) {
            this.undoStack.push(next);
            this.ctx.putImageData(next, 0, 0);
        }
        this.onStateChange();
    }

    public clear(): void {
        this.saveState();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.saveState();
    }
}
