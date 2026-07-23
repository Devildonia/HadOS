/**
 * TABULA — CSV analysis, the honest way (AI phase 5)
 *
 * Every statistic on screen is computed IN CODE (`tabula/csv.ts`) — real
 * arithmetic over the real cells. The imported Gemma model, when present, only
 * NARRATES those precomputed numbers under an instruction that forbids
 * inventing or recalculating: an LLM doing arithmetic is a hallucination with
 * confidence, and this app exists to be trustworthy about data.
 */

import { Kernel } from '../core/Kernel.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { AiService } from '../ai/AiService.js';
import { parseCsv, computeColumnStats, buildCsvNarrationPrompt, fmt, type ICsvTable, type IColumnStats } from './tabula/csv.js';

const PREVIEW_ROWS = 50;

export class HadOSTabula implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;

    private table: ICsvTable | null = null;
    private stats: IColumnStats[] = [];
    private fileName: string = '';
    private narrating: boolean = false;

    private boundOpen = () => this.handleOpen();
    private boundNarrate = () => { void this.handleNarrate(); };

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.tabula') || 'Tabula';
        this.windowId = WindowFactory.create({
            title,
            width: 720,
            height: 500,
            resizable: true,
            icon: '📊'
        });
        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;
        this.setupLayout();
    }

    private aiReady(): boolean {
        return !!AiService.chatModel() && AiService.chatSupported();
    }

    private setupLayout(): void {
        if (!this.container) return;
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; gap: 8px; padding: 8px; box-sizing: border-box; font-size: 11px;">
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="hados-btn" id="tabula-open-btn">📂 Abrir CSV</button>
                    <span id="tabula-file-label" style="color: #888;">Ningún archivo — todo el análisis ocurre en tu equipo.</span>
                    <span style="flex: 1;"></span>
                    <button class="hados-btn" id="tabula-narrate-btn" style="display: none;" title="Gemma narra las estadísticas YA calculadas — tiene prohibido inventar cifras">🧠 Narrar (IA local)</button>
                </div>
                <div id="tabula-stats" style="overflow: auto; max-height: 40%; border: 1px solid rgba(128,128,128,.3); border-radius: 4px; padding: 6px; display: none;"></div>
                <div id="tabula-narration" style="display: none; border: 1px solid rgba(128,128,128,.3); border-radius: 4px; padding: 8px; white-space: pre-wrap;"></div>
                <div id="tabula-preview" style="flex: 1; overflow: auto; border: 1px solid rgba(128,128,128,.3); border-radius: 4px;"></div>
            </div>
        `;
        const openBtn = this.container.querySelector('#tabula-open-btn');
        if (openBtn) Utils.eventManager.add(openBtn, 'click', this.boundOpen);
        const narrateBtn = this.container.querySelector('#tabula-narrate-btn');
        if (narrateBtn) Utils.eventManager.add(narrateBtn, 'click', this.boundNarrate);
    }

    private handleOpen(): void {
        const picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = '.csv,text/csv';
        picker.onchange = async (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            this.fileName = file.name;
            const text = await file.text();
            this.loadCsv(text);
        };
        picker.click();
    }

    private loadCsv(text: string): void {
        this.table = parseCsv(text);
        this.stats = computeColumnStats(this.table);

        const label = this.container?.querySelector('#tabula-file-label') as HTMLElement | null;
        if (label) label.textContent = `${this.fileName} — ${this.table.rows.length} filas × ${this.table.headers.length} columnas (delimitador "${this.table.delimiter === '\t' ? 'tab' : this.table.delimiter}")`;

        this.renderStats();
        this.renderPreview();

        const narrateBtn = this.container?.querySelector('#tabula-narrate-btn') as HTMLElement | null;
        if (narrateBtn) narrateBtn.style.display = this.aiReady() ? '' : 'none';
        const narration = this.container?.querySelector('#tabula-narration') as HTMLElement | null;
        if (narration) { narration.style.display = 'none'; narration.textContent = ''; }
    }

    private renderStats(): void {
        const el = this.container?.querySelector('#tabula-stats') as HTMLElement | null;
        if (!el || !this.table) return;
        el.style.display = '';
        // Cell values are user-file text — escaped before innerHTML, as everywhere.
        el.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">Estadísticas <span style="font-weight: normal; color: #888;">(calculadas en código — números reales, no generados)</span></div>
            <table style="border-collapse: collapse; width: 100%; font-size: 10px;">
                <tr>${['Columna', 'Tipo', 'Valores', 'Vacíos', 'Detalle'].map(h => `<th style="text-align: left; padding: 2px 6px; border-bottom: 1px solid rgba(128,128,128,.4);">${h}</th>`).join('')}</tr>
                ${this.stats.map(s => `
                    <tr>
                        <td style="padding: 2px 6px;"><b>${Utils.escapeHTML(s.name)}</b></td>
                        <td style="padding: 2px 6px;">${s.kind === 'numeric' ? '🔢 numérica' : '🔤 texto'}</td>
                        <td style="padding: 2px 6px;">${s.count}</td>
                        <td style="padding: 2px 6px;">${s.missing}</td>
                        <td style="padding: 2px 6px;">${s.kind === 'numeric'
                            ? `min ${fmt(s.min)} · max ${fmt(s.max)} · media ${fmt(s.mean)} · suma ${fmt(s.sum)}`
                            : `${s.distinct} distintos · top "${Utils.escapeHTML(s.top)}" (${s.topCount})`}</td>
                    </tr>`).join('')}
            </table>`;
    }

    private renderPreview(): void {
        const el = this.container?.querySelector('#tabula-preview') as HTMLElement | null;
        if (!el || !this.table) return;
        const rows = this.table.rows.slice(0, PREVIEW_ROWS);
        el.innerHTML = `
            <table style="border-collapse: collapse; width: 100%; font-size: 10px;">
                <tr>${this.table.headers.map(h => `<th style="text-align: left; padding: 2px 6px; border-bottom: 1px solid rgba(128,128,128,.4); position: sticky; top: 0; background: inherit;">${Utils.escapeHTML(h)}</th>`).join('')}</tr>
                ${rows.map(r => `<tr>${r.map(c => `<td style="padding: 2px 6px; border-bottom: 1px solid rgba(128,128,128,.15);">${Utils.escapeHTML(c)}</td>`).join('')}</tr>`).join('')}
            </table>
            ${this.table.rows.length > PREVIEW_ROWS ? `<div style="padding: 4px 6px; color: #888;">… y ${this.table.rows.length - PREVIEW_ROWS} filas más (todas cuentan en las estadísticas).</div>` : ''}`;
    }

    /** Gemma narrates the PRECOMPUTED stats — streamed, and labelled as narration. */
    private async handleNarrate(): Promise<void> {
        if (!this.table || this.narrating || !this.aiReady()) return;
        this.narrating = true;

        const el = this.container?.querySelector('#tabula-narration') as HTMLElement | null;
        if (!el) { this.narrating = false; return; }
        el.style.display = '';
        el.textContent = '🧠 Narrando las estadísticas calculadas (Gemma, en tu equipo)…\n\n';

        try {
            const { persona, user } = buildCsvNarrationPrompt(this.fileName, this.table.rows.length, this.stats, i18n.getLang());
            let started = false;
            const text = await AiService.chat('tabula', { persona, history: [{ role: 'user', text: user }] }, (delta) => {
                if (!started) { el.textContent = ''; started = true; }
                el.textContent += delta;
            });
            el.textContent = text.trim() + '\n\n— Narración generada on-device sobre cifras calculadas en código.';
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            el.textContent = `⚠️ IA local: ${msg}`;
        } finally {
            this.narrating = false;
        }
    }

    public terminate(): void {
        if (this.container) {
            const openBtn = this.container.querySelector('#tabula-open-btn');
            if (openBtn) Utils.eventManager.remove(openBtn, 'click', this.boundOpen);
            const narrateBtn = this.container.querySelector('#tabula-narrate-btn');
            if (narrateBtn) Utils.eventManager.remove(narrateBtn, 'click', this.boundNarrate);
        }
        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('tabula', HadOSTabula, {
    name: 'Tabula',
    icon: '📊',
    description: 'CSV analysis with code-computed statistics; the imported AI model only narrates the real numbers.',
    singleton: true
});
