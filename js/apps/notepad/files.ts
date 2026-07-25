import { VFS } from '../../core/VFS';
import { Services } from '../../core/ServiceContainer';
import { Utils } from '../../utils';
import { WindowManager, type IWindowManager } from '../../ui/WindowManager';
import type { INotify } from '../../ui/NotificationManager';

export function writeToVFS(instance: unknown, dir: string, name: string): void {
    const inst = instance as unknown as { textarea?: HTMLTextAreaElement; currentFile: string; currentPath: string; isModified: boolean; updateTitle: () => void };
    if (!inst.textarea) return;

    // Ensure the name ends in .txt
    const safeName = name.endsWith('.txt') ? name : name + '.txt';
    const content = inst.textarea.value;

    const ok = VFS.writeFile(dir, safeName, content);
    const notify = Services.get('Notify') as INotify | undefined;

    if (ok) {
        inst.currentFile = safeName;
        inst.currentPath = dir;
        inst.isModified = false;
        inst.updateTitle();
        if (notify) notify.success(`Saved: ${dir}\\${safeName}`);
        Utils.Logger.log(`[Notepad] Saved to VFS: ${dir}\\${safeName}`);
    } else {
        if (notify) notify.warn(`Could not save: ${safeName}`);
        Utils.Logger.warn(`[Notepad] VFS write failed: ${dir}\\${safeName}`);
    }
}

export function newWindow(instance: unknown): void {
    const wf = Services.get<{ create: (opts: unknown) => HTMLElement }>('WindowFactory');
    if (!wf) return;

    const timestamp = Date.now();
    const newWindowId = `win-notepad-dynamic-${timestamp}`;
    const newTextareaId = `notepad-textarea-dynamic-${timestamp}`;

    // Build dynamic body structure replicating minimum Notepad structure
    const bodyEl = document.createElement('div');
    bodyEl.className = 'window-body notepad-body';

    // Clone menu bar
    const originalMenuBar = document.getElementById('notepad-menu-bar');
    if (originalMenuBar) {
        const newMenuBar = originalMenuBar.cloneNode(true) as HTMLElement;
        newMenuBar.removeAttribute('id');
        newMenuBar.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        bodyEl.appendChild(newMenuBar);
    }

    // Textarea
    const newTextarea = document.createElement('textarea');
    newTextarea.id = newTextareaId;
    bodyEl.appendChild(newTextarea);

    // Statusbar
    const statusbar = document.createElement('div');
    statusbar.className = 'window-statusbar';
    const statusSpan = document.createElement('span');
    statusSpan.textContent = 'For Help, press F1';
    statusbar.appendChild(statusSpan);
    bodyEl.appendChild(statusbar);

    // Create the window
    wf.create({
        id: newWindowId,
        title: 'Untitled - Notapad',
        width: 500,
        height: 400,
        icon: '📝',
        bodyElement: bodyEl
    });

    // Make it visible via WindowManager
    const wm = Services.get<{ open: (id: string) => void }>('WindowManager');
    if (wm) {
        wm.open(newWindowId);
    }

    // Instantiate secondary Notepad
    // Import dynamically or get the constructor from Kernel to avoid circular imports at module load time
    const instObj = instance as unknown as Record<string, unknown>;
    const NotepadClass = instObj.constructor as { new(opts: unknown): { terminate: () => void } };
    let secondaryInstance: { terminate: () => void } | null = null;
    
    const closeCallback = () => {
        if (secondaryInstance) {
            secondaryInstance.terminate();
            secondaryInstance = null;
        }
    };

    secondaryInstance = new NotepadClass({
        windowId: newWindowId,
        textareaId: newTextareaId,
        onClose: closeCallback
    });

    // Set the onCloseCallback on the window DOM element
    const winEl = document.getElementById(newWindowId);
    if (winEl) {
        (winEl as unknown as Record<string, unknown>)._onCloseCallback = closeCallback;
    }
}

export function exitApp(instance: unknown): void {
    const inst = instance as unknown as { isModified: boolean; currentFile: string; windowId: string; _saveFile: () => void };
    if (inst.isModified && !confirm(`Save changes to ${inst.currentFile}?`)) {
        // Discard — fall through to close
    } else if (inst.isModified) {
        inst._saveFile();
        return; // saveFile may show dialog — close will happen after save
    }
    const wm = Services.get('WindowManager') as IWindowManager | undefined;
    if (wm) wm.close(inst.windowId);
    else WindowManager.close(inst.windowId);
}
