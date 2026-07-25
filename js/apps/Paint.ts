/**
 * WINDOWS 95 APP CENTER - PAINT (PINTA)
 * Orchestrator File
 */

import { Utils } from '../utils.js';
import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { EventBus } from '../core/EventBus.js';
import { AiService } from '../ai/AiService.js';
import { applySubjectMask } from '../ai/segmentation.js';
import { i18n } from '../services/i18n.js';

import { PaintCore } from './paint/PaintCore.js';
import { PaintUI } from './paint/PaintUI.js';
import { PaintMenus } from './paint/PaintMenus.js';
import { invertColors, convertToGrayscale } from './paint/PaintTools.js';

export interface IPaintParams {
    [key: string]: unknown;
}

export type PaintTool = 'pencil' | 'brush' | 'eraser' | 'rect' | 'line' | 'bucket' | 'picker' | 'text' | 'clear' | 'undo' | 'redo' | 'save' | 'open' | 'cutout';

const IMPORT_MIME = 'image/png,image/jpeg,image/webp,image/gif,image/bmp';

class Paint {
    public windowId: string = 'win-paint';
    public canvas: HTMLCanvasElement | null = null;
    public currentTool: PaintTool = 'pencil';
    
    public core: PaintCore | null = null;
    public ui: PaintUI | null = null;
    public menus: PaintMenus | null = null;

    public get ctx(): CanvasRenderingContext2D | null {
        return this.core?.ctx || null;
    }
    public get _undoStack(): ImageData[] {
        return this.core?._undoStack || [];
    }
    public get _redoStack(): ImageData[] {
        return this.core?._redoStack || [];
    }
    public _saveState(): void {
        this.core?.saveState();
    }

    private isDrawing: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private startImageData: ImageData | null = null;
    private resizeObserver: ResizeObserver | null = null;

    private onResize = (): void => this.resizeCanvas();
    private onKeyDown = (e: KeyboardEvent): void => this.handleKeyDown(e);
    private onMouseUp = (): void => this.stopDrawing();

