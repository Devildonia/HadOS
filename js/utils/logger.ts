import { CONFIG } from '../config';

export const Logger = {
    enabled: CONFIG.DEBUG.ENABLED,

    log(...args: unknown[]) {
        if (this.enabled) {
            console.log('[Win95]', ...args);
        }
    },

    info(...args: unknown[]) {
        if (this.enabled) {
            console.info('[Win95]', ...args);
        }
    },

    warn(...args: unknown[]) {
        if (this.enabled) {
            console.warn('[Win95]', ...args);
        }
    },

    error(...args: unknown[]) {
        // Always show errors, even in production
        console.error('[Win95 ERROR]', ...args);
    },

    group(label: string) {
        if (this.enabled) {
            console.group('[Win95]', label);
        }
    },

    groupEnd() {
        if (this.enabled) {
            console.groupEnd();
        }
    },

    // Specific loggers
    init(...args: unknown[]) {
        if (this.enabled) {
            console.log('[Win95:INIT]', ...args);
        }
    },

    game(...args: unknown[]) {
        if (this.enabled && CONFIG.DEBUG.LOG_EVENTS) {
            console.log('[Win95:GAME]', ...args);
        }
    },

    ragdoll(...args: unknown[]) {
        if (this.enabled && CONFIG.DEBUG.LOG_RAGDOLL) {
            console.log('[Win95:RAGDOLL]', ...args);
        }
    },

    audio(...args: unknown[]) {
        if (this.enabled && CONFIG.DEBUG.LOG_AUDIO) {
            console.log('[Win95:AUDIO]', ...args);
        }
    },

    window(...args: unknown[]) {
        if (this.enabled) {
            console.log('[Win95:WINDOW]', ...args);
        }
    }
};
