/**
 * RAGDOLL SYSTEM - STICKMAN (Behavioral Orchestrator)
 * Extracted from ragdoll.js
 */

import { BloodParticle, ZzzParticle, TearParticle } from './Particles.js';
import { PhysicsLogic } from './PhysicsLogic.js';
import { Animations } from './Animations.js';
import { Renderer } from './Renderer.js';
import { SkinManager } from './SkinManager.js';
import type { RagdollPet } from './RagdollPet.js';
import { Services } from '../../../js/core/ServiceContainer.js';

export class Stickman {
    public ragdollPet: RagdollPet;
    public x: number;
    public y: number;
    public parts: Record<string, any>;
    public constraints: any[];
    public composite: any;
    public skinManager: SkinManager;
    public skinEnabled: boolean;
    public globalScale: number;
    public globalWidthScale: number;
    public lastPhysicsScale: number;
    public skinConfig: Record<string, { scale: number; y: number }>;

    // State Machine
    public physicsMode: boolean;
    public state: string; // idle, walking, scared, physics, waving, sitting, jumping, dancing, getting-up, etc.
    public emotion: string; // happy, panic, surprised, neutral, angry, etc.
    public direction: number;
    public walkCycle: number;
    public walkSpeed: number;
    public nextActionTime: number;
    public nextWaveCheck: number;
    public grabbed: boolean;
    public mouseX: number;
    public mouseY: number;

    // Radii
    public fearRadius: number;
    public angerRadius: number;

    // Particles & VFX
    public bloodParticles: BloodParticle[];
    public sleepingZzzParticles: ZzzParticle[];
    public cryingTearParticles: TearParticle[];
    public idleTimer: number;
    public justDropped: boolean;
    public currentFloorY: number;
    public lastVelocity: { x: number; y: number };
    public isFalling: boolean;

    // Speech Bubble
    public showBubble: boolean;
    public bubbleText: string;
    public bubbleScale: number;
    public bubbleAlpha: number;
    public bubbleOffsetX: number;
    public bubbleOffsetY: number;

    // External Helpers
    public messageLibrary: any;
    public bubbleAnimator: any;
    public memory: any;
    public brain: any;

    public lastMoodDecayTime: number;
    public activeTimeouts: any[];

    // Loaded images
    public headImage: HTMLImageElement | null = null;
    public leftHandImage: HTMLImageElement | null = null;
    public rightHandImage: HTMLImageElement | null = null;
    public pantsImage: HTMLImageElement | null = null;
    public leftLegImage: HTMLImageElement | null = null;
    public rightLegImage: HTMLImageElement | null = null;
    public shirtImage: HTMLImageElement | null = null;
    public lHandOverlay: HTMLImageElement | null = null;
    public rHandOverlay: HTMLImageElement | null = null;
    public neckImage: HTMLImageElement | null = null;
    public leftArmImage: HTMLImageElement | null = null;
    public rightArmImage: HTMLImageElement | null = null;

    // Timing and Animation metrics
    public animationStartTime: number = 0;
    public lastZzzTime: number = 0;
    public laughingShakeOffset: { x: number; y: number } = { x: 0, y: 0 };
    public lastBiteTime: number = 0;
    public biteCount: number = 0;
    public lastTearTime: number = 0;
    public moonwalkStartX: number = 0;
    public lastActiveTime: number = 0;
    public lastPetSoundTime: number = 0;
    public grabCount: number = 0;
    public gettingUpStartTime: number = 0;
    public deltaTime: number = 0;
    public lastFrameTime: number = 0;
    public emotionTimeout: any = null;
    private _bubbleTimeout: any = null;

