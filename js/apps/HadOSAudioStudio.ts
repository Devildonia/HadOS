import { Kernel } from '../core/Kernel.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import type { IAudioStudioTab } from './audiostudio/IAudioStudioTab.js';
import { PodcastTab } from './audiostudio/PodcastTab.js';
import { DictationTab } from './audiostudio/DictationTab.js';
import { MelodyTab } from './audiostudio/MelodyTab.js';

type TabId = 'podcast' | 'dictation' | 'melody';

export class HadOSAudioStudio implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    private tabContainer: HTMLElement | null = null;
    private currentTab: IAudioStudioTab | null = null;
    private activeTabId: TabId = 'podcast';

    /** One table, any number of tabs — the two-tab if/else did not survive the third. */
    private readonly tabs: Array<{ id: TabId; btnId: string; key: string; fallback: string; make: () => IAudioStudioTab }> = [
        { id: 'podcast', btnId: 'tab-podcast', key: 'audiostudio.tab_podcast', fallback: 'Podcast Creator', make: () => new PodcastTab() },
        { id: 'dictation', btnId: 'tab-dictation', key: 'audiostudio.tab_dictation', fallback: 'Voice Dictator', make: () => new DictationTab() },
        { id: 'melody', btnId: 'tab-melody', key: 'audiostudio.tab_melody', fallback: 'Melody Lab', make: () => new MelodyTab() },
    ];

    private boundTabClicks = new Map<TabId, () => void>();

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
            icon: 'assets/icons/voxcribe.webp'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupTabNavigation();
        this.switchTab('podcast');
    }

    private setupTabNavigation(): void {
        if (!this.container) return;

        const buttons = this.tabs.map(t => {
            const label = i18n.t(t.key) || t.fallback;
            return `<button class="audiostudio-tab-btn" id="${t.btnId}" style="padding: 4px 10px; font-size: 11px; font-family: inherit; font-weight: bold; cursor: pointer; border: 2px solid; border-color: var(--border-light) var(--border-dark) var(--border-dark) var(--border-light); background: var(--border-light); margin-bottom: 0;">${label}</button>`;
        }).join('');

        this.container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <!-- Classical Win95 Tab Headers -->
                <div class="audiostudio-tabs" style="display: flex; gap: 2px; padding: 4px 4px 0 4px; background: var(--border-light); border-bottom: 2px solid var(--border-dark);">
                    ${buttons}
                </div>
                <!-- Dynamic Tab Content Panel -->
                <div id="audiostudio-tab-panel" style="flex: 1; display: flex; flex-direction: column; background: var(--window-bg);"></div>
            </div>
        `;

        this.tabContainer = this.container.querySelector('#audiostudio-tab-panel');

        for (const t of this.tabs) {
            const handler = () => this.switchTab(t.id);
            this.boundTabClicks.set(t.id, handler);
            const btn = this.container.querySelector(`#${t.btnId}`);
            if (btn) Utils.eventManager.add(btn, 'click', handler);
        }
    }

    private switchTab(tabId: TabId): void {
        if (this.currentTab) {
            this.currentTab.terminate();
            this.currentTab = null;
        }

        this.activeTabId = tabId;

        for (const t of this.tabs) {
            const btn = this.container?.querySelector(`#${t.btnId}`) as HTMLElement | null;
            if (!btn) continue;
            const active = t.id === tabId;
            btn.className = active ? 'audiostudio-tab-btn active' : 'audiostudio-tab-btn';
            btn.style.borderColor = active
                ? 'var(--border-light) var(--border-dark) transparent var(--border-light)'
                : 'var(--border-light) var(--border-dark) var(--border-dark) var(--border-light)';
            btn.style.background = active ? 'var(--window-bg)' : 'var(--border-light)';
            btn.style.marginBottom = active ? '-2px' : '0';
            btn.style.zIndex = active ? '2' : '1';
        }

        if (this.tabContainer) {
            this.tabContainer.innerHTML = '';
            const def = this.tabs.find(t => t.id === tabId);
            if (def) {
                this.currentTab = def.make();
                this.currentTab.render(this.tabContainer);
            }
        }
    }

    public terminate(): void {
        if (this.currentTab) {
            this.currentTab.terminate();
            this.currentTab = null;
        }

        // Clean up main tab button clicks
        if (this.container) {
            for (const t of this.tabs) {
                const btn = this.container.querySelector(`#${t.btnId}`);
                const handler = this.boundTabClicks.get(t.id);
                if (btn && handler) Utils.eventManager.remove(btn, 'click', handler);
            }
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register. The description says what the engines actually are.
Kernel.registerApp('audiostudio', HadOSAudioStudio, {
    name: 'Voxcribe',
    icon: 'assets/icons/voxcribe.webp',
    description: 'Scripted podcasts (browser TTS), on-device Whisper dictation, and Gemma-composed melodies played by the local synth.',
    singleton: true
});
