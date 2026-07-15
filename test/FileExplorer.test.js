import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { VFS } from '../js/core/VFS.js';
import { Kernel } from '../js/core/Kernel.js';

// Setup Mock for Services since it exports a frozen object
const mockWindowManager = { open: vi.fn() };
vi.mock('../js/core/ServiceContainer.js', () => {
    return {
        Services: {
            get: vi.fn((name) => {
                if (name === 'WindowManager') return mockWindowManager;
                return null;
            }),
            register: vi.fn()
        }
    };
});

import { Services } from '../js/core/ServiceContainer.js';

// We need to fetch the class after mocking its dependencies
const FileExplorerModule = await import('../js/apps/FileExplorer.js');

describe('FileExplorer', () => {
    let explorer;

    beforeEach(async () => {
        document.body.innerHTML = `
            <div id="explorer-view-area"></div>
            <input id="explorer-address-input" />
            <button id="explorer-back"></button>
            <span id="explorer-status"></span>
        `;

        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });

        // Mock VFS
        vi.spyOn(VFS, 'resolve').mockImplementation((path) => {
            if (path === 'C:\\') {
                return {
                    type: 'dir',
                    children: {
                        'Games': { type: 'dir' },
                        'DOOM.exe': { type: 'file' },
                        'Secret.txt': { type: 'file', actionType: 'openDialog', actionTarget: 'dialog-encryption' }
                    }
                };
            }
            if (path === 'C:\\Games') {
                return {
                    type: 'dir',
                    children: {
                        'Tetris.exe': { type: 'file' }
                    }
                };
            }
            return null;
        });

        // Mock Kernel
        vi.spyOn(Kernel, 'launch').mockImplementation(() => { });

        // Find the constructor through the Kernel registration since it's not exported
        const registry = Kernel.getRegistry();
        const ExplorerClass = registry.apps['explorer'].appClass;
        explorer = new ExplorerClass();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // Clear mock calls for Service getter separately
        Services.get.mockClear();
        mockWindowManager.open.mockClear();
    });

    describe('Initialization & Rendering', () => {
        it('should initialize with default path C:\\', () => {
            expect(explorer.currentPath).toBe('C:\\');
        });

        it('should render the contents of the current directory', () => {
            const view = document.getElementById('explorer-view-area');
            const icons = view.querySelectorAll('.explorer-icon');

            // Should render Games, DOOM.exe, and Secret.txt
            expect(icons.length).toBe(3);
            expect(icons[0].textContent).toContain('Games');
            expect(icons[1].textContent).toContain('DOOM.exe');
            expect(icons[2].textContent).toContain('Secret.txt');
        });

        it('should update the address input and status text', () => {
            const addressInput = document.getElementById('explorer-address-input');
            const status = document.getElementById('explorer-status');

            expect(addressInput.value).toBe('C:\\');
            expect(status.textContent).toBe('3 object(s)');
        });
    });

    describe('Navigation', () => {
        it('should navigate to a subdirectory and push to history', () => {
            explorer.navigateTo('Games');

            expect(explorer.currentPath).toBe('C:\\Games');
            expect(explorer.history).toEqual(['C:\\']);

            // Re-render check
            const view = document.getElementById('explorer-view-area');
            const icons = view.querySelectorAll('.explorer-icon');
            expect(icons.length).toBe(1);
            expect(icons[0].textContent).toContain('Tetris.exe');
        });

        it('should go back to the previous directory using history', () => {
            explorer.navigateTo('Games');
            explorer.goBack();

            expect(explorer.currentPath).toBe('C:\\');
            expect(explorer.history.length).toBe(0);
        });

        it('should not throw or change path when going back with empty history', () => {
            const initialPath = explorer.currentPath;
            explorer.goBack();
            expect(explorer.currentPath).toBe(initialPath);
        });
    });

    describe('Execution & Double Clicks', () => {
        it('should execute files with .exe extension via Kernel.launch', () => {
            explorer.executeFile('DOOM.exe');
            expect(Kernel.launch).toHaveBeenCalledWith('doom');
        });

        it('should handle custom actions attached to file metadata (actionType)', () => {
            // Mock dialog
            document.body.innerHTML += '<div id="dialog-encryption" style="display:none"></div>';

            explorer.executeAction('openDialog', 'dialog-encryption');

            const dialog = document.getElementById('dialog-encryption');
            expect(dialog.style.display).toBe('block');
        });

        it('should use WindowManager to openWindow actionType', () => {
            explorer.executeAction('openWindow', 'win-test');

            const mockWm = Services.get('WindowManager');
            expect(mockWm.open).toHaveBeenCalledWith('win-test');
        });
    });
});
