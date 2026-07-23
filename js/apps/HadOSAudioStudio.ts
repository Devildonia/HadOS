import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import type { IAudioStudioTab } from './audiostudio/IAudioStudioTab.js';
import { PodcastTab } from './audiostudio/PodcastTab.js';
import { DictationTab } from './audiostudio/DictationTab.js';

export class HadOSAudioStudio implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    private tabContainer: HTMLElement | null = null;
    private currentTab: IAudioStudioTab | null = null;
    private activeTabId: 'podcast' | 'dictation' = 'podcast';

    private boundSwitchPodcast = () => this.switchTab('podcast');
    private boundSwitchDictation = () => this.switchTab('dictation');

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.audiostudio') || 'Audio Studio';

        this.windowId = WindowFactory.create({
            title: title,
            width: 580,
            height: 520,
            resizable: true,
            icon: '🎙️'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupTabNavigation();
        this.switchTab('podcast');
    }

    private setupTabNavigation(): void {
        if (!this.container) return;

        const podcastTabText = i18n.t('audiostudio.tab_podcast') || 'Podcast Creator';
        const dictationTabText = i18n.t('audiostudio.tab_dictation') || 'Voice Dictator';

        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <!-- Classical Win95 Tab Headers -->
                <div class="audiostudio-tabs" style="display: flex; gap: 2px; padding: 4px 4px 0 4px; background: var(--border-light); border-bottom: 2px solid var(--border-dark);">
                    <button class="audiostudio-tab-btn active" id="tab-podcast" style="padding: 4px 10px; font-size: 11px; font-family: inherit; font-weight: bold; cursor: pointer; border: 2px solid; border-color: var(--border-light) var(--border-dark) transparent var(--border-light); background: var(--window-bg); margin-bottom: -2px; z-index: 2;">${podcastTabText}</button>
                    <button class="audiostudio-tab-btn" id="tab-dictation" style="padding: 4px 10px; font-size: 11px; font-family: inherit; font-weight: bold; cursor: pointer; border: 2px solid; border-color: var(--border-light) var(--border-dark) var(--border-dark) var(--border-light); background: var(--border-dark); margin-bottom: 0;">${dictationTabText}</button>
                </div>
                <!-- Dynamic Tab Content Panel -->
                <div id="audiostudio-tab-panel" style="flex: 1; display: flex; flex-direction: column; background: var(--window-bg);"></div>
            </div>
        `;

        this.tabContainer = this.container.querySelector('#audiostudio-tab-panel');

        // Bind clicks
        const tabPodcast = this.container.querySelector('#tab-podcast');
        if (tabPodcast) {
            Utils.eventManager.add(tabPodcast, 'click', this.boundSwitchPodcast);
        }

        const tabDictation = this.container.querySelector('#tab-dictation');
        if (tabDictation) {
            Utils.eventManager.add(tabDictation, 'click', this.boundSwitchDictation);
        }
    }

    private switchTab(tabId: 'podcast' | 'dictation'): void {
        if (this.currentTab) {
            this.currentTab.terminate();
            this.currentTab = null;
        }

        this.activeTabId = tabId;

        // Toggle Tab button styling
        const btnPodcast = this.container?.querySelector('#tab-podcast') as HTMLElement | null;
        const btnDictation = this.container?.querySelector('#tab-dictation') as HTMLElement | null;

        if (btnPodcast && btnDictation) {
            if (tabId === 'podcast') {
                btnPodcast.className = 'audiostudio-tab-btn active';
                btnPodcast.style.borderColor = 'var(--border-light) var(--border-dark) transparent var(--border-light)';
                btnPodcast.style.background = 'var(--window-bg)';
                btnPodcast.style.marginBottom = '-2px';
                btnPodcast.style.zIndex = '2';

                btnDictation.className = 'audiostudio-tab-btn';
                btnDictation.style.borderColor = 'var(--border-light) var(--border-dark) var(--border-dark) var(--border-light)';
                btnDictation.style.background = 'var(--border-light)';
                btnDictation.style.marginBottom = '0';
                btnDictation.style.zIndex = '1';
            } else {
                btnPodcast.className = 'audiostudio-tab-btn';
                btnPodcast.style.borderColor = 'var(--border-light) var(--border-dark) var(--border-dark) var(--border-light)';
                btnPodcast.style.background = 'var(--border-light)';
                btnPodcast.style.marginBottom = '0';
                btnPodcast.style.zIndex = '1';

                btnDictation.className = 'audiostudio-tab-btn active';
                btnDictation.style.borderColor = 'var(--border-light) var(--border-dark) transparent var(--border-light)';
                btnDictation.style.background = 'var(--window-bg)';
                btnDictation.style.marginBottom = '-2px';
                btnDictation.style.zIndex = '2';
            }
        }

        if (this.tabContainer) {
            this.tabContainer.innerHTML = '';
            if (tabId === 'podcast') {
                this.currentTab = new PodcastTab();
            } else {
                this.currentTab = new DictationTab();
            }
            this.currentTab.render(this.tabContainer);
        }
    }

    public terminate(): void {
        if (this.currentTab) {
            this.currentTab.terminate();
            this.currentTab = null;
        }

        // Clean up main tab button clicks
        if (this.container) {
            const tabPodcast = this.container.querySelector('#tab-podcast');
            if (tabPodcast) Utils.eventManager.remove(tabPodcast, 'click', this.boundSwitchPodcast);

            const tabDictation = this.container.querySelector('#tab-dictation');
            if (tabDictation) Utils.eventManager.remove(tabDictation, 'click', this.boundSwitchDictation);
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register. The description says what the engines actually are: scripted
// podcasts read by the browser's text-to-speech, and dictation via the browser's
// speech recognition — no AI model runs in this app.
Kernel.registerApp('audiostudio', HadOSAudioStudio, {
    name: 'Audio Studio',
    icon: '🎙️',
    description: 'Scripted podcasts via browser text-to-speech, and voice dictation — on-device (Whisper) by default, browser cloud engine optional.',
    singleton: true
});
