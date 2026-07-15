import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { Ragdoll3DCore } from '../core/Ragdoll3DCore';
import { Kernel } from '../core/Kernel';
import { Services } from '../core/ServiceContainer';
import { i18n } from '../services/i18n';
import { RagdollUI } from '../../games/ragdoll/js/RagdollUI.js';

const RAGDOLL_WORKSHOP_BODY_HTML = `
    <div class="workshop-tabs"
        style="display: flex; padding: 4px 4px 0 4px; border-bottom: 1px solid #808080; background: #c0c0c0;">
        <div class="tab-btn active" data-tab="skins" data-i18n="workshop.tab_skins"
            style="padding: 4px 10px; border: 1px solid #808080; border-bottom: none; background: #c0c0c0; cursor: pointer; font-size: 11px; margin-right: 2px;">
            Skins</div>
        <div class="tab-btn" data-tab="physics" data-i18n="workshop.tab_physics"
            style="padding: 4px 10px; border: 1px solid #808080; border-bottom: none; background: #c0c0c0; cursor: pointer; font-size: 11px; margin-right: 2px;">
            Physics</div>
        <div class="tab-btn" data-tab="effects" data-i18n="workshop.tab_effects"
            style="padding: 4px 10px; border: 1px solid #808080; border-bottom: none; background: #c0c0c0; cursor: pointer; font-size: 11px; margin-right: 2px;">
            Effects</div>
        <div class="tab-btn" data-tab="test" data-i18n="workshop.tab_test"
            style="padding: 4px 10px; border: 1px solid #808080; border-bottom: none; background: #c0c0c0; cursor: pointer; font-size: 11px; margin-right: 2px;">
            Test</div>
        <div class="tab-btn" data-tab="3d-viewer" data-i18n="workshop.tab_3dviewer"
            style="padding: 4px 10px; border: 1px solid #808080; border-bottom: none; background: #c0c0c0; cursor: pointer; font-size: 11px;">
            3D Viewer</div>
    </div>

    <div class="window-body"
        style="display: flex; flex-direction: row; gap: 10px; padding: 10px; background: #c0c0c0; min-height: 380px;">

        <!-- Main Content Area -->
        <div style="flex: 1; display: flex; flex-direction: column;">

            <!-- Tab: Skins -->
            <div id="tab-skins" class="tab-content">
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 5px;">
                    <button class="win95-btn" data-action="ragdoll-skin-standard" data-i18n="workshop.standard"
                        style="flex: 1; padding: 4px;">Standard</button>
                    <button class="win95-btn" data-action="ragdoll-skin-custom" data-i18n="workshop.custom"
                        style="flex: 1; padding: 4px;">Custom</button>
                </div>

                <p data-i18n="workshop.drag_drop" style="margin: 0 0 5px 0; font-size: 11px; text-align: center;">Drag & Drop custom images (.png/.webp)</p>

                <div class="skin-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                    <div class="drop-zone" data-part="head"
                        style="border: 2px inset #fff; background: #fff; height: 55px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="font-size: 16px;">🙂</span><span style="font-size: 9px;" data-i18n="workshop.part_head">Head</span>
                    </div>
                    <div class="drop-zone" data-part="shirt"
                        style="border: 2px inset #fff; background: #fff; height: 55px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="font-size: 16px;">👕</span><span style="font-size: 9px;" data-i18n="workshop.part_shirt">Shirt</span>
                    </div>
                    <div class="drop-zone" data-part="neck"
                        style="border: 2px inset #fff; background: #fff; height: 55px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="font-size: 16px;">🧣</span><span style="font-size: 9px;" data-i18n="workshop.part_neck">Neck</span>
                    </div>
                    <div class="drop-zone" data-part="leftArm"
                        style="border: 2px inset #fff; background: #fff; height: 55px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="font-size: 16px;">💪L</span><span style="font-size: 9px;" data-i18n="workshop.part_larm">L-Arm</span>
                    </div>
                    <div class="drop-zone" data-part="rightArm"
                        style="border: 2px inset #fff; background: #fff; height: 55px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="font-size: 16px;">💪R</span><span style="font-size: 9px;" data-i18n="workshop.part_rarm">R-Arm</span>
                    </div>
                    <div class="drop-zone" data-part="leftLeg"
                        style="border: 2px inset #fff; background: #fff; height: 55px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="font-size: 16px;">🦵L</span><span style="font-size: 9px;" data-i18n="workshop.part_lleg">L-Leg</span>
                    </div>
                    <div class="drop-zone" data-part="rightLeg"
                        style="border: 2px inset #fff; background: #fff; height: 55px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
                        <span style="font-size: 16px;">🦵R</span><span style="font-size: 9px;" data-i18n="workshop.part_rleg">R-Leg</span>
                    </div>
                </div>

                <!-- Adjustments Panel -->
                <div id="skin-adjustments"
                    style="margin-top: 8px; border-top: 1px solid #808080; padding-top: 5px;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; font-weight: bold;"><span data-i18n="workshop.selection">Selection:</span> <span
                            id="selected-part-label" data-i18n="workshop.none" style="font-weight: normal; color: #000080;">None</span></p>
                    <div style="display: flex; align-items: center; margin-bottom: 3px;">
                        <span style="width: 40px; font-size: 10px;" data-i18n="workshop.size">Size:</span>
                        <input type="range" id="skin-scale-slider" min="0.5" max="2.0" step="0.1" value="1.0"
                            style="flex: 1;" disabled>
                        <span id="skin-scale-val"
                            style="width: 25px; font-size: 10px; text-align: right;">1.0</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="width: 40px; font-size: 10px;" data-i18n="workshop.height">Height:</span>
                        <input type="range" id="skin-height-slider" min="-20" max="20" step="1" value="0"
                            style="flex: 1;" disabled>
                        <span id="skin-height-val" style="width: 25px; font-size: 10px; text-align: right;">0</span>
                    </div>
                </div>
            </div>

            <!-- Tab: Physics -->
            <div id="tab-physics" class="tab-content" style="display: none;">
                <div class="control-group" style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 5px;" data-i18n="workshop.limb_proportions">Limb Proportions</label>

                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 10px;"><span data-i18n="workshop.arm_length">Arm Length:</span> <span
                                id="val-arm">1.0</span></label>
                        <input type="range" id="slider-arm" min="0.5" max="2.0" step="0.1" value="1.0"
                            style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 10px;"><span data-i18n="workshop.leg_length">Leg Length:</span> <span
                                id="val-leg">1.0</span></label>
                        <input type="range" id="slider-leg" min="0.5" max="2.0" step="0.1" value="1.0"
                            style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 10px;"><span data-i18n="workshop.head_scale">Head Scale:</span> <span
                                id="val-head">1.0</span></label>
                        <input type="range" id="slider-head" min="0.5" max="2.0" step="0.1" value="1.0"
                            style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 10px;"><span data-i18n="workshop.torso_scale">Torso Scale:</span> <span
                                id="val-torso">1.0</span></label>
                        <input type="range" id="slider-torso" min="0.5" max="2.0" step="0.1" value="1.0"
                            style="width: 100%;">
                    </div>
                </div>
            </div>

            <!-- Tab: Effects -->
            <div id="tab-effects" class="tab-content" style="display: none;">
                <div class="control-group" style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 8px;" data-i18n="workshop.visual_novelties">Visual Novelties</label>

                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <input type="checkbox" id="check-soft">
                        <label for="check-soft" style="font-size: 11px; margin-left: 5px;" data-i18n="workshop.soft_joints">Organic Soft-Joints</label>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <input type="checkbox" id="check-shadow">
                        <label for="check-shadow" style="font-size: 11px; margin-left: 5px;" data-i18n="workshop.ground_shadow">Ambient Ground Shadow</label>
                    </div>

                    <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 8px;" data-i18n="workshop.limb_tinting">Limb Tinting</label>
                    <div id="color-grid-skins"
                        style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 3px; border: 1px inset #808080; padding: 3px; background: #fff; margin-bottom: 12px;">
                        <!-- Colors injected by JS -->
                    </div>

                    <label style="display: block; font-size: 10px; font-weight: bold; margin-bottom: 5px;" data-i18n="workshop.emanations">Emanations</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 12px;">
                        <button class="vfx-btn win95-btn" data-type="fire" data-i18n="workshop.fire_trail"
                            style="font-size: 9px; padding: 3px;">Fire Trail</button>
                        <button class="vfx-btn win95-btn" data-type="stars" data-i18n="workshop.star_aura"
                            style="font-size: 9px; padding: 3px;">Star Aura</button>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 10px;"><span data-i18n="workshop.vfx_intensity">VFX Intensity:</span> <span
                                id="val-vfx-intensity">1.0</span></label>
                        <input type="range" id="slider-vfx-intensity" min="0.1" max="3.0" step="0.1" value="1.0"
                            style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 10px;"><span data-i18n="workshop.vfx_size">VFX Size:</span> <span
                                id="val-vfx-size">1.0</span></label>
                        <input type="range" id="slider-vfx-size" min="0.5" max="3.0" step="0.1" value="1.0"
                            style="width: 100%;">
                    </div>
                </div>
            </div>

            <!-- Tab: Test/Debug -->
            <div id="tab-test" class="tab-content" style="display: none;">
                <div class="control-group" style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 5px;" data-i18n="workshop.manual_control">Manual Control</label>
                    <div style="background: #fff; border: 1px inset #808080; padding: 5px; font-size: 9px; margin-bottom: 10px;">
                        <div data-i18n="workshop.help_move">Move: WASD / Arrows</div>
                        <div data-i18n="workshop.help_jump">Jump: W / Space | Drop: P</div>
                        <div data-i18n="workshop.help_reset">Reset: R (Stand up)</div>
                    </div>

                    <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 5px;" data-i18n="workshop.animations">Animations</label>
                    <div id="debug-animations"
                        style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 10px;">
                        <button class="win95-btn" data-action="ragdoll-anim-dancing" data-i18n="workshop.anim_dance"
                            style="font-size: 9px; padding: 2px;">Dance</button>
                        <button class="win95-btn" data-action="ragdoll-anim-moonwalk" data-i18n="workshop.anim_moonwalk"
                            style="font-size: 9px; padding: 2px;">Moonwalk</button>
                        <button class="win95-btn" data-action="ragdoll-anim-backflip" data-i18n="workshop.anim_backflip"
                            style="font-size: 9px; padding: 2px;">Backflip</button>
                        <button class="win95-btn" data-action="ragdoll-anim-jumping" data-i18n="workshop.anim_jump"
                            style="font-size: 9px; padding: 2px;">Jump</button>
                        <button class="win95-btn" data-action="ragdoll-anim-waving" data-i18n="workshop.anim_wave"
                            style="font-size: 9px; padding: 2px;">Wave</button>
                        <button class="win95-btn" data-action="ragdoll-anim-sitting" data-i18n="workshop.anim_sit"
                            style="font-size: 9px; padding: 2px;">Sit</button>
                        <button class="win95-btn" data-action="ragdoll-anim-laughing" data-i18n="workshop.anim_laugh"
                            style="font-size: 9px; padding: 2px;">Laugh</button>
                        <button class="win95-btn" data-action="ragdoll-anim-eating" data-i18n="workshop.anim_eat"
                            style="font-size: 9px; padding: 2px;">Eat</button>
                        <button class="win95-btn" data-action="ragdoll-anim-crying" data-i18n="workshop.anim_cry"
                            style="font-size: 9px; padding: 2px;">Cry</button>
                        <button class="win95-btn" data-action="ragdoll-anim-yawning" data-i18n="workshop.anim_sleep"
                            style="font-size: 9px; padding: 2px;">Sleep</button>
                    </div>

                    <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 5px;" data-i18n="workshop.emotions">Emotions</label>
                    <div id="debug-emotions"
                        style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                        <button class="win95-btn" data-action="ragdoll-emotion-happy" data-i18n="workshop.emo_happy"
                            style="font-size: 9px; padding: 2px;">Happy</button>
                        <button class="win95-btn" data-action="ragdoll-emotion-neutral" data-i18n="workshop.emo_neutral"
                            style="font-size: 9px; padding: 2px;">Neutral</button>
                        <button class="win95-btn" data-action="ragdoll-emotion-sad" data-i18n="workshop.emo_sad"
                            style="font-size: 9px; padding: 2px;">Sad</button>
                        <button class="win95-btn" data-action="ragdoll-emotion-angry" data-i18n="workshop.emo_angry"
                            style="font-size: 9px; padding: 2px;">Angry</button>
                        <button class="win95-btn" data-action="ragdoll-emotion-panic" data-i18n="workshop.emo_panic"
                            style="font-size: 9px; padding: 2px;">Panic</button>
                        <button class="win95-btn" data-action="ragdoll-emotion-hurt" data-i18n="workshop.emo_hurt"
                            style="font-size: 9px; padding: 2px;">Hurt</button>
                    </div>
                </div>
            </div>

            <!-- Tab: 3D Viewer -->
            <div id="tab-3d-viewer" class="tab-content" style="display: none; width: 100%; height: 100%;">
                <div style="display: flex; flex-direction: row; height: 100%; width: 100%; overflow: hidden;">
                    <!-- Glassmorphism Sidebar -->
                    <div id="ragdoll-3d-sidebar" style="width: 180px; background: rgba(192, 192, 192, 0.9); border-right: 1px solid rgba(0, 0, 0, 0.3); display: flex; flex-direction: column; padding: 5px; gap: 8px; overflow-y: auto; z-index: 10;">
                        <!-- Animations Section -->
                        <div class="sidebar-section" style="flex: 1;">
                            <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;" data-i18n="workshop.voice_commands">Comandos de Voz</div>
                            <div id="animation-list" style="display: flex; flex-direction: column; gap: 4px;">
                                <!-- Buttons will be injected here -->
                            </div>
                        </div>

                        <!-- Physics Section -->
                        <div class="sidebar-section" style="margin-top: auto; padding-top: 5px; border-top: 1px solid rgba(0,0,0,0.1);">
                            <div style="font-size: 9px; color: #444; margin-bottom: 5px; font-style: italic;" data-i18n="workshop.drag_mouse">Arrastrar con el ratón</div>
                            <button id="reset-physics-btn" class="win95-btn" style="width: 100%; font-size: 10px; height: 24px; margin-bottom: 4px;" data-i18n="workshop.reset_pose">♻️ Reset Pose</button>
                            <button id="toggle-physics-btn" class="win95-btn" style="width: 100%; font-size: 10px; height: 24px;" data-i18n="workshop.toggle_skeleton">🛠️ Ver Esqueleto</button>
                        </div>
                    </div>

                    <!-- Canvas Container -->
                    <div id="ragdoll-3d-canvas-container" style="flex: 1; position: relative; background: radial-gradient(circle at center, #2c3e50 0%, #000000 100%);">
                        <!-- Speech Bubble -->
                        <div id="ragdoll-3d-bubble" style="display: none; position: absolute; background: white; color: black; padding: 5px 10px; border: 2px solid black; border-radius: 10px; font-family: 'MS Sans Serif', Arial, sans-serif; font-size: 12px; font-weight: bold; pointer-events: none; z-index: 1000; box-shadow: 2px 2px 0px rgba(0,0,0,0.5); white-space: nowrap;">
                            <!-- Text injected by JS -->
                        </div>

                        <div id="ragdoll-3d-loader" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-family: monospace; text-align: center;">
                            <div class="spinner" style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #00ff00; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                            <div id="loading-text" data-i18n="workshop.booting">Booting Simulation...</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Global Vertical Sliders -->
        <div style="border-left: 1px solid #808080; padding-left: 10px; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center;">
            <div style="display: flex; flex-direction: row; gap: 5px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="font-size: 9px; writing-mode: vertical-rl; transform: rotate(180deg); margin-bottom: 5px;" data-i18n="workshop.scale">Scale</span>
                    <input type="range" id="global-scale-slider" min="0.5" max="2.0" step="0.1" value="1.0"
                        style="writing-mode: vertical-lr; direction: rtl; width: 18px; height: 160px;">
                    <span id="global-scale-val" style="font-size: 9px; margin-top: 2px;">1.0</span>
                </div>

                <div style="display: flex; flex-direction: column; align-items: center;">
                    <span style="font-size: 9px; writing-mode: vertical-rl; transform: rotate(180deg); margin-bottom: 5px;" data-i18n="workshop.width">Width</span>
                    <input type="range" id="global-width-slider" min="0.5" max="2.0" step="0.1" value="1.0"
                        style="writing-mode: vertical-lr; direction: rtl; width: 18px; height: 160px;">
                    <span id="global-width-val" style="font-size: 9px; margin-top: 2px;">1.0</span>
                </div>
            </div>
            <button id="reset-global-scale" class="win95-btn" style="padding: 2px 8px; font-size: 10px;" data-i18n="workshop.reset">Reset</button>
        </div>

    </div>
`;

