import { Services } from '../core/ServiceContainer';
import type { IAppMetadata, IProcess } from '../core/Types';

// ============================================
// LEGACY PROCESS BRIDGE
// Puente entre las ventanas "legacy" (no lanzadas por el Kernel) y el modelo de
// procesos del Kernel. Registra un proceso sintético al abrir y notifica su
// muerte al cerrar. Extraído de WindowManager.
// ============================================

type ILegacyProcess = {
    pid: string;
    appId: string;
    windowId: string;
    status: 'running';
    isLegacy: true;
    metadata: { icon: string; name: string };
};

export class LegacyProcessBridge {
    /**
     * Register a synthetic process for windows not launched via Kernel
     */
    public registerLegacyProcess(win: HTMLElement, windowId: string): void {
        const kernel: any = Services.get('Kernel');
        if (!kernel) return;

        const registry = kernel.getRegistry();
        const existingProcess = registry.processes.find((p: any) => p.windowId === windowId && p.status === 'running');
        if (existingProcess) return;

        const header = win.querySelector('.window-header span');
        const title = header ? header.textContent || windowId : windowId;

        // Clean title for matching
        const cleanTitle = title
            .replace(/\s*\-\s*(Notepad|Paint|Internet Explorer|Windows Explorer)/i, '')
            .replace(/The Internet/i, 'Internet Explorer')
            .replace(/Ragdoll Workshop & Skins/i, 'Ragdoll Workshop')
            .trim();

        // Try to find the app in registry by name/title
        let appId = windowId;
        let metadata: IAppMetadata = { icon: '📄', name: title };

        // Match against catalog
        const appEntry = (Object.entries(registry.apps) as [string, { metadata: IAppMetadata }][]).find(([id, info]) => {
            return id === windowId || info.metadata.name === cleanTitle || info.metadata.name === title;
        });

        if (appEntry) {
            appId = appEntry[0];
            metadata = appEntry[1].metadata;
        } else {
            // Manual fallback mapping for known window IDs
            const iconMap: [RegExp, string][] = [
                [/vlrs/i, 'assets/icons/vlrs_icon.webp'],
                [/neon|flappy/i, 'assets/icons/neon.webp'],
                [/rush|football/i, 'assets/icons/rush.webp'],
                [/doom/i, 'assets/icons/doom.webp'],
                [/display|settings/i, 'assets/icons/Display.webp'],
                [/internet|ie/i, 'assets/icons/iexplorer.webp'],
                [/media|amp/i, 'assets/icons/winamp_icon.webp'],
                [/ragdoll|workshop|skin/i, 'assets/icons/ragdoll_skins.webp'],
                [/paint/i, '🎨'],
                [/notepad/i, '📝'],
                [/folder|explorer/i, '📂']
            ];
            metadata.icon = (iconMap.find(([re]) => re.test(windowId) || re.test(cleanTitle)) || [null, '📄'])[1] as string;
            metadata.name = cleanTitle;
        }

        const fakeProcess: ILegacyProcess = {
            pid: `legacy-${windowId}`,
            appId: appId,
            windowId: windowId,
            status: 'running',
            isLegacy: true,
            metadata: metadata
        };

        // Safety: Check if taskbar already has a button for this window
        const existingBtn = document.getElementById(`task-btn-legacy-${windowId}`);
        if (!existingBtn) {
            window.dispatchEvent(new CustomEvent('kernel:process-started', { detail: fakeProcess as unknown as IProcess }));
        }
    }

    /**
     * Notify the Kernel when an app dies (kills the real process or emits a
     * synthetic stop event for our legacy fake process).
     */
    public notifyKernelProcessKilled(windowId: string): void {
        const kernel: any = Services.get('Kernel');
        if (kernel) {
            const processes = kernel.getRegistry().processes;
            const proc = processes.find((p: any) => p.windowId === windowId && p.status === 'running');
            if (proc) {
                kernel.kill(proc.pid);
            } else {
                // Check for our legacy fake process
                window.dispatchEvent(new CustomEvent('kernel:process-stopped', {
                    detail: { pid: `legacy-${windowId}`, windowId: windowId } as unknown as IProcess
                }));
            }
        }
    }
}
