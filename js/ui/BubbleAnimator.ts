import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';

/**
 * Interface detailing animation operations for popup bubbles (fade, wobble, shake, eased LERP).
 */
export interface IBubbleAnimator {
    /** Animates a bubble fading in and expanding. */
    fadeIn(id: string, duration?: number, onUpdate?: (data: { scale: number, alpha: number, progress: number }) => void, onComplete?: () => void): void;
    /** Animates a bubble fading out and shrinking. */
    fadeOut(id: string, duration?: number, onUpdate?: (data: { scale: number, alpha: number, progress: number }) => void, onComplete?: () => void): void;
    /** Executes a decaying rotational/positional wave sway movement. */
    wobble(id: string, duration?: number, amplitude?: number, onUpdate?: (data: { offsetX: number, offsetY: number, progress: number }) => void, onComplete?: () => void): void;
    /** Executes a high-frequency linear shake translation. */
    shake(id: string, duration?: number, intensity?: number, onUpdate?: (data: { offsetX: number, offsetY: number, progress: number }) => void, onComplete?: () => void): void;
    /** Sequences a complete bubble loop (fadeIn + stay + fadeOut) with optional wobble. */
    fullBubble(id: string, stayDuration?: number, options?: { fadeInDuration?: number, fadeOutDuration?: number, wobble?: boolean }, onUpdate?: (data: any) => void, onComplete?: () => void): void;
    /** Aborts a running animation by ID. */
    cancel(id: string): void;
    /** Aborts all in-flight animations. */
    cancelAll(): void;
    /** Performs a basic linear interpolation. */
    lerp(start: number, end: number, t: number): number;
    /** Performs an eased linear interpolation using a specified equation key. */
    easedLerp(start: number, end: number, t: number, easing?: string): number;
}

/**
 * Utility executing requestAnimationFrame loops to animate dynamic scaling, opacity, and positioning of UI bubbles.
 */
class BubbleAnimator implements IBubbleAnimator {
    /** Map storing active requestAnimationFrame identifiers mapped to unique animation string IDs. */
    private animations: Map<string, number>;
    /** Collection containing standard mathematical easing equations. */
    private easingFunctions: Record<string, (t: number) => number>;

    constructor() {
        this.animations = new Map();
        this.easingFunctions = this.createEasingFunctions();

        Utils.Logger.audio('BubbleAnimator initialized');
    }

    /**
     * Create easing functions.
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
     * Start fade in animation with scale.
     * @param id Unique animation ID.
     * @param duration Duration in ms.
     * @param onUpdate Callback with progress (scale, alpha).
     * @param onComplete Callback on completion.
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
     * Start fade out animation.
     * @param id Unique animation ID.
     * @param duration Duration in ms.
     * @param onUpdate Callback with progress.
     * @param onComplete Callback on completion.
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
     * Wobble animation.
     * @param id Unique ID.
     * @param duration Total duration.
     * @param amplitude Wobble amplitude in px.
     * @param onUpdate Callback with offset {x, y}.
     * @param onComplete Callback on completion.
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
     * Shake animation.
     * @param id Unique ID.
     * @param duration Duration.
     * @param intensity Intensity.
     * @param onUpdate Callback.
     * @param onComplete Callback.
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
     * Full bubble animation (fade in + stay + fade out).
     * @param id Unique ID.
     * @param stayDuration Visible time in ms.
     * @param options Options.
     * @param onUpdate Callback.
     * @param onComplete Final callback.
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
     * Cancel animation.
     * @param id Animation ID.
     */
    cancel(id: string): void {
        const animId = this.animations.get(id);
        if (animId) {
            cancelAnimationFrame(animId);
            this.animations.delete(id);
        }
    }

    /**
     * Cancel all animations.
     */
    cancelAll(): void {
        this.animations.forEach(animId => cancelAnimationFrame(animId));
        this.animations.clear();
    }

    /**
     * Linear interpolation (LERP).
     * @param start Start value.
     * @param end End value.
     * @param t Progress (0-1).
     * @returns Interpolated value.
     */
    lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    /**
     * Eased interpolation.
     * @param start Start value.
     * @param end End value.
     * @param t Progress (0-1).
     * @param easing Easing type.
     * @returns Eased interpolated value.
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