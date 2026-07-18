import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { VFS } from '../js/core/VFS';
import { Kernel } from '../js/core/Kernel';

// Setup Mock for Services since it exports a frozen object
const mockWindowManager = { open: vi.fn() };
vi.mock('../js/core/ServiceContainer', () => {
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

import { Services } from '../js/core/ServiceContainer';

// We need to fetch the class after mocking its dependencies
import { THIS_PC, openExplorerAt } from '../js/apps/FileExplorer';

describe('FileExplorer', () => {
    let explorer: any;

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
                } as any;
            }
            if (path === 'C:\\Games') {
                return {
                    type: 'dir',
                    children: {
                        'Tetris.exe': { type: 'file' }
                    }
                } as any;
            }
            return null;
        });

        // Mock Kernel
        vi.spyOn(Kernel, 'launch').mockImplementation(() => { return {} as any; });

        // Find the constructor through the Kernel registration since it's not exported
        const registry = Kernel.getRegistry();
        const ExplorerClass = registry.apps['explorer']!.appClass;
        explorer = new ExplorerClass();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // Clear mock calls for Service getter separately
        (Services.get as any).mockClear();
        mockWindowManager.open.mockClear();
    });

    describe('Initialization & Rendering', () => {
        it('should initialize with default path C:\\', () => {
            expect(explorer.currentPath).toBe('C:\\');
        });

        it('should render the contents of the current directory', () => {
            const view = document.getElementById('explorer-view-area')!;
            const icons = view.querySelectorAll('.explorer-icon');

            // Should render Games, DOOM.exe, and Secret.txt
            expect(icons.length).toBe(3);
            expect(icons[0]!.textContent).toContain('Games');
            expect(icons[1]!.textContent).toContain('DOOM.exe');
            expect(icons[2]!.textContent).toContain('Secret.txt');
        });

        it('should update the address input and status text', () => {
            const addressInput = document.getElementById('explorer-address-input') as HTMLInputElement;
            const status = document.getElementById('explorer-status')!;

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
            const view = document.getElementById('explorer-view-area')!;
            const icons = view.querySelectorAll('.explorer-icon');
            expect(icons.length).toBe(1);
            expect(icons[0]!.textContent).toContain('Tetris.exe');
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

            const dialog = document.getElementById('dialog-encryption')!;
            expect(dialog.style.display).toBe('block');
        });

        it('should use WindowManager to openWindow actionType', () => {
            explorer.executeAction('openWindow', 'win-test');

            const mockWm = Services.get('WindowManager') as any;
            expect(mockWm.open).toHaveBeenCalledWith('win-test');
        });
    });

    describe('This PC (the drive root)', () => {
        it('renders a single honest HadOS drive, not a VFS folder', () => {
            explorer.navigate(THIS_PC);
            const view = document.getElementById('explorer-view-area')!;
            const drive = view.querySelector('.explorer-drive');
            expect(drive).toBeTruthy();
            expect(drive!.querySelector('.drive-name')!.textContent).toBe('HadOS (C:)');
            // The address bar and status reflect the drive view, not a path.
            expect((document.getElementById('explorer-address-input') as HTMLInputElement).value).toBe(THIS_PC);
            expect(document.getElementById('explorer-status')!.textContent).toBe('1 drive');
        });

        it('shows real storage from navigator.storage.estimate', async () => {
            vi.stubGlobal('navigator', {
                storage: { estimate: vi.fn().mockResolvedValue({ quota: 2_000_000_000, usage: 500_000_000 }) },
            });
            explorer.navigate(THIS_PC);
            await Promise.resolve(); await Promise.resolve(); // let fillDriveCapacity settle
            const caption = document.querySelector('.explorer-drive .drive-caption')!;
            // 1.5 GB free of ~1.9 GB, and the meter reflects 25% used.
            expect(caption.textContent).toMatch(/free of/);
            const fill = document.querySelector('.explorer-drive .drive-meter-fill') as HTMLElement;
            expect(parseInt(fill.style.width, 10)).toBe(25);
            vi.unstubAllGlobals();
        });

        it('drilling into the drive navigates to C:\\, and Back returns to This PC', () => {
            explorer.navigate(THIS_PC);
            (document.querySelector('.explorer-drive') as HTMLElement).ondblclick!(new MouseEvent('dblclick'));
            expect((document.getElementById('explorer-address-input') as HTMLInputElement).value).toBe('C:\\');
            document.getElementById('explorer-back')!.click(); // Back is wired to goBack in init()
            expect((document.getElementById('explorer-address-input') as HTMLInputElement).value).toBe(THIS_PC);
        });
    });

    describe('Translated folder labels', () => {
        it('shows the i18nKey translation as the label but keeps the raw name for navigation', async () => {
            const { i18n } = await import('../js/services/i18n');
            vi.spyOn(i18n, 't').mockImplementation((k: string) => (k === 'fs.documents' ? 'Documentos' : k));
            vi.spyOn(VFS, 'resolve').mockReturnValue({
                type: 'dir',
                children: {
                    // Translated folder…
                    'DOCUMENTS': { name: 'DOCUMENTS', type: 'dir', i18nKey: 'fs.documents', children: {} },
                    // …and a brand with no key stays raw.
                    'HADOS': { name: 'HADOS', type: 'dir', children: {} },
                },
            } as any);

            explorer.render();
            const labels = [...document.querySelectorAll('.explorer-icon span')].map(s => s.textContent);
            expect(labels).toContain('Documentos'); // translated display label
            expect(labels).toContain('HADOS');      // no i18nKey → raw name
            // The underlying node name is untouched, so double-click navigates by 'DOCUMENTS'.
            const docsIcon = [...document.querySelectorAll('.explorer-icon')]
                .find(el => el.querySelector('span')?.textContent === 'Documentos') as HTMLElement;
            docsIcon.ondblclick!(new MouseEvent('dblclick'));
            expect((document.getElementById('explorer-address-input') as HTMLInputElement).value).toBe('C:\\DOCUMENTS');
        });
    });

    describe('openExplorerAt', () => {
        it('navigates the already-open window instead of re-launching', () => {
            // `explorer` from beforeEach is the live instance.
            openExplorerAt('This PC');
            expect((document.getElementById('explorer-address-input') as HTMLInputElement).value).toBe(THIS_PC);
            // It did NOT spawn a second explorer.
            expect(Kernel.launch).not.toHaveBeenCalledWith('explorer', expect.anything());
        });

        it('the explorer action type opens the explorer at a path', () => {
            explorer.executeAction('explorer', 'This PC');
            expect((document.getElementById('explorer-address-input') as HTMLInputElement).value).toBe(THIS_PC);
        });
    });
});
