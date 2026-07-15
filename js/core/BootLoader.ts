/**
 * HadOS - BOOT LOADER
 * Manages the BIOS sequence and splash screen
 * Version: 1.2 (ES Modules)
 */

import { Utils } from '../utils.js';
import { Services } from './ServiceContainer.js';
import { CONFIG } from '../config.js';
import { probeHardware, type HardwareReport } from './HardwareProbe.js';

export interface IBootLoader {
    init(): void;
    start(onComplete?: () => void): void;
    /** Called by the boot orchestrator once the OS is actually usable. */
    signalReady(): void;
}

/** Brand dwell: the splash is never shorter than this, however fast the boot is. */
const SPLASH_MIN_MS = 4000;
/** Hard cap: a stuck ready-signal must never trap the user behind the splash. */
const SPLASH_MAX_MS = 12000;
/** The bar parks here until signalReady() lands — the last 10% means "really done". */
const SPLASH_HOLD_PCT = 90;
/** ~60 fps; the CSS width transition smooths anything coarser. */
const TICK_MS = 16;
/** Dot-leader width for the POST labels, so the values form a column. */
const POST_LABEL_WIDTH = 20;

const BootLoader: IBootLoader = (() => {
    'use strict';

    /**
     * Set by signalReady() when the boot work that runs *alongside* the splash
     * (VFS hydration, initOS, session restore) has settled. The bar tracks the
     * dwell timeline but refuses to reach 100% until this is true, so a slow
     * session restore holds the splash instead of dumping the user on a
     * half-built desktop.
     */
    let osReady = false;

    function init(): void {
        Utils.Logger.log("[BOOT] BootLoader initialized");
    }

    function signalReady(): void {
        osReady = true;
    }

    /** Pads a POST label so the values line up in the monospace column. */
    function post(label: string, value: string): string {
        return `${label.padEnd(POST_LABEL_WIDTH, '.')} ${value}`;
    }

    function biosTimestamp(): string {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
        return `${date} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }

    /** The POST report. Values are probed from the real machine — see HardwareProbe. */
    function buildBiosLines(hw: HardwareReport): string[] {
        return [
            'HadOS BIOS (C) 2026 HaDeS (A.K.A. DeViLDoNia)',
            `BIOS Date: ${biosTimestamp()}  Ver: ${CONFIG.APP.VERSION}`,
            '',
            post('CPU', hw.cpu),
            post('Memory Test', hw.memory),
            post('Display Adapter', hw.gpu),
            post('Video Mode', hw.display),
            '',
            post('Detecting Storage', hw.storage),
            post('Detecting Network', hw.network),
            post('Detecting Pointer', hw.pointer),
            post('Detecting Keyboard', 'Detected'),
            '',
            post('Host Platform', hw.host),
            `HadOS v${CONFIG.APP.VERSION}`,
            '',
            'Press DEL to enter SETUP, ESC to skip POST',
            '',
            'Starting HadOS...'
        ];
    }

    function printPost(biosText: HTMLElement, lines: string[], onComplete?: () => void): void {
        let currentLine = 0;
        const lineInterval = setInterval(() => {
            if (currentLine < lines.length) {
                biosText.textContent += lines[currentLine] + '\n';
                currentLine++;
            } else {
                clearInterval(lineInterval);
                setTimeout(() => showSplashScreen(onComplete), 200);
            }
        }, 100);
    }

    function showBootScreen(onComplete?: () => void): void {
        const bootScreen = document.getElementById('boot-screen');
        const biosText = document.getElementById('bios-text');

        if (!bootScreen || !biosText) {
            if (onComplete) onComplete();
            return;
        }

        bootScreen.style.display = 'block';
        biosText.textContent = '';
        // A fresh boot starts unready; signalReady() always lands after start().
        osReady = false;

        // The probe is capped and never rejects, so the POST always prints.
        void probeHardware().then(hw => printPost(biosText, buildBiosLines(hw), onComplete));
    }

    /** Ease-out: the bar leaps off the mark, then settles. */
    function ease(t: number): number {
        return 1 - Math.pow(1 - t, 2);
    }

    function showSplashScreen(onComplete?: () => void): void {
        const bootScreen = document.getElementById('boot-screen');
        const splashScreen = document.getElementById('splash-screen');

        if (bootScreen) bootScreen.style.display = 'none';
        if (splashScreen) splashScreen.style.display = 'flex';

        const bar = document.querySelector<HTMLElement>('.splash-progress-bar');
        const track = document.querySelector<HTMLElement>('.splash-progress');
        const readout = document.querySelector<HTMLElement>('.splash-percent');

        const startedAt = Date.now();
        let finished = false;

        function render(pct: number): void {
            const whole = Math.round(pct);
            if (bar) bar.style.width = `${pct}%`;
            if (readout) readout.textContent = `${whole}%`;
            if (track) track.setAttribute('aria-valuenow', String(whole));
        }

        function finish(): void {
            if (finished) return;
            finished = true;
            clearInterval(ticker);
            render(100);
            if (onComplete) onComplete();
        }

        const ticker = setInterval(() => {
            const elapsed = Date.now() - startedAt;

            if (elapsed >= SPLASH_MAX_MS) {
                Utils.Logger.log('[BOOT] Ready signal timed out — showing the desktop anyway');
                finish();
                return;
            }

            const timed = ease(Math.min(elapsed / SPLASH_MIN_MS, 1)) * 100;
            const pct = Math.min(timed, osReady ? 100 : SPLASH_HOLD_PCT);
            render(pct);

            if (pct >= 100) finish();
        }, TICK_MS);

        render(0);
    }

    return {
        init,
        start: showBootScreen,
        signalReady
    };
})();

export { BootLoader };

if (typeof window !== 'undefined') {
    window.BootLoader = BootLoader;
    Services.register('BootLoader', BootLoader);
}
