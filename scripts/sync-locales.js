import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, '../public/locales');
const enContent = fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8');
const enJson = JSON.parse(enContent);
const enKeys = Object.keys(enJson);

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'en.json');

for (const file of files) {
    const filePath = path.join(localesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    let updated = false;

    for (const key of enKeys) {
        if (json[key] === undefined) {
            json[key] = enJson[key];
            updated = true;
        }
    }

    if (updated) {
        // Keep key ordering identical to en.json for clean diffs
        const sortedJson = {};
        for (const key of enKeys) {
            sortedJson[key] = json[key];
        }
        fs.writeFileSync(filePath, JSON.stringify(sortedJson, null, 2) + '\n', 'utf8');
        console.log(`Synced missing keys to ${file}`);
    }
}
