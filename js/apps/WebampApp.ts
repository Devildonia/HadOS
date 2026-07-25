/**
 * WEBAMP APPLICATION WRAPPER & RADIO INTEGRATOR
 * Integrates Webamp (Winamp 2 port) and fetches 90s Radio Stations
 */

import { EventBus } from '../core/EventBus.js';
import { Kernel } from '../core/Kernel.js';
import { Utils } from '../utils.js';

export interface IWebampTrack {
    metaData: {
        artist: string;
        title: string;
        album?: string;
    };
    url: string;
    duration: number;
}

class WebampApp {
    private static instance: { renderWhenReady: (el: HTMLElement) => Promise<void>; onClose: (cb: () => void) => void; dispose: () => void } | null = null;
    private static isInitialized: boolean = false;

    // --- Radio-Browser API Config ---
    private static readonly RADIO_API_URL = "https://de1.api.radio-browser.info/json/stations/bytag/90s";

    /**
     * Fetches "90s" tag radio stations (Top 20 by votes to ensure quality)
     */
    private static async fetchRadioStations(): Promise<IWebampTrack[]> {
        Utils.Logger.log("[WebampApp] Connecting to Radio Directory...");
        try {
            const url = `${this.RADIO_API_URL}?limit=30&order=votes&reverse=true`;
            const response = await fetch(url);
            const stations = await response.json();

            if (!stations || !Array.isArray(stations) || stations.length === 0) {
                Utils.Logger.warn("[WebampApp] No stations found.");
                return [];
            }

            return stations.map((st: unknown): IWebampTrack => {
                const station = st as Record<string, string>;
                const name = station.name || 'Unknown Station';
                return {
                    metaData: {
                        artist: name,
                        title: station.countrycode ? `[${station.countrycode}] ${name}` : name,
                        album: "Live Radio"
                    },
                    url: station.url_resolved || station.url || '',
                    duration: 0 // Live stream
                };
            });

        } catch (e) {
            Utils.Logger.error("[WebampApp] Radio API Error:", e);
            return [];
        }
    }

    public static async launch(): Promise<void> {
        if (this.isInitialized && this.instance) {
            const webampDiv = document.getElementById('webamp');
            if (webampDiv) {
                webampDiv.style.display = 'block';
                webampDiv.style.zIndex = '9005';
            }
            return;
        }

        const WebampClass = window.Webamp as { new(opts: unknown): { renderWhenReady: (el: HTMLElement) => Promise<void>; onClose: (cb: () => void) => void; dispose: () => void } } | undefined;
        if (!WebampClass) {
            Utils.Logger.error("Webamp library not loaded!");
            return;
        }

        let initialTracks: IWebampTrack[] = [
            {
                metaData: {
                    artist: "Winamp",
                    title: "Demo Track (Llama)",
                },
                url: "https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/llama-2.91.mp3",
                duration: 5.322286,
            }
        ];

        const radioTracks = await this.fetchRadioStations();

        if (radioTracks.length > 0) {
            Utils.Logger.log(`[WebampApp] Loaded ${radioTracks.length} radio stations.`);
            initialTracks = radioTracks.sort(() => Math.random() - 0.5);
        } else {
            Utils.Logger.log("[WebampApp] Using default demo track (Radio fetch failed).");
        }

        const webampInstance = new WebampClass({
            initialTracks,
            zIndex: 9000,
            enableHotkeys: true,
        });
        this.instance = webampInstance;

        const container = document.getElementById('webamp-container');
        if (container) {
            await webampInstance.renderWhenReady(container);
        } else {
            await webampInstance.renderWhenReady(document.body);
        }

        this.isInitialized = true;

        webampInstance.onClose(() => {
            webampInstance.dispose();
            this.instance = null;
            this.isInitialized = false;

            const fakeProcess = { pid: 999, appId: 'webamp', instance: this as unknown, windowId: 'webamp-container', status: 'terminated' as const };
            EventBus.emit('kernel:process-stopped', fakeProcess as unknown as Parameters<typeof EventBus.emit>[1]);
            EventBus.emit('process-stopped', fakeProcess as unknown as Parameters<typeof EventBus.emit>[1]);
        });
    }

    public static get windowId(): string {
        return 'webamp-container';
    }
}

// Register with Kernel
Kernel.registerApp('webamp', class {
    constructor() { void WebampApp.launch(); }
    get windowId() { return 'webamp-container'; }
}, {
    name: 'Winamp',
    icon: 'assets/icons/winamp_icon.webp',
    description: '90s Media Player',
    singleton: true
});

export { WebampApp };
