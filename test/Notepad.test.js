import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel.js';
import { Services } from '../js/core/ServiceContainer.js';

// Import Notepad module (registers itself with Kernel)
import '../js/apps/Notepad.js';
import { Notify } from '../js/ui/NotificationManager.js';

describe('Notepad', () => {
    let mockTextarea;

    beforeEach(() => {
        vi.resetAllMocks();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        Services.__reset();
        localStorage.clear();

        // Re-register Notepad since Kernel was reset
        // We need to re-import or manually register
        // Instead, we test the class directly via Kernel registry after fresh import

        document.body.innerHTML = `
            <div id="win-notepad" class="win95-window" style="display:none;">
                <div class="window-header"><span>Untitled - Notepad</span></div>
                <div class="window-menu">
                    <span class="menu-item">File</span>
                    <span class="menu-item">Edit</span>
                </div>
                <div class="window-body">
                    <textarea id="notepad-textarea"></textarea>
                </div>
            </div>
        `;

        mockTextarea = document.getElementById('notepad-textarea');

        // Mock WindowManager
        Services.register('WindowManager', {
            open: vi.fn(),
            close: vi.fn()
        });

        // Mock Notify
        Services.register('Notify', {
            success: vi.fn(),
            warn: vi.fn(),
            error: vi.fn()
        });
    });

    describe('registration', () => {
        it('should be registered in Kernel as "notepad"', () => {
            // After import, Notepad registers itself
            const registry = Kernel.getRegistry();
            expect(registry.apps['notepad']).toBeDefined();
            expect(registry.apps['notepad'].metadata.name).toBe('Notepad');
            expect(registry.apps['notepad'].metadata.icon).toBe('📝');
        });
    });

    describe('launch', () => {
        it('should create instance with correct windowId', () => {
            const proc = Kernel.launch('notepad');
            expect(proc).not.toBeNull();
            expect(proc.instance.windowId).toBe('win-notepad');
        });

        it('should initialize with "Untitled" as default file', () => {
            const proc = Kernel.launch('notepad');
            expect(proc.instance.currentFile).toBe('Untitled');
        });
    });

    describe('file operations', () => {
        it('should save file to localStorage', () => {
            const proc = Kernel.launch('notepad');
            mockTextarea.value = 'Hello World';

            // Simulate save
            vi.spyOn(window, 'prompt').mockReturnValue('test-file');
            proc.instance.saveFile();

            const saved = JSON.parse(localStorage.getItem('notepad_test-file'));
            expect(saved).toBe('Hello World');
        });

        it('should open file from localStorage', () => {
            // Pre-save a file
            localStorage.setItem('notepad_saved-doc', JSON.stringify('Saved content'));

            const proc = Kernel.launch('notepad');
            vi.spyOn(window, 'prompt').mockReturnValue('saved-doc');
            proc.instance.openFile();

            expect(mockTextarea.value).toBe('Saved content');
            expect(proc.instance.currentFile).toBe('saved-doc');
        });

        it('should show warning when opening non-existent file', () => {
            const proc = Kernel.launch('notepad');
            const notifyMock = Services.get('Notify');
            vi.spyOn(window, 'prompt').mockReturnValue('ghost-file');
            proc.instance.openFile();
            expect(notifyMock.warn).toHaveBeenCalledWith('File not found');
        });

        it('should create new file and clear textarea', () => {
            const proc = Kernel.launch('notepad');
            mockTextarea.value = 'Some text';
            proc.instance.isModified = false; // skip save prompt
            vi.spyOn(window, 'confirm').mockReturnValue(true);

            proc.instance.newFile();
            expect(mockTextarea.value).toBe('');
            expect(proc.instance.currentFile).toBe('Untitled');
        });
    });

    describe('title updates', () => {
        it('should show asterisk when modified', () => {
            const proc = Kernel.launch('notepad');
            proc.instance.isModified = true;
            proc.instance.updateTitle();

            const title = document.querySelector('#win-notepad .window-header span');
            expect(title.textContent).toContain('*');
        });

        it('should not show asterisk when unmodified', () => {
            const proc = Kernel.launch('notepad');
            proc.instance.isModified = false;
            proc.instance.updateTitle();

            const title = document.querySelector('#win-notepad .window-header span');
            expect(title.textContent).not.toContain('*');
        });
    });

    describe('multi-window support', () => {
        it('should allow parameterizing the windowId and textareaId in constructor', () => {
            const container = document.createElement('div');
            container.id = 'win-custom';
            container.innerHTML = `
                <div class="window-header"><span>Untitled - Notepad</span></div>
                <div class="window-body">
                    <textarea id="textarea-custom"></textarea>
                </div>
            `;
            document.body.appendChild(container);

            const notepad = new (Kernel.getRegistry().apps['notepad'].appClass)({
                windowId: 'win-custom',
                textareaId: 'textarea-custom'
            });

            expect(notepad.windowId).toBe('win-custom');
            expect(notepad.textareaId).toBe('textarea-custom');
            container.remove();
        });

        it('should support opening a new window via WindowFactory and not affect other instances', () => {
            // Mock WindowFactory in Services
            const mockWindowFactory = {
                create: vi.fn((opts) => {
                    const el = document.createElement('div');
                    el.id = opts.id;
                    el.appendChild(opts.bodyElement);
                    document.body.appendChild(el);
                    return opts.id;
                })
            };
            Services.register('WindowFactory', mockWindowFactory);

            // Re-mock WindowManager to include open
            Services.register('WindowManager', {
                open: vi.fn(),
                close: vi.fn(),
                makeDraggable: vi.fn()
            });

            // We need to set up the menu for the main instance
            document.body.innerHTML = `
                <div id="win-notepad">
                    <div class="window-header"><span>Untitled - Notepad</span></div>
                    <div class="window-body">
                        <div class="window-menu" id="notepad-menu-bar"></div>
                        <textarea id="notepad-textarea"></textarea>
                    </div>
                </div>
            `;

            const primaryInstance = new (Kernel.getRegistry().apps['notepad'].appClass)();
            
            // Execute new-window action
            primaryInstance._executeAction('new-window');

            // Expect WindowFactory.create was called
            expect(mockWindowFactory.create).toHaveBeenCalled();

            // Find dynamic textarea and check it is different
            const dynamicTextarea = document.querySelector('[id^="notepad-textarea-dynamic-"]');
            expect(dynamicTextarea).not.toBeNull();
            expect(dynamicTextarea.id).not.toBe('notepad-textarea');

            // Clean up created dynamic windows
            const dynamicWins = document.querySelectorAll('[id^="win-notepad-dynamic-"]');
            dynamicWins.forEach(w => w.remove());
        });
    });
});
