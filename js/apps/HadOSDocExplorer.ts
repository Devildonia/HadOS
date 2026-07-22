import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { VFS } from '../core/VFS.js';

interface VectorPoint {
    x: number;
    y: number;
    z: number;
    chunkId: number;
    text: string;
    score?: number;
}

export class HadOSDocExplorer implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;

    private points: VectorPoint[] = [];
    private angleX: number = 0.01;
    private angleY: number = 0.015;
    private animationFrameId: number | null = null;
    private activeChunkId: number | null = null;

    private docChunks: string[] = [];
    private currentFileName: string = '';

    private boundOpenFile = () => this.handleOpenFile();
    private boundSendQuery = () => this.handleSendQuery();
    private boundInputKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') this.handleSendQuery();
    };

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.docexplorer') || 'Doc Explorer';

        this.windowId = WindowFactory.create({
            title: title,
            width: 780,
            height: 480,
            resizable: true,
            icon: '🔍'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupLayout();
        this.loadVfsFileList();
        this.startCanvasAnimation();
    }

    private setupLayout(): void {
        if (!this.container) return;

        const openText = i18n.t('docexplorer.open_file') || 'Abrir Archivo';
        const placeholderText = i18n.t('docexplorer.ask_placeholder') || 'Haz una pregunta sobre este documento...';
        const spaceText = i18n.t('docexplorer.vector_space') || 'Visualización del índice (decorativa)';

        this.container.innerHTML = `
            <div class="docexplorer-layout">
                <!-- Left Panel: Grounded Chat -->
                <div class="docexplorer-left">
                    <div class="docexplorer-header">
                        <select class="hados-select" id="docexplorer-file-select" style="flex: 1; font-size: 11px;">
                            <option value="">-- Select VFS Document --</option>
                        </select>
                        <button class="hados-btn" id="docexplorer-open-btn" style="padding: 2px 8px;">${openText}</button>
                    </div>

                    <div class="docexplorer-chat-feed" id="docexplorer-chat-feed">
                        <div class="docexplorer-chat-bubble ai">
                            Welcome to <b>Doc Explorer</b>. Load a document from the dropdown above and ask about it — answers quote the line that best matches your words. Local keyword search; no AI model runs.
                        </div>
                    </div>

                    <div class="docexplorer-chat-input-bar">
                        <input type="text" class="docexplorer-input" id="docexplorer-chat-input" placeholder="${placeholderText}">
                        <button class="hados-btn" id="docexplorer-send-btn" style="padding: 2px 10px;">Send</button>
                    </div>
                </div>

                <!-- Right Panel: Diagnostics Space -->
                <div class="docexplorer-right">
                    <!-- Canvas Space -->
                    <div class="docexplorer-canvas-container">
                        <span class="docexplorer-canvas-label">${spaceText}</span>
                        <canvas class="docexplorer-canvas" id="docexplorer-canvas"></canvas>
                    </div>

                    <!-- Diagnostics terminal -->
                    <div class="docexplorer-console" id="docexplorer-console">
                        [System] Doc Explorer initialized — local keyword search, no AI model.<br>
                        [VFS] Ready to read document tree.
                    </div>
                </div>
            </div>
        `;

        this.canvas = this.container.querySelector('#docexplorer-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
        }

        // Bind events
        const openBtn = this.container.querySelector('#docexplorer-open-btn');
        if (openBtn) Utils.eventManager.add(openBtn, 'click', this.boundOpenFile);

        const sendBtn = this.container.querySelector('#docexplorer-send-btn');
        if (sendBtn) Utils.eventManager.add(sendBtn, 'click', this.boundSendQuery);

        const chatInput = this.container.querySelector('#docexplorer-chat-input');
        if (chatInput) Utils.eventManager.add(chatInput, 'keydown', this.boundInputKeydown as EventListener);
    }

    private logConsole(msg: string, type: 'info' | 'meta' | 'success' = 'info'): void {
        const consoleEl = this.container?.querySelector('#docexplorer-console');
        if (consoleEl) {
            const cssClass = type === 'meta' ? 'docexplorer-log-meta' : type === 'success' ? 'docexplorer-log-success' : '';
            consoleEl.innerHTML += `<br><span class="${cssClass}">${msg}</span>`;
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }
    }

    private resizeCanvas(): void {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement?.getBoundingClientRect();
        this.canvas.width = rect?.width || 240;
        this.canvas.height = rect?.height || 220;
    }

    private loadVfsFileList(): void {
        const select = this.container?.querySelector('#docexplorer-file-select') as HTMLSelectElement | null;
        if (!select) return;

        // Clear existing options except placeholder
        select.innerHTML = `<option value="">-- Select VFS Document --</option>`;

        // List files in C:\
        try {
            const rootFiles = (VFS.listDir('C:\\') || []).filter(f => f.endsWith('.TXT') || f.endsWith('.txt'));
            rootFiles.forEach(file => {
                select.innerHTML += `<option value="C:\\${file}">C:\\${file}</option>`;
            });
        } catch {}

        // List notes in C:\HADOS\NOTES
        try {
            const notes = (VFS.listDir('C:\\HADOS\\NOTES') || []).filter(f => f.endsWith('.txt'));
            notes.forEach(file => {
                select.innerHTML += `<option value="C:\\HADOS\\NOTES\\${file}">C:\\HADOS\\NOTES\\${file}</option>`;
            });
        } catch {}

        // List podcasts in C:\HADOS\PODCASTS
        try {
            const podcasts = (VFS.listDir('C:\\HADOS\\PODCASTS') || []).filter(f => f.endsWith('.txt'));
            podcasts.forEach(file => {
                select.innerHTML += `<option value="C:\\HADOS\\PODCASTS\\${file}">C:\\HADOS\\PODCASTS\\${file}</option>`;
            });
        } catch {}
    }

    private async handleOpenFile(): Promise<void> {
        const select = this.container?.querySelector('#docexplorer-file-select') as HTMLSelectElement | null;
        if (!select || !select.value) return;

        const filePath = select.value;
        this.currentFileName = filePath.split('\\').pop() || 'document.txt';

        this.logConsole(`[VFS] Reading file: ${filePath}...`, 'info');

        try {
            const text = VFS.readFile(filePath);
            if (text !== null) {
                this.processDocument(text);
            } else {
                this.logConsole(`[VFS] File is empty or not found.`, 'meta');
            }
        } catch (err) {
            this.logConsole(`[VFS] Error reading file: ${err}`, 'meta');
        }
    }

    private processDocument(text: string): void {
        // Honest labels (audit A4): there are no embeddings here. The "index" is the
        // document split into lines, and the sphere points are random positions for
        // the visualisation — they encode nothing.
        this.logConsole(`[Index] Splitting document into lines...`, 'info');

        // Split text into chunks (e.g. paragraphs or lines)
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
        if (lines.length === 0) {
            this.logConsole(`[Index] Error: Document is too short or empty.`, 'meta');
            return;
        }

        this.docChunks = lines;
        this.points = [];

        // Generate vector points (nube de puntos) in 3D sphere
        lines.forEach((chunk, index) => {
            const u = Math.random();
            const v = Math.random();
            const theta = u * 2.0 * Math.PI;
            const phi = Math.acos(2.0 * v - 1.0);
            const r = 80; // sphere radius

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            this.points.push({
                x, y, z,
                chunkId: index,
                text: chunk
            });
        });

        this.logConsole(`[Index] ${this.points.length} lines indexed (keyword search — no embeddings).`, 'success');

        // Show welcome chat bubble for doc
        const feed = this.container?.querySelector('#docexplorer-chat-feed');
        if (feed) {
            feed.insertAdjacentHTML('beforeend', `
                <div class="docexplorer-chat-bubble ai">
                    Loaded document <b>${Utils.escapeHTML(this.currentFileName)}</b> containing ${this.points.length} indexed lines. Answers quote the best keyword match — no AI model runs.
                </div>
            `);
            feed.scrollTop = feed.scrollHeight;
        }
    }

    private handleSendQuery(): void {
        const input = this.container?.querySelector('#docexplorer-chat-input') as HTMLInputElement | null;
        if (!input || !input.value.trim() || this.docChunks.length === 0) return;

        const query = input.value.trim();
        input.value = '';

        const feed = this.container?.querySelector('#docexplorer-chat-feed');
        if (!feed) return;

        // Render user message — escaped: it goes back through innerHTML (audit A2).
        feed.insertAdjacentHTML('beforeend', `
            <div class="docexplorer-chat-bubble user">
                ${Utils.escapeHTML(query)}
            </div>
        `);
        feed.scrollTop = feed.scrollHeight;

        // Keyword retrieval — described as what it is, not as vector search.
        this.logConsole(`[Search] Matching query words against ${this.points.length} lines...`, 'info');

        // Simple mock search (cosine similarity simulation)
        // Find chunk with highest word match ratio
        let bestIndex = 0;
        let highestScore = -1;

        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        this.points.forEach((pt, index) => {
            let matches = 0;
            const chunkLower = pt.text.toLowerCase();
            queryWords.forEach(word => {
                if (chunkLower.includes(word)) matches++;
            });

            const score = queryWords.length > 0 ? matches / queryWords.length : 0;
            pt.score = score;

            if (score > highestScore) {
                highestScore = score;
                bestIndex = index;
            }
        });

        this.activeChunkId = bestIndex;
        const matchingChunk = this.docChunks[bestIndex] || '';

        // No invented "24ms cosine" figures: it is a word-overlap ratio.
        this.logConsole(`[Search] Best match: line #${bestIndex} (${(highestScore * 100).toFixed(0)}% of query words present)`, 'success');

        // Show the quoted answer. Document content is untrusted (VFS, writable by
        // apps) — everything is escaped before touching innerHTML (audit A2).
        setTimeout(() => {
            const sourceText = i18n.t('docexplorer.answering') || 'Best matching line';
            const answer = this.generateGroundedAnswer(query, matchingChunk);

            feed.insertAdjacentHTML('beforeend', `
                <div class="docexplorer-chat-bubble ai">
                    <div><b>${Utils.escapeHTML(sourceText)}:</b> ${Utils.escapeHTML(answer)}</div>
                    <div class="docexplorer-source-box">
                        <b>Source line #${bestIndex}:</b> "${Utils.escapeHTML(matchingChunk)}"
                    </div>
                </div>
            `);
            feed.scrollTop = feed.scrollHeight;
            if (window.playBlip) window.playBlip(700);
        }, 600);
    }

    private generateGroundedAnswer(query: string, chunk: string): string {
        const lang = i18n.getLang();
        const isSpanish = lang === 'es';

        if (isSpanish) {
            return `Basándome en el documento analizado, el texto indica que: "${chunk}". Esto responde directamente a tu pregunta sobre "${query}".`;
        } else {
            return `Grounded in the retrieved document context, the file states that: "${chunk}". This aligns with your query regarding "${query}".`;
        }
    }

    private startCanvasAnimation(): void {
        const render = () => {
            this.drawVectorSpace();
            this.animationFrameId = requestAnimationFrame(render);
        };
        render();
    }

    private drawVectorSpace(): void {
        if (!this.canvas || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Rotation matrices coefficients
        const radX = this.angleX;
        const radY = this.angleY;
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);

        this.points.forEach(pt => {
            // Rotate Y
            const x1 = pt.x * cosY - pt.z * sinY;
            const z1 = pt.z * cosY + pt.x * sinY;

            // Rotate X
            const y2 = pt.y * cosX - z1 * sinX;
            const z2 = z1 * cosX + pt.y * sinX;

            // Save rotated coordinates
            pt.x = x1;
            pt.y = y2;
            pt.z = z2;

            // Project to 2D screen coordinate
            const zoom = 140 / (140 + z2);
            const px = cx + x1 * zoom;
            const py = cy + y2 * zoom;

            // Draw vector node
            const isActive = pt.chunkId === this.activeChunkId;
            const size = isActive ? 8 : Math.max(1, 4 * zoom);

            this.ctx!.beginPath();
            this.ctx!.arc(px, py, size, 0, 2 * Math.PI);

            if (isActive) {
                // Highlighted matching chunk (Gold pulse)
                this.ctx!.fillStyle = '#ffcc00';
                this.ctx!.shadowBlur = 15;
                this.ctx!.shadowColor = '#ffcc00';
            } else {
                // Dim non-matching nodes
                this.ctx!.fillStyle = `rgba(0, 255, 204, ${Math.max(0.2, zoom)})`;
                this.ctx!.shadowBlur = 0;
            }

            this.ctx!.fill();
        });
    }

    public terminate(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.container) {
            const openBtn = this.container.querySelector('#docexplorer-open-btn');
            if (openBtn) Utils.eventManager.remove(openBtn, 'click', this.boundOpenFile);

            const sendBtn = this.container.querySelector('#docexplorer-send-btn');
            if (sendBtn) Utils.eventManager.remove(sendBtn, 'click', this.boundSendQuery);

            const chatInput = this.container.querySelector('#docexplorer-chat-input');
            if (chatInput) Utils.eventManager.remove(chatInput, 'keydown', this.boundInputKeydown as EventListener);
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('docexplorer', HadOSDocExplorer, {
    name: 'Doc Explorer',
    icon: '🔍',
    description: 'Ask questions about a local document — keyword search that quotes the best match.',
    singleton: true
});
