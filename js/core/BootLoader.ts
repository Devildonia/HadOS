/**
 * WINDOWS 95 APP CENTER - BOOT LOADER
 * Manages the BIOS sequence and splash screen
 * Version: 1.1 (ES Modules)
 */

import { Utils } from '../utils.js';
import { Services } from './ServiceContainer.js';
import { CONFIG } from '../config.js';

export interface IBootLoader {
    init(): void;
    start(onComplete?: () => void): void;
}

const BootLoader: IBootLoader = (() => {
    'use strict';

    function init(): void {
        Utils.Logger.log("[BOOT] BootLoader initialized");
    }

    function showBootScreen(onComplete?: () => void): void {
        const bootScreen = document.getElementById('boot-screen');
        const biosText = document.getElementById('bios-text');

        if (!bootScreen || !biosText) {
            if (onComplete) onComplete();
            return;
        }

        bootScreen.style.display = 'block';

        const biosLines = [
            'AMIBIOS (C) 1995 American Megatrends, Inc.',
            'BIOS Date: 07/15/95 14:20:12 Ver: 08.00.12',
            'CPU: Intel Pentium(R) 133 MHz',
            'Speed: 133 MHz',
            'Memory Test: 65536KB OK',
            '',
            'Detecting IDE Primary Master ... 850MB HDD',
            'Detecting IDE Primary Slave  ... None',
            'Detecting IDE Secondary Master... 4x CD-ROM',
            '',
            'Keyboard... Detected',
            'Mouse... Detected',
            '',
            `Windows App Center v${CONFIG.APP.VERSION}`,
            'Copyright (C) 2026 HaDeS (A.K.A. DeViLDoNia)',
            '',
            'Press DEL to enter SETUP, ESC to skip POST',
            '',
            'Starting Windows...'
        ];

        let currentLine = 0;
        const lineInterval = setInterval(() => {
            if (currentLine < biosLines.length) {
                biosText.textContent += biosLines[currentLine] + '\n';
                currentLine++;
            } else {
                clearInterval(lineInterval);
                setTimeout(() => showSplashScreen(onComplete), 200);
            }
        }, 100);
    }

    function showSplashScreen(onComplete?: () => void): void {
        const bootScreen = document.getElementById('boot-screen');
        const splashScreen = document.getElementById('splash-screen');

        if (bootScreen) bootScreen.style.display = 'none';
        if (splashScreen) splashScreen.style.display = 'flex';

        setTimeout(() => {
            if (onComplete) onComplete();
        }, 4000);
    }

    return {
        init,
        start: showBootScreen
    };
})();

export { BootLoader };

if (typeof window !== 'undefined') {
    window.BootLoader = BootLoader;
    Services.register('BootLoader', BootLoader);
}
