/**
 * HADA — the HadOS voice assistant (AI phase 4)
 * Push-to-talk, entirely on-device: microphone → Whisper (asr-runtime) →
 * Gemma (ai-runtime) → browser speech synthesis. Not one byte of audio or text
 * leaves the machine — which is the whole point, and the UI says so.
 *
 * Three engines meet here, each behind its own consent:
 *   mic:record      — capturing microphone audio (processed locally)
 *   ai:transcribe   — Whisper (~140 MB once)
 *   ai:chat         — the user-imported Gemma bundle
 * Missing pieces produce honest states, never pretending: no Gemma → a CTA to
 * import one in Tavern Chat; no mic permission → says exactly that.
 */

import { Kernel } from '../core/Kernel.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { PermissionBroker } from '../core/PermissionBroker.js';
import { AiService } from '../ai/AiService.js';
import { decodeTo16kMono } from '../ai/audioDecode.js';
import { buildIntentPrompt, parseIntent, type IAppOption } from '../ai/intents.js';
import type { IChatTurn } from '../ai/chatPrompt.js';

type VoiceState = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking';

export class HadOSVoiceAssistant implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;

    private state: VoiceState = 'idle';
    private recorder: MediaRecorder | null = null;
    private micStream: MediaStream | null = null;
    private chunks: Blob[] = [];
    /** Session conversation, in memory only — a voice session is ephemeral. */
    private turns: IChatTurn[] = [];
    private speakEnabled: boolean = true;
    private utterance: SpeechSynthesisUtterance | null = null;

    private boundMicClick = () => { void this.handleMicClick(); };

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.voiceassistant') || 'Hada';
        this.windowId = WindowFactory.create({
            title,
            width: 420,
            height: 480,
            resizable: true,
            icon: '🧚'
        });
        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;
        this.setupLayout();
    }

    private aiReady(): boolean {
        return !!AiService.chatModel() && AiService.chatSupported() && AiService.transcribeSupported();
    }

    /** The Kernel's live app registry — the ONLY things a voice intent can open. */
    private appOptions(): IAppOption[] {
        try {
            return Object.entries(Kernel.getRegistry().apps)
                .filter(([id]) => id !== 'voiceassistant') // Hada opening Hada helps nobody
                .map(([id, entry]) => ({ id, name: (entry as { metadata?: { name?: string } }).metadata?.name ?? id }));
        } catch {
            return [];
        }
    }

    private micSupported(): boolean {
        return typeof navigator !== 'undefined'
            && !!navigator.mediaDevices?.getUserMedia
            && typeof MediaRecorder !== 'undefined';
    }

    private setupLayout(): void {
        if (!this.container) return;
        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; gap: 8px; padding: 8px; box-sizing: border-box;">
                <div id="va-requirements" style="font-size: 11px;"></div>
                <div id="va-feed" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding: 4px;"></div>
                <div id="va-status" style="font-size: 11px; color: #888; min-height: 15px; text-align: center;"></div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <button class="hados-btn" id="va-mic-btn" style="font-size: 22px; padding: 10px 22px; border-radius: 50px;" title="Pulsa para hablar; pulsa otra vez para terminar">🎙️</button>
                    <label style="font-size: 11px; display: flex; align-items: center; gap: 4px; cursor: pointer;" title="Leer las respuestas en voz alta (síntesis del navegador, local)">
                        <input type="checkbox" id="va-speak-toggle" checked> 🔊
                    </label>
                </div>
            </div>
        `;

        const micBtn = this.container.querySelector('#va-mic-btn');
        if (micBtn) Utils.eventManager.add(micBtn, 'click', this.boundMicClick);

        const speakToggle = this.container.querySelector('#va-speak-toggle') as HTMLInputElement | null;
        if (speakToggle) Utils.eventManager.add(speakToggle, 'change', () => {
            this.speakEnabled = !!speakToggle.checked;
            if (!this.speakEnabled) this.stopSpeaking();
        });

        this.renderRequirements();
        this.addBubble('assistant',
            'Hola, soy Hada 🧚 — la voz de HadOS. Pulsa el micrófono y háblame: te transcribo con Whisper y te respondo con Gemma, todo en tu equipo. Nada sale de aquí. También puedo abrir apps por ti — prueba "abre Pinta".');
    }

    /** The honesty panel: which pieces are ready, which are missing and why. */
    private renderRequirements(): void {
        const el = this.container?.querySelector('#va-requirements') as HTMLElement | null;
        if (!el) return;
        const problems: string[] = [];
        if (!this.micSupported()) problems.push('🎙️ Este navegador no expone el micrófono (getUserMedia/MediaRecorder).');
        if (!AiService.chatModel()) problems.push('🧠 Falta el modelo Gemma — impórtalo en <b>Tavern Chat</b> para que pueda responder.');
        else if (!AiService.chatSupported()) problems.push('🧠 Hay modelo, pero este navegador no expone WebGPU.');
        if (!AiService.transcribeSupported()) problems.push('👂 Este entorno no puede ejecutar Whisper (WebAssembly/WebAudio).');

        el.innerHTML = problems.length
            ? `<div style="background: rgba(255,180,0,.12); border: 1px solid rgba(255,180,0,.4); border-radius: 6px; padding: 6px 8px;">${problems.join('<br>')}</div>`
            : '';
        const micBtn = this.container?.querySelector('#va-mic-btn') as HTMLButtonElement | null;
        if (micBtn) micBtn.disabled = problems.length > 0;
    }

    private setStatus(text: string): void {
        const el = this.container?.querySelector('#va-status') as HTMLElement | null;
        if (el) el.textContent = text;
    }

    private addBubble(who: 'user' | 'assistant', text: string): HTMLElement | null {
        const feed = this.container?.querySelector('#va-feed') as HTMLElement | null;
        if (!feed) return null;
        const div = document.createElement('div');
        div.style.cssText = who === 'user'
            ? 'align-self: flex-end; background: var(--accent-color, #0b5ed7); color: #fff; border-radius: 10px 10px 2px 10px; padding: 6px 10px; max-width: 85%; font-size: 12px;'
            : 'align-self: flex-start; background: rgba(128,128,128,.15); border-radius: 10px 10px 10px 2px; padding: 6px 10px; max-width: 85%; font-size: 12px;';
        div.textContent = text; // always textContent — transcripts and model output never touch innerHTML
        feed.appendChild(div);
        feed.scrollTop = feed.scrollHeight;
        return div;
    }

    private async handleMicClick(): Promise<void> {
        if (this.state === 'recording') { this.stopRecording(); return; }
        if (this.state !== 'idle' && this.state !== 'speaking') return; // busy transcribing/thinking
        this.stopSpeaking();
        await this.startRecording();
    }

    private async startRecording(): Promise<void> {
        if (!this.aiReady() || !this.micSupported()) { this.renderRequirements(); return; }

        // Our broker first (per-app, remembered), then the browser's own prompt.
        if (!(await PermissionBroker.check('voiceassistant', 'mic:record'))) {
            this.setStatus('Permiso de micrófono denegado — no se ha grabado nada.');
            return;
        }

        try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
            this.setStatus('El navegador ha denegado el micrófono.');
            return;
        }

        this.chunks = [];
        this.recorder = new MediaRecorder(this.micStream);
        this.recorder.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
        this.recorder.onstop = () => { void this.processRecording(); };
        this.recorder.start();

        this.state = 'recording';
        this.setStatus('Grabando… pulsa otra vez para terminar.');
        const micBtn = this.container?.querySelector('#va-mic-btn') as HTMLElement | null;
        if (micBtn) micBtn.textContent = '⏹️';
        if (window.playBlip) window.playBlip(800);
    }

    private stopRecording(): void {
        try { this.recorder?.stop(); } catch { /* already stopped */ }
        this.micStream?.getTracks().forEach(t => t.stop());
        this.micStream = null;
        const micBtn = this.container?.querySelector('#va-mic-btn') as HTMLElement | null;
        if (micBtn) micBtn.textContent = '🎙️';
    }

    private async processRecording(): Promise<void> {
        const blob = new Blob(this.chunks, { type: this.recorder?.mimeType || 'audio/webm' });
        this.recorder = null;
        this.chunks = [];
        if (blob.size < 1000) { this.state = 'idle'; this.setStatus('No he oído nada.'); return; }

        try {
            this.state = 'transcribing';
            this.setStatus('Transcribiendo con Whisper (en tu equipo)…');
            const audio = await decodeTo16kMono(await blob.arrayBuffer());
            const result = await AiService.transcribe('voiceassistant', audio, {}, (p) => {
                if (p.phase === 'download' && p.total > 0) {
                    this.setStatus(`Descargando Whisper… ${((p.loaded / p.total) * 100).toFixed(0)}% (solo la primera vez)`);
                } else if (p.phase === 'transcribe' && p.loaded === 0) {
                    this.setStatus('Transcribiendo con Whisper (en tu equipo)…');
                }
            });

            const heard = result.text.trim();
            if (!heard) { this.state = 'idle'; this.setStatus('No he entendido nada — ¿lo intentas de nuevo?'); return; }
            this.addBubble('user', heard);
            this.turns.push({ role: 'user', text: heard });

            this.state = 'thinking';
            this.setStatus('Pensando (Gemma, en tu equipo)…');
            const bubble = this.addBubble('assistant', '');

            // One call decides intent-or-conversation: the persona offers the
            // Kernel's app allowlist and a single strict JSON shape for "open X".
            const apps = this.appOptions();
            const persona = buildIntentPrompt(apps, i18n.getLang());
            const raw = (await AiService.chat('voiceassistant', { persona, history: this.turns }, (delta) => {
                if (bubble) {
                    bubble.textContent += delta;
                    const feed = this.container?.querySelector('#va-feed');
                    if (feed) feed.scrollTop = feed.scrollHeight;
                }
            })).trim();

            // Validation is the boundary: a malformed or out-of-list "intent"
            // can only ever become words, never an action.
            const { intent, speech } = parseIntent(raw, apps.map(a => a.id));
            let reply = speech;
            if (intent) {
                const appName = apps.find(a => a.id === intent.app)?.name ?? intent.app;
                const proc = Kernel.launch(intent.app);
                reply = proc
                    ? (speech || `Abriendo ${appName}.`)
                    : `No he podido abrir ${appName}.`;
            }
            if (bubble) bubble.textContent = reply;
            this.turns.push({ role: 'model', text: reply });

            this.speak(reply);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.setStatus(`⚠️ ${msg}`);
            this.state = 'idle';
            return;
        }
    }

    private speak(text: string): void {
        if (!this.speakEnabled || typeof speechSynthesis === 'undefined' || !text) {
            this.state = 'idle';
            this.setStatus('');
            return;
        }
        this.state = 'speaking';
        this.setStatus('🔊 Hablando… (síntesis local del navegador)');
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.lang = i18n.getLang() || 'es';
        this.utterance.onend = () => { this.state = 'idle'; this.setStatus(''); this.utterance = null; };
        this.utterance.onerror = () => { this.state = 'idle'; this.setStatus(''); this.utterance = null; };
        speechSynthesis.speak(this.utterance);
    }

    private stopSpeaking(): void {
        try { if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel(); } catch { /* ok */ }
        if (this.state === 'speaking') { this.state = 'idle'; this.setStatus(''); }
        this.utterance = null;
    }

    public terminate(): void {
        this.stopRecording();
        this.stopSpeaking();
        if (this.container) {
            const micBtn = this.container.querySelector('#va-mic-btn');
            if (micBtn) Utils.eventManager.remove(micBtn, 'click', this.boundMicClick);
        }
        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('voiceassistant', HadOSVoiceAssistant, {
    name: 'Hada',
    icon: '🧚',
    description: 'On-device voice assistant: Whisper hears, Gemma answers (and can open apps from the allowlist), the browser speaks — nothing leaves your machine.',
    singleton: true
});