    constructor(x: number, y: number, ragdollPet: RagdollPet) {
        this.ragdollPet = ragdollPet;
        this.x = x;
        this.y = y;
        this.parts = {};
        this.constraints = [];
        this.composite = ragdollPet.Composite.create();

        // Assets
        this.loadAssets();

        // Skin & Scale (New Modular System)
        this.skinManager = new SkinManager(this);
        this.skinEnabled = true;
        this.globalScale = 1.0;
        this.globalWidthScale = 1.0;
        this.lastPhysicsScale = 1.0;
        this.skinConfig = {
            head: { scale: 1.0, y: 0 },
            shirt: { scale: 1.0, y: 0 },
            neck: { scale: 1.0, y: 0 },
            leftArm: { scale: 1.0, y: 0 },
            rightArm: { scale: 1.0, y: 0 },
            leftLeg: { scale: 1.0, y: 0 },
            rightLeg: { scale: 1.0, y: 0 },
            leftHand: { scale: 1.0, y: 0 },
            rightHand: { scale: 1.0, y: 0 }
        };

        // State Machine
        this.physicsMode = false;
        this.state = 'idle';
        this.emotion = 'happy';
        this.direction = 1;
        this.walkCycle = 0;
        this.walkSpeed = 0;
        this.nextActionTime = Date.now() + 3000;
        this.nextWaveCheck = Date.now() + 5000;
        this.grabbed = false;
        this.mouseX = 0;
        this.mouseY = 0;

        // Radii from CONFIG
        this.fearRadius = (window as any).CONFIG?.RAGDOLL?.FEAR_RADIUS || 150;
        this.angerRadius = (window as any).CONFIG?.RAGDOLL?.ANGER_RADIUS || 50;

        // Particles & VFX
        this.bloodParticles = [];
        this.sleepingZzzParticles = [];
        this.cryingTearParticles = [];
        this.idleTimer = 0;
        this.justDropped = false;
        this.currentFloorY = y; // Track current standing level
        this.lastVelocity = { x: 0, y: 0 };
        this.isFalling = false;

        // Speech Bubble
        this.showBubble = false;
        this.bubbleText = '';
        this.bubbleScale = 1;
        this.bubbleAlpha = 1;
        this.bubbleOffsetX = 0;
        this.bubbleOffsetY = 0;

        // External Helpers (Globals for now)
        // MessageLibrary is registered in the Service Container (not on window), so
        // resolve it the same way the 3D ragdoll does — otherwise i18n phrases never
        // load and the 2D pet falls back to raw English category names.
        const MessageLibraryCtor = Services.get('MessageLibrary');
        this.messageLibrary = MessageLibraryCtor ? new MessageLibraryCtor() : null;
        this.bubbleAnimator = (window as any).BubbleAnimator ? new (window as any).BubbleAnimator() : null;
        this.memory = (window as any).RagdollMemory ? (typeof (window as any).RagdollMemory === 'function' ? new (window as any).RagdollMemory() : (window as any).RagdollMemory) : null;
        this.brain = null; // AI Brain disabled

        this.lastMoodDecayTime = Date.now();
        this.activeTimeouts = [];

        // Initialization
        this.initPhysics();
        ragdollPet.World.add(ragdollPet.world, this.composite);
    }

    loadAssets(): void {
        const load = (src: string) => { const img = new Image(); img.src = src; return img; };
        this.headImage = load('games/ragdoll/assets/ragdoll.webp');
        this.leftHandImage = load('games/ragdoll/assets/left hand.png');
        this.rightHandImage = load('games/ragdoll/assets/Right hand.png');
        this.pantsImage = load('games/ragdoll/assets/trousers.webp');
        this.leftLegImage = load('games/ragdoll/assets/l_leg.webp');
        this.rightLegImage = load('games/ragdoll/assets/r_leg.webp');
        this.shirtImage = load('games/ragdoll/assets/cami.webp');
        this.lHandOverlay = load('games/ragdoll/assets/l_hand.webp');
        this.rHandOverlay = load('games/ragdoll/assets/r_hand.webp');
        this.neckImage = null; // Default to null for new parts
        this.leftArmImage = null;
        this.rightArmImage = null;
    }

