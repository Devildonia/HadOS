/**
 * TABULA — CSV parsing and column statistics (pure)
 *
 * The division of labour is the whole design: THIS code computes every number
 * (an LLM doing arithmetic is a hallucination with confidence), and the model —
 * if one is imported — only narrates the numbers it is handed. Pure and
 * dependency-free so every branch is pinned by tests.
 */

export interface ICsvTable {
    headers: string[];
    rows: string[][];
    delimiter: string;
}

export type IColumnStats =
    | {
        name: string; kind: 'numeric';
        count: number; missing: number;
        min: number; max: number; mean: number; sum: number;
    }
    | {
        name: string; kind: 'text';
        count: number; missing: number;
        distinct: number; top: string; topCount: number;
    };

/** Sniffs `,` vs `;` (Spanish locales export with `;`) vs tab, on the first line. */
export function detectDelimiter(firstLine: string): string {
    const counts: Array<[string, number]> = [',', ';', '\t'].map(d => [d, firstLine.split(d).length - 1]);
    counts.sort((a, b) => b[1] - a[1]);
    return counts[0]![1] > 0 ? counts[0]![0] : ',';
}

/**
 * RFC-4180-shaped parser: quoted fields, doubled quotes inside quotes, CRLF and
 * LF endings, delimiter auto-detected. Rows shorter than the header are padded,
 * longer ones keep their extras — the stats count what is actually there.
 */
export function parseCsv(text: string): ICsvTable {
    const clean = text.replace(/^﻿/, ''); // Excel loves its BOM
    const firstNewline = clean.indexOf('\n');
    const delimiter = detectDelimiter(firstNewline === -1 ? clean : clean.slice(0, firstNewline));

    const rows: string[][] = [];
    let field = '';
    let row: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < clean.length; i++) {
        const c = clean[i]!;
        if (inQuotes) {
            if (c === '"') {
                if (clean[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else field += c;
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === delimiter) {
            row.push(field); field = '';
        } else if (c === '\n' || c === '\r') {
            if (c === '\r' && clean[i + 1] === '\n') i++;
            row.push(field); field = '';
            if (row.length > 1 || row[0] !== '') rows.push(row);
            row = [];
        } else field += c;
    }
    row.push(field);
    if (row.length > 1 || row[0] !== '') rows.push(row);

    const headers = rows.shift() ?? [];
    const width = headers.length;
    for (const r of rows) while (r.length < width) r.push('');
    return { headers: headers.map(h => h.trim()), rows, delimiter };
}

/** Parses a number tolerating thousands separators and decimal commas. */
function toNumber(raw: string): number | null {
    const s = raw.trim();
    if (!s) return null;
    // "1.234,56" (EU) vs "1,234.56" (US) vs plain "1234.56"
    let normal = s.replace(/\s/g, '');
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(normal)) normal = normal.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(normal)) normal = normal.replace(/,/g, '');
    else if (/^-?\d+,\d+$/.test(normal)) normal = normal.replace(',', '.');
    const n = Number(normal);
    return Number.isFinite(n) ? n : null;
}

/** A column is numeric when ≥80% of its non-empty cells parse as numbers. */
export function computeColumnStats(table: ICsvTable): IColumnStats[] {
    return table.headers.map((name, col) => {
        const cells = table.rows.map(r => (r[col] ?? '').trim());
        const present = cells.filter(c => c !== '');
        const missing = cells.length - present.length;
        const numbers = present.map(toNumber).filter((n): n is number => n !== null);

        if (present.length > 0 && numbers.length / present.length >= 0.8) {
            const sum = numbers.reduce((a, b) => a + b, 0);
            return {
                name, kind: 'numeric' as const,
                count: numbers.length, missing,
                min: Math.min(...numbers), max: Math.max(...numbers),
                mean: sum / numbers.length, sum,
            };
        }

        const freq = new Map<string, number>();
        for (const c of present) freq.set(c, (freq.get(c) ?? 0) + 1);
        let top = ''; let topCount = 0;
        for (const [v, n] of freq) if (n > topCount) { top = v; topCount = n; }
        return { name, kind: 'text' as const, count: present.length, missing, distinct: freq.size, top, topCount };
    });
}

/** Rounds for prompt/table display without scientific noise. */
export function fmt(n: number): string {
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

/**
 * The narration prompt: every figure the model may mention is IN the prompt,
 * already computed — the instruction forbids inventing or recalculating.
 */
export function buildCsvNarrationPrompt(
    fileName: string,
    rowCount: number,
    stats: IColumnStats[],
    lang: string,
): { persona: string; user: string } {
    const langName = lang === 'es' ? 'español' : `the user-interface language (${lang})`;
    const persona =
        `Eres un analista de datos. Se te dan estadísticas YA CALCULADAS de un CSV. ` +
        `Nárralas de forma clara señalando lo notable (rangos, huecos, dominancias). ` +
        `PROHIBIDO inventar o recalcular cifras: usa solo los números proporcionados. ` +
        `Responde en ${langName}, en 4-7 frases.`;

    const lines = stats.map(s => s.kind === 'numeric'
        ? `- ${s.name} (numérica): ${s.count} valores, ${s.missing} vacíos, min ${fmt(s.min)}, max ${fmt(s.max)}, media ${fmt(s.mean)}, suma ${fmt(s.sum)}`
        : `- ${s.name} (texto): ${s.count} valores, ${s.missing} vacíos, ${s.distinct} distintos, el más frecuente "${s.top}" (${s.topCount} veces)`);

    return {
        persona,
        user: `Archivo "${fileName}" — ${rowCount} filas, ${stats.length} columnas.\n${lines.join('\n')}\n\nNarra el análisis.`,
    };
}
