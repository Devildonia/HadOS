import { EventBus } from './EventBus.js';
import { Utils } from '../utils.js';
import { VFS } from './VFS.js';
import { Services } from './ServiceContainer.js';
import type { IWindowsAppConstructor, IAppMetadata, IProcess, IAppPlugin } from './Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { PluginManager } from './PluginManager.js';
import { PluginBridge } from './PluginBridge.js';
import { WorkerProcess, type IProcessTransport } from './WorkerProcess.js';
import type { IframeSpawnOptions } from './IframeProcess.js';
import { PermissionBroker } from './PermissionBroker.js';
import { PackageManager } from './PackageManager.js';
import { AppRegistry } from './kernel/AppRegistry.js';
import { ProcessManager } from './kernel/ProcessManager.js';
import type { IAppRegistryEntry, IKernelRegistry } from './kernel/KernelTypes.js';

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

    /** Internal registry of applications and active processes. */
    const registry: IKernelRegistry = {
        apps: {},
        processes: new Map<number, IProcess>()
    };

    /** Records the actual iframe id trusted by the PluginBridge for each plugin. */
    const pluginFrameIds = new Map<string, string>();

    const appRegistry = new AppRegistry(registry);
    const processManager = new ProcessManager(registry);

    /**
     * Boots the Kernel, initializing permissions, packages, VFS, and bridges.
     */
    function init(): void {
        Utils.Logger.log('Kernel: Booting...');
        void VFS.init();
        PluginBridge.init();
        PermissionBroker.init();  // load persisted capability grants
        PackageManager.init();    // load installed apps + re-apply their permission ceilings
        Utils.Logger.log('Kernel: Ready');
    }

    function registerApp(id: string, appClass: IWindowsAppConstructor, metadata: IAppMetadata): void {
        appRegistry.registerApp(id, appClass, metadata);
    }

    function unregisterApp(id: string): boolean {
        return appRegistry.unregisterApp(id);
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
            EventBus.emit('kernel:plugin-uninstalled', { id });
            Utils.Logger.log(`Kernel: Plugin uninstalled [${id}]`);
            return true;
        }
        return false;
    }

    function launch(appId: string, params: Record<string, unknown> = {}): IProcess | null {
        return processManager.launch(appId, params);
    }

    function spawnWorker(appId: string, transport: IProcessTransport, opts: { windowId?: string | null; fsRoot?: string } = {}): { pid: number; worker: WorkerProcess; process: IProcess } {
        return processManager.spawnWorker(appId, transport, opts);
    }

    async function spawnIframe(appId: string, opts: IframeSpawnOptions & { windowId?: string | null; fsRoot?: string } = {}): Promise<{ pid: number; worker: WorkerProcess; process: IProcess; iframe: HTMLIFrameElement }> {
        return processManager.spawnIframe(appId, opts);
    }

    function getWorker(pid: number): WorkerProcess | undefined {
        return processManager.getWorkers().get(pid);
    }

    function kill(pid: number): boolean {
        return processManager.kill(pid);
    }

    function getRegistry(): { apps: Record<string, IAppRegistryEntry>, processes: IProcess[] } {
        return {
            apps: registry.apps,
            processes: Array.from(registry.processes.values())
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
            processManager.reset();
            registry.apps = {};
            pluginFrameIds.clear();
        }
    };
})();

// Legacy global binding
if (typeof window !== 'undefined') {
    Services.register('Kernel', Kernel);
}
