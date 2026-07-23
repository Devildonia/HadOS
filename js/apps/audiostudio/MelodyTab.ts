/**
 * MELODY TAB — Gemma writes the score, the oscillator plays it (AI phase 6)
 * Real generation with its taste honestly labelled: a 1B model composing in a
 * constrained notation, validated token by token, synthesised locally. Without
 * a model the tab says so and offers nothing fake.
 */

import { i18n } from '../../services/i18n.js';
import { Utils } from '../../utils.js';
import { AiService } from '../../ai/AiService.js';
import { buildMelodyPrompt, parseMelody, type IMelodyNote } from '../../ai/melody.js';
import type { IAudioStudioTab } from './IAudioStudioTab.js';

export class MelodyTab implements IAudioStudioTab {
    private container: HTMLElement | null = null;
    private notes: IMelodyNote[] = [];
    private audioCtx: AudioContext | null = null;
    private composing: boolean = false;

    private boundCompose = () => { void this.handleCompose(); };
    private boundPlay = () => this.handlePlay();
    private boundStop = () => this.stopPlayback();

    public render(container: HTMLElement): void {
        this.container = container;
        this.setupLayout();
    }

    private aiReady(): boolean {
        return !!AiService.chatModel() && AiService.chatSupported();
    }

    private setupLayout(): void {
        if (!this.container) return;
        const ready = this.aiReady();
        this.container.innerHTML = `
            <div class="audiostudio-container" style="gap: 8px; padding: 10px;">
                <div style="font-size: 11px; color: #888;">
                    Gemma compone en notación restringida (nota:duración) y el sintetizador la toca —
                    generación real, on-device… y con el gusto musical de un modelo de 1B. Puede sonar raro; es parte del encanto.
                </div>
                <div style="display: flex; gap: 6px;">
                    <input class="hados-input" id="melody-mood" placeholder="Carácter: alegre, misteriosa, épica…" style="flex: 1; font-size: 11px;" ${ready ? '' : 'disabled'}>
                    <button class="hados-btn" id="melody-compose-btn" ${ready ? '' : 'disabled'}>🎼 Componer (IA local)</button>
                </div>
                ${ready ? '' : `<div style="font-size: 11px; color: #b58900;">🧠 Importa un modelo Gemma en Tavern Chat para componer.</div>`}
                <div id="melody-notation" style="font-family: monospace; font-size: 11px; border: 1px solid rgba(128,128,128,.4); border-radius: 4px; padding: 6px; min-height: 40px; white-space: pre-wrap;"></div>
                <div style="display: flex; gap: 6px;">
                    <button class="hados-btn" id="melody-play-btn" disabled>▶️ Tocar</button>
                    <button class="hados-btn" id="melody-stop-btn" disabled>⏹️ Parar</button>
                    <span id="melody-status" style="font-size: 11px; color: #888; align-self: center;"></span>
                </div>
            </div>
        `;

        const compose = this.container.querySelector('#melody-compose-btn');
        if (compose) Utils.eventManager.add(compose, 'click', this.boundCompose);
        const play = this.container.querySelector('#melody-play-btn');
        if (play) Utils.eventManager.add(play, 'click', this.boundPlay);
        const stop = this.container.querySelector('#melody-stop-btn');
        if (stop) Utils.eventManager.add(stop, 'click', this.boundStop);
    }

    private setStatus(text: string): void {
        const el = this.container?.querySelector('#melody-status') as HTMLElement | null;
        if (el) el.textContent = text;
    }

    private async handleCompose(): Promise<void> {
        if (this.composing || !this.aiReady()) return;
        this.composing = true;
        this.stopPlayback();

        const mood = (this.container?.querySelector('#melody-mood') as HTMLInputElement | null)?.value ?? '';
        const notation = this.container?.querySelector('#melody-notation') as HTMLElement | null;
        if (notation) notation.textContent = '🎼 Componiendo on-device…';
        this.setStatus('');

        try {
            const { persona, user } = buildMelodyPrompt(mood, i18n.getLang());
            let started = false;
            const raw = await AiService.chat('audiostudio', { persona, history: [{ role: 'user', text: user }] }, (delta) => {
                if (notation) {
                    if (!started) { notation.textContent = ''; started = true; }
                    notation.textContent += delta;
                }
            });

            this.notes = parseMelody(raw);
            if (notation) notation.textContent = raw.trim();
            if (this.notes.length === 0) {
                this.setStatus('La salida no contenía notación válida — inténtalo otra vez.');
            } else {
                this.setStatus(`${this.notes.length} notas válidas listas.`);
                const play = this.container?.querySelector('#melody-play-btn') as HTMLButtonElement | null;
                if (play) play.disabled = false;
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (notation) notation.textContent = `⚠️ IA local: ${msg}`;
        } finally {
            this.composing = false;
        }
    }

    /** A tiny scheduler: one oscillator+gain per note, triangle wave, soft envelope. */
    private handlePlay(): void {
        if (this.notes.length === 0) return;
        this.stopPlayback();

        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) { this.setStatus('Web Audio no disponible.'); return; }
        this.audioCtx = new Ctx();

        let t = this.audioCtx.currentTime + 0.05;
        for (const note of this.notes) {
            const dur = note.ms / 1000;
            if (note.freq > 0) {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = note.freq;
                gain.gain.setValueAtTime(0.0001, t);
                gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.9);
                osc.connect(gain).connect(this.audioCtx.destination);
                osc.start(t);
                osc.stop(t + dur);
            }
            t += dur;
        }

        const stopBtn = this.container?.querySelector('#melody-stop-btn') as HTMLButtonElement | null;
        if (stopBtn) stopBtn.disabled = false;
        this.setStatus('🔊 Tocando…');
        window.setTimeout(() => { if (this.audioCtx) this.setStatus(''); }, (t - this.audioCtx.currentTime) * 1000);
    }

    private stopPlayback(): void {
        if (this.audioCtx) {
            void this.audioCtx.close().catch(() => { /* already closed */ });
            this.audioCtx = null;
        }
        const stopBtn = this.container?.querySelector('#melody-stop-btn') as HTMLButtonElement | null;
        if (stopBtn) stopBtn.disabled = true;
    }

    public terminate(): void {
        this.stopPlayback();
        if (this.container) {
            const compose = this.container.querySelector('#melody-compose-btn');
            if (compose) Utils.eventManager.remove(compose, 'click', this.boundCompose);
            const play = this.container.querySelector('#melody-play-btn');
            if (play) Utils.eventManager.remove(play, 'click', this.boundPlay);
            const stop = this.container.querySelector('#melody-stop-btn');
            if (stop) Utils.eventManager.remove(stop, 'click', this.boundStop);
        }
    }
}
