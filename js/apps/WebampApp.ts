/**
 * WEBAMP APPLICATION WRAPPER & RADIO INTEGRATOR
 * Integrates Webamp (Winamp 2 port) and fetches 90s Radio Stations
 */

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
    private static instance: any = null;
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

            if (!stations || stations.length === 0) {
                Utils.Logger.warn("[WebampApp] No stations found.");
                return [];
            }

            return stations.map((station: any): IWebampTrack => ({
                metaData: {
                    artist: station.name || "Unknown Station",
                    title: station.countrycode ? `[${station.countrycode}] ${station.name}` : station.name,
                    album: "Live Radio"
                },
                url: station.url_resolved || station.url,
                duration: 0 // Live stream
            }));

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

        const WebampClass = window.Webamp;
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

        this.instance = new WebampClass({
            initialTracks,
            zIndex: 9000,
            enableHotkeys: true,
        });

        const container = document.getElementById('webamp-container');
        if (container) {
            await this.instance.renderWhenReady(container);
        } else {
            await this.instance.renderWhenReady(document.body);
        }

        this.isInitialized = true;

        this.instance.onClose(() => {
            this.instance.dispose();
            this.instance = null;
            this.isInitialized = false;

            window.dispatchEvent(new CustomEvent('kernel:process-stopped', {
                detail: { pid: 'webamp', windowId: 'webamp-container' }
            }));
        });
    }

    public static get windowId(): string {
        return 'webamp-container';
    }
}

// Register with Kernel
Kernel.registerApp('webamp', class {
    constructor() { WebampApp.launch(); }
    get windowId() { return 'webamp-container'; }
}, {
    name: 'Winamp',
    icon: 'assets/icons/winamp_icon.webp',
    description: '90s Media Player',
    singleton: true
});

export { WebampApp };
