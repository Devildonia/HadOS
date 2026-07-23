import { i18n } from '../../services/i18n.js';
import { Utils } from '../../utils.js';
import { VFS } from '../../core/VFS.js';
import { PermissionBroker } from '../../core/PermissionBroker.js';
import { AiService } from '../../ai/AiService.js';
import { decodeTo16kMono } from '../../ai/audioDecode.js';
import type { IAudioStudioTab } from './IAudioStudioTab.js';

/**
 * Dictation with TWO engines, each labelled with exactly what it does:
 *
 *  🔒 LOCAL (Whisper, default when available) — push-to-talk: record, then the
 *     asr-runtime transcribes on-device (`mic:record` + `ai:transcribe`).
 *     Since AI phase 5 this is the default, which makes HadOS fully
 *     zero-egress: no feature sends data anywhere.
 *
 *  ☁️ CLOUD (the browser's SpeechRecognition) — live interim results, but in
 *     Chrome the audio ships to Google's servers. Kept as the option for live
 *     dictation, behind the `speech:cloud` consent that says so (audit A1 —
 *     this used to be the ONLY engine, mislabelled as "[LiteRT] Whisper").
 */

export class DictationTab implements IAudioStudioTab {
    private container: HTMLElement | null = null;
    private recognition: any = null;
    private isRecording: boolean = false;
    private transcribedText: string = '';

    /** Which dictation engine is active. Local is the default when it can run. */
    private engine: 'local' | 'cloud' = 'cloud';
    private recorder: MediaRecorder | null = null;
    private micStream: MediaStream | null = null;
    private chunks: Blob[] = [];

    private boundToggleRecord = () => this.handleToggleRecord();
    private boundSaveNote = () => this.handleSaveNote();

    public render(container: HTMLElement): void {
        this.container = container;
        this.engine = this.localSupported() ? 'local' : 'cloud';
        this.ensureVfsDirectory();
        this.setupSpeechRecognition();
        this.setupLayout();
    }

    private localSupported(): boolean {
        return AiService.transcribeSupported()
            && typeof navigator !== 'undefined'
            && !!navigator.mediaDevices?.getUserMedia
            && typeof MediaRecorder !== 'undefined';
    }

    private ensureVfsDirectory(): void {
        try {
            VFS.mkdir('C:\\', 'HADOS');
        } catch {}
        try {
            VFS.mkdir('C:\\HADOS', 'NOTES');
        } catch {}
    }

    private setupSpeechRecognition(): void {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            Utils.Logger.warn("SpeechRecognition API not supported in this browser.");
            return;
        }

