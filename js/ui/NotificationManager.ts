import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';

export interface INotify {
    info(message: string, options?: { duration?: number }): number;
    success(message: string, options?: { duration?: number }): number;
    warn(message: string, options?: { duration?: number }): number;
    error(message: string, options?: { duration?: number }): number;
    i18n(type: 'info' | 'success' | 'warn' | 'error', i18nKey: string, params?: Record<string, any>): number;
    clear(): void;
    destroy(): void;
}

// ============================================
// NOTIFICATION CONTAINER (injected into DOM)
// ============================================
let container: HTMLDivElement | null = null;
let notificationId = 0;
const activeTimers = new Set<ReturnType<typeof setTimeout>>();

const ICONS: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warn: '⚠️',
    error: '❌'
};

const DURATION_MS: Record<string, number> = {
    info: 3000,
    success: 3000,
    warn: 5000,
    error: 7000
};

function ensureContainer(): void {
    if (container && document.body.contains(container)) return;

    container = document.createElement('div');
    container.id = 'win95-notifications';
    container.style.cssText = `
        position: fixed;
        bottom: 40px;
        right: 8px;
        z-index: 99999;
        display: flex;
        flex-direction: column-reverse;
        gap: 4px;
        pointer-events: none;
        max-height: 60vh;
        overflow: hidden;
    `;
    document.body.appendChild(container);
}

function trackTimer(timerId: ReturnType<typeof setTimeout>): ReturnType<typeof setTimeout> {
    activeTimers.add(timerId);
    return timerId;
}

function clearTrackedTimers(): void {
    activeTimers.forEach((timerId) => clearTimeout(timerId));
    activeTimers.clear();
}

function createNotification(type: 'info' | 'success' | 'warn' | 'error', message: string, options: { duration?: number } = {}): number {
    ensureContainer();

    const id = ++notificationId;
    const duration = options.duration ?? DURATION_MS[type] ?? 3000;
    const icon = ICONS[type] || 'ℹ️';

    const el = document.createElement('div');
    el.className = 'win95-notification';
    el.dataset.notifyId = id.toString();
    el.style.cssText = `
        background: #c0c0c0;
        border: 2px outset #dfdfdf;
        padding: 6px 10px;
        font-family: 'MS Sans Serif', 'Microsoft Sans Serif', Tahoma, sans-serif;
        font-size: 11px;
        color: #000;
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 200px;
        max-width: 320px;
        pointer-events: auto;
        cursor: pointer;
        box-shadow: 1px 1px 0 #000, inset -1px -1px 0 #808080;
        animation: win95-notify-in 0.2s ease-out;
        opacity: 1;
        transition: opacity 0.3s, transform 0.3s;
    `;

    // Title bar (tiny, like Win95 tooltip)
    const titleBar = type === 'error' ? 'background: #000080; color: #fff; padding: 1px 4px; font-weight: bold; font-size: 10px; margin: -6px -10px 4px -10px; padding: 2px 6px;' :
        'display: none;';

    el.innerHTML = `
        <div style="${titleBar}">${type === 'error' ? 'System Error' : ''}</div>
        <span style="font-size: 14px; flex-shrink: 0;">${icon}</span>
        <span style="flex: 1; word-break: break-word;">${Utils.escapeHTML(message)}</span>
        <span style="font-size: 10px; color: #808080; cursor: pointer; padding: 0 2px;" data-dismiss="true">×</span>
    `;

    // Click to dismiss
    el.addEventListener('click', () => dismissNotification(el));

    if (container) container.appendChild(el);

    // Auto-dismiss
    if (duration > 0) {
        trackTimer(setTimeout(() => dismissNotification(el), duration));
    }

    // Play blip for errors/warnings
    if (type === 'error' || type === 'warn') {
        const am: any = Services.get('AudioManager');
        if (am) {
            am.play('blip', { frequency: type === 'error' ? 400 : 600 });
        }
    }

    return id;
}

function dismissNotification(el: HTMLDivElement): void {
    if (!el || !el.parentNode) return;
    el.style.opacity = '0';
    el.style.transform = 'translateX(100%)';
    trackTimer(setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, 300));
}

// ============================================
// PUBLIC API
// ============================================
const Notify: INotify = {
    info(message, options) { return createNotification('info', message, options); },
    success(message, options) { return createNotification('success', message, options); },
    warn(message, options) { return createNotification('warn', message, options); },
    error(message, options) { return createNotification('error', message, options); },

    /**
     * Show a notification using i18n key
     * @param {string} type - info|success|warn|error
     * @param {string} i18nKey - Translation key
     * @param {Object} params - Interpolation params
     */
    i18n(type, i18nKey, params) {
        const i18nService: any = Services.get('i18n');
        const message = i18nService ? i18nService.t(i18nKey, params) : i18nKey;
        return createNotification(type, message);
    },

    /**
     * Dismiss all notifications
     */
    clear() {
        clearTrackedTimers();
        if (container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    },

    destroy() {
        clearTrackedTimers();
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        container = null;
        notificationId = 0;
    }
};

export { Notify };

if (typeof window !== 'undefined') {
    Services.register('Notify', Notify);
}
