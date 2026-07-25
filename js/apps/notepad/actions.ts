import { Utils } from '../../utils';

export function setupMenuListeners(instance: unknown): void {
    const inst = instance as unknown as { windowId: string; registerResource: (t: string, r: unknown) => void; _executeAction: (a: string) => void };
    const win = document.getElementById(inst.windowId);
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
    inst.registerResource('listener', { dispose: () => menuBar.removeEventListener('click', labelClickHandler) });

    // Handle dropdown item actions
    const itemClickHandler = (e: Event) => {
        const item = (e.target as HTMLElement).closest('.notepad-dropdown-item') as HTMLElement;
        if (!item || item.classList.contains('disabled')) return;

        const action = item.dataset.notepadAction;
        if (action) {
            closeAllDropdowns(instance);
            inst._executeAction(action);
        }
        e.stopPropagation();
    };
    menuBar.addEventListener('click', itemClickHandler);
}

export function closeAllDropdowns(instance: unknown): void {
    const inst = instance as unknown as { windowId: string };
    const entries = document.querySelectorAll(`#${inst.windowId} .notepad-menu-entry.open`);
    entries.forEach(e => e.classList.remove('open'));
}

export function closeMenusOnOutsideClick(instance: unknown): void {
    const inst = instance as unknown as { registerResource: (t: string, r: unknown) => void };
    const outsideHandler = (e: Event) => {
        const menuBar = document.getElementById('notepad-menu-bar');
        if (menuBar && !menuBar.contains(e.target as Node)) {
            closeAllDropdowns(instance);
        }
    };
    document.addEventListener('click', outsideHandler);
    inst.registerResource('listener', { dispose: () => document.removeEventListener('click', outsideHandler) });
}

export function setupKeyboardShortcuts(instance: unknown): void {
    const inst = instance as unknown as { windowId: string; registerResource: (t: string, r: unknown) => void; _executeAction: (a: string) => void };
    const win = document.getElementById(inst.windowId);
    if (!win) return;

    const kbHandler = (e: KeyboardEvent) => {
        if (!e.ctrlKey) return;
        switch (e.key.toLowerCase()) {
            case 's': e.preventDefault(); inst._executeAction(e.shiftKey ? 'save-as' : 'save'); break;
            case 'n': e.preventDefault(); inst._executeAction('new'); break;
            case 'o': e.preventDefault(); inst._executeAction('open'); break;
            case 'f': e.preventDefault(); inst._executeAction('find'); break;
            case 'z': e.preventDefault(); inst._executeAction('undo'); break;
        }
    };
    win.addEventListener('keydown', kbHandler);
    inst.registerResource('listener', { dispose: () => win.removeEventListener('keydown', kbHandler) });
}

export function executeAction(instance: unknown, action: string): void {
    const inst = instance as unknown as {
        _newFile: () => void;
        _newWindow: () => void;
        _showOpenDialog: () => void;
        _saveFile: () => void;
        _showSaveAsDialog: () => void;
        _exitApp: () => void;
        textarea?: HTMLTextAreaElement;
        _showFindDialog: () => void;
        _aiAction: (act: string) => void;
        _showAbout: () => void;
    };
    switch (action) {
        case 'new':        inst._newFile(); break;
        case 'new-window': inst._newWindow(); break;
        case 'open':       inst._showOpenDialog(); break;
        case 'save':       inst._saveFile(); break;
        case 'save-as':    inst._showSaveAsDialog(); break;
        case 'exit':       inst._exitApp(); break;
        case 'undo':       document.execCommand('undo'); break;
        case 'cut':        document.execCommand('cut'); break;
        case 'copy':       document.execCommand('copy'); break;
        case 'paste':      document.execCommand('paste'); break;
        case 'select-all': inst.textarea?.select(); break;
        case 'find':       inst._showFindDialog(); break;
        case 'ai-summarize': inst._aiAction('summarize'); break;
        case 'ai-rewrite':   inst._aiAction('rewrite'); break;
        case 'ai-translate': inst._aiAction('translate'); break;
        case 'ai-title':     inst._aiAction('title'); break;
        case 'about':      inst._showAbout(); break;
        default: Utils.Logger.log('[Notepad] Unknown action:', action);
    }
}
