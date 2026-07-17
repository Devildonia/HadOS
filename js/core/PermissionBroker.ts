/**
 * PERMISSION BROKER (host side, Fase 3)
 * Mediates isolated processes' capabilities with user consent. On a process's
 * first use of a capability (e.g. `fs:write`, `notify`) the broker asks the user
 * to allow or deny; the decision is remembered per (app, capability) and
 * persisted in the VFS, so later calls resolve without prompting. Replaces the
 * SyscallBroker's static capability set.
 *
 * The consent prompt is injectable (`setPrompt`) so it can be a real dialog in
 * the app and an auto-decider in tests.
 */

import { VFS } from './VFS';
import { Utils } from '../utils';

export type Decision = 'granted' | 'denied';
export type ConsentPrompt = (appId: string, capability: string) => Promise<Decision>;

const GRANTS_DIR = 'C:\\HADOS\\SYSTEM';
const GRANTS_NAME = 'permissions.json';
const GRANTS_PATH = `${GRANTS_DIR}\\${GRANTS_NAME}`;

/** Human-readable descriptions shown in the consent dialog. */
const CAP_LABELS: Record<string, string> = {
    'fs:read': 'read your files',
    'fs:write': 'save files',
    'notify': 'show notifications',
    'net': 'access the network',
    // Worth its own consent rather than folding into `net`: the first use downloads
    // megabytes of model over the user's connection and then runs it against
    // whatever the app hands it — the picture on their canvas, say.
    'ai:infer': 'run AI on your device',
};

/** Default consent UI: a small modal with Allow / Deny. */
function defaultPrompt(appId: string, capability: string): Promise<Decision> {
    return new Promise((resolve) => {
        // Escape both interpolations: appId comes from the process (only package
        // ids are pattern-validated; internal spawns are free-form).
        const label = Utils.escapeHTML(CAP_LABELS[capability] ?? capability);
        const safeAppId = Utils.escapeHTML(appId);
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;';
        overlay.innerHTML = `
            <div role="dialog" aria-modal="true" style="background:#c0c0c0;border:2px outset #fff;padding:16px;min-width:280px;font-family:'MS Sans Serif',sans-serif;font-size:12px;box-shadow:2px 2px 8px rgba(0,0,0,.4);">
                <p style="margin:0 0 12px;">🔐 <strong>${safeAppId}</strong> wants to <strong>${label}</strong>.</p>
                <div style="display:flex;gap:8px;justify-content:flex-end;">
                    <button class="hados-btn" data-consent="denied">Deny</button>
                    <button class="hados-btn" data-consent="granted">Allow</button>
                </div>
            </div>`;
        const finish = (d: Decision) => { overlay.remove(); resolve(d); };
        overlay.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('[data-consent]') as HTMLElement | null;
            if (btn) finish(btn.dataset.consent as Decision);
        });
        document.body.appendChild(overlay);
    });
}

export const PermissionBroker = (() => {
    let grants: Record<string, Record<string, Decision>> = {};
    /**
     * Permission ceiling declared by an installed app's manifest (Fase 4). If an
     * app declared its capabilities, anything outside that list is refused
     * outright — without bothering the user. Apps with no manifest (built-in
     * demo processes) have no ceiling and fall through to consent.
     */
    let declared: Record<string, string[]> = {};
    let prompt: ConsentPrompt = defaultPrompt;
    /**
     * In-flight consent requests (see check()). The key joins appId and
     * capability with a NUL escape rather than a space, so an appId that
     * contains the separator cannot collide with another (appId, capability)
     * pair. Written as an escape to keep this source plain ASCII — it used to
     * embed a raw control character, which made tooling treat the file as binary.
     */
    const pending = new Map<string, Promise<Decision>>();

    /** Loads persisted grants from the VFS (call once at boot). */
    function init(): void {
        const raw = VFS.readFile(GRANTS_PATH);
        if (raw) {
            try { grants = JSON.parse(raw) || {}; }
            catch { grants = {}; }
        }
    }

    /** Overrides the consent UI (used by tests). */
    function setPrompt(p: ConsentPrompt): void { prompt = p; }

    /**
     * Resolves whether `appId` may use `capability`, prompting for consent on
     * first use and remembering the decision.
     */
    async function check(appId: string, capability: string): Promise<boolean> {
        // Manifest ceiling: never prompt for a capability the app didn't declare.
        const ceiling = declared[appId];
        if (ceiling && !ceiling.includes(capability)) {
            Utils.Logger.warn(`[PermissionBroker] ${appId} requested undeclared capability "${capability}"`);
            return false;
        }

        const appGrants = grants[appId] ?? (grants[appId] = {});
        const existing = appGrants[capability];
        if (existing) return existing === 'granted';

        // Share one prompt across concurrent requests: a process firing several
        // syscalls of the same capability before the user answers would otherwise
        // each see no decision yet and stack a modal per call.
        const key = `${appId}\u0000${capability}`;
        let inflight = pending.get(key);
        if (!inflight) {
            inflight = (async () => {
                let decision: Decision;
                try {
                    decision = await prompt(appId, capability);
                } catch {
                    decision = 'denied';
                }
                appGrants[capability] = decision;
                persist();
                Utils.Logger.log(`[PermissionBroker] ${appId} ${decision} "${capability}"`);
                return decision;
            })().finally(() => { pending.delete(key); });
            pending.set(key, inflight);
        }
        return (await inflight) === 'granted';
    }

    /** Returns a stored decision without prompting (or undefined if none). */
    function peek(appId: string, capability: string): Decision | undefined {
        return grants[appId]?.[capability];
    }

    function persist(): void {
        VFS.mkdir('C:\\HADOS', 'SYSTEM'); // idempotent; ensures the dir exists
        VFS.writeFile(GRANTS_DIR, GRANTS_NAME, JSON.stringify(grants));
        void VFS.flush();
    }

    /** Grants/denies programmatically (settings UI, tests). */
    function set(appId: string, capability: string, decision: Decision): void {
        (grants[appId] ?? (grants[appId] = {}))[capability] = decision;
        persist();
    }

    /** Records an installed app's declared permission ceiling (from its manifest). */
    function setDeclared(appId: string, permissions: string[]): void {
        declared[appId] = [...permissions];
    }

    function clearDeclared(appId: string): void {
        delete declared[appId];
    }

    /** Drops every stored decision for an app (called on uninstall). */
    function revokeApp(appId: string): void {
        delete grants[appId];
        persist();
    }

    function reset(): void {
        grants = {};
        declared = {};
        pending.clear();
        prompt = defaultPrompt;
    }

    return { init, check, peek, set, setPrompt, setDeclared, clearDeclared, revokeApp, persist, reset };
})();
