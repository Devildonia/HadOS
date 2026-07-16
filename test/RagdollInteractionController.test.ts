import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as THREE from 'three';

// Mock Rapier to prevent loading WASM
vi.mock('@dimforge/rapier3d-compat', () => {
    const chainDesc = () => {
        const o: any = {};
        for (const m of ['setTranslation', 'setRotation', 'setLinearDamping',
            'setAngularDamping', 'setCanSleep', 'setCcdEnabled']) {
            o[m] = vi.fn(() => o);
        }
        return o;
    };
    return {
        default: {
            RigidBodyType: { Dynamic: 'Dynamic', KinematicPositionBased: 'Kinematic' },
            RigidBodyDesc: { kinematicPositionBased: vi.fn(chainDesc) },
            ColliderDesc: {
                cuboid: vi.fn(() => ({})),
                ball: vi.fn(() => ({})),
                capsule: vi.fn(() => ({})),
            },
            JointData: { spherical: vi.fn(() => ({})) },
        },
    };
});

import { RagdollInteractionController, type IRagdollInteractionDeps } from '../js/core/RagdollInteractionController';
import { Services } from '../js/core/ServiceContainer';
import RAPIER from '@dimforge/rapier3d-compat';

describe('RagdollInteractionController', () => {
    let deps: IRagdollInteractionDeps;
    let mockWorld: any;
    let mockAudioManager: any;
    let mockRagdollMemory: any;
    
    let rigidBodiesMap: Map<string, any>;
    let debugMeshMap: Map<string, THREE.Mesh>;
    
    let container: HTMLElement | null = null;
    let renderer: THREE.WebGLRenderer | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    let model: THREE.Group | undefined;

    let grabbedBody: any = null;
    let anchorBody: any = null;
    let mouseJoint: any = null;
    let mouseVelocity = new THREE.Vector3();
    let showDebug = false;
    let isRagdollMode = false;
    
    let onGrabbedCalled = false;
    let sayCalledWith = '';

    function makeMockBody(pos = { x: 0, y: 0, z: 0 }) {
        return {
            translation: vi.fn(() => pos),
            wakeUp: vi.fn(),
            setLinvel: vi.fn()
        };
    }

    beforeEach(() => {
        vi.restoreAllMocks();
        (Services as any).__reset();

        rigidBodiesMap = new Map();
        debugMeshMap = new Map();
        
        container = document.createElement('div');
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
            left: 0, top: 0, width: 100, height: 100
        } as DOMRect);

        renderer = {} as any;
        camera = new THREE.PerspectiveCamera();
        model = new THREE.Group();

        mockWorld = {
            createRigidBody: vi.fn(() => ({
                setNextKinematicTranslation: vi.fn()
            })),
            createImpulseJoint: vi.fn(() => ({})),
            removeImpulseJoint: vi.fn(),
            removeRigidBody: vi.fn()
        };

        mockAudioManager = {
            play: vi.fn()
        };

        mockRagdollMemory = {
            recordDrop: vi.fn(),
            recordHurt: vi.fn()
        };
        Services.register('RagdollMemory', mockRagdollMemory);

        showDebug = false;
        isRagdollMode = false;
        grabbedBody = null;
        anchorBody = null;
        mouseJoint = null;
        mouseVelocity.set(0, 0, 0);
        onGrabbedCalled = false;
        sayCalledWith = '';

        deps = {
            getContainer: () => container,
            getRenderer: () => renderer,
            getCamera: () => camera,
            getModel: () => model,
            getWorld: () => mockWorld,
            getRigidBodies: () => rigidBodiesMap,
            getDebugMeshMap: () => debugMeshMap,
            getShowDebug: () => showDebug,
            getAudioManager: () => mockAudioManager,
            getGrabbedBody: () => grabbedBody,
            setGrabbedBody: (val) => { grabbedBody = val; },
            getMouseAnchorBody: () => anchorBody,
            setMouseAnchorBody: (val) => { anchorBody = val; },
            getMouseJoint: () => mouseJoint,
            setMouseJoint: (val) => { mouseJoint = val; },
            getMouseVelocity: () => mouseVelocity,
            setRagdollMode: (val) => { isRagdollMode = val; },
            onRagdollGrabbed: () => { onGrabbedCalled = true; },
            say: (text) => { sayCalledWith = text; }
        };
    });

    describe('onMouseDown', () => {
        it('should exit early if container or renderer is missing', () => {
            container = null;
            const controller = new RagdollInteractionController(deps);
            controller.onMouseDown(new MouseEvent('mousedown'));
            expect(mockWorld.createRigidBody).not.toHaveBeenCalled();
        });

        it('should search for hits and create kinematic anchor & joint on grab', () => {
            const controller = new RagdollInteractionController(deps);
            
            const hipsBody = makeMockBody({ x: 0, y: 1, z: 0 });
            rigidBodiesMap.set('Hips', hipsBody);

            // Mock raycaster to return intersection on model
            vi.spyOn(controller['raycaster'], 'intersectObject').mockReturnValue([
                { point: new THREE.Vector3(0, 1, 0) } as any
            ]);

            controller.onMouseDown(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));

            expect(grabbedBody).toBe(hipsBody);
            expect(isRagdollMode).toBe(true);
            expect(mockWorld.createRigidBody).toHaveBeenCalled();
            expect(mockWorld.createImpulseJoint).toHaveBeenCalled();
            expect(mockAudioManager.play).toHaveBeenCalledWith('wii');
            expect(onGrabbedCalled).toBe(true);
        });

        it('should check debug meshes if showDebug is active', () => {
            showDebug = true;
            const controller = new RagdollInteractionController(deps);
            
            const headMesh = new THREE.Mesh();
            headMesh.userData = { boneName: 'Head' };
            debugMeshMap.set('Head', headMesh);

            const headBody = makeMockBody({ x: 0, y: 2, z: 0 });
            rigidBodiesMap.set('Head', headBody);

            // Mock raycaster to hit the debug mesh
            vi.spyOn(controller['raycaster'], 'intersectObjects').mockReturnValue([
                { object: headMesh, point: new THREE.Vector3(0, 2, 0) } as any
            ]);

            controller.onMouseDown(new MouseEvent('mousedown', { clientX: 50, clientY: 50 }));

            expect(grabbedBody).toBe(headBody);
        });
    });

    describe('onMouseMove', () => {
        it('should exit early if not grabbing', () => {
            const controller = new RagdollInteractionController(deps);
            controller.onMouseMove(new MouseEvent('mousemove'));
            expect(mockWorld.createRigidBody).not.toHaveBeenCalled();
        });

        it('should update kinematic translation and wake up bodies on mousemove', () => {
            const controller = new RagdollInteractionController(deps);
            
            grabbedBody = makeMockBody();
            anchorBody = { setNextKinematicTranslation: vi.fn() };
            
            const hipsBody = makeMockBody();
            rigidBodiesMap.set('Hips', hipsBody);

            // Raycaster plane intersection mock
            vi.spyOn(controller['raycaster'].ray, 'intersectPlane').mockImplementation((plane, target) => {
                target.set(10, 20, 30);
                return target;
            });

            controller.onMouseMove(new MouseEvent('mousemove', { clientX: 80, clientY: 80 }));

            expect(anchorBody.setNextKinematicTranslation).toHaveBeenCalledWith(expect.any(THREE.Vector3));
            expect(hipsBody.wakeUp).toHaveBeenCalled();
        });
    });

    describe('onMouseUp', () => {
        it('should exit early if grabbed body is missing', () => {
            const controller = new RagdollInteractionController(deps);
            controller.onMouseUp();
            expect(mockWorld.removeRigidBody).not.toHaveBeenCalled();
        });

        it('should release joint and anchor and perform records', () => {
            const controller = new RagdollInteractionController(deps);
            
            grabbedBody = makeMockBody({ x: 0, y: 1, z: 0 });
            anchorBody = {};
            mouseJoint = {};
            
            const hipsBody = makeMockBody({ x: 0, y: 1, z: 0 });
            rigidBodiesMap.set('Hips', hipsBody);

            controller.onMouseUp();

            expect(mockWorld.removeImpulseJoint).toHaveBeenCalled();
            expect(mockWorld.removeRigidBody).toHaveBeenCalled();
            expect(mockRagdollMemory.recordDrop).toHaveBeenCalled();
            expect(grabbedBody).toBeNull();
        });

        it('should apply throw velocity with falloff if speed > 0.5', () => {
            const controller = new RagdollInteractionController(deps);
            
            grabbedBody = makeMockBody({ x: 0, y: 1, z: 0 });
            const hipsBody = makeMockBody({ x: 0, y: 1, z: 0 });
            rigidBodiesMap.set('Hips', hipsBody);
            
            // Set high launch velocity
            mouseVelocity.set(3, 0, 0); // throwVel = mouseVelocity * 1.5 = (4.5, 0, 0), speed = 4.5

            controller.onMouseUp();

            expect(hipsBody.setLinvel).toHaveBeenCalled();
        });

        it('should play scream and say AHHH if speed > 4', () => {
            const controller = new RagdollInteractionController(deps);
            
            grabbedBody = makeMockBody({ x: 0, y: 1, z: 0 });
            const hipsBody = makeMockBody({ x: 0, y: 1, z: 0 });
            rigidBodiesMap.set('Hips', hipsBody);

            // Speed > 4 (e.g. 5, throwVel is 7.5 > 4)
            mouseVelocity.set(5, 0, 0);

            controller.onMouseUp();

            expect(mockAudioManager.play).toHaveBeenCalledWith('scream', { volume: 0.4 });
            expect(sayCalledWith).toBe('¡AHHHH!');
            expect(mockRagdollMemory.recordHurt).toHaveBeenCalled();
        });
    });
});
