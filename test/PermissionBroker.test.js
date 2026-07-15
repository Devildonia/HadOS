import { describe, it, expect, beforeEach } from 'vitest';
import { PermissionBroker } from '../js/core/PermissionBroker.js';
import { VFS } from '../js/core/VFS.js';

describe('PermissionBroker (Fase 3)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PermissionBroker.reset();
    });

    it('prompts on first use and returns the decision', async () => {
        PermissionBroker.setPrompt(async () => 'granted');
        expect(await PermissionBroker.check('appA', 'fs:write')).toBe(true);
        PermissionBroker.reset();
        PermissionBroker.setPrompt(async () => 'denied');
        expect(await PermissionBroker.check('appB', 'fs:write')).toBe(false);
    });

    it('remembers the decision (prompts only once per app+capability)', async () => {
        let calls = 0;
        PermissionBroker.setPrompt(async () => { calls++; return 'granted'; });
        await PermissionBroker.check('appA', 'notify');
        await PermissionBroker.check('appA', 'notify');
        expect(calls).toBe(1);
        expect(PermissionBroker.peek('appA', 'notify')).toBe('granted');
    });

    it('scopes grants per app', async () => {
        PermissionBroker.set('appA', 'fs:write', 'granted');
        expect(PermissionBroker.peek('appA', 'fs:write')).toBe('granted');
        expect(PermissionBroker.peek('appB', 'fs:write')).toBeUndefined();
    });

    it('persists grants to the VFS and reloads them', async () => {
        PermissionBroker.set('appA', 'fs:write', 'granted');
        PermissionBroker.set('appA', 'notify', 'denied');
        // A fresh broker state that reloads from the VFS sees the same grants.
        PermissionBroker.reset();
        PermissionBroker.init();
        expect(PermissionBroker.peek('appA', 'fs:write')).toBe('granted');
        expect(PermissionBroker.peek('appA', 'notify')).toBe('denied');
        // And the store lives in the VFS.
        expect(VFS.readFile('C:\\WINDOWS\\SYSTEM\\permissions.json')).toContain('fs:write');
    });

    it('treats a denied prompt (or throw) as denied', async () => {
        PermissionBroker.setPrompt(async () => { throw new Error('dismissed'); });
        expect(await PermissionBroker.check('appA', 'net')).toBe(false);
        expect(PermissionBroker.peek('appA', 'net')).toBe('denied');
    });
});
