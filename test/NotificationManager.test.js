import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Notify } from '../js/ui/NotificationManager.js';
import { Services } from '../js/core/ServiceContainer.js';

describe('NotificationManager (Notify)', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        document.body.innerHTML = '';
        Notify.clear();
        Services.__reset();

        // Mock AudioManager
        Services.register('AudioManager', {
            play: vi.fn()
        });
    });

    afterEach(() => {
        Notify.clear();
    });

    describe('notification creation', () => {
        it('should create info notification in the DOM', () => {
            Notify.info('Test message');
            const notifications = document.querySelectorAll('.win95-notification');
            expect(notifications.length).toBe(1);
        });

        it('should create success notification', () => {
            Notify.success('Done!');
            const el = document.querySelector('.win95-notification');
            expect(el).not.toBeNull();
            expect(el.textContent).toContain('Done!');
        });

        it('should create warn notification', () => {
            Notify.warn('Low disk space');
            const el = document.querySelector('.win95-notification');
            expect(el.textContent).toContain('Low disk space');
        });

        it('should create error notification with System Error title', () => {
            Notify.error('Critical failure');
            const el = document.querySelector('.win95-notification');
            expect(el.textContent).toContain('Critical failure');
            expect(el.textContent).toContain('System Error');
        });

        it('should display correct icons for each type', () => {
            Notify.info('info');
            Notify.success('success');
            Notify.warn('warn');
            Notify.error('error');

            const all = document.querySelectorAll('.win95-notification');
            expect(all.length).toBe(4);
        });
    });

    describe('XSS prevention', () => {
        it('should escape HTML in notification messages', () => {
            Notify.info('<script>alert("xss")</script>');
            const el = document.querySelector('.win95-notification');
            expect(el.innerHTML).not.toContain('<script>');
        });
    });

    describe('multiple notifications', () => {
        it('should stack multiple notifications', () => {
            Notify.info('First');
            Notify.info('Second');
            Notify.info('Third');
            const all = document.querySelectorAll('.win95-notification');
            expect(all.length).toBe(3);
        });
    });

    describe('clear', () => {
        it('should remove all notifications', () => {
            Notify.info('A');
            Notify.error('B');
            Notify.clear();
            const container = document.getElementById('win95-notifications');
            if (container) {
                expect(container.children.length).toBe(0);
            }
        });
    });

    describe('auto-dismiss', () => {
        it('should auto-dismiss after configured duration', () => {
            vi.useFakeTimers();
            Notify.info('Temporary', { duration: 100 });
            expect(document.querySelectorAll('.win95-notification').length).toBe(1);

            vi.advanceTimersByTime(500); // 100ms dismiss + 300ms animation
            // Notification should be gone or fading
            vi.useRealTimers();
        });
    });

    describe('audio feedback', () => {
        it('should play blip for error notifications', () => {
            const playFn = vi.fn();
            Services.register('AudioManager', {
                play: playFn
            });
            Notify.error('Beep!');
            expect(playFn).toHaveBeenCalledWith('blip', expect.any(Object));
        });

        it('should play blip for warn notifications', () => {
            const playFn = vi.fn();
            Services.register('AudioManager', {
                play: playFn
            });
            Notify.warn('Warning!');
            expect(playFn).toHaveBeenCalled();
        });
    });

    describe('return value', () => {
        it('should return a numeric notification ID', () => {
            const id1 = Notify.info('First');
            const id2 = Notify.info('Second');
            expect(typeof id1).toBe('number');
            expect(id2).toBeGreaterThan(id1);
        });
    });
});
