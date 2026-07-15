/**
 * RAGDOLL SYSTEM - RAGDOLL PET (Main Controller)
 * Extracted from ragdoll.js
 */

import { Stickman } from './Stickman.js';
import { RagdollUI } from './RagdollUI.js';

export class RagdollPet {
    public canvasId: string;
    public canvas: HTMLCanvasElement;
    public isActive: boolean;
    public engine: any;
    public world: any;
    public render: any;
    public stickman: Stickman | null;
    public runner: any;
    public mouseConstraint: any;
    public ground: any;
    public walls: any[];
    public windowBodies: Map<string, any>;
    public iconBodies: Map<string, any>;
    public stickyBodies: Map<string, any>;
    public overlayBodies: Set<any>;
    public boundHandlers: {
        resize: (() => void) | null;
        mousemove?: (() => void) | null;
        mousedown?: (() => void) | null;
        documentMousemove?: (() => void) | null;
    };
    public Matter: any;
    public Engine: any;
    public Render: any;
    public World: any;
    public Bodies: any;
    public Body: any;
    public Constraint: any;
    public Mouse: any;
    public MouseConstraint: any;
    public Runner: any;
    public Events: any;
    public Composite: any;
    public audioManager: any;

    private _mouseControlSetup?: boolean;
    private _pettingVelocity: number = 0;
    private _lastMouseX: number = 0;
    private _lastMouseY: number = 0;

    constructor(canvasId: string) {
        this.canvasId = canvasId;
        const canvasEl = document.getElementById(canvasId);
        if (!canvasEl) {
            throw new Error(`Canvas element with id ${canvasId} not found`);
        }
        this.canvas = canvasEl as HTMLCanvasElement;
        this.isActive = false;
        this.engine = null;
        this.world = null;
        this.render = null;
        this.stickman = null;
        this.mouseConstraint = null;
        this.ground = null;
        this.walls = [];
        this.windowBodies = new Map(); // winId -> Matter.Body
        this.iconBodies = new Map();   // elementId -> Matter.Body
        this.stickyBodies = new Map(); // elementId -> Matter.Body
        this.overlayBodies = new Set(); // Quick lookup for collisions

        this.boundHandlers = {
            resize: null
        };

        // Matter.js modules (from window)
        this.Matter = (window as any).Matter;
        this.Engine = this.Matter.Engine;
        this.Render = this.Matter.Render;
        this.World = this.Matter.World;
        this.Bodies = this.Matter.Bodies;
        this.Body = this.Matter.Body;
        this.Constraint = this.Matter.Constraint;
        this.Mouse = this.Matter.Mouse;
        this.MouseConstraint = this.Matter.MouseConstraint;
        this.Runner = this.Matter.Runner;
        this.Events = this.Matter.Events;
        this.Composite = this.Matter.Composite;

        this.audioManager = (window as any).AudioManager?.getInstance?.() || null;
    }

