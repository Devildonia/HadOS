import { vi, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { server } from './mocks/server';
import { i18n } from '../js/services/i18n';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Mock global fetch for local files (locales)
// ============================================
global.fetch = vi.fn((url: RequestInfo | URL): Promise<Response> => {
    const urlStr = typeof url === 'object' && url !== null && 'url' in url ? String((url as Request).url) : String(url);
    if (urlStr.includes('/locales/')) {
        const lang = urlStr.split('/').pop()?.replace('.json', '') ?? 'en';
        const filePath = path.resolve(__dirname, `../public/locales/${lang}.json`);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(JSON.parse(content))
            } as Response);
        } catch (e) {
            return Promise.resolve({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                json: () => Promise.reject(new Error(`File not found: ${filePath}`))
            } as Response);
        }
    }
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
    } as Response);
}) as unknown as typeof fetch;

// ============================================
// Mock CONFIG
// ============================================
global.CONFIG = {
    APP: { VERSION: '1.1.0', NAME: 'HadOS', LANGUAGE: 'en' },
    DEBUG: {
        ENABLED: true,
        LOG_EVENTS: true,
        LOG_RAGDOLL: true,
        LOG_AUDIO: true,
        SKIP_INTRO: false,
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
    AUDIO: { ENABLED: true, MASTER_VOLUME: 0.3, BLIP_DURATION: 0.05, BLIP_FREQUENCY_MIN: 400, BLIP_FREQUENCY_MAX: 1200 },
    PERFORMANCE: { RESIZE_DEBOUNCE_MS: 250, SCROLL_DEBOUNCE_MS: 100 }
} satisfies HadOSConfig;

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
    getElement: vi.fn((id: string) => document.getElementById(id)),
    escapeHTML: vi.fn((str: unknown) => {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }),
    sanitizeHTML: vi.fn((html: string) => html),
    getStorage: vi.fn((key: string, defaultValue: any = null) => {
        const value = localStorage.getItem(key);
        try { return value !== null ? JSON.parse(value) : defaultValue; } catch { return defaultValue; }
    }),
    setStorage: vi.fn((key: string, value: any) => {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
    }),
    removeStorage: vi.fn((key: string) => { localStorage.removeItem(key); return true; }),
    debounce: vi.fn((fn: any) => fn)
} as any;

// ============================================
// Mock localStorage
// ============================================
const storage = new Map<string, string>();
global.localStorage = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { storage.set(String(key), String(value)); }),
    clear: vi.fn(() => storage.clear()),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    key: vi.fn((i: number) => Array.from(storage.keys())[i] ?? null),
    get length() { return storage.size; }
} as unknown as Storage;

// ============================================
// Mock window globals used by modules
// ============================================
global.dispatchEvent = vi.fn() as any;
global.CustomEvent = class CustomEvent extends Event {
    detail: any;
    constructor(type: string, opts: CustomEventInit = {}) {
        super(type);
        this.detail = opts.detail || null;
    }
} as any;

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
