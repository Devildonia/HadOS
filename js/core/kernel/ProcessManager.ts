import { EventBus } from '../EventBus.js';
import { Utils } from '../../utils.js';
import { VFS } from '../VFS.js';
import { Services } from '../ServiceContainer.js';
import type { IKernelRegistry } from './KernelTypes.js';
import type { IWindowsApp, IProcess } from '../Types.js';
import { WorkerProcess, type IProcessTransport } from '../WorkerProcess.js';
import { ProcessWatchdog } from '../ProcessWatchdog.js';
import { createIframeTransport, type IframeSpawnOptions } from '../IframeProcess.js';
import { attachSyscalls } from '../SyscallBroker.js';

export class ProcessManager {
    private registry: IKernelRegistry;
    private workers = new Map<number, WorkerProcess>();
    private watchdog: ProcessWatchdog;
    private _nextPid = 0;

    constructor(registry: IKernelRegistry) {
        this.registry = registry;
        this.watchdog = new ProcessWatchdog({
            getTargets: () => Array.from(this.workers.entries()).map(([pid, proc]) => ({ pid, proc })),
            onKill: (pid) => { 
                Utils.Logger.warn(`Kernel: watchdog killing unresponsive PID ${pid}`); 
                this.kill(pid); 
            },
        });
    }

    public getWorkers(): Map<number, WorkerProcess> {
        return this.workers;
    }

    public getWatchdog(): ProcessWatchdog {
        return this.watchdog;
    }

    public reset(): void {
        this.watchdog.stop();
        this.workers.forEach(w => w.terminate());
        this.workers.clear();
        this.registry.processes.clear();
        this._nextPid = 0;
    }

    public launch(appId: string, params: Record<string, unknown> = {}): IProcess | null {
        const appInfo = this.registry.apps[appId];
        if (!appInfo) {
            Utils.Logger.error(`Kernel: App not found [${appId}]`);
            return null;
        }

        Utils.Logger.log(`Kernel: Launching ${appId}...`);
        
        // Prevent launching duplicate instances of singleton apps
        if (appInfo.metadata?.singleton === true) {
            const existingProcess = Array.from(this.registry.processes.values()).find(
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
            const pid = this._nextPid++;

            const process: IProcess = {
                pid,
                appId,
                instance,
                windowId: instance.windowId || null,
                status: 'running'
            };

            this.registry.processes.set(pid, process);

            // Auto-open window (Fixed: ensuring foreground launch)
            if (process.windowId) {
                const wm: any = Services.get('WindowManager');
                if (wm) wm.open(process.windowId);

                // Stamp the window's titlebar with the app's registered icon so it
                // matches the taskbar button — the registry metadata is the single
                // source of truth, instead of each app hardcoding a title emoji.
                const regIcon = appInfo.metadata?.icon;
                if (regIcon) {
                    const wf: any = Services.get('WindowFactory');
                    wf?.setTitleIcon?.(process.windowId, regIcon);
                }
            }

            // Dispatch event for Taskbar & subscribers
            EventBus.emit('kernel:process-started', process);
            EventBus.emit('process-started', process);

            Utils.Logger.log(`Kernel: PID ${pid} started (${this.registry.processes.size} active processes)`);
            return process;
        } catch (e) {
            Utils.Logger.error(`Kernel: Failed to launch ${appId}`, e);
            return null;
        }
    }

    public kill(pid: number): boolean {
        const process = this.registry.processes.get(pid);
        if (!process) return false;

        process.status = 'terminated';
        if (process.instance && typeof process.instance.terminate === 'function') {
            process.instance.terminate();
        }

        EventBus.emit('kernel:process-stopped', process);
        EventBus.emit('process-stopped', process);

        const resManager = Services.get('ResourceManager');
        if (resManager) {
            if (process.windowId) {
                resManager.disposeOwner(process.windowId);
            }
            resManager.disposeOwner(process.appId);
        }

        // Tear down the isolated worker handle, if this was a worker process.
        this.workers.delete(pid);
        if (this.workers.size === 0) this.watchdog.stop();

        // Remove from Map — no lingering references
        this.registry.processes.delete(pid);
        Utils.Logger.log(`Kernel: PID ${pid} killed (${this.registry.processes.size} active processes)`);
        return true;
    }

    private ensureAppHome(appId: string): string {
        const safe = Utils.sanitizePath(appId) || 'unknown-app';
        VFS.mkdir('C:\\', 'APPS');            // idempotent
        VFS.mkdir('C:\\APPS', safe);          // idempotent
        return `C:\\APPS\\${safe}`;
    }

    private spawnProcess(
        appId: string, 
        transport: IProcessTransport, 
        opts: { windowId?: string | null; kind: 'worker' | 'iframe'; onTerminate?: () => void; fsRoot?: string | undefined }
    ): { pid: number; worker: WorkerProcess; process: IProcess } {
        const worker = new WorkerProcess(transport);
        const pid = this._nextPid++;
        const windowId = opts.windowId ?? null;

        // Mediated system access
        attachSyscalls(worker, {
            appId,
            pid,
            fsRoot: opts.fsRoot ?? this.ensureAppHome(appId),
        });

        // Adapter so a process fits IProcess.instance (windowId + terminate).
        const instance: IWindowsApp = {
            windowId,
            terminate: () => { worker.terminate(); opts.onTerminate?.(); },
        };
        const process: IProcess = { pid, appId, instance, windowId, status: 'running', kind: opts.kind };

        this.registry.processes.set(pid, process);
        this.workers.set(pid, worker);
        this.watchdog.start();

        EventBus.emit('kernel:process-started', process);
        EventBus.emit('process-started', process);
        Utils.Logger.log(`Kernel: ${opts.kind} PID ${pid} spawned [${appId}] (${this.registry.processes.size} active)`);
        return { pid, worker, process };
    }

    public spawnWorker(
        appId: string, 
        transport: IProcessTransport, 
        opts: { windowId?: string | null; fsRoot?: string } = {}
    ): { pid: number; worker: WorkerProcess; process: IProcess } {
        return this.spawnProcess(appId, transport, { windowId: opts.windowId ?? null, kind: 'worker', fsRoot: opts.fsRoot });
    }

    public async spawnIframe(
        appId: string, 
        opts: IframeSpawnOptions & { windowId?: string | null; fsRoot?: string } = {}
    ): Promise<{ pid: number; worker: WorkerProcess; process: IProcess; iframe: HTMLIFrameElement }> {
        const { transport, iframe } = await createIframeTransport(opts);
        const r = this.spawnProcess(appId, transport, {
            windowId: opts.windowId ?? null,
            kind: 'iframe',
            onTerminate: () => iframe.remove(),
            fsRoot: opts.fsRoot,
        });
        return { ...r, iframe };
    }
}
