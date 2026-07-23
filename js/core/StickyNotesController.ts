import { EventBus } from './EventBus';
import { Services } from './ServiceContainer';
import { Utils } from '../utils';
import { VFS } from './VFS';

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

/** Sticky notes "in the bin" are the ones dragged onto the recycle-bin icon. */
function hiddenStickies(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.draggable-sticky')).filter(
        (el) => (el as HTMLElement).style.display === 'none'
    ) as HTMLElement[];
}

const iconForType = (type: string): string =>
    type === 'dir' ? '📁' : type === 'shortcut' ? '🔗' : '📄';

/**
 * Renders the recycle-bin dialog: trashed files (restore each, or empty the bin
 * permanently) and deleted sticky notes (restore each). Rebuilt live whenever the
 * bin changes.
 */
export function updateRecycleBinUI(): void {
    const dialog = document.getElementById('dialog-recyclebin');
    if (!dialog) return;

    const contentEl = dialog.querySelector('.dialog-content') as HTMLElement;
    const buttonsEl = dialog.querySelector('.dialog-buttons') as HTMLElement;
    if (!contentEl || !buttonsEl) return;

    const stickies = hiddenStickies();
    const files = VFS.listTrash();

    if (stickies.length === 0 && files.length === 0) {
        contentEl.innerHTML = `
            <span class="dialog-icon">🗑️</span>
            <span class="dialog-message">The Recycle Bin is empty.</span>
        `;
        buttonsEl.innerHTML = `
            <button class="hados-btn" data-close-dialog="dialog-recyclebin">OK</button>
        `;
        return;
    }

    const rowStyle = 'display:flex; align-items:center; justify-content:space-between; gap:8px; padding:4px 8px; border:1px solid var(--hados-line, #808080); border-radius:6px;';
    const btnStyle = 'padding:2px 8px; font-size:11px; flex-shrink:0;';

    let filesHTML = '';
    if (files.length > 0) {
        const rows = files.map((f) => `
            <div style="${rowStyle}">
                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"
                      title="${Utils.escapeHTML(f.origin)}">${iconForType(f.type)} ${Utils.escapeHTML(f.name)}</span>
                <button class="hados-btn rb-restore-file" data-id="${Utils.escapeHTML(f.id)}" style="${btnStyle}">Restore</button>
            </div>`).join('');
        filesHTML = `
            <span class="dialog-message" style="font-weight:bold;">Files</span>
            <div style="display:flex; flex-direction:column; gap:6px; width:100%; max-height:160px; overflow-y:auto;">${rows}</div>`;
    }

    let stickiesHTML = '';
    if (stickies.length > 0) {
        const rows = stickies.map((sticky, idx) => {
            const firstP = sticky.querySelector('p');
            const text = Utils.escapeHTML(firstP ? (firstP.textContent || '') : `Sticky Note #${idx + 1}`);
            return `
                <div style="${rowStyle} background:#ffffcc; color:#000;">
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📌 ${text}</span>
                    <button class="hados-btn restore-sticky-btn" data-index="${idx}" style="${btnStyle}">Restore</button>
                </div>`;
        }).join('');
        stickiesHTML = `
            <span class="dialog-message" style="font-weight:bold; margin-top:${files.length ? '8px' : '0'};">Sticky Notes</span>
            <div style="display:flex; flex-direction:column; gap:6px; width:100%; max-height:160px; overflow-y:auto;">${rows}</div>`;
    }

    contentEl.innerHTML = `
        <span class="dialog-icon">🗑️</span>
        <div style="flex:1; display:flex; flex-direction:column; gap:6px; align-items:flex-start; width:100%;">
            ${filesHTML}
            ${stickiesHTML}
        </div>
    `;

    buttonsEl.innerHTML = `
        ${files.length ? '<button class="hados-btn rb-empty-btn" style="margin-right:8px;">Empty Recycle Bin</button>' : ''}
        ${stickies.length ? '<button class="hados-btn restore-all-stickies-btn" style="margin-right:8px;">Restore All Notes</button>' : ''}
        <button class="hados-btn" data-close-dialog="dialog-recyclebin">Close</button>
    `;

    const blip = (sound: string): void => {
        const audio: any = Services.get('AudioManager');
        if (audio) audio.play(sound, { volume: 0.8 });
    };

    contentEl.querySelectorAll('.rb-restore-file').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
            if (VFS.restoreFromTrash(id)) {
                VFS.flushSync();
                blip('spawn');
            } else {
                (Services.get('Notify') as { warn?: (m: string) => void } | undefined)
                    ?.warn?.('Cannot restore: the original folder no longer exists.');
            }
            updateRecycleBinUI();
        });
    });

    const emptyBtn = buttonsEl.querySelector('.rb-empty-btn');
    if (emptyBtn) {
        emptyBtn.addEventListener('click', () => {
            VFS.emptyTrash();
            VFS.flushSync();
            blip('release');
            updateRecycleBinUI();
        });
    }

    contentEl.querySelectorAll('.restore-sticky-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0');
            const target = stickies[idx];
            if (target) {
                restoreStickyNote(target);
                blip('spawn');
                updateRecycleBinUI();
            }
        });
    });

    const restoreAllBtn = buttonsEl.querySelector('.restore-all-stickies-btn');
    if (restoreAllBtn) {
        restoreAllBtn.addEventListener('click', () => {
            stickies.forEach(restoreStickyNote);
            blip('spawn');
            updateRecycleBinUI();
        });
    }
}

/** Counts hidden sticky notes without leaking the DOM query to callers. */
function isBinFull(): boolean {
    return hiddenStickies().length > 0 || VFS.trashCount() > 0;
}

/**
 * Flips the desktop recycle-bin icon between empty and full. Only the HadOS theme
 * ships both states (eco_bin_empty / eco_bin_full); the modern theme has a single
 * icon, so it is left untouched.
 */
export function refreshRecycleBinIcon(): void {
    const img = document.querySelector('#icon-recyclebin .icon-box img') as HTMLImageElement | null;
    if (!img) return;
    const theme = (Services.get('ThemeManager') as { currentTheme?: string } | undefined)?.currentTheme
        ?? (document.body.classList.contains('theme-modern') ? 'modern' : 'hados');
    if (theme !== 'hados') return;

    const src = isBinFull() ? 'assets/icons/eco_bin_full.webp' : 'assets/icons/eco_bin_empty.webp';
    if (!img.getAttribute('src')?.endsWith(src)) img.setAttribute('src', src);
}

/**
 * Wires the recycle bin to the rest of the system: keep the icon in sync with the
 * bin's contents, and keep an open dialog live. Called once at boot.
 */
export function initRecycleBin(): void {
    refreshRecycleBinIcon();
    EventBus.on('vfs:trash-changed', () => {
        refreshRecycleBinIcon();
        const dialog = document.getElementById('dialog-recyclebin');
        if (dialog && dialog.style.display !== 'none') updateRecycleBinUI();
    });
    // ThemeManager.swapIcons resets the icon to "empty" on a theme change; restore
    // the full state afterwards.
    EventBus.on('themechanged', refreshRecycleBinIcon);
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
                    refreshRecycleBinIcon(); // the bin now has a note in it
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
