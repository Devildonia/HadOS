/**
 * VOICE INTENTS (pure) — how Hada gets hands without getting dangerous
 *
 * The tool-use pattern, tamed for a sandboxed OS: the model may either answer
 * as itself OR emit ONE strictly-shaped JSON intent, and the ONLY thing an
 * intent can do is launch an app **from the allowlist the prompt itself
 * provided**. Parsing is JSON.parse behind field-by-field validation — never
 * eval, never a free-form command, and anything malformed or out-of-list
 * degrades to "no intent" (the reply is then just spoken text).
 */

export interface ILaunchIntent {
    action: 'launch';
    app: string;
}

export interface IParsedIntent {
    /** The validated intent, or null when the output is just conversation. */
    intent: ILaunchIntent | null;
    /** The output with the intent JSON stripped — what Hada should say/show. */
    speech: string;
}

/** id → human name, for the prompt's allowlist table. */
export interface IAppOption {
    id: string;
    name: string;
}

/**
 * One call decides: intent or conversation. The instruction constrains the
 * JSON to a single shape and to ids from the provided list — the model cannot
 * name an app the prompt didn't offer, and if it does anyway, `parseIntent`
 * throws it away.
 */
export function buildIntentPrompt(apps: IAppOption[], lang: string): string {
    const list = apps.map(a => `- "${a.id}" (${a.name})`).join('\n');
    const langName = lang === 'es' ? 'español' : `the user's language (${lang})`;
    return (
        `Eres Hada, la asistente de voz de HadOS. Todo ocurre en el dispositivo del usuario. ` +
        `Si el usuario te pide ABRIR una de estas apps, responde ÚNICAMENTE con el JSON ` +
        `{"action":"launch","app":"<id>"} usando un id EXACTO de esta lista:\n${list}\n` +
        `Si pide abrir algo que no está en la lista, dilo claramente (no inventes ids). ` +
        `Para todo lo demás, conversa con normalidad en ${langName}, breve (1-3 frases, pensadas para voz).`
    );
}

/**
 * Extracts and validates an intent from the model's output. Contract:
 * - only the FIRST {...} block is considered;
 * - `action` must be exactly "launch" and `app` must be in `allowedIds`;
 * - anything else (bad JSON, unknown fields' shapes, out-of-list app) yields
 *   `intent: null` and the raw text as speech — a wrong guess can only ever
 *   produce words, not actions.
 */
export function parseIntent(output: string, allowedIds: string[]): IParsedIntent {
    const match = output.match(/\{[^{}]*\}/);
    if (match) {
        try {
            const obj: unknown = JSON.parse(match[0]);
            if (
                typeof obj === 'object' && obj !== null &&
                (obj as { action?: unknown }).action === 'launch' &&
                typeof (obj as { app?: unknown }).app === 'string' &&
                allowedIds.includes((obj as { app: string }).app)
            ) {
                const speech = output.replace(match[0], '').replace(/\s+/g, ' ').trim();
                return { intent: { action: 'launch', app: (obj as { app: string }).app }, speech };
            }
        } catch { /* not JSON — plain conversation that happened to contain braces */ }
    }
    return { intent: null, speech: output.trim() };
}
