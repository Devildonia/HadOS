import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { AiService } from '../ai/AiService.js';
import { buildHnSummaryPrompt, buildHnBriefingPrompt, MAX_COMMENTS, MAX_BRIEFING_STORIES } from '../ai/grounded.js';

interface HNItem {
    id: number;
    title: string;
    url?: string;
    score: number;
    by: string;
    descendants?: number; // Comment count
    kids?: number[]; // Top-level comment ids — the input for REAL summaries
}

/** Shape of a comment item from the official API. */
interface HNComment {
    id: number;
    text?: string;
    deleted?: boolean;
    dead?: boolean;
}

/**
 * Radar matching — plain case-insensitive keyword containment, exported pure so
 * the ranking is pinned by tests. Deliberately NOT a model call: a watchlist
 * must be cheap enough to run every few minutes and predictable enough to
 * trust; "did the title contain your word" is both, and is labelled as such.
 */
export function radarMatches(title: string, topics: string[]): string[] {
    const lower = title.toLowerCase();
    return topics
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length >= 2 && lower.includes(t));
}

/** How often the radar re-checks the front page while Nova is open. */
export const RADAR_INTERVAL_MS = 5 * 60_000;

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
        this.setupRadar();
        this.fetchTopStories();
    }

    private setupLayout(): void {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="hn-scout-container">
                <div class="hn-header">
                    <h3>📰 Hacker News Scout <span class="hn-litert-badge" id="hn-ai-badge" style="background: #555;" title="The summary is a scripted demo — no AI model runs">Simulated summaries</span></h3>
                    <div style="display: flex; gap: 6px;">
                        <button class="hn-refresh-btn hados-btn" id="hn-briefing-btn" style="display: none;" title="One on-device digest of the whole front page (headlines only — the articles are not read)">🗞️ Briefing</button>
                        <button class="hn-refresh-btn hados-btn" id="hn-refresh-btn">🔄 Refresh</button>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 6px; padding: 2px 6px; font-size: 10px;" title="Vigila la portada mientras Nova está abierta (un OS de navegador no tiene demonios en segundo plano). Aviso solo de historias nuevas que contengan tus temas.">
                    <span>📡 Radar:</span>
                    <input class="hados-input" id="hn-radar-input" placeholder="temas separados por comas — p. ej. rust, webgpu" style="flex: 1; font-size: 10px; padding: 2px 6px;">
                    <span id="hn-radar-status" style="color: #888;"></span>
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

        const briefingBtn = this.container.querySelector('#hn-briefing-btn');
        if (briefingBtn) {
            Utils.eventManager.add(briefingBtn, 'click', () => { void this.runBriefing(); });
        }

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
        this.refreshAiBadge();

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

            this.newsList = await Promise.all(promises);
            this.renderStories();
        } catch (err) {
            // No silent fallback to mock stories (audit A3): the failure used to be
            // masked with hardcoded fake headlines styled exactly like real ones, so
            // a broken feed looked like a working reader serving fiction. If the
            // network fails, say so; demo data is opt-in and labelled.
            Utils.Logger.error("Error fetching Hacker News:", err);
            this.renderFetchError();
        }
    }

    /** An honest failure state, with the demo data behind a clearly labelled button. */
    private renderFetchError(): void {
        const grid = this.container?.querySelector('#hn-news-grid');
        if (!grid) return;
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <div style="font-size: 24px;">📡</div>
                <div style="font-weight: bold; margin: 8px 0;">Could not reach Hacker News</div>
                <div style="font-size: 11px; color: #888;">Check your connection. Nothing below is real until a feed loads.</div>
                <div style="margin-top: 12px; display: flex; gap: 8px; justify-content: center;">
                    <button class="hados-btn" id="hn-retry-btn">🔄 Retry</button>
                    <button class="hados-btn" id="hn-demo-btn" title="Hardcoded example stories — not live news">Show demo data (fake)</button>
                </div>
            </div>`;
        const retry = grid.querySelector('#hn-retry-btn');
        if (retry) Utils.eventManager.add(retry, 'click', () => { void this.fetchTopStories(); });
        const demo = grid.querySelector('#hn-demo-btn');
        if (demo) Utils.eventManager.add(demo, 'click', () => {
            // Demo stories get their titles stamped so they can never pass for news.
            this.newsList = this.getMockStories().map(s => ({ ...s, title: `[DEMO] ${s.title}` }));
            this.renderStories();
        });
    }

    private renderStories(): void {
        const grid = this.container?.querySelector('#hn-news-grid');
        if (!grid) return;

        if (this.newsList.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">No stories found.</div>`;
            return;
        }

        grid.innerHTML = this.newsList.map(story => {
            // Every field here is REMOTE data written by HN users — it goes through
            // escapeHTML before touching innerHTML (audit A2). The href additionally
            // gets a protocol check: escaping does nothing against `javascript:`.
            let domain = 'news.ycombinator.com';
            let safeHref = '#';
            try {
                // A malformed URL must not take the whole listing down (audit A6).
                const parsed = story.url ? new URL(story.url) : null;
                if (parsed && (parsed.protocol === 'https:' || parsed.protocol === 'http:')) {
                    domain = parsed.hostname;
                    safeHref = Utils.escapeHTML(parsed.href);
                }
            } catch { /* keep the '#' fallback */ }
            const commentsCount = story.descendants ?? 0;
            const safeId = Number(story.id) || 0;
            return `
                <div class="hn-card" data-id="${safeId}">
                    <div>
                        <a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="hn-card-title">${Utils.escapeHTML(story.title ?? '')}</a>
                        <div style="font-size: 10px; color: #888; margin-top: 4px;">(${Utils.escapeHTML(domain)})</div>
                    </div>
                    <div class="hn-card-meta">
                        <span>▲ ${Number(story.score) || 0} points by ${Utils.escapeHTML(story.by ?? '')}</span>
                        <span>💬 ${Number(commentsCount) || 0}</span>
                    </div>
                    <div class="hn-card-actions">
                        <button class="hados-btn hn-summarize-btn" data-id="${safeId}" style="width: 100%; font-size: 10px; padding: 3px 6px;">
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

    // ── Radar (watchlist while the app is open) ──────────────────────────────

    private radarIntervalId: number | null = null;

    private getRadarTopics(): string[] {
        return (localStorage.getItem('hnscout-radar-topics') ?? '')
            .split(',').map(t => t.trim()).filter(Boolean);
    }

    private setupRadar(): void {
        const input = this.container?.querySelector('#hn-radar-input') as HTMLInputElement | null;
        if (!input) return;
        input.value = this.getRadarTopics().join(', ');
        Utils.eventManager.add(input, 'change', () => {
            localStorage.setItem('hnscout-radar-topics', input.value);
            this.restartRadar();
        });
        this.restartRadar();
    }

    private restartRadar(): void {
        if (this.radarIntervalId !== null) { window.clearInterval(this.radarIntervalId); this.radarIntervalId = null; }
        const status = this.container?.querySelector('#hn-radar-status') as HTMLElement | null;
        const topics = this.getRadarTopics();
        if (topics.length === 0) { if (status) status.textContent = ''; return; }
        if (status) status.textContent = `vigilando ${topics.length} tema${topics.length > 1 ? 's' : ''}`;
        this.radarIntervalId = window.setInterval(() => { void this.checkRadar(); }, RADAR_INTERVAL_MS);
        void this.checkRadar(); // and once now — a watchlist that waits 5 min to start is a bug report
    }

    /** One radar sweep: only NEW story ids, only keyword matches, one notification each. */
    private async checkRadar(): Promise<void> {
        const topics = this.getRadarTopics();
        if (topics.length === 0) return;
        try {
            const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
            if (!res.ok) return;
            const ids = (await res.json() as number[]).slice(0, 30);
            const seen: number[] = JSON.parse(localStorage.getItem('hnscout-radar-seen') ?? '[]');
            const seenSet = new Set(seen);
            const fresh = ids.filter(id => !seenSet.has(id));
            if (fresh.length === 0) return;

            const notify = Services.get('Notify');
            for (const id of fresh) {
                const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                if (!itemRes.ok) continue;
                const item = await itemRes.json() as HNItem | null;
                if (!item?.title) continue;
                const hits = radarMatches(item.title, topics);
                if (hits.length && notify) {
                    // The title is remote text, but Notify renders messages as text.
                    notify.info(`📡 Radar (${hits.join(', ')}): ${item.title}`, { duration: 8000 });
                }
            }
            // Everything looked at is seen, matched or not — no repeat notifications.
            const merged = [...seen, ...fresh].slice(-500);
            localStorage.setItem('hnscout-radar-seen', JSON.stringify(merged));
        } catch { /* a failed sweep is silent; the next one retries */ }
    }

    /** True when replies can be REAL: an imported Gemma bundle + WebGPU. */
    private aiReady(): boolean {
        return !!AiService.chatModel() && AiService.chatSupported();
    }

    /** Keeps the header badge telling the truth about which summarizer runs. */
    private refreshAiBadge(): void {
        const badge = this.container?.querySelector('#hn-ai-badge') as HTMLElement | null;
        if (!badge) return;
        if (this.aiReady()) {
            badge.textContent = 'On-device AI';
            badge.style.background = 'var(--accent-color, #0b5ed7)';
            badge.title = 'Summaries are generated by the imported Gemma model, on your device';
        } else {
            badge.textContent = 'Simulated summaries';
            badge.style.background = '#555';
            badge.title = 'The summary is a scripted demo — no AI model runs';
        }
        // The briefing only exists in AI mode — a scripted digest would be theatre.
        const briefing = this.container?.querySelector('#hn-briefing-btn') as HTMLElement | null;
        if (briefing) briefing.style.display = this.aiReady() ? '' : 'none';
    }

    /**
     * One on-device digest of the whole front page. Headlines and metrics only —
     * twelve threads' worth of comments cannot fit the token budget, and the
     * persona is told it has NOT read the articles.
     */
    private async runBriefing(): Promise<void> {
        const panel = this.container?.querySelector('#hn-side-panel') as HTMLElement | null;
        if (!panel || !this.aiReady() || this.newsList.length === 0) return;
        if (window.playBlip) window.playBlip(700);

        panel.style.display = 'flex';
        this.activeSummaryId = -1; // not tied to a story card

        panel.innerHTML = `
            <div class="hn-panel-header">
                <span>🗞️ Front-page briefing — on-device AI</span>
                <button class="hados-btn" id="hn-close-panel-btn" style="padding: 1px 6px; font-size: 10px;">X</button>
            </div>
            <div class="hn-panel-content">
                <div class="hn-litert-console" id="hn-console-log">
                    [AI] Digesting ${Math.min(this.newsList.length, MAX_BRIEFING_STORIES)} front-page headlines with the imported Gemma model (articles are NOT read).
                </div>
                <div class="hn-summary-text" id="hn-summary-text" style="display: block;"></div>
            </div>
        `;
        const closeBtn = panel.querySelector('#hn-close-panel-btn');
        if (closeBtn) Utils.eventManager.add(closeBtn, 'click', () => {
            panel.style.display = 'none';
            this.activeSummaryId = null;
        });

        const summaryText = panel.querySelector('#hn-summary-text') as HTMLElement | null;
        const consoleLog = panel.querySelector('#hn-console-log');
        try {
            const stories = this.newsList.map(s => {
                let domain: string | undefined;
                try { domain = s.url ? new URL(s.url).hostname : undefined; } catch { /* keep undefined */ }
                return { title: s.title, score: s.score, by: s.by, descendants: s.descendants, domain };
            });
            const { persona, user } = buildHnBriefingPrompt(stories, i18n.getLang());
            const text = await AiService.chat('hnscout', { persona, history: [{ role: 'user', text: user }] }, (delta) => {
                if (summaryText && this.activeSummaryId === -1) summaryText.textContent += delta;
            });
            if (summaryText && this.activeSummaryId === -1) summaryText.textContent = text.trim();
            consoleLog?.insertAdjacentHTML('beforeend', `<br>[AI] Briefing done — generated on your device.`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            consoleLog?.insertAdjacentHTML('beforeend', `<br>[ERROR] Briefing failed: ${Utils.escapeHTML(msg)}`);
        }
    }

    private showAISummary(story: HNItem): void {
        const panel = this.container?.querySelector('#hn-side-panel') as HTMLElement | null;
        if (!panel) return;

        panel.style.display = 'flex';
        this.activeSummaryId = story.id;
        this.refreshAiBadge();

        // Reset any existing stream
        if (this.streamIntervalId !== null) {
            window.clearInterval(this.streamIntervalId);
            this.streamIntervalId = null;
        }

        const real = this.aiReady();
        const headerText = real ? '📝 Discussion summary — on-device AI' : '📝 Summary (simulated demo)';
        const consoleSeed = real
            ? '[AI] Summarising the thread\'s comments with the imported Gemma model (on-device).'
            : '[Demo] No AI model runs here — this panel shows a scripted text.';

        panel.innerHTML = `
            <div class="hn-panel-header">
                <span>${headerText}</span>
                <button class="hados-btn" id="hn-close-panel-btn" style="padding: 1px 6px; font-size: 10px;">X</button>
            </div>
            <div class="hn-panel-content">
                <div style="font-weight: bold; font-size: 11px;">"${Utils.escapeHTML(story.title ?? '')}"</div>
                <div class="hn-litert-console" id="hn-console-log">
                    ${consoleSeed}
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

        if (real) {
            void this.runRealSummary(story);
        } else {
            this.runLiteRtSimulation(story);
        }
    }

    /**
     * A REAL summary — of the thing a browser can actually read. The linked
     * article is off-limits (arbitrary origins, no CORS), but the thread's own
     * comments come from the same official API as the stories, so Gemma
     * summarises the DISCUSSION and the panel says exactly that.
     */
    private async runRealSummary(story: HNItem): Promise<void> {
        const consoleLog = this.container?.querySelector('#hn-console-log');
        const summaryText = this.container?.querySelector('#hn-summary-text') as HTMLElement | null;
        if (!consoleLog || !summaryText) return;

        const log = (line: string) => {
            if (this.activeSummaryId !== story.id) return;
            consoleLog.insertAdjacentHTML('beforeend', `<br>${Utils.escapeHTML(line)}`);
            consoleLog.scrollTop = consoleLog.scrollHeight;
        };

        try {
            const kidIds = (story.kids ?? []).slice(0, MAX_COMMENTS);
            log(`[AI] Fetching ${kidIds.length} top comments...`);
            const items = await Promise.all(kidIds.map(async id => {
                const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                return res.ok ? (res.json() as Promise<HNComment>) : null;
            }));
            const comments = items
                .filter((c): c is HNComment => !!c && !c.deleted && !c.dead && !!c.text)
                .map(c => c.text as string);

            if (comments.length === 0) {
                log(`[AI] This thread has no readable comments yet — nothing to summarise.`);
                return;
            }
            log(`[AI] ${comments.length} comments in context. Generating on-device...`);

            const { persona, user } = buildHnSummaryPrompt(
                { title: story.title, score: story.score, by: story.by, descendants: story.descendants },
                comments,
                i18n.getLang(),
            );

            summaryText.style.display = 'block';
            summaryText.textContent = '';
            const text = await AiService.chat('hnscout', { persona, history: [{ role: 'user', text: user }] }, (delta) => {
                if (this.activeSummaryId === story.id) {
                    summaryText.textContent += delta; // model output: textContent only
                }
            });
            if (this.activeSummaryId === story.id) summaryText.textContent = text.trim();
            log(`[AI] Done — generated from ${comments.length} comments, nothing sent anywhere.`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            log(`[ERROR] On-device summary failed: ${msg}`);
        }
    }

    private runLiteRtSimulation(story: HNItem): void {
        const consoleLog = this.container?.querySelector('#hn-console-log');
        const summaryText = this.container?.querySelector('#hn-summary-text') as HTMLElement | null;
        if (!consoleLog || !summaryText) return;

        // These used to narrate a model download, tensor allocation and "inference"
        // that never happened, over a hardcoded summary (audit A4). The theatre is
        // gone: the log says what this is — a scripted, keyword-matched demo text.
        // Real summarisation belongs to the AiService substrate when an on-device
        // LLM lands (LiteRT-LM milestone); nothing here may claim it early.
        const logs = [
            `[Demo] This summary is SIMULATED — no AI model runs.`,
            `[Demo] Picking a canned text by title keywords...`,
            `[Hint] Import a Gemma model in the Messenger to get real on-device summaries of the discussion.`
        ];

        let logIndex = 0;
        const logInterval = window.setInterval(() => {
            if (this.activeSummaryId !== story.id) {
                window.clearInterval(logInterval);
                return;
            }

            if (logIndex < logs.length) {
                // insertAdjacentHTML: `innerHTML +=` re-parsed the whole log node on
                // every tick and would have destroyed any inner listeners (audit A7).
                consoleLog.insertAdjacentHTML('beforeend', `<br>${logs[logIndex]}`);
                consoleLog.scrollTop = consoleLog.scrollHeight;
                logIndex++;
            } else {
                window.clearInterval(logInterval);
                consoleLog.insertAdjacentHTML('beforeend', `<br>[Demo] Showing scripted text:`);
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

        return `### 📝 Simulated summary (no AI)\n\n**${scoreText}**\n\n${topicAnalysis}\n\n**Key Takeaways & Comments:**\n${commentsSentiment}\n\n*Source: ${story.by} on Hacker News — text selected by title keywords, not generated.*`;
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
        if (this.radarIntervalId !== null) {
            window.clearInterval(this.radarIntervalId);
            this.radarIntervalId = null;
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
    description: 'Hacker News reader — real on-device discussion summaries when a Gemma model is imported; simulated demo otherwise.',
    singleton: true
});
