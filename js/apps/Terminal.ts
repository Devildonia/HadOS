import { Kernel } from '../core/Kernel.js';
import { VFS } from '../core/VFS.js';
import { Utils } from '../utils.js';
import { Services } from '../core/ServiceContainer.js';
import { CONFIG } from '../config.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';

export class Terminal implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    private outputContainer: HTMLElement | null = null;
    private promptEl: HTMLElement | null = null;
    private inputEl: HTMLInputElement | null = null;

    private cwd: string = 'C:\\WINDOWS\\DESKTOP';
    private history: string[] = [];
    private historyIndex: number = -1;

    private boundKeydown: EventListener;
    private boundContainerClick: EventListener;

    constructor() {
        this.boundKeydown = (e) => this.handleKeydown(e as KeyboardEvent);
        this.boundContainerClick = () => {
            if (this.inputEl) this.inputEl.focus();
        };
        this.init();
    }

    private init(): void {
        this.windowId = WindowFactory.create({
            title: 'MS-DOS Prompt',
            width: 560,
            height: 360,
            resizable: true,
            icon: '🖥️',
            statusBar: { text: this.cwd }
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.setupLayout();
        
        this.writeOutput('Microsoft(R) Windows 95');
        this.writeOutput('(C)Copyright Microsoft Corp 1981-1995.');
        this.writeOutput('');

        this.updatePrompt();
    }

    private setupLayout(): void {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="terminal-app">
                <div class="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt"></span>
                    <input class="terminal-input" type="text" autocomplete="off" spellcheck="false" />
                </div>
            </div>
        `;

        this.outputContainer = this.container.querySelector('.terminal-output');
        this.promptEl = this.container.querySelector('.terminal-prompt');
        this.inputEl = this.container.querySelector('.terminal-input');

        if (this.inputEl) {
            Utils.eventManager.add(this.inputEl, 'keydown', this.boundKeydown);
            setTimeout(() => {
                if (this.inputEl) this.inputEl.focus();
            }, 50);
        }

        Utils.eventManager.add(this.container, 'click', this.boundContainerClick);
    }

    private updatePrompt(): void {
        if (this.promptEl) {
            this.promptEl.textContent = `${this.cwd}>`;
        }
        // Update status bar
        const statusEl = document.getElementById(`${this.windowId}-status`);
        if (statusEl) {
            statusEl.textContent = this.cwd;
        }
    }

    private writeOutput(text: string, isError: boolean = false): void {
        if (!this.outputContainer) return;

        const line = document.createElement('div');
        if (isError) {
            line.className = 'term-error-line';
        }
        line.textContent = text;
        this.outputContainer.appendChild(line);
        this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
    }

    private handleKeydown(e: KeyboardEvent): void {
        if (!this.inputEl) return;

        if (e.key === 'Enter') {
            const raw = this.inputEl.value;
            this.inputEl.value = '';
            this.writeOutput(`${this.cwd}>${raw}`);

            if (raw.trim()) {
                this.history.push(raw);
                this.historyIndex = -1;
                this.executeCommand(raw);
            }
            this.updatePrompt();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.history.length === 0) return;

            if (this.historyIndex === -1) {
                this.historyIndex = this.history.length - 1;
            } else if (this.historyIndex > 0) {
                this.historyIndex--;
            }

            const historical = this.history[this.historyIndex];
            if (historical !== undefined) {
                this.inputEl.value = historical;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex === -1) return;

            if (this.historyIndex === this.history.length - 1) {
                this.historyIndex = -1;
                this.inputEl.value = '';
            } else {
                this.historyIndex++;
                const historical = this.history[this.historyIndex];
                if (historical !== undefined) {
                    this.inputEl.value = historical;
                }
            }
        }
    }

    private cleanPath(parts: string[]): string[] {
        const stack: string[] = [];
        for (const part of parts) {
            if (!part || part === '.') continue;
            if (part === '..') {
                if (stack.length > 1) {
                    stack.pop();
                }
            } else {
                stack.push(part);
            }
        }
        return stack;
    }

    private resolvePath(cwd: string, arg: string): string {
        let parts: string[];
        if (arg.toUpperCase().startsWith('C:')) {
            parts = arg.split(/[\/\\]/);
        } else {
            parts = cwd.split(/[\/\\]/).concat(arg.split(/[\/\\]/));
        }

        if (parts[0]) {
            parts[0] = parts[0].toUpperCase();
        }

        const cleaned = this.cleanPath(parts);
        return cleaned.join('\\');
    }

    private executeCommand(rawInput: string): void {
        const trimmed = rawInput.trim();
        
        // 1. Redirection checks
        const redirectIndex = trimmed.indexOf('>');
        if (redirectIndex !== -1) {
            const echoContent = trimmed.substring(0, redirectIndex).trim();
            const content = echoContent.startsWith('echo ') ? echoContent.substring(5) : echoContent;
            const fileArg = trimmed.substring(redirectIndex + 1).trim();

            if (!fileArg) {
                this.writeOutput('Error: No file specified for redirection.', true);
                return;
            }

            const targetPath = this.resolvePath(this.cwd, fileArg);
            const lastSlash = targetPath.lastIndexOf('\\');
            if (lastSlash === -1) {
                this.writeOutput('Error: Invalid file path.', true);
                return;
            }

            const parentPath = targetPath.substring(0, lastSlash);
            const name = targetPath.substring(lastSlash + 1);

            const parentNode = VFS.resolve(parentPath);
            if (!parentNode || parentNode.type !== 'dir') {
                this.writeOutput(`Error: Directory not found: ${parentPath}`, true);
                return;
            }

            const success = VFS.writeFile(parentPath, name, content);
            if (success) {
                VFS.flushSync();
                this.writeOutput(`File written: ${targetPath}`);
            } else {
                this.writeOutput(`Error: Failed to write file: ${targetPath}`, true);
            }
            return;
        }

        // 2. Regular command parsing
        const args = trimmed.split(/\s+/);
        const cmd = (args[0] || '').toLowerCase();
        
        if (cmd === 'help') {
            this.writeOutput('Supported commands:');
            this.writeOutput('  cd <dir>     - Change current directory');
            this.writeOutput('  dir / ls     - List directory contents');
            this.writeOutput('  type / cat   - Display file content');
            this.writeOutput('  echo > file  - Write text to file');
            this.writeOutput('  mkdir <name> - Create directory');
            this.writeOutput('  del / rm     - Delete file or directory');
            this.writeOutput('  ren <o> <n>  - Rename file or directory');
            this.writeOutput('  cls / clear  - Clear the screen');
            this.writeOutput('  ver          - Print version info');
            this.writeOutput('  help         - Show this help menu');
        } else if (cmd === 'ver') {
            this.writeOutput('MS-DOS Prompt [Version 4.00.950]');
            this.writeOutput(`Windows App Center version: ${CONFIG.APP?.VERSION || '1.6.7'}`);
        } else if (cmd === 'cls' || cmd === 'clear') {
            if (this.outputContainer) this.outputContainer.innerHTML = '';
        } else if (cmd === 'cd') {
            const arg = args[1];
            if (!arg) {
                this.writeOutput(this.cwd);
                return;
            }
            const targetPath = this.resolvePath(this.cwd, arg);
            const node = VFS.resolve(targetPath);
            if (node && node.type === 'dir') {
                this.cwd = targetPath;
            } else {
                this.writeOutput(`Error: Directory not found: ${arg}`, true);
            }
        } else if (cmd === 'dir' || cmd === 'ls') {
            const files = VFS.listDir(this.cwd);
            if (files) {
                if (files.length === 0) {
                    this.writeOutput(' Directory is empty.');
                } else {
                    files.forEach(name => {
                        const path = this.cwd + (this.cwd.endsWith('\\') ? '' : '\\') + name;
                        const node = VFS.resolve(path);
                        if (node) {
                            const typeStr = node.type === 'dir' ? '<DIR>' : '     ';
                            const sizeStr = node.content ? `  ${node.content.length} bytes` : '';
                            this.writeOutput(` ${typeStr}  ${name}${sizeStr}`);
                        }
                    });
                }
            } else {
                this.writeOutput('Error: Failed to list directory.', true);
            }
        } else if (cmd === 'type' || cmd === 'cat') {
            const arg = args[1];
            if (!arg) {
                this.writeOutput('Error: No file specified.', true);
                return;
            }
            const targetPath = this.resolvePath(this.cwd, arg);
            const content = VFS.readFile(targetPath);
            if (content !== null) {
                this.writeOutput(content);
            } else {
                this.writeOutput(`Error: File not found: ${arg}`, true);
            }
        } else if (cmd === 'mkdir') {
            const arg = args[1];
            if (!arg) {
                this.writeOutput('Error: No directory name specified.', true);
                return;
            }
            const targetPath = this.resolvePath(this.cwd, arg);
            const lastSlash = targetPath.lastIndexOf('\\');
            if (lastSlash === -1) {
                this.writeOutput('Error: Invalid path.', true);
                return;
            }
            const parentPath = targetPath.substring(0, lastSlash);
            const name = targetPath.substring(lastSlash + 1);

            const success = VFS.mkdir(parentPath, name);
            if (success) {
                VFS.flushSync();
                this.writeOutput(`Directory created: ${targetPath}`);
            } else {
                this.writeOutput(`Error: Failed to create directory: ${arg}`, true);
            }
        } else if (cmd === 'del' || cmd === 'rm') {
            const arg = args[1];
            if (!arg) {
                this.writeOutput('Error: No target specified.', true);
                return;
            }
            const targetPath = this.resolvePath(this.cwd, arg);
            const lastSlash = targetPath.lastIndexOf('\\');
            if (lastSlash === -1) {
                this.writeOutput('Error: Invalid path.', true);
                return;
            }
            const parentPath = targetPath.substring(0, lastSlash);
            const name = targetPath.substring(lastSlash + 1);

            const success = VFS.deleteNode(parentPath, name);
            if (success) {
                VFS.flushSync();
                this.writeOutput(`Deleted: ${targetPath}`);
            } else {
                this.writeOutput(`Error: Failed to delete: ${arg}`, true);
            }
        } else if (cmd === 'ren') {
            const oldArg = args[1];
            const newArg = args[2];
            if (!oldArg || !newArg) {
                this.writeOutput('Usage: ren <old_name> <new_name>', true);
                return;
            }
            const targetPath = this.resolvePath(this.cwd, oldArg);
            const lastSlash = targetPath.lastIndexOf('\\');
            if (lastSlash === -1) {
                this.writeOutput('Error: Invalid path.', true);
                return;
            }
            const parentPath = targetPath.substring(0, lastSlash);
            const oldName = targetPath.substring(lastSlash + 1);

            const success = VFS.rename(parentPath, oldName, newArg);
            if (success) {
                VFS.flushSync();
                this.writeOutput(`Renamed ${oldName} to ${newArg}`);
            } else {
                this.writeOutput('Error: Failed to rename.', true);
            }
        } else {
            this.writeOutput(`Bad command or file name: ${cmd}`, true);
        }
    }

    public terminate(): void {
        if (this.inputEl) {
            Utils.eventManager.remove(this.inputEl, 'keydown', this.boundKeydown);
        }
        if (this.container) {
            Utils.eventManager.remove(this.container, 'click', this.boundContainerClick);
        }
        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('terminal', Terminal, {
    name: 'MS-DOS Prompt',
    icon: '🖥️',
    description: 'Command line interface.',
    singleton: false
});
