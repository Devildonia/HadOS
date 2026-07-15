/**
 * CHARACTERIZATION TESTS: Ragdoll3DCore — Fase 0 (red de seguridad)
 *
 * Bloquean el comportamiento observable de la clase base ANTES de extraer sus
 * colaboradores (física, interacción, bocadillo, reacciones de caída).
 *
 * Restricción del refactor (acordada): la superficie `protected` que consumen
 * las subclases (Desktop/Viewer/AI) NO cambia. Estos tests operan sobre una
 * subclase de prueba que inyecta estado simulado y llama a los métodos
 * `protected` vía cast a `any`, tal como haría el motor real.
 *
 * RAPIER se mockea (sin WASM). THREE se usa real (solo matemáticas de vectores;
 * nunca se construye WebGLRenderer).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as THREE from 'three';
import { Services } from '../js/core/ServiceContainer';

// ── Mock de RAPIER (evita cargar WASM) ──────────────────────────────────────
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

import { Ragdoll3DCore } from '../js/core/Ragdoll3DCore';

// ── Subclase de prueba: implementa los abstractos con no-ops ─────────────────
class TestRagdoll extends Ragdoll3DCore {
    public async initAsync(): Promise<void> { /* no-op */ }
    protected setupThreeJS(): void { /* no-op */ }
    protected onModelLoaded(): void { /* no-op */ }
}

// ── Factories de mocks Rapier ───────────────────────────────────────────────
function makeBody(pos = { x: 0, y: 0, z: 0 }, vel = { x: 0, y: 0, z: 0 }) {
    return {
        setTranslation: vi.fn(), setRotation: vi.fn(),
        setLinvel: vi.fn(), setAngvel: vi.fn(),
        setBodyType: vi.fn(), resetForces: vi.fn(), resetTorques: vi.fn(),
        setNextKinematicTranslation: vi.fn(), setNextKinematicRotation: vi.fn(),
        translation: vi.fn(() => pos),
        rotation: vi.fn(() => ({ x: 0, y: 0, z: 0, w: 1 })),
        linvel: vi.fn(() => vel),
        wakeUp: vi.fn(),
    };
}

function makeBone(name: string) {
    const bone: any = new THREE.Bone();
    bone.name = name;
    bone.getWorldPosition = vi.fn((v: THREE.Vector3) => { v.set(0, 1, 0); return v; });
    bone.getWorldQuaternion = vi.fn((q: THREE.Quaternion) => { q.set(0, 0, 0, 1); return q; });
    return bone;
}

function makeWorld() {
    return {
        step: vi.fn(),
        free: vi.fn(),
        createRigidBody: vi.fn(() => makeBody()),
        createCollider: vi.fn(),
        createImpulseJoint: vi.fn(() => ({ __joint: true })),
        removeImpulseJoint: vi.fn(),
        removeRigidBody: vi.fn(),
    };
}

let r: any;

beforeEach(() => {
    r = new TestRagdoll();
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});

// ── setRagdollMode ──────────────────────────────────────────────────────────
describe('Ragdoll3DCore (caracterización) — setRagdollMode', () => {
    beforeEach(() => {
        const hips = makeBody();
        const head = makeBody();
        r.rigidBodies = new Map([['Hips', hips], ['Head', head]]);
        r.boneRigidBodyMap = new Map([['Hips', makeBone('Hips')], ['Head', makeBone('Head')]]);
        r.mixer = { stopAllAction: vi.fn() };
    });

    it('activar teletransporta cada cuerpo a la pose del hueso y lo pone Dynamic', () => {
        r.setRagdollMode(true);
        const hips = r.rigidBodies.get('Hips');
        expect(hips.setTranslation).toHaveBeenCalled();
        expect(hips.setRotation).toHaveBeenCalled();
        expect(hips.setLinvel).toHaveBeenCalledWith({ x: 0, y: 0, z: 0 }, false);
        expect(hips.setBodyType).toHaveBeenCalledWith('Dynamic', true);
        expect(r.mixer.stopAllAction).toHaveBeenCalled();
    });

    it('desactivar pone cada cuerpo KinematicPositionBased', () => {
        r.setRagdollMode(true);
        r.setRagdollMode(false);
        const hips = r.rigidBodies.get('Hips');
        expect(hips.setBodyType).toHaveBeenLastCalledWith('Kinematic', true);
    });

    it('es idempotente: repetir el mismo modo no re-aplica', () => {
        r.setRagdollMode(true);
        const hips = r.rigidBodies.get('Hips');
        hips.setBodyType.mockClear();
        r.setRagdollMode(true);
        expect(hips.setBodyType).not.toHaveBeenCalled();
    });
});

// ── syncPhysicsWithBones (rama kinemática) ──────────────────────────────────
describe('Ragdoll3DCore (caracterización) — syncPhysicsWithBones', () => {
    it('en modo animación empuja la pose del hueso al cuerpo kinemático', () => {
        const body = makeBody();
        const bone = makeBone('Hips');
        r.rigidBodies = new Map([['Hips', body]]);
        r.boneRigidBodyMap = new Map([['Hips', bone]]);
        r.isRagdollMode = false;

        r.syncPhysicsWithBones();

        expect(bone.getWorldPosition).toHaveBeenCalled();
        expect(body.setNextKinematicTranslation).toHaveBeenCalled();
        expect(body.setNextKinematicRotation).toHaveBeenCalled();
    });
});

