/**
 * SESSION MANAGER (Fase 5)
 * Persists the desktop session — which apps are open and their window layout —
 * and restores it on reload ("resume session").
 *
 * Only `kind: 'app'` processes (the in-realm windowed apps) are recorded: worker
 * and iframe processes are children spawned by their owning app, so relaunching
 * the app respawns them. Windows are re-created by launching the app (window ids
 * are generated, so the layout is re-applied to the freshly created window).
 */

import { VFS } from './VFS';
import { Utils } from '../utils';
import { Kernel } from './Kernel';
import { Services } from './ServiceContainer';

const SESSION_DIR = 'C:\\WINDOWS\\SYSTEM';
const SESSION_NAME = 'session.json';
const SESSION_PATH = `${SESSION_DIR}\\${SESSION_NAME}`;
const SESSION_VERSION = 1;

export interface WindowGeometry { left: number; top: number; width: number; height: number; }
export interface SessionEntry { appId: string; geometry: WindowGeometry; minimized: boolean; }
export interface SessionState { version: number; savedAt: string; windows: SessionEntry[]; }

/** Reads a window's layout, preferring inline styles and falling back to its rect. */
function readGeometry(el: HTMLElement): WindowGeometry {
    const rect = el.getBoundingClientRect();
    const num = (inline: string, fallback: number) => (inline ? parseInt(inline, 10) || 0 : Math.round(fallback));
    return {
        left: num(el.style.left, rect.left),
        top: num(el.style.top, rect.top),
        width: num(el.style.width, rect.width),
        height: num(el.style.height, rect.height),
    };
}

function applyGeometry(el: HTMLElement, g: WindowGeometry): void {
    el.style.transform = 'none'; // drop the centering transform so left/top are absolute
    el.style.left = `${g.left}px`;
    el.style.top = `${g.top}px`;
    if (g.width) el.style.width = `${g.width}px`;
    if (g.height) el.style.height = `${g.height}px`;
}

export const SessionManager = (() => {
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    let restoring = false;
    let wired = false;

    /** Snapshots the open windowed apps and their layout. */
    function capture(): SessionState {
        const windows: SessionEntry[] = [];
        for (const proc of Kernel.getRegistry().processes) {
            if (proc.status !== 'running') continue;
            if (proc.kind && proc.kind !== 'app') continue;   // skip worker/iframe children
            if (!proc.windowId) continue;
            const el = document.getElementById(proc.windowId);
            if (!el) continue;
            windows.push({
                appId: proc.appId,
                geometry: readGeometry(el),
                minimized: getComputedStyle(el).display === 'none',
            });
        }
        return { version: SESSION_VERSION, savedAt: new Date().toISOString(), windows };
    }

    function saveNow(): void {
        if (restoring) return; // never clobber the session while replaying it
        const state = capture();
        VFS.mkdir('C:\\WINDOWS', 'SYSTEM');
        VFS.writeFile(SESSION_DIR, SESSION_NAME, JSON.stringify(state));
        void VFS.flush();
    }

    /** Debounced save (window churn during drags/launches shouldn't thrash the VFS). */
    function save(): void {
        if (restoring) return;
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => { saveTimer = null; saveNow(); }, 500);
    }

    function read(): SessionState | null {
        const raw = VFS.readFile(SESSION_PATH);
        if (!raw) return null;
        try {
            const s = JSON.parse(raw) as SessionState;
            if (!s || s.version !== SESSION_VERSION || !Array.isArray(s.windows)) return null;
            return s;
        } catch { return null; }
    }

    /** Relaunches the saved apps and re-applies their layout. Returns how many restored. */
    async function restore(): Promise<number> {
        const state = read();
        if (!state || state.windows.length === 0) return 0;

        restoring = true;
        let restored = 0;
        try {
            for (const entry of state.windows) {
                try {
                    const proc = Kernel.launch(entry.appId);
                    if (!proc?.windowId) continue;
                    // Apps may build their window asynchronously; yield a tick.
                    await new Promise<void>(r => setTimeout(r, 0));
                    const el = document.getElementById(proc.windowId);
                    if (!el) continue;
                    applyGeometry(el, entry.geometry);
                    if (entry.minimized) {
                        const wm = Services.get('WindowManager');
                        wm?.minimize(proc.windowId);
                    }
                    restored++;
                } catch (err) {
                    Utils.Logger.warn(`[SessionManager] could not restore ${entry.appId}: ${err instanceof Error ? err.message : err}`);
                }
            }
        } finally {
            restoring = false;
        }
        Utils.Logger.log(`[SessionManager] restored ${restored}/${state.windows.length} windows`);
        return restored;
    }

    function clear(): void {
        VFS.deleteNode(SESSION_DIR, SESSION_NAME);
        void VFS.flush();
    }

    /** Wires the triggers that keep the session up to date. */
    function init(): void {
        if (wired) return;
        wired = true;
        window.addEventListener('kernel:process-started', save);
        window.addEventListener('kernel:process-stopped', save);
        // Layout changes (drag/resize) end with a mouseup; visibility/unload are the
        // durability triggers (beforeunload can't await an async write).
        document.addEventListener('mouseup', save);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') saveNow();
        });
        window.addEventListener('beforeunload', saveNow);
    }

    function __reset(): void {
        if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
        restoring = false;
        wired = false;
    }

    return { capture, save, saveNow, restore, read, clear, init, __reset };
})();
