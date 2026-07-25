import { i18n } from '../../services/i18n.js';
import { Paint } from '../Paint.js';
import { getPixelColor, floodFill } from './PaintTools.js';

export class PaintUI {
    private owner: Paint;
    private canvasRectLeft = 0;
    private canvasRectTop = 0;
    private textX = 0;
    private textY = 0;

    constructor(owner: Paint) {
        this.owner = owner;
    }

    public getHTML(): string {
        return `
            <div class="window-menu"></div>
            <div class="paint-main-area">
                <div class="paint-toolbar"></div>
                <div class="paint-canvas-container">
                    <canvas id="paint-canvas" width="400" height="300"></canvas>
                </div>
            </div>
            <div class="paint-color-bar" style="display: flex; align-items: center; justify-content: space-between; padding: 2px 6px;">
                <div class="paint-colors-palette" style="display: flex; flex-wrap: wrap; max-width: 300px;"></div>
                <div class="paint-brush-size-container" style="display: flex; align-items: center; gap: 5px;">
                    <span>Size:</span>
                    <input type="range" class="paint-brush-size-slider" min="1" max="20" value="2" title="Brush Size" />
                    <span class="paint-brush-size-text" style="min-width: 15px; display: inline-block; text-align: right;">2px</span>
                </div>
            </div>
            <div class="window-statusbar" style="display: flex; justify-content: space-between; padding: 2px 6px;">
                <span class="paint-status-tool">${i18n.t('paint.status.ready')}</span>
                <span class="paint-status-size">0 x 0 px</span>
                <span class="paint-status-coords">0, 0 px</span>
            </div>
        `;
    }

    public setup(): void {
        const body = document.getElementById(this.owner.windowId)?.querySelector('.paint-body');
        if (!body) return;

        body.innerHTML = this.getHTML();

        // Capture the new canvas element and assign it to the owner
        this.owner.canvas = document.getElementById('paint-canvas') as HTMLCanvasElement;

        this.setupToolbar();
        this.setupColors();
        this.setupCanvasEvents();
        this.setupSizeSlider();
        this.updateStatusSize();
    }

    private setupToolbar(): void {
        const toolbar = document.querySelector(`#${this.owner.windowId} .paint-toolbar`);
        if (!toolbar) return;

        toolbar.innerHTML = '';

        const tools = [
            { id: 'pencil', icon: '✏️', title: i18n.t('paint.tool.pencil') },
            { id: 'brush', icon: '🖌️', title: i18n.t('paint.tool.brush') },
            { id: 'eraser', icon: '🧽', title: i18n.t('paint.tool.eraser') },
            { id: 'rect', icon: '⬜', title: i18n.t('paint.tool.rect') },
            { id: 'line', icon: '📏', title: i18n.t('paint.tool.line') },
            { id: 'bucket', icon: '🪣', title: i18n.t('paint.tool.bucket') },
            { id: 'picker', icon: '🧪', title: i18n.t('paint.tool.picker') },
            { id: 'text', icon: '🔤', title: i18n.t('paint.tool.text') },
            { id: 'clear', icon: '🗑️', title: i18n.t('paint.tool.clear') },
            { id: 'separator', icon: '', title: '' },
            { id: 'undo', icon: '↩️', title: i18n.t('paint.tool.undo') },
            { id: 'redo', icon: '↪️', title: i18n.t('paint.tool.redo') },
            { id: 'open', icon: '📂', title: i18n.t('paint.tool.open') },
            { id: 'save', icon: '💾', title: i18n.t('paint.tool.save') },
            { id: 'cutout', icon: '🪄', title: i18n.t('paint.tool.cutout') }
        ];

        tools.forEach(tool => {
            if (tool.id === 'separator') {
                const sep = document.createElement('span');
                sep.style.cssText = 'grid-column: span 2; width: 100%; height: 1px; background: #808080; margin: 4px 0;';
                toolbar.appendChild(sep);
                return;
            }

            const btn = document.createElement('button');
            btn.className = 'hados-btn paint-tool-btn';
            btn.style.cssText = 'width: 24px; height: 24px; padding: 0;';
            btn.title = tool.title;
            btn.dataset.toolId = tool.id;
            
            const iconSpan = document.createElement('span');
            iconSpan.style.fontSize = '14px';
            iconSpan.textContent = tool.icon;
            btn.appendChild(iconSpan);

            if (tool.id === 'undo') {
                btn.id = `${this.owner.windowId}-undo-btn`;
                btn.disabled = true;
                btn.onclick = () => this.owner.executeMenuAction('undo');
            } else if (tool.id === 'redo') {
                btn.id = `${this.owner.windowId}-redo-btn`;
                btn.disabled = true;
                btn.onclick = () => this.owner.executeMenuAction('redo');
            } else if (tool.id === 'save') {
                btn.onclick = () => this.owner.executeMenuAction('save');
            } else if (tool.id === 'open') {
                btn.onclick = () => this.owner.pickImage();
            } else if (tool.id === 'cutout') {
                btn.id = `${this.owner.windowId}-cutout-btn`;
                btn.onclick = () => this.owner.executeMenuAction('cutout');
            } else {
                btn.onclick = () => this.owner.selectTool(tool.id as Parameters<typeof this.owner.selectTool>[0]);
            }

            toolbar.appendChild(btn);
        });
    }

    private setupColors(): void {
        const colorBar = document.querySelector(`#${this.owner.windowId} .paint-colors-palette`);
        if (!colorBar) return;

        colorBar.innerHTML = '';

        const colors = [
            '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
            '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
        ];

        colors.forEach(col => {
            const box = document.createElement('div');
            box.style.cssText = `width: 15px; height: 15px; background: ${col}; border: 1px solid #808080; margin: 1px; cursor: pointer;`;
            box.onclick = () => {
                this.owner.core?.setColor(col);
            };
            colorBar.appendChild(box);
        });
    }

