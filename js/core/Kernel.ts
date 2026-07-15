/**
 * WINDOWS 95 APP CENTER - KERNEL
 * Central management for processes, apps, and system events
 * Version: 3.2 (ES Modules)
 *
 * Sprint 2: processes migrated from Array to Map<pid, process>.
 * Terminated processes are removed immediately — no memory accumulation.
 */

import { Utils } from '../utils';
import { VFS } from './VFS';
import { Services } from './ServiceContainer';
import type { IWindowsApp, IAppMetadata, IWindowsAppConstructor, IProcess, IAppPlugin } from './Types';
import { WindowFactory } from '../ui/WindowFactory';
import { PluginManager } from './PluginManager';
import { PluginBridge } from './PluginBridge.js';
import { WorkerProcess, type IProcessTransport } from './WorkerProcess';
import { ProcessWatchdog } from './ProcessWatchdog';
import { createIframeTransport, type IframeSpawnOptions } from './IframeProcess';
import { attachSyscalls } from './SyscallBroker';
import { PermissionBroker } from './PermissionBroker';
import { PackageManager } from './PackageManager';

export interface IAppRegistryEntry {
    appClass: IWindowsAppConstructor;
    metadata: IAppMetadata;
}

export interface IKernelRegistry {
    apps: Record<string, IAppRegistryEntry>;
    processes: Map<number, IProcess>;
}

export interface IKernel {
    init(): void;
    registerApp(id: string, appClass: IWindowsAppConstructor, metadata: IAppMetadata): void;
    unregisterApp(id: string): boolean;
    installPlugin(plugin: IAppPlugin): void;
    uninstallPlugin(id: string): boolean;
    launch(appId: string, params?: Record<string, unknown>): IProcess | null;
    spawnWorker(appId: string, transport: IProcessTransport, opts?: { windowId?: string | null; fsRoot?: string }): { pid: number; worker: WorkerProcess; process: IProcess };
    spawnIframe(appId: string, opts?: IframeSpawnOptions & { windowId?: string | null; fsRoot?: string }): Promise<{ pid: number; worker: WorkerProcess; process: IProcess; iframe: HTMLIFrameElement }>;
    getWorker(pid: number): WorkerProcess | undefined;
    kill(pid: number): boolean;
    getRegistry(): { apps: Record<string, IAppRegistryEntry>, processes: IProcess[] };
    getProcess(pid: number): IProcess | undefined;
    getActiveCount(): number;
    __reset(): void;
}

