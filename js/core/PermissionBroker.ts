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

/**
 * Type representing the user consent decision (granted or denied).
 */
export type Decision = 'granted' | 'denied';

/**
 * Type representing the asynchronous consent prompt function signature.
 */
export type ConsentPrompt = (appId: string, capability: string) => Promise<Decision>;

const GRANTS_DIR = 'C:\\HADOS\\SYSTEM';
const GRANTS_NAME = 'permissions.json';
const GRANTS_PATH = `${GRANTS_DIR}\\${GRANTS_NAME}`;

// Consent labels come from the capability registry — the single source of truth
// shared with AppPackage's manifest validation, so the two can never drift
// again (audit v1.0.8, M2).
import { CAP_LABELS } from './capabilities';

/**
 * Renders the default UI prompt popup modal requesting capability authorization from the user.
 * @param appId Unique app package identifier.
 * @param capability Target capability string (e.g. 'fs:read').
 */
function defaultPrompt(appId: string, capability: string): Promise<Decision> {
    return new Promise((resolve) => {
        // Escape both interpolations: appId comes from the process
        const label = Utils.escapeHTML(CAP_LABELS[capability] ?? capability);
        const safeAppId = Utils.escapeHTML(appId);
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100000;display:flex;align-items:center;justify-content:center;';
        overlay.innerHTML = `
            <div role="dialog" aria-modal="true" tabindex="-1" style="background:#c0c0c0;border:2px outset #fff;padding:16px;min-width:280px;font-family:'MS Sans Serif',sans-serif;font-size:12px;box-shadow:2px 2px 8px rgba(0,0,0,.4);">
                <p style="margin:0 0 12px;">🔐 <strong>${safeAppId}</strong> wants to <strong>${label}</strong>.</p>
                <div style="display:flex;gap:8px;justify-content:flex-end;">
                    <button class="hados-btn" data-consent="denied">Deny</button>
                    <button class="hados-btn" data-consent="granted">Allow</button>
                </div>
            </div>`;
        
        let resolved = false;
        let observer: MutationObserver | null = null;

        const finish = (d: Decision) => {
            if (resolved) return;
            resolved = true;
            if (observer) observer.disconnect();
            window.removeEventListener('keydown', onKeyDown);
            if (overlay.parentNode) overlay.remove();
            resolve(d);
        };

        if (typeof MutationObserver !== 'undefined') {
            observer = new MutationObserver(() => {
                if (!document.body.contains(overlay)) {
                    finish('denied');
                }
            });
            observer.observe(document.body, { childList: true });
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                finish('denied');
                return;
            }
            if (e.key !== 'Tab') return;

            // Focus trap. `aria-modal="true"` promises assistive tech that focus
            // stays inside the dialog; without this, Tab walked straight out into
            // the desktop behind it (audit v1.0.0-rc.1, M-09).
            const focusables = Array.from(
                overlay.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
            );
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (!first || !last) return;

            const active = document.activeElement as HTMLElement | null;
            const inside = !!active && overlay.contains(active);
            if (e.shiftKey && (!inside || active === first)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (!inside || active === last)) {
                e.preventDefault();
                first.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);

        overlay.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('[data-consent]') as HTMLElement | null;
            if (btn) {
                finish(btn.dataset.consent as Decision);
            } else if (e.target === overlay) {
                finish('denied');
            }
        });

        document.body.appendChild(overlay);
        const dialog = overlay.querySelector('[role="dialog"]') as HTMLElement | null;
        dialog?.focus();
    });
}

export const PermissionBroker = (() => {
    /** Stores all active capability grants mapping appId to capability to Decision. */
    let grants: Record<string, Record<string, Decision>> = {};
    /** Permissions ceiling configuration mapping app packages to declared capabilities list. */
    let declared: Record<string, string[]> = {};
    /** Active consent prompt dialog renderer hook. */
    let prompt: ConsentPrompt = defaultPrompt;
    /** In-flight permission consent requests mapping appId/capability combination to decision promises. */
    const pending = new Map<string, Promise<Decision>>();

    /**
     * Hydrates the persisted permission grants from the VFS registry.
     */
    function init(): void {
        const raw = VFS.readFile(GRANTS_PATH);
        if (raw) {
            try { grants = JSON.parse(raw) || {}; }
            catch { grants = {}; }
        }
    }

    /**
     * Configures a custom consent prompt dialog handler.
     * @param p Consent prompt callback hook.
     */
    function setPrompt(p: ConsentPrompt): void { prompt = p; }

    /**
     * Mediates capability checks. Prompts the user on first request and returns the decision.
     * @param appId Target app package identifier.
     * @param capability Requested capability key.
     * @returns Promise resolving to true if authorization is granted.
     */
    async function check(appId: string, capability: string): Promise<boolean> {
        // Manifest ceiling: never prompt for a capability the app didn't declare.
        const ceiling = declared[appId];
        if (ceiling && !ceiling.includes(capability)) {
            Utils.Logger.warn(`[PermissionBroker] ${appId} requested undeclared capability "${capability}"`);
            return false;
        }

        const existing = grants[appId]?.[capability];
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
                (grants[appId] ??= {})[capability] = decision;
                persist();
                Utils.Logger.log(`[PermissionBroker] ${appId} ${decision} "${capability}"`);
                return decision;
            })().finally(() => { pending.delete(key); });
            pending.set(key, inflight);
        }
        return (await inflight) === 'granted';
    }

    /**
     * Reads a recorded decision synchronously without prompting the user.
     * @param appId App package identifier.
     * @param capability Target capability key.
     */
    function peek(appId: string, capability: string): Decision | undefined {
        return grants[appId]?.[capability];
    }

    /**
     * Persists the active permission grants dictionary to the VFS.
     */
    function persist(): void {
        VFS.mkdir('C:\\HADOS', 'SYSTEM'); // idempotent; ensures the dir exists
        VFS.writeFile(GRANTS_DIR, GRANTS_NAME, JSON.stringify(grants));
        void VFS.flush();
    }

    /**
     * Manually overrides a stored permission decision for a capability.
     * @param appId Target app package.
     * @param capability Capability key.
     * @param decision Intended decision state.
     */
    function set(appId: string, capability: string, decision: Decision): void {
        (grants[appId] ?? (grants[appId] = {}))[capability] = decision;
        persist();
    }

    /**
     * Configures the manifest capability ceiling list for an app package.
     * @param appId App package identifier.
     * @param permissions Allowed list of capability strings.
     */
    function setDeclared(appId: string, permissions: string[]): void {
        declared[appId] = [...permissions];
    }

    /**
     * Removes the manifest capability ceiling configuration for an app package.
     * @param appId App package identifier.
     */
    function clearDeclared(appId: string): void {
        delete declared[appId];
    }

    /**
     * Revokes all granted permissions stored under a given app package.
     * @param appId Target app package identifier.
     */
    function revokeApp(appId: string): void {
        delete grants[appId];
        persist();
    }

    /**
     * Resets the broker registry state (primarily for test environments).
     */
    function reset(): void {
        grants = {};
        declared = {};
        pending.clear();
        prompt = defaultPrompt;
    }

    return { init, check, peek, set, setPrompt, setDeclared, clearDeclared, revokeApp, persist, reset };
})();
