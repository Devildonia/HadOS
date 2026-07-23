/**
 * CAPABILITY REGISTRY — the single source of truth (audit v1.0.8, M2)
 *
 * The capability vocabulary used to live duplicated: consent labels in
 * `PermissionBroker`, the manifest allowlist in `AppPackage.KNOWN_PERMISSIONS`,
 * and the syscall→capability mapping in `SyscallBroker`. The two lists drifted
 * once at v1.0.4 (`ai:infer` missing from the manifest allowlist), were fixed,
 * and drifted AGAIN by v1.0.8 with the five AI/mic capabilities — the audit's
 * point was that a bug fixed twice needs a structure, not a third fix.
 *
 * This module is that structure: every capability is declared exactly once,
 * with its consent label and whether packaged (.wapp) apps may declare it.
 * `PermissionBroker` and `AppPackage` DERIVE from this registry — neither owns
 * a list any more, so they cannot disagree.
 */

export interface ICapability {
    /** The consent-dialog sentence: "<app> wants to <label>". */
    label: string;
    /**
     * Whether a packaged app's manifest may declare this capability. Host-only
     * capabilities exist for first-party apps and are NOT reachable through the
     * syscall surface — listing one in a manifest is an authoring error and
     * validation says so explicitly instead of "unknown permission".
     */
    packageable: boolean;
}

export const CAPABILITIES: Record<string, ICapability> = {
    'fs:read': { label: 'read your files', packageable: true },
    'fs:write': { label: 'save files', packageable: true },
    'notify': { label: 'show notifications', packageable: true },
    'net': { label: 'access the network', packageable: true },
    // Worth its own consent rather than folding into `net`: the first use downloads
    // megabytes of model over the user's connection and then runs it against
    // whatever the app hands it — the picture on their canvas, say.
    'ai:infer': { label: 'run AI on your device', packageable: true },
    // The browser's SpeechRecognition API: in Chrome the microphone audio is
    // processed on Google's servers, not on this machine. That is the opposite of
    // the on-device promise, so it gets its own explicit, remembered consent — and
    // the wording says where the audio goes.
    'speech:cloud': { label: "use your browser's speech recognition (audio may be sent to the browser vendor's servers)", packageable: false },
    'ai:chat': { label: 'generate chat replies with the imported AI model, entirely on your device (nothing is sent anywhere)', packageable: false },
    'ai:transcribe': { label: 'download a speech-to-text model (~140 MB, once) and transcribe audio entirely on your device', packageable: false },
    'ai:embed': { label: 'download a text-embedding model (~25 MB, once) to index and search your documents semantically, on your device', packageable: false },
    'mic:record': { label: 'record audio from your microphone for on-device processing (nothing is sent anywhere)', packageable: false },
};

/** Consent labels, keyed by capability — what PermissionBroker renders. */
export const CAP_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(CAPABILITIES).map(([id, c]) => [id, c.label]),
);

/** Capabilities a .wapp manifest may declare — what AppPackage validates against. */
export const PACKAGEABLE_CAPABILITIES: readonly string[] = Object.freeze(
    Object.entries(CAPABILITIES).filter(([, c]) => c.packageable).map(([id]) => id),
);

/** Every capability id the OS knows, packageable or not. */
export const ALL_CAPABILITIES: readonly string[] = Object.freeze(Object.keys(CAPABILITIES));

export function isKnownCapability(id: string): boolean {
    return id in CAPABILITIES;
}

export function isPackageableCapability(id: string): boolean {
    return CAPABILITIES[id]?.packageable === true;
}
