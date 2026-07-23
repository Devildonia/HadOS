/**
 * AI PHASE 6 — the pure layers of Hada's hands, Notapad's pen, Voxcribe's ear
 * for music. As always: what rides into the model and what is allowed to come
 * out of it are the parts that must never drift, so they are the parts pinned.
 */
import { describe, it, expect } from 'vitest';

import { buildIntentPrompt, parseIntent } from '../js/ai/intents';
import { buildWritingPrompt, MAX_WRITING_CHARS } from '../js/ai/writing';
import { parseMelody, noteToFreq, buildMelodyPrompt, MAX_MELODY_NOTES } from '../js/ai/melody';

// ── Voice intents (the safety boundary of Hada's hands) ──────────────────────

describe('parseIntent', () => {
    const allowed = ['paint', 'notepad', 'tabula'];

    it('accepts a valid launch intent and strips the JSON from the speech', () => {
        const { intent, speech } = parseIntent('{"action":"launch","app":"paint"} ¡Abriendo Pinta!', allowed);
        expect(intent).toEqual({ action: 'launch', app: 'paint' });
        expect(speech).toBe('¡Abriendo Pinta!');
    });

    it('rejects an app that is not in the allowlist — words, never actions', () => {
        const { intent } = parseIntent('{"action":"launch","app":"rm -rf /"}', allowed);
        expect(intent).toBeNull();
        const { intent: i2 } = parseIntent('{"action":"launch","app":"terminal"}', allowed);
        expect(i2).toBeNull(); // real-sounding but not offered
    });

    it('rejects any action other than launch', () => {
        expect(parseIntent('{"action":"delete","app":"paint"}', allowed).intent).toBeNull();
        expect(parseIntent('{"action":"eval","app":"paint"}', allowed).intent).toBeNull();
    });

    it('malformed JSON and brace-y conversation degrade to plain speech', () => {
        expect(parseIntent('{action: launch, app: paint}', allowed).intent).toBeNull();
        const chat = parseIntent('Las llaves {así} son solo texto.', allowed);
        expect(chat.intent).toBeNull();
        expect(chat.speech).toContain('llaves');
    });

    it('only the FIRST JSON block is ever considered', () => {
        const out = parseIntent('{"action":"none"} {"action":"launch","app":"paint"}', allowed);
        expect(out.intent).toBeNull(); // first block is not a valid launch → no action
    });
});

describe('buildIntentPrompt', () => {
    it('offers exactly the allowlisted ids and constrains the JSON shape', () => {
        const p = buildIntentPrompt([{ id: 'paint', name: 'Pinta' }, { id: 'tabula', name: 'Tabula' }], 'es');
        expect(p).toContain('"paint" (Pinta)');
        expect(p).toContain('"tabula" (Tabula)');
        expect(p).toContain('{"action":"launch","app":"<id>"}');
        expect(p).toContain('no inventes ids');
    });
});

// ── Writing actions (Notapad) ────────────────────────────────────────────────

describe('buildWritingPrompt', () => {
    it('each action instructs work-with-the-text-only', () => {
        for (const kind of ['summarize', 'rewrite', 'translate', 'title'] as const) {
            const { persona } = buildWritingPrompt(kind, 'hola mundo', 'es');
            expect(persona).toContain('SOLO con el texto proporcionado');
        }
    });

    it('caps the source at the token budget and says so', () => {
        const long = 'x'.repeat(MAX_WRITING_CHARS + 500);
        const { user, truncated } = buildWritingPrompt('summarize', long, 'es');
        expect(truncated).toBe(true);
        expect(user).toContain('recortado');
        expect(user.length).toBeLessThan(MAX_WRITING_CHARS + 200);
    });
});

// ── Melody notation (Voxcribe) ───────────────────────────────────────────────

describe('parseMelody', () => {
    it('parses valid tokens into frequencies and durations', () => {
        const notes = parseMelody('A4:q C5:e R:h');
        expect(notes.length).toBe(3);
        expect(notes[0]!.freq).toBeCloseTo(440, 3);   // A4 is the tuning fork
        expect(notes[0]!.ms).toBe(500);               // quarter at 120 bpm
        expect(notes[1]!.ms).toBe(250);               // eighth
        expect(notes[2]!.freq).toBe(0);               // rest
        expect(notes[2]!.ms).toBe(1000);              // half
    });

    it('handles accidentals and octaves correctly', () => {
        expect(parseMelody('C4:q')[0]!.freq).toBeCloseTo(261.63, 1);
        expect(parseMelody('C#4:q')[0]!.freq).toBeCloseTo(277.18, 1);
        expect(parseMelody('Bb3:q')[0]!.freq).toBeCloseTo(233.08, 1);
        expect(parseMelody('A5:q')[0]!.freq).toBeCloseTo(880, 2); // octave doubles
    });

    it('skips invalid tokens — a rambling model cannot break playback', () => {
        const notes = parseMelody('Here is your melody! C4:q lovely G9:q H4:q E4:x E4:e');
        expect(notes.length).toBe(2); // C4:q and E4:e survive; G9 (octave), H (note), :x (duration) do not
    });

    it('caps the sequence at MAX_MELODY_NOTES', () => {
        const spam = Array.from({ length: MAX_MELODY_NOTES + 20 }, () => 'C4:e').join(' ');
        expect(parseMelody(spam).length).toBe(MAX_MELODY_NOTES);
    });
});

describe('buildMelodyPrompt', () => {
    it('demands tokens-only output in the strict grammar', () => {
        const { persona, user } = buildMelodyPrompt('épica', 'es');
        expect(persona).toContain('NOTA+OCTAVA:DURACIÓN');
        expect(persona).toContain('SOLO tokens');
        expect(user).toContain('épica');
    });

    it('falls back to a default mood for empty input', () => {
        expect(buildMelodyPrompt('   ', 'es').user).toContain('alegre y sencilla');
    });

    it('A4 is 440 by construction', () => {
        expect(noteToFreq('A', '', 4)).toBe(440);
    });
});
