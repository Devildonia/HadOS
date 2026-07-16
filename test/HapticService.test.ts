import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HapticService } from '../js/services/HapticService';

describe('HapticService', () => {
    let service: HapticService;

    beforeEach(() => {
        vi.restoreAllMocks();
        service = new HapticService();
    });

    it('should return false if navigator.vibrate is missing', () => {
        // JSDOM might not have navigate.vibrate by default
        const result = service.vibrate(10);
        expect(result).toBe(false);
    });

    it('should trigger navigator.vibrate when present', () => {
        const mockVibrate = vi.fn().mockReturnValue(true);
        
        Object.defineProperty(window.navigator, 'vibrate', {
            configurable: true,
            value: mockVibrate
        });

        const result = service.vibrate(10);
        expect(result).toBe(true);
        expect(mockVibrate).toHaveBeenCalledWith(10);

        // Test presets
        service.light();
        expect(mockVibrate).toHaveBeenCalledWith(10);

        service.medium();
        expect(mockVibrate).toHaveBeenCalledWith(30);

        service.heavy();
        expect(mockVibrate).toHaveBeenCalledWith(70);

        service.success();
        expect(mockVibrate).toHaveBeenCalledWith([20, 40, 40]);

        service.warning();
        expect(mockVibrate).toHaveBeenCalledWith([50, 50, 50, 50, 100]);

        // Clean up
        Object.defineProperty(window.navigator, 'vibrate', {
            configurable: true,
            value: undefined
        });
    });

    it('should handle navigator.vibrate exceptions gracefully', () => {
        const mockVibrate = vi.fn().mockImplementation(() => {
            throw new Error('Security block');
        });
        
        Object.defineProperty(window.navigator, 'vibrate', {
            configurable: true,
            value: mockVibrate
        });

        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const result = service.vibrate(10);
        
        expect(result).toBe(false);
        expect(consoleWarnSpy).toHaveBeenCalled();
        
        Object.defineProperty(window.navigator, 'vibrate', {
            configurable: true,
            value: undefined
        });
    });
});