        try {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = i18n.getLang();

            this.recognition.onstart = () => {
                this.isRecording = true;
                this.updateUI();
                this.logMessage(`[Speech] Listening. Audio is processed by your browser's speech service.`);
            };

            this.recognition.onresult = (e: any) => {
                let interim = '';
                let final = '';

                for (let i = e.resultIndex; i < e.results.length; ++i) {
                    if (e.results[i].isFinal) {
                        final += e.results[i][0].transcript;
                    } else {
                        interim += e.results[i][0].transcript;
                    }
                }

                if (final) {
                    this.transcribedText += (this.transcribedText ? ' ' : '') + final;
                    // No invented "confidence/latency" figures: the API reports none.
                    this.logMessage(`[Speech] Phrase transcribed (${final.trim().split(/\s+/).length} words).`);
                }

                const textarea = this.container?.querySelector('#dictation-textarea') as HTMLTextAreaElement | null;
                if (textarea) {
                    textarea.value = this.transcribedText + (interim ? '\n[' + interim + ']' : '');
                    textarea.scrollTop = textarea.scrollHeight;
                }
            };

            this.recognition.onerror = (err: any) => {
                Utils.Logger.error("Speech recognition error:", err);
                this.logMessage(`[Speech] Error: ${err.error}. Check microphone permissions.`);
                this.handleStop();
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                this.updateUI();
                this.logMessage(`[Speech] Session stopped. Microphone released.`);
            };
        } catch (e) {
            Utils.Logger.error("Failed to initialize speech recognition:", e);
        }
    }

    private setupLayout(): void {
        if (!this.container) return;

        const startText = i18n.t('audiostudio.dictation_start') || 'Iniciar Grabación';
        const placeholderText = i18n.t('audiostudio.dictation_placeholder') || 'Tu transcripción de voz aparecerá aquí...';
        const saveText = i18n.t('audiostudio.save_note') || 'Guardar en Notas';

        this.container.innerHTML = `
            <div class="audiostudio-container">
                <!-- Dictator Input Area -->
                <div class="audiostudio-input-panel" style="flex: 1; display: flex; flex-direction: column;">
                    <textarea class="audiostudio-textarea" id="dictation-textarea" placeholder="${placeholderText}" style="flex: 1; height: 160px;"></textarea>
                    
                    <div class="audiostudio-controls">
                        <button class="hados-btn" id="dictation-record-btn">${startText}</button>
                        <button class="hados-btn" id="dictation-save-btn">${saveText}</button>
                        <select class="hados-select" id="dictation-engine" style="font-size: 10px;" title="Qué motor transcribe — y a dónde va (o no va) tu audio">
                            <option value="local" ${this.engine === 'local' ? 'selected' : ''} ${this.localSupported() ? '' : 'disabled'}>🔒 Whisper (local — nada sale del equipo)</option>
                            <option value="cloud" ${this.engine === 'cloud' ? 'selected' : ''}>☁️ Navegador (el audio puede salir a sus servidores)</option>
                        </select>
                    </div>
                </div>

                <!-- Equalizer / Mic Wave visualizer -->
                <div class="audiostudio-deck" id="dictation-deck" style="padding: 10px;">
                    <div class="audiostudio-visualizer" style="height: 25px; width: 100%;">
                        ${Array.from({ length: 16 }).map(() => `<div class="audiostudio-bar" style="background: #00ffcc;"></div>`).join('')}
                    </div>
                </div>

                <!-- Diagnostics Log Panel -->
                <div class="audiostudio-log" id="dictation-log" style="height: 100px;">
                    ${this.engine === 'local'
                        ? '[Whisper] On-device dictation: record, stop, and the transcript is generated on your machine. Nothing is sent anywhere.'
                        : '[Speech] Uses the browser\'s speech recognition — audio may be sent to the browser vendor\'s servers. You will be asked before the microphone starts.'}
                </div>
            </div>
        `;

        // Bind buttons
        const recordBtn = this.container.querySelector('#dictation-record-btn');
        if (recordBtn) Utils.eventManager.add(recordBtn, 'click', this.boundToggleRecord);

        const saveBtn = this.container.querySelector('#dictation-save-btn');
        if (saveBtn) Utils.eventManager.add(saveBtn, 'click', this.boundSaveNote);

        const engineSel = this.container.querySelector('#dictation-engine') as HTMLSelectElement | null;
        if (engineSel) Utils.eventManager.add(engineSel, 'change', () => {
            if (this.isRecording) this.handleStop();
            this.engine = engineSel.value === 'local' && this.localSupported() ? 'local' : 'cloud';
            this.logMessage(this.engine === 'local'
                ? '[Whisper] Switched to ON-DEVICE dictation — nothing leaves your machine.'
                : '[Speech] Switched to the browser engine — audio may be sent to its servers (you will be asked).');
        });
    }

    private logMessage(msg: string): void {
        const log = this.container?.querySelector('#dictation-log');
        if (log) {
            log.innerHTML += `<br>${msg}`;
            log.scrollTop = log.scrollHeight;
        }
    }

    private handleToggleRecord(): void {
        if (this.isRecording) {
            this.handleStop();
        } else if (this.engine === 'local') {
            void this.handleStartLocal();
        } else {
            void this.handleStart();
        }
    }

    /**
     * Push-to-talk over the on-device pipeline: record → decode → Whisper in
     * the asr-runtime process. No live interim results (Whisper works on the
     * finished clip) — the honest trade against the cloud engine's streaming.
     */
    private async handleStartLocal(): Promise<void> {
        if (!this.localSupported()) {
            this.logMessage(`[Whisper] On-device dictation is not available in this environment.`);
            return;
        }
        if (!(await PermissionBroker.check('audiostudio', 'mic:record'))) {
            this.logMessage(`[Whisper] Microphone permission denied — nothing was recorded.`);
            return;
        }
        try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
            this.logMessage(`[Whisper] The browser denied the microphone.`);
            return;
        }

        this.chunks = [];
        this.recorder = new MediaRecorder(this.micStream);
        this.recorder.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
        this.recorder.onstop = () => { void this.transcribeLocalClip(); };
        this.recorder.start();
        this.isRecording = true;
        this.updateUI();
        this.logMessage(`[Whisper] Recording… stop to transcribe on your device.`);
    }

    private async transcribeLocalClip(): Promise<void> {
        const blob = new Blob(this.chunks, { type: this.recorder?.mimeType || 'audio/webm' });
        this.recorder = null;
        this.chunks = [];
        if (blob.size < 1000) { this.logMessage(`[Whisper] Nothing recorded.`); return; }

        try {
            this.logMessage(`[Whisper] Transcribing on-device…`);
            const audio = await decodeTo16kMono(await blob.arrayBuffer());
            const result = await AiService.transcribe('audiostudio', audio, {}, (p) => {
                if (p.phase === 'download' && p.total > 0) {
                    this.logMessage(`[Whisper] Downloading the model… ${((p.loaded / p.total) * 100).toFixed(0)}% (first use only)`);
                }
            });
            const text = result.text.trim();
            if (!text) { this.logMessage(`[Whisper] The model heard no speech.`); return; }

            this.transcribedText += (this.transcribedText ? ' ' : '') + text;
            const textarea = this.container?.querySelector('#dictation-textarea') as HTMLTextAreaElement | null;
            if (textarea) {
                textarea.value = this.transcribedText;
                textarea.scrollTop = textarea.scrollHeight;
            }
            this.logMessage(`[Whisper] ${text.split(/\s+/).length} words transcribed — nothing left your machine.`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logMessage(`[Whisper] Transcription failed: ${msg}`);
        }
    }

    private async handleStart(): Promise<void> {
        if (!this.recognition) {
            // No fake transcription for unsupported browsers: say so and stop.
            this.logMessage(`[Speech] Speech recognition is not supported in this browser.`);
            return;
        }

        // Audio leaves the device with this API, so starting the microphone requires
        // the same explicit, remembered consent as any other sensitive capability.
        const allowed = await PermissionBroker.check('audiostudio', 'speech:cloud');
        if (!allowed) {
            this.logMessage(`[Speech] Permission denied — the microphone was not started.`);
            return;
        }

        try {
            this.recognition.lang = i18n.getLang();
            this.recognition.start();
        } catch (e) {
            // If already running
            this.recognition.stop();
        }
    }

    private handleStop(): void {
        if (this.engine === 'local' || this.recorder) {
            try { this.recorder?.stop(); } catch { /* already stopped */ }
            this.micStream?.getTracks().forEach(t => t.stop());
            this.micStream = null;
            this.isRecording = false;
            this.updateUI();
            return;
        }
        if (this.recognition) {
            this.recognition.stop();
        } else {
            this.isRecording = false;
            this.updateUI();
        }
    }

    private handleSaveNote(): void {
        const textarea = this.container?.querySelector('#dictation-textarea') as HTMLTextAreaElement | null;
        if (!textarea || !textarea.value.trim()) return;

        const text = textarea.value.trim();
        const timestamp = Date.now();
        try {
            VFS.writeFile('C:\\HADOS\\NOTES', `nota-${timestamp}.txt`, text);
            this.logMessage(`[VFS] Note saved to C:\\HADOS\\NOTES\\nota-${timestamp}.txt`);
        } catch (e) {
            Utils.Logger.error("Failed to save note to VFS:", e);
        }
    }

    private updateUI(): void {
        const recordBtn = this.container?.querySelector('#dictation-record-btn');
        if (recordBtn) {
            const startText = i18n.t('audiostudio.dictation_start') || 'Iniciar Grabación';
            const stopText = i18n.t('audiostudio.dictation_stop') || 'Detener';
            recordBtn.textContent = this.isRecording ? stopText : startText;
        }

        const deck = this.container?.querySelector('#dictation-deck');
        if (deck) {
            if (this.isRecording) {
                deck.classList.add('playing');
            } else {
                deck.classList.remove('playing');
            }
        }
    }

    public terminate(): void {
        this.handleStop();

        if (this.container) {
            const recordBtn = this.container.querySelector('#dictation-record-btn');
            if (recordBtn) Utils.eventManager.remove(recordBtn, 'click', this.boundToggleRecord);

            const saveBtn = this.container.querySelector('#dictation-save-btn');
            if (saveBtn) Utils.eventManager.remove(saveBtn, 'click', this.boundSaveNote);
        }
    }
}