// ── checkFallDamage ─────────────────────────────────────────────────────────
describe('Ragdoll3DCore (caracterización) — checkFallDamage', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        r.audioManager = { play: vi.fn() };
        r.model = { position: { set: vi.fn() } };
        r.isRagdollMode = true;
        r.grabbedBody = null;
    });

    it('marca isFalling cuando la cabeza supera velocidad 4', () => {
        const head = makeBody({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });
        r.rigidBodies = new Map([['Head', head]]);
        r.checkFallDamage();
        expect(r.isFalling).toBe(true);
    });

    it('aterrizaje SUAVE (caída horizontal) reproduce boing atenuado y programa levantarse', () => {
        // 1) caída rápida pero horizontal (vel.y ~ 0 durante toda la caída)
        const head = makeBody({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });
        const hips = makeBody({ x: 2, y: 0, z: 3 });
        r.rigidBodies = new Map([['Head', head], ['Hips', hips]]);
        r.checkFallDamage();
        expect(r.isFalling).toBe(true);

        // 2) se detiene (speed < 0.5): pico vertical bajo ⇒ boing atenuado (soft)
        head.linvel = vi.fn(() => ({ x: 0.1, y: 0.1, z: 0 }));
        r.checkFallDamage();
        expect(r.audioManager.play).toHaveBeenCalledWith('boing', { volume: 0.6 });
        expect(r.isFalling).toBe(false);

        // 3) tras 1000ms se sale de ragdoll y se reposiciona el modelo
        const setRagdollSpy = vi.spyOn(r, 'setRagdollMode');
        vi.advanceTimersByTime(1000);
        expect(r.model.position.set).toHaveBeenCalledWith(2, r._modelGroundY, 3);
        expect(setRagdollSpy).toHaveBeenCalledWith(false);
    });

    it('aterrizaje DURO (caída vertical) reproduce ¡Ouch! y háptica heavy', () => {
        const haptics = { heavy: vi.fn(), medium: vi.fn() };
        Services.register('HapticService', haptics as any);
        const saySpy = vi.spyOn(r, 'say');

        // 1) caída vertical rápida — el pico de |vel.y| se captura DURANTE la caída
        const head = makeBody({ x: 0, y: 0, z: 0 }, { x: 0, y: -6, z: 0 });
        const hips = makeBody({ x: 0, y: 0, z: 0 });
        r.rigidBodies = new Map([['Head', head], ['Hips', hips]]);
        r.checkFallDamage();

        // 2) se detiene: como el pico vertical superó el umbral ⇒ reacción dura
        head.linvel = vi.fn(() => ({ x: 0, y: 0.1, z: 0 }));
        r.checkFallDamage();

        expect(r.audioManager.play).toHaveBeenCalledWith('boing'); // sin atenuar
        expect(haptics.heavy).toHaveBeenCalled();
        const i18nService = Services.get('i18n') as any;
        const expectedOuch = i18nService ? i18nService.t('ragdoll.hurt.ouch') : '¡Ouch!';
        expect(saySpy).toHaveBeenCalledWith(expectedOuch, 2000);

        Services.register('HapticService', undefined as any);
    });
});

// ── say / bocadillo ─────────────────────────────────────────────────────────
describe('Ragdoll3DCore (caracterización) — say', () => {
    it('sin bubbleAnimator no lanza y no muestra nada', () => {
        r.bubbleAnimator = null;
        expect(() => r.say('hola')).not.toThrow();
        expect(r.showBubble).toBe(false);
    });

    it('con bubbleAnimator escribe el texto y muestra el bocadillo', () => {
        vi.useFakeTimers();
        document.body.innerHTML = `<div id="${r.bubbleId}"></div>`;
        r.bubbleAnimator = { fullBubble: vi.fn() };

        r.say('¡Hola!', 2000);

        const el = document.getElementById(r.bubbleId)!;
        expect(el.textContent).toBe('¡Hola!');
        expect(el.style.display).toBe('block');
        expect(r.bubbleAnimator.fullBubble).toHaveBeenCalled();
        expect(r.showBubble).toBe(true);
    });
});

// ── onMouseUp (lanzamiento) ─────────────────────────────────────────────────
describe('Ragdoll3DCore (caracterización) — onMouseUp (throw)', () => {
    it('libera el joint, quita el anchor y aplica velocidad de lanzamiento', () => {
        const world = makeWorld();
        const grabbed = makeBody({ x: 0, y: 1, z: 0 });
        const hips = makeBody({ x: 0, y: 1, z: 0 });
        r.world = world;
        r.grabbedBody = grabbed;
        r.rigidBodies = new Map([['Hips', hips], ['Grabbed', grabbed]]);
        r.mouseJoint = { __joint: true };
        r.mouseAnchorBody = makeBody();
        // velocidad suficiente para superar el umbral (speed > 0.5)
        r.mouseVelocity = new THREE.Vector3(3, 0, 0);

        r.onMouseUp();

        expect(world.removeImpulseJoint).toHaveBeenCalled();
        expect(world.removeRigidBody).toHaveBeenCalled();
        expect(hips.setLinvel).toHaveBeenCalled();
        expect(r.grabbedBody).toBeNull();
        expect(r.mouseJoint).toBeNull();
        expect(r.mouseAnchorBody).toBeNull();
    });

    it('sin grabbedBody no hace nada', () => {
        const world = makeWorld();
        r.world = world;
        r.grabbedBody = null;
        expect(() => r.onMouseUp()).not.toThrow();
        expect(world.removeImpulseJoint).not.toHaveBeenCalled();
    });
});

// ── terminate (limpieza) ────────────────────────────────────────────────────
describe('Ragdoll3DCore (caracterización) — terminate', () => {
    it('libera el mundo físico y quita los listeners de interacción', () => {
        const world = makeWorld();
        r.world = world;
        r.interactionListenersAttached = true;
        const removeSpy = vi.spyOn(window, 'removeEventListener');

        r.terminate();

        expect(r.isPlaying).toBe(false);
        expect(world.free).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
        expect(r.interactionListenersAttached).toBe(false);
    });
});
