import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, '../public/locales');
const enContent = fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8');
const enJson = JSON.parse(enContent) as Record<string, string>;

// Keys we want to translate
const keysToTranslate = [
    'app.hnscout',
    'hnscout.summarize',
    'app.messenger',
    'messenger.import_char',
    'messenger.select_contact',
    'messenger.send',
    'messenger.status_online',
    'messenger.type_msg',
    'app.audiostudio',
    'audiostudio.generate',
    'audiostudio.url_placeholder',
    'audiostudio.style',
    'audiostudio.style_narrator',
    'audiostudio.style_debate',
    'audiostudio.generating',
    'audiostudio.playing',
    'audiostudio.paused'
];

async function translateText(text: string, targetLang: string): Promise<string> {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        // Parse Google Translate single char response
        return data[0][0][0] as string;
    } catch (err) {
        console.warn(`Failed to translate "${text}" to ${targetLang}, falling back:`, err);
        return text;
    }
}

async function run() {
    const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'en.json');
    console.log(`Starting translation for ${files.length} languages...`);

    for (const file of files) {
        const targetLang = file.replace('.json', '');
        const filePath = path.join(localesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content) as Record<string, string>;
        let updated = false;

        for (const key of keysToTranslate) {
            // Translate if it's currently English or missing
            const englishVal = enJson[key];
            if (json[key] === undefined || json[key] === englishVal) {
                if (targetLang === 'es') {
                    // Spanish custom translates
                    if (key === 'app.hnscout') json[key] = 'HN Scout';
                    else if (key === 'hnscout.summarize') json[key] = 'Resumir con IA';
                    else if (key === 'app.messenger') json[key] = 'HadOS Messenger';
                    else if (key === 'messenger.import_char') json[key] = 'Importar personaje (.json)';
                    else if (key === 'messenger.select_contact') json[key] = 'Selecciona un contacto para chatear';
                    else if (key === 'messenger.send') json[key] = 'Enviar';
                    else if (key === 'messenger.status_online') json[key] = 'Conectado';
                    else if (key === 'messenger.type_msg') json[key] = 'Escribe un mensaje...';
                    else if (key === 'app.audiostudio') json[key] = 'Estudio de Audio';
                    else if (key === 'audiostudio.generate') json[key] = 'Generar Podcast';
                    else if (key === 'audiostudio.url_placeholder') json[key] = 'Pega la URL o el texto aquí...';
                    else if (key === 'audiostudio.style') json[key] = 'Estilo de Podcast';
                    else if (key === 'audiostudio.style_narrator') json[key] = 'Narrador Solitario';
                    else if (key === 'audiostudio.style_debate') json[key] = 'Debate Tecnológico';
                    else if (key === 'audiostudio.generating') json[key] = 'Sintetizando Podcast de IA...';
                    else if (key === 'audiostudio.playing') json[key] = 'Reproduciendo Podcast';
                    else if (key === 'audiostudio.paused') json[key] = 'Pausado';
                    updated = true;
                } else {
                    const translated = await translateText(englishVal, targetLang);
                    json[key] = translated;
                    updated = true;
                }
            }
        }

        if (updated) {
            // Sort keys identical to en.json ordering
            const sortedJson: Record<string, string> = {};
            for (const key of Object.keys(enJson)) {
                sortedJson[key] = json[key] ?? enJson[key];
            }
            fs.writeFileSync(filePath, JSON.stringify(sortedJson, null, 2) + '\n', 'utf8');
            console.log(`✓ Translated and saved ${file}`);
        }
        // Small delay to prevent rate limit
        await new Promise(r => setTimeout(r, 150));
    }

    console.log("Translation process finished successfully.");
}

run().catch(console.error);
