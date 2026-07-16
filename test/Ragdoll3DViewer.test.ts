import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as THREE from 'three';

// Mock Rapier to prevent loading WASM
vi.mock('@dimforge/rapier3d-compat', () => {
    return {
        default: {
            init: vi.fn().mockResolvedValue(true),
            World: vi.fn().mockImplementation(() => {
                return {
                    createCollider: vi.fn(),
                    step: vi.fn(),
                    free: vi.fn()
                };
            }),
            ColliderDesc: {
                cuboid: vi.fn()
            }
        }
    };
});

// Mock WebGLRenderer to avoid WebGL context issues in JSDOM
vi.mock('three', async () => {
    const actual = await vi.importActual('three') as any;
    return {
        ...actual,
        WebGLRenderer: vi.fn().mockImplementation(() => {
            return {
                setSize: vi.fn(),
                setPixelRatio: vi.fn(),
                shadowMap: { enabled: false },
                domElement: document.createElement('canvas'),
                dispose: vi.fn(),
                forceContextLoss: vi.fn()
            };
        })
    };
});

import { Ragdoll3DViewer } from '../js/apps/Ragdoll3DViewer';
import { Services } from '../js/core/ServiceContainer';
import { Kernel } from '../js/core/Kernel';

describe('Ragdoll3DViewer', () => {
    let mockWindowFactory: any;
    let mockResourceManager: any;
    let windowBody: HTMLDivElement;

    beforeEach(() => {
        vi.restoreAllMocks();
        (Services as any).__reset();

        windowBody = document.createElement('div');
        document.body.appendChild(windowBody);

        mockWindowFactory = {
            create: vi.fn(),
            getBody: vi.fn().mockReturnValue(windowBody)
        };

        mockResourceManager = {
            register: vi.fn(),
            unregister: vi.fn(),
            disposeOwner: vi.fn()
        };

        Services.register('WindowFactory', mockWindowFactory);
        Services.register('ResourceManager', mockResourceManager);

        // Dummy canvas container
        const canvasContainer = document.createElement('div');
        canvasContainer.id = 'ragdoll-3d-canvas-container';
        document.body.appendChild(canvasContainer);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['ragdoll-skins']).toBeDefined();
    });

    it('should initialize and mount window HTML correctly', () => {
        const viewer = new Ragdoll3DViewer();
        expect(mockWindowFactory.create).toHaveBeenCalledWith({
            id: 'win-ragdoll-skins',
            title: 'Ragdoll Workshop & Skins',
            width: 380,
            icon: '🎭'
        });
        expect(windowBody.innerHTML).toContain('workshop-tabs');
        expect(windowBody.innerHTML).toContain('skins');
        expect(windowBody.innerHTML).toContain('physics');
        expect(windowBody.innerHTML).toContain('effects');
        expect(windowBody.innerHTML).toContain('3d-viewer');
        
        viewer.terminate();
    });
});
