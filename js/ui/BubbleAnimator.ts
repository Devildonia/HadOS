import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';

export interface IBubbleAnimator {
    fadeIn(id: string, duration?: number, onUpdate?: (data: { scale: number, alpha: number, progress: number }) => void, onComplete?: () => void): void;
    fadeOut(id: string, duration?: number, onUpdate?: (data: { scale: number, alpha: number, progress: number }) => void, onComplete?: () => void): void;
    wobble(id: string, duration?: number, amplitude?: number, onUpdate?: (data: { offsetX: number, offsetY: number, progress: number }) => void, onComplete?: () => void): void;
    shake(id: string, duration?: number, intensity?: number, onUpdate?: (data: { offsetX: number, offsetY: number, progress: number }) => void, onComplete?: () => void): void;
    fullBubble(id: string, stayDuration?: number, options?: { fadeInDuration?: number, fadeOutDuration?: number, wobble?: boolean }, onUpdate?: (data: any) => void, onComplete?: () => void): void;
    cancel(id: string): void;
    cancelAll(): void;
    lerp(start: number, end: number, t: number): number;
    easedLerp(start: number, end: number, t: number, easing?: string): number;
}

class BubbleAnimator implements IBubbleAnimator {
    private animations: Map<string, number>;
    private easingFunctions: Record<string, (t: number) => number>;

    constructor() {
        this.animations = new Map();
        this.easingFunctions = this.createEasingFunctions();

        Utils.Logger.audio('BubbleAnimator initialized');
    }

