import { i18n } from '../../services/i18n.js';
import { Utils } from '../../utils.js';
import { VFS } from '../../core/VFS.js';
import { PermissionBroker } from '../../core/PermissionBroker.js';
import type { IAudioStudioTab } from './IAudioStudioTab.js';

/**
 * Dictation over the browser's SpeechRecognition API.
 *
 * HONESTY NOTE (audit A1): this is NOT on-device inference. In Chrome this API
 * ships the microphone audio to Google's servers for transcription. The tab used
 * to log "[LiteRT] Whisper weights initialized" over it, which was false on every
 * word — no LiteRT, no Whisper, and the audio left the machine. It now says what
 * it is, and starting the microphone is gated behind an explicit, remembered
 * consent (`speech:cloud`) through the PermissionBroker, the same path every
 * other sensitive capability takes.
 */

export class DictationTab implements IAudioStudioTab {
    private container: HTMLElement | null = null;
    private recognition: any = null;
    private isRecording: boolean = false;
    private transcribedText: string = '';

    private boundToggleRecord = () => this.handleToggleRecord();
    private boundSaveNote = () => this.handleSaveNote();

    public render(container: HTMLElement): void {
        this.container = container;
        this.ensureVfsDirectory();
        this.setupSpeechRecognition();
        this.setupLayout();
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
                    [Speech] Uses the browser's speech recognition — audio may be sent to the browser vendor's servers. You will be asked before the microphone starts.
                </div>
            </div>
        `;

        // Bind buttons
        const recordBtn = this.container.querySelector('#dictation-record-btn');
        if (recordBtn) Utils.eventManager.add(recordBtn, 'click', this.boundToggleRecord);

        const saveBtn = this.container.querySelector('#dictation-save-btn');
        if (saveBtn) Utils.eventManager.add(saveBtn, 'click', this.boundSaveNote);
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
        } else {
            void this.handleStart();
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
