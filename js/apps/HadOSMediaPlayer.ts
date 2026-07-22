import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { VFS } from '../core/VFS.js';

interface TranscriptLine {
    time: number; // in seconds
    text: string;
}

export class HadOSMediaPlayer implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;

    private activeTab: 'transcript' | 'chat' | 'logs' = 'transcript';
    private playerType: 'local' | 'youtube' | 'idle' = 'idle';

    // Local Video/Audio HTML Elements
    private mediaElement: HTMLVideoElement | null = null;

    // YouTube embed control. The embed is driven directly via postMessage
    // (enablejsapi=1 widget protocol) so no external iframe_api script is
    // injected and the CSP script-src stays 'self' (audit A3).
    private ytPlayer: { seekTo: (sec: number, allowSeekAhead: boolean) => void; getCurrentTime: () => number; destroy: () => void } | null = null;
    private ytPlayerId: string = '';
    private ytFrame: HTMLIFrameElement | null = null;
    private ytCurrentTime: number = 0;
    private static readonly YT_EMBED_ORIGIN = 'https://www.youtube-nocookie.com';

    // Object URL of the currently loaded local file — revoked on cleanup (audit A5).
    private localObjectUrl: string | null = null;

    private transcript: TranscriptLine[] = [];
    private activeLineIndex: number = -1;
    private timeUpdateInterval: any = null;

    // Grounded RAG Chat
    private ragLogs: string[] = [];

    // Bound handlers
    private boundLoadYoutube = () => this.handleLoadYoutube();
    private boundOpenLocal = () => this.handleOpenLocal();
    private boundSendChat = () => this.handleSendChat();
    private boundChatKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') this.handleSendChat();
    };
    private boundYtMessage = (e: MessageEvent) => this.handleYtMessage(e);

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.mediaplayer') || 'Media Player';

        this.windowId = WindowFactory.create({
            title: title,
            width: 780,
            height: 520,
            resizable: true,
            icon: '🎬'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.ytPlayerId = `yt-player-${this.windowId}`;

        this.setupLayout();
        this.loadVfsMediaList();
    }

    private setupLayout(): void {
        if (!this.container) return;

        const openVfsText = i18n.t('mediaplayer.open_vfs') || 'Abrir Archivo Local';
        const loadYtText = i18n.t('mediaplayer.load_yt') || 'Cargar YouTube';
        const tabPlayerText = i18n.t('mediaplayer.tab_player') || 'Reproductor';
        const tabTranscriptText = i18n.t('mediaplayer.tab_transcript') || 'Transcripción';
        const tabChatText = i18n.t('mediaplayer.tab_chat') || 'Chat RAG';

        this.container.innerHTML = `
            <div class="mediaplayer-layout">
                <!-- Left Column: Video/Audio Screen + Controls -->
                <div class="mediaplayer-left">
                    <div class="mediaplayer-stage" id="mediaplayer-stage-div">
                        <div class="mediaplayer-stage-placeholder">
                            <span style="font-size: 48px;">🎬</span>
                            <span>Load a local VFS file or paste a YouTube URL below</span>
                        </div>
                    </div>

                    <!-- Controls & Inputs -->
                    <div class="mediaplayer-controls">
                        <!-- VFS local selection -->
                        <div class="mediaplayer-controls-row">
                            <select class="hados-select" id="mediaplayer-vfs-select" style="flex: 1; font-size: 11px;">
                                <option value="">-- Select Local Media --</option>
                            </select>
                            <button class="hados-btn" id="mediaplayer-vfs-btn">${openVfsText}</button>
                        </div>
                        <!-- YouTube URL -->
                        <div class="mediaplayer-controls-row">
                            <input type="text" class="hados-input" id="mediaplayer-yt-input" placeholder="Paste YouTube URL (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)" style="flex: 1; font-size: 11px;">
                            <button class="hados-btn" id="mediaplayer-yt-btn">${loadYtText}</button>
                        </div>
                    </div>
                </div>

                <!-- Right Column: RAG Sidebar -->
                <div class="mediaplayer-right">
                    <!-- Tab Headers -->
                    <div class="mediaplayer-tabs">
                        <button class="mediaplayer-tab-btn active" id="mp-tab-transcript">${tabTranscriptText}</button>
                        <button class="mediaplayer-tab-btn" id="mp-tab-chat">${tabChatText}</button>
                        <button class="mediaplayer-tab-btn" id="mp-tab-logs">Logs</button>
                    </div>

                    <!-- Dynamic Content Panel -->
                    <div id="mediaplayer-right-panel" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #fff;">
                        <!-- Transcript View -->
                        <div class="mediaplayer-transcript-view" id="mp-transcript-container">
                            <div style="color: #999; font-size: 11px; padding: 10px; text-align: center;">
                                No transcript loaded. Load a smart YouTube video to sync transcripts.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind events
        const vfsBtn = this.container.querySelector('#mediaplayer-vfs-btn');
        if (vfsBtn) Utils.eventManager.add(vfsBtn, 'click', this.boundOpenLocal);

        const ytBtn = this.container.querySelector('#mediaplayer-yt-btn');
        if (ytBtn) Utils.eventManager.add(ytBtn, 'click', this.boundLoadYoutube);

        // Bind tabs
        const tabT = this.container.querySelector('#mp-tab-transcript');
        if (tabT) Utils.eventManager.add(tabT, 'click', () => this.switchTab('transcript'));

        const tabC = this.container.querySelector('#mp-tab-chat');
        if (tabC) Utils.eventManager.add(tabC, 'click', () => this.switchTab('chat'));

        const tabL = this.container.querySelector('#mp-tab-logs');
        if (tabL) Utils.eventManager.add(tabL, 'click', () => this.switchTab('logs'));
    }

    private loadVfsMediaList(): void {
        const select = this.container?.querySelector('#mediaplayer-vfs-select') as HTMLSelectElement | null;
        if (!select) return;

        select.innerHTML = `<option value="">-- Select Local Media --</option>`;

        // VFS file names are user/app-authored — escaped before touching innerHTML
        // (audit A2), in the value attribute as well as the label.
        try {
            const files = (VFS.listDir('C:\\HADOS\\PODCASTS') || []).filter(f => f.endsWith('.mp3') || f.endsWith('.wav') || f.endsWith('.mp4'));
            files.forEach(f => {
                const safe = Utils.escapeHTML(f);
                select.insertAdjacentHTML('beforeend', `<option value="C:\\HADOS\\PODCASTS\\${safe}">[Podcast] ${safe}</option>`);
            });
        } catch {}

        // List generic assets
        try {
            const files = (VFS.listDir('C:\\') || []).filter(f => f.endsWith('.mp3') || f.endsWith('.wav') || f.endsWith('.mp4'));
            files.forEach(f => {
                const safe = Utils.escapeHTML(f);
                select.insertAdjacentHTML('beforeend', `<option value="C:\\${safe}">C:\\${safe}</option>`);
            });
        } catch {}
    }

    /**
     * Receives infoDelivery updates from the YouTube embed (widget postMessage
     * protocol) and keeps the last known currentTime for transcript sync.
     * Messages are only accepted from the embed origin and our own iframe.
     */
    private handleYtMessage(e: MessageEvent): void {
        if (e.origin !== HadOSMediaPlayer.YT_EMBED_ORIGIN) return;
        if (!this.ytFrame || e.source !== this.ytFrame.contentWindow) return;
        let data: any = null;
        try {
            data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        } catch {
            return;
        }
        if (data && data.event === 'infoDelivery' && data.info && typeof data.info.currentTime === 'number') {
            this.ytCurrentTime = data.info.currentTime;
        }
    }

    /** Sends a widget-protocol command (play, seekTo, ...) to the embed iframe. */
    private postYtCommand(func: string, args: unknown[] = []): void {
        this.ytFrame?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func, args, id: this.ytPlayerId, channel: 'widget' }),
            HadOSMediaPlayer.YT_EMBED_ORIGIN
        );
    }

    private handleOpenLocal(): void {
        const picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = 'video/*,audio/*';
        picker.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                this.cleanupPlayback();
                this.playerType = 'local';

                const stage = this.container?.querySelector('#mediaplayer-stage-div');
                if (!stage) return;

                this.mediaElement = document.createElement('video');
                this.mediaElement.controls = true;
                // Create secure local object URL to bypass browser file:// CORS/security blocks.
                // Tracked so cleanupPlayback() can revoke it and free the memory (audit A5).
                try {
                    this.localObjectUrl = URL.createObjectURL(file);
                    this.mediaElement.src = this.localObjectUrl;
                } catch {
                    // Fallback for environment constraints (stub/jsdom)
                    this.mediaElement.src = 'mock-blob-url';
                }
                this.mediaElement.style.width = '100%';
                this.mediaElement.style.height = '100%';

                stage.innerHTML = '';
                stage.appendChild(this.mediaElement);

                const playPromise = this.mediaElement.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(err => {
                        Utils.Logger.info("Local playback started:", err);
                    });
                } else {
                    Utils.Logger.info("Local playback started:", file.name);
                }

                // Reset transcripts for arbitrary files
                this.transcript = [];
                this.renderTranscript();
                this.logRag(`[Local Player] Loaded file: ${file.name}`);
            }
        };
        picker.click();
    }

    private handleLoadYoutube(): void {
        const input = this.container?.querySelector('#mediaplayer-yt-input') as HTMLInputElement | null;
        if (!input || !input.value.trim()) return;

        const url = input.value.trim();
        const videoId = this.extractYoutubeId(url);

        if (!videoId) {
            alert("Invalid YouTube URL. Please paste a valid watch or share link.");
            return;
        }

        this.cleanupPlayback();
        this.playerType = 'youtube';

        const stage = this.container?.querySelector('#mediaplayer-stage-div');
        if (!stage) return;

        // Plain enablejsapi embed controlled via postMessage — no external
        // iframe_api script, so the CSP script-src stays 'self' (audit A3).
        const frame = document.createElement('iframe');
        frame.id = this.ytPlayerId;
        frame.src = `${HadOSMediaPlayer.YT_EMBED_ORIGIN}/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
        frame.allow = 'autoplay; encrypted-media; picture-in-picture';
        frame.style.cssText = 'width: 100%; height: 100%; border: 0;';
        stage.innerHTML = '';
        stage.appendChild(frame);
        this.ytFrame = frame;
        this.ytCurrentTime = 0;

        window.addEventListener('message', this.boundYtMessage);
        frame.addEventListener('load', () => {
            // Subscribe to infoDelivery updates (currentTime) from the embed.
            frame.contentWindow?.postMessage(
                JSON.stringify({ event: 'listening', id: this.ytPlayerId, channel: 'widget' }),
                HadOSMediaPlayer.YT_EMBED_ORIGIN
            );
            this.logRag(`[YouTube] Embed loaded for video ID: ${videoId} (postMessage control, no external script).`);
        });

        this.ytPlayer = {
            seekTo: (sec: number, allowSeekAhead: boolean) => this.postYtCommand('seekTo', [sec, allowSeekAhead]),
            getCurrentTime: () => this.ytCurrentTime,
            destroy: () => {
                window.removeEventListener('message', this.boundYtMessage);
                this.ytFrame = null;
            }
        };
        this.startTimerSync();
        this.loadVideoTranscript(videoId);
    }

    private extractYoutubeId(url: string): string | null {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        // Strict 11-char [A-Za-z0-9_-] check: the ID is interpolated into the
        // embed iframe src, so anything else is rejected (audit A6 spirit).
        return (match && match[2] && /^[\w-]{11}$/.test(match[2])) ? match[2] : null;
    }

    private async loadVideoTranscript(videoId: string): Promise<void> {
        // Honest label (audit A4): there is no Whisper and no downloaded transcript.
        // What follows fetches the video TITLE and fabricates demo lines from its
        // keywords — the UI must say so, or the user believes they are reading the
        // video's real captions.
        this.logRag(`[Demo] Building a SIMULATED transcript from the video title (not real captions)...`);

        let title = "Video Presentation";
        try {
            // Fetch video title via CORS-friendly oEmbed
            const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.title) {
                    title = data.title;
                }
            }
        } catch (e) {
            Utils.Logger.warn("Failed to fetch video title for transcript generation:", e);
        }

        // The title is REMOTE (noembed) and the RAG log renders via innerHTML —
        // escape it here or a crafted video title executes in the log panel.
        this.logRag(`Video title fetched: "${Utils.escapeHTML(title)}"`);

        // Generate dynamic transcript based on title content
        this.transcript = this.generateDynamicTranscript(title, videoId);

        this.logRag(`[Demo] ${this.transcript.length} simulated lines generated from the title.`, 'success');
        this.renderTranscript();
    }

    private generateDynamicTranscript(title: string, videoId: string): TranscriptLine[] {
        const titleLower = title.toLowerCase();
        const lang = i18n.getLang();
        const isSpanish = lang === 'es';

        // Check if it's the rickroll
        if (videoId === 'dQw4w9WgXcQ') {
            return [
                { time: 0, text: "[Music] Never gonna give you up" },
                { time: 5, text: "[Music] Never gonna let you down" },
                { time: 10, text: "[Music] Never gonna run around and desert you" },
                { time: 18, text: "[Music] Never gonna make you cry" },
                { time: 24, text: "[Music] Never gonna say goodbye" },
                { time: 30, text: "[Music] Never gonna tell a lie and hurt you" }
            ];
        }

        // Check topic
        const isFootball = titleLower.includes('futbol') || titleLower.includes('fútbol') || titleLower.includes('davo') || titleLower.includes('mundial') || titleLower.includes('argentina') || titleLower.includes('españa') || titleLower.includes('copa') || titleLower.includes('fc ');
        const isTech = titleLower.includes('code') || titleLower.includes('programming') || titleLower.includes('tech') || titleLower.includes('rust') || titleLower.includes('wasm') || titleLower.includes('js') || titleLower.includes('developer');

        if (isFootball) {
            if (isSpanish) {
                return [
                    { time: 0, text: `Comenzamos el análisis sobre: "${title}"` },
                    { time: 8, text: "Para mí España viene jugando con una intensidad táctica tremenda." },
                    { time: 16, text: "Pero ojo, que Argentina tiene la experiencia y la chapa de campeón." },
                    { time: 24, text: "El planteo defensivo y la presión alta en el mediocampo son la clave de este partido." },
                    { time: 32, text: "Mucha gente debate si realmente son candidatos firmes para el Mundial 2026." },
                    { time: 42, text: "Terminamos con las reflexiones finales de este gran debate de fútbol." }
                ];
            } else {
                return [
                    { time: 0, text: `Starting the match analysis: "${title}"` },
                    { time: 8, text: "Spain has been playing with incredible tactical intensity." },
                    { time: 16, text: "But look out, Argentina has the championship experience." },
                    { time: 24, text: "The defensive scheme and high pressure in midfield are key in this match." },
                    { time: 32, text: "Many are debating if they are true contenders for World Cup 2026." },
                    { time: 42, text: "That concludes our quick football debate review." }
                ];
            }
        } else if (isTech) {
            if (isSpanish) {
                return [
                    { time: 0, text: `Iniciamos la presentación técnica de: "${title}"` },
                    { time: 6, text: "Hoy hablaremos sobre optimización del compilador y WebAssembly." },
                    { time: 12, text: "El uso de LiteRT en local permite optimizar la asignación de memoria." },
                    { time: 20, text: "Esto reduce el overhead del hilo de ejecución en el navegador." },
                    { time: 28, text: "Veamos el benchmark comparativo frente a APIs de la nube." },
                    { time: 36, text: "Eso concluye el bloque de optimización técnica." }
                ];
            } else {
                return [
                    { time: 0, text: `Starting technical presentation: "${title}"` },
                    { time: 6, text: "Today we talk about compiler optimization and WebAssembly." },
                    { time: 12, text: "Using on-device LiteRT reduces memory allocation overhead." },
                    { time: 20, text: "This optimizes execution threads in browser contexts." },
                    { time: 28, text: "Let's review the benchmark graphs comparing edge models." },
                    { time: 36, text: "That concludes the technical optimization segment." }
                ];
            }
        } else {
            // General fallback using title segments
            const words = title.split(' ').filter(w => w.length > 3);
            const keyPhrase = words.slice(0, 3).join(' ');
            if (isSpanish) {
                return [
                    { time: 0, text: `Bienvenidos a la reproducción de: "${title}"` },
                    { time: 7, text: `Analizaremos en profundidad los detalles de ${keyPhrase || 'este tema'}.` },
                    { time: 15, text: "El debate principal gira en torno al impacto y alcance de este contenido." },
                    { time: 22, text: "Muchos expertos señalan que la consistencia lógica es el factor clave." },
                    { time: 30, text: "Agradecemos a todos por sintonizar este análisis en directo." }
                ];
            } else {
                return [
                    { time: 0, text: `Welcome to the playback of: "${title}"` },
                    { time: 7, text: `We are analyzing in detail the concepts of ${keyPhrase || 'this topic'}.` },
                    { time: 15, text: "The main discussion focuses on the impact and scope of the release." },
                    { time: 22, text: "Many experts highlight that logical consistency is the key factor." },
                    { time: 30, text: "Thank you for watching this live analysis." }
                ];
            }
        }
    }

    private renderTranscript(): void {
        const container = this.container?.querySelector('#mp-transcript-container');
        if (!container) return;

        if (this.transcript.length === 0) {
            container.innerHTML = `
                <div style="color: #999; font-size: 11px; padding: 10px; text-align: center;">
                    No transcript loaded. Load a YouTube video to sync RAG transcripts.
                </div>
            `;
            return;
        }

        container.innerHTML = this.transcript.map((line, idx) => {
            const minutes = Math.floor(line.time / 60);
            const seconds = Math.floor(line.time % 60).toString().padStart(2, '0');
            const timeStr = `${minutes}:${seconds}`;

            return `
                <div class="mediaplayer-transcript-line" id="mp-line-${idx}" data-time="${Number(line.time) || 0}">
                    <span class="mediaplayer-timestamp">${timeStr}</span>
                    <span>${Utils.escapeHTML(line.text)}</span>
                </div>
            `;
        }).join('');

        // Bind clicks to lines
        this.transcript.forEach((line, idx) => {
            const lineEl = container.querySelector(`#mp-line-${idx}`);
            if (lineEl) {
                Utils.eventManager.add(lineEl, 'click', () => this.seekToTime(line.time));
            }
        });
    }

    private seekToTime(seconds: number): void {
        if (this.playerType === 'youtube' && this.ytPlayer) {
            try {
                this.ytPlayer.seekTo(seconds, true);
                this.logRag(`[YouTube] Seeked to: ${seconds} seconds.`);
            } catch {}
        } else if (this.playerType === 'local' && this.mediaElement) {
            this.mediaElement.currentTime = seconds;
        }
    }

    private startTimerSync(): void {
        this.stopTimerSync();
        this.timeUpdateInterval = setInterval(() => {
            let currentTime = 0;
            if (this.playerType === 'youtube' && this.ytPlayer) {
                try {
                    currentTime = this.ytPlayer.getCurrentTime();
                } catch {}
            } else if (this.playerType === 'local' && this.mediaElement) {
                currentTime = this.mediaElement.currentTime;
            }

            this.syncTranscriptHighlight(currentTime);
        }, 500);
    }

    private stopTimerSync(): void {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
    }

    private syncTranscriptHighlight(time: number): void {
        if (this.transcript.length === 0) return;

        // Find the line that corresponds to the current time
        let matchingIndex = -1;
        for (let i = 0; i < this.transcript.length; i++) {
            if (time >= this.transcript[i]!.time) {
                matchingIndex = i;
            } else {
                break;
            }
        }

        if (matchingIndex !== this.activeLineIndex && matchingIndex !== -1) {
            const container = this.container?.querySelector('#mp-transcript-container');
            if (!container) return;

            // Remove active class from previous
            if (this.activeLineIndex !== -1) {
                const prev = container.querySelector(`#mp-line-${this.activeLineIndex}`);
                if (prev) prev.classList.remove('active');
            }

            // Add active class to new
            const activeEl = container.querySelector(`#mp-line-${matchingIndex}`) as HTMLElement | null;
            if (activeEl) {
                activeEl.classList.add('active');
                // Scroll into view
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            this.activeLineIndex = matchingIndex;
        }
    }

    private switchTab(tabId: 'transcript' | 'chat' | 'logs'): void {
        this.activeTab = tabId;

        // Toggle Tab button styling
        const btnT = this.container?.querySelector('#mp-tab-transcript');
        const btnC = this.container?.querySelector('#mp-tab-chat');
        const btnL = this.container?.querySelector('#mp-tab-logs');
        if (btnT && btnC && btnL) {
            btnT.classList.remove('active');
            btnC.classList.remove('active');
            btnL.classList.remove('active');

            if (tabId === 'transcript') btnT.classList.add('active');
            else if (tabId === 'chat') btnC.classList.add('active');
            else btnL.classList.add('active');
        }

        const panel = this.container?.querySelector('#mediaplayer-right-panel');
        if (!panel) return;

        panel.innerHTML = '';

        if (tabId === 'transcript') {
            panel.innerHTML = `<div class="mediaplayer-transcript-view" id="mp-transcript-container"></div>`;
            this.renderTranscript();
        } else if (tabId === 'chat') {
            panel.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <div class="docexplorer-chat-feed" id="mp-chat-feed" style="flex: 1; overflow-y: auto; padding: 10px;">
                        <div class="docexplorer-chat-bubble ai">
                            Ask about the demo transcript — I jump to the line that best matches your words. Local keyword search; the transcript is simulated and no AI model runs.
                        </div>
                    </div>
                    <div class="docexplorer-chat-input-bar">
                        <input type="text" class="docexplorer-input" id="mp-chat-input" placeholder="Ask e.g. speeds or cosine...">
                        <button class="hados-btn" id="mp-chat-send-btn" style="padding: 2px 10px;">Ask</button>
                    </div>
                </div>
            `;

            const sendBtn = panel.querySelector('#mp-chat-send-btn');
            if (sendBtn) Utils.eventManager.add(sendBtn, 'click', this.boundSendChat);

            const input = panel.querySelector('#mp-chat-input');
            if (input) Utils.eventManager.add(input, 'keydown', this.boundChatKeydown as EventListener);
        } else {
            panel.innerHTML = `
                <div class="docexplorer-console" id="mp-logs-container" style="flex: 1; border: none; border-radius: 0;">
                    ${this.ragLogs.join('<br>')}
                </div>
            `;
        }
    }

    private logRag(msg: string, type: 'info' | 'success' = 'info'): void {
        const prefix = type === 'success' ? '[OK] ' : '';
        const logLine = `${prefix}${msg}`;
        this.ragLogs.push(logLine);

        if (this.activeTab === 'logs') {
            const consoleEl = this.container?.querySelector('#mp-logs-container');
            if (consoleEl) {
                consoleEl.innerHTML = this.ragLogs.join('<br>');
                consoleEl.scrollTop = consoleEl.scrollHeight;
            }
        }
    }

    private handleSendChat(): void {
        const input = this.container?.querySelector('#mp-chat-input') as HTMLInputElement | null;
        if (!input || !input.value.trim() || this.transcript.length === 0) return;

        const query = input.value.trim();
        input.value = '';

        const feed = this.container?.querySelector('#mp-chat-feed');
        if (!feed) return;

        // User input, back through innerHTML — escaped (audit A2).
        feed.insertAdjacentHTML('beforeend', `<div class="docexplorer-chat-bubble user">${Utils.escapeHTML(query)}</div>`);
        feed.scrollTop = feed.scrollHeight;

        this.logRag(`[Search] Matching query words against the demo transcript: "${Utils.escapeHTML(query)}"`);

        // Find best match matching words
        let bestIndex = 0;
        let highestMatches = -1;

        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        this.transcript.forEach((line, idx) => {
            let matches = 0;
            const textLower = line.text.toLowerCase();
            queryWords.forEach(w => {
                if (textLower.includes(w)) matches++;
            });
            if (matches > highestMatches) {
                highestMatches = matches;
                bestIndex = idx;
            }
        });

        const bestLine = this.transcript[bestIndex]!;

        setTimeout(() => {
            const minutes = Math.floor(bestLine.time / 60);
            const seconds = Math.floor(bestLine.time % 60).toString().padStart(2, '0');
            const timeStr = `${minutes}:${seconds}`;

            // insertAdjacentHTML, not `innerHTML +=`: re-parsing the feed destroyed
            // the click listeners of every earlier citation (audit A7). The line text
            // descends from the REMOTE video title, so it is escaped (audit A2).
            feed.insertAdjacentHTML('beforeend', `
                <div class="docexplorer-chat-bubble ai">
                    Best matching demo line: <i>"${Utils.escapeHTML(bestLine.text)}"</i><br>
                    <div class="docexplorer-source-box mp-chat-citation" style="cursor: pointer;">
                         🎥 <b>Segment at ${timeStr}</b> (Click to jump to this timestamp)
                    </div>
                </div>
            `);
            feed.scrollTop = feed.scrollHeight;

            const citations = feed.querySelectorAll('.mp-chat-citation');
            const citation = citations[citations.length - 1];
            if (citation) {
                Utils.eventManager.add(citation, 'click', () => this.seekToTime(bestLine.time));
            }
            if (window.playBlip) window.playBlip(700);
        }, 500);
    }

    private cleanupPlayback(): void {
        this.stopTimerSync();
        if (this.ytPlayer) {
            try {
                this.ytPlayer.destroy();
            } catch {}
            this.ytPlayer = null;
        }
        if (this.mediaElement) {
            try {
                this.mediaElement.pause();
                this.mediaElement.src = '';
                this.mediaElement.load();
            } catch {}
            this.mediaElement = null;
        }
        // Revoke the previous local file's object URL so it doesn't leak (audit A5).
        if (this.localObjectUrl) {
            try {
                URL.revokeObjectURL(this.localObjectUrl);
            } catch {}
            this.localObjectUrl = null;
        }
        this.playerType = 'idle';
        this.activeLineIndex = -1;
    }

    public terminate(): void {
        this.cleanupPlayback();

        if (this.container) {
            const vfsBtn = this.container.querySelector('#mediaplayer-vfs-btn');
            if (vfsBtn) Utils.eventManager.remove(vfsBtn, 'click', this.boundOpenLocal);

            const ytBtn = this.container.querySelector('#mediaplayer-yt-btn');
            if (ytBtn) Utils.eventManager.remove(ytBtn, 'click', this.boundLoadYoutube);
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('mediaplayer', HadOSMediaPlayer, {
    name: 'Media Player',
    icon: '🎬',
    description: 'Local and YouTube media player with a simulated demo transcript.',
    singleton: true
});
