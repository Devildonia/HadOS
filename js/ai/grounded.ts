/**
 * GROUNDED GENERATION HELPERS (pure, shared)
 * The prompt- and retrieval-building halves of "AI phase 3": HN Scout's real
 * comment summaries and Doc Explorer's grounded answers, both over the SAME
 * imported Gemma model the Messenger uses (`AiService.chat`).
 *
 * Everything here is pure and DOM-optional so jsdom can pin it: what goes into
 * the model is exactly as testable as what comes out is not.
 *
 * Token budget discipline: Gemma runs with maxTokens 1280 (prompt + reply), so
 * every builder here caps its context hard. A prompt that silently overflows
 * would truncate the REPLY, which reads as the model dying mid-sentence.
 */

export interface IHnStoryMeta {
    title: string;
    score: number;
    by: string;
    descendants?: number | undefined;
}

/** A retrieved document line with its provenance. */
export interface IRetrievedLine {
    index: number;
    text: string;
    /** Fraction of query words present, 0..1. */
    score: number;
}

/** Per-comment and total caps for the HN summary context. */
export const MAX_COMMENTS = 6;
export const MAX_COMMENT_CHARS = 380;
/** Total context cap (chars) — roughly 600 tokens, leaving room for the reply. */
const MAX_CONTEXT_CHARS = 2400;

/**
 * HN comment `text` is HTML (entities, <p>, <a>, <i>…). Prefer a real parser
 * when the environment has one — entity decoding by regex is a losing game —
 * and fall back to tag-stripping for exotic environments.
 */
export function stripHtml(html: string): string {
    if (typeof DOMParser !== 'undefined') {
        try {
            // ' <' so element boundaries become separators — textContent alone
            // would glue "<p>a</p><p>b</p>" into "ab".
            const doc = new DOMParser().parseFromString(html.replace(/</g, ' <'), 'text/html');
            return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
        } catch { /* fall through */ }
    }
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ').trim();
}

/** Which language the reply should come back in — matches the UI language. */
function languageName(lang: string): string {
    return lang === 'es' ? 'español' : 'the same language as the user interface (' + lang + ')';
}

/**
 * Builds the persona + user turn for a REAL summary of an HN discussion.
 * The input is the thread's own comments (the official API serves them with
 * CORS) — the linked article's text is NOT reachable from a browser, so the
 * summary is honestly framed as "what the discussion says".
 */
export function buildHnSummaryPrompt(
    story: IHnStoryMeta,
    comments: string[],
    lang: string,
): { persona: string; user: string } {
    const persona =
        `Eres un analista que resume discusiones de Hacker News. Resume SOLO lo que dicen ` +
        `los comentarios proporcionados — no inventes contenido del artículo, que no has leído. ` +
        `Responde en ${languageName(lang)}, en 3-5 frases, señalando los puntos de vista principales.`;

    const cleaned: string[] = [];
    let used = 0;
    for (const raw of comments.slice(0, MAX_COMMENTS)) {
        let c = stripHtml(raw);
        if (!c) continue;
        if (c.length > MAX_COMMENT_CHARS) c = c.slice(0, MAX_COMMENT_CHARS) + '…';
        if (used + c.length > MAX_CONTEXT_CHARS) break;
        used += c.length;
        cleaned.push(c);
    }

    const header =
        `Noticia: "${story.title}" (${story.score} puntos, por ${story.by}` +
        (story.descendants !== undefined ? `, ${story.descendants} comentarios` : '') + `).`;
    const body = cleaned.length
        ? `Comentarios principales:\n` + cleaned.map((c, i) => `${i + 1}. ${c}`).join('\n')
        : `(No hay comentarios legibles en el hilo.)`;

    return { persona, user: `${header}\n\n${body}\n\nResume la discusión.` };
}

/**
 * Keyword retrieval over document lines: fraction of query words present in
 * the line, top-K by score. This is EXACTLY the search the Doc Explorer always
 * had (and honestly labels) — extracted so the grounded answer can cite more
 * than one line, and so the ranking is pinned by tests.
 */
export function topKLines(query: string, lines: string[], k: number): IRetrievedLine[] {
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const scored: IRetrievedLine[] = lines.map((text, index) => {
        const lower = text.toLowerCase();
        const matches = words.filter(w => lower.includes(w)).length;
        return { index, text, score: words.length > 0 ? matches / words.length : 0 };
    });
    return scored
        .filter(l => l.score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .slice(0, k);
}

/** How many retrieved lines ride into the answer prompt. */
export const DOC_CONTEXT_LINES = 6;
const MAX_LINE_CHARS = 300;

/**
 * Builds the persona + user turn for an answer grounded in retrieved lines.
 * The instruction is strict: only the provided lines, cite them, and admit
 * absence — a grounded answerer that invents is worse than the keyword quote
 * it replaces.
 */
export function buildDocAnswerPrompt(
    query: string,
    retrieved: IRetrievedLine[],
    lang: string,
): { persona: string; user: string } {
    const persona =
        `Respondes preguntas sobre UN documento usando EXCLUSIVAMENTE las líneas proporcionadas. ` +
        `Cita las líneas que uses como [línea N]. Si la respuesta no está en ellas, dilo claramente. ` +
        `Responde en ${languageName(lang)}, en 2-4 frases.`;

    let used = 0;
    const parts: string[] = [];
    for (const l of retrieved) {
        let t = l.text.trim();
        if (t.length > MAX_LINE_CHARS) t = t.slice(0, MAX_LINE_CHARS) + '…';
        if (used + t.length > MAX_CONTEXT_CHARS) break;
        used += t.length;
        parts.push(`[línea ${l.index}] ${t}`);
    }

    const context = parts.length ? parts.join('\n') : '(ninguna línea coincidió con la búsqueda)';
    return { persona, user: `Líneas del documento:\n${context}\n\nPregunta: ${query}` };
}
