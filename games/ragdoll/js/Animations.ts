/**
 * RAGDOLL SYSTEM - ANIMATIONS
 * Extracted from ragdoll.js
 */

import { ZzzParticle, TearParticle } from './Particles.js';
import type { Stickman } from './Stickman.js';

export interface BasePositions {
    floorY: number;
    baseY: number;
    scale: number;
    headY: number;
    neckY: number;
    chestY: number;
    waistY: number;
}

export interface Pose2D {
    x: number;
    y: number;
}

export interface StickmanPose {
    head?: Pose2D;
    neck?: Pose2D;
    chest?: Pose2D;
    waist?: Pose2D;
    leftShoulder?: Pose2D;
    leftElbow?: Pose2D;
    leftHand?: Pose2D;
    rightShoulder?: Pose2D;
    rightElbow?: Pose2D;
    rightHand?: Pose2D;
    leftHip?: Pose2D;
    leftKnee?: Pose2D;
    leftFoot?: Pose2D;
    rightHip?: Pose2D;
    rightKnee?: Pose2D;
    rightFoot?: Pose2D;
    leftToes?: Pose2D;
    rightToes?: Pose2D;
}

export class Animations {
    /**
     * Helper to get base positions for animations
     */
    static getBasePositions(stickman: Stickman): BasePositions {
        const floorY = stickman.currentFloorY || (window.innerHeight - ((window.CONFIG?.TASKBAR?.HEIGHT as number) || 40));
        const scale = ((window.CONFIG?.RAGDOLL?.SCALE as number) || 1.0) * (stickman.globalScale || 1.0);

        // Offset baseY so that footY (baseY + 12*scale) matches floorY
        const baseY = floorY - 12 * scale;

        return {
            floorY,
            baseY,
            scale,
            headY: baseY - 60 * scale,
            neckY: baseY - 44 * scale,
            chestY: baseY - 30 * scale,
            waistY: baseY - 16 * scale
        };
    }

    static standUp(stickman: Stickman): void {
        const { baseY, scale, headY, neckY, chestY, waistY } = this.getBasePositions(stickman);
        this.setPose(stickman, {
            head: { x: stickman.x, y: headY },
            neck: { x: stickman.x, y: neckY },
            chest: { x: stickman.x, y: chestY },
            waist: { x: stickman.x, y: waistY },
            leftShoulder: { x: stickman.x - 7 * scale, y: baseY - 42 * scale },
            leftElbow: { x: stickman.x - 15 * scale, y: baseY - 30 * scale },
            leftHand: { x: stickman.x - 18 * scale, y: baseY - 20 * scale },
            rightShoulder: { x: stickman.x + 7 * scale, y: baseY - 42 * scale },
            rightElbow: { x: stickman.x + 15 * scale, y: baseY - 30 * scale },
            rightHand: { x: stickman.x + 18 * scale, y: baseY - 20 * scale },
            leftHip: { x: stickman.x - 4 * scale, y: baseY - 14 * scale },
            leftKnee: { x: stickman.x - 7 * scale, y: baseY - 2 * scale },
            leftFoot: { x: stickman.x - 8 * scale, y: baseY + 12 * scale },
            rightHip: { x: stickman.x + 4 * scale, y: baseY - 14 * scale },
            rightKnee: { x: stickman.x + 7 * scale, y: baseY - 2 * scale },
            rightFoot: { x: stickman.x + 8 * scale, y: baseY + 12 * scale }
        });
    }

    static setPose(stickman: Stickman, pose: StickmanPose): void {
        for (const part in pose) {
            const key = part as keyof StickmanPose;
            if (stickman.parts[key]) {
                const bodyPart = stickman.parts[key]!;
                const posePart = pose[key]!;
                stickman.ragdollPet.Body.setPosition(bodyPart, posePart);
                stickman.ragdollPet.Body.setVelocity(bodyPart, { x: 0, y: 0 });
                stickman.ragdollPet.Body.setAngle(bodyPart, 0);
            }
        }

        // Auto-update toes if feet are moved but toes aren't in pose
        const scale = ((window.CONFIG?.RAGDOLL?.SCALE as number) || 1.0) * (stickman.globalScale || 1.0);
        if (pose.leftFoot && !pose.leftToes && stickman.parts.leftToes) {
            stickman.ragdollPet.Body.setPosition(stickman.parts.leftToes, {
                x: pose.leftFoot.x - 8 * scale,
                y: pose.leftFoot.y
            });
        }
        if (pose.rightFoot && !pose.rightToes && stickman.parts.rightToes) {
            stickman.ragdollPet.Body.setPosition(stickman.parts.rightToes, {
                x: pose.rightFoot.x + 8 * scale,
                y: pose.rightFoot.y
            });
        }
    }