    setSkin(enabled: boolean): void {
        this.skinEnabled = !!enabled;

        // Sync UI button states if they exist
        const stdBtn = document.querySelector('button[onclick*="setSkin(false)"]') as HTMLElement | null;
        const cstBtn = document.querySelector('button[onclick*="setSkin(true)"]') as HTMLElement | null;
        if (stdBtn) {
            stdBtn.style.border = !enabled ? '2px inset #fff' : '2px outset #fff';
            stdBtn.style.background = !enabled ? '#d0d0d0' : '#c0c0c0';
        }
        if (cstBtn) {
            cstBtn.style.border = enabled ? '2px inset #fff' : '2px outset #fff';
            cstBtn.style.background = enabled ? '#d0d0d0' : '#c0c0c0';
        }

        if ((window as any).Utils?.Logger) {
            (window as any).Utils.Logger.log('RAGDOLL', `Skins ${this.skinEnabled ? 'Enabled' : 'Disabled'}`);
        }
    }

    resetToProcedural(): void {
        this.headImage = null;
        this.leftHandImage = null;
        this.rightHandImage = null;
        this.shirtImage = null;
        this.pantsImage = null;
        this.leftLegImage = null;
        this.rightLegImage = null;
    }

    resetCustomSkin(): void {
        this.loadAssets();
        this.skinManager = new SkinManager(this);
        this.skinConfig = {
            head: { scale: 1.0, y: 0 },
            shirt: { scale: 1.0, y: 0 },
            neck: { scale: 1.0, y: 0 },
            leftArm: { scale: 1.0, y: 0 },
            rightArm: { scale: 1.0, y: 0 },
            leftLeg: { scale: 1.0, y: 0 },
            rightLeg: { scale: 1.0, y: 0 },
            trousers: { scale: 1.0, y: 0 }
        };
        this.globalScale = 1.0;
        this.globalWidthScale = 1.0;
        this.setGlobalScale(1.0);
        this.setSkin(true);
        this.rebuildSkeleton();
        this.standUp();

        if ((window as any).Utils?.Logger) {
            (window as any).Utils.Logger.log('RAGDOLL', 'Skins reset to default');
        }
    }

    /**
     * Rebuilds the physical skeleton to match new proportions
     * (Critical for the Workshop's Limb Scaling feature)
     */
    rebuildSkeleton(): void {
        if ((window as any).Utils?.Logger) (window as any).Utils.Logger.log('RAGDOLL', 'Rebuilding skeleton with new proportions...');

        const scale = this.globalScale * ((window as any).CONFIG?.RAGDOLL?.SCALE || 1.0);
        const props = this.skinManager.proportions;
        const waist = this.parts.waist;

        // 1. Reposition parts relative to waist to avoid physics tension
        // (Simple downward expansion for legs, upward for torso/head)
        if (waist) {
            const wPos = waist.position;
            const set = (p: string, xO: number, yO: number) => {
                if (this.parts[p]) this.ragdollPet.Body.setPosition(this.parts[p], { x: wPos.x + xO * scale, y: wPos.y + yO * scale });
            };

            set('chest', 0, -14 * props.torsoScale);
            set('neck', 0, -28 * props.torsoScale);
            set('head', 0, -44 * props.torsoScale * props.headScale);

            // Arm positioning
            set('leftShoulder', -7, -26 * props.torsoScale);
            set('leftElbow', -15, -14 * props.torsoScale * props.armLength);
            set('leftHand', -18, -4 * props.torsoScale * props.armLength);

            set('rightShoulder', 7, -26 * props.torsoScale);
            set('rightElbow', 15, -14 * props.torsoScale * props.armLength);
            set('rightHand', 18, -4 * props.torsoScale * props.armLength);

            set('leftHip', -4, 2);
            set('leftKnee', -7, 14 * props.legLength);
            set('leftFoot', -8, 28 * props.legLength);
            set('leftToes', -16, 28 * props.legLength);

            set('rightHip', 4, 2);
            set('rightKnee', 7, 14 * props.legLength);
            set('rightFoot', 8, 28 * props.legLength);
            set('rightToes', 16, 28 * props.legLength);
        }

        // 2. Remove old constraints
        this.ragdollPet.World.remove(this.ragdollPet.world, this.constraints);

        // 3. Re-create constraints with new lengths
        const physicsData = PhysicsLogic.createSkeletalConstraints(this, scale);
        this.constraints = physicsData;

        // 4. Add back to world
        this.ragdollPet.World.add(this.ragdollPet.world, this.constraints);
    }