export class Ragdoll3DViewer extends Ragdoll3DCore {
    public windowId: string = 'win-ragdoll-skins';
    private statusText: HTMLElement | null = null;
    private loaderText: HTMLElement | null = null;
    private readonly onResizeHandler: () => void;
    private initStarted: boolean = false;

    constructor() {
        super();
        // Isolate this instance's WebGL/listener resources from the desktop pet.
        this.resourceOwner = this.windowId;
        this._ensureWindow();
        
        // (Re)wire the legacy Workshop UI (tabs + sliders) against the freshly built
        // window. RagdollUI.init() is now null-safe, so it wires everything even when
        // the 2D pet isn't spawned yet — the slider listeners no-op until the pet
        // exists, and RagdollPet.init() refreshes the live stickman/manager on spawn.
        if (window.ragdollPet) {
            RagdollUI.init(window.ragdollPet);
        }

        this.container = document.getElementById('ragdoll-3d-canvas-container');
        this.statusText = document.getElementById('ragdoll-3d-status');
        this.loaderText = document.getElementById('ragdoll-3d-loader');
        this.onResizeHandler = () => this.onWindowResize();
        
        this.audioManager = Services.get('AudioManager') || null;
        
        const BubbleAnimatorCtor = Services.get('BubbleAnimator');
        if (BubbleAnimatorCtor) {
            this.bubbleAnimator = new BubbleAnimatorCtor();
        }
        
        const MessageLibraryCtor = Services.get('MessageLibrary');
        if (MessageLibraryCtor) {
            this.messageLibrary = new MessageLibraryCtor();
        }

        this.showDebug = true; // Viewer defaults to debug on.

        setTimeout(() => this.launch(), 500);
    }

