import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HDRManager } from '../js/core/HDRManager.js';

describe('HDRManager', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: true,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
        document.body.innerHTML = `
            <button id="hdr-toggle-btn" style="display:none;"></button>
        `;
    });

    describe('init', () => {
        it('should initialize without errors', () => {
            expect(() => HDRManager.init()).not.toThrow();
        });
    });

    describe('toggle', () => {
        it('should toggle HDR state', () => {
            HDRManager.init();
            const initial = document.documentElement.classList.contains('hdr-enabled');
            HDRManager.toggle();
            const after = document.documentElement.classList.contains('hdr-enabled');
            expect(after).toBe(!initial);
        });

        it('should persist state to localStorage', () => {
            HDRManager.init();
            HDRManager.toggle();
            const stored = localStorage.getItem('hdr-enabled');
            expect(stored).not.toBeNull();
        });
    });
});