    constructor(_params: IPaintParams = {}) {
        this.init();
    }

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: `untitled - ${i18n.t('app.paint') || 'Pinta'}`,
            width: 600,
            height: 470,
            icon: 'assets/icons/pinta.webp'
        });
        const body = wf.getBody(this.windowId);
        if (body) {
            body.classList.add('paint-body');
        }
    }

    private init(): void {
        this._ensureWindow();

        // Instantiate components
        this.ui = new PaintUI(this);
        this.ui.setup();

        this.canvas = document.getElementById('paint-canvas') as HTMLCanvasElement;
        if (!this.canvas) return;

        this.core = new PaintCore(this.canvas, () => this.handleStateChange());

        this.menus = new PaintMenus(this);
        this.menus.setup();

        this.resizeCanvas();
        this._setupKeyboardShortcuts();

        // Save initial blank state
        this.core.saveState();
        this.selectTool('pencil');

        window.addEventListener('resize', this.onResize);

        // 'languagechanged' rides the EventBus since the event unification.
        const unsubLang = EventBus.on('languagechanged', () => this.translateUI());

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
                    unsubLang();
                    document.removeEventListener('keydown', this.onKeyDown);
                    Utils.eventManager.remove(document, 'mouseup', this.onMouseUp);
                    this.menus?.dispose();
                }
            });
        }

        Utils.Logger.log('Paint modular initialized');
    }

    private translateUI(): void {
        const wf = Services.get('WindowFactory');
        if (wf) {
            wf.setTitle(this.windowId, `untitled - ${i18n.t('app.paint') || 'Pinta'}`);
        }
        this.ui?.setup();
        
        if (this.canvas) {
            this.core = new PaintCore(this.canvas, () => this.handleStateChange());
        }

        this.menus?.setup();
        this.ui?.updateStatusTool(this.currentTool);
        this.ui?.updateStatusSize();
        this.handleStateChange();
    }

    private handleStateChange(): void {
        if (!this.core || !this.ui) return;
        const canUndo = this.core.canUndo();
        const canRedo = this.core.canRedo();
        
        this.ui.updateUndoRedoButtons(canUndo, canRedo);
        this.menus?.updateUndoRedoMenuState();
    }

    private handleKeyDown(e: KeyboardEvent): void {
        const win = document.getElementById(this.windowId);
        if (!win || win.style.display === 'none') return;

        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                this.core?.redo();
            } else {
                this.core?.undo();
            }
        }
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            this.core?.redo();
        }
    }

    private _setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', this.onKeyDown);
        Utils.eventManager.add(document, 'mouseup', this.onMouseUp);
    }

    private resizeCanvas(): void {
        if (!this.canvas || !this.core) return;
        const container = this.canvas.parentElement;
        if (!container) return;

        const width = container.clientWidth - 20;
        const height = container.clientHeight - 20;

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.core.resize(width, height);
            this.ui?.updateStatusSize();
        }
    }

    public selectTool(tool: PaintTool): void {
        if (!this.core || !this.ui) return;

        if (tool === 'undo' || tool === 'redo' || tool === 'clear' || tool === 'save' || tool === 'open' || tool === 'cutout') {
            // Actions
            return;
        }

        this.currentTool = tool;
        this.ui.updateActiveToolButton(tool);
        this.ui.updateStatusTool(tool);

        switch (tool) {
            case 'eraser':
                this.core.setColor('#ffffff');
                this.core.setBrushSize(10);
                break;
            case 'pencil':
                this.core.setBrushSize(1);
                break;
            case 'brush':
                this.core.setBrushSize(5);
                break;
            case 'rect':
                this.core.setBrushSize(2);
                break;
            case 'line':
                this.core.setBrushSize(2);
                break;
        }
    }

    public startDrawingAction(e: MouseEvent, x: number, y: number): void {
        if (!this.core) return;
        this.isDrawing = true;
        this.startX = x;
        this.startY = y;

        this.startImageData = this.core.ctx.getImageData(0, 0, this.canvas!.width, this.canvas!.height);
        this.core.ctx.beginPath();
        this.core.ctx.moveTo(x, y);
    }

    public drawAction(e: MouseEvent, x: number, y: number): void {
        if (!this.isDrawing || !this.core || !this.canvas) return;

        // Ensure current properties are applied on the context
        this.core.ctx.strokeStyle = this.core.color;
        this.core.ctx.lineWidth = this.core.brushSize;
        this.core.ctx.lineCap = 'round';

        if (this.currentTool === 'line' || this.currentTool === 'rect') {
            if (this.startImageData) {
                this.core.ctx.putImageData(this.startImageData, 0, 0);
            }
            
            if (this.currentTool === 'line') {
                this.core.ctx.beginPath();
                this.core.ctx.moveTo(this.startX, this.startY);
                this.core.ctx.lineTo(x, y);
                this.core.ctx.stroke();
            } else if (this.currentTool === 'rect') {
                this.core.ctx.beginPath();
                this.core.ctx.rect(this.startX, this.startY, x - this.startX, y - this.startY);
                this.core.ctx.stroke();
            }
        } else if (this.currentTool === 'pencil' || this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.core.ctx.lineTo(x, y);
            this.core.ctx.stroke();
        }
    }

    private stopDrawing(): void {
        if (!this.isDrawing || !this.core) return;
        this.isDrawing = false;
        this.startImageData = null;
        this.core.saveState();
    }

    public pickImage(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = IMPORT_MIME;
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) void this.loadImageFile(file);
        };
        input.click();
    }

    public async loadImageFile(file: File): Promise<void> {
        const notify = Services.get('Notify');
        if (!this.core || !this.canvas) return;

        if (!file.type.startsWith('image/')) {
            notify?.error(`Pinta: ${Utils.escapeHTML(file.name)} is not an image`);
            return;
        }

        let bitmap: ImageBitmap | undefined;
        try {
            bitmap = await createImageBitmap(file);

            const cw = this.canvas.width;
            const ch = this.canvas.height;
            const scale = Math.min(cw / bitmap.width, ch / bitmap.height);
            const w = Math.round(bitmap.width * scale);
            const h = Math.round(bitmap.height * scale);

            this.core.ctx.clearRect(0, 0, cw, ch);
            this.core.ctx.drawImage(bitmap, Math.round((cw - w) / 2), Math.round((ch - h) / 2), w, h);
            this.core.saveState();

            notify?.success(`Opened ${file.name}`);
        } catch (err) {
            Utils.Logger.error('[Paint] loadImageFile failed', err);
            notify?.error('Pinta: could not read that image');
        } finally {
            bitmap?.close();
        }
    }

    public executeMenuAction(action: string): void {
        const notify = Services.get('Notify');
        if (!this.core) return;

        switch (action) {
            case 'new':
                this.core.clear();
                notify?.success('New document created');
                break;
            case 'open':
                this.pickImage();
                break;
            case 'save':
                void this.saveAsPng();
                break;
            case 'exit':
                const wm = Services.get<{ close: (id: string) => void }>('WindowManager');
                wm?.close(this.windowId);
                break;
            case 'undo':
                this.core.undo();
                break;
            case 'redo':
                this.core.redo();
                break;
            case 'clear':
                this.core.clear();
                break;
            case 'zoom-in':
                // simple simulated zoom (increase visual canvas display scale or just alert)
                notify?.success('Zoom In (Simulated)');
                break;
            case 'zoom-out':
                notify?.success('Zoom Out (Simulated)');
                break;
            case 'cutout':
                void this.removeBackground();
                break;
            case 'invert':
                this.core.saveState();
                invertColors(this.core.ctx);
                this.core.saveState();
                notify?.success('Colors inverted');
                break;
            case 'grayscale':
                this.core.saveState();
                convertToGrayscale(this.core.ctx);
                this.core.saveState();
                notify?.success('Converted to grayscale');
                break;
            case 'custom-color':
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = this.core.color;
                colorInput.onchange = () => {
                    this.core?.setColor(colorInput.value);
                };
                colorInput.click();
                break;
            case 'about':
                notify?.success('Pinta Paint App - Version 5.0 (Refactored)');
                break;
        }
    }

    private async removeBackground(): Promise<void> {
        const notify = Services.get('Notify');
        const btn = document.getElementById(`${this.windowId}-cutout-btn`) as HTMLButtonElement | null;
        if (!this.core || !this.canvas) return;

        if (!AiService.isSupported()) {
            notify?.error('Pinta: this browser cannot run on-device AI');
            return;
        }

        if (btn?.disabled) return;
        if (btn) { btn.disabled = true; btn.title = 'Working…'; }

        const off = AiService.onProgress(p => {
            if (!btn) return;
            btn.title = p.phase === 'download'
                ? `Downloading model… ${Math.round(p.loaded / p.total * 100)}%`
                : 'Preparing model…';
        });

        try {
            const img = this.core.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const { mask, size, coverage } = await AiService.segment('pinta', img);

            if (coverage === 0) {
                notify?.warn('Pinta: no subject found');
                return;
            }

            this.core.ctx.putImageData(applySubjectMask(img, mask, size), 0, 0);
            this.core.saveState();
            notify?.success(`Background removed smoothly (${Math.round(coverage * 100)}%)`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            Utils.Logger.error('[Paint] removeBackground failed', err);
            notify?.[msg.includes('permission denied') ? 'warn' : 'error'](
                msg.includes('permission denied')
                    ? 'Pinta: AI access denied'
                    : 'Pinta: could not remove background'
            );
        } finally {
            off();
            if (btn) { btn.disabled = false; btn.title = 'Remove background'; }
        }
    }

    private async saveAsPng(): Promise<void> {
        if (!this.canvas) return;
        const vfs = Services.get('VFS');
        const notify = Services.get('Notify');
        try {
            const blob = await new Promise<Blob | null>(resolve =>
                this.canvas!.toBlob(b => resolve(b), 'image/png')
            );
            if (!blob) {
                notify?.error('Paint: could not render image');
                return;
            }
            const name = `painting-${Date.now()}.png`;
            const ok = vfs ? await vfs.writeFileAsync('C:\\DOCUMENTS', name, blob) : false;
            if (ok) {
                notify?.success(`Saved ${name} to My Documents`);
            } else {
                notify?.error('Paint: save failed');
            }
        } catch (err) {
            Utils.Logger.error('[Paint] saveAsPng failed', err);
            notify?.error('Paint: save failed');
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
    name: 'Pinta',
    icon: 'assets/icons/pinta.webp',
    description: 'Basic drawing application with modular architecture',
    singleton: true
});

export { Paint };
