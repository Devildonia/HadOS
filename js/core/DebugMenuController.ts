let windowControlListenersAttached = false;
let debugKeydownHandler: ((e: KeyboardEvent) => void) | null = null;

export function setupDebugMenu(): void {
    // --- Debug Menu (Ctrl + Alt + W) ---
    if (!windowControlListenersAttached) {
        debugKeydownHandler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && (e.key === 'w' || e.key === 'W')) {
                e.preventDefault();
                if (window.playBlip) window.playBlip(600);
                if (window.openDialog) {
                    window.openDialog('dialog-debug');
                }
                const debugDialog = document.getElementById('dialog-debug');
                if (debugDialog) {
                    debugDialog.style.display = 'block';
                    debugDialog.style.top = '50%';
                    debugDialog.style.left = '50%';
                    debugDialog.style.transform = 'translate(-50%, -50%)';
                }
            }
        };
        document.addEventListener('keydown', debugKeydownHandler);
        windowControlListenersAttached = true;
    }

    // Bind debug action if already present
    bindDebugResetButton();
}

function bindDebugResetButton(): void {
    const btnResetDesktop = document.getElementById('btn-reset-desktop');
    if (btnResetDesktop && !btnResetDesktop.dataset.listening) {
        btnResetDesktop.onclick = () => {
            if (confirm("Are you sure? This will delete all settings and restart the system.")) {
                // Full System Reset: Clear all localStorage
                localStorage.clear();

                // Play sound and reload
                if (window.playBlip) window.playBlip(900);
                setTimeout(() => location.reload(), 200);
            }
        };
        btnResetDesktop.dataset.listening = 'true';
    }
}

export function resetDebugMenuState(): void {
    if (debugKeydownHandler) {
        document.removeEventListener('keydown', debugKeydownHandler);
        debugKeydownHandler = null;
    }
    const btnResetDesktop = document.getElementById('btn-reset-desktop');
    if (btnResetDesktop) {
        btnResetDesktop.onclick = null;
        delete btnResetDesktop.dataset.listening;
    }
    windowControlListenersAttached = false;
}
