import { Utils } from '../../utils';

export function setupMenuListeners(instance: any): void {
    const win = document.getElementById(instance.windowId);
    const menuBar = win ? win.querySelector('.window-menu') as HTMLElement | null : null;
    if (!menuBar) return;

    // Toggle dropdown on label click
    const labelClickHandler = (e: Event) => {
        const label = (e.target as HTMLElement).closest('.notepad-menu-label');
        if (!label) return;
        const entry = label.closest('.notepad-menu-entry') as HTMLElement;
        if (!entry) return;

        const isOpen = entry.classList.contains('open');
        closeAllDropdowns(instance);
        if (!isOpen) entry.classList.add('open');

        e.stopPropagation();
    };
    menuBar.addEventListener('click', labelClickHandler);
    instance.registerResource('listener', { dispose: () => menuBar.removeEventListener('click', labelClickHandler) });

    // Handle dropdown item actions
    const itemClickHandler = (e: Event) => {
        const item = (e.target as HTMLElement).closest('.notepad-dropdown-item') as HTMLElement;
        if (!item || item.classList.contains('disabled')) return;

        const action = item.dataset.notepadAction;
        if (action) {
            closeAllDropdowns(instance);
            instance._executeAction(action);
        }
        e.stopPropagation();
    };
    menuBar.addEventListener('click', itemClickHandler);
}

export function closeAllDropdowns(instance: any): void {
    const entries = document.querySelectorAll(`#${instance.windowId} .notepad-menu-entry.open`);
    entries.forEach(e => e.classList.remove('open'));
}

export function closeMenusOnOutsideClick(instance: any): void {
    const outsideHandler = (e: Event) => {
        const menuBar = document.getElementById('notepad-menu-bar');
        if (menuBar && !menuBar.contains(e.target as Node)) {
            closeAllDropdowns(instance);
        }
    };
    document.addEventListener('click', outsideHandler);
    instance.registerResource('listener', { dispose: () => document.removeEventListener('click', outsideHandler) });
}

export function setupKeyboardShortcuts(instance: any): void {
    const win = document.getElementById(instance.windowId);
    if (!win) return;

    const kbHandler = (e: KeyboardEvent) => {
        if (!e.ctrlKey) return;
        switch (e.key.toLowerCase()) {
            case 's': e.preventDefault(); instance._executeAction(e.shiftKey ? 'save-as' : 'save'); break;
            case 'n': e.preventDefault(); instance._executeAction('new'); break;
            case 'o': e.preventDefault(); instance._executeAction('open'); break;
            case 'f': e.preventDefault(); instance._executeAction('find'); break;
            case 'z': e.preventDefault(); instance._executeAction('undo'); break;
        }
    };
    win.addEventListener('keydown', kbHandler);
    instance.registerResource('listener', { dispose: () => win.removeEventListener('keydown', kbHandler) });
}

export function executeAction(instance: any, action: string): void {
    switch (action) {
        case 'new':        instance._newFile(); break;
        case 'new-window': instance._newWindow(); break;
        case 'open':       instance._showOpenDialog(); break;
        case 'save':       instance._saveFile(); break;
        case 'save-as':    instance._showSaveAsDialog(); break;
        case 'exit':       instance._exitApp(); break;
        case 'undo':       document.execCommand('undo'); break;
        case 'cut':        document.execCommand('cut'); break;
        case 'copy':       document.execCommand('copy'); break;
        case 'paste':      document.execCommand('paste'); break;
        case 'select-all': instance.textarea?.select(); break;
        case 'find':       instance._showFindDialog(); break;
        case 'ai-summarize': instance._aiAction('summarize'); break;
        case 'ai-rewrite':   instance._aiAction('rewrite'); break;
        case 'ai-translate': instance._aiAction('translate'); break;
        case 'ai-title':     instance._aiAction('title'); break;
        case 'about':      instance._showAbout(); break;
        default: Utils.Logger.log('[Notepad] Unknown action:', action);
    }
}
