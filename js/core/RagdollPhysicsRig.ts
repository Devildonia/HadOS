import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

// ============================================
// RAGDOLL PHYSICS RIG
// Construye y sincroniza el esqueleto físico Rapier del ragdoll.
// Extraído de Ragdoll3DCore para aislar la responsabilidad de "física".
// Accede al estado mutable del Core mediante dependencias (closures/refs) para
// no romper la superficie `protected` que consumen las subclases: el Core sigue
// exponiendo `world`, `rigidBodies`, `isRagdollMode`, etc. y delega aquí.
// ============================================

export interface IRagdollPhysicsRigDeps {
    getWorld: () => any;
    getScene: () => THREE.Scene;
    getMixer: () => THREE.AnimationMixer | undefined;
    getShowDebug: () => boolean;
    getRagdollMode: () => boolean;
    setRagdollMode: (value: boolean) => void;
    getRigidBodies: () => Map<string, any>;
    getBoneRigidBodyMap: () => Map<string, THREE.Bone>;
    getDebugMeshMap: () => Map<string, THREE.Mesh>;
}

export class RagdollPhysicsRig {
    private static readonly _scratchVector1 = new THREE.Vector3();
    private static readonly _scratchVector2 = new THREE.Vector3();
    private static readonly _scratchVector3 = new THREE.Vector3();
    private static readonly _scratchQuat1 = new THREE.Quaternion();
    private static readonly _scratchQuat2 = new THREE.Quaternion();
    private static readonly _scratchQuat3 = new THREE.Quaternion();

    constructor(private readonly deps: IRagdollPhysicsRigDeps) {}

    public setRagdollMode(enabled: boolean): void {
        if (this.deps.getRagdollMode() === enabled) return;
        this.deps.setRagdollMode(enabled);

        this.deps.getRigidBodies().forEach((body, boneName) => {
            if (enabled) {
                // Antes de activar la física dinámica, teletransportar el cuerpo
                // a la posición exacta del hueso en la animación actual.
                // Sin este snap, Rapier hereda la posición física anterior (puede
                // estar ligeramente bajo el suelo por tunneling previo) y la
                // resolución de penetración empuja en dirección incorrecta.
                const bone = this.deps.getBoneRigidBodyMap().get(boneName);
                if (bone) {
                    const wp = new THREE.Vector3();
                    const wq = new THREE.Quaternion();
                    bone.getWorldPosition(wp);
                    bone.getWorldQuaternion(wq);
                    body.setTranslation({ x: wp.x, y: wp.y, z: wp.z }, false);
                    body.setRotation({ x: wq.x, y: wq.y, z: wq.z, w: wq.w }, false);
                    body.setLinvel({ x: 0, y: 0, z: 0 }, false);
                    body.setAngvel({ x: 0, y: 0, z: 0 }, false);
                }
                body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
                body.resetForces(true);
                body.resetTorques(true);
            } else {
                body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
            }
        });

        const mixer = this.deps.getMixer();
        if (enabled && mixer) {
            mixer.stopAllAction();
        }
    }

    public createRigidBodyForBone(bone: THREE.Bone): void {
        const boneName = bone.name;
        const mainBones = ['Hips', 'Spine', 'Head', 'LeftArm', 'LeftForeArm', 'RightArm', 'RightForeArm', 'LeftUpLeg', 'LeftLeg', 'RightUpLeg', 'RightLeg'];
        if (!mainBones.includes(boneName)) return;

        const world = this.deps.getWorld();
        const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased();

        const tempPos = new THREE.Vector3();
        const tempQuat = new THREE.Quaternion();
        bone.getWorldPosition(tempPos);
        bone.getWorldQuaternion(tempQuat);
        bodyDesc.setTranslation(tempPos.x, tempPos.y, tempPos.z);
        bodyDesc.setRotation({ x: tempQuat.x, y: tempQuat.y, z: tempQuat.z, w: tempQuat.w });

        bodyDesc.setLinearDamping(1.5);
        bodyDesc.setAngularDamping(4.0);
        bodyDesc.setCanSleep(false);
        // CCD (Continuous Collision Detection): evita que los cuerpos rápidos
        // atraviesen el suelo al activarse la física dinámica desde la animación.
        // Sin CCD, colisionadores pequeños (capsule r=0.05) hacen tunneling
        // acumulando un error Y negativo en cada ciclo agarre/soltar.
        bodyDesc.setCcdEnabled(true);
        const body = world.createRigidBody(bodyDesc);

        let colliderDesc;
        let color = 0x00ff00;

        if (boneName === 'Hips' || boneName === 'Spine') {
            colliderDesc = RAPIER.ColliderDesc.cuboid(0.15, 0.1, 0.1);
            color = 0x0000ff;
        } else if (boneName === 'Head') {
            colliderDesc = RAPIER.ColliderDesc.ball(0.12);
            color = 0xff0000;
        } else {
            colliderDesc = RAPIER.ColliderDesc.capsule(0.1, 0.05);
            color = 0x00ff00;
        }

        const collider = world.createCollider(colliderDesc, body);
        collider.setCollisionGroups(0x0002FFFD);

        this.deps.getRigidBodies().set(boneName, body);

        if (this.deps.getShowDebug()) {
            let geometry;
            if (boneName === 'Hips' || boneName === 'Spine') {
                geometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
            } else if (boneName === 'Head') {
                geometry = new THREE.SphereGeometry(0.12);
            } else {
                geometry = new THREE.CapsuleGeometry(0.05, 0.2);
            }
            const material = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.5 });
            const debugMesh = new THREE.Mesh(geometry, material);
            debugMesh.userData.isRagdollPart = true;
            debugMesh.userData.boneName = boneName;

            this.deps.getScene().add(debugMesh);
            this.deps.getDebugMeshMap().set(boneName, debugMesh);
        }
    }

    public setupJoints(): void {
        const world = this.deps.getWorld();
        const hierarchy = [
            { parent: 'Hips', child: 'Spine', limits: { x: [-0.2, 0.2], y: [-0.2, 0.2], z: [-0.2, 0.2] } },
            { parent: 'Spine', child: 'Head', limits: { x: [-0.5, 0.5], y: [-0.5, 0.5], z: [-0.5, 0.5] } },
            { parent: 'Spine', child: 'LeftArm', limits: { x: [-1.5, 0.5], y: [-1.5, 1.5], z: [-1.5, 1.5] } },
            { parent: 'LeftArm', child: 'LeftForeArm', limits: { x: [0, 2.0], y: [0, 0], z: [0, 0] } },
            { parent: 'Spine', child: 'RightArm', limits: { x: [-1.5, 0.5], y: [-1.5, 1.5], z: [-1.5, 1.5] } },
            { parent: 'RightArm', child: 'RightForeArm', limits: { x: [0, 2.0], y: [0, 0], z: [0, 0] } },
            { parent: 'Hips', child: 'LeftUpLeg', limits: { x: [-1.0, 0.5], y: [-0.2, 0.2], z: [-0.5, 0.5] } },
            { parent: 'LeftUpLeg', child: 'LeftLeg', limits: { x: [-2.0, 0], y: [0, 0], z: [0, 0] } },
            { parent: 'Hips', child: 'RightUpLeg', limits: { x: [-1.0, 0.5], y: [-0.2, 0.2], z: [-0.5, 0.5] } },
            { parent: 'RightUpLeg', child: 'RightLeg', limits: { x: [-2.0, 0], y: [0, 0], z: [0, 0] } }
        ];

        hierarchy.forEach(pair => {
            const parentBody = this.deps.getRigidBodies().get(pair.parent);
            const childBody = this.deps.getRigidBodies().get(pair.child);

            if (parentBody && childBody) {
                const parentPos = parentBody.translation();
                const childPos = childBody.translation();

                const pPos = new THREE.Vector3(parentPos.x, parentPos.y, parentPos.z);
                const cPos = new THREE.Vector3(childPos.x, childPos.y, childPos.z);

                // Vector in WORLD space pointing from Parent center to Child center
                const offsetW = new THREE.Vector3().subVectors(cPos, pPos);

                // Get Parent's initial rotation and invert it to move world offset to local space
                const pRotRaw = parentBody.rotation();
                const pRot = new THREE.Quaternion(pRotRaw.x, pRotRaw.y, pRotRaw.z, pRotRaw.w);
                offsetW.applyQuaternion(pRot.invert());

                const anchorInParent = { x: offsetW.x, y: offsetW.y, z: offsetW.z };
                const anchorInChild = { x: 0, y: 0, z: 0 };

                const params = RAPIER.JointData.spherical(anchorInParent, anchorInChild);
                world.createImpulseJoint(params, parentBody, childBody, true);
            }
        });
    }

    public syncPhysicsWithBones(): void {
        const tempPos = RagdollPhysicsRig._scratchVector1;
        const tempQuat = RagdollPhysicsRig._scratchQuat1;
        const isRagdollMode = this.deps.getRagdollMode();
        const showDebug = this.deps.getShowDebug();

        this.deps.getBoneRigidBodyMap().forEach((bone, name) => {
            const body = this.deps.getRigidBodies().get(name);
            if (!body) return;

            if (!isRagdollMode) {
                // Animation drives physics bodies
                bone.getWorldPosition(tempPos);
                bone.getWorldQuaternion(tempQuat);
                body.setNextKinematicTranslation(tempPos);
                body.setNextKinematicRotation(tempQuat);
            } else {
                // Physics drives visual bones
                const translation = body.translation();
                const rotation = body.rotation();

                const parent = bone.parent;
                if (parent) {
                    const worldPos = RagdollPhysicsRig._scratchVector2.set(translation.x, translation.y, translation.z);
                    const worldQuat = RagdollPhysicsRig._scratchQuat2.set(rotation.x, rotation.y, rotation.z, rotation.w);

                    const localPos = RagdollPhysicsRig._scratchVector3.copy(worldPos);
                    parent.worldToLocal(localPos);
                    bone.position.copy(localPos);

                    const parentWorldQuat = RagdollPhysicsRig._scratchQuat3;
                    parent.getWorldQuaternion(parentWorldQuat);

                    const localQuat = worldQuat;
                    parentWorldQuat.invert();
                    localQuat.premultiply(parentWorldQuat);
                    bone.quaternion.copy(localQuat);

                    // Force the matrix update to prevent frustum culling from dropping the mesh
                    bone.updateMatrixWorld(true);
                } else {
                    bone.position.set(translation.x, translation.y, translation.z);
                    bone.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
                    bone.updateMatrixWorld(true);
                }
            }

            if (showDebug) {
                const debugMesh = this.deps.getDebugMeshMap().get(name);
                if (debugMesh) {
                    const translation = body.translation();
                    const rotation = body.rotation();
                    debugMesh.position.set(translation.x, translation.y, translation.z);
                    debugMesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
                }
            }
        });
    }
}
