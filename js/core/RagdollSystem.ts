/**
 * WINDOWS 95 APP CENTER - RAGDOLL SYSTEM (Modular Component)
 * v2.0.0 (TypeScript EventBus Integration)
 * Encapsulates the ragdoll physics pet inside an OS subsystem pattern
 */

import { RagdollPet } from '../../games/ragdoll/js/RagdollPet.js';
import { EventBus } from './EventBus';
import { Utils } from '../utils';

export class RagdollSystem {
    private pet: any = null;
    private initialized: boolean = false;
    private canvasId: string = 'ragdoll-canvas';

    public init(): void {
        if (this.initialized) return;

        // Verify that DOM is mounted or wait for it
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.mount());
        } else {
            this.mount();
        }
    }

    private mount(): void {
        // Validate Matter.js availability
        if (typeof window.Matter === 'undefined') {
            console.warn('[RAGDOLL SYSTEM] Matter.js not found. Delaying initialization...');
            return;
        }

        if (!document.getElementById(this.canvasId)) {
            Utils.Logger.warn(`[RAGDOLL SYSTEM] Canvas #${this.canvasId} not found`);
            return;
        }

        // Initialize ragdoll
        this.pet = new RagdollPet(this.canvasId);

        // Keep standard compatibility for non-migrated games temporarily
        window.ragdollPet = this.pet;

        // Check persistent state
        const savedActive = localStorage.getItem('ragdollPetActive');
        if (savedActive === 'true') {
            this.pet.init();
            EventBus.emit('ragdoll:state', true);
        }

        this.subscribeToEvents();
        this.initialized = true;
        Utils.Logger.log('[RAGDOLL SYSTEM] Successfully integrated via EventBus');
    }

    private subscribeToEvents(): void {
        // Handle toggling from any source (System Tray, Shortcuts)
        EventBus.on('ragdoll:toggle', () => {
            if (!this.pet) return;
            const isActive = this.pet.toggle();
            EventBus.emit('ragdoll:state', isActive);
        });

        // Handle specific actions (System Bridge / App Workshops)
        EventBus.on('ragdoll:action', (action: string, arg?: any) => {
            if (!this.pet || !this.pet.stickman) return;
            
            Utils.Logger.log(`[RAGDOLL SYSTEM] Action triggered: ${action}`, arg);

            switch (action) {
                case 'skin-custom':
                    this.pet.stickman.setSkin(true);
                    break;
                case 'skin-standard':
                    this.pet.stickman.setSkin(false);
                    break;
                case 'emotion':
                    this.pet.stickman.emotion = arg;
                    break;
                default:
                    // Arbitrary animation methods based on standard convention
                    if (typeof this.pet.stickman[action] === 'function') {
                        this.pet.stickman[action]();
                    }
                    break;
            }
        });
    }
}
