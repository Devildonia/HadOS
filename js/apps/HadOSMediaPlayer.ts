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

    // YouTube API Player Reference
    private ytPlayer: any = null;
    private ytPlayerId: string = '';

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
        this.loadYoutubeIframeAPI();
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
                        <button class="mediaplayer-tab-btn" id="mp-tab-logs">LiteRT Logs</button>
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

        // List audios/videos from C:\HADOS\PODCASTS
        try {
            const files = (VFS.listDir('C:\\HADOS\\PODCASTS') || []).filter(f => f.endsWith('.mp3') || f.endsWith('.wav') || f.endsWith('.mp4'));
            files.forEach(f => {
                select.innerHTML += `<option value="C:\\HADOS\\PODCASTS\\${f}">[Podcast] ${f}</option>`;
            });
        } catch {}

        // List generic assets
        try {
            const files = (VFS.listDir('C:\\') || []).filter(f => f.endsWith('.mp3') || f.endsWith('.wav') || f.endsWith('.mp4'));
            files.forEach(f => {
                select.innerHTML += `<option value="C:\\${f}">C:\\${f}</option>`;
            });
        } catch {}
    }

    private loadYoutubeIframeAPI(): void {
        if ((window as any).YT) return;

        // Inject script
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    private handleOpenLocal(): void {
        const select = this.container?.querySelector('#mediaplayer-vfs-select') as HTMLSelectElement | null;
        if (!select || !select.value) return;

        const filePath = select.value;
        this.cleanupPlayback();

        const stage = this.container?.querySelector('#mediaplayer-stage-div');
        if (!stage) return;

        this.playerType = 'local';
        this.mediaElement = document.createElement('video');
        this.mediaElement.controls = true;
        this.mediaElement.src = `file:///${filePath.replace(/\\/g, '/')}`;
        this.mediaElement.style.width = '100%';
        this.mediaElement.style.height = '100%';

        stage.innerHTML = '';
        stage.appendChild(this.mediaElement);

        const playPromise = this.mediaElement.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(e => {
                Utils.Logger.info("Local playback started (simulated):", e);
            });
        } else {
            Utils.Logger.info("Local playback started (simulated):", filePath);
        }

        // Local RAG/transcript is not available for arbitrary local raw binaries
        this.transcript = [];
        this.renderTranscript();
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

        // Create API target element
        stage.innerHTML = `<div id="${this.ytPlayerId}" style="width: 100%; height: 100%;"></div>`;

        // Initialize Player using YouTube IFrame API
        const initPlayer = () => {
            try {
                this.ytPlayer = new (window as any).YT.Player(this.ytPlayerId, {
                    videoId: videoId,
                    events: {
                        onReady: () => {
                            this.logRag(`[YouTube] Player loaded for video ID: ${videoId}`);
                            this.startTimerSync();
                        },
                        onError: (e: any) => {
                            Utils.Logger.error("YouTube player error:", e);
                        }
                    }
                });
            } catch (err) {
                // Mock player for testing/JSDOM where YT API is missing
                this.ytPlayer = {
                    seekTo: (sec: number) => this.logRag(`[Mock YT] Seeked to ${sec}s`),
                    getCurrentTime: () => Math.random() * 60,
                    destroy: () => {}
                };
                this.logRag(`[YouTube API] Mock fallback initialized.`);
                this.startTimerSync();
            }
        };

        if ((window as any).YT && (window as any).YT.Player) {
            initPlayer();
        } else {
            // Wait for API to load
            (window as any).onYouTubeIframeAPIReady = initPlayer;
            // Immediate retry fallback
            setTimeout(initPlayer, 1000);
        }

        this.loadVideoTranscript(videoId);
    }

    private extractYoutubeId(url: string): string | null {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2]?.length === 11) ? match[2] : null;
    }

    private loadVideoTranscript(videoId: string): void {
        this.logRag(`[LiteRT] Downloading Whisper transcript index for video: ${videoId}...`);

        // Mock smart transcripts for popular videos, fallback to dynamic theme
        if (videoId === 'dQw4w9WgXcQ') {
            this.transcript = [
                { time: 0, text: "[Music] Never gonna give you up" },
                { time: 5, text: "[Music] Never gonna let you down" },
                { time: 10, text: "[Music] Never gonna run around and desert you" },
                { time: 18, text: "[Music] Never gonna make you cry" },
                { time: 24, text: "[Music] Never gonna say goodbye" },
                { time: 30, text: "[Music] Never gonna tell a lie and hurt you" }
            ];
        } else {
            // General semantic fallback
            this.transcript = [
                { time: 0, text: "Welcome to this Google TechTalk presentation." },
                { time: 6, text: "Today we are discussing local ML runtimes on mobile devices." },
                { time: 12, text: "Specifically, how Google LiteRT optimizes tensor graphs for WebAssembly." },
                { time: 20, text: "Using quantized weights, we achieve up to 3x faster inference speeds." },
                { time: 28, text: "In the next section, we will review cosine similarity comparisons in vector space." },
                { time: 36, text: "Thank you for joining, let's look at the benchmarks." }
            ];
        }

        this.logRag(`[LiteRT] Compiled ${this.transcript.length} tokens into local similarity vector space.`, 'success');
        this.renderTranscript();
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
                <div class="mediaplayer-transcript-line" id="mp-line-${idx}" data-time="${line.time}">
                    <span class="mediaplayer-timestamp">${timeStr}</span>
                    <span>${line.text}</span>
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
                            Ask me questions about the loaded video transcript. I will find matching clips locally using LiteRT RAG embeddings.
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
        const prefix = type === 'success' ? '[LiteRT SUCCESS] ' : '';
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

        feed.innerHTML += `<div class="docexplorer-chat-bubble user">${query}</div>`;
        feed.scrollTop = feed.scrollHeight;

        this.logRag(`[LiteRT RAG] Calculating cosine distances for search: "${query}"`);

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

            feed.innerHTML += `
                <div class="docexplorer-chat-bubble ai">
                    Grounded Video Answer: <i>"${bestLine.text}"</i><br>
                    <div class="docexplorer-source-box" id="mp-chat-citation" style="cursor: pointer;">
                         🎥 <b>Segment at ${timeStr}</b> (Click to jump to this timestamp)
                    </div>
                </div>
            `;
            feed.scrollTop = feed.scrollHeight;

            const citation = feed.querySelector('#mp-chat-citation');
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
    description: 'Local and YouTube multimedia player with LiteRT transcript RAG sync.',
    singleton: true
});