    init(): void {
        if (this.isActive || !(window as any).Matter) return;

        this.engine = this.Engine.create();
        this.world = this.engine.world;
        this.world.gravity.y = 0.5;

        this.render = this.Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
                showAngleIndicator: false,
                showCollisions: false,
                showVelocity: false
            }
        });

        this.Render.run(this.render);
        this.runner = this.Runner.create();
        this.Runner.run(this.runner, this.engine);

        this.createGround();
        this.createWalls();

        const startX = window.innerWidth / 2;
        const taskbarTop = window.innerHeight - ((window as any).CONFIG?.TASKBAR?.HEIGHT || 40);
        const ragdollY = taskbarTop - ((window as any).CONFIG?.RAGDOLL?.GROUND_OFFSET || 13);

        this.stickman = new Stickman(startX, ragdollY, this);
        this.setupMouseControl();

        // Initialize the unified Ragdoll Workshop & Skins UI
        RagdollUI.init(this);

        this.Events.on(this.engine, 'beforeUpdate', () => {
            if (this.stickman) {
                this.syncWindowPhysics();
                this.syncDesktopOverlayPhysics();
            }
        });

        this.Events.on(this.engine, 'afterUpdate', () => {
            if (this.stickman) {
                this.stickman.update();
                this.stickman.draw();
            }
        });

        // Collision detection for "boing" sound
        this.Events.on(this.engine, 'collisionStart', (event: any) => {
            if (!this.stickman) return;

            // Trigger boing if falling/moving in physics mode OR just dropped
            const isVulnerable = this.stickman.physicsMode || this.stickman.justDropped;
            if (!isVulnerable) return;

            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                const isGround = pair.bodyA === this.ground || pair.bodyB === this.ground;
                const isWall = this.walls.includes(pair.bodyA) || this.walls.includes(pair.bodyB);
                const isOverlay = this.overlayBodies.has(pair.bodyA) || this.overlayBodies.has(pair.bodyB);

                if (isGround || isWall || isOverlay) {
                    const stickmanParts = Object.values(this.stickman.parts);
                    const hitStickman = stickmanParts.includes(pair.bodyA) || stickmanParts.includes(pair.bodyB);

                    if (hitStickman) {
                        const speed = pair.collision.speed;
                        // Always boing on manual drop, or if impact speed is significant
                        if (speed > 1.5 || this.stickman.justDropped) {
                            this.playBoingSound();
                            this.stickman.justDropped = false;
                            break; // Stop checking other pairs in this frame to avoid overlapping sounds
                        }
                    }
                }
            }
        });

        this.boundHandlers.resize = () => this.handleResize();
        window.addEventListener('resize', this.boundHandlers.resize);

        this.isActive = true;
        this.canvas.style.display = 'block';
        this.playSpawnSound();

        // Load scream sound if audioManager is available
        if (this.audioManager) {
            this.audioManager.loadSound('scream', 'games/ragdoll/assets/audio/ahh.opus');
            this.audioManager.loadSound('wii', 'games/ragdoll/assets/audio/wii.opus');
            this.audioManager.loadSound('boing', 'games/ragdoll/assets/audio/boing.opus');
        }
    }

    createGround(): void {
        const taskbarTop = window.innerHeight - ((window as any).CONFIG?.TASKBAR?.HEIGHT || 40);
        const groundHeight = (window as any).CONFIG?.RAGDOLL?.GROUND_HEIGHT || 20;

        this.ground = this.Bodies.rectangle(
            window.innerWidth / 2,
            taskbarTop + (groundHeight / 2),
            window.innerWidth * 2,
            groundHeight,
            {
                isStatic: true,
                friction: 0,
                restitution: (window as any).CONFIG?.RAGDOLL?.RESTITUTION || 0.4,
                render: { fillStyle: 'transparent' }
            }
        );

        this.World.add(this.world, this.ground);
    }

    createWalls(): void {
        const wallRestitution = (window as any).CONFIG?.RAGDOLL?.WALL_RESTITUTION || 1.0;
        const leftWall = this.Bodies.rectangle(-10, window.innerHeight / 2, 20, window.innerHeight, {
            isStatic: true,
            restitution: wallRestitution,
            friction: 0,
            frictionStatic: 0,
            render: { fillStyle: 'transparent' }
        });
        const rightWall = this.Bodies.rectangle(window.innerWidth + 10, window.innerHeight / 2, 20, window.innerHeight, {
            isStatic: true,
            restitution: wallRestitution,
            friction: 0,
            frictionStatic: 0,
            render: { fillStyle: 'transparent' }
        });
        this.walls = [leftWall, rightWall];
        this.World.add(this.world, this.walls);
    }

    /**
     * Finds the highest surface (taskbar or window top) at a specific X coordinate
     * @param {number} x - Horizontal coordinate
     * @param {number} currentAppY - Current Y of the object (to check only surfaces below)
     * @returns {number} Y coordinate of the surface
     */
    getSurfaceAt(x: number, currentAppY: number): number {
        const taskbarHeight = (window as any).CONFIG?.TASKBAR?.HEIGHT || 40;
        const taskbarTop = window.innerHeight - taskbarHeight;
        let highestY = taskbarTop;

        const checkBodies = (bodyMap: Map<string, any>, elementClass: string) => {
            for (const [id, body] of bodyMap.entries()) {
                const el = document.getElementById(id);
                if (!el || el.style.display === 'none') continue;

                // For sticky notes and windows, check visibility via opacity or classes if needed
                if (elementClass === 'sticky' && el.classList.contains('minimized')) continue;

                const rect = el.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right) {
                    const top = rect.top;
                    // Check if the top is below current position but higher than highestY
                    if (top >= currentAppY - 20 && top < highestY) {
                        highestY = top;
                    }
                }
            }
        };

        // 1. Check Windows
        checkBodies(this.windowBodies, 'window');

        // 2. Check Icons
        checkBodies(this.iconBodies, 'icon');

        // 3. Check Sticky Notes
        checkBodies(this.stickyBodies, 'sticky');

        return highestY;
    }

    syncWindowPhysics(): void {
        if (!(window as any).WindowManager) return;
        const activeIds = (window as any).WindowManager.getActive();
        const res = (window as any).CONFIG?.RAGDOLL?.WINDOW_RESTITUTION || 0.7;

        // 1. Remove bodies for closed windows
        for (const [winId, body] of this.windowBodies.entries()) {
            const win = document.getElementById(winId);
            if (!activeIds.includes(winId) || !win || win.style.display === 'none') {
                this.World.remove(this.world, body);
                this.overlayBodies.delete(body);
                this.windowBodies.delete(winId);
            }
        }

        // 2. Update/Create bodies for active windows
        activeIds.forEach((winId: string) => {
            const win = document.getElementById(winId);
            if (!win || win.style.display === 'none') return;
            if (!win.classList.contains('win95-window')) return;

            const rect = win.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let body = this.windowBodies.get(winId);
            if (!body) {
                body = this.Bodies.rectangle(centerX, centerY, rect.width, rect.height, {
                    isStatic: true,
                    restitution: res,
                    friction: 0.1,
                    render: { fillStyle: 'transparent' }
                });
                body.winWidth = rect.width;
                body.winHeight = rect.height;
                this.windowBodies.set(winId, body);
                this.overlayBodies.add(body);
                this.World.add(this.world, body);
            } else {
                if (Math.abs(body.winWidth - rect.width) > 5 || Math.abs(body.winHeight - rect.height) > 5) {
                    this.World.remove(this.world, body);
                    this.overlayBodies.delete(body);
                    body = this.Bodies.rectangle(centerX, centerY, rect.width, rect.height, {
                        isStatic: true,
                        restitution: res,
                        friction: 0.1,
                        render: { fillStyle: 'transparent' }
                    });
                    body.winWidth = rect.width;
                    body.winHeight = rect.height;
                    this.windowBodies.set(winId, body);
                    this.overlayBodies.add(body);
                    this.World.add(this.world, body);
                } else {
                    this.Body.setPosition(body, { x: centerX, y: centerY });
                }
            }
        });
    }

    handleResize(): void {
        if (!this.render) return;
        this.render.canvas.width = window.innerWidth;
        this.render.canvas.height = window.innerHeight;

        if (this.ground) {
            const taskbarTop = window.innerHeight - ((window as any).CONFIG?.TASKBAR?.HEIGHT || 40);
            this.Body.setPosition(this.ground, { x: window.innerWidth / 2, y: taskbarTop });
        }

        // Reposition walls
        if (this.walls && this.walls.length === 2) {
            const h = window.innerHeight;
            const w = window.innerWidth;
            this.Body.setPosition(this.walls[0], { x: -10, y: h / 2 });
            this.Body.setPosition(this.walls[1], { x: w + 10, y: h / 2 });
        }
    }

    setupMouseControl(): void {
        if (this._mouseControlSetup) return;
        const mouse = this.Mouse.create(this.render.canvas);
        this.mouseConstraint = this.MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        this.World.add(this.world, this.mouseConstraint);
        this.render.mouse = mouse;

        this.Events.on(this.mouseConstraint, 'startdrag', () => {
            if (this.stickman) {
                // Ensure all animations are canceled immediately
                this.stickman.clearAllTimeouts();
                this.stickman.onGrab();
            }
        });
        this.Events.on(this.mouseConstraint, 'enddrag', () => {
            if (this.stickman) this.stickman.onDrop();
        });

        // Petting & Cursor Logic
        const canvas = this.render.canvas;
        this._pettingVelocity = 0;
        this._lastMouseX = 0;
        this._lastMouseY = 0;

        canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this.stickman || !this.isActive) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if mouse is over any ragdoll part
            const bodies = Object.values(this.stickman.parts);
            const found = this.Matter.Query.point(bodies, { x, y });

            if (found.length > 0) {
                canvas.style.cursor = 'grab';

                // Detection for "Petting" movement
                const dx = x - this._lastMouseX;
                const dy = y - this._lastMouseY;
                const speed = Math.sqrt(dx * dx + dy * dy);

                if (speed > 1 && speed < 15) { // Gentle movement
                    this._pettingVelocity += speed;
                    if (this._pettingVelocity > 150) { // Enough friction for a "pet"
                        this.stickman.onPet();
                        this._pettingVelocity = 0;
                    }
                }
            } else {
                canvas.style.cursor = 'default';
                this._pettingVelocity = 0;
            }

            this._lastMouseX = x;
            this._lastMouseY = y;
        });

        this._mouseControlSetup = true;
    }

    toggle(): boolean {
        if (this.isActive) {
            this.destroy();
            localStorage.setItem('ragdollPetActive', 'false');
            return false;
        } else {
            this.init();
            localStorage.setItem('ragdollPetActive', 'true');
            return true;
        }
    }

    destroy(): void {
        if (!this.isActive) return;
        this.isActive = false;
        if (this.stickman) {
            this.stickman.clearAllTimeouts();
            this.stickman.bloodParticles = [];
        }
        if (this.boundHandlers.resize) window.removeEventListener('resize', this.boundHandlers.resize);
        if (this.runner) this.Runner.stop(this.runner);
        if (this.engine) {
            this.World.clear(this.engine.world);
            this.Engine.clear(this.engine);
        }
        this.canvas.style.display = 'none';
        this.stickman = null;
        this._mouseControlSetup = false;
    }

    playSpawnSound(): void { this.audioManager?.play('spawn'); }
    playWaveSound(): void { this.audioManager?.play('wave'); }
    playJumpSound(): void { this.audioManager?.play('jump'); }
    playHurtSound(): void { this.audioManager?.play('bonk'); }
    playGrabSound(): void { this.audioManager?.play('wii', { volume: 0.5 }); }
    playDropSound(): void { this.audioManager?.play('release'); }
    playScreamSound(): void { this.audioManager?.play('scream', { volume: 0.4 }); }
    playBoingSound(): void { this.audioManager?.play('boing', { volume: 0.6 }); }

    syncDesktopOverlayPhysics(): void {
        // Sync Icons
        const icons = document.querySelectorAll('.icon');
        const iconRes = (window as any).CONFIG?.RAGDOLL?.ICON_RESTITUTION || 0.7;
        this.syncElements(icons, this.iconBodies, iconRes, 'icon');

        // Sync Sticky Notes
        const stickies = document.querySelectorAll('.sticky-note');
        const stickyRes = (window as any).CONFIG?.RAGDOLL?.STICKY_NOTE_RESTITUTION || 0.5;
        this.syncElements(stickies, this.stickyBodies, stickyRes, 'sticky');
    }

    syncElements(elements: NodeListOf<Element>, bodyMap: Map<string, any>, restitution: number, type: string): void {
        const currentIds = new Set<string>();
        elements.forEach((el, index) => {
            if (!el.id) el.id = `phys-${type}-${index}`;
            currentIds.add(el.id);

            const rect = el.getBoundingClientRect();
            if (rect.width < 5 || rect.height < 5) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let body = bodyMap.get(el.id);
            if (!body) {
                body = this.Bodies.rectangle(centerX, centerY, rect.width, rect.height, {
                    isStatic: true,
                    restitution: restitution,
                    friction: 0.1,
                    render: { fillStyle: 'transparent' }
                });
                bodyMap.set(el.id, body);
                this.overlayBodies.add(body);
                this.World.add(this.world, body);
            } else {
                this.Body.setPosition(body, { x: centerX, y: centerY });
            }
        });

        // Cleanup removed elements
        for (const [id, body] of bodyMap.entries()) {
            if (!currentIds.has(id)) {
                this.World.remove(this.world, body);
                this.overlayBodies.delete(body);
                bodyMap.delete(id);
            }
        }
    }
}
