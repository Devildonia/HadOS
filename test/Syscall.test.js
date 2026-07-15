import { describe, it, expect, beforeEach } from 'vitest';
import { WorkerProcess, messagePortTransport } from '../js/core/WorkerProcess.js';
import { AppRuntime, messagePortGuestTransport } from '../js/sdk/appRuntime.js';
import { attachSyscalls } from '../js/core/SyscallBroker.js';
import { PermissionBroker } from '../js/core/PermissionBroker.js';
import { VFS } from '../js/core/VFS.js';

/**
 * Full-duplex IPC + syscall broker + permission consent over a real MessagePort:
 * a guest issues syscalls that the host serves via the broker, gated by the
 * PermissionBroker (Fase 3) and confined to the process fsRoot.
 */
function connect({ appId = 'test', fsRoot = 'C:\\DOCUMENTS' } = {}) {
    const channel = new MessageChannel();
    const host = new WorkerProcess(messagePortTransport(channel.port1));
    const guest = new AppRuntime(messagePortGuestTransport(channel.port2));
    attachSyscalls(host, { appId, pid: 1, fsRoot });
    guest.start();
    return { host, guest };
}

describe('Syscalls + permission consent (Fase 2/3)', () => {
    beforeEach(async () => {
        localStorage.clear();
        VFS.__reset();
        await VFS.init();
        PermissionBroker.reset();
        PermissionBroker.setPrompt(async () => 'granted'); // auto-allow by default
    });

    it('sys.log needs no consent and returns true', async () => {
        let prompted = false;
        PermissionBroker.setPrompt(async () => { prompted = true; return 'granted'; });
        const { host, guest } = connect();
        await host.ready;
        expect(await guest.syscall('sys.log', { message: 'hi' })).toBe(true);
        expect(prompted).toBe(false); // free capability, no prompt
    });

    it('fs.write with granted consent writes to the VFS', async () => {
        const { host, guest } = connect();
        await host.ready;
        const ok = await guest.syscall('fs.write', { path: 'C:\\DOCUMENTS', name: 'from-proc.txt', content: 'proc data' });
        expect(ok).toBe(true);
        expect(VFS.readFile('C:\\DOCUMENTS\\from-proc.txt')).toBe('proc data');
    });

    it('prompts once per capability then remembers the decision', async () => {
        let prompts = 0;
        PermissionBroker.setPrompt(async () => { prompts++; return 'granted'; });
        const { host, guest } = connect();
        await host.ready;
        await guest.syscall('fs.write', { path: 'C:\\DOCUMENTS', name: 'a.txt', content: '1' });
        await guest.syscall('fs.write', { path: 'C:\\DOCUMENTS', name: 'b.txt', content: '2' });
        expect(prompts).toBe(1); // consent remembered across calls
    });

    it('denies fs.write when the user denies consent', async () => {
        PermissionBroker.setPrompt(async () => 'denied');
        const { host, guest } = connect();
        await host.ready;
        await expect(guest.syscall('fs.write', { path: 'C:\\DOCUMENTS', name: 'x', content: 'y' }))
            .rejects.toThrow('permission denied');
        expect(VFS.resolve('C:\\DOCUMENTS\\x')).toBeNull();
    });

    it('persists grants to the VFS across a broker reload', async () => {
        PermissionBroker.set('test', 'fs:write', 'granted');
        PermissionBroker.reset();          // drop in-memory grants
        PermissionBroker.init();           // reload from VFS
        expect(PermissionBroker.peek('test', 'fs:write')).toBe('granted');
    });

    it('confines fs.* to the process fsRoot even when granted', async () => {
        const { host, guest } = connect({ fsRoot: 'C:\\DOCUMENTS' });
        await host.ready;
        await expect(guest.syscall('fs.write', { path: 'C:\\WINDOWS\\SYSTEM', name: 'evil', content: 'x' }))
            .rejects.toThrow('fs access denied');
        expect(VFS.resolve('C:\\WINDOWS\\SYSTEM\\evil')).toBeNull();
    });

    it('supports both directions without id collision (host->guest and guest->host)', async () => {
        const { host, guest } = connect();
        guest.on('double', (n) => n * 2);
        await host.ready;
        const [h2g, g2h] = await Promise.all([
            host.request('double', 21),
            guest.syscall('sys.log', { message: 'x' }),
        ]);
        expect(h2g).toBe(42);
        expect(g2h).toBe(true);
    });
});
