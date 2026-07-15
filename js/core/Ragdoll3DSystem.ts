import { Ragdoll3DDesktop } from './Ragdoll3DDesktop';
import { EventBus } from './EventBus';
import { Utils } from '../utils';

export class Ragdoll3DSystem {
    private desktopInstance: Ragdoll3DDesktop | null = null;
    private initialized: boolean = false;
    private isActive: boolean = false;
    private togglePromise: Promise<void> | null = null;

    public init(): void {
        if (this.initialized) return;

        // Check persistent state
        const savedActive = localStorage.getItem('ragdoll3DPetActive');
        
        this.subscribeToEvents();
        
        if (savedActive === 'true') {
            this.toggle(true).catch(console.error);
        }

        this.initialized = true;
        Utils.Logger.log('[RAGDOLL 3D SYSTEM] Successfully integrated via EventBus');
    }

    private async toggle(forceState?: boolean): Promise<boolean> {
        // Prevent concurrent initialization race conditions
        if (this.togglePromise) await this.togglePromise;
        
        let resolveToggle!: () => void;
        this.togglePromise = new Promise(resolve => resolveToggle = resolve);

        try {
            this.isActive = forceState !== undefined ? forceState : !this.isActive;
            
            if (this.isActive) {
                if (!this.desktopInstance) {
                    this.desktopInstance = new Ragdoll3DDesktop();
                    await this.desktopInstance.initAsync();
                }
            } else {
                if (this.desktopInstance) {
                    this.desktopInstance.terminate();
                    this.desktopInstance = null;
                }
            }
            
            localStorage.setItem('ragdoll3DPetActive', this.isActive.toString());
            EventBus.emit('ragdoll3d:state', this.isActive);
            return this.isActive;
        } finally {
            resolveToggle();
            this.togglePromise = null;
        }
    }

    private subscribeToEvents(): void {
        EventBus.on('ragdoll3d:toggle', async () => {
            const isActive = await this.toggle();
            
            // Turn off 2D if turning on 3D
            if (isActive) {
                const is2DActive = localStorage.getItem('ragdollPetActive') === 'true';
                if (is2DActive) {
                    EventBus.emit('ragdoll:toggle');
                }
            }
        });

        // Turn off 3D if turning on 2D
        EventBus.on('ragdoll:toggle', () => {
             setTimeout(async () => {
                 const is2DActive = localStorage.getItem('ragdollPetActive') === 'true';
                 if (is2DActive && this.isActive) {
                     await this.toggle(false);
                 }
             }, 50);
        });
        
        // Re-emit state on boot for UI sync
        setTimeout(() => {
             EventBus.emit('ragdoll3d:state', this.isActive);
        }, 100);
    }
}
