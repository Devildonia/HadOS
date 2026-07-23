/**
 * WRITING ACTIONS (pure) — Notapad's on-device text tools
 * Summarise / rewrite / translate / title, over the note (or the selection).
 * Prompt builders only: the app streams `AiService.chat` and the user decides
 * whether the result replaces anything — the model never touches the note
 * directly.
 */

export type WritingAction = 'summarize' | 'rewrite' | 'translate' | 'title';

/** Keep the source inside Gemma's 1280-token budget with room for the answer. */
export const MAX_WRITING_CHARS = 2400;

function langName(lang: string): string {
    return lang === 'es' ? 'español' : `the user-interface language (${lang})`;
}

const INSTRUCTIONS: Record<WritingAction, (lang: string) => string> = {
    summarize: (lang) => `Resume el texto en 2-4 frases claras, en ${langName(lang)}. Devuelve SOLO el resumen.`,
    rewrite: (lang) => `Reescribe el texto para que sea más claro y directo, conservando su significado y su idioma. Devuelve SOLO el texto reescrito. (Idioma de la interfaz: ${langName(lang)}.)`,
    translate: (lang) => `Traduce el texto a ${langName(lang)}. Devuelve SOLO la traducción.`,
    title: (lang) => `Propón un título corto (máximo 8 palabras) para el texto, en su mismo idioma. Devuelve SOLO el título, sin comillas. (Interfaz: ${langName(lang)}.)`,
};

export function buildWritingPrompt(
    action: WritingAction,
    text: string,
    lang: string,
): { persona: string; user: string; truncated: boolean } {
    const truncated = text.length > MAX_WRITING_CHARS;
    const body = truncated ? text.slice(0, MAX_WRITING_CHARS) : text;

    const persona =
        `Eres un asistente de escritura que trabaja SOLO con el texto proporcionado — no añadas ` +
        `información que no esté en él. ${INSTRUCTIONS[action](lang)}`;

    const user =
        `Texto:\n${body}` +
        (truncated ? `\n\n(Nota: el texto fue recortado a ${MAX_WRITING_CHARS} caracteres por límite del modelo.)` : '');

    return { persona, user, truncated };
}
