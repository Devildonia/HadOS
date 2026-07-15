import * as THREE from 'three';
import { Services } from './ServiceContainer.js';

// ============================================
// RAGDOLL FALL REACTIONS
// Detecta impactos de caída y orquesta la reacción (audio, háptica, bocadillo)
// y la secuencia de "levantarse" tras asentarse. Extraído de Ragdoll3DCore.
// Solo lo invoca el bucle de animación del Core; no forma parte de la superficie
// pública consumida por las subclases.
// ============================================

export interface IRagdollFallReactionsDeps {
    getRigidBodies: () => Map<string, any>;
    getRagdollMode: () => boolean;
    getGrabbedBody: () => any;
    getIsFalling: () => boolean;
    setIsFalling: (value: boolean) => void;
    getStandUpTimeout: () => ReturnType<typeof setTimeout> | null;
    setStandUpTimeout: (value: ReturnType<typeof setTimeout> | null) => void;
    getModel: () => THREE.Group | undefined;
    getModelGroundY: () => number;
    getAudioManager: () => any;
    setRagdollMode: (value: boolean) => void;
    fadeToAction: (name: string) => void;
    say: (text: string, duration?: number) => void;
}

/** Umbral de velocidad vertical de impacto (m/s) para considerar la caída "dura". */
const HARD_LANDING_VERTICAL_SPEED = 3;

export class RagdollFallReactions {
    /**
     * Pico de velocidad vertical observado durante la caída en curso. Se mide
     * MIENTRAS el cuerpo cae (no al detenerse) para poder distinguir un golpe
     * fuerte de uno suave: al asentarse la velocidad ya es ~0, así que leer
     * `vel.y` en ese instante nunca reflejaría la dureza del impacto.
     */
    private _peakImpactVerticalSpeed = 0;

    constructor(private readonly deps: IRagdollFallReactionsDeps) {}

    public checkFallDamage(): void {
        const headBody = this.deps.getRigidBodies().get('Head');
        if (!headBody || !this.deps.getRagdollMode() || this.deps.getGrabbedBody()) return;

        const vel = headBody.linvel();
        const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);

        if (speed > 4) {
            this.deps.setIsFalling(true);
        }

        // Rastrear el pico de velocidad vertical durante toda la caída para
        // medir la dureza del impacto antes de que el cuerpo frene.
        if (this.deps.getIsFalling()) {
            this._peakImpactVerticalSpeed = Math.max(this._peakImpactVerticalSpeed, Math.abs(vel.y));
        }

        if (speed < 0.5) {
            if (this.deps.getIsFalling()) {
                this.deps.setIsFalling(false);

                const hardLanding = this._peakImpactVerticalSpeed > HARD_LANDING_VERTICAL_SPEED;
                this._peakImpactVerticalSpeed = 0; // reset para la próxima caída

                const haptics = Services.get('HapticService');
                const audio = this.deps.getAudioManager();
                if (hardLanding) {
                    haptics?.heavy();
                    if (audio) audio.play('boing');
                    const i18nService = Services.get('i18n') as any;
                    this.deps.say(i18nService ? i18nService.t('ragdoll.hurt.ouch') : '¡Ouch!', 2000);
                } else {
                    haptics?.medium();
                    if (audio) audio.play('boing', { volume: 0.6 });
                }
            }

            if (!this.deps.getStandUpTimeout()) {
                this.deps.setStandUpTimeout(setTimeout(() => {
                    this.deps.setStandUpTimeout(null);
                    if (!this.deps.getGrabbedBody() && this.deps.getRagdollMode()) {
                        // El reposicionamiento del modelo raíz a la posición física
                        // de las caderas ahora vive de forma centralizada en
                        // Ragdoll3DCore.setRagdollMode(false), para que todos los
                        // caminos de recuperación (este y el de la IA) lo compartan.
                        this.deps.setRagdollMode(false);
                        this.deps.fadeToAction('sleep');
                    }
                }, 1000));
            }
        } else {
            const pending = this.deps.getStandUpTimeout();
            if (pending) {
                clearTimeout(pending);
                this.deps.setStandUpTimeout(null);
            }
        }
    }
}