    static animateStandingCycle(stickman: Stickman): void {
        const { baseY, scale, headY, neckY, chestY, waistY } = this.getBasePositions(stickman);

        if (stickman.state === 'jumping') {
            this.animateJumping(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'sitting') {
            this.animateSitting(stickman, baseY, scale);
        } else if (stickman.state === 'dancing') {
            this.animateDancing(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'walking' || stickman.state === 'scared') {
            this.animateWalking(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'sleeping') {
            this.animateSleeping(stickman, baseY, scale);
        } else if (stickman.state === 'laughing') {
            this.animateLaughing(stickman, baseY, scale);
        } else if (stickman.state === 'eating') {
            this.animateEating(stickman, baseY, scale);
        } else if (stickman.state === 'crying') {
            this.animateCrying(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'waving') {
            this.animateWaving(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'backflip') {
            this.animateBackflip(stickman, baseY, scale);
        } else if (stickman.state === 'moonwalk') {
            this.animateMoonwalk(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'yawning') {
            this.animateYawning(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'stretching') {
            this.animateStretching(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else if (stickman.state === 'watching' || stickman.state === 'looking-up') {
            this.animateWatching(stickman, headY, neckY, chestY, waistY, baseY, scale);
        } else {
            this.animateIdle(stickman, headY, neckY, chestY, waistY, baseY, scale);
        }
    }

    // --- Animation Implementation Methods (Internal update) ---

    static animateJumping(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const jumpTime = Date.now() - stickman.animationStartTime;
        const jumpProgress = jumpTime / ((window.CONFIG?.RAGDOLL?.JUMP_DURATION as number) || 1000);
        const jumpHeight = Math.sin(jumpProgress * Math.PI) * ((window.CONFIG?.RAGDOLL?.JUMP_HEIGHT as number) || 60);
        const currentBaseY = baseY - jumpHeight;

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY - jumpHeight },
            neck: { x: stickman.x, y: neckY - jumpHeight },
            chest: { x: stickman.x, y: chestY - jumpHeight },
            waist: { x: stickman.x, y: waistY - jumpHeight },
            leftShoulder: { x: stickman.x - 7 * scale, y: currentBaseY - 42 * scale },
            leftElbow: { x: stickman.x - 15 * scale, y: currentBaseY - 50 * scale },
            leftHand: { x: stickman.x - 20 * scale, y: currentBaseY - 60 * scale },
            rightShoulder: { x: stickman.x + 7 * scale, y: currentBaseY - 42 * scale },
            rightElbow: { x: stickman.x + 15 * scale, y: currentBaseY - 50 * scale },
            rightHand: { x: stickman.x + 20 * scale, y: currentBaseY - 60 * scale },
            leftHip: { x: stickman.x - 4 * scale, y: currentBaseY - 14 * scale },
            leftKnee: { x: stickman.x - 7 * scale, y: currentBaseY - 2 * scale },
            leftFoot: { x: stickman.x - 8 * scale, y: currentBaseY + 12 * scale },
            rightHip: { x: stickman.x + 4 * scale, y: currentBaseY - 14 * scale },
            rightKnee: { x: stickman.x + 7 * scale, y: currentBaseY - 2 * scale },
            rightFoot: { x: stickman.x + 8 * scale, y: currentBaseY + 12 * scale }
        });
    }

    static animateSitting(stickman: Stickman, baseY: number, scale: number): void {
        this.setPose(stickman, {
            head: { x: stickman.x, y: baseY - 35 * scale },
            neck: { x: stickman.x, y: baseY - 24 * scale },
            chest: { x: stickman.x, y: baseY - 15 * scale },
            waist: { x: stickman.x, y: baseY - 5 * scale },
            leftShoulder: { x: stickman.x - 7 * scale, y: baseY - 20 * scale },
            leftElbow: { x: stickman.x - 12 * scale, y: baseY - 10 * scale },
            leftHand: { x: stickman.x - 15 * scale, y: baseY },
            rightShoulder: { x: stickman.x + 7 * scale, y: baseY - 20 * scale },
            rightElbow: { x: stickman.x + 12 * scale, y: baseY - 10 * scale },
            rightHand: { x: stickman.x + 15 * scale, y: baseY },
            leftHip: { x: stickman.x - 4 * scale, y: baseY - 2 * scale },
            leftKnee: { x: stickman.x - 10 * scale, y: baseY + 5 * scale },
            leftFoot: { x: stickman.x - 4 * scale, y: baseY + 10 * scale },
            rightHip: { x: stickman.x + 4 * scale, y: baseY - 2 * scale },
            rightKnee: { x: stickman.x + 10 * scale, y: baseY + 5 * scale },
            rightFoot: { x: stickman.x + 4 * scale, y: baseY + 10 * scale }
        });
    }

    static animateDancing(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const danceTime = (Date.now() - stickman.animationStartTime) / 1000;
        const danceBounce = Math.sin(danceTime * 8) * 10;
        const danceSwing = Math.sin(danceTime * 6) * 15;

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY - Math.abs(danceBounce) },
            neck: { x: stickman.x, y: neckY - Math.abs(danceBounce) },
            chest: { x: stickman.x, y: chestY - Math.abs(danceBounce) },
            waist: { x: stickman.x, y: waistY - Math.abs(danceBounce) },
            leftShoulder: { x: stickman.x - 7 * scale, y: (baseY - 42 * scale) - Math.abs(danceBounce) },
            leftElbow: { x: stickman.x - 7 * scale + danceSwing, y: (baseY - 50 * scale) - Math.abs(danceBounce) },
            leftHand: { x: stickman.x - 7 * scale + danceSwing * 1.5, y: (baseY - 55 * scale) - Math.abs(danceBounce) },
            rightShoulder: { x: stickman.x + 7 * scale, y: (baseY - 42 * scale) - Math.abs(danceBounce) },
            rightElbow: { x: stickman.x + 7 * scale - danceSwing, y: (baseY - 50 * scale) - Math.abs(danceBounce) },
            rightHand: { x: stickman.x + 7 * scale - danceSwing * 1.5, y: (baseY - 55 * scale) - Math.abs(danceBounce) },
            leftHip: { x: stickman.x - 4 * scale, y: (baseY - 14 * scale) - Math.abs(danceBounce) },
            leftKnee: { x: stickman.x - 7 * scale, y: (baseY - 2 * scale) - Math.abs(danceBounce) },
            leftFoot: { x: stickman.x - 8 * scale, y: baseY + 12 * scale },
            rightHip: { x: stickman.x + 4 * scale, y: (baseY - 14 * scale) - Math.abs(danceBounce) },
            rightKnee: { x: stickman.x + 7 * scale, y: (baseY - 2 * scale) - Math.abs(danceBounce) },
            rightFoot: { x: stickman.x + 8 * scale, y: baseY + 12 * scale }
        });
    }

    static animateSleeping(stickman: Stickman, baseY: number, scale: number): void {
        this.setPose(stickman, {
            head: { x: stickman.x - 20 * scale, y: baseY + 5 * scale },
            neck: { x: stickman.x - 12 * scale, y: baseY + 8 * scale },
            chest: { x: stickman.x, y: baseY + 10 * scale },
            waist: { x: stickman.x + 12 * scale, y: baseY + 10 * scale },
            leftShoulder: { x: stickman.x - 5 * scale, y: baseY + 8 * scale },
            leftElbow: { x: stickman.x - 8 * scale, y: baseY + 5 * scale },
            leftHand: { x: stickman.x - 15 * scale, y: baseY + 2 * scale },
            rightShoulder: { x: stickman.x + 5 * scale, y: baseY + 12 * scale },
            rightElbow: { x: stickman.x + 10 * scale, y: baseY + 12 * scale },
            rightHand: { x: stickman.x + 15 * scale, y: baseY + 10 * scale },
            leftHip: { x: stickman.x + 15 * scale, y: baseY + 8 * scale },
            leftKnee: { x: stickman.x + 18 * scale, y: baseY + 2 * scale },
            leftFoot: { x: stickman.x + 15 * scale, y: baseY - 2 * scale },
            rightHip: { x: stickman.x + 15 * scale, y: baseY + 12 * scale },
            rightKnee: { x: stickman.x + 20 * scale, y: baseY + 8 * scale },
            rightFoot: { x: stickman.x + 22 * scale, y: baseY + 4 * scale }
        });

        if (Date.now() - stickman.lastZzzTime > ((window.CONFIG?.RAGDOLL?.SLEEPING_ZZZ_INTERVAL as number) || 2000)) {
            const headPart = stickman.parts.head;
            if (headPart) {
                const zzzX = headPart.position.x + 5;
                const zzzY = headPart.position.y - 10;
                stickman.sleepingZzzParticles.push(new ZzzParticle(zzzX, zzzY));
                stickman.lastZzzTime = Date.now();
            }
        }
    }

    static animateLaughing(stickman: Stickman, baseY: number, scale: number): void {
        const shakeIntensity = (window.CONFIG?.RAGDOLL?.LAUGHING_INTENSITY as number) || 5;
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity * 0.5;

        stickman.laughingShakeOffset = { x: shakeX, y: shakeY };

        this.setPose(stickman, {
            head: { x: stickman.x + shakeX, y: baseY - 45 * scale + shakeY },
            neck: { x: stickman.x + shakeX, y: baseY - 36 * scale + shakeY },
            chest: { x: stickman.x + shakeX, y: baseY - 25 * scale + shakeY },
            waist: { x: stickman.x + shakeX, y: baseY - 14 * scale + shakeY },
            leftShoulder: { x: stickman.x - 7 * scale + shakeX, y: baseY - 34 * scale + shakeY },
            leftElbow: { x: stickman.x - 5 * scale + shakeX, y: baseY - 24 * scale + shakeY },
            leftHand: { x: stickman.x - 2 * scale + shakeX, y: baseY - 18 * scale + shakeY },
            rightShoulder: { x: stickman.x + 7 * scale + shakeX, y: baseY - 34 * scale + shakeY },
            rightElbow: { x: stickman.x + 5 * scale + shakeX, y: baseY - 24 * scale + shakeY },
            rightHand: { x: stickman.x + 2 * scale + shakeX, y: baseY - 18 * scale + shakeY }
        });
    }

    static animateEating(stickman: Stickman, baseY: number, scale: number): void {
        const eatTime = Date.now() - stickman.animationStartTime;
        const handMovement = Math.sin((eatTime / ((window.CONFIG?.RAGDOLL?.EATING_BITE_INTERVAL as number) || 500)) * Math.PI * 2) * 8;

        this.setPose(stickman, {
            head: { x: stickman.x, y: baseY - 35 * scale },
            neck: { x: stickman.x, y: baseY - 24 * scale },
            chest: { x: stickman.x, y: baseY - 15 * scale },
            waist: { x: stickman.x, y: baseY - 5 * scale },
            rightShoulder: { x: stickman.x + 7 * scale, y: baseY - 20 * scale },
            rightElbow: { x: stickman.x + 10 * scale, y: baseY - 30 * scale - handMovement },
            rightHand: { x: stickman.x + 5 * scale, y: baseY - 38 * scale - handMovement },
            leftShoulder: { x: stickman.x - 7 * scale, y: baseY - 20 * scale },
            leftElbow: { x: stickman.x - 12 * scale, y: baseY - 10 * scale },
            leftHand: { x: stickman.x - 15 * scale, y: baseY }
        });

        if (Date.now() - stickman.lastBiteTime > ((window.CONFIG?.RAGDOLL?.EATING_BITE_INTERVAL as number) || 500)) {
            stickman.ragdollPet.audioManager?.play('eat');
            stickman.lastBiteTime = Date.now();
            stickman.biteCount++;
        }
    }

    static animateCrying(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        this.setPose(stickman, {
            head: { x: stickman.x, y: headY },
            neck: { x: stickman.x, y: neckY },
            chest: { x: stickman.x, y: chestY },
            waist: { x: stickman.x, y: waistY },
            leftShoulder: { x: stickman.x - 7 * scale, y: baseY - 42 * scale },
            leftElbow: { x: stickman.x - 8 * scale, y: baseY - 50 * scale },
            leftHand: { x: stickman.x - 5 * scale, y: baseY - 58 * scale },
            rightShoulder: { x: stickman.x + 7 * scale, y: baseY - 42 * scale },
            rightElbow: { x: stickman.x + 8 * scale, y: baseY - 50 * scale },
            rightHand: { x: stickman.x + 5 * scale, y: baseY - 58 * scale }
        });

        if (Date.now() - stickman.lastTearTime > ((window.CONFIG?.RAGDOLL?.CRYING_TEAR_INTERVAL as number) || 1500)) {
            const headPart = stickman.parts.head;
            if (headPart) {
                const tearX = headPart.position.x + (Math.random() - 0.5) * 8;
                const tearY = headPart.position.y + 8;
                stickman.cryingTearParticles.push(new TearParticle(tearX, tearY));
                stickman.lastTearTime = Date.now();
            }
        }
    }

    static animateWaving(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const waveTime = (Date.now() % 1000) / 1000;
        const waveAngle = Math.sin(waveTime * Math.PI * 4) * 25;

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY },
            neck: { x: stickman.x, y: neckY },
            chest: { x: stickman.x, y: chestY },
            waist: { x: stickman.x, y: waistY },
            rightShoulder: { x: stickman.x + 7 * scale, y: baseY - 42 * scale },
            rightElbow: { x: stickman.x + 12 * scale, y: baseY - 48 * scale },
            rightHand: { x: stickman.x + 15 * scale + waveAngle * 0.4, y: baseY - 56 * scale }
        });
    }

