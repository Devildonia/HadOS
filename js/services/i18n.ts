/**
 * WINDOWS 95 APP CENTER - i18n (Internationalization)
 * Lightweight translation system with dynamic runtime language switching.
 * v2.0 (TypeScript)
 */

import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import type { TranslationKey } from './i18n-keys';

export interface ITranslationDict {
    [key: string]: string;
}

export interface ITranslationService {
    t(key: TranslationKey | (string & {}), params?: Record<string, string | number>): string;
    getLang(): string;
    setLang(lang: string): Promise<void>;
    updateDOM(): void;
    getAvailable(): string[];
    init(): Promise<void>;
}

// In-memory cache for fetched translation tables
const translationsCache: Record<string, ITranslationDict> = {};

// List of available language locales in the project. Expand this list as new JSON files are added to public/locales.
const AVAILABLE_LANGS = ['en', 'es', 'fr', 'it', 'de', 'sv', 'no', 'da', 'nl', 'pt', 'el', 'hu', 'cs', 'ro', 'ru', 'pl', 'sq', 'uk', 'mt', 'tr', 'gl', 'ca', 'eu', 'zh', 'ja', 'id', 'th', 'vi', 'hi', 'bn', 'ar', 'ko', 'fi', 'sk', 'bg', 'hr', 'tl', 'ms', 'fa', 'he'];
let currentLang: string = 'en';

/**
 * Fetch and cache locale translations
 */
async function loadLocale(lang: string): Promise<ITranslationDict> {
    if (translationsCache[lang]) {
        return translationsCache[lang]!;
    }

    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load locale file: ${lang}.json`);
        }
        const data = await response.json();
        translationsCache[lang] = data;
        return data;
    } catch (error) {
        Utils.Logger.warn(`[i18n] Error loading locale "${lang}", trying fallback:`, error);
        
        // If we are already trying to load the fallback ('en') and fail, return empty dict to prevent infinite loop
        if (lang === 'en') {
            return {};
        }
        
        // Fallback to loading English
        const fallback = await loadLocale('en');
        translationsCache[lang] = fallback;
        return fallback;
    }
}

const i18n: ITranslationService = {
    /**
     * Translate a key, with optional interpolation
     */
    t(key: TranslationKey | (string & {}), params: Record<string, string | number> = {}): string {
        const dict = translationsCache[currentLang] || translationsCache.en || {};
        const enDict = translationsCache.en || {};
        
        let text: string = dict[key] ?? enDict[key] ?? key;

        // Interpolate {param} placeholders
        if (params && typeof text === 'string') {
            Object.keys(params).forEach(k => {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
            });
        }

        return text;
    },

    /**
     * Get current language code
     */
    getLang(): string {
        return currentLang;
    },

    /**
     * Switch language and update all data-i18n elements
     */
    async setLang(lang: string): Promise<void> {
        if (!AVAILABLE_LANGS.includes(lang)) {
            Utils.Logger.warn(`[i18n] Unknown language: ${lang}, falling back to 'en'`);
            lang = 'en';
        }

        await loadLocale(lang);
        currentLang = lang;
        Utils.setStorage('win95-lang', lang);

        if (window.state) window.state.lang = lang;

        // Update all DOM elements with data-i18n attribute
        this.updateDOM();

        // Notify components (open windows, apps) so they can re-render their labels
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('languagechanged', { detail: { lang } }));
        }

        Utils.Logger.log(`[i18n] Language set to: ${lang}`);
    },

    /**
     * Update all elements with data-i18n in the DOM
     */
    updateDOM(): void {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const htmlEl = el as HTMLElement;
            const key = htmlEl.dataset.i18n;
            if (!key) return;

            const text = this.t(key);
            if (htmlEl.tagName === 'INPUT' && (htmlEl as HTMLInputElement).type !== 'submit') {
                (htmlEl as HTMLInputElement).placeholder = text;
            } else {
                htmlEl.textContent = text;
            }
        });
    },

    /**
     * Get list of available languages
     */
    getAvailable(): string[] {
        return AVAILABLE_LANGS;
    },

    /**
     * Initialize — restore saved language and load translation tables
     */
    async init(): Promise<void> {
        const saved = Utils.getStorage<string>('win95-lang', null);
        let targetLang = 'en';

        if (saved && AVAILABLE_LANGS.includes(saved)) {
            targetLang = saved;
        } else {
            // Auto-detect from browser
            const browserLang = (navigator.language || 'en').split('-')[0] || 'en';
            targetLang = AVAILABLE_LANGS.includes(browserLang) ? browserLang : 'en';
        }

        // Load english translations first to ensure we have fallback translations
        await loadLocale('en');
        if (targetLang !== 'en') {
            await loadLocale(targetLang);
        }

        currentLang = targetLang;
        if (window.state) window.state.lang = currentLang;
        
        this.updateDOM();
        Utils.Logger.log(`[i18n] Initialized with lang: ${currentLang}`);
    }
};

export { i18n };

if (typeof window !== 'undefined') {
    Services.register('i18n', i18n);
}
export type { TranslationKey };
