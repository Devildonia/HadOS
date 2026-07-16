import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel';
import { Services } from '../js/core/ServiceContainer';
import { ResourceManager } from '../js/core/ResourceManager';

// Import apps to ensure they register themselves with the Kernel
import '../js/apps/Notepad';
import '../js/apps/Paint';

describe('CI Leak Budget Test Suite', () => {
    beforeEach(() => {
        // Mock getContext for Paint's canvas with full 2D stub context
        const mockCtx = {
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            fill: vi.fn(),
            clearRect: vi.fn(),
            fillRect: vi.fn(),
            drawImage: vi.fn(),
            getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 100, height: 100 })),
            putImageData: vi.fn(),
            arc: vi.fn(),
            rect: vi.fn(),
            strokeRect: vi.fn(),
            set lineWidth(_v: number) { },
            set strokeStyle(_v: string) { },
            set fillStyle(_v: string) { },
            set lineCap(_v: string) { },
            set lineJoin(_v: string) { },
            set globalCompositeOperation(_v: string) { }
        };
        HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCtx as any);

        // Ensure ResourceManager is registered in the Services container
        if (!Services.get('ResourceManager')) {
            Services.register('ResourceManager', new ResourceManager());
        }
        
        // Kill existing processes to start from a clean baseline
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // Clean up DOM
        document.body.innerHTML = '';
    });

    it('should launch notepad and clean up all resources upon exit without leaks', () => {
        const resManager = Services.get('ResourceManager') as ResourceManager;
        const initialResources = resManager.stats().total;

        // 1. Launch notepad
        const process = Kernel.launch('notepad');
        expect(process).toBeDefined();
        
        // Resource count should increase when app is active
        const activeResources = resManager.stats().total;
        expect(activeResources).toBeGreaterThan(initialResources);

        // 2. Kill the notepad process
        if (process) {
            Kernel.kill(process.pid);
        }

        // Resource count must return to baseline
        const postKillResources = resManager.stats().total;
        expect(postKillResources).toBe(initialResources);
    });

    it('should launch paint and clean up all resources upon exit without leaks', () => {
        const resManager = Services.get('ResourceManager') as ResourceManager;
        const initialResources = resManager.stats().total;

        // 1. Launch paint
        const process = Kernel.launch('paint');
        expect(process).toBeDefined();

        // Resource count should increase
        const activeResources = resManager.stats().total;
        expect(activeResources).toBeGreaterThan(initialResources);

        // 2. Kill paint process
        if (process) {
            Kernel.kill(process.pid);
        }

        // Resource count must return to baseline
        const postKillResources = resManager.stats().total;
        expect(postKillResources).toBe(initialResources);
    });
});