    public launch(): void {
        if (this.initStarted) return;
        this.initStarted = true;
        void this.initAsync();
    }

    public async initAsync(): Promise<void> {
        this.isPlaying = true;
        this.updateStatus('Loading physical engine (@dimforge/rapier3d)...');
        
        try {
            await RAPIER.init();
            this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
            
            if (this.audioManager) {
                this.audioManager.loadSound('scream', '/games/ragdoll/assets/audio/ahh.opus');
                this.audioManager.loadSound('wii', '/games/ragdoll/assets/audio/wii.opus');
                this.audioManager.loadSound('boing', '/games/ragdoll/assets/audio/boing.opus');
            }

            this.setupThreeJS();
            await this.loadModelCore();
            
            if (this.loaderText) this.loaderText.style.display = 'none';
            this.updateStatus('Ready. Render loop active.');
            
            if (this.audioManager) this.audioManager.play('boing');

            this.animate(performance.now());
        } catch (error) {
            console.error('[Ragdoll3DViewer] Initialization failed:', error);
            this.initStarted = false;
            this.updateStatus('Error initializing Ragdoll 3D Viewer');
        }
    }

    protected override setupThreeJS(): void {
        if (!this.container) return;
        const width = this.container.clientWidth || 640;
        const height = this.container.clientHeight || 450;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202020);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(0, 1.5, 4);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Register the WebGL context so it is disposed when the window closes.
        // Without this the renderer leaked a context on every open/close, and the
        // browser's ~16-context cap would eventually kill 3D across the whole app.
        const resManager = Services.get('ResourceManager');
        if (resManager) {
            resManager.register(this.resourceOwner, 'webgl', {
                dispose: () => {
                    if (this.renderer) {
                        this.renderer.dispose();
                        this.renderer.forceContextLoss();
                    }
                }
            });
        }

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(3, 10, 10);
        dirLight.castShadow = true;
        this.scene.add(dirLight);

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        
        window.addEventListener('resize', this.onResizeHandler);
        if (resManager) {
            resManager.register(this.resourceOwner, 'listener', {
                dispose: () => {
                    window.removeEventListener('resize', this.onResizeHandler);
                }
            });
        }

        const groundColliderDesc = RAPIER.ColliderDesc.cuboid(50.0, 0.1, 50.0);
        this.world.createCollider(groundColliderDesc);

        this.setupInteractionListeners();
    }

    protected override onModelLoaded(): void {
        this.buildAnimationGui();
    }

    protected override onModelProgress(progress: number): void {
        this.updateStatus(`Loading Model: ${Math.round(progress * 100)}%`);
    }

    protected override onActionChanged(exactKey: string): void {
        const displayName = this.ANIM_MAP[exactKey] || exactKey;
        this.updateStatus(`Motion: ${displayName}`);
        
        const buttons = document.querySelectorAll('#animation-list .win95-btn');
        buttons.forEach((btn: any) => {
            if (btn.textContent.trim() === displayName) {
                btn.style.backgroundColor = '#000080';
                btn.style.color = '#fff';
            } else {
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }
        });
    }

    private updateStatus(msg: string): void {
        if (this.statusText) {
            this.statusText.textContent = msg;
        }
    }

    private buildAnimationGui(): void {
        const listContainer = document.getElementById('animation-list');
        if (!listContainer) return;

        listContainer.innerHTML = ''; 

        Object.keys(this.actions).forEach(name => {
            let displayName = name;
            const entry = Object.entries(this.ANIM_MAP).find(([key]) => 
                name.toLowerCase().startsWith(key.toLowerCase()) || 
                key.toLowerCase().startsWith(name.toLowerCase())
            );
            
            if (entry) {
                displayName = entry[1];
            }

            const btn = document.createElement('button');
            btn.className = 'win95-btn';
            btn.style.textAlign = 'left';
            btn.style.fontSize = '10px';
            btn.style.padding = '4px 8px';
            btn.style.overflow = 'hidden';
            btn.style.textOverflow = 'ellipsis';
            btn.style.whiteSpace = 'nowrap';
            btn.textContent = displayName;
            btn.title = name;
            btn.onclick = () => {
                this.setRagdollMode(false);
                this.fadeToAction(name);
            };
            listContainer.appendChild(btn);
        });

        const debugBtn = document.getElementById('toggle-physics-btn');
        if (debugBtn) {
            debugBtn.onclick = () => {
                this.showDebug = !this.showDebug;
                this.debugMeshMap.forEach(mesh => mesh.visible = this.showDebug);
            };
        }

        const resetBtn = document.getElementById('reset-physics-btn');
        if (resetBtn) {
            resetBtn.onclick = () => this.resetSimulation();
        }
    }

    private resetSimulation(): void {
        this.setRagdollMode(false);
        if (this.actions['Confident_Strut']) {
            this.fadeToAction('Confident_Strut');
        }
    }

    private onWindowResize(): void {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        if (width === 0 || height === 0) return;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'Ragdoll Workshop & Skins',
            width: 380,
            icon: '🎭'
        });
        const body = wf.getBody(this.windowId);
        if (body) {
            body.innerHTML = RAGDOLL_WORKSHOP_BODY_HTML;
            // Translate the freshly-built [data-i18n] nodes (the window is lazy, so
            // the boot-time updateDOM didn't cover it). Live switches are handled by
            // i18n.setLang() -> updateDOM() which re-scans the whole document.
            i18n.updateDOM();
        }
    }

    public override terminate(): void {
        window.removeEventListener('resize', this.onResizeHandler);
        // Drop the Workshop's window-level keyboard listeners so they don't
        // accumulate across open/close cycles.
        RagdollUI.destroy();
        this.initStarted = false;
        super.terminate();
    }
}

// Register with Kernel
Kernel.registerApp('ragdoll-skins', Ragdoll3DViewer, {
    name: 'Ragdoll Workshop',
    icon: 'assets/icons/ragdoll_skins.webp',
    singleton: true
});
