// Body markup for the primary Notepad window.
export const NOTEPAD_BODY_HTML = `
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
                <div class="notepad-dropdown-item" data-notepad-action="undo">Undo        Ctrl+Z</div>
                <div class="notepad-dropdown-separator"></div>
                <div class="notepad-dropdown-item" data-notepad-action="cut">Cut         Ctrl+X</div>
                <div class="notepad-dropdown-item" data-notepad-action="copy">Copy        Ctrl+C</div>
                <div class="notepad-dropdown-item" data-notepad-action="paste">Paste       Ctrl+V</div>
                <div class="notepad-dropdown-item" data-notepad-action="select-all">Select All  Ctrl+A</div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="notepad-menu-search">
            <span class="notepad-menu-label">Search</span>
            <div class="notepad-dropdown" id="notepad-dropdown-search">
                <div class="notepad-dropdown-item" data-notepad-action="find">Find...     Ctrl+F</div>
            </div>
        </div>
        <div class="notepad-menu-entry" id="notepad-menu-help">
            <span class="notepad-menu-label">Help</span>
            <div class="notepad-dropdown" id="notepad-dropdown-help">
                <div class="notepad-dropdown-item" data-notepad-action="about">About Notapad</div>
            </div>
        </div>
    </div>
    <div class="notepad-dialog" id="notepad-open-dialog" style="display:none;">
        <div class="notepad-dialog-title">Open</div>
        <div class="notepad-dialog-body">
            <label>File name:</label>
            <input type="text" id="notepad-open-input" class="notepad-dialog-input" placeholder="e.g. README.txt" />
            <div class="notepad-dialog-files" id="notepad-dialog-filelist"></div>
        </div>
        <div class="notepad-dialog-buttons">
            <button class="hados-btn" id="notepad-open-ok">Open</button>
            <button class="hados-btn" id="notepad-open-cancel">Cancel</button>
        </div>
    </div>
    <div class="notepad-dialog" id="notepad-saveas-dialog" style="display:none;">
        <div class="notepad-dialog-title">Save As</div>
        <div class="notepad-dialog-body">
            <label>File name:</label>
            <input type="text" id="notepad-saveas-input" class="notepad-dialog-input" />
        </div>
        <div class="notepad-dialog-buttons">
            <button class="hados-btn" id="notepad-saveas-ok">Save</button>
            <button class="hados-btn" id="notepad-saveas-cancel">Cancel</button>
        </div>
    </div>
    <div class="notepad-dialog" id="notepad-find-dialog" style="display:none;">
        <div class="notepad-dialog-title">Find</div>
        <div class="notepad-dialog-body">
            <label>Find what:</label>
            <input type="text" id="notepad-find-input" class="notepad-dialog-input" />
        </div>
        <div class="notepad-dialog-buttons">
            <button class="hados-btn" id="notepad-find-next">Find Next</button>
            <button class="hados-btn" id="notepad-find-cancel">Cancel</button>
        </div>
    </div>
    <textarea id="notepad-textarea"></textarea>
    <div class="window-statusbar">
        <span id="notepad-status">For Help, press F1</span>
    </div>`;
