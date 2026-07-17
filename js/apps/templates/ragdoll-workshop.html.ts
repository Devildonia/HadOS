/**
 * RAGDOLL WORKSHOP BODY HTML
 * Extracted template for the Ragdoll 3D Viewer application.
 */
export const RAGDOLL_WORKSHOP_BODY_HTML = `
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
                    <button class="hados-btn" data-action="ragdoll-skin-standard" data-i18n="workshop.standard"
                        style="flex: 1; padding: 4px;">Standard</button>
                    <button class="hados-btn" data-action="ragdoll-skin-custom" data-i18n="workshop.custom"
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
                        <button class="vfx-btn hados-btn" data-type="fire" data-i18n="workshop.fire_trail"
                            style="font-size: 9px; padding: 3px;">Fire Trail</button>
                        <button class="vfx-btn hados-btn" data-type="stars" data-i18n="workshop.star_aura"
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
                        <button class="hados-btn" data-action="ragdoll-anim-dancing" data-i18n="workshop.anim_dance"
                            style="font-size: 9px; padding: 2px;">Dance</button>
                        <button class="hados-btn" data-action="ragdoll-anim-moonwalk" data-i18n="workshop.anim_moonwalk"
                            style="font-size: 9px; padding: 2px;">Moonwalk</button>
                        <button class="hados-btn" data-action="ragdoll-anim-backflip" data-i18n="workshop.anim_backflip"
                            style="font-size: 9px; padding: 2px;">Backflip</button>
                        <button class="hados-btn" data-action="ragdoll-anim-jumping" data-i18n="workshop.anim_jump"
                            style="font-size: 9px; padding: 2px;">Jump</button>
                        <button class="hados-btn" data-action="ragdoll-anim-waving" data-i18n="workshop.anim_wave"
                            style="font-size: 9px; padding: 2px;">Wave</button>
                        <button class="hados-btn" data-action="ragdoll-anim-sitting" data-i18n="workshop.anim_sit"
                            style="font-size: 9px; padding: 2px;">Sit</button>
                        <button class="hados-btn" data-action="ragdoll-anim-laughing" data-i18n="workshop.anim_laugh"
                            style="font-size: 9px; padding: 2px;">Laugh</button>
                        <button class="hados-btn" data-action="ragdoll-anim-eating" data-i18n="workshop.anim_eat"
                            style="font-size: 9px; padding: 2px;">Eat</button>
                        <button class="hados-btn" data-action="ragdoll-anim-crying" data-i18n="workshop.anim_cry"
                            style="font-size: 9px; padding: 2px;">Cry</button>
                        <button class="hados-btn" data-action="ragdoll-anim-yawning" data-i18n="workshop.anim_sleep"
                            style="font-size: 9px; padding: 2px;">Sleep</button>
                    </div>

                    <label style="display: block; font-size: 11px; font-weight: bold; margin-bottom: 5px;" data-i18n="workshop.emotions">Emotions</label>
                    <div id="debug-emotions"
                        style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                        <button class="hados-btn" data-action="ragdoll-emotion-happy" data-i18n="workshop.emo_happy"
                            style="font-size: 9px; padding: 2px;">Happy</button>
                        <button class="hados-btn" data-action="ragdoll-emotion-neutral" data-i18n="workshop.emo_neutral"
                            style="font-size: 9px; padding: 2px;">Neutral</button>
                        <button class="hados-btn" data-action="ragdoll-emotion-sad" data-i18n="workshop.emo_sad"
                            style="font-size: 9px; padding: 2px;">Sad</button>
                        <button class="hados-btn" data-action="ragdoll-emotion-angry" data-i18n="workshop.emo_angry"
                            style="font-size: 9px; padding: 2px;">Angry</button>
                        <button class="hados-btn" data-action="ragdoll-emotion-panic" data-i18n="workshop.emo_panic"
                            style="font-size: 9px; padding: 2px;">Panic</button>
                        <button class="hados-btn" data-action="ragdoll-emotion-hurt" data-i18n="workshop.emo_hurt"
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
                            <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;" data-i18n="workshop.voice_commands">Voice Commands</div>
                            <div id="animation-list" style="display: flex; flex-direction: column; gap: 4px;">
                                <!-- Buttons will be injected here -->
                            </div>
                        </div>

                        <!-- Physics Section -->
                        <div class="sidebar-section" style="margin-top: auto; padding-top: 5px; border-top: 1px solid rgba(0,0,0,0.1);">
                            <div style="font-size: 9px; color: #444; margin-bottom: 5px; font-style: italic;" data-i18n="workshop.drag_mouse">Drag with the mouse</div>
                            <button id="reset-physics-btn" class="hados-btn" style="width: 100%; font-size: 10px; height: 24px; margin-bottom: 4px;" data-i18n="workshop.reset_pose">♻️ Reset Pose</button>
                            <button id="toggle-physics-btn" class="hados-btn" style="width: 100%; font-size: 10px; height: 24px;" data-i18n="workshop.toggle_skeleton">🛠️ View Skeleton</button>
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
            <button id="reset-global-scale" class="hados-btn" style="padding: 2px 8px; font-size: 10px;" data-i18n="workshop.reset">Reset</button>
        </div>

    </div>
`;
