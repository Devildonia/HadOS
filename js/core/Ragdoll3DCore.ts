import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { Services } from './ServiceContainer';
import { RagdollPhysicsRig } from './RagdollPhysicsRig';
import { RagdollSpeech } from './RagdollSpeech';
import { RagdollFallReactions } from './RagdollFallReactions';
import { RagdollInteractionController } from './RagdollInteractionController';

// ============================================
// RAGDOLL 3D CORE — coordinador
// Orquesta escena/render loop, carga del modelo y ciclo de vida. La física,
// la interacción con el ratón, el bocadillo de diálogo y las reacciones de
// caída viven en colaboradores dedicados (composición). El Core mantiene el
// estado `protected` y las firmas que consumen las subclases (Desktop/Viewer/
// AI) y delega en los colaboradores: la superficie pública NO cambia.
// ============================================

export abstract class Ragdoll3DCore {
    protected container: HTMLElement | null = null;

    // Three.js
    protected scene!: THREE.Scene;
    protected camera!: THREE.PerspectiveCamera;
    protected renderer!: THREE.WebGLRenderer;
    protected mixer!: THREE.AnimationMixer;
    protected actions: Record<string, THREE.AnimationAction> = {};
    protected activeAction!: THREE.AnimationAction;
    protected lastTime: number = 0;
    protected physicsAccumulator: number = 0;
    protected readonly FIXED_TIMESTEP: number = 1 / 60;
    protected model!: THREE.Group;

    protected grabbedBody: any = null;
    protected isRagdollMode: boolean = false;
    protected mouseVelocity: THREE.Vector3 = new THREE.Vector3();
    protected mouseAnchorBody: RAPIER.RigidBody | null = null;
    protected mouseJoint: RAPIER.ImpulseJoint | null = null;
    protected modelScale: number = 1.0;
    protected isFalling: boolean = false;
    /** Lista cacheada de todos los SkinnedMesh del modelo — evita traverse() por frame */
    protected _skinnedMeshes: THREE.SkinnedMesh[] = [];
    /** Y inicial del model.position en bind pose — nunca debe cambiar durante el drag */
    protected _modelGroundY: number = 0;

    // External Services
    protected audioManager: any = null;
    protected bubbleAnimator: any = null;
    protected messageLibrary: any = null;
    protected showBubble: boolean = false;
    protected bubbleTimeout: any = null;
    protected standUpTimeout: ReturnType<typeof setTimeout> | null = null;
    protected bubbleId: string = 'ragdoll-3d-bubble';

    /**
     * Owner key for every ResourceManager registration this instance makes
     * (WebGL renderer, listeners…). It MUST be unique per instance: the desktop
     * pet and the "Ragdoll Workshop" viewer both derive from this class, and a
     * shared key would make closing one dispose the other's WebGL context.
     * Subclasses override it in their constructor.
     */
    protected resourceOwner: string = 'ragdoll3d';

    protected readonly ANIM_MAP: Record<string, string> = {
        'Confident_Strut': 'Baile_1',
        'Fall_Dead_from_Abdom': 'Stand_Pose',
        'Hip_Hop_Dance_3': 'Saludo',
        'Hop_with_Arms_Raised': 'Correr',
        'Running': 'Hablar',
        'Stand_Talking_Angry': 'Hablar_2',
        'Stand_Up1': 'Caminar',
        'Superlove_Pop_Dance': 'Tumbarse',
        'Talk_with_Hands_Open': 'Caminar_2',
        'Talk_with_Left_Hand_on': 'Caerse',
        'Walking': 'Baile_2',
        'Wave_for_Help': 'Saltar',
        'sleep': 'Levantarse'
    };

    // Rapier physics
    protected world: any;
    protected rigidBodies: Map<string, any> = new Map();
    protected boneRigidBodyMap: Map<string, THREE.Bone> = new Map();

    // Debug
    protected debugMeshMap: Map<string, THREE.Mesh> = new Map();
    protected showDebug: boolean = false;

