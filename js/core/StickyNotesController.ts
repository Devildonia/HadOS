import { Services } from './ServiceContainer';
import { Utils } from '../utils';

const initialStyles = new Map<HTMLElement, string>();

export function restoreStickyNote(sticky: HTMLElement): void {
    const orig = initialStyles.get(sticky);
    if (orig !== undefined) {
        sticky.style.cssText = orig;
    } else {
        sticky.style.cssText = '';
    }
    sticky.style.display = 'block';
}

export function updateRecycleBinUI(): void {
    const dialog = document.getElementById('dialog-recyclebin');
    if (!dialog) return;

    const contentEl = dialog.querySelector('.dialog-content') as HTMLElement;
    const buttonsEl = dialog.querySelector('.dialog-buttons') as HTMLElement;
    if (!contentEl || !buttonsEl) return;

    const hiddenStickies = Array.from(document.querySelectorAll('.draggable-sticky')).filter(
        (el) => (el as HTMLElement).style.display === 'none'
    ) as HTMLElement[];

    if (hiddenStickies.length === 0) {
        contentEl.innerHTML = `
            <span class="dialog-icon">🗑️</span>
            <span class="dialog-message">The Recycle Bin is empty.</span>
        `;
        buttonsEl.innerHTML = `
            <button class="win95-btn" data-close-dialog="dialog-recyclebin">OK</button>
        `;
        return;
    }

    // Reflect the post-its and provide a restore option
    let listHTML = '<div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-height: 200px; overflow-y: auto;">';
    hiddenStickies.forEach((sticky, idx) => {
        // Extract text preview
        const firstP = sticky.querySelector('p');
        const text = firstP ? (firstP.textContent || '') : `Sticky Note #${idx + 1}`;
        const escapedText = Utils.escapeHTML(text);
        listHTML += `
            <div style="display: flex; align-items: center; justify-content: space-between; border: 1px solid #808080; padding: 4px 8px; background: #ffffcc; color: #000; font-family: 'MS Sans Serif', Arial, sans-serif; font-size: 11px; margin-top: 4px;">
                <span style="font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px;">📌 ${escapedText}</span>
                <button class="win95-btn restore-sticky-btn" data-index="${idx}" style="padding: 2px 6px; font-size: 10px;">Restore</button>
            </div>
        `;
    });
    listHTML += '</div>';

    contentEl.innerHTML = `
        <span class="dialog-icon">🗑️</span>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; width: 100%;">
            <span class="dialog-message" style="font-weight: bold;">Deleted Sticky Notes:</span>
            ${listHTML}
        </div>
    `;

    buttonsEl.innerHTML = `
        <button class="win95-btn restore-all-stickies-btn" style="margin-right: 8px;">Restore All</button>
        <button class="win95-btn" data-close-dialog="dialog-recyclebin">Close</button>
    `;

    // Bind event listeners for restore buttons
    const restoreBtns = contentEl.querySelectorAll('.restore-sticky-btn');
    restoreBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0');
            const targetSticky = hiddenStickies[idx];
            if (targetSticky) {
                restoreStickyNote(targetSticky);
                const audio: any = Services.get('AudioManager');
                if (audio) audio.play('spawn', { volume: 0.8 });
                updateRecycleBinUI();
            }
        });
    });

    const restoreAllBtn = buttonsEl.querySelector('.restore-all-stickies-btn');
    if (restoreAllBtn) {
        restoreAllBtn.addEventListener('click', () => {
            hiddenStickies.forEach((sticky) => {
                restoreStickyNote(sticky);
            });
            const audio: any = Services.get('AudioManager');
            if (audio) audio.play('spawn', { volume: 0.8 });
            updateRecycleBinUI();
        });
    }
}

export function setupStickyNotes(): void {
    const stickyNotes = document.querySelectorAll('.draggable-sticky');
    let activeSticky: HTMLElement | null = null;
    let offX = 0, offY = 0, maxZ = 50;

    stickyNotes.forEach(sticky => {
        initialStyles.set(sticky as HTMLElement, (sticky as HTMLElement).style.cssText);
        sticky.addEventListener('mousedown', startDrag as EventListener);
        sticky.addEventListener('touchstart', startDrag as EventListener, { passive: false });
    });

    function startDrag(this: HTMLElement, e: MouseEvent | TouchEvent): void {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON') return;
        if (e.cancelable) e.preventDefault();
        activeSticky = this;
        activeSticky.classList.add('dragging');
        activeSticky.style.zIndex = String(++maxZ);
        const touch: MouseEvent | Touch = (e.type === 'touchstart' ? (e as TouchEvent).touches[0] : (e as MouseEvent)) || (e as MouseEvent);
        const rect = activeSticky.getBoundingClientRect();
        offX = touch.clientX - rect.left;
        offY = touch.clientY - rect.top;
        document.addEventListener('mousemove', drag as EventListener);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', drag as EventListener, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e: MouseEvent | TouchEvent): void {
        if (!activeSticky) return;
        if (e.cancelable) e.preventDefault();
        const touch: MouseEvent | Touch = (e.type === 'touchmove' ? (e as TouchEvent).touches[0] : (e as MouseEvent)) || (e as MouseEvent);
        let newL = touch.clientX - offX;
        let newT = touch.clientY - offY;
        newL = Math.max(0, Math.min(newL, window.innerWidth - activeSticky.offsetWidth));
        newT = Math.max(0, Math.min(newT, window.innerHeight - activeSticky.offsetHeight));
        activeSticky.style.left = newL + 'px';
        activeSticky.style.top = newT + 'px';
        activeSticky.style.right = 'auto';
    }

    function stopDrag(): void {
        if (activeSticky) {
            const recycleBin = document.getElementById('icon-recyclebin');
            if (recycleBin) {
                const binRect = recycleBin.getBoundingClientRect();
                const stickyRect = activeSticky.getBoundingClientRect();

                // Simple intersection check
                const overlap = !(
                    stickyRect.right < binRect.left ||
                    stickyRect.left > binRect.right ||
                    stickyRect.bottom < binRect.top ||
                    stickyRect.top > binRect.bottom
                );

                if (overlap) {
                    activeSticky.style.display = 'none';
                    const audio: any = Services.get('AudioManager');
                    if (audio) {
                        audio.play('release', { volume: 0.8 });
                    }
                }
            }

            activeSticky.classList.remove('dragging');
            activeSticky = null;
        }
        document.removeEventListener('mousemove', drag as EventListener);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag as EventListener);
        document.removeEventListener('touchend', stopDrag);
    }
}