    updatePartImage(partName: string, src: string): void {
        const img = new Image();
        img.src = src;
        (img as any).isCustomSkin = true; // Mark for Renderer logic (e.g. hand rotation)
        img.onload = () => {
            if (partName === 'head') this.headImage = img;
            else if (partName === 'shirt') this.shirtImage = img;
            else if (partName === 'neck') this.neckImage = img;
            else if (partName === 'leftArm') this.leftArmImage = img;
            else if (partName === 'rightArm') this.rightArmImage = img;
            else if (partName === 'leftLeg') this.leftLegImage = img;
            else if (partName === 'rightLeg') this.rightLegImage = img;
            else if (partName === 'leftHand') this.leftHandImage = img;
            else if (partName === 'rightHand') this.rightHandImage = img;
            this.setSkin(true);
        };
    }

    updateSkinConfig(partName: string, type: string, value: number | string): void {
        if (!this.skinConfig[partName]) return;
        const parsedVal = typeof value === 'number' ? value : parseFloat(value);
        const config = this.skinConfig[partName]!;
        if (type === 'scale') config.scale = parsedVal;
        else if (type === 'y') config.y = parsedVal;
    }

    setGlobalScale(val: number | string): void {
        const newScale = typeof val === 'number' ? val : parseFloat(val);
        const ratio = newScale / this.lastPhysicsScale;
        for (const part in this.parts) {
            this.ragdollPet.Body.scale(this.parts[part], ratio, ratio);
        }
        this.constraints.forEach(c => { c.length *= ratio; });
        this.lastPhysicsScale = newScale;
        this.globalScale = newScale;
        if (this.state === 'idle' || !this.isDoingSpecialAnimation()) {
            this.standUp();
        }
    }

    setGlobalWidthScale(val: number | string): void {
        this.globalWidthScale = typeof val === 'number' ? val : parseFloat(val);
        if (!this.physicsMode) this.standUp();
    }

    initPhysics(): void {
        const scale = (window as any).CONFIG?.RAGDOLL?.SCALE || 1.0;
        // Pass 'this' so PhysicsLogic can access this.ragdollPet
        this.parts = PhysicsLogic.createSkeletalParts(this, this.x, this.y, scale);

        for (const part in this.parts) {
            this.ragdollPet.Composite.add(this.composite, this.parts[part]);
        }

        // Use the correct method name: createSkeletalConstraints
        this.constraints = PhysicsLogic.createSkeletalConstraints(this, scale);
        this.constraints.forEach(c => this.ragdollPet.Composite.add(this.composite, c));

        this.deactivatePhysics();
    }

    update(): void {
        const now = Date.now();
        this.deltaTime = (now - (this.lastFrameTime || now)) / 16.67;
        this.lastFrameTime = now;

        if (this.physicsMode) {
            // Keep logical X/Y synced with physical center (chest/torso)
            // so we know where we are even in physics mode
            if (this.parts.chest) {
                this.x = this.parts.chest.position.x;
                this.y = this.parts.chest.position.y;
            }
            this.updatePhysicsMode();
        } else {
            this.updateAnimationMode();
            this.updateIdleTimer();
            this.updateMood();
            this.updateFallingEmotion();
            this.checkFallDamage();
            this.updateBloodParticles();
            this.updateSpecialParticles();
        }
    }

    updateFallingEmotion(): void {
        if (!this.physicsMode || this.grabbed || !this.parts.head) return;
        const v = this.parts.head.velocity;
        const speed = Math.sqrt(v.x ** 2 + v.y ** 2);

        if (speed > 10) {
            this.setEmotion('panic', 1000);
        } else if (speed > 5 && this.emotion !== 'panic') {
            this.setEmotion('surprised', 500);
        }
    }

    setEmotion(emotion: string, duration = 0): void {
        this.emotion = emotion;
        if (this.emotionTimeout) clearTimeout(this.emotionTimeout);

        if (duration > 0) {
            this.emotionTimeout = setTimeout(() => {
                // Return to a sensible default based on state
                if (this.state === 'idle') this.emotion = 'happy';
                else if (this.state === 'walking') this.emotion = 'neutral';
                else this.emotion = 'neutral';
            }, duration);
        }
    }

    updateSpecialParticles(): void {
        if (this.state === 'sleeping') {
            this.sleepingZzzParticles = this.sleepingZzzParticles.filter(p => p.update());
        }
        if (this.state === 'crying') {
            this.cryingTearParticles = this.cryingTearParticles.filter(p => p.update());
        }
    }

    drawSpecialParticles(ctx: CanvasRenderingContext2D): void {
        if (this.state === 'sleeping') this.sleepingZzzParticles.forEach(p => p.draw(ctx));
        if (this.state === 'crying') this.cryingTearParticles.forEach(p => p.draw(ctx));
    }

    updatePhysicsMode(): void {
        if (this.grabbed || !this.parts.head) return;

        const headPos = this.parts.head.position;
        const headVel = this.parts.head.velocity;

        const isStable = Math.abs(headVel.y) < 0.5 && Math.abs(headVel.x) < 0.5;

        // Find surface under head/chest
        const surfaceY = this.ragdollPet.getSurfaceAt(this.x, headPos.y);
        const nearSurface = Math.abs(headPos.y - surfaceY) < 150;

        if (isStable && nearSurface) {
            this.safeTimeout(() => {
                if (!this.grabbed && this.physicsMode) {
                    // Lock to the surface we found
                    this.currentFloorY = surfaceY;
                    this.deactivatePhysics();
                    this.startStretching();
                    this.emotion = 'tired';
                }
            }, 500);
        }
    }

    updateAnimationMode(): void {
        if (['hurt', 'getting-up', 'falling', 'physics'].includes(this.state)) return;

        // Dynamic surface check: if the window under us is gone or moved, fall!
        const surfaceY = this.ragdollPet.getSurfaceAt(this.x, this.y);
        // If the surface is now much lower than where we were standing
        if (surfaceY > this.currentFloorY + 30) {
            this.ragdollPet.playScreamSound();
            this.justDropped = true; // Ensure boing sound on impact
            this.activatePhysics();
            return;
        } else {
            // Smoothly update currentFloorY if it changed slightly (window moved up/down)
            this.currentFloorY = surfaceY;
        }

        if (Date.now() > this.nextActionTime && !this.isDoingSpecialAnimation()) {
            this.decideNextAction();
        }

        // Mouse proximity interaction
        this.checkMouseProximity();

        // Movement
        if (this.state === 'walking' || this.state === 'scared') {
            this.x += this.direction * this.walkSpeed;
            this.walkCycle += 0.1 * Math.abs(this.walkSpeed);

            // Boundary constraints
            if (this.x < 50 || this.x > window.innerWidth - 50) {
                this.direction *= -1;
                this.x = Math.max(50, Math.min(window.innerWidth - 50, this.x));
            }
        }

        this.animateStanding();
    }

    animateStanding(): void { Animations.animateStandingCycle(this); }
    draw(): void { Renderer.draw(this); }

    // --- State Actions ---

    activatePhysics(): void {
        this.physicsMode = true;
        this.state = 'physics';
        for (const part in this.parts) this.ragdollPet.Body.setStatic(this.parts[part], false);
    }

    deactivatePhysics(): void {
        this.physicsMode = false;
        for (const part in this.parts) this.ragdollPet.Body.setStatic(this.parts[part], true);
        this.standUp();
    }