    private setupSizeSlider(): void {
        const slider = document.querySelector(`#${this.owner.windowId} .paint-brush-size-slider`) as HTMLInputElement;
        const textSpan = document.querySelector(`#${this.owner.windowId} .paint-brush-size-text`) as HTMLElement;
        if (!slider || !textSpan) return;

        slider.oninput = () => {
            const val = parseInt(slider.value);
            textSpan.textContent = `${val}px`;
            this.owner.core?.setBrushSize(val);
        };
    }

    private boundMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
    private boundMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
    private boundDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };
    private boundDrop = (e: DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file) void this.owner.loadImageFile(file);
    };

    private setupCanvasEvents(): void {
        const canvas = this.owner.canvas;
        if (!canvas) return;

        canvas.removeEventListener('mousedown', this.boundMouseDown);
        canvas.removeEventListener('mousemove', this.boundMouseMove);
        canvas.removeEventListener('dragover', this.boundDragOver);
        canvas.removeEventListener('drop', this.boundDrop);

        canvas.addEventListener('mousedown', this.boundMouseDown);
        canvas.addEventListener('mousemove', this.boundMouseMove);
        canvas.addEventListener('dragover', this.boundDragOver);
        canvas.addEventListener('drop', this.boundDrop);
    }

    private handleMouseDown(e: MouseEvent): void {
        const canvas = this.owner.canvas;
        const core = this.owner.core;
        if (!canvas || !core) return;

        // If clicking while text tool has active input
        if (this.owner.currentTool !== 'text') {
            this.commitFloatingText();
        }

        const rect = canvas.getBoundingClientRect();
        this.canvasRectLeft = rect.left;
        this.canvasRectTop = rect.top;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.owner.currentTool === 'picker') {
            const col = getPixelColor(core.ctx, x, y);
            core.setColor(col);
            this.owner.selectTool('pencil'); // Revert to pencil after picking
            return;
        }

        if (this.owner.currentTool === 'bucket') {
            core.saveState();
            floodFill(core.ctx, Math.round(x), Math.round(y), core.color);
            core.saveState();
            return;
        }

        if (this.owner.currentTool === 'text') {
            this.commitFloatingText();

            const container = document.querySelector(`#${this.owner.windowId} .paint-canvas-container`) as HTMLElement;
            if (!container) return;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'paint-floating-text-input';
            input.style.left = `${x}px`;
            input.style.top = `${y}px`;
            input.style.color = core.color;
            input.style.fontSize = `${core.brushSize + 11}px`;

            container.appendChild(input);
            input.focus();

            this.textX = x;
            this.textY = y;

            const onKey = (ke: KeyboardEvent) => {
                if (ke.key === 'Enter') {
                    this.commitFloatingText();
                } else if (ke.key === 'Escape') {
                    input.remove();
                }
            };
            input.addEventListener('keydown', onKey);
            input.addEventListener('blur', () => this.commitFloatingText());
            return;
        }

        this.owner.startDrawingAction(e, x, y);
    }

    private handleMouseMove(e: MouseEvent): void {
        const canvas = this.owner.canvas;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);

        const coordsSpan = document.querySelector(`#${this.owner.windowId} .paint-status-coords`);
        if (coordsSpan) {
            coordsSpan.textContent = `${x}, ${y} px`;
        }

        this.owner.drawAction(e, x, y);
    }

    public commitFloatingText(): void {
        const input = document.querySelector(`#${this.owner.windowId} .paint-floating-text-input`) as HTMLInputElement | null;
        const core = this.owner.core;
        if (input && core && input.value) {
            core.saveState();
            core.ctx.font = `${core.brushSize + 11}px "Outfit", sans-serif`;
            core.ctx.fillStyle = core.color;
            core.ctx.textBaseline = 'top';
            core.ctx.fillText(input.value, this.textX, this.textY);
            core.saveState();
        }
        input?.remove();
    }

    public updateStatusTool(tool: string): void {
        const span = document.querySelector(`#${this.owner.windowId} .paint-status-tool`);
        if (span) {
            span.textContent = `${i18n.t('paint.status.tool')}: ${i18n.t(`paint.tool.${tool}`)}`;
        }
    }

    public updateStatusSize(): void {
        const canvas = this.owner.canvas;
        const span = document.querySelector(`#${this.owner.windowId} .paint-status-size`);
        if (span && canvas) {
            span.textContent = `${canvas.width} x ${canvas.height} px`;
        }
    }

    public updateUndoRedoButtons(canUndo: boolean, canRedo: boolean): void {
        const undoBtn = document.getElementById(`${this.owner.windowId}-undo-btn`) as HTMLButtonElement | null;
        const redoBtn = document.getElementById(`${this.owner.windowId}-redo-btn`) as HTMLButtonElement | null;
        if (undoBtn) undoBtn.disabled = !canUndo;
        if (redoBtn) redoBtn.disabled = !canRedo;
    }

    public updateActiveToolButton(tool: string): void {
        const btns = document.querySelectorAll(`#${this.owner.windowId} .paint-toolbar button`);
        btns.forEach(b => {
            const btnEl = b as HTMLButtonElement;
            if (btnEl.dataset.toolId !== 'undo' && btnEl.dataset.toolId !== 'redo') {
                btnEl.classList.remove('tool-active');
            }
        });

        const activeBtn = Array.from(btns).find(b => (b as HTMLButtonElement).dataset.toolId === tool) as HTMLButtonElement | undefined;
        if (activeBtn) {
            activeBtn.classList.add('tool-active');
        }
    }
}
