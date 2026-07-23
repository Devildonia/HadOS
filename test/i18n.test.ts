import { EventBus } from '../js/core/EventBus';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { i18n } from '../js/services/i18n';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('i18n', () => {
    beforeEach(async () => {
        localStorage.clear();
        // Reset to English
        await i18n.setLang('en');
    });

    describe('t() — translation', () => {
        it('should translate known keys in English', () => {
            expect(i18n.t('app.notepad')).toBe('Notapad');
            expect(i18n.t('app.paint')).toBe('Pinta');
            expect(i18n.t('menu.shutdown')).toBe('Shut Down...');
        });

        it('should translate known keys in Spanish', async () => {
            await i18n.setLang('es');
            expect(i18n.t('app.settings')).toBe('Configuración');
            expect(i18n.t('app.mycomputer')).toBe('Mi PC');
            expect(i18n.t('menu.shutdown')).toBe('Apagar...');
        });

        it('should interpolate parameters', () => {
            const result = i18n.t('notify.file_saved', { name: 'notes.txt' });
            expect(result).toBe('File saved: notes.txt');
        });

        it('should interpolate parameters in Spanish', async () => {
            await i18n.setLang('es');
            const result = i18n.t('notify.file_saved', { name: 'notas.txt' });
            expect(result).toBe('Archivo guardado: notas.txt');
        });

        it('should return the key itself as fallback for unknown keys', () => {
            expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
        });

        it('should fall back to English when key missing in current lang', async () => {
            await i18n.setLang('es');
            // A key that exists in both and genuinely differs (app.notepad is now
            // the brand "Notapad", identical everywhere, so it would not prove this).
            const translated = i18n.t('app.mycomputer');
            expect(translated).toBe('Mi PC');
        });
    });

    describe('setLang / getLang', () => {
        it('should switch language and report current', async () => {
            await i18n.setLang('es');
            expect(i18n.getLang()).toBe('es');
            await i18n.setLang('en');
            expect(i18n.getLang()).toBe('en');
        });

        it('should fall back to English for unknown language', async () => {
            await i18n.setLang('xx');
            expect(i18n.getLang()).toBe('en');
        });

        it('should persist language to localStorage', async () => {
            await i18n.setLang('es');
            expect(localStorage.getItem('win95-lang')).not.toBeNull();
        });
    });

    describe('getAvailable', () => {
        it('should return at least en and es', () => {
            const langs = i18n.getAvailable();
            expect(langs).toContain('en');
            expect(langs).toContain('es');
        });
    });

    describe('updateDOM', () => {
        it('should update data-i18n elements with translated text', () => {
            document.body.innerHTML = '<span data-i18n="app.notepad">old</span>';
            i18n.updateDOM();
            expect(document.querySelector('[data-i18n]')!.textContent).toBe('Notapad');
        });

        it('should update placeholder for input elements', () => {
            document.body.innerHTML = '<input type="text" data-i18n="app.notepad">';
            i18n.updateDOM();
            expect((document.querySelector('input') as HTMLInputElement).placeholder).toBe('Notapad');
        });

        it('should switch all elements when language changes', async () => {
            // app.notepad/app.paint are brand names now (Notapad/Pinta, identical in
            // every locale), so they no longer prove a language switch. mycomputer
            // and settings still translate.
            document.body.innerHTML = `
                <span data-i18n="app.mycomputer"></span>
                <span data-i18n="app.settings"></span>
            `;
            await i18n.setLang('es');
            const spans = document.querySelectorAll('[data-i18n]');
            expect(spans[0]!.textContent).toBe('Mi PC');
            expect(spans[1]!.textContent).toBe('Configuración');
        });
    });

    describe('init', () => {
        it('should restore saved language from storage', async () => {
            localStorage.setItem('win95-lang', JSON.stringify('es'));
            await i18n.init();
            expect(i18n.getLang()).toBe('es');
        });

        it('should default to English when no saved language', async () => {
            localStorage.clear();
            await i18n.init();
            expect(i18n.getLang()).toBe('en');
        });
    });

    // Guards against locales drifting out of sync as new keys are added.
    describe('key parity across locales', () => {
        const localesDir = path.resolve(__dirname, '../public/locales');
        const langFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));
        const locales: Record<string, Record<string, string>> = {};

        for (const file of langFiles) {
            const lang = file.replace('.json', '');
            const content = fs.readFileSync(path.join(localesDir, file), 'utf8');
            locales[lang] = JSON.parse(content);
        }

        const enKeys = Object.keys(locales['en']!).sort();

        for (const lang of Object.keys(locales)) {
            it(`"${lang}" defines exactly the same keys as "en"`, () => {
                const keys = Object.keys(locales[lang]!).sort();
                const missing = enKeys.filter(k => !keys.includes(k));
                const extra = keys.filter(k => !enKeys.includes(k));
                expect({ missing, extra }).toEqual({ missing: [], extra: [] });
            });

            it(`"${lang}" has no empty values`, () => {
                const empty = Object.entries(locales[lang]!)
                    .filter(([, v]) => typeof v !== 'string' || v.trim() === '')
                    .map(([k]) => k);
                expect(empty).toEqual([]);
            });
        }
    });

    describe('setLang side effects', () => {
        it('should emit a languagechanged event carrying the new lang on EventBus', async () => {
            const listener = vi.fn();
            const unbind = EventBus.on('languagechanged', listener);
            await i18n.setLang('es');
            expect(listener).toHaveBeenCalledWith({ lang: 'es' });
            unbind();
        });
    });

    describe('Ragdoll Pet Phrases Localization', () => {
        it('should resolve ragdoll phrases in English', () => {
            expect(i18n.t('ragdoll.greetings.hi')).toBe('Hi!');
            expect(i18n.t('ragdoll.hurt.ouch')).toBe('Ouch!');
            expect(i18n.t('ragdoll.eating.nomnom')).toBe('Nom nom');
        });

        it('should resolve ragdoll phrases in Spanish', async () => {
            await i18n.setLang('es');
            expect(i18n.t('ragdoll.greetings.hi')).toBe('¡Hola!');
            expect(i18n.t('ragdoll.hurt.ouch')).toBe('¡Ay!');
            expect(i18n.t('ragdoll.eating.nomnom')).toBe('Ñam ñam');
        });

        it('should resolve ragdoll phrases in French', async () => {
            await i18n.setLang('fr');
            expect(i18n.t('ragdoll.greetings.hi')).toBe('Salut !');
            expect(i18n.t('ragdoll.hurt.ouch')).toBe('Aïe !');
            expect(i18n.t('ragdoll.eating.nomnom')).toBe('Miam miam');
        });
    });
});