    standUp(): void { Animations.standUp(this); }

    decideNextAction(): void {
        const rand = Math.random();

        // Probabilidades de estado
        if (rand < 0.25) {
            this.state = 'idle';
            this.emotion = 'happy';
            this.walkSpeed = 0;
            this.nextActionTime = Date.now() + 4000;
        } else if (rand < 0.50) {
            this.state = 'walking';
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.walkSpeed = Math.random() * 0.5 + 0.5;
            this.nextActionTime = Date.now() + 5000;
        } else if (rand < 0.60) {
            this.startDancing();
        } else if (rand < 0.70) {
            this.startSitting();
        } else if (rand < 0.80) {
            this.startWaving();
        } else if (rand < 0.85) {
            this.startJumping();
        } else if (rand < 0.90) {
            this.startMoonwalk();
        } else if (rand < 0.95) {
            this.startBackflip();
        } else if (rand < 0.98) {
            this.startEating();
        } else {
            this.startLaughing();
        }
    }

    updateIdleTimer(): void {
        if (this.grabbed || this.physicsMode || this.state !== 'idle') {
            this.lastActiveTime = Date.now();
            return;
        }

        const idleTime = Date.now() - (this.lastActiveTime || Date.now());
        if (idleTime > 15000 && this.state === 'idle') { // 15 seconds of pure idle
            this.startYawning();
            this.lastActiveTime = Date.now(); // Reset to avoid double trigger
        }
    }

    updateMood(): void {
        const now = Date.now();
        if (now - this.lastMoodDecayTime > 30000) { // Decay every 30s
            if (this.emotion === 'happy') this.setEmotion('neutral');
            else if (this.emotion === 'neutral') this.setEmotion('tired');
            this.lastMoodDecayTime = now;
        }

        // Random chance to cry if bored/tired/sad
        if ((this.emotion === 'tired' || this.emotion === 'sad') && Math.random() < 0.002 && this.state === 'idle') {
            this.startCrying();
        }
    }