export const Kernel: IKernel = (() => {
    'use strict';

    const registry: IKernelRegistry = {
        apps: {},
        processes: new Map<number, IProcess>() // Map<pid, process> — replaces array, auto-cleans on kill
    };

    let _nextPid = 0;          // Monotonically increasing PID counter

    // Records the actual iframe id trusted by the PluginBridge for each plugin,
    // so uninstall revokes the exact frame even when a plugin supplied its own
    // iframeId (install and uninstall must resolve the id the same way).
    const pluginFrameIds = new Map<string, string>();

    // Isolated (Web Worker) processes: pid -> host-side handle. Kept separate from
    // the IProcess table so IProcess stays a plain data record.
    const workers = new Map<number, WorkerProcess>();
    const watchdog = new ProcessWatchdog({
        getTargets: () => Array.from(workers.entries()).map(([pid, proc]) => ({ pid, proc })),
        onKill: (pid) => { Utils.Logger.warn(`Kernel: watchdog killing unresponsive PID ${pid}`); kill(pid); },
    });

    /**
     * Registers a new application class to the system
     */
    function registerApp(id: string, appClass: IWindowsAppConstructor, metadata: IAppMetadata): void {
        registry.apps[id] = { appClass, metadata };
        Utils.Logger.log(`Kernel: App registered [${id}]`);
    }

    function unregisterApp(id: string): boolean {
        if (registry.apps[id]) {
            delete registry.apps[id];
            Utils.Logger.log(`Kernel: App unregistered [${id}]`);
            return true;
        }
        return false;
    }

    function installPlugin(plugin: IAppPlugin): void {
        const validation = PluginManager.validatePlugin(plugin);
        if (!validation.ok) {
            Utils.Logger.error(`Kernel: Plugin validation failed for [${plugin?.id}]: ${validation.error}`);
            return;
        }

        registerApp(plugin.id, plugin.component, { ...plugin.metadata, isPlugin: true });
        if (plugin.windowDef) {
            if (plugin.windowDef.src) {
                const sandboxedDef = {
                    ...plugin.windowDef,
                    sandbox: 'allow-scripts allow-forms'
                };
                WindowFactory.createGameWindow(sandboxedDef);
                // Allow-list this plugin's iframe so its messages are trusted by
                // the PluginBridge (untrusted frames like the IE browser are not).
                const iframeId = sandboxedDef.iframeId || `${sandboxedDef.id}-frame`;
                pluginFrameIds.set(plugin.id, iframeId);
                const frame = document.getElementById(iframeId) as HTMLIFrameElement | null;
                PluginBridge.registerPluginFrame(frame);
            } else {
                WindowFactory.create(plugin.windowDef);
            }
        }
        Utils.Logger.log(`Kernel: Plugin installed [${plugin.id}]`);
    }

    function uninstallPlugin(id: string): boolean {
        // Kill active processes of that appId
        const procs = getRegistry().processes.filter(p => p.appId === id);
        procs.forEach(p => kill(p.pid));

        // Revoke bridge trust for this plugin's iframe, resolving the id the same
        // way install did (a plugin may have supplied its own iframeId).
        const iframeId = pluginFrameIds.get(id) || `${id}-frame`;
        const frame = document.getElementById(iframeId) as HTMLIFrameElement | null;
        PluginBridge.unregisterPluginFrame(frame);
        pluginFrameIds.delete(id);

        const success = unregisterApp(id);
        if (success) {
            window.dispatchEvent(new CustomEvent('kernel:plugin-uninstalled', { detail: { id } }));
            Utils.Logger.log(`Kernel: Plugin uninstalled [${id}]`);
            return true;
        }
        return false;
    }

    function launch(appId: string, params: Record<string, unknown> = {}): IProcess | null {
        const appInfo = registry.apps[appId];
        if (!appInfo) {
            Utils.Logger.error(`Kernel: App not found [${appId}]`);
            return null;
        }

        Utils.Logger.log(`Kernel: Launching ${appId}...`);
        
        // Prevent launching duplicate instances of singleton apps
        if (appInfo.metadata?.singleton === true) {
            const existingProcess = Array.from(registry.processes.values()).find(
                p => p.appId === appId && p.status === 'running'
            );

            if (existingProcess) {
                Utils.Logger.log(`Kernel: App ${appId} is already running (singleton). Focusing window ${existingProcess.windowId}`);
                if (existingProcess.windowId) {
                    const wm: any = Services.get('WindowManager');
                    if (wm) {
                        wm.open(existingProcess.windowId);
                        const win = Utils.getElement(existingProcess.windowId) as HTMLElement | null;
                        if (win) wm.bringToFront(win);
                    }
                }
                return existingProcess;
            }
        }

        try {
            const instance = new appInfo.appClass(params);
            const pid = _nextPid++;

            const process: IProcess = {
                pid,
                appId,
                instance,
                windowId: instance.windowId || null,
                status: 'running'
            };

            registry.processes.set(pid, process);

            // Auto-open window (Fixed: ensuring foreground launch)
            if (process.windowId) {
                const wm: any = Services.get('WindowManager');
                if (wm) wm.open(process.windowId);
            }

            // Dispatch event for Taskbar
            window.dispatchEvent(new CustomEvent('kernel:process-started', { detail: process }));

            Utils.Logger.log(`Kernel: PID ${pid} started (${registry.processes.size} active processes)`);
            return process;
        } catch (e) {
            Utils.Logger.error(`Kernel: Failed to launch ${appId}`, e);
            return null;
        }
    }

    /**
     * Terminates a process and removes it from the process table.
     * No memory accumulation: killed processes are fully deleted.
     */
    function kill(pid: number): boolean {
        const process = registry.processes.get(pid);
        if (!process) return false;

        process.status = 'terminated';
        if (process.instance && typeof process.instance.terminate === 'function') {
            process.instance.terminate();
        }

        window.dispatchEvent(new CustomEvent('kernel:process-stopped', { detail: process }));

        const resManager = Services.get('ResourceManager');
        if (resManager) {
            if (process.windowId) {
                resManager.disposeOwner(process.windowId);
            }
            resManager.disposeOwner(process.appId);
        }

        // Tear down the isolated worker handle, if this was a worker process.
        workers.delete(pid);
        if (workers.size === 0) watchdog.stop();

        // Remove from Map — no lingering references
        registry.processes.delete(pid);
        Utils.Logger.log(`Kernel: PID ${pid} killed (${registry.processes.size} active processes)`);
        return true;
    }

    /**
     * Registers an isolated process over any transport (Worker or iframe port).
     * Shared by spawnWorker/spawnIframe. `onTerminate` runs extra teardown (e.g.
     * removing an iframe element) when the process is killed.
     */
    /**
     * Per-app home directory under C:\APPS, created on demand (Fase 3 namespacing).
     * Uses the SAME sanitizer as VFS.mkdir (Utils.sanitizePath) so the returned
     * fsRoot always names the directory that was actually created — a different
     * local regex could diverge for odd ids and hand back a root that doesn't exist.
     */
    function ensureAppHome(appId: string): string {
        const safe = Utils.sanitizePath(appId) || 'unknown-app';
        VFS.mkdir('C:\\', 'APPS');            // idempotent
        VFS.mkdir('C:\\APPS', safe);          // idempotent
        return `C:\\APPS\\${safe}`;
    }

    function spawnProcess(appId: string, transport: IProcessTransport, opts: { windowId?: string | null; kind: 'worker' | 'iframe'; onTerminate?: () => void; fsRoot?: string | undefined }): { pid: number; worker: WorkerProcess; process: IProcess } {
        const worker = new WorkerProcess(transport);
        const pid = _nextPid++;
        const windowId = opts.windowId ?? null;

        // Mediated system access: the process reaches the VFS/Notify only through
        // guarded syscalls over its channel (Fase 2), gated by user-consented
        // capabilities (Fase 3) and confined to the app's home dir by default.
        attachSyscalls(worker, {
            appId,
            pid,
            fsRoot: opts.fsRoot ?? ensureAppHome(appId),
        });

        // Adapter so a process fits IProcess.instance (windowId + terminate).
        const instance: IWindowsApp = {
            windowId,
            terminate: () => { worker.terminate(); opts.onTerminate?.(); },
        };
        const process: IProcess = { pid, appId, instance, windowId, status: 'running', kind: opts.kind };

        registry.processes.set(pid, process);
        workers.set(pid, worker);
        watchdog.start();

        window.dispatchEvent(new CustomEvent('kernel:process-started', { detail: process }));
        Utils.Logger.log(`Kernel: ${opts.kind} PID ${pid} spawned [${appId}] (${registry.processes.size} active)`);
        return { pid, worker, process };
    }

    /**
     * Spawns an isolated Web Worker process. The caller supplies a transport
     * (workerTransport(url) in the app, a loopback in tests). Returns the pid and
     * the WorkerProcess handle for request()/ready. The watchdog auto-starts.
     */
    function spawnWorker(appId: string, transport: IProcessTransport, opts: { windowId?: string | null; fsRoot?: string } = {}): { pid: number; worker: WorkerProcess; process: IProcess } {
        return spawnProcess(appId, transport, { windowId: opts.windowId ?? null, kind: 'worker', fsRoot: opts.fsRoot });
    }

    /**
     * Spawns a sandboxed iframe process. Builds the iframe + authenticated
     * MessagePort handshake (see IframeProcess), then registers it as a process
     * whose kill() also removes the iframe.
     */
    async function spawnIframe(appId: string, opts: IframeSpawnOptions & { windowId?: string | null; fsRoot?: string } = {}): Promise<{ pid: number; worker: WorkerProcess; process: IProcess; iframe: HTMLIFrameElement }> {
        const { transport, iframe } = await createIframeTransport(opts);
        const r = spawnProcess(appId, transport, {
            windowId: opts.windowId ?? null,
            kind: 'iframe',
            onTerminate: () => iframe.remove(),
            fsRoot: opts.fsRoot,
        });
        return { ...r, iframe };
    }

    function getWorker(pid: number): WorkerProcess | undefined {
        return workers.get(pid);
    }

    function init(): void {
        Utils.Logger.log('Kernel: Booting...');
        // VFS.init() is async and idempotent. The boot sequence (main.ts) awaits it
        // before initOS, so by here it is already hydrated; this is a cheap no-op
        // that also keeps the Kernel self-sufficient if invoked standalone.
        void VFS.init();
        PluginBridge.init();
        PermissionBroker.init();  // load persisted capability grants
        PackageManager.init();    // load installed apps + re-apply their permission ceilings
        Utils.Logger.log('Kernel: Ready');
    }

    /**
     * Returns a snapshot of the registry for inspection.
     * processes is exposed as an iterable array for external consumers.
     */
    function getRegistry(): { apps: Record<string, IAppRegistryEntry>, processes: IProcess[] } {
        return {
            apps: registry.apps,
            processes: Array.from(registry.processes.values())  // array snapshot, not the live Map
        };
    }

    return {
        init,
        registerApp,
        unregisterApp,
        installPlugin,
        uninstallPlugin,
        launch,
        spawnWorker,
        spawnIframe,
        getWorker,
        kill,
        getRegistry,
        getProcess: (pid: number) => registry.processes.get(pid),
        getActiveCount: () => registry.processes.size,
        __reset: () => {
            watchdog.stop();
            workers.forEach(w => w.terminate());
            workers.clear();
            registry.apps = {};
            registry.processes.clear();
            pluginFrameIds.clear();
            _nextPid = 0;
        }
    };
})();

// Legacy global binding
if (typeof window !== 'undefined') {
    Services.register('Kernel', Kernel);
}
