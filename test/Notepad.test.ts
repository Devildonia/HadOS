import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel';
import { Services } from '../js/core/ServiceContainer';
import { VFS } from '../js/core/VFS';

// Import Notepad module
import '../js/apps/Notepad';

describe('Notepad', () => {
    let mockTextarea: HTMLTextAreaElement;
    let mockWindowFactory: any;
    let mockResourceManager: any;
    let mockWindowManager: any;
    let mockNotify: any;

    beforeEach(async () => {
        vi.restoreAllMocks();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        (Services as any).__reset();
        localStorage.clear();
        await VFS.init();

        document.body.innerHTML = `
            <div id="win-notepad" class="hados-window" style="display:none;">
                <div class="window-header"><span>Untitled - Notapad</span></div>
                <div class="window-menu" id="notepad-menu-bar">
                    <div class="notepad-menu-entry" id="notepad-menu-file">
                        <span class="notepad-menu-label">File</span>
                        <div class="notepad-dropdown" id="notepad-dropdown-file">
                            <div class="notepad-dropdown-item" data-notepad-action="new">New</div>
                            <div class="notepad-dropdown-item" data-notepad-action="new-window">New Window</div>
                            <div class="notepad-dropdown-item" data-notepad-action="open">Open...</div>
                            <div class="notepad-dropdown-item" data-notepad-action="save">Save</div>
                            <div class="notepad-dropdown-item" data-notepad-action="save-as">Save As...</div>
                            <div class="notepad-dropdown-separator"></div>
                            <div class="notepad-dropdown-item" data-notepad-action="exit">Exit</div>
                        </div>
                    </div>
                    <div class="notepad-menu-entry" id="notepad-menu-edit">
                        <span class="notepad-menu-label">Edit</span>
                        <div class="notepad-dropdown" id="notepad-dropdown-edit">
                            <div class="notepad-dropdown-item" data-notepad-action="undo">Undo</div>
                        </div>
                    </div>
                </div>

                <div class="notepad-dialog" id="notepad-open-dialog" style="display:none;">
                    <input type="text" id="notepad-open-input" class="notepad-dialog-input" />
                    <div class="notepad-dialog-files" id="notepad-dialog-filelist"></div>
                    <button id="notepad-open-ok">Open</button>
                    <button id="notepad-open-cancel">Cancel</button>
                </div>
                
                <div class="notepad-dialog" id="notepad-saveas-dialog" style="display:none;">
                    <input type="text" id="notepad-saveas-input" class="notepad-dialog-input" />
                    <button id="notepad-saveas-ok">Save</button>
                    <button id="notepad-saveas-cancel">Cancel</button>
                </div>

                <div class="notepad-dialog" id="notepad-find-dialog" style="display:none;">
                    <input type="text" id="notepad-find-input" class="notepad-dialog-input" />
                    <button id="notepad-find-next">Find Next</button>
                    <button id="notepad-find-cancel">Cancel</button>
                </div>

                <div class="window-body">
                    <textarea id="notepad-textarea"></textarea>
                </div>
                <div class="window-statusbar">
                    <span id="notepad-status">For Help, press F1</span>
                </div>
            </div>
        `;

        mockTextarea = document.getElementById('notepad-textarea') as HTMLTextAreaElement;

        mockWindowFactory = {
            create: vi.fn((opts) => {
                const el = document.createElement('div');
                el.id = opts.id;
                el.appendChild(opts.bodyElement || document.createElement('div'));
                document.body.appendChild(el);
                return opts.id;
            }),
            getBody: vi.fn().mockReturnValue(document.getElementById('win-notepad'))
        };

        mockResourceManager = {
            register: vi.fn(),
            disposeOwner: vi.fn()
        };

        mockWindowManager = {
            open: vi.fn(),
            close: vi.fn()
        };

        mockNotify = {
            success: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            info: vi.fn()
        };

        Services.register('WindowFactory', mockWindowFactory);
        Services.register('ResourceManager', mockResourceManager);
        Services.register('WindowManager', mockWindowManager);
        Services.register('Notify', mockNotify);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('registration', () => {
        it('should be registered in Kernel as "notepad"', () => {
            const registry = Kernel.getRegistry();
            expect(registry.apps['notepad']).toBeDefined();
        });
    });

    describe('dropdown menu and execution', () => {
        it('should open dropdown menu on click', () => {
            const proc = Kernel.launch('notepad') as any;
            const fileMenu = document.getElementById('notepad-menu-file')!;
            const label = fileMenu.querySelector('.notepad-menu-label') as HTMLElement;
            
            label.click();

            expect(fileMenu.classList.contains('open')).toBe(true);

            // Click outside closes menu
            document.body.click();
            expect(fileMenu.classList.contains('open')).toBe(false);
            term(proc);
        });

        it('should dispatch keyboard shortcuts', () => {
            const proc = Kernel.launch('notepad') as any;
            const executeSpy = vi.spyOn(proc.instance, '_executeAction');

            const win = document.getElementById('win-notepad')!;
            win.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 's' }));

            expect(executeSpy).toHaveBeenCalledWith('save');
            term(proc);
        });
    });

    describe('Dialog UI Operations', () => {
        it('should open save-as dialog, type filename, and write to VFS', () => {
            const proc = Kernel.launch('notepad') as any;
            mockTextarea.value = 'VFS content';

            // Click Save As
            proc.instance._executeAction('save-as');
            const dialog = document.getElementById('notepad-saveas-dialog')!;
            const input = document.getElementById('notepad-saveas-input') as HTMLInputElement;
            const saveBtn = document.getElementById('notepad-saveas-ok') as HTMLButtonElement;

            expect(dialog.style.display).toBe('block');
            
            input.value = 'doc1';
            saveBtn.click();

            expect(dialog.style.display).toBe('none');
            
            // Check that it wrote to VFS DOCUMENTS
            const content = VFS.readFile('C:\\DOCUMENTS\\doc1.txt');
            expect(content).toBe('VFS content');
            term(proc);
        });

        it('should open file dialog, select file, and read content from VFS', () => {
            // Write a file directly to VFS
            VFS.writeFile('C:\\DOCUMENTS', 'read.txt', 'VFS read content');

            const proc = Kernel.launch('notepad') as any;

            // Click Open
            proc.instance._executeAction('open');

            const dialog = document.getElementById('notepad-open-dialog')!;
            const input = document.getElementById('notepad-open-input') as HTMLInputElement;
            const okBtn = document.getElementById('notepad-open-ok') as HTMLButtonElement;

            expect(dialog.style.display).toBe('block');

            // Find file listed in list
            const list = document.getElementById('notepad-dialog-filelist')!;
            expect(list.innerHTML).toContain('read.txt');

            // Select and confirm
            input.value = 'read.txt';
            okBtn.click();

            expect(mockTextarea.value).toBe('VFS read content');
            expect(dialog.style.display).toBe('none');
            term(proc);
        });

        it('should support find increments in find dialog', () => {
            const proc = Kernel.launch('notepad') as any;
            mockTextarea.value = 'hello search world search';

            proc.instance._executeAction('find');
            const dialog = document.getElementById('notepad-find-dialog')!;
            const input = document.getElementById('notepad-find-input') as HTMLInputElement;
            const nextBtn = document.getElementById('notepad-find-next') as HTMLButtonElement;

            input.value = 'search';
            
            // First hit
            nextBtn.click();
            expect(proc.instance._lastFindIndex).not.toBe(-1);

            // Second hit
            const prevIdx = proc.instance._lastFindIndex;
            nextBtn.click();
            expect(proc.instance._lastFindIndex).toBeGreaterThan(prevIdx);
            
            term(proc);
        });
    });

    describe('Exit application', () => {
        it('should prompt save on exit if modified', () => {
            const proc = Kernel.launch('notepad') as any;
            proc.instance.isModified = true;
            
            const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false); // Discard
            proc.instance._executeAction('exit');

            expect(confirmSpy).toHaveBeenCalled();
            expect(mockWindowManager.close).toHaveBeenCalled();
            term(proc);
        });
    });

    function term(proc: any) {
        if (proc && proc.instance) proc.instance.terminate();
    }
});
