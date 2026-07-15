/**
 * Centralized service to manage haptic feedback for user interactions.
 * Safe fallback for platforms/browsers that do not support navigator.vibrate.
 */
export interface IHapticService {
    vibrate(pattern: number | number[]): boolean;
    light(): boolean;
    medium(): boolean;
    heavy(): boolean;
    success(): boolean;
    warning(): boolean;
}

export class HapticService implements IHapticService {
    /**
     * Trigger a vibration pattern safely.
     */
    public vibrate(pattern: number | number[]): boolean {
        if (typeof window !== 'undefined' && window.navigator && typeof window.navigator.vibrate === 'function') {
            try {
                return window.navigator.vibrate(pattern);
            } catch (e) {
                console.warn('[HapticService] Vibration failed or was blocked by browser security policy:', e);
            }
        }
        return false;
    }

    /**
     * 10ms light discrete vibration (e.g. key tap, icon click).
     */
    public light(): boolean {
        return this.vibrate(10);
    }

    /**
     * 30ms vibration (e.g. window action, selection).
     */
    public medium(): boolean {
        return this.vibrate(30);
    }

    /**
     * 70ms vibration (e.g. heavy ragdoll impact, error message).
     */
    public heavy(): boolean {
        return this.vibrate(70);
    }

    /**
     * Double tap success pattern (20ms vibrate, 40ms pause, 40ms vibrate).
     */
    public success(): boolean {
        return this.vibrate([20, 40, 40]);
    }

    /**
     * Triple warning pattern (50ms vibrate, 50ms pause, 50ms vibrate, 50ms pause, 100ms vibrate).
     */
    public warning(): boolean {
        return this.vibrate([50, 50, 50, 50, 100]);
    }
}