    /**
     * Create easing functions
     */
    private createEasingFunctions(): Record<string, (t: number) => number> {
        return {
            // Linear
            linear: (t: number) => t,

            // Ease Out (deceleration)
            easeOut: (t: number) => 1 - Math.pow(1 - t, 3),

            // Ease In (acceleration)
            easeIn: (t: number) => t * t * t,

            // Ease In-Out (smooth)
            easeInOut: (t: number) => t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2,

            // Ease Out Back (overshoot)
            easeOutBack: (t: number) => {
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            },

            // Elastic (bounce effect)
            easeOutElastic: (t: number) => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0
                    : t === 1 ? 1
                        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
            }
        };
    }

    /**
     * Start fade in animation with scale
     * @param {string} id - Unique animation ID
     * @param {number} duration - Duration in ms
     * @param {Function} onUpdate - Callback with progress (scale, alpha)
     * @param {Function} onComplete - Callback on completion
     */
    fadeIn(id: string, duration: number = 200, onUpdate?: (data: { scale: number, alpha: number, progress: number }) => void, onComplete?: () => void): void {
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out back for "pop" effect
            const easedScale = (this.easingFunctions.easeOutBack ?? ((t: number) => t))(progress);
            const easedAlpha = (this.easingFunctions.easeOut ?? ((t: number) => t))(progress);

            if (onUpdate) {
                onUpdate({
                    scale: easedScale,
                    alpha: easedAlpha,
                    progress: progress
                });
            }

            if (progress < 1) {
                const animId = requestAnimationFrame(animate);
                this.animations.set(id, animId);
            } else {
                this.animations.delete(id);
                if (onComplete) onComplete();
            }
        };

        animate();
    }

    /**
     * Start fade out animation
     * @param {string} id - Unique animation ID
     * @param {number} duration - Duration in ms
     * @param {Function} onUpdate - Callback with progress
     * @param {Function} onComplete - Callback on completion
     */
    fadeOut(id: string, duration: number = 300, onUpdate?: (data: { scale: number, alpha: number, progress: number }) => void, onComplete?: () => void): void {
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Invert progress for fade out
            const fadeProgress = 1 - progress;
            const easedAlpha = (this.easingFunctions.easeIn ?? ((t: number) => t))(fadeProgress);
            const easedScale = (this.easingFunctions.easeIn ?? ((t: number) => t))(fadeProgress);

            if (onUpdate) {
                onUpdate({
                    scale: easedScale,
                    alpha: easedAlpha,
                    progress: progress
                });
            }

            if (progress < 1) {
                const animId = requestAnimationFrame(animate);
                this.animations.set(id, animId);
            } else {
                this.animations.delete(id);
                if (onComplete) onComplete();
            }
        };

        animate();
    }

    /**
     * Wobble animation
     * @param {string} id - Unique ID
     * @param {number} duration - Total duration
     * @param {number} amplitude - Wobble amplitude in px
     * @param {Function} onUpdate - Callback with offset {x, y}
     * @param {Function} onComplete - Callback on completion
     */
    wobble(id: string, duration: number = 500, amplitude: number = 3, onUpdate?: (data: { offsetX: number, offsetY: number, progress: number }) => void, onComplete?: () => void): void {
        const startTime = Date.now();
        const frequency = 8; // Hz

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Decrease amplitude over time
            const currentAmplitude = amplitude * (1 - progress);

            // Calculate sinusoidal offset
            const phase = elapsed * frequency * 0.001 * Math.PI * 2;
            const offsetX = Math.sin(phase) * currentAmplitude;
            const offsetY = Math.cos(phase * 1.3) * currentAmplitude * 0.5;

            if (onUpdate) {
                onUpdate({
                    offsetX,
                    offsetY,
                    progress
                });
            }

            if (progress < 1) {
                const animId = requestAnimationFrame(animate);
                this.animations.set(id, animId);
            } else {
                this.animations.delete(id);
                if (onComplete) onComplete();
            }
        };

        animate();
    }

    /**
     * Shake animation
     * @param {string} id - Unique ID
     * @param {number} duration - Duration
     * @param {number} intensity - Intensity
     * @param {Function} onUpdate - Callback
     * @param {Function} onComplete - Callback
     */
    shake(id: string, duration: number = 300, intensity: number = 5, onUpdate?: (data: { offsetX: number, offsetY: number, progress: number }) => void, onComplete?: () => void): void {
        const startTime = Date.now();
        const frequency = 20; // Hz

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Decrease intensity
            const currentIntensity = intensity * (1 - progress);

            // Random shake
            const offsetX = (Math.random() - 0.5) * currentIntensity * 2;
            const offsetY = (Math.random() - 0.5) * currentIntensity * 2;

            if (onUpdate) {
                onUpdate({
                    offsetX,
                    offsetY,
                    progress
                });
            }

            if (progress < 1) {
                const animId = requestAnimationFrame(animate);
                this.animations.set(id, animId);
            } else {
                this.animations.delete(id);
                if (onComplete) onComplete();
            }
        };

        animate();
    }

    /**
     * Full bubble animation (fade in + stay + fade out)
     * @param {string} id - Unique ID
     * @param {number} stayDuration - Visible time in ms
     * @param {Object} options - Options
     * @param {Function} onUpdate - Callback
     * @param {Function} onComplete - Final callback
     */
    fullBubble(id: string, stayDuration: number = 2000, options: { fadeInDuration?: number, fadeOutDuration?: number, wobble?: boolean } = {}, onUpdate?: (data: any) => void, onComplete?: () => void): void {
        const fadeInDuration = options.fadeInDuration || 200;
        const fadeOutDuration = options.fadeOutDuration || 300;
        const wobble = options.wobble || false;

        // Phase 1: Fade In
        this.fadeIn(id + '_in', fadeInDuration, onUpdate, () => {

            // Phase 2: Stay (with optional wobble)
            if (wobble) {
                this.wobble(id + '_wobble', 500, 3, onUpdate);
            }

            // Phase 3: Fade Out (after stay)
            setTimeout(() => {
                this.fadeOut(id + '_out', fadeOutDuration, onUpdate, onComplete);
            }, stayDuration);
        });
    }

    /**
     * Cancel animation
     * @param {string} id - Animation ID
     */
    cancel(id: string): void {
        const animId = this.animations.get(id);
        if (animId) {
            cancelAnimationFrame(animId);
            this.animations.delete(id);
        }
    }

    /**
     * Cancel all animations
     */
    cancelAll(): void {
        this.animations.forEach(animId => cancelAnimationFrame(animId));
        this.animations.clear();
    }

    /**
     * Linear interpolation (LERP)
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Progress (0-1)
     * @returns {number} Interpolated value
     */
    lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    /**
     * Eased interpolation
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Progress (0-1)
     * @param {string} easing - Easing type
     * @returns {number} Eased interpolated value
     */
    easedLerp(start: number, end: number, t: number, easing: string = 'easeInOut'): number {
        const easingFunc = this.easingFunctions[easing] ?? this.easingFunctions.linear ?? ((t: number) => t);
        const easedT = easingFunc(t);
        return this.lerp(start, end, easedT);
    }
}

// Export
export { BubbleAnimator };

if (typeof window !== 'undefined') {
    Services.register('BubbleAnimator', BubbleAnimator);
}