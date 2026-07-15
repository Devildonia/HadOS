import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { Services } from './ServiceContainer.js';

// ============================================
// RAGDOLL INTERACTION CONTROLLER
// Lógica de agarre/arrastre/lanzamiento del ragdoll con el ratón (raycasting,
// joint cinemático de anclaje, velocidad de lanzamiento con falloff).
// Extraído de Ragdoll3DCore. El CICLO de listeners (añadir/quitar en window)
// permanece en el Core; aquí vive solo el CUERPO de los handlers. El Core
// delega onMouseDown/Move/Up hacia esta clase.
// ============================================

export interface IRagdollInteractionDeps {
    getContainer: () => HTMLElement | null;
    getRenderer: () => THREE.WebGLRenderer | undefined;
    getCamera: () => THREE.PerspectiveCamera | undefined;
    getModel: () => THREE.Group | undefined;
    getWorld: () => any;
    getRigidBodies: () => Map<string, any>;
    getDebugMeshMap: () => Map<string, THREE.Mesh>;
    getShowDebug: () => boolean;
    getAudioManager: () => any;
    getGrabbedBody: () => any;
    setGrabbedBody: (value: any) => void;
    getMouseAnchorBody: () => RAPIER.RigidBody | null;
    setMouseAnchorBody: (value: RAPIER.RigidBody | null) => void;
    getMouseJoint: () => RAPIER.ImpulseJoint | null;
    setMouseJoint: (value: RAPIER.ImpulseJoint | null) => void;
    getMouseVelocity: () => THREE.Vector3;
    setRagdollMode: (value: boolean) => void;
    onRagdollGrabbed: () => void;
    say: (text: string, duration?: number) => void;
}

export class RagdollInteractionController {
    private static readonly _scratchVec3A = new THREE.Vector3();
    private static readonly _scratchVec3B = new THREE.Vector3();

    private readonly raycaster: THREE.Raycaster = new THREE.Raycaster();
    private readonly mouse: THREE.Vector2 = new THREE.Vector2();
    private readonly interactionPlane: THREE.Plane = new THREE.Plane();
    private readonly grabOffset: THREE.Vector3 = new THREE.Vector3();
    private readonly lastMousePos: THREE.Vector3 = new THREE.Vector3();
    private _lastMouseMoveTime: number = 0;

    constructor(private readonly deps: IRagdollInteractionDeps) {}

    public onMouseDown(event: MouseEvent): void {
        const container = this.deps.getContainer();
        const renderer = this.deps.getRenderer();
        const camera = this.deps.getCamera();
        if (!container || !renderer || !camera) return;

        const rect = container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, camera);

        let targetBoneName: string | null = null;
        let intersectPoint = new THREE.Vector3();

        if (this.deps.getShowDebug()) {
            const debugMeshes = Array.from(this.deps.getDebugMeshMap().values());
            const intersects = this.raycaster.intersectObjects(debugMeshes, false);
            const firstHit = intersects[0];
            if (firstHit) {
                targetBoneName = firstHit.object.userData.boneName;
                intersectPoint = firstHit.point;
            }
        }

        const model = this.deps.getModel();
        if (!targetBoneName && model) {
            const intersects = this.raycaster.intersectObject(model, true);
            const hit = intersects[0];
            if (hit) {
                intersectPoint = hit.point;

                let closestDist = Infinity;
                this.deps.getRigidBodies().forEach((body, name) => {
                    const translation = body.translation();
                    const bodyPos = new THREE.Vector3(translation.x, translation.y, translation.z);
                    const dist = bodyPos.distanceTo(intersectPoint);
                    if (dist < closestDist) {
                        closestDist = dist;
                        targetBoneName = name;
                    }
                });
            }
        }

        if (targetBoneName) {
            const grabbed = this.deps.getRigidBodies().get(targetBoneName);
            this.deps.setGrabbedBody(grabbed);
            if (grabbed) {
                this.deps.setRagdollMode(true);

                // Do NOT set body to kinematic, keep it dynamic so momentum works
                const planeNormal = new THREE.Vector3();
                camera.getWorldDirection(planeNormal);
                planeNormal.negate();
                this.interactionPlane.setFromNormalAndCoplanarPoint(planeNormal, intersectPoint);

                const translation = grabbed.translation();
                const bodyPos = new THREE.Vector3(translation.x, translation.y, translation.z);
                this.grabOffset.subVectors(bodyPos, intersectPoint);

                // Create a kinematic anchor at the exact intersection point
                const world = this.deps.getWorld();
                const anchorDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(intersectPoint.x, intersectPoint.y, intersectPoint.z);
                const anchorBody = world.createRigidBody(anchorDesc);
                this.deps.setMouseAnchorBody(anchorBody);

                // Tie the dynamic grabbed body to this anchor using a spherical joint
                const localAnchorInBody = { x: -this.grabOffset.x, y: -this.grabOffset.y, z: -this.grabOffset.z };
                const localAnchorInMouse = { x: 0, y: 0, z: 0 };
                const jointData = RAPIER.JointData.spherical(localAnchorInBody, localAnchorInMouse);
                this.deps.setMouseJoint(world.createImpulseJoint(jointData, grabbed, anchorBody, true));

                this.lastMousePos.copy(intersectPoint);
                this.deps.getMouseVelocity().set(0, 0, 0);
                this._lastMouseMoveTime = 0; // reset para que el primer delta sea limpio

                const audio = this.deps.getAudioManager();
                if (audio) audio.play('wii');
                this.deps.onRagdollGrabbed();
            }
        }
    }

    public onMouseMove(event: MouseEvent): void {
        const grabbed = this.deps.getGrabbedBody();
        const anchor = this.deps.getMouseAnchorBody();
        const camera = this.deps.getCamera();
        const container = this.deps.getContainer();
        if (!grabbed || !anchor || !camera || !container) return;

        const rect = container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, camera);
        const pos = RagdollInteractionController._scratchVec3A;
        const hit = this.raycaster.ray.intersectPlane(this.interactionPlane, pos);
        if (!hit) return;

        const now = performance.now();
        const dt = this._lastMouseMoveTime > 0
            ? Math.min((now - this._lastMouseMoveTime) / 1000, 0.05)
            : 0.016;
        this._lastMouseMoveTime = now;

        if (dt > 0) {
            const rawVel = RagdollInteractionController._scratchVec3B
                .subVectors(pos, this.lastMousePos)
                .divideScalar(dt);
            // lerp 0.7: más responsivo que 0.4, evita que lanzamientos rápidos
            // queden amortiguados por el suavizado
            this.deps.getMouseVelocity().lerp(rawVel, 0.7);
        }
        this.lastMousePos.copy(pos);

        anchor.setNextKinematicTranslation(pos);
        this.deps.getRigidBodies().forEach(body => body.wakeUp());
    }

    public onMouseUp(): void {
        const grabbed = this.deps.getGrabbedBody();
        const world = this.deps.getWorld();
        if (!grabbed || !world) return;

        grabbed.wakeUp();

        const joint = this.deps.getMouseJoint();
        if (joint) {
            world.removeImpulseJoint(joint, true);
            this.deps.setMouseJoint(null);
        }
        const anchor = this.deps.getMouseAnchorBody();
        if (anchor) {
            world.removeRigidBody(anchor);
            this.deps.setMouseAnchorBody(null);
        }

        const mem = Services.get('RagdollMemory');
        if (mem) mem.recordDrop();

        // Aplicar velocidad de lanzamiento solo si el usuario realmente arrastró.
        // Si mouseVelocity es casi cero (soltó sin mover), no aplicar nada —
        // dejar que la gravedad tome el control sin interferencia.
        const throwVel = this.deps.getMouseVelocity().clone().multiplyScalar(1.5);
        const speed = throwVel.length();

        if (speed > 0.5) {
            const hipsBody = this.deps.getRigidBodies().get('Hips');
            const hipsPos = hipsBody
                ? new THREE.Vector3(
                    hipsBody.translation().x,
                    hipsBody.translation().y,
                    hipsBody.translation().z
                )
                : new THREE.Vector3();

            this.deps.getRigidBodies().forEach((body) => {
                const t = body.translation();
                const dist = new THREE.Vector3(t.x, t.y, t.z).distanceTo(hipsPos);
                const falloff = Math.max(0.6, 1.0 - dist * 0.08);
                body.setLinvel(
                    { x: throwVel.x * falloff, y: throwVel.y * falloff, z: throwVel.z * falloff },
                    true
                );
                body.wakeUp();
            });

            if (speed > 4) {
                const audio = this.deps.getAudioManager();
                if (audio) audio.play('scream', { volume: 0.4 });
                this.deps.say('¡AHHHH!', 2000);
                const memHurt = Services.get('RagdollMemory');
                if (memHurt) memHurt.recordHurt();
            }
        }

        this._lastMouseMoveTime = 0;
        this.deps.getMouseVelocity().set(0, 0, 0);
        this.deps.setGrabbedBody(null);
    }
}
