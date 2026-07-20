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
    'audiostudio.paused',
    'audiostudio.tab_podcast',
    'audiostudio.tab_dictation',
    'audiostudio.dictation_start',
    'audiostudio.dictation_stop',
    'audiostudio.dictation_placeholder',
    'audiostudio.save_note',
    'app.docexplorer',
    'docexplorer.open_file',
    'docexplorer.drag_drop',
    'docexplorer.ask_placeholder',
    'docexplorer.vector_space',
    'docexplorer.retrieving',
    'docexplorer.answering'
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
                    if (key === 'app.hnscout') json[key] = 'Nova';
                    else if (key === 'hnscout.summarize') json[key] = 'Resumir con IA';
                    else if (key === 'app.messenger') json[key] = 'Tavern Chat';
                    else if (key === 'messenger.import_char') json[key] = 'Importar personaje (.json)';
                    else if (key === 'messenger.select_contact') json[key] = 'Selecciona un contacto para chatear';
                    else if (key === 'messenger.send') json[key] = 'Enviar';
                    else if (key === 'messenger.status_online') json[key] = 'Conectado';
                    else if (key === 'messenger.type_msg') json[key] = 'Escribe un mensaje...';
                    else if (key === 'app.audiostudio') json[key] = 'Voxcribe';
                    else if (key === 'audiostudio.generate') json[key] = 'Generar Podcast';
                    else if (key === 'audiostudio.url_placeholder') json[key] = 'Pega la URL o el texto aquí...';
                    else if (key === 'audiostudio.style') json[key] = 'Estilo de Podcast';
                    else if (key === 'audiostudio.style_narrator') json[key] = 'Narrador Solitario';
                    else if (key === 'audiostudio.style_debate') json[key] = 'Debate Tecnológico';
                    else if (key === 'audiostudio.generating') json[key] = 'Sintetizando Podcast de IA...';
                    else if (key === 'audiostudio.playing') json[key] = 'Reproduciendo Podcast';
                    else if (key === 'audiostudio.paused') json[key] = 'Pausado';
                    else if (key === 'audiostudio.tab_podcast') json[key] = 'Creador de Podcast';
                    else if (key === 'audiostudio.tab_dictation') json[key] = 'Dictador de Voz';
                    else if (key === 'audiostudio.dictation_start') json[key] = 'Iniciar Grabación';
                    else if (key === 'audiostudio.dictation_stop') json[key] = 'Detener';
                    else if (key === 'audiostudio.dictation_placeholder') json[key] = 'Tu transcripción de voz aparecerá aquí...';
                    else if (key === 'audiostudio.save_note') json[key] = 'Guardar en Notas';
                    else if (key === 'app.docexplorer') json[key] = 'Doc Query';
                    else if (key === 'docexplorer.open_file') json[key] = 'Abrir Archivo';
                    else if (key === 'docexplorer.drag_drop') json[key] = 'Selecciona un documento del VFS o arrástralo aquí...';
                    else if (key === 'docexplorer.ask_placeholder') json[key] = 'Haz una pregunta sobre este documento...';
                    else if (key === 'docexplorer.vector_space') json[key] = 'Espacio Vectorial Local LiteRT';
                    else if (key === 'docexplorer.retrieving') json[key] = 'Recuperando fragmentos relevantes...';
                    else if (key === 'docexplorer.answering') json[key] = 'Respuesta Fundamentada';
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
