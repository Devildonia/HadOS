import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { VFS } from '../core/VFS.js';
import { AiService } from '../ai/AiService.js';
import { topKLines, buildDocAnswerPrompt, DOC_CONTEXT_LINES, type IRetrievedLine } from '../ai/grounded.js';
import { semanticTopK, pca3 } from '../ai/vectorMath.js';

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
    /** Provenance per line — which file and which local line it came from. */
    private docSources: Array<{ file: string; line: number }> = [];
    private currentFileName: string = '';

    /** Real MiniLM embeddings of docChunks ([n × 384], L2-normalised rows), or
     *  null while retrieval is keyword-based (no consent / no support / error). */
    private semanticIndex: Float32Array | null = null;
    private semanticDim: number = 384;
    private semanticBuilding: boolean = false;

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
                            Welcome to <b>Doc Explorer</b>. Load a document from the dropdown above and ask about it. Retrieval is local keyword search; ${(AiService.chatModel() && AiService.chatSupported())
                                ? 'answers are <b>generated on-device</b> by the imported Gemma model, grounded in the retrieved lines.'
                                : 'answers quote the best matching line — no AI model runs (import a Gemma model in the Messenger for generated answers).'}
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
                        <span class="docexplorer-canvas-label" id="docexplorer-space-label">${spaceText}</span>
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
        select.innerHTML = `<option value="">-- Select VFS Document --</option>
            <option value="*ALL*">📚 Todos los documentos (multi-doc)</option>`;

        // List files in C:\
        try {
            const rootFiles = (VFS.listDir('C:\\') || []).filter(f => f.endsWith('.TXT') || f.endsWith('.txt'));
            rootFiles.forEach(file => {
                select.innerHTML += `<option value="C:\\${file}">C:\\${file}</option>`;
            });
        } catch {}

        // List documents in C:\DOCUMENTS — where Notapad actually saves. This was
        // missing: the OS's own save location was invisible to its document reader.
        try {
            const docs = (VFS.listDir('C:\\DOCUMENTS') || []).filter(f => f.toLowerCase().endsWith('.txt'));
            docs.forEach(file => {
                select.innerHTML += `<option value="C:\\DOCUMENTS\\${file}">C:\\DOCUMENTS\\${file}</option>`;
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

        // Multi-doc: every listed file becomes one index, lines keep provenance.
        if (select.value === '*ALL*') {
            const paths = [...select.options].map(o => o.value).filter(v => v && v !== '*ALL*');
            this.currentFileName = `Todos los documentos (${paths.length})`;
            this.logConsole(`[VFS] Reading ${paths.length} documents...`, 'info');
            const entries: Array<{ file: string; text: string }> = [];
            for (const p of paths) {
                try {
                    const text = VFS.readFile(p);
                    if (text) entries.push({ file: p.split('\\').pop() || p, text });
                } catch { /* unreadable file — skip, the count below tells the truth */ }
            }
            if (entries.length === 0) {
                this.logConsole(`[VFS] No readable documents found.`, 'meta');
                return;
            }
            this.processDocuments(entries);
            return;
        }

        const filePath = select.value;
        this.currentFileName = filePath.split('\\').pop() || 'document.txt';

        this.logConsole(`[VFS] Reading file: ${filePath}...`, 'info');

        try {
            const text = VFS.readFile(filePath);
            if (text !== null) {
                this.processDocuments([{ file: this.currentFileName, text }]);
            } else {
                this.logConsole(`[VFS] File is empty or not found.`, 'meta');
            }
        } catch (err) {
            this.logConsole(`[VFS] Error reading file: ${err}`, 'meta');
        }
    }

    private processDocuments(entries: Array<{ file: string; text: string }>): void {
        this.logConsole(`[Index] Splitting ${entries.length > 1 ? entries.length + ' documents' : 'document'} into lines...`, 'info');

        // Split into lines, keeping per-line provenance for multi-doc citations.
        const lines: string[] = [];
        const sources: Array<{ file: string; line: number }> = [];
        for (const { file, text } of entries) {
            text.split('\n').forEach((raw, i) => {
                const l = raw.trim();
                if (l.length > 5) { lines.push(l); sources.push({ file, line: i }); }
            });
        }
        if (lines.length === 0) {
            this.logConsole(`[Index] Error: Document is too short or empty.`, 'meta');
            return;
        }

        // The semantic index caps at MAX_EMBED_TEXTS; keep both search modes on
        // the same corpus and say so when the cap bites.
        if (lines.length > 512) {
            this.logConsole(`[Index] ${lines.length} lines found — only the first 512 are indexed (the semantic cap).`, 'meta');
            lines.length = 512;
            sources.length = 512;
        }

        this.docChunks = lines;
        this.docSources = sources;
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

        // Try to upgrade the index to REAL embeddings (consent-gated, ~25 MB once).
        void this.buildSemanticIndex();

        // Show welcome chat bubble for doc — honest about which answerer runs.
        const feed = this.container?.querySelector('#docexplorer-chat-feed');
        if (feed) {
            const aiReady = !!AiService.chatModel() && AiService.chatSupported();
            const mode = aiReady
                ? 'Answers are generated on-device by the imported Gemma model, grounded in the retrieved lines (retrieval is keyword-based).'
                : 'Answers quote the best keyword match — no AI model runs. Import a Gemma model in the Messenger for generated answers.';
            feed.insertAdjacentHTML('beforeend', `
                <div class="docexplorer-chat-bubble ai">
                    Loaded document <b>${Utils.escapeHTML(this.currentFileName)}</b> containing ${this.points.length} indexed lines. ${mode}
                </div>
            `);
            feed.scrollTop = feed.scrollHeight;
        }
    }

    /**
     * Upgrades the index to REAL MiniLM embeddings: every line becomes a 384-dim
     * unit vector (on-device, ~25 MB model behind the `ai:embed` consent), search
     * becomes true cosine similarity, and the vector-space canvas switches from
     * decorative random points to a PCA projection of the actual embeddings.
     * Denied consent or any failure keeps the honest keyword mode.
     */
    private async buildSemanticIndex(): Promise<void> {
        this.semanticIndex = null;
        this.updateSpaceLabel(false); // a fresh document starts decorative again
        if (this.semanticBuilding || this.docChunks.length === 0) return;
        if (!AiService.embedSupported()) {
            this.logConsole(`[Index] Semantic indexing unavailable in this environment — keyword search stays.`, 'meta');
            return;
        }

        this.semanticBuilding = true;
        try {
            let lastPct = -1;
            const { vectors, dims } = await AiService.embed('docexplorer', this.docChunks, (p) => {
                if (p.phase === 'download' && p.total > 0) {
                    const pct = Math.floor((p.loaded / p.total) * 100);
                    if (pct >= lastPct + 25) { // don't spam the console
                        lastPct = pct;
                        this.logConsole(`[Index] Downloading MiniLM embedding model... ${pct}%`, 'info');
                    }
                } else if (p.phase === 'embed' && p.loaded === 0) {
                    this.logConsole(`[Index] Embedding ${p.total} lines on-device...`, 'info');
                }
            });

            const [n, dim] = dims;
            if (n !== this.docChunks.length) throw new Error(`embedding count mismatch (${n} vs ${this.docChunks.length})`);
            this.semanticIndex = vectors;
            this.semanticDim = dim;

            // The canvas earns its keep: project the real vectors to 3D via PCA
            // and place each line's point at its actual projected position.
            const coords = pca3(vectors, n, dim);
            const R = 80; // same scale the decorative sphere used
            this.points.forEach((pt, i) => {
                pt.x = coords[i * 3]! * R;
                pt.y = coords[i * 3 + 1]! * R;
                pt.z = coords[i * 3 + 2]! * R;
            });
            this.updateSpaceLabel(true);

            this.logConsole(`[Index] ${n} lines embedded (MiniLM q8, on-device) — semantic search active; the canvas now shows a PCA projection of the real vectors.`, 'success');
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logConsole(`[Index] Semantic indexing not active (${msg}) — keyword search stays.`, 'meta');
        } finally {
            this.semanticBuilding = false;
        }
    }

    /** Keeps the canvas caption telling the truth about what the points mean. */
    private updateSpaceLabel(real: boolean): void {
        const label = this.container?.querySelector('#docexplorer-space-label') as HTMLElement | null;
        if (!label) return;
        label.textContent = real
            ? (i18n.t('docexplorer.vector_space_real') || 'Proyección PCA de los embeddings (real)')
            : (i18n.t('docexplorer.vector_space') || 'Visualización del índice (decorativa)');
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

        // Retrieval — REAL cosine over MiniLM embeddings when the semantic index
        // exists; the honest keyword overlap otherwise.
        if (this.semanticIndex) {
            void this.searchSemantic(query, feed);
            return;
        }

        // Keyword retrieval — described as what it is, not as vector search.
        this.logConsole(`[Search] Matching query words against ${this.points.length} lines...`, 'info');

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

        // With an imported Gemma model, the ANSWER becomes real: the retrieved
        // lines go to the model as context and it answers grounded in them.
        if (AiService.chatModel() && AiService.chatSupported()) {
            void this.answerWithModel(query, feed, bestIndex, matchingChunk, topKLines(query, this.docChunks, DOC_CONTEXT_LINES));
            return;
        }

        this.renderQuotedAnswer(query, feed, bestIndex, matchingChunk);
    }

    /**
     * REAL semantic retrieval: the query becomes a MiniLM vector (same consent,
     * already granted at indexing) and lines are ranked by true cosine — so the
     * similarity figures in the log are finally measurements, not theatre.
     */
    private async searchSemantic(query: string, feed: Element): Promise<void> {
        const index = this.semanticIndex;
        if (!index) return;

        try {
            this.logConsole(`[Search] Embedding the query and scoring ${this.docChunks.length} lines by cosine (on-device)...`, 'info');
            const { vectors } = await AiService.embed('docexplorer', [query]);
            const top = semanticTopK(vectors, index, this.semanticDim, DOC_CONTEXT_LINES);
            if (top.length === 0) {
                this.logConsole(`[Search] No lines to score.`, 'meta');
                return;
            }

            const best = top[0]!;
            this.activeChunkId = best.index;
            this.points.forEach(pt => { pt.score = 0; });
            top.forEach(t => { const pt = this.points[t.index]; if (pt) pt.score = Math.max(0, t.score); });

            const matchingChunk = this.docChunks[best.index] || '';
            this.logConsole(`[Search] Best match: line #${best.index} (cosine ${best.score.toFixed(2)} — real embedding similarity)`, 'success');

            const retrieved: IRetrievedLine[] = top.map(t => ({ index: t.index, text: this.docChunks[t.index] ?? '', score: t.score }));
            if (AiService.chatModel() && AiService.chatSupported()) {
                await this.answerWithModel(query, feed, best.index, matchingChunk, retrieved);
            } else {
                this.renderQuotedAnswer(query, feed, best.index, matchingChunk);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logConsole(`[Search] Semantic search failed (${msg}) — try again or reload the document.`, 'meta');
        }
    }

    /** `file:line` provenance for a global index — the citation the user can check. */
    private sourceLabel(index: number): string {
        const src = this.docSources[index];
        return src ? `${src.file}:${src.line}` : `línea ${index}`;
    }

    /** The no-model answer: an honest quote of the best line, escaped (audit A2). */
    private renderQuotedAnswer(query: string, feed: Element, bestIndex: number, matchingChunk: string): void {
        setTimeout(() => {
            const sourceText = i18n.t('docexplorer.answering') || 'Best matching line';
            const answer = this.generateGroundedAnswer(query, matchingChunk);

            feed.insertAdjacentHTML('beforeend', `
                <div class="docexplorer-chat-bubble ai">
                    <div><b>${Utils.escapeHTML(sourceText)}:</b> ${Utils.escapeHTML(answer)}</div>
                    <div class="docexplorer-source-box">
                        <b>Source [${Utils.escapeHTML(this.sourceLabel(bestIndex))}]:</b> "${Utils.escapeHTML(matchingChunk)}"
                    </div>
                </div>
            `);
            feed.scrollTop = feed.scrollHeight;
            if (window.playBlip) window.playBlip(700);
        }, 600);
    }

    /**
     * A REAL grounded answer: the keyword-retrieved top lines ride into the
     * imported Gemma model as context, with a strict instruction to answer only
     * from them and cite line numbers. Streams into the bubble; the source line
     * box stays, because provenance matters more with a generator in the loop.
     */
    private async answerWithModel(query: string, feed: Element, bestIndex: number, matchingChunk: string, retrieved: IRetrievedLine[]): Promise<void> {
        this.logConsole(`[AI] Feeding the top ${retrieved.length} lines to the imported Gemma model (on-device)...`, 'info');

        feed.insertAdjacentHTML('beforeend', `
            <div class="docexplorer-chat-bubble ai">
                <div><b>🧠</b> <span class="doc-ai-answer"></span></div>
                <div class="docexplorer-source-box">
                    <b>Source [${Utils.escapeHTML(this.sourceLabel(bestIndex))}]:</b> "${Utils.escapeHTML(matchingChunk)}"
                </div>
            </div>
        `);
        const answerEls = feed.querySelectorAll('.doc-ai-answer');
        const answerEl = answerEls[answerEls.length - 1] as HTMLElement | undefined;
        feed.scrollTop = feed.scrollHeight;

        try {
            const { persona, user } = buildDocAnswerPrompt(query, retrieved, i18n.getLang());
            const text = await AiService.chat('docexplorer', { persona, history: [{ role: 'user', text: user }] }, (delta) => {
                if (answerEl) {
                    answerEl.textContent += delta; // model output: textContent only
                    feed.scrollTop = feed.scrollHeight;
                }
            });
            if (answerEl) answerEl.textContent = text.trim();
            this.logConsole(`[AI] Grounded answer generated from ${retrieved.length} retrieved lines.`, 'success');
            if (window.playBlip) window.playBlip(700);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (answerEl) answerEl.textContent = `⚠️ IA local: ${msg}`;
            this.logConsole(`[AI] On-device answer failed: ${msg}`, 'meta');
        }
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
    description: 'Ask questions about a local document — keyword retrieval, with on-device AI answers when a Gemma model is imported.',
    singleton: true
});
