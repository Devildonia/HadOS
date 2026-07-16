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

import { RagdollPhysicsRig, type IRagdollPhysicsRigDeps } from '../js/core/RagdollPhysicsRig';
import RAPIER from '@dimforge/rapier3d-compat';

describe('RagdollPhysicsRig', () => {
    let deps: IRagdollPhysicsRigDeps;
    let mockWorld: any;
    let mockScene: any;
    let mockMixer: any;
    let rigidBodiesMap: Map<string, any>;
    let boneRigidBodyMap: Map<string, THREE.Bone>;
    let debugMeshMap: Map<string, THREE.Mesh>;
    let showDebug = false;
    let isRagdollMode = false;

    function makeMockBody(pos = { x: 0, y: 0, z: 0 }) {
        return {
            setTranslation: vi.fn(),
            setRotation: vi.fn(),
            setLinvel: vi.fn(),
            setAngvel: vi.fn(),
            setBodyType: vi.fn(),
            resetForces: vi.fn(),
            resetTorques: vi.fn(),
            setNextKinematicTranslation: vi.fn(),
            setNextKinematicRotation: vi.fn(),
            translation: vi.fn(() => pos),
            rotation: vi.fn(() => ({ x: 0, y: 0, z: 0, w: 1 })),
        };
    }

    beforeEach(() => {
        vi.restoreAllMocks();

        rigidBodiesMap = new Map();
        boneRigidBodyMap = new Map();
        debugMeshMap = new Map();
        showDebug = false;
        isRagdollMode = false;

        mockWorld = {
            createRigidBody: vi.fn(() => makeMockBody()),
            createCollider: vi.fn(() => ({ setCollisionGroups: vi.fn() })),
            createImpulseJoint: vi.fn()
        };

        mockScene = {
            add: vi.fn(),
            remove: vi.fn()
        };

        mockMixer = {
            stopAllAction: vi.fn()
        };

        deps = {
            getWorld: () => mockWorld,
            getScene: () => mockScene,
            getMixer: () => mockMixer,
            getShowDebug: () => showDebug,
            getRagdollMode: () => isRagdollMode,
            setRagdollMode: (val) => { isRagdollMode = val; },
            getRigidBodies: () => rigidBodiesMap,
            getBoneRigidBodyMap: () => boneRigidBodyMap,
            getDebugMeshMap: () => debugMeshMap
        };
    });

    it('setRagdollMode(true) should teleport bodies and transition to Dynamic', () => {
        const rig = new RagdollPhysicsRig(deps);
        
        const hipsBody = makeMockBody();
        rigidBodiesMap.set('Hips', hipsBody);
        
        const hipsBone = new THREE.Bone();
        hipsBone.name = 'Hips';
        hipsBone.position.set(1, 2, 3);
        boneRigidBodyMap.set('Hips', hipsBone);

        rig.setRagdollMode(true);

        expect(isRagdollMode).toBe(true);
        expect(hipsBody.setTranslation).toHaveBeenCalled();
        expect(hipsBody.setBodyType).toHaveBeenCalledWith(RAPIER.RigidBodyType.Dynamic, true);
        expect(mockMixer.stopAllAction).toHaveBeenCalled();
    });

    it('setRagdollMode(false) should transition bodies to Kinematic', () => {
        const rig = new RagdollPhysicsRig(deps);
        isRagdollMode = true; // start as true

        const hipsBody = makeMockBody();
        rigidBodiesMap.set('Hips', hipsBody);

        rig.setRagdollMode(false);

        expect(isRagdollMode).toBe(false);
        expect(hipsBody.setBodyType).toHaveBeenCalledWith(RAPIER.RigidBodyType.KinematicPositionBased, true);
    });

    it('createRigidBodyForBone should ignore non-main bones', () => {
        const rig = new RagdollPhysicsRig(deps);
        const randomBone = new THREE.Bone();
        randomBone.name = 'LeftToe';

        rig.createRigidBodyForBone(randomBone);
        expect(mockWorld.createRigidBody).not.toHaveBeenCalled();
    });

    it('createRigidBodyForBone should construct bodies, colliders, and debug meshes', () => {
        const rig = new RagdollPhysicsRig(deps);
        showDebug = true;

        const headBone = new THREE.Bone();
        headBone.name = 'Head';

        const hipsBone = new THREE.Bone();
        hipsBone.name = 'Hips';

        const armBone = new THREE.Bone();
        armBone.name = 'LeftArm';

        rig.createRigidBodyForBone(headBone);
        rig.createRigidBodyForBone(hipsBone);
        rig.createRigidBodyForBone(armBone);

        expect(mockWorld.createRigidBody).toHaveBeenCalledTimes(3);
        expect(mockScene.add).toHaveBeenCalledTimes(3); // debug meshes added
        expect(rigidBodiesMap.has('Head')).toBe(true);
        expect(rigidBodiesMap.has('Hips')).toBe(true);
        expect(rigidBodiesMap.has('LeftArm')).toBe(true);
    });

    it('setupJoints should bind parent and child bodies', () => {
        const rig = new RagdollPhysicsRig(deps);
        
        const hipsBody = makeMockBody({ x: 0, y: 0, z: 0 });
        const spineBody = makeMockBody({ x: 0, y: 0.5, z: 0 });
        rigidBodiesMap.set('Hips', hipsBody);
        rigidBodiesMap.set('Spine', spineBody);

        rig.setupJoints();

        expect(mockWorld.createImpulseJoint).toHaveBeenCalled();
    });

    it('syncPhysicsWithBones should drive physics when not in ragdoll mode', () => {
        const rig = new RagdollPhysicsRig(deps);
        isRagdollMode = false;

        const headBody = makeMockBody();
        rigidBodiesMap.set('Head', headBody);

        const headBone = new THREE.Bone();
        headBone.name = 'Head';
        boneRigidBodyMap.set('Head', headBone);

        rig.syncPhysicsWithBones();

        expect(headBody.setNextKinematicTranslation).toHaveBeenCalled();
        expect(headBody.setNextKinematicRotation).toHaveBeenCalled();
    });

    it('syncPhysicsWithBones should drive bones when in ragdoll mode', () => {
        const rig = new RagdollPhysicsRig(deps);
        isRagdollMode = true;
        showDebug = true;

        const parentBone = new THREE.Bone();
        parentBone.name = 'Spine';
        const headBone = new THREE.Bone();
        headBone.name = 'Head';
        parentBone.add(headBone);
        
        boneRigidBodyMap.set('Head', headBone);
        boneRigidBodyMap.set('Spine', parentBone);

        const headBody = makeMockBody({ x: 10, y: 20, z: 30 });
        const spineBody = makeMockBody({ x: 5, y: 5, z: 5 });
        rigidBodiesMap.set('Head', headBody);
        rigidBodiesMap.set('Spine', spineBody);

        const debugMesh = new THREE.Mesh();
        debugMeshMap.set('Head', debugMesh);

        rig.syncPhysicsWithBones();

        expect(headBone.position.x).toBe(10);
        expect(debugMesh.position.x).toBe(10);
    });
});
