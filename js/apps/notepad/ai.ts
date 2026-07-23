/**
 * NOTAPAD — AI writing actions (AI phase 6)
 * Summarise / rewrite / translate / title over the note (or the selection),
 * generated on-device by the imported Gemma and shown in a dialog the user
 * controls: the model proposes, only "Reemplazar"/"Insertar" touches the note.
 */

import { AiService } from '../../ai/AiService.js';
import { buildWritingPrompt, type WritingAction } from '../../ai/writing.js';
import { Services } from '../../core/ServiceContainer.js';
import { i18n } from '../../services/i18n.js';

const TITLES: Record<WritingAction, string> = {
    summarize: 'Resumen',
    rewrite: 'Reescritura',
    translate: 'Traducción',
    title: 'Título sugerido',
};

interface INotify { info(msg: string): number }

export async function runAiAction(instance: { windowId: string; textarea: HTMLTextAreaElement | null }, kind: WritingAction): Promise<void> {
    const ta = instance.textarea;
    if (!ta) return;

    const notify = Services.get('Notify') as INotify | undefined;
    if (!(AiService.chatModel() && AiService.chatSupported())) {
        notify?.info('Importa un modelo Gemma en Tavern Chat para usar las acciones de IA (todo ocurre on-device).');
        return;
    }

    const selStart = ta.selectionStart ?? 0;
    const selEnd = ta.selectionEnd ?? 0;
    const hasSelection = selEnd > selStart;
    const source = (hasSelection ? ta.value.slice(selStart, selEnd) : ta.value).trim();
    if (!source) {
        notify?.info('La nota está vacía — nada que procesar.');
        return;
    }

    // Dialog lookups are scoped to THIS window: notepad supports multi-window
    // and the template ids repeat per instance.
    const win = document.getElementById(instance.windowId);
    const dialog = win?.querySelector('#notepad-ai-dialog') as HTMLElement | null;
    const titleEl = win?.querySelector('#notepad-ai-title') as HTMLElement | null;
    const resultEl = win?.querySelector('#notepad-ai-result') as HTMLElement | null;
    if (!dialog || !resultEl) return;

    if (titleEl) titleEl.textContent = `AI — ${TITLES[kind]}${hasSelection ? ' (selección)' : ''}`;
    resultEl.textContent = 'Generando on-device…';
    dialog.style.display = 'block';

    // Rebind buttons per run (clone+replace drops the previous run's listeners).
    const bind = (id: string, fn: () => void) => {
        const btn = win?.querySelector(`#${id}`);
        if (!btn) return;
        const fresh = btn.cloneNode(true) as HTMLElement;
        btn.replaceWith(fresh);
        fresh.addEventListener('click', fn);
    };
    const close = () => { dialog.style.display = 'none'; };
    let result = '';
    bind('notepad-ai-cancel', close);
    bind('notepad-ai-replace', () => {
        if (!result) return;
        if (hasSelection) {
            ta.value = ta.value.slice(0, selStart) + result + ta.value.slice(selEnd);
        } else {
            ta.value = result;
        }
        ta.dispatchEvent(new Event('input', { bubbles: true })); // isModified & status
        close();
    });
    bind('notepad-ai-append', () => {
        if (!result) return;
        ta.value = ta.value + (ta.value.endsWith('\n') || !ta.value ? '' : '\n\n') + result;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        close();
    });

    try {
        const { persona, user, truncated } = buildWritingPrompt(kind, source, i18n.getLang());
        let started = false;
        const text = await AiService.chat('notepad', { persona, history: [{ role: 'user', text: user }] }, (delta) => {
            if (!started) { resultEl.textContent = ''; started = true; }
            resultEl.textContent += delta; // model output: textContent only
            resultEl.scrollTop = resultEl.scrollHeight;
        });
        result = text.trim();
        resultEl.textContent = result + (truncated ? '\n\n(El texto de entrada fue recortado por límite del modelo.)' : '');
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        resultEl.textContent = `⚠️ IA local: ${msg}`;
    }
}