    static animateBackflip(stickman: Stickman, baseY: number, scale: number): void {
        const flipTime = Date.now() - stickman.animationStartTime;
        const flipProgress = flipTime / ((window.CONFIG?.RAGDOLL?.BACKFLIP_DURATION as number) || 1500);
        const rotation = flipProgress * Math.PI * 2;
        const jumpHeight = Math.sin(flipProgress * Math.PI) * ((window.CONFIG?.RAGDOLL?.BACKFLIP_HEIGHT as number) || 80);

        const centerX = stickman.x;
        const centerY = baseY - 30 * scale - jumpHeight;

        const rotatePoint = (offsetX: number, offsetY: number) => {
            const rotatedX = offsetX * Math.cos(rotation) - offsetY * Math.sin(rotation);
            const rotatedY = offsetX * Math.sin(rotation) + offsetY * Math.cos(rotation);
            return { x: centerX + rotatedX, y: centerY + rotatedY };
        };

        this.setPose(stickman, {
            head: rotatePoint(0, -30 * scale),
            neck: rotatePoint(0, -14 * scale),
            chest: rotatePoint(0, 0),
            waist: rotatePoint(0, 14 * scale),
            leftHand: rotatePoint(-35 * scale, -10 * scale),
            rightHand: rotatePoint(35 * scale, -10 * scale)
        });
    }

