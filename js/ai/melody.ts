/**
 * MELODY NOTATION (pure) — Gemma writes the score, the synth plays it
 *
 * The "music generation agent" pattern, honest version: the model emits a
 * CONSTRAINED notation (`C4:q E4:e G4:h R:q` — note+octave:duration, R = rest)
 * and code turns it into frequencies and milliseconds for the Web Audio
 * oscillator. Every token is validated by regex; invalid ones are skipped, the
 * sequence is capped, and a 1B model's musicianship is labelled for what it is
 * — real generation, dubious taste.
 */

export interface IMelodyNote {
    /** Hz; 0 means a rest. */
    freq: number;
    /** Duration in milliseconds at the given tempo. */
    ms: number;
}

/** Longest sequence we will play — a runaway model cannot produce a symphony. */
export const MAX_MELODY_NOTES = 64;

/** Beat length for the duration letters, at ~120 bpm. */
const BEAT_MS = 500;
const DURATIONS: Record<string, number> = {
    w: BEAT_MS * 4, // whole
    h: BEAT_MS * 2, // half
    q: BEAT_MS,     // quarter
    e: BEAT_MS / 2, // eighth
};

/** Semitone offsets from C. */
const NOTE_OFFSETS: Record<string, number> = {
    C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};

/** A4 = 440 Hz; MIDI-style frequency from note name + octave. */
export function noteToFreq(letter: string, accidental: string, octave: number): number {
    let semis = NOTE_OFFSETS[letter]!;
    if (accidental === '#') semis += 1;
    if (accidental === 'b') semis -= 1;
    // Semitones from A4 (A in octave 4 = offset 9).
    const fromA4 = (octave - 4) * 12 + semis - 9;
    return 440 * Math.pow(2, fromA4 / 12);
}

const TOKEN = /^(?:R|([A-G])([#b]?)([2-6])):([whqe])$/;

/**
 * Parses the model's notation into playable notes. Contract: whitespace and
 * comma separated tokens; anything not matching the grammar is SKIPPED (the
 * model rambling cannot break playback); output is capped at MAX_MELODY_NOTES.
 */
export function parseMelody(text: string): IMelodyNote[] {
    const out: IMelodyNote[] = [];
    for (const raw of text.split(/[\s,]+/)) {
        if (out.length >= MAX_MELODY_NOTES) break;
        const m = raw.trim().match(TOKEN);
        if (!m) continue;
        const [, letter, accidental, octave, dur] = m;
        const ms = DURATIONS[dur!]!;
        if (!letter) {
            out.push({ freq: 0, ms }); // rest
        } else {
            out.push({ freq: noteToFreq(letter, accidental ?? '', Number(octave)), ms });
        }
    }
    return out;
}

/** The prompt: mood in, strict notation out — and nothing else. */
export function buildMelodyPrompt(mood: string, lang: string): { persona: string; user: string } {
    const langName = lang === 'es' ? 'español' : lang;
    const persona =
        `Compones melodías cortas en una notación estricta. Cada token es NOTA+OCTAVA:DURACIÓN ` +
        `donde NOTA ∈ A-G con # o b opcional, OCTAVA ∈ 2-6, DURACIÓN ∈ w/h/q/e, y R:DURACIÓN es un silencio. ` +
        `Ejemplo: C4:q E4:q G4:h R:q A4:e. Devuelve SOLO tokens separados por espacios ` +
        `(entre 8 y 32), sin explicaciones. (Idioma del usuario: ${langName} — pero la salida son solo tokens.)`;
    const user = `Compón una melodía con este carácter: ${mood.trim() || 'alegre y sencilla'}`;
    return { persona, user };
}
