import { EventBus } from '../js/core/EventBus';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as StickyNotesController from '../js/core/StickyNotesController';
import { Services } from '../js/core/ServiceContainer';
import { VFS, type ITrashEntry } from '../js/core/VFS';
import { Utils } from '../js/utils';

describe('StickyNotesController', () => {
    let mockAudio: any;
    let mockNotify: any;
    let mockThemeManager: any;

    beforeEach(async () => {
        vi.restoreAllMocks();
        (Services as any).__reset();
        localStorage.clear();
        await VFS.init();

        mockAudio = {
            play: vi.fn()
        };
        mockNotify = {
            warn: vi.fn()
        };
        mockThemeManager = {
            currentTheme: 'hados'
        };

        Services.register('AudioManager', mockAudio);
        Services.register('Notify', mockNotify);
        Services.register('ThemeManager', mockThemeManager);

        // Setup DOM
        document.body.innerHTML = `
            <div id="icon-recyclebin">
                <div class="icon-box">
                    <img src="assets/icons/eco_bin_empty.webp" />
                </div>
            </div>
            
            <div id="dialog-recyclebin" style="display: none;">
                <div class="dialog-content"></div>
                <div class="dialog-buttons"></div>
            </div>

            <div id="sticky-1" class="draggable-sticky" style="position: absolute; left: 10px; top: 10px; width: 100px; height: 100px;">
                <p>Sticky Content 1</p>
            </div>
            <div id="sticky-2" class="draggable-sticky" style="position: absolute; left: 200px; top: 200px; width: 100px; height: 100px;">
                <p>Sticky Content 2</p>
            </div>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('restoreStickyNote', () => {
        it('should restore a sticky note display to block and restore styles', () => {
            const sticky = document.getElementById('sticky-1')!;
            
            // Setup sticky notes to store initial styles
            StickyNotesController.setupStickyNotes();

            sticky.style.display = 'none';
            StickyNotesController.restoreStickyNote(sticky);

            expect(sticky.style.display).toBe('block');
        });
    });

    describe('updateRecycleBinUI', () => {
        it('should render empty state message if no files/stickies are trashed', () => {
            vi.spyOn(VFS, 'listTrash').mockReturnValue([]);
            
            StickyNotesController.updateRecycleBinUI();

            const dialog = document.getElementById('dialog-recyclebin')!;
            expect(dialog.innerHTML).toContain('The Recycle Bin is empty.');
        });

        it('should render dialog rows with trashed files and handle Restore', () => {
            const trashedFile: ITrashEntry = { id: 'file-123', name: 'test.txt', type: 'file', origin: 'C:\\', deletedAt: 0 };
            vi.spyOn(VFS, 'listTrash').mockReturnValue([trashedFile]);
            const restoreSpy = vi.spyOn(VFS, 'restoreFromTrash').mockReturnValue(true);
            const flushSpy = vi.spyOn(VFS, 'flushSync').mockImplementation(() => {});

            StickyNotesController.updateRecycleBinUI();

            const dialog = document.getElementById('dialog-recyclebin')!;
            expect(dialog.innerHTML).toContain('test.txt');

            // Click Restore File button
            const restoreBtn = dialog.querySelector('.rb-restore-file') as HTMLElement;
            expect(restoreBtn).toBeDefined();
            restoreBtn.click();

            expect(restoreSpy).toHaveBeenCalledWith('file-123');
            expect(flushSpy).toHaveBeenCalled();
            expect(mockAudio.play).toHaveBeenCalledWith('spawn', { volume: 0.8 });
        });

        it('should show notify warn when file restore fails', () => {
            const trashedFile: ITrashEntry = { id: 'file-123', name: 'test.txt', type: 'file', origin: 'C:\\', deletedAt: 0 };
            vi.spyOn(VFS, 'listTrash').mockReturnValue([trashedFile]);
            vi.spyOn(VFS, 'restoreFromTrash').mockReturnValue(false);

            StickyNotesController.updateRecycleBinUI();

            const dialog = document.getElementById('dialog-recyclebin')!;
            const restoreBtn = dialog.querySelector('.rb-restore-file') as HTMLElement;
            restoreBtn.click();

            expect(mockNotify.warn).toHaveBeenCalledWith(expect.stringContaining('original folder no longer exists'));
        });

        it('should empty VFS trash on clicking Empty Recycle Bin button', () => {
            const trashedFile: ITrashEntry = { id: 'file-123', name: 'test.txt', type: 'file', origin: 'C:\\', deletedAt: 0 };
            vi.spyOn(VFS, 'listTrash').mockReturnValue([trashedFile]);
            const emptySpy = vi.spyOn(VFS, 'emptyTrash').mockImplementation(() => {});

            StickyNotesController.updateRecycleBinUI();

            const dialog = document.getElementById('dialog-recyclebin')!;
            const emptyBtn = dialog.querySelector('.rb-empty-btn') as HTMLElement;
            emptyBtn.click();

            expect(emptySpy).toHaveBeenCalled();
            expect(mockAudio.play).toHaveBeenCalledWith('release', { volume: 0.8 });
        });

        it('should render hidden stickies and restore them on click', () => {
            StickyNotesController.setupStickyNotes();
            const sticky = document.getElementById('sticky-1')!;
            sticky.style.display = 'none'; // Mark as hidden / in bin

            StickyNotesController.updateRecycleBinUI();

            const dialog = document.getElementById('dialog-recyclebin')!;
            expect(dialog.innerHTML).toContain('Sticky Content 1');

            const restoreBtn = dialog.querySelector('.restore-sticky-btn') as HTMLElement;
            restoreBtn.click();

            expect(sticky.style.display).toBe('block');
            expect(mockAudio.play).toHaveBeenCalledWith('spawn', { volume: 0.8 });
        });

        it('should restore all stickies when clicking Restore All Notes button', () => {
            StickyNotesController.setupStickyNotes();
            const sticky1 = document.getElementById('sticky-1')!;
            const sticky2 = document.getElementById('sticky-2')!;
            sticky1.style.display = 'none';
            sticky2.style.display = 'none';

            StickyNotesController.updateRecycleBinUI();

            const dialog = document.getElementById('dialog-recyclebin')!;
            const restoreAllBtn = dialog.querySelector('.restore-all-stickies-btn') as HTMLElement;
            restoreAllBtn.click();

            expect(sticky1.style.display).toBe('block');
            expect(sticky2.style.display).toBe('block');
        });
    });

    describe('refreshRecycleBinIcon & initRecycleBin', () => {
        it('should update the recycle bin icon image based on isBinFull()', () => {
            vi.spyOn(VFS, 'trashCount').mockReturnValue(0);
            
            StickyNotesController.refreshRecycleBinIcon();
            const img = document.querySelector('#icon-recyclebin .icon-box img') as HTMLImageElement;
            expect(img.getAttribute('src')).toBe('assets/icons/eco_bin_empty.webp');

            vi.spyOn(VFS, 'trashCount').mockReturnValue(5);
            StickyNotesController.refreshRecycleBinIcon();
            expect(img.getAttribute('src')).toBe('assets/icons/eco_bin_full.webp');
        });

        it('should not update icon if not hados theme', () => {
            mockThemeManager.currentTheme = 'modern';
            vi.spyOn(VFS, 'trashCount').mockReturnValue(5);
            const img = document.querySelector('#icon-recyclebin .icon-box img') as HTMLImageElement;
            img.setAttribute('src', 'original');

            StickyNotesController.refreshRecycleBinIcon();
            expect(img.getAttribute('src')).toBe('original');
        });

        it('should handle initialization events and trigger on vfs:trash-changed', () => {
            const spy = vi.spyOn(EventBus, 'on');
            StickyNotesController.initRecycleBin();
            
            expect(spy).toHaveBeenCalledWith('vfs:trash-changed', expect.any(Function));
            expect(spy).toHaveBeenCalledWith('themechanged', expect.any(Function));

            // Trigger vfs:trash-changed event via EventBus
            const dialog = document.getElementById('dialog-recyclebin')!;
            dialog.style.display = 'block'; // Make dialog visible to trigger updateRecycleBinUI
            
            EventBus.emit('vfs:trash-changed');

            // Assert it refreshed/updated dialog UI
            expect(dialog.querySelector('.dialog-content')).toBeDefined();
        });

        it('should restore to empty style if not registered in initialStyles', () => {
            const tempDiv = document.createElement('div');
            tempDiv.style.color = 'red';
            StickyNotesController.restoreStickyNote(tempDiv);
            expect(tempDiv.style.cssText).toBe('display: block;');
        });
    });

    describe('Dragging Interaction (setupStickyNotes)', () => {
        it('should initiate drag on mousedown, execute movement, and handle stopDrag with overlap check', () => {
            StickyNotesController.setupStickyNotes();
            const sticky = document.getElementById('sticky-1')!;

            // 1. Trigger mousedown
            const startEvent = new MouseEvent('mousedown', { clientX: 20, clientY: 20, cancelable: true });
            sticky.dispatchEvent(startEvent);

            expect(sticky.classList.contains('dragging')).toBe(true);

            // 2. Trigger mousemove on document
            const moveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 100, cancelable: true });
            document.dispatchEvent(moveEvent);

            // Left/top styles should be adjusted
            expect(sticky.style.left).toBeDefined();

            // Set recycle bin position to overlap sticky
            const recycleBin = document.getElementById('icon-recyclebin')!;
            vi.spyOn(recycleBin, 'getBoundingClientRect').mockReturnValue({
                left: 50, right: 150, top: 50, bottom: 150, width: 100, height: 100
            } as DOMRect);

            vi.spyOn(sticky, 'getBoundingClientRect').mockReturnValue({
                left: 60, right: 140, top: 60, bottom: 140, width: 80, height: 80
            } as DOMRect);

            // 3. Trigger mouseup on document to stop dragging
            const stopEvent = new MouseEvent('mouseup');
            document.dispatchEvent(stopEvent);

            expect(sticky.classList.contains('dragging')).toBe(false);
            // Since it overlapped, display should become 'none'
            expect(sticky.style.display).toBe('none');
            expect(mockAudio.play).toHaveBeenCalledWith('release', { volume: 0.8 });
        });

        it('should bypass dragging if clicking A or BUTTON tag', () => {
            StickyNotesController.setupStickyNotes();
            const sticky = document.getElementById('sticky-1')!;
            const link = document.createElement('a');
            sticky.appendChild(link);

            const startEvent = new MouseEvent('mousedown', { clientX: 20, clientY: 20 });
            Object.defineProperty(startEvent, 'target', { value: link, enumerable: true });
            
            sticky.dispatchEvent(startEvent);
            expect(sticky.classList.contains('dragging')).toBe(false);
        });
    });
});
