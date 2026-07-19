import { VFS } from '../../core/VFS.js';
import { Services } from '../../core/ServiceContainer.js';
import { Utils } from '../../utils.js';
import type { INotify } from '../../ui/NotificationManager.js';
import { THIS_PC } from '../FileExplorer.js';

export class ExplorerAddress {
    private addressInput: HTMLInputElement;
    private getPath: () => string;
    private onNavigate: (path: string) => void;
    private onExecuteFile: (fileName: string) => void;

    constructor(
        addressInput: HTMLInputElement,
        getPath: () => string,
        onNavigate: (path: string) => void,
        onExecuteFile: (fileName: string) => void
    ) {
        this.addressInput = addressInput;
        this.getPath = getPath;
        this.onNavigate = onNavigate;
        this.onExecuteFile = onExecuteFile;
    }

    public handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            this.navigateToPath(this.addressInput.value.trim());
        }
    }

    private navigateToPath(path: string): void {
        if (!path) return;

        if (path === THIS_PC) {
            this.onNavigate(THIS_PC);
            return;
        }

        const node = VFS.resolve(path);
        if (!node) {
            const notify = Services.get('Notify') as INotify | undefined;
            if (notify) notify.warn(`Path not found: ${path}`);
            else Utils.Logger.warn(`[Explorer] Path not found: ${path}`);

            this.addressInput.value = this.getPath();
            return;
        }

        if (node.type !== 'dir') {
            const fileName = path.split('\\').pop() || '';
            this.onExecuteFile(fileName);
            this.addressInput.value = this.getPath();
            return;
        }

        this.onNavigate(path);
    }
}
