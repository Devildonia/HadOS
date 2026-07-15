import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Utils } from '../js/utils.js';
import { Services } from '../js/core/ServiceContainer.js';
import { BubbleAnimator } from '../js/ui/BubbleAnimator.js';
import { MessageLibrary } from '../js/ui/MessageLibrary.js';

describe('UI Modules', () => {

    describe('MessageLibrary', () => {
        let msgLib;

        beforeEach(() => {
            msgLib = new MessageLibrary();
        });

        it('should initialize with predefined messages', () => {
            expect(msgLib.getTotalMessageCount()).toBeGreaterThan(50);
            expect(msgLib.getCategories()).toContain('GREETINGS');
            expect(msgLib.getCategories()).toContain('HAPPY');
        });

        it('should return a random message from a specific category', () => {
            const msg = msgLib.get('GREETINGS');
            // get() translates `ragdoll.*` keys when the i18n service is present
            // and its locale has loaded, so compare against the resolved values
            // (translated when i18n is active, raw keys otherwise). This keeps the
            // assertion independent of i18n's async load timing.
            const rawKeys = msgLib.messages['GREETINGS'];
            const i18nService = Services.get('i18n');
            const expected = i18nService ? rawKeys.map(k => i18nService.t(k)) : rawKeys;
            expect(expected).toContain(msg);
        });

        it('should avoid repeating recent messages', () => {
            msgLib.maxHistory = 2;
            msgLib.messages['TEST_CAT'] = ['A', 'B']; // Only 2 messages

            // Pick first
            const msg1 = msgLib.get('TEST_CAT');

            // Pick second, must be the other one due to avoidRepeat=true
            const msg2 = msgLib.get('TEST_CAT');

            expect(msg1).not.toBe(msg2);
            expect(['A', 'B']).toContain(msg1);
            expect(['A', 'B']).toContain(msg2);
        });

        it('should route emotions, states, and contexts to correct categories', () => {
            vi.spyOn(msgLib, 'get').mockImplementation(cat => cat);

            expect(msgLib.getByEmotion('happy')).toBe('HAPPY');
            expect(msgLib.getByEmotion('panic')).toBe('SCARED');
            expect(msgLib.getByEmotion('unknown_emotion')).toBe('THINKING'); // fallback

            expect(msgLib.getByState('waving')).toBe('GREETINGS');
            expect(msgLib.getByState('dancing')).toBe('CELEBRATING');

            expect(msgLib.getContextual('grabbed')).toBe('SURPRISED');
            expect(msgLib.getContextual('firstMeet')).toBe('GREETINGS');
        });

        it('should determine if a string is composed of emojis and adapt font sizes', () => {
            expect(msgLib.isEmoji('😀')).toBe(true);
            expect(msgLib.isEmoji('Hello 😀')).toBe(false);

            expect(msgLib.getRecommendedFontSize('😀')).toBe(20); // Emoji
            expect(msgLib.getRecommendedFontSize('Hi')).toBe(16); // <=3 chars
            expect(msgLib.getRecommendedFontSize('Hello!!')).toBe(12); // <=8 chars
            expect(msgLib.getRecommendedFontSize('This is a longer message')).toBe(11); // Normal
        });
    });

    describe('BubbleAnimator', () => {
        let animator;

        beforeEach(() => {
            vi.useFakeTimers();

            // Mock requestAnimationFrame to just execute the callback synchronously for FakeTimers
            vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 16));
            vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(clearTimeout);

            animator = new BubbleAnimator();
        });

        afterEach(() => {
            animator.cancelAll();
            vi.restoreAllMocks();
            vi.useRealTimers();
        });

        it('should interpolate linearly', () => {
            expect(animator.lerp(0, 100, 0.5)).toBe(50);
            expect(animator.lerp(50, 150, 0.2)).toBe(70);
        });

        it('should interpolate with easing', () => {
            // Linear override
            expect(animator.easedLerp(0, 100, 0.5, 'linear')).toBe(50);

            // EaseIn (x^3) -> 0.5^3 = 0.125 * 100 = 12.5
            expect(animator.easedLerp(0, 100, 0.5, 'easeIn')).toBeCloseTo(12.5);
        });

        it('should play a fade in animation to completion over duration', () => {
            const onUpdate = vi.fn();
            const onComplete = vi.fn();

            animator.fadeIn('test_fade', 100, onUpdate, onComplete);

            // Fast forward time
            vi.advanceTimersByTime(50);
            expect(onUpdate).toHaveBeenCalled();
            expect(onComplete).not.toHaveBeenCalled();

            vi.advanceTimersByTime(200); // 250ms total > 100ms duration
            expect(onComplete).toHaveBeenCalled();
            expect(animator.animations.has('test_fade')).toBe(false);
        });

        it('should cancel active animations', () => {
            const onUpdate = vi.fn();
            const onComplete = vi.fn();

            animator.wobble('test_wobble', 500, 5, onUpdate, onComplete);

            // Allow first frame
            vi.advanceTimersByTime(20);
            expect(onUpdate).toHaveBeenCalled();
            expect(animator.animations.has('test_wobble')).toBe(true);

            // Cancel
            animator.cancel('test_wobble');
            vi.advanceTimersByTime(500);

            expect(onComplete).not.toHaveBeenCalled(); // Call canceled
            expect(animator.animations.has('test_wobble')).toBe(false);
        });

        it('should orchestrate a fullBubble sequence', () => {
            vi.spyOn(animator, 'fadeIn');
            vi.spyOn(animator, 'fadeOut');

            const onUpdate = vi.fn();
            const onComplete = vi.fn();

            animator.fullBubble('my_bubble', 500, { fadeInDuration: 100, fadeOutDuration: 100 }, onUpdate, onComplete);

            expect(animator.fadeIn).toHaveBeenCalledWith('my_bubble_in', 100, onUpdate, expect.any(Function));

            // Fast forward through fade in
            vi.advanceTimersByTime(110);

            // After fade in, stayDuration starts (500ms)
            expect(animator.fadeOut).not.toHaveBeenCalled();

            // advance through stay
            vi.advanceTimersByTime(510);

            // Should start fadeOut
            expect(animator.fadeOut).toHaveBeenCalledWith('my_bubble_out', 100, onUpdate, onComplete);

            // Advance through fade out
            vi.advanceTimersByTime(110);

            // Should be completely done (fadeOut has its own onComplete callback check, but let's check our onComplete wrapper was passed)
            // By the time fadeOut is done, the actual passed onComplete function will be called internally
            // The assertion happens on the fadeOut definition
        });
    });
});
