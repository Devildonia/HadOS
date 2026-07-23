/**
 * CAPABILITY REGISTRY (audit v1.0.8, M2)
 * The vocabulary drifted twice between the broker and the manifest allowlist
 * (v1.0.4: ai:infer missing; v1.0.8: five capabilities missing). These tests pin
 * the structure that makes a third drift impossible: both consumers DERIVE from
 * one registry, and every capability the OS grants is known to it.
 */
import { describe, it, expect } from 'vitest';
import { CAPABILITIES, CAP_LABELS, PACKAGEABLE_CAPABILITIES, ALL_CAPABILITIES, isKnownCapability, isPackageableCapability } from '../js/core/capabilities';
import { KNOWN_PERMISSIONS, validateManifest } from '../js/core/AppPackage';

describe('capability registry', () => {
    it('every capability has a non-empty consent label', () => {
        for (const id of ALL_CAPABILITIES) {
            expect(CAP_LABELS[id], id).toBeTruthy();
            expect(CAP_LABELS[id]!.length).toBeGreaterThan(5);
        }
    });

    it('the manifest allowlist IS the packageable subset of the registry', () => {
        expect(KNOWN_PERMISSIONS).toEqual(PACKAGEABLE_CAPABILITIES);
        for (const id of KNOWN_PERMISSIONS) expect(isKnownCapability(id), id).toBe(true);
    });

    it('the five host-only capabilities are known but not packageable', () => {
        for (const id of ['ai:chat', 'ai:transcribe', 'ai:embed', 'mic:record', 'speech:cloud']) {
            expect(isKnownCapability(id), id).toBe(true);
            expect(isPackageableCapability(id), id).toBe(false);
        }
        expect(isPackageableCapability('ai:infer')).toBe(true); // the syscall-reachable one
    });

    it('legacy manifest vocabulary is still accepted (no packaged app breaks)', () => {
        for (const id of ['fs:read', 'fs:write', 'notify', 'net', 'ai:infer']) {
            expect(KNOWN_PERMISSIONS.includes(id), id).toBe(true);
        }
    });

    it('manifests get truthful errors: host-only vs genuinely unknown', () => {
        const base = { id: 'demo-app', name: 'Demo', version: '1.0.0', entry: 'index.html' };
        const hostOnly = validateManifest({ ...base, permissions: ['ai:chat'] });
        expect(hostOnly.ok).toBe(false);
        if (!hostOnly.ok) expect(hostOnly.error).toContain('not available to packaged apps');

        const unknown = validateManifest({ ...base, permissions: ['time:travel'] });
        expect(unknown.ok).toBe(false);
        if (!unknown.ok) expect(unknown.error).toContain('unknown permission');
    });

    it('the registry entries carry both fields', () => {
        for (const [id, cap] of Object.entries(CAPABILITIES)) {
            expect(typeof cap.label, id).toBe('string');
            expect(typeof cap.packageable, id).toBe('boolean');
        }
    });
});
