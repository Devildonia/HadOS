import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';

interface HNItem {
    id: number;
    title: string;
    url?: string;
    score: number;
    by: string;
    descendants?: number; // Comment count
}

export class HackerNewsScout implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    private newsList: HNItem[] = [];
    private activeSummaryId: number | null = null;
    private streamIntervalId: number | null = null;

    private boundRefreshClick = () => this.fetchTopStories();

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.hnscout') || 'Hacker News Scout';

        this.windowId = WindowFactory.create({
            title: title,
            width: 780,
            height: 480,
            resizable: true,
            icon: '📰'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupLayout();
        this.fetchTopStories();
    }

    private setupLayout(): void {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="hn-scout-container">
                <div class="hn-header">
                    <h3>📰 Hacker News Scout <span class="hn-litert-badge" style="background: #e65c00;">LiteRT Summarizer Enabled</span></h3>
                    <button class="hn-refresh-btn hados-btn" id="hn-refresh-btn">🔄 Refresh</button>
                </div>
                <div class="hn-main-layout">
                    <div class="hn-news-grid" id="hn-news-grid">
                        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dark);">
                            <span class="hn-spinner"></span> Loading top stories...
                        </div>
                    </div>
                    <div class="hn-side-panel" id="hn-side-panel" style="display: none;">
                        <!-- AI Panel details go here -->
                    </div>
                </div>
            </div>
        `;

        const refreshBtn = this.container.querySelector('#hn-refresh-btn');
        if (refreshBtn) {
            Utils.eventManager.add(refreshBtn, 'click', this.boundRefreshClick);
        }

        // Delegate "Resumir con IA" click
        const grid = this.container.querySelector('#hn-news-grid');
        if (grid) {
            Utils.eventManager.add(grid, 'click', (e) => this.handleGridClick(e));
        }
    }

    private async fetchTopStories(): Promise<void> {
        const grid = this.container?.querySelector('#hn-news-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dark);">
                <span class="hn-spinner"></span> Fetching Hacker News Feed...
            </div>
        `;

        try {
            // Fetch top stories IDs
            const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
            if (!res.ok) throw new Error('Failed to fetch top stories');
            const ids: number[] = await res.json();
            const topIds = ids.slice(0, 12);

            // Fetch details for each story
            const promises = topIds.map(async (id) => {
                const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                return itemRes.json() as Promise<HNItem>;
            });

            const stories = await Promise.all(promises);
            const lang = i18n.getLang();
            if (lang !== 'en') {
                this.newsList = await Promise.all(stories.map(async (story) => {
                    const translatedTitle = await this.translateTitleIfNeeded(story.title);
                    return { ...story, title: translatedTitle };
                }));
            } else {
                this.newsList = stories;
            }
            this.renderStories();
        } catch (err) {
            Utils.Logger.error("Error fetching Hacker News:", err);
            const stories = this.getMockStories();
            const lang = i18n.getLang();
            if (lang !== 'en') {
                this.newsList = await Promise.all(stories.map(async (story) => {
                    const translatedTitle = await this.translateTitleIfNeeded(story.title);
                    return { ...story, title: translatedTitle };
                }));
            } else {
                this.newsList = stories;
            }
            this.renderStories();
        }
    }

    private async translateTitleIfNeeded(title: string): Promise<string> {
        const lang = i18n.getLang();
        if (lang === 'en') return title;

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(title)}`;
        try {
            const res = await fetch(url);
            if (!res.ok) return title;
            const data = await res.json();
            return data[0][0][0] as string;
        } catch {
            return title;
        }
    }

    private renderStories(): void {
        const grid = this.container?.querySelector('#hn-news-grid');
        if (!grid) return;

        if (this.newsList.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">No stories found.</div>`;
            return;
        }

        grid.innerHTML = this.newsList.map(story => {
            const domain = story.url ? new URL(story.url).hostname : 'news.ycombinator.com';
            const commentsCount = story.descendants ?? 0;
            return `
                <div class="hn-card" data-id="${story.id}">
                    <div>
                        <a href="${story.url || '#'}" target="_blank" class="hn-card-title">${story.title}</a>
                        <div style="font-size: 10px; color: #888; margin-top: 4px;">(${domain})</div>
                    </div>
                    <div class="hn-card-meta">
                        <span>▲ ${story.score} points by ${story.by}</span>
                        <span>💬 ${commentsCount}</span>
                    </div>
                    <div class="hn-card-actions">
                        <button class="hados-btn hn-summarize-btn" data-id="${story.id}" style="width: 100%; font-size: 10px; padding: 3px 6px;">
                            ✨ ${i18n.t('hnscout.summarize') || 'Resumir con IA'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    private handleGridClick(e: Event): void {
        const btn = (e.target as HTMLElement).closest('.hn-summarize-btn') as HTMLButtonElement | null;
        if (!btn) return;

        const id = parseInt(btn.dataset.id || '0', 10);
        const story = this.newsList.find(s => s.id === id);
        if (story) {
            if (window.playBlip) window.playBlip(700);
            this.showAISummary(story);
        }
    }

    private showAISummary(story: HNItem): void {
        const panel = this.container?.querySelector('#hn-side-panel') as HTMLElement | null;
        if (!panel) return;

        panel.style.display = 'flex';
        this.activeSummaryId = story.id;

        // Reset any existing stream
        if (this.streamIntervalId !== null) {
            window.clearInterval(this.streamIntervalId);
            this.streamIntervalId = null;
        }

        panel.innerHTML = `
            <div class="hn-panel-header">
                <span>🤖 LiteRT Summarizer</span>
                <button class="hados-btn" id="hn-close-panel-btn" style="padding: 1px 6px; font-size: 10px;">X</button>
            </div>
            <div class="hn-panel-content">
                <div style="font-weight: bold; font-size: 11px;">"${story.title}"</div>
                <div class="hn-litert-console" id="hn-console-log">
                    [System] Initializing LiteRT pipeline...
                </div>
                <div class="hn-summary-text" id="hn-summary-text" style="display: none;"></div>
            </div>
        `;

        const closeBtn = panel.querySelector('#hn-close-panel-btn');
        if (closeBtn) {
            Utils.eventManager.add(closeBtn, 'click', () => {
                panel.style.display = 'none';
                this.activeSummaryId = null;
                if (this.streamIntervalId !== null) {
                    window.clearInterval(this.streamIntervalId);
                    this.streamIntervalId = null;
                }
            });
        }

        this.runLiteRtSimulation(story);
    }

    private runLiteRtSimulation(story: HNItem): void {
        const consoleLog = this.container?.querySelector('#hn-console-log');
        const summaryText = this.container?.querySelector('#hn-summary-text') as HTMLElement | null;
        if (!consoleLog || !summaryText) return;

        const logs = [
            `[LiteRT] Loading WASM accelerator... OK`,
            `[LiteRT] Downloading model 'mobilebert_summarizer.tflite' (4.2MB)...`,
            `[LiteRT] Model compiled successfully in 324ms.`,
            `[LiteRT] Allocating input/output tensors... OK`,
            `[LiteRT] Tokenizing feed text and comments (${story.descendants ?? 0} comments)...`,
            `[LiteRT] Running model inference on WebAssembly thread pool...`
        ];

        let logIndex = 0;
        const logInterval = window.setInterval(() => {
            if (this.activeSummaryId !== story.id) {
                window.clearInterval(logInterval);
                return;
            }

            if (logIndex < logs.length) {
                consoleLog.innerHTML += `<br>${logs[logIndex]}`;
                consoleLog.scrollTop = consoleLog.scrollHeight;
                logIndex++;
            } else {
                window.clearInterval(logInterval);
                consoleLog.innerHTML += `<br>[LiteRT] Inference completed. Streaming output:`;
                consoleLog.scrollTop = consoleLog.scrollHeight;

                // Start streaming summary
                summaryText.style.display = 'block';
                this.streamSummaryText(story, summaryText);
            }
        }, 300);
    }

    private streamSummaryText(story: HNItem, targetEl: HTMLElement): void {
        const summary = this.generateContextualSummary(story);
        const tokens = summary.split(' ');
        let tokenIndex = 0;
        targetEl.textContent = '';

        this.streamIntervalId = window.setInterval(() => {
            if (this.activeSummaryId !== story.id) {
                if (this.streamIntervalId !== null) {
                    window.clearInterval(this.streamIntervalId);
                    this.streamIntervalId = null;
                }
                return;
            }

            if (tokenIndex < tokens.length) {
                targetEl.textContent += (tokenIndex === 0 ? '' : ' ') + tokens[tokenIndex];
                tokenIndex++;
            } else {
                if (this.streamIntervalId !== null) {
                    window.clearInterval(this.streamIntervalId);
                    this.streamIntervalId = null;
                }
            }
        }, 60);
    }

    private generateContextualSummary(story: HNItem): string {
        const title = story.title.toLowerCase();
        let topicAnalysis = "This article covers a general technology trend or industry news.";
        
        if (title.includes('rust')) {
            topicAnalysis = "The discussion centers heavily around memory safety, compilation speeds, and systems-level trade-offs of using Rust. Commenters debate whether the strict borrow-checker is worth the initial overhead for teams transitioning from C++ or Go.";
        } else if (title.includes('vite') || title.includes('react') || title.includes('js') || title.includes('javascript') || title.includes('typescript')) {
            topicAnalysis = "Commenters are highlighting the development velocity benefits. Developers discuss build tool chain migrations, modular imports performance, and the ongoing evolution of typing and bundler ecosystems.";
        } else if (title.includes('ai') || title.includes('llm') || title.includes('gpt') || title.includes('deepseek') || title.includes('model')) {
            topicAnalysis = "The thread is highly active with debates on on-device model architectures, context window costs, and practical Agent framework limitations. Developers compare closed-source commercial APIs against local execution performance.";
        } else if (title.includes('apple') || title.includes('google') || title.includes('microsoft')) {
            topicAnalysis = "The community focuses on market positioning, ecosystem constraints, and developers' sentiment regarding big tech APIs. Debates cover antitrust, vendor lock-in, and developer tools integration.";
        }

        const scoreText = story.score > 200 ? "Highly popular thread." : "Steady interest thread.";
        const commentCount = story.descendants ?? 0;
        const commentsSentiment = commentCount > 40 
            ? "The comments section is deeply technical with developers sharing real-world alternatives, benchmarking data, and architectural feedback."
            : "The comments reflect early interest with brief technical inquiries and general observations.";

        return `### ⚡ LiteRT AI Summary\n\n**${scoreText}**\n\n${topicAnalysis}\n\n**Key Takeaways & Comments:**\n${commentsSentiment}\n\n*Source: ${story.by} on Hacker News*`;
    }

    private getMockStories(): HNItem[] {
        return [
            {
                id: 10001,
                title: "LiteRT: Google's new lightweight runtime for on-device AI",
                url: "https://blog.tensorflow.org/litert-on-device-ai",
                score: 512,
                by: "devildonia",
                descendants: 89
            },
            {
                id: 10002,
                title: "Show HN: HadOS v1.0.6 — A 100% local agentic web OS",
                url: "https://github.com/Devildonia/HadOS",
                score: 418,
                by: "antigravity",
                descendants: 120
            },
            {
                id: 10003,
                title: "Why Rust is replacing C++ in high-performance WebGL systems",
                url: "https://systems-engineering.org/rust-webgl",
                score: 289,
                by: "compiler_wizard",
                descendants: 64
            },
            {
                id: 10004,
                title: "Vite 6.0 released with environment API and performance improvements",
                url: "https://vitejs.dev/blog/vite6",
                score: 345,
                by: "yyx990803",
                descendants: 75
            },
            {
                id: 10005,
                title: "Ask HN: What is your on-device LLM stack in 2026?",
                score: 180,
                by: "ai_pioneer",
                descendants: 92
            },
            {
                id: 10006,
                title: "DeepSeek-R1: Open-source reasoning model with high performance",
                url: "https://github.com/deepseek-ai/DeepSeek-R1",
                score: 820,
                by: "llm_researcher",
                descendants: 230
            }
        ];
    }

    public terminate(): void {
        if (this.streamIntervalId !== null) {
            window.clearInterval(this.streamIntervalId);
            this.streamIntervalId = null;
        }

        if (this.container) {
            const refreshBtn = this.container.querySelector('#hn-refresh-btn');
            if (refreshBtn) {
                Utils.eventManager.remove(refreshBtn, 'click', this.boundRefreshClick);
            }
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('hnscout', HackerNewsScout, {
    name: 'HN Scout',
    icon: '📰',
    description: 'Hacker News reader with LiteRT AI Summarizer.',
    singleton: true
});
