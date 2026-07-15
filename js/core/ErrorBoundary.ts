/**
 * WINDOWS 95 APP CENTER - ERROR BOUNDARY
 * Global unhandled error handler — shows a retro Win95 BSOD.
 *
 * Sprint 2: Added to cover JS errors and unhandled promise rejections
 * that occur after the boot sequence (not caught by bootStep()).
 *
 * Captured errors:
 *   - window.onerror       → uncaught synchronous JS exceptions
 *   - unhandledrejection   → unhandled Promise rejections
 *
 * Usage: import and call initErrorBoundary() once, before initOS().
 */

import { CONFIG } from '../config.js';
import { Services } from './ServiceContainer.js';
import { Utils } from '../utils.js';
import { VFS } from './VFS.js';

// ─── Internals ───────────────────────────────────────────────────────────────

let _activated = false;          // Prevent double-show
let _errorCount = 0;             // Count errors in session (debug info)

/**
 * Generates the BSOD HTML in the authentic Windows 95 style.
 * Content goes into #bsod-content (already in the DOM via index.html).
 *
 * @param {string} message   - Short error description
 * @param {string} source    - Filename or origin
 * @param {number|string} line - Line number
 * @param {string} stack     - Full stack trace (optional)
 */
function _buildBSODContent(message: string, source: string, line: number | string, stack: string): string {
    const version = CONFIG?.APP?.VERSION ?? '?.?.?';
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });

    // Sanitize values to avoid XSS in error messages
    const safe = (s: any) => String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const stackLines = stack
        ? safe(stack).split('\n').slice(0, 8).map(l => `    ${l}`).join('\n')
        : '    (no stack trace available)';

    return `
        <h1>Windows App Center</h1>

        <p>A fatal exception <strong>0E</strong> has occurred at <strong>${safe(source)}:${safe(line)}</strong>.</p>
        <p>The current application will be terminated.</p>

        <div class="bsod-section">
            <p><strong>Error:</strong> ${safe(message)}</p>
            <p><strong>Version:</strong> v${safe(version)}</p>
            <p><strong>Time:</strong> ${safe(ts)}</p>
            <p><strong>Errors this session:</strong> ${_errorCount}</p>
        </div>

        <div class="bsod-section">
            <p><strong>Stack trace:</strong></p>
            <pre style="font-size:11px; white-space:pre-wrap; margin:8px 0 0 0; color:#aaaaff;">${stackLines}</pre>
        </div>

        <div class="bsod-footer">
            <p>Press any key to restart, or wait 10 seconds for automatic reload.</p>
            <p style="font-size:10px; opacity:0.6; margin-top:8px;">Crash details saved to C:\\WINDOWS\\SYSTEM\\crash.log</p>
        </div>
    `;
}

/**
 * Shows the BSOD screen with the provided error details.
 * Idempotent: only the first error triggers it (subsequent errors just log).
 */
function showBSOD(message: string = 'Unknown error', source: string = '', line: number | string = '', stack: string = ''): void {
    _errorCount++;

    // Only show once — avoid recursive BSOD loops
    if (_activated) {
        console.error(`[ErrorBoundary] Additional error #${_errorCount} suppressed (BSOD already active):`, message);
        return;
    }
    _activated = true;

    console.error(`[ErrorBoundary] BSOD triggered: ${message} @ ${source}:${line}`);

    const screen = document.getElementById('bsod-screen');
    const content = document.getElementById('bsod-content');

    if (!screen || !content) {
        // DOM not ready — fallback to alert
        console.error('[ErrorBoundary] BSOD DOM elements not found. Falling back to alert.');
        alert(`FATAL ERROR:\n\n${message}\n\n${source}:${line}`);
        return;
    }

    content.innerHTML = _buildBSODContent(message, source, line, stack);
    screen.style.display = 'flex';
    Utils.announce('System error occurred');

    // Write crash details to simulated log best-effort
    try {
        const crashLogPath = 'C:\\WINDOWS\\SYSTEM\\crash.log';
        const timestamp = new Date().toISOString();
        const divider = '----------------------------------------';
        const newEntry = `[${timestamp}] ${message}\nSource: ${source}:${line}\nStack: ${stack || 'N/A'}\n${divider}\n`;
        
        let currentLog = VFS.readFile(crashLogPath) || '';
        let fullLog = currentLog + newEntry;

        // Truncate if exceeds 50KB (51,200 bytes)
        const maxSizeBytes = 50 * 1024;
        if (fullLog.length > maxSizeBytes) {
            let truncated = fullLog.substring(fullLog.length - maxSizeBytes);
            const nextDivider = truncated.indexOf(divider);
            // Ensure we don't truncate the entire new entry if the divider is near the end
            if (nextDivider !== -1 && nextDivider < truncated.length - 200) {
                truncated = truncated.substring(nextDivider + divider.length + 1);
            }
            fullLog = truncated;
        }
        
        VFS.writeFile('C:\\WINDOWS\\SYSTEM', 'crash.log', fullLog);
    } catch (e) {
        console.error('[ErrorBoundary] Failed to write crash log to VFS:', e);
    }

    // Stop the shader / audio to free resources
    try {
        const sw: any = Services.get('ShaderWallpaper');
        if (sw?.pause) sw.pause();
    } catch (_) { /* non-critical */ }

    // Auto-reload after 10 seconds
    const reloadTimer = setTimeout(() => location.reload(), 10_000);

    // Any keypress reloads immediately
    document.addEventListener('keydown', () => {
        clearTimeout(reloadTimer);
        location.reload();
    }, { once: true });
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Installs global error handlers.
 * Call once at app startup, before initOS().
 */
export function initErrorBoundary(): void {
    // Synchronous JS exceptions
    window.addEventListener('error', (event: ErrorEvent) => {
        showBSOD(
            event.message,
            event.filename,
            event.lineno,
            event.error?.stack || ''
        );
        // Don't suppress — let browser devtools still show the error
    });

    // Unhandled Promise rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        const message = reason instanceof Error
            ? reason.message
            : String(reason ?? 'Unhandled Promise rejection');
        showBSOD(
            message,
            'Promise',
            '',
            reason instanceof Error && reason.stack ? reason.stack : ''
        );
    });

    Utils.Logger.log('[ErrorBoundary] Global error boundary active.');
}

// Expose showBSOD for manual triggering (e.g. from bootStep failures)
export { showBSOD };

export function __resetErrorBoundaryState(): void {
    _activated = false;
    _errorCount = 0;
}
