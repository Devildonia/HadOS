import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Mock global fetch for local files (locales)
// ============================================
global.fetch = vi.fn((url) => {
    const urlStr = typeof url === 'object' && url !== null && 'url' in url ? String(url.url) : String(url);
    if (urlStr.includes('/locales/')) {
        const lang = urlStr.split('/').pop().replace('.json', '');
        const filePath = path.resolve(__dirname, `../public/locales/${lang}.json`);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(JSON.parse(content))
            });
        } catch (e) {
            return Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: () => Promise.reject(new Error(`File not found: ${filePath}`))
            });
        }
    }
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
    });
});

// ============================================
// Mock CONFIG
// ============================================
global.CONFIG = {
    APP: { VERSION: '1.6.7', NAME: 'Windows App Center', LANGUAGE: 'en' },
    DEBUG: {
        ENABLED: true,
        LOG_EVENTS: true,
        LOG_RAGDOLL: true,
        LOG_AUDIO: true,
        SKIP_INTRO: false,
        LOG_AUDIO: false,
        SHOW_PHYSICS_DEBUG: false
    },
    TASKBAR: { HEIGHT: 40, Z_INDEX: 1000 },
    WINDOWS: {
        Z_INDEX_BASE: 100,
        Z_INDEX_INCREMENT: 10,
        MAX_Z_INDEX: 950,
        DEFAULT_WIDTH: 600,
        DEFAULT_HEIGHT: 400
    },
    RAGDOLL: {
        SCALE: 1.0,
        JUMP_DURATION: 1000,
        FEAR_RADIUS: 150,
        ANGER_RADIUS: 50
    },
    Z_INDEX: {
        DESKTOP: 1,
        RAGDOLL_CANVAS: 5,
        STICKY_NOTE: 50,
        WINDOWS: 100,
        DIALOGS: 500,
        TASKBAR: 1000,
        START_MENU: 10000,
        BIOS: 100000,
        BSOD: 200000
    },
    COLORS: { TEAL: '#008080', WIN_GRAY: '#c0c0c0' },
    ANIMATIONS: { BIOS_DURATION: 2000, SPLASH_DURATION: 3000, SPLASH_PROGRESS_DURATION: 2500, BOOT_DELAY: 500 },
    AUDIO: { ENABLED: true, MASTER_VOLUME: 0.3, BLIP_DURATION: 0.05, BLIP_FREQUENCY_MIN: 400, BLIP_FREQUENCY_MAX: 1200 },
    PERFORMANCE: { RESIZE_DEBOUNCE_MS: 250, SCROLL_DEBOUNCE_MS: 100 }
};

// ============================================
// Mock Utils
// ============================================
global.Utils = {
    Logger: {
        log: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        group: vi.fn(),
        groupEnd: vi.fn(),
        init: vi.fn(),
        game: vi.fn(),
        ragdoll: vi.fn(),
        audio: vi.fn(),
        window: vi.fn()
    },
    getElement: vi.fn((id) => document.getElementById(id)),
    escapeHTML: vi.fn((str) => {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }),
    sanitizeHTML: vi.fn((html) => html),
    getStorage: vi.fn((key, defaultValue = null) => {
        const value = localStorage.getItem(key);
        try { return value !== null ? JSON.parse(value) : defaultValue; } catch { return defaultValue; }
    }),
    setStorage: vi.fn((key, value) => {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
    }),
    removeStorage: vi.fn((key) => { localStorage.removeItem(key); return true; }),
    debounce: vi.fn((fn) => fn)
};

// ============================================
// Mock localStorage
// ============================================
const storage = new Map();
global.localStorage = {
    getItem: vi.fn((key) => storage.get(key) ?? null),
    setItem: vi.fn((key, value) => { storage.set(String(key), String(value)); }),
    clear: vi.fn(() => storage.clear()),
    removeItem: vi.fn((key) => storage.delete(key)),
    key: vi.fn((i) => Array.from(storage.keys())[i]),
    get length() { return storage.size; }
};

// ============================================
// Mock window globals used by modules
// ============================================
global.dispatchEvent = vi.fn();
global.CustomEvent = class CustomEvent extends Event {
    constructor(type, opts = {}) {
        super(type);
        this.detail = opts.detail || null;
    }
};

// ============================================
import { server } from './mocks/server.js';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { i18n } from '../js/services/i18n.js';

beforeAll(async () => {
    server.listen({ onUnhandledRequest: 'warn' });
    try {
        await i18n.init();
    } catch (e) {
        console.error('Failed to initialize i18n in test setup:', e);
    }
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