    protected isPlaying: boolean = false;
    protected animationFrameId: number = 0;
    protected interactionListenersAttached: boolean = false;
    private readonly boundOnMouseDown = (event: MouseEvent): void => this.onMouseDown(event);
    private readonly boundOnMouseMove = (event: MouseEvent): void => this.onMouseMove(event);
    private readonly boundOnMouseUp = (): void => this.onMouseUp();

    // ── Colaboradores (composición) ─────────────────────────────────────────
    private readonly physicsRig: RagdollPhysicsRig;
    private readonly speech: RagdollSpeech;
    private readonly fallReactions: RagdollFallReactions;
    private readonly interaction: RagdollInteractionController;

    constructor() {
        this.physicsRig = new RagdollPhysicsRig({
            getWorld: () => this.world,
            getScene: () => this.scene,
            getMixer: () => this.mixer,
            getShowDebug: () => this.showDebug,
            getRagdollMode: () => this.isRagdollMode,
            setRagdollMode: (v) => { this.isRagdollMode = v; },
            getRigidBodies: () => this.rigidBodies,
            getBoneRigidBodyMap: () => this.boneRigidBodyMap,
            getDebugMeshMap: () => this.debugMeshMap,
        });

        this.speech = new RagdollSpeech({
            getBubbleAnimator: () => this.bubbleAnimator,
            getBubbleId: () => this.bubbleId,
            getCamera: () => this.camera,
            getContainer: () => this.container,
            getBoneRigidBodyMap: () => this.boneRigidBodyMap,
            getShowBubble: () => this.showBubble,
            setShowBubble: (v) => { this.showBubble = v; },
            getBubbleTimeout: () => this.bubbleTimeout,
            setBubbleTimeout: (v) => { this.bubbleTimeout = v; },
        });

        this.fallReactions = new RagdollFallReactions({
            getRigidBodies: () => this.rigidBodies,
            getRagdollMode: () => this.isRagdollMode,
            getGrabbedBody: () => this.grabbedBody,
            getIsFalling: () => this.isFalling,
            setIsFalling: (v) => { this.isFalling = v; },
            getStandUpTimeout: () => this.standUpTimeout,
            setStandUpTimeout: (v) => { this.standUpTimeout = v; },
            getModel: () => this.model,
            getModelGroundY: () => this._modelGroundY,
            getAudioManager: () => this.audioManager,
            setRagdollMode: (v) => this.setRagdollMode(v),
            fadeToAction: (name) => this.fadeToAction(name),
            say: (text, duration) => this.say(text, duration),
        });

        this.interaction = new RagdollInteractionController({
            getContainer: () => this.container,
            getRenderer: () => this.renderer,
            getCamera: () => this.camera,
            getModel: () => this.model,
            getWorld: () => this.world,
            getRigidBodies: () => this.rigidBodies,
            getDebugMeshMap: () => this.debugMeshMap,
            getShowDebug: () => this.showDebug,
            getAudioManager: () => this.audioManager,
            getGrabbedBody: () => this.grabbedBody,
            setGrabbedBody: (v) => { this.grabbedBody = v; },
            getMouseAnchorBody: () => this.mouseAnchorBody,
            setMouseAnchorBody: (v) => { this.mouseAnchorBody = v; },
            getMouseJoint: () => this.mouseJoint,
            setMouseJoint: (v) => { this.mouseJoint = v; },
            getMouseVelocity: () => this.mouseVelocity,
            setRagdollMode: (v) => this.setRagdollMode(v),
            onRagdollGrabbed: () => this.onRagdollGrabbed(),
            say: (text, duration) => this.say(text, duration),
        });
    }

    public abstract initAsync(): Promise<void>;

