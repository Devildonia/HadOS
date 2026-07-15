/**
 * WINDOWS 95 APP CENTER - HDR MANAGER
 * Manages HDR detection and global visual enhancement states.
 * Version: 1.1 (ES Modules)
 */

import { Utils } from '../utils.js';
import { Services } from '../core/ServiceContainer.js';
import { EventBus } from '../core/EventBus.js';

export interface IHDRManager {
    init(): void;
    toggle(): void;
    destroy(): void;
    isSupported(): boolean;
    isEnabled(): boolean;
}

export const HDRManager: IHDRManager = (() => {
    'use strict';

    let isEnabled: boolean = localStorage.getItem('hdr-enabled') === 'true';
    let isSupported: boolean = false;
    let initialized = false;
    let unsubscribeToggle: (() => void) | null = null;

    function init(): void {
        if (initialized) return;
        checkSupport();
        applyState();
        updateUI();
        unsubscribeToggle = EventBus.on('action:hdr-toggle', toggle);
        initialized = true;
        Utils.Logger.log(`HDRManager: Initialized (Supported: ${isSupported}, Enabled: ${isEnabled})`);
    }

    function destroy(): void {
        if (unsubscribeToggle) {
            unsubscribeToggle();
            unsubscribeToggle = null;
        }
        initialized = false;
    }

    function checkSupport(): void {
        // Detect high dynamic range support via media query
        // dynamic-range: high is the modern standard
        // color-gamut: p3 is a strong indicator of Wide Color Gamut (HDR-adjacent)
        isSupported = window.matchMedia('(dynamic-range: high)').matches ||
            window.matchMedia('(color-gamut: p3)').matches ||
            window.matchMedia('(color-gamut: rec2020)').matches;
    }

    function toggle(): void {
        if (!isSupported) {
            Utils.Logger.warn("HDR is not supported on this display.");
            updateUI(); // Ensure UI reflects the lack of support
            return;
        }
        isEnabled = !isEnabled;
        localStorage.setItem('hdr-enabled', String(isEnabled));
        applyState();
        updateUI();

        const am: any = Services.get('AudioManager');
        if (am) am.play('blip');
    }

    function applyState(): void {
        // Strict check: only apply the class if supported AND enabled
        if (isEnabled && isSupported) {
            document.documentElement.classList.add('hdr-enabled');
        } else {
            document.documentElement.classList.remove('hdr-enabled');
            // If not supported, we should ensure it's disabled in storage for next boot
            if (!isSupported && isEnabled) {
                isEnabled = false;
                localStorage.setItem('hdr-enabled', 'false');
            }
        }
    }

    function updateUI(): void {
        const btn = (document.getElementById('hdr-toggle') || document.getElementById('hdr-toggle-btn')) as HTMLButtonElement | null;
        if (btn) {
            if (!isSupported) {
                btn.disabled = true;
                btn.title = "HDR not supported on this display";
                btn.classList.add('disabled');
                btn.classList.remove('active');
                // Ensure text reflects status
                const text = btn.querySelector('.ragdoll-text') as HTMLElement | null;
                if (text) text.innerText = "HDR (N/A)";
            } else {
                btn.disabled = false;
                btn.classList.toggle('active', isEnabled);
                btn.title = isEnabled ? "Disable HDR Mode" : "Enable HDR Mode";
                const text = btn.querySelector('.ragdoll-text') as HTMLElement | null;
                if (text) text.innerText = "HDR";
            }
        }
    }

    return {
        init,
        toggle,
        destroy,
        isSupported: () => isSupported,
        isEnabled: () => isEnabled
    };
})();

if (typeof window !== 'undefined') {
    Services.register('HDRManager', HDRManager);
}

export default HDRManager;
