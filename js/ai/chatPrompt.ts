/**
 * CHAT PROMPT (Gemma template)
 * Builds the raw prompt string MediaPipe's `generateResponse` expects. Gemma is an
 * instruction-tuned model with a fixed turn grammar and NO system role, so the
 * persona is folded into the first user turn — the documented pattern for Gemma.
 *
 * Pure and host-side on purpose: the worker receives a finished string, and tests
 * can pin the template without a model.
 */

export interface IChatTurn {
    role: 'user' | 'model';
    text: string;
}

const START = '<start_of_turn>';
const END = '<end_of_turn>';

/**
 * User text and personas travel into the template verbatim, so the template's own
 * control tokens must never survive in them — a message containing
 * `<end_of_turn><start_of_turn>model` would otherwise let the USER close their
 * turn and speak as the model (prompt injection against the turn grammar).
 */
export function stripTurnMarkers(text: string): string {
    return text.split(START).join('').split(END).join('');
}

/** How much history rides along. Keeps the prompt well inside the token budget. */
export const MAX_HISTORY_TURNS = 12;

/**
 * Assembles persona + recent history into Gemma's turn grammar, ending with an
 * open `model` turn for the reply. The persona is prepended to the FIRST user
 * turn in the window (Gemma has no system slot).
 */
export function buildGemmaPrompt(persona: string, history: IChatTurn[]): string {
    const recent = history.slice(-MAX_HISTORY_TURNS);
    const cleanPersona = stripTurnMarkers(persona).trim();

    let firstUserSeen = false;
    const parts: string[] = [];
    for (const turn of recent) {
        let text = stripTurnMarkers(turn.text).trim();
        if (!text) continue;
        if (turn.role === 'user' && !firstUserSeen) {
            firstUserSeen = true;
            if (cleanPersona) text = `${cleanPersona}\n\n${text}`;
        }
        parts.push(`${START}${turn.role}\n${text}${END}\n`);
    }

    // A history with no user turn still needs the persona somewhere.
    if (!firstUserSeen && cleanPersona) {
        parts.unshift(`${START}user\n${cleanPersona}${END}\n`);
    }

    parts.push(`${START}model\n`);
    return parts.join('');
}