    static animateMoonwalk(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const moonwalkTime = Date.now() - stickman.animationStartTime;
        const moonwalkProgress = moonwalkTime / ((window.CONFIG?.RAGDOLL?.MOONWALK_DURATION as number) || 2000);
        stickman.x = stickman.moonwalkStartX - (((window.CONFIG?.RAGDOLL?.MOONWALK_SPEED as number) || 100) * moonwalkProgress);

        const legCycle = Math.sin(moonwalkTime / 200 * Math.PI);
        const leftLegSlide = legCycle > 0 ? -12 : 0;
        const rightLegSlide = legCycle > 0 ? 0 : -12;

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY },
            chest: { x: stickman.x, y: chestY },
            leftFoot: { x: stickman.x - 8 * scale + leftLegSlide, y: baseY + 12 * scale },
            rightFoot: { x: stickman.x + 8 * scale + rightLegSlide, y: baseY + 12 * scale }
        });
    }

    static animateWalking(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const walkTime = Date.now() / 150 * Math.PI;
        const sin = Math.sin(walkTime);
        const armSwing = Math.sin(walkTime) * 15 * scale;
        const legSwing = Math.sin(walkTime) * 12 * scale;

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY + Math.abs(sin) * 3 * scale },
            neck: { x: stickman.x, y: neckY + Math.abs(sin) * 2 * scale },
            chest: { x: stickman.x, y: chestY + Math.abs(sin) * 1 * scale },
            waist: { x: stickman.x, y: waistY },
            leftShoulder: { x: stickman.x - 7 * scale, y: baseY - 42 * scale },
            leftElbow: { x: stickman.x - 12 * scale - armSwing, y: baseY - 30 * scale },
            leftHand: { x: stickman.x - 15 * scale - armSwing * 1.5, y: baseY - 20 * scale },
            rightShoulder: { x: stickman.x + 7 * scale, y: baseY - 42 * scale },
            rightElbow: { x: stickman.x + 12 * scale + armSwing, y: baseY - 30 * scale },
            rightHand: { x: stickman.x + 15 * scale + armSwing * 1.5, y: baseY - 20 * scale },
            leftHip: { x: stickman.x - 4 * scale, y: baseY - 14 * scale },
            leftKnee: { x: stickman.x - 6 * scale + legSwing, y: baseY - 2 * scale },
            leftFoot: { x: stickman.x - 8 * scale + legSwing * 1.5, y: baseY + 12 * scale },
            rightHip: { x: stickman.x + 4 * scale, y: baseY - 14 * scale },
            rightKnee: { x: stickman.x + 6 * scale - legSwing, y: baseY - 2 * scale },
            rightFoot: { x: stickman.x + 8 * scale - legSwing * 1.5, y: baseY + 12 * scale }
        });
    }

    static animateIdle(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const widthScale = stickman.globalWidthScale || 1.0;

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY },
            neck: { x: stickman.x, y: neckY },
            chest: { x: stickman.x, y: chestY },
            waist: { x: stickman.x, y: waistY },
            leftShoulder: { x: stickman.x - 7 * scale * widthScale, y: baseY - 42 * scale },
            leftElbow: { x: stickman.x - 12 * scale * widthScale, y: baseY - 30 * scale },
            leftHand: { x: stickman.x - 15 * scale * widthScale, y: baseY - 20 * scale },
            rightShoulder: { x: stickman.x + 7 * scale * widthScale, y: baseY - 42 * scale },
            rightElbow: { x: stickman.x + 12 * scale * widthScale, y: baseY - 30 * scale },
            rightHand: { x: stickman.x + 15 * scale * widthScale, y: baseY - 20 * scale },
            leftHip: { x: stickman.x - 4 * scale * widthScale, y: baseY - 14 * scale },
            leftKnee: { x: stickman.x - 6 * scale * widthScale, y: baseY - 2 * scale },
            leftFoot: { x: stickman.x - 8 * scale * widthScale, y: baseY + 12 * scale },
            rightHip: { x: stickman.x + 4 * scale * widthScale, y: baseY - 14 * scale },
            rightKnee: { x: stickman.x + 6 * scale * widthScale, y: baseY - 2 * scale },
            rightFoot: { x: stickman.x + 8 * scale * widthScale, y: baseY + 12 * scale }
        });
    }

    static animateYawning(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const yawnTime = Date.now() - stickman.animationStartTime;
        const progress = Math.min(1, yawnTime / 2000);
        const mouthOpen = Math.sin(progress * Math.PI) * 10 * scale;

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY - mouthOpen * 0.5 },
            neck: { x: stickman.x, y: neckY },
            leftHand: { x: stickman.x - 25 * scale, y: baseY - 40 * scale },
            rightHand: { x: stickman.x + 25 * scale, y: baseY - 40 * scale }
        });
    }

    static animateStretching(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const stretchTime = Date.now() - stickman.animationStartTime;
        const stretchProgress = Math.sin((stretchTime / 2000) * Math.PI);

        this.setPose(stickman, {
            head: { x: stickman.x, y: headY - 10 * scale * stretchProgress },
            leftHand: { x: stickman.x - 10 * scale, y: headY - 20 * scale * stretchProgress },
            rightHand: { x: stickman.x + 10 * scale, y: headY - 20 * scale * stretchProgress }
        });
    }

    static animateWatching(stickman: Stickman, headY: number, neckY: number, chestY: number, waistY: number, baseY: number, scale: number): void {
        const mX = (window as any).mouseX || 0;
        const mY = (window as any).mouseY || 0;
        const dx = (mX - stickman.x) * 0.1;
        const dy = (mY - headY) * 0.1;
        const limit = 15 * scale;

        const constrainedDX = Math.max(-limit, Math.min(limit, dx));
        const constrainedDY = Math.max(-limit, Math.min(limit, dy));

        this.setPose(stickman, {
            head: { x: stickman.x + constrainedDX, y: headY + constrainedDY },
            neck: { x: stickman.x + constrainedDX * 0.5, y: neckY + constrainedDY * 0.5 }
        });

        // Idle body for the rest
        this.animateIdle(stickman, headY, neckY, chestY, waistY, baseY, scale);
    }
}