    checkMouseProximity(): void {
        const taskbarTop = window.innerHeight - ((window as any).CONFIG?.TASKBAR?.HEIGHT || 40);
        const mX = (window as any).mouseX || 0;
        const mY = (window as any).mouseY || 0;
        const dx = mX - this.x;
        const dy = mY - (taskbarTop - 37);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.angerRadius) {
            this.setEmotion('angry', 2000);
            this.say('😠');
            this.lastActiveTime = Date.now();
        } else if (distance < this.fearRadius) {
            // New: Don't run away if being petted or the mouse is over us
            const canvas = this.ragdollPet.render.canvas;
            if (canvas.style.cursor === 'grab') return;

            this.state = 'scared';
            this.setEmotion('panic', 1000);
            this.direction = dx > 0 ? -1 : 1;
            this.walkSpeed = 2.5;
            this.lastActiveTime = Date.now();
        } else if (distance < 300 && this.state === 'idle') {
            // Look at mouse
            this.setEmotion('neutral', 1000);
            this.state = 'watching';
            this.safeTimeout(() => { if (this.state === 'watching') this.state = 'idle'; }, 1000);
        }
    }

    isDoingSpecialAnimation(): boolean {
        return ['waving', 'sitting', 'jumping', 'dancing', 'watching', 'looking-up', 'sleeping', 'laughing', 'eating', 'yawning', 'crying', 'stretching'].includes(this.state);
    }

    // --- Animation Triggers ---

    startWaving(): void {
        this.state = 'waving';
        this.animationStartTime = Date.now();
        this.ragdollPet.playWaveSound();
        this.showBubbleWithAnimation('GREETINGS', 2500);
        this.safeTimeout(() => { if (this.state === 'waving') this.state = 'idle'; }, 3000);
    }

    startJumping(): void {
        this.state = 'jumping';
        this.animationStartTime = Date.now();
        this.ragdollPet.playJumpSound();
        this.safeTimeout(() => { if (this.state === 'jumping') this.state = 'idle'; }, (window as any).CONFIG?.RAGDOLL?.JUMP_DURATION || 1000);
    }

    startStretching(): void {
        this.state = 'stretching';
        this.animationStartTime = Date.now();
        this.ragdollPet.audioManager?.play('stretch');
        this.safeTimeout(() => { if (this.state === 'stretching') this.state = 'idle'; }, 2000);
    }

    startDancing(): void {
        this.state = 'dancing';
        this.animationStartTime = Date.now();
        this.ragdollPet.audioManager?.play('dance');
        this.showBubbleWithAnimation('COOL', 3000);
        this.safeTimeout(() => { if (this.state === 'dancing') this.state = 'idle'; }, 4000);
    }

    startSitting(): void {
        this.state = 'sitting';
        this.animationStartTime = Date.now();
        this.ragdollPet.audioManager?.play('sit');
        this.safeTimeout(() => { if (this.state === 'sitting') this.state = 'idle'; }, 5000);
    }

    startLaughing(): void {
        this.state = 'laughing';
        this.animationStartTime = Date.now();
        this.ragdollPet.audioManager?.play('laugh');
        this.showBubbleWithAnimation('FUNNY', 2000);
        this.safeTimeout(() => { if (this.state === 'laughing') this.state = 'idle'; }, 3000);
    }

    startEating(): void {
        this.state = 'eating';
        this.animationStartTime = Date.now();
        this.biteCount = 0;
        this.lastBiteTime = 0;
        this.showBubbleWithAnimation('HUNGRY', 3000);
        this.safeTimeout(() => { if (this.state === 'eating') this.state = 'idle'; }, 4000);
    }

    startSleeping(): void {
        this.state = 'sleeping';
        this.animationStartTime = Date.now();
        this.lastZzzTime = 0;
        this.sleepingZzzParticles = [];
        this.ragdollPet.audioManager?.play('snore', { loop: true });
        this.safeTimeout(() => {
            if (this.state === 'sleeping') {
                this.state = 'idle';
                this.startStretching();
            }
        }, 10000);
    }

    startMoonwalk(): void {
        this.state = 'moonwalk';
        this.animationStartTime = Date.now();
        this.moonwalkStartX = this.x;
        this.direction = -1;
        this.ragdollPet.audioManager?.play('dance');
        this.safeTimeout(() => { if (this.state === 'moonwalk') this.state = 'idle'; }, 2000);
    }

    startBackflip(): void {
        this.state = 'backflip';
        this.animationStartTime = Date.now();
        this.ragdollPet.audioManager?.play('flip');
        this.safeTimeout(() => { if (this.state === 'backflip') this.state = 'idle'; }, 1500);
    }

    startYawning(): void {
        this.state = 'yawning';
        this.animationStartTime = Date.now();
        this.ragdollPet.audioManager?.play('yawn');
        this.safeTimeout(() => {
            if (this.state === 'yawning') this.startSleeping();
        }, 2000);
    }

    startCrying(): void {
        this.state = 'crying';
        this.animationStartTime = Date.now();
        this.lastTearTime = 0;
        this.cryingTearParticles = [];
        this.ragdollPet.audioManager?.play('sad');
        this.showBubbleWithAnimation('SAD', 3000);
        this.safeTimeout(() => { if (this.state === 'crying') this.state = 'idle'; }, 5000);
    }

    /**
     * Shows a speech bubble with intelligent duration based on text length
     * @param {string} text 
     * @param {number} duration - Optional override (ms)
     */
    say(text: string, duration: number | null = null): void {
        if (!text) return;

        // Calculate duration: ~100ms per char, min 2000ms, max 8000ms
        const calcDuration = duration || Math.min(8000, Math.max(2000, text.length * 80));

        this.bubbleText = text;
        this.showBubble = true;

        // Clear previous bubble timeout if exists
        if (this._bubbleTimeout) clearTimeout(this._bubbleTimeout);

        if (this.bubbleAnimator) {
            this.bubbleAnimator.fullBubble('b_' + Date.now(), calcDuration, { wobble: true },
                (an: any) => { this.bubbleScale = an.scale; this.bubbleAlpha = an.alpha; },
                () => { this.showBubble = false; }
            );
        } else {
            this._bubbleTimeout = this.safeTimeout(() => {
                this.showBubble = false;
            }, calcDuration);
        }
    }

    showBubbleWithAnimation(category: string, duration: number | null = null): void {
        const message = this.messageLibrary ? this.messageLibrary.get(category) : category;
        this.say(message, duration);
    }

    // --- Interaction Hooks ---

    onGrab(): void {
        this.clearAllTimeouts(); // Stop any pending animation logic
        this.grabbed = true;
        this.activatePhysics();
        this.ragdollPet.playGrabSound();

        // Track grab count for anger
        this.grabCount = (this.grabCount || 0) + 1;
        if (this.grabCount > 3) {
            this.setEmotion('angry', 3000);
            this.showBubbleWithAnimation('ANGER', 2000);
        } else {
            this.setEmotion('surprised', 1000);
        }

        if (this.memory) this.memory.recordGrab();
    }

    onPet(): void {
        if (this.physicsMode && !this.grabbed) return;

        this.setEmotion('happy', 2000);
        this.lastActiveTime = Date.now();
        this.grabCount = 0; // Petting resets the anger from being grabbed

        if (!this.lastPetSoundTime || Date.now() - this.lastPetSoundTime > 2000) {
            this.ragdollPet.audioManager?.play('laugh', { volume: 0.3, pitch: 1.5 });
            this.lastPetSoundTime = Date.now();
        }

        this.say('❤️', 1500);
    }

    onDrop(): void {
        this.grabbed = false;
        this.justDropped = true;

        // Scream if dropped with significant velocity
        if (this.parts.head) {
            const v = this.parts.head.velocity;
            const speed = Math.sqrt(v.x ** 2 + v.y ** 2);
            if (speed > 8) {
                this.ragdollPet.playScreamSound();
            } else {
                this.ragdollPet.playDropSound();
            }
        } else {
            this.ragdollPet.playDropSound();
        }

        if (this.memory) this.memory.recordDrop();
        this.showBubbleWithAnimation('HAPPY', 2500);
    }

    // --- Logic Helpers ---

    checkFallDamage(): void {
        if (!this.physicsMode || !this.parts.head) return;
        const v = this.parts.head.velocity;
        const speed = Math.sqrt(v.x ** 2 + v.y ** 2);
        if (speed > 15) this.isFalling = true;
        if (this.isFalling && speed < 2) {
            this.onHardImpact();
            this.isFalling = false;
        }
    }

    onHardImpact(): void {
        this.state = 'hurt';
        this.setEmotion('hurt', 3000);
        this.ragdollPet.playHurtSound();
        if (this.memory) this.memory.recordHurt();

        const i18nService = Services.get('i18n') as any;
        this.say(i18nService ? i18nService.t('ragdoll.hurt.ouch') : 'Ouch!', 1500);

        this.safeTimeout(() => {
            this.state = 'getting-up';
            this.gettingUpStartTime = Date.now();
            this.setEmotion('sad', 2000);
        }, 2000);
    }

    safeTimeout(callback: () => void, delay: number): any {
        const id = setTimeout(() => {
            callback();
            const idx = this.activeTimeouts.indexOf(id);
            if (idx > -1) this.activeTimeouts.splice(idx, 1);
        }, delay);
        this.activeTimeouts.push(id);
        return id;
    }

    clearAllTimeouts(): void {
        this.activeTimeouts.forEach(clearTimeout);
        this.activeTimeouts = [];
    }

    updateBloodParticles(): void {
        this.bloodParticles = this.bloodParticles.filter(p => p.update());
    }

    drawBloodParticles(ctx: CanvasRenderingContext2D): void {
        this.bloodParticles.forEach(p => p.draw(ctx));
    }
}
