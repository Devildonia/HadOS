import { i18n } from '../../services/i18n.js';
import { Paint } from '../Paint.js';

export function getMenusHTML(): string {
    return `
        <div class="notepad-menu-entry" id="paint-menu-file">
            <span class="notepad-menu-label">${i18n.t('paint.menu.file')}</span>
            <div class="notepad-dropdown" id="paint-dropdown-file">
                <div class="notepad-dropdown-item" data-paint-action="new">
                    <span>${i18n.t('paint.menu.file_new')}</span>
                </div>
                <div class="notepad-dropdown-item" data-paint-action="open">
                    <span>${i18n.t('paint.menu.file_open')}</span>
                </div>
                <div class="notepad-dropdown-item" data-paint-action="save">
                    <span>${i18n.t('paint.menu.file_save')}</span>
                </div>
                <div class="notepad-dropdown-separator"></div>
                <div class="notepad-dropdown-item" data-paint-action="exit">
                    <span>${i18n.t('paint.menu.file_exit')}</span>
                </div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="paint-menu-edit">
            <span class="notepad-menu-label">${i18n.t('paint.menu.edit')}</span>
            <div class="notepad-dropdown" id="paint-dropdown-edit">
                <div class="notepad-dropdown-item" data-paint-action="undo" id="menu-paint-undo">
                    <span>${i18n.t('paint.menu.edit_undo')}</span>
                    <span style="color: #808080; margin-left: 10px;">Ctrl+Z</span>
                </div>
                <div class="notepad-dropdown-item" data-paint-action="redo" id="menu-paint-redo">
                    <span>${i18n.t('paint.menu.edit_redo')}</span>
                    <span style="color: #808080; margin-left: 10px;">Ctrl+Y</span>
                </div>
                <div class="notepad-dropdown-separator"></div>
                <div class="notepad-dropdown-item" data-paint-action="clear">
                    <span>${i18n.t('paint.menu.edit_clear')}</span>
                </div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="paint-menu-view">
            <span class="notepad-menu-label">${i18n.t('paint.menu.view')}</span>
            <div class="notepad-dropdown" id="paint-dropdown-view">
                <div class="notepad-dropdown-item" data-paint-action="zoom-in">
                    <span>${i18n.t('paint.menu.view_zoom_in')}</span>
                </div>
                <div class="notepad-dropdown-item" data-paint-action="zoom-out">
                    <span>${i18n.t('paint.menu.view_zoom_out')}</span>
                </div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="paint-menu-image">
            <span class="notepad-menu-label">${i18n.t('paint.menu.image')}</span>
            <div class="notepad-dropdown" id="paint-dropdown-image">
                <div class="notepad-dropdown-item" data-paint-action="cutout">
                    <span>${i18n.t('paint.menu.image_cutout')}</span>
                </div>
                <div class="notepad-dropdown-separator"></div>
                <div class="notepad-dropdown-item" data-paint-action="invert">
                    <span>${i18n.t('paint.menu.image_invert')}</span>
                </div>
                <div class="notepad-dropdown-item" data-paint-action="grayscale">
                    <span>${i18n.t('paint.menu.image_grayscale')}</span>
                </div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="paint-menu-colors">
            <span class="notepad-menu-label">${i18n.t('paint.menu.colors')}</span>
            <div class="notepad-dropdown" id="paint-dropdown-colors">
                <div class="notepad-dropdown-item" data-paint-action="custom-color">
                    <span>${i18n.t('paint.menu.colors_custom')}</span>
                </div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="paint-menu-help">
            <span class="notepad-menu-label">${i18n.t('paint.menu.help')}</span>
            <div class="notepad-dropdown" id="paint-dropdown-help">
                <div class="notepad-dropdown-item" data-paint-action="about">
                    <span>${i18n.t('paint.menu.help_about')}</span>
                </div>
            </div>
        </div>
    `;
}

export class PaintMenus {
    private owner: Paint;
    private entries: HTMLElement[] = [];
    private documentClickHandler: (e: MouseEvent) => void;

    constructor(owner: Paint) {
        this.owner = owner;
        this.documentClickHandler = (e: MouseEvent) => this.handleOutsideClick(e);
    }

    public setup(): void {
        const container = document.getElementById(this.owner.windowId);
        if (!container) return;

        const menuBar = container.querySelector('.window-menu') as HTMLElement;
        if (!menuBar) return;

        menuBar.innerHTML = getMenusHTML();
        this.entries = Array.from(menuBar.querySelectorAll('.notepad-menu-entry'));

        this.entries.forEach(entry => {
            const label = entry.querySelector('.notepad-menu-label');
            label?.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = entry.classList.contains('open');
                this.closeAll();
                if (!isOpen) {
                    entry.classList.add('open');
                }
            });

            // Hover to open other menu if one is already open
            label?.addEventListener('mouseenter', () => {
                const anyOpen = this.entries.some(e => e.classList.contains('open'));
                if (anyOpen) {
                    this.closeAll();
                    entry.classList.add('open');
                }
            });
        });

        // Click actions
        const items = menuBar.querySelectorAll('.notepad-dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = (item as HTMLElement).dataset.paintAction;
                if (action) {
                    this.owner.executeMenuAction(action);
                }
                this.closeAll();
            });
        });

        document.addEventListener('click', this.documentClickHandler);
        this.updateUndoRedoMenuState();
    }

    public updateUndoRedoMenuState(): void {
        const core = this.owner.core;
        if (!core) return;
        
        const undoItem = document.getElementById('menu-paint-undo');
        const redoItem = document.getElementById('menu-paint-redo');
        
        if (undoItem) {
            if (core.canUndo()) {
                undoItem.classList.remove('disabled');
            } else {
                undoItem.classList.add('disabled');
            }
        }
        if (redoItem) {
            if (core.canRedo()) {
                redoItem.classList.remove('disabled');
            } else {
                redoItem.classList.add('disabled');
            }
        }
    }

    private closeAll(): void {
        this.entries.forEach(e => e.classList.remove('open'));
    }

    private handleOutsideClick(e: MouseEvent): void {
        const path = e.composedPath();
        const clickedInsideMenu = path.some(el => 
            el instanceof HTMLElement && el.classList.contains('notepad-menu-entry')
        );
        if (!clickedInsideMenu) {
            this.closeAll();
        }
    }

    public dispose(): void {
        document.removeEventListener('click', this.documentClickHandler);
    }
}