    public terminate(): void {
        this.isPlaying = false;
        if (this.container) this.container.style.display = 'none';

        window.removeEventListener('mousedown', this.boundOnMouseDown);
        window.removeEventListener('mousemove', this.boundOnMouseMove);
        window.removeEventListener('mouseup', this.boundOnMouseUp);
        this.interactionListenersAttached = false;

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = 0;
        }
        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.disposeOwner(this.resourceOwner);
        } else if (this.renderer) {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
        }

        if (this.renderer) {
            if (this.container && this.renderer.domElement.parentNode === this.container) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
        if (this.standUpTimeout) {
            clearTimeout(this.standUpTimeout);
            this.standUpTimeout = null;
        }

        // Dispose of model resources
        if (this.model) {
            this.model.traverse((obj: any) => {
                if (obj.isMesh || obj.isSkinnedMesh) {
                    obj.geometry?.dispose();
                    if (obj.material) {
                        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                        materials.forEach((m: any) => {
                            m?.map?.dispose();
                            m?.dispose();
                        });
                    }
                }
            });
        }

        // Dispose of debug mesh resources
        this.debugMeshMap.forEach(mesh => {
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m: any) => m?.dispose());
            } else if (mesh.material) {
                mesh.material.dispose();
            }
        });
        this.debugMeshMap.clear();

        if (this.world) {
            this.world.free();
        }

    }

    protected abstract setupThreeJS(): void;

    protected async loadModelCore(): Promise<void> {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load(
                'games/ragdoll3d/assets/models/Ragdoll_3D.glb',
                (gltf) => {
                    this.model = gltf.scene;
                    this.model.scale.set(this.modelScale, this.modelScale, this.modelScale);
                    this.scene.add(this.model);

                    // Guardar el Y inicial del modelo (bind pose sobre el suelo).
                    // Se usa para restaurar la altura correcta después del drag sin acumular drift.
                    this._modelGroundY = this.model.position.y;

                    this.model.traverse((object: any) => {
                        // frustumCulled=false en TODOS los nodos del grafo, no solo SkinnedMesh.
                        // Three.js projectObject() descarta toda la subjerarquía si un nodo
                        // padre (Group, Armature, Object3D) queda fuera del frustum estático.
                        object.frustumCulled = false;

                        if (object.isMesh || object.isSkinnedMesh) {
                            object.castShadow = true;
                            object.receiveShadow = true;
                            object.userData.isRagdollPart = true;
                        }
                        if (object.isSkinnedMesh) {
                            this._skinnedMeshes.push(object as THREE.SkinnedMesh);
                            const geo = object.geometry as THREE.BufferGeometry;
                            geo.boundingBox = new THREE.Box3(
                                new THREE.Vector3(-1000, -1000, -1000),
                                new THREE.Vector3(1000, 1000, 1000)
                            );
                            geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1000);
                            geo.computeBoundingBox = () => {};
                            geo.computeBoundingSphere = () => {};
                        }
                    });

                    this.mixer = new THREE.AnimationMixer(this.model);
                    this.model.traverse((node: any) => {
                        if (node.isBone) {
                            this.boneRigidBodyMap.set(node.name, node);
                            this.createRigidBodyForBone(node);
                        }
                    });

                    this.setupJoints();

                    gltf.animations.forEach((clip) => {
                        const action = this.mixer.clipAction(clip);
                        this.actions[clip.name] = action;
                    });

                    if (gltf.animations.length > 0) {
                        const firstAnim = gltf.animations[0];
                        if (firstAnim) {
                            const action = this.actions[firstAnim.name];
                            if (action) {
                                this.activeAction = action;
                                this.activeAction.play();
                            }
                        }
                    }

                    this.onModelLoaded();
                    resolve();
                },
                (xhr) => {
                    this.onModelProgress(xhr.loaded / xhr.total);
                },
                (error) => {
                    console.error('[Ragdoll3DCore] GLTF load error', error);
                    reject(error);
                }
            );
        });
    }

    protected abstract onModelLoaded(): void;
    protected onModelProgress(progress: number): void {}

    protected animate = (time: number): void => {
        if (!this.isPlaying) return;

        this.animationFrameId = requestAnimationFrame(this.animate);

        let delta = this.lastTime ? (time - this.lastTime) / 1000 : 0;
        this.lastTime = time;

        // Cap delta to avoid spiral of death
        if (delta > 0.1) delta = 0.1;

        if (this.mixer) this.mixer.update(delta);
        if (this.world) {
            this.physicsAccumulator += delta;
            while (this.physicsAccumulator >= this.FIXED_TIMESTEP) {
                this.onBeforePhysicsStep();
                this.world.step();
                this.physicsAccumulator -= this.FIXED_TIMESTEP;
            }
            this.syncPhysicsWithBones();
            this.checkFallDamage();
        }

        // Garantizar frustumCulled=false usando la lista cacheada — sin traverse() por frame.
        // Necesario antes de renderer.render() porque skeleton.update() dentro del
        // AnimationMixer puede resetear este flag al recalcular el skinning.
        for (let i = 0; i < this._skinnedMeshes.length; i++) {
            const mesh = this._skinnedMeshes[i];
            if (mesh) {
                mesh.frustumCulled = false;
            }
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
            this.updateSpeechBubble();
        }

        this.onAfterRender();
    }

    protected onBeforePhysicsStep(): void {}
    protected onAfterRender(): void {}

    protected fadeToAction(name: string): void {
        const exactKey = Object.keys(this.actions).find(k => k.toLowerCase() === name.toLowerCase()) || name;
        const nextAction = this.actions[exactKey];
        if (!nextAction || nextAction === this.activeAction) return;

        nextAction.reset();
        nextAction.setEffectiveTimeScale(1);
        nextAction.setEffectiveWeight(1);
        nextAction.fadeIn(0.5);
        nextAction.play();

        if (this.activeAction) {
            this.activeAction.fadeOut(0.5);
        }

        this.activeAction = nextAction;
        this.onActionChanged(exactKey);
    }

    protected onActionChanged(exactKey: string): void {}

    // ── Delegación hacia colaboradores (superficie protected preservada) ─────

    protected setRagdollMode(enabled: boolean): void {
        // Transición física → animación: antes de devolver el control al mixer,
        // mover el modelo raíz a donde la física dejó las caderas. Sin esto, el
        // mixer recoloca los huesos relativos al origen del modelo y el personaje
        // "teletransporta" al punto de spawn en vez de levantarse donde cayó.
        // Solo X/Z — la Y se mantiene en _modelGroundY para que no se hunda con
        // cada ciclo de agarre/soltar. Centralizado aquí para que TODOS los
        // caminos de recuperación (IA y RagdollFallReactions) lo apliquen.
        if (!enabled && this.isRagdollMode) {
            const hipsBody = this.rigidBodies.get('Hips');
            if (hipsBody && this.model) {
                const ht = hipsBody.translation();
                this.model.position.set(ht.x, this._modelGroundY, ht.z);
            }
        }
        this.physicsRig.setRagdollMode(enabled);
    }

    protected createRigidBodyForBone(bone: THREE.Bone): void {
        this.physicsRig.createRigidBodyForBone(bone);
    }

    protected setupJoints(): void {
        this.physicsRig.setupJoints();
    }

    protected syncPhysicsWithBones(): void {
        this.physicsRig.syncPhysicsWithBones();
    }

    protected checkFallDamage(): void {
        this.fallReactions.checkFallDamage();
    }

    protected say(text: string, duration: number = 2000): void {
        this.speech.say(text, duration);
    }

    protected updateSpeechBubble(): void {
        this.speech.updateSpeechBubble();
    }

    protected setupInteractionListeners(): void {
        if (!this.container || this.interactionListenersAttached) return;
        window.addEventListener('mousedown', this.boundOnMouseDown);
        window.addEventListener('mousemove', this.boundOnMouseMove);
        window.addEventListener('mouseup', this.boundOnMouseUp);
        this.interactionListenersAttached = true;
    }

    protected onMouseDown(event: MouseEvent): void {
        this.interaction.onMouseDown(event);
    }

    protected onMouseMove(event: MouseEvent): void {
        this.interaction.onMouseMove(event);
    }

    protected onMouseUp(): void {
        this.interaction.onMouseUp();
    }

    protected onRagdollGrabbed(): void {
        const mem = Services.get('RagdollMemory');
        if (mem) mem.recordGrab();
    }
}
