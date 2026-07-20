import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { VFS } from '../core/VFS.js';

export class HadOSAudioStudio implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;

    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private scriptQueue: { text: string; speaker: 'A' | 'B' }[] = [];
    private queueIndex: number = 0;
    private activeUtterance: SpeechSynthesisUtterance | null = null;

    private boundGenerate = () => this.handleGeneratePodcast();
    private boundPlay = () => this.handlePlay();
    private boundPause = () => this.handlePause();
    private boundStop = () => this.handleStop();

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.audiostudio') || 'Audio Studio';

        this.windowId = WindowFactory.create({
            title: title,
            width: 580,
            height: 480,
            resizable: true,
            icon: '🎙️'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.ensureVfsDirectory();
        this.setupLayout();
    }

    private ensureVfsDirectory(): void {
        try {
            VFS.mkdir('C:\\', 'HADOS');
        } catch {}
        try {
            VFS.mkdir('C:\\HADOS', 'PODCASTS');
        } catch {}
    }

    private setupLayout(): void {
        if (!this.container) return;

        const generateText = i18n.t('audiostudio.generate') || 'Generar Podcast';
        const placeholderText = i18n.t('audiostudio.url_placeholder') || 'Pega la URL o el texto aquí...';
        const styleText = i18n.t('audiostudio.style') || 'Estilo de Podcast';
        const narratorText = i18n.t('audiostudio.style_narrator') || 'Narrador Solitario';
        const debateText = i18n.t('audiostudio.style_debate') || 'Debate Tecnológico';

        this.container.innerHTML = `
            <div class="audiostudio-container">
                <!-- Inputs -->
                <div class="audiostudio-input-panel">
                    <textarea class="audiostudio-textarea" id="audiostudio-text-input" placeholder="${placeholderText}">Why Rust is replacing C++ in high-performance WebGL systems</textarea>
                    <div class="audiostudio-controls">
                        <div>
                            <label style="font-size: 11px; font-weight: bold; margin-right: 5px;">${styleText}:</label>
                            <select class="audiostudio-select hados-select" id="audiostudio-style-select">
                                <option value="narrator">${narratorText}</option>
                                <option value="debate">${debateText}</option>
                            </select>
                        </div>
                        <button class="hados-btn" id="audiostudio-gen-btn">${generateText}</button>
                    </div>
                </div>

                <!-- Cassette Deck -->
                <div class="audiostudio-deck" id="audiostudio-deck">
                    <!-- Cassette -->
                    <div class="audiostudio-cassette">
                        <div class="audiostudio-cassette-label">
                            <span style="font-size: 10px; letter-spacing: 1px;">HAD-OS TAPE</span>
                            <span id="audiostudio-label-title" style="font-size: 8px; opacity: 0.8; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Empty Tape</span>
                        </div>
                        <div class="audiostudio-reels">
                            <div class="audiostudio-reel">
                                <div class="audiostudio-reel-teeth"></div>
                            </div>
                            <div class="audiostudio-reel">
                                <div class="audiostudio-reel-teeth"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Equalizer -->
                    <div class="audiostudio-visualizer">
                        ${Array.from({ length: 16 }).map(() => `<div class="audiostudio-bar"></div>`).join('')}
                    </div>

                    <!-- Tape Buttons -->
                    <div class="audiostudio-buttons">
                        <button class="audiostudio-deck-btn" id="audiostudio-play-btn">▶ PLAY</button>
                        <button class="audiostudio-deck-btn" id="audiostudio-pause-btn">❚❚ PAUSE</button>
                        <button class="audiostudio-deck-btn" id="audiostudio-stop-btn">■ STOP</button>
                    </div>
                </div>

                <!-- Console Output -->
                <div class="audiostudio-log" id="audiostudio-log">
                    [System] Audio Studio initialized. Select style and click Generate to synthesize a podcast.
                </div>
            </div>
        `;

        // Bind buttons
        const genBtn = this.container.querySelector('#audiostudio-gen-btn');
        if (genBtn) Utils.eventManager.add(genBtn, 'click', this.boundGenerate);

        const playBtn = this.container.querySelector('#audiostudio-play-btn');
        if (playBtn) Utils.eventManager.add(playBtn, 'click', this.boundPlay);

        const pauseBtn = this.container.querySelector('#audiostudio-pause-btn');
        if (pauseBtn) Utils.eventManager.add(pauseBtn, 'click', this.boundPause);

        const stopBtn = this.container.querySelector('#audiostudio-stop-btn');
        if (stopBtn) Utils.eventManager.add(stopBtn, 'click', this.boundStop);
    }

    private logMessage(msg: string): void {
        const log = this.container?.querySelector('#audiostudio-log');
        if (log) {
            log.innerHTML += `<br>${msg}`;
            log.scrollTop = log.scrollHeight;
        }
    }

    private handleGeneratePodcast(): void {
        const input = this.container?.querySelector('#audiostudio-text-input') as HTMLInputElement | null;
        const styleSelect = this.container?.querySelector('#audiostudio-style-select') as HTMLSelectElement | null;
        if (!input || !input.value.trim() || !styleSelect) return;

        const rawText = input.value.trim();
        const style = styleSelect.value;

        // Cancel active playbacks
        this.handleStop();

        this.logMessage(`[HAD-OS RAG] Extracting content and synthesizing script...`);

        // Generate script dialog
        const labelTitle = this.container?.querySelector('#audiostudio-label-title');
        if (labelTitle) {
            labelTitle.textContent = rawText.length > 25 ? rawText.substring(0, 25) + '...' : rawText;
        }

        const script = this.generateScript(rawText, style);
        this.scriptQueue = script;
        this.queueIndex = 0;

        // Write script text to VFS
        const timestamp = Date.now();
        const scriptText = script.map(line => `Speaker ${line.speaker}: ${line.text}`).join('\n');
        try {
            VFS.writeFile('C:\\HADOS\\PODCASTS', `podcast-${timestamp}.txt`, scriptText);
            this.logMessage(`[VFS] Script saved to C:\\HADOS\\PODCASTS\\podcast-${timestamp}.txt`);
        } catch (e) {
            Utils.Logger.error("Failed to write podcast script to VFS:", e);
        }

        // Start playback
        this.handlePlay();
    }

    private generateScript(text: string, style: string): { text: string; speaker: 'A' | 'B' }[] {
        const lang = i18n.getLang();
        const isSpanish = lang === 'es';

        if (style === 'debate') {
            if (isSpanish) {
                return [
                    { speaker: 'A', text: '¡Bienvenidos a HadOS Audio Studio! Hoy debatiremos un tema fascinante.' },
                    { speaker: 'B', text: 'Así es. Analizaremos en profundidad la propuesta del usuario.' },
                    { speaker: 'A', text: `El tema de hoy es: "${text}". ¿Qué opinas al respecto?` },
                    { speaker: 'B', text: 'Creo que presenta desafíos lógicos interesantes, especialmente en sistemas distribuidos y optimización.' },
                    { speaker: 'A', text: 'Totalmente de acuerdo. Los hilos de ejecución deben sincronizarse correctamente para evitar bloqueos.' },
                    { speaker: 'B', text: '¡Excelente punto! Concluimos este debate por hoy. ¡Gracias por sintonizarnos!' }
                ];
            } else {
                return [
                    { speaker: 'A', text: 'Welcome to HadOS Audio Studio! Today we discuss a fascinating topic.' },
                    { speaker: 'B', text: 'Indeed. We are analyzing the user input in detail.' },
                    { speaker: 'A', text: `The subject is: "${text}". What are your thoughts on this?` },
                    { speaker: 'B', text: 'It presents interesting engineering tradeoffs, especially concerning browser WebAssembly overhead.' },
                    { speaker: 'A', text: 'I agree. Low latency allocation is critical for these pipelines.' },
                    { speaker: 'B', text: 'Exactly. That concludes our technical briefing. Thanks for listening!' }
                ];
            }
        } else {
            // Solo Narrator
            if (isSpanish) {
                return [
                    { speaker: 'A', text: `Iniciando lectura de artículo en HadOS. Título del texto: "${text}".` },
                    { speaker: 'A', text: 'El desarrollo tecnológico actual demuestra que la integración local de servicios simplifica el flujo operativo de los desarrolladores.' },
                    { speaker: 'A', text: 'Al procesar recursos directamente sobre hilos lógicos en el cliente, eliminamos tiempos de latencia y mantenemos la privacidad del usuario.' },
                    { speaker: 'A', text: 'Fin del boletín tecnológico.' }
                ];
            } else {
                return [
                    { speaker: 'A', text: `Initiating HadOS audio reading. Subject title: "${text}".` },
                    { speaker: 'A', text: 'Modern technical design emphasizes on-device processing to reduce server round-trips and optimize client runtime.' },
                    { speaker: 'A', text: 'By executing scripts directly on isolated client sandboxes, we ensure robust performance and security boundaries.' },
                    { speaker: 'A', text: 'This concludes the audio briefing.' }
                ];
            }
        }
    }

    private handlePlay(): void {
        if (this.scriptQueue.length === 0) {
            this.logMessage(`[Error] No podcast script generated. Type text and click Generate.`);
            return;
        }

        if (this.isPaused) {
            window.speechSynthesis.resume();
            this.isPaused = false;
            this.isPlaying = true;
            this.updateDeckUI(true);
            return;
        }

        if (this.isPlaying) return;

        this.isPlaying = true;
        this.updateDeckUI(true);
        this.logMessage(`[Audio Studio] Playback started.`);
        this.speakNext();
    }

    private speakNext(): void {
        if (this.queueIndex >= this.scriptQueue.length) {
            this.handleStop();
            this.logMessage(`[Audio Studio] Playback completed.`);
            return;
        }

        const line = this.scriptQueue[this.queueIndex];
        if (!line) return;
        
        const lang = i18n.getLang();
        
        const utterance = new SpeechSynthesisUtterance(line.text);
        utterance.lang = lang;

        // Choose voices for debate
        const voices = window.speechSynthesis.getVoices();
        const langVoices = voices.filter(v => v.lang.startsWith(lang));

        if (langVoices.length > 0) {
            if (line.speaker === 'B' && langVoices.length > 1) {
                // Alternating voice
                utterance.voice = langVoices[1] || null;
            } else {
                utterance.voice = langVoices[0] || null;
            }
        }

        utterance.onend = () => {
            this.activeUtterance = null;
            this.queueIndex++;
            this.speakNext();
        };

        utterance.onerror = (e) => {
            Utils.Logger.error("SpeechSynthesis error:", e);
            this.handleStop();
        };

        this.activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
    }

    private handlePause(): void {
        if (!this.isPlaying || this.isPaused) return;

        window.speechSynthesis.pause();
        this.isPaused = true;
        this.isPlaying = false;
        this.updateDeckUI(false);
        this.logMessage(`[Audio Studio] Playback paused.`);
    }

    private handleStop(): void {
        window.speechSynthesis.cancel();
        this.activeUtterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.queueIndex = 0;
        this.updateDeckUI(false);
    }

    private updateDeckUI(playing: boolean): void {
        const deck = this.container?.querySelector('#audiostudio-deck');
        if (deck) {
            if (playing) {
                deck.classList.add('playing');
            } else {
                deck.classList.remove('playing');
            }
        }

        // Highlight active buttons
        const playBtn = this.container?.querySelector('#audiostudio-play-btn');
        const pauseBtn = this.container?.querySelector('#audiostudio-pause-btn');
        if (playBtn && pauseBtn) {
            if (playing) {
                playBtn.classList.add('active');
                pauseBtn.classList.remove('active');
            } else if (this.isPaused) {
                playBtn.classList.remove('active');
                pauseBtn.classList.add('active');
            } else {
                playBtn.classList.remove('active');
                pauseBtn.classList.remove('active');
            }
        }
    }

    public terminate(): void {
        this.handleStop();

        if (this.container) {
            const genBtn = this.container.querySelector('#audiostudio-gen-btn');
            if (genBtn) Utils.eventManager.remove(genBtn, 'click', this.boundGenerate);

            const playBtn = this.container.querySelector('#audiostudio-play-btn');
            if (playBtn) Utils.eventManager.remove(playBtn, 'click', this.boundPlay);

            const pauseBtn = this.container.querySelector('#audiostudio-pause-btn');
            if (pauseBtn) Utils.eventManager.remove(pauseBtn, 'click', this.boundPause);

            const stopBtn = this.container.querySelector('#audiostudio-stop-btn');
            if (stopBtn) Utils.eventManager.remove(stopBtn, 'click', this.boundStop);
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('audiostudio', HadOSAudioStudio, {
    name: 'Audio Studio',
    icon: '🎙️',
    description: 'AI-generated conversational audio briefings and podcasts.',
    singleton: true
});
