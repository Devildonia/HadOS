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

/**
 * Represents an entry in the application registry, mapping an app constructor to its metadata.
 */
export interface IAppRegistryEntry {
    /** The constructor class used to instantiate the application. */
    appClass: IWindowsAppConstructor;
    /** Metadata detailing the application's details (name, icon, etc.). */
    metadata: IAppMetadata;
}

/**
 * The internal structure of the Kernel registry tracking registered apps and live processes.
 */
export interface IKernelRegistry {
    /** A dictionary of registered applications keyed by their app ID. */
    apps: Record<string, IAppRegistryEntry>;
    /** A map of active processes keyed by their Process Identifier (PID). */
    processes: Map<number, IProcess>;
}

/**
 * The Kernel interface defining core OS management capabilities.
 */
export interface IKernel {
    /** Initializes the Kernel subsystems, reloading grants and packages. */
    init(): void;
    /** Registers an application with the kernel registry. */
    registerApp(id: string, appClass: IWindowsAppConstructor, metadata: IAppMetadata): void;
    /** Unregisters an application from the kernel registry. */
    unregisterApp(id: string): boolean;
    /** Validates and installs a plugin app, registering it and optionally rendering its window. */
    installPlugin(plugin: IAppPlugin): void;
    /** Uninstalls a plugin, killing all its active processes and revoking bridge trusts. */
    uninstallPlugin(id: string): boolean;
    /** Instantiates and starts a registered application process. Handles singleton checks. */
    launch(appId: string, params?: Record<string, unknown>): IProcess | null;
    /** Spawns a process sandboxed within a Web Worker. */
    spawnWorker(appId: string, transport: IProcessTransport, opts?: { windowId?: string | null; fsRoot?: string }): { pid: number; worker: WorkerProcess; process: IProcess };
    /** Spawns a process sandboxed within an iframe communicating via MessagePort. */
    spawnIframe(appId: string, opts?: IframeSpawnOptions & { windowId?: string | null; fsRoot?: string }): Promise<{ pid: number; worker: WorkerProcess; process: IProcess; iframe: HTMLIFrameElement }>;
    /** Retrieves the WorkerProcess handle associated with a worker PID. */
    getWorker(pid: number): WorkerProcess | undefined;
    /** Terminates a process by PID, freeing its resources and disposing of related windows. */
    kill(pid: number): boolean;
    /** Returns a snapshot copy of the Kernel registry containing registered apps and active processes list. */
    getRegistry(): { apps: Record<string, IAppRegistryEntry>, processes: IProcess[] };
    /** Retrieves a process details by its PID. */
    getProcess(pid: number): IProcess | undefined;
    /** Returns the number of currently active processes. */
    getActiveCount(): number;
    /** Resets the Kernel registry, terminating all workers and clearing registered apps/processes (for testing). */
    __reset(): void;
}

export const Kernel: IKernel = (() => {
    'use strict';

    /** Internal registry of applications and active processes. */
    const registry: IKernelRegistry = {
        apps: {},
        processes: new Map<number, IProcess>() // Map<pid, process> — replaces array, auto-cleans on kill
    };

    /** Monotonically increasing PID counter for active processes. */
    let _nextPid = 0;          // Monotonically increasing PID counter

    /** Records the actual iframe id trusted by the PluginBridge for each plugin. */
    const pluginFrameIds = new Map<string, string>();

    /** Isolated (Web Worker/Iframe) process handles mapping PID to host-side interface. */
    const workers = new Map<number, WorkerProcess>();

    /** Watchdog checking and killing unresponsive worker/iframe processes. */
    const watchdog = new ProcessWatchdog({
        getTargets: () => Array.from(workers.entries()).map(([pid, proc]) => ({ pid, proc })),
        onKill: (pid) => { Utils.Logger.warn(`Kernel: watchdog killing unresponsive PID ${pid}`); kill(pid); },
    });

    /**
     * Registers a new application class to the system.
     * @param id Unique identifier of the app.
     * @param appClass Constructor class of the app.
     * @param metadata App presentation properties (name, icon).
     */
    function registerApp(id: string, appClass: IWindowsAppConstructor, metadata: IAppMetadata): void {
        registry.apps[id] = { appClass, metadata };
        Utils.Logger.log(`Kernel: App registered [${id}]`);
    }

    /**
     * Unregisters an application class from the system.
     * @param id Unique identifier of the app to remove.
     * @returns True if the app was found and removed, false otherwise.
     */
    function unregisterApp(id: string): boolean {
        if (registry.apps[id]) {
            delete registry.apps[id];
            Utils.Logger.log(`Kernel: App unregistered [${id}]`);
            return true;
        }
        return false;
    }

    /**
     * Validates and installs a plugin, registering its constructor and spawning its windows.
     * @param plugin The app plugin configuration to install.
     */
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

    /**
     * Uninstalls a plugin, terminating its running processes and removing frame trust.
     * @param id The app ID of the plugin to uninstall.
     * @returns True if successful, false otherwise.
     */
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

    /**
     * Launches a process within the kernel. For singleton applications, focuses the existing window.
     * @param appId The unique ID of the application to run.
     * @param params Optional initialization parameters passed to the app constructor.
     * @returns The process descriptor if launched successfully, or null if failed.
     */
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
     * Terminates a process by its PID, triggering cleanup hooks, closing windows, and cleaning up WebGL resources.
     * @param pid The PID of the process to kill.
     * @returns True if the process was terminated, false if not found.
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
     * Ensures that an isolated app has a dedicated home directory directory structure.
     * @param appId The unique identifier of the app.
     * @returns The resolved canonical path to the app's VFS folder.
     */
    function ensureAppHome(appId: string): string {
        const safe = Utils.sanitizePath(appId) || 'unknown-app';
        VFS.mkdir('C:\\', 'APPS');            // idempotent
        VFS.mkdir('C:\\APPS', safe);          // idempotent
        return `C:\\APPS\\${safe}`;
    }

    /**
     * Helper method to initialize, attach syscalls, and register a worker or iframe-based isolated process.
     * @param appId The unique ID of the application.
     * @param transport Message channel transport layer (Worker or MessagePort).
     * @param opts Virtualization parameters, including window references, process kind, and custom cleanup action.
     */
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
     * Spawns an isolated background Web Worker process.
     * @param appId The unique ID of the application.
     * @param transport Worker messaging transport layer.
     * @param opts Launch options, including custom target window or virtual root directory.
     */
    function spawnWorker(appId: string, transport: IProcessTransport, opts: { windowId?: string | null; fsRoot?: string } = {}): { pid: number; worker: WorkerProcess; process: IProcess } {
        return spawnProcess(appId, transport, { windowId: opts.windowId ?? null, kind: 'worker', fsRoot: opts.fsRoot });
    }

    /**
     * Spawns an isolated sandboxed iframe process and initiates the MessagePort handshake.
     * @param appId The unique ID of the application.
     * @param opts Handshake and sandboxing preferences.
     * @returns A promise resolving to the process registry details and the HTMLIFrameElement handles.
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

    /**
     * Fetches the host-side worker handler for a given PID.
     * @param pid Process ID.
     */
    function getWorker(pid: number): WorkerProcess | undefined {
        return workers.get(pid);
    }

    /**
     * Boots the Kernel, initializing permissions, packages, VFS, and bridges.
     */
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
     * Captures a snapshot of registered applications and running processes list.
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
