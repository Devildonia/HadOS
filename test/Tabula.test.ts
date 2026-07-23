/**
 * TABULA — the numbers must be real.
 * Pins the pure layer (parser, numeric detection, stats, narration prompt): if
 * these are right, everything the model is allowed to say is right, because it
 * is only allowed to say these.
 */
import { describe, it, expect } from 'vitest';
import { parseCsv, detectDelimiter, computeColumnStats, buildCsvNarrationPrompt, fmt } from '../js/apps/tabula/csv';
import { HadOSTabula } from '../js/apps/HadOSTabula';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('parseCsv', () => {
    it('parses plain comma CSV with headers', () => {
        const t = parseCsv('a,b,c\n1,2,3\n4,5,6');
        expect(t.headers).toEqual(['a', 'b', 'c']);
        expect(t.rows).toEqual([['1', '2', '3'], ['4', '5', '6']]);
        expect(t.delimiter).toBe(',');
    });

    it('handles quoted fields with embedded delimiters, quotes and newlines', () => {
        const t = parseCsv('name,quote\n"Doe, John","She said ""hi""\nand left"');
        expect(t.rows[0]).toEqual(['Doe, John', 'She said "hi"\nand left']);
    });

    it('detects semicolon (EU exports) and tab delimiters', () => {
        expect(detectDelimiter('a;b;c')).toBe(';');
        expect(detectDelimiter('a\tb\tc')).toBe('\t');
        expect(parseCsv('x;y\n1;2').rows[0]).toEqual(['1', '2']);
    });

    it('survives CRLF endings and the Excel BOM, and pads short rows', () => {
        const t = parseCsv('﻿a,b,c\r\n1,2\r\n');
        expect(t.headers).toEqual(['a', 'b', 'c']);
        expect(t.rows).toEqual([['1', '2', '']]);
    });
});

describe('computeColumnStats', () => {
    it('computes real numeric stats (count, missing, min, max, mean, sum)', () => {
        // The empty cell is a real hole in a real row; fully-blank LINES are
        // dropped by the parser and rightly don't count as missing values.
        const t = parseCsv('id,v\na,10\nb,20\nc,\nd,30');
        const s = computeColumnStats(t)[1]!;
        expect(s).toMatchObject({ kind: 'numeric', count: 3, missing: 1, min: 10, max: 30, mean: 20, sum: 60 });
    });

    it('understands EU decimal commas and thousands separators', () => {
        const t = parseCsv('v\n"1.234,50"\n"2.000,50"');
        const s = computeColumnStats(t)[0]!;
        expect(s.kind).toBe('numeric');
        if (s.kind === 'numeric') expect(s.sum).toBeCloseTo(3235, 5);
    });

    it('classifies mostly-text columns as text with distinct/top counts', () => {
        const t = parseCsv('city\nMadrid\nMadrid\nParis\n');
        const s = computeColumnStats(t)[0]!;
        expect(s).toMatchObject({ kind: 'text', count: 3, distinct: 2, top: 'Madrid', topCount: 2 });
    });

    it('a column with a stray label but ≥80% numbers stays numeric', () => {
        const t = parseCsv('v\n1\n2\n3\n4\nn/a');
        const s = computeColumnStats(t)[0]!;
        expect(s.kind).toBe('numeric');
        if (s.kind === 'numeric') expect(s.count).toBe(4);
    });
});

describe('buildCsvNarrationPrompt', () => {
    it('hands the model every figure precomputed and forbids inventing', () => {
        const t = parseCsv('v\n10\n30');
        const { persona, user } = buildCsvNarrationPrompt('ventas.csv', 2, computeColumnStats(t), 'es');
        expect(persona).toContain('PROHIBIDO inventar');
        expect(user).toContain('"ventas.csv" — 2 filas, 1 columnas');
        expect(user).toContain('min 10, max 30, media 20, suma 40');
    });
});

describe('fmt', () => {
    it('keeps integers clean and rounds decimals to 2', () => {
        expect(fmt(20)).toBe('20');
        expect(fmt(20.456)).toBe('20.46');
    });
});

describe('HadOSTabula (app)', () => {
    it('renders and honestly hides the narration button without a model', () => {
        const app = new HadOSTabula();
        const body = WindowFactory.getBody(app.windowId)!;
        expect(body.querySelector('#tabula-open-btn')).not.toBeNull();
        expect(body.textContent).toContain('todo el análisis ocurre en tu equipo');
        // No CSV loaded and no Gemma → narrate stays hidden.
        expect((body.querySelector('#tabula-narrate-btn') as HTMLElement).style.display).toBe('none');
        app.terminate();
    });

    it('loads a CSV and renders code-computed stats and the preview', () => {
        const app = new HadOSTabula();
        const body = WindowFactory.getBody(app.windowId)!;
        (app as unknown as { fileName: string }).fileName = 'test.csv';
        (app as unknown as { loadCsv(t: string): void }).loadCsv('name,score\nAda,90\nGrace,95');
        expect(body.querySelector('#tabula-stats')!.textContent).toContain('números reales, no generados');
        expect(body.querySelector('#tabula-stats')!.textContent).toContain('media 92.5');
        expect(body.querySelector('#tabula-preview')!.textContent).toContain('Grace');
        app.terminate();
    });
});
