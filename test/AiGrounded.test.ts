/**
 * GROUNDED GENERATION HELPERS (AI phase 3)
 * Pins what rides into the model for HN Scout's real summaries and the Doc
 * Explorer's grounded answers: HTML stripping of untrusted comments, the token
 * budget caps, and the keyword retrieval ranking — all pure, no model.
 */
import { describe, it, expect } from 'vitest';

import {
    stripHtml, buildHnSummaryPrompt, topKLines, buildDocAnswerPrompt,
    MAX_COMMENTS, MAX_COMMENT_CHARS, DOC_CONTEXT_LINES,
} from '../js/ai/grounded';

describe('stripHtml', () => {
    it('removes tags and decodes entities from HN comment HTML', () => {
        const html = '<p>I &quot;love&quot; this &amp; that</p><a href="x">link</a><i>em</i>';
        expect(stripHtml(html)).toBe('I "love" this & that link em');
    });

    it('collapses whitespace and trims', () => {
        expect(stripHtml('  a\n\n  b   c ')).toBe('a b c');
    });

    it('neutralises markup that could otherwise leak into a prompt as structure', () => {
        expect(stripHtml('<script>alert(1)</script>hi')).not.toContain('<script>');
    });
});

describe('buildHnSummaryPrompt', () => {
    const story = { title: 'A story', score: 100, by: 'alice', descendants: 42 };

    it('frames the summary as about the DISCUSSION and carries the metadata', () => {
        const { persona, user } = buildHnSummaryPrompt(story, ['<p>First</p>', 'Second'], 'es');
        expect(persona).toContain('comentarios');
        expect(persona).toContain('no inventes contenido del artículo');
        expect(user).toContain('"A story" (100 puntos, por alice, 42 comentarios)');
        expect(user).toContain('1. First');
        expect(user).toContain('2. Second');
    });

    it('caps comments at MAX_COMMENTS and each at MAX_COMMENT_CHARS', () => {
        const many = Array.from({ length: MAX_COMMENTS + 4 }, (_, i) => `c${i} ` + 'x'.repeat(500));
        const { user } = buildHnSummaryPrompt(story, many, 'en');
        expect(user).not.toContain(`c${MAX_COMMENTS}`); // the 7th comment never rides
        // Each included comment was truncated with an ellipsis.
        const firstLine = user.split('\n').find(l => l.startsWith('1. '))!;
        expect(firstLine.length).toBeLessThanOrEqual(MAX_COMMENT_CHARS + 6);
        expect(firstLine.endsWith('…')).toBe(true);
    });

    it('says so when there is nothing readable to summarise', () => {
        const { user } = buildHnSummaryPrompt(story, [], 'en');
        expect(user).toContain('No hay comentarios legibles');
    });
});

describe('topKLines', () => {
    const lines = [
        'The cat sat on the mat',       // 0
        'Dogs chase the mailman daily', // 1
        'A cat and a dog share a home', // 2
        'Nothing relevant here',        // 3
    ];

    it('ranks by fraction of query words present, highest first', () => {
        const top = topKLines('cat dog', lines, 3);
        expect(top[0]).toMatchObject({ index: 2, score: 1 });     // both words
        expect(top.map(l => l.index)).toEqual([2, 0, 1]);          // then one word each
    });

    it('breaks score ties by document order', () => {
        const top = topKLines('cat', ['b cat', 'a cat'], 2);
        expect(top.map(l => l.index)).toEqual([0, 1]);
    });

    it('drops zero-score lines and respects K', () => {
        const top = topKLines('cat', lines, 1);
        expect(top.length).toBe(1);
        expect(top.every(l => l.score > 0)).toBe(true);
    });

    it('ignores short stop-ish words (length <= 2)', () => {
        const top = topKLines('on a', lines, 4);
        expect(top.length).toBe(0); // no query words survive the filter
    });
});

describe('buildDocAnswerPrompt', () => {
    it('cites lines by index and instructs answer-only-from-context', () => {
        const retrieved = [
            { index: 4, text: 'Score points by clearing rows', score: 1 },
            { index: 9, text: 'The game ends at the top', score: 0.5 },
        ];
        const { persona, user } = buildDocAnswerPrompt('how to score', retrieved, 'es');
        expect(persona).toContain('EXCLUSIVAMENTE');
        expect(persona).toContain('[línea N]');
        expect(user).toContain('[línea 4] Score points by clearing rows');
        expect(user).toContain('[línea 9]');
        expect(user).toContain('Pregunta: how to score');
    });

    it('admits an empty retrieval instead of inventing context', () => {
        const { user } = buildDocAnswerPrompt('anything', [], 'en');
        expect(user).toContain('ninguna línea coincidió');
    });

    it('exports a sane default context size', () => {
        expect(DOC_CONTEXT_LINES).toBeGreaterThan(0);
        expect(DOC_CONTEXT_LINES).toBeLessThanOrEqual(10);
    });
});
