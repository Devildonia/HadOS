/**
 * RAGDOLL SYSTEM - UNIFIED UI CONTROLLER
 * Merges legacy skins and advanced workshop features into a single tabbed Win95 interface.
 */

import type { RagdollPet } from './RagdollPet.js';
import type { Stickman } from './Stickman.js';
import type { SkinManager, Proportions, SkinConfig } from './SkinManager.js';

export class RagdollUI {
    static ragdollPet: RagdollPet | null = null;
    static stickman: Stickman | null = null;
    static manager: SkinManager | null = null;
    static selectedPart: string | null = null;

    // Window-level keyboard handlers are the only listeners that outlive the
    // Workshop window's DOM (they sit on `window`, not on the window body). We
    // keep references so re-opening the Workshop doesn't stack duplicates and
    // destroy() can remove them. In-window listeners die with the window body.
    private static _onKeyDown: ((e: KeyboardEvent) => void) | null = null;
    private static _onKeyUp: ((e: KeyboardEvent) => void) | null = null;

    static init(ragdollPet: RagdollPet): void {
        this.ragdollPet = ragdollPet;
        // stickman/manager are null until the 2D pet is actually spawned. Keep them
        // nullable so the Workshop UI can wire its tabs and sliders on open — every
        // listener below already guards on RagdollUI.manager / RagdollUI.stickman,
        // and RagdollPet.init() re-runs this with a live stickman once spawned.
        this.stickman = ragdollPet.stickman || null;
        this.manager = this.stickman ? this.stickman.skinManager : null;
        this.selectedPart = null;

        this.setupTabs();
        this.setupGlobalSliders();
        this.setupPartAdjustments();
        this.setupDropZones();
        this.setupResetButtons();
        this.setupPhysicsControls();
        this.setupVFXControls();
        this.setupKeyboardControls();
        this.generateColorGrid();

        // Ensure the Workshop is properly initialized on first show
        this.syncUIState();
        this.showTab('skins');
    }

    static syncUIState(): void {
        if (!this.manager || !this.stickman) return;

        // Sync Physics
        const props = this.manager.proportions;
        this.updateSlider('arm', props.armLength);
        this.updateSlider('leg', props.legLength);
        this.updateSlider('head', props.headScale);
        this.updateSlider('torso', props.torsoScale);

        // Sync VFX
        const config = this.manager.config;
        const softCheck = document.getElementById('check-soft') as HTMLInputElement | null;
        if (softCheck) softCheck.checked = config.softJoints;

        const shadowCheck = document.getElementById('check-shadow') as HTMLInputElement | null;
        if (shadowCheck) shadowCheck.checked = config.showShadow;

        // Sync Sliders
        this.updateLabelSlider('vfx-intensity', config.vfxIntensity || 1.0);
        this.updateLabelSlider('vfx-size', config.vfxSize || 1.0);

        // Sync Global
        const gsSlider = document.getElementById('global-scale-slider') as HTMLInputElement | null;
        if (gsSlider) gsSlider.value = String(this.stickman.globalScale);
        const gsVal = document.getElementById('global-scale-val');
        if (gsVal) gsVal.textContent = this.stickman.globalScale.toFixed(1);

        const gwSlider = document.getElementById('global-width-slider') as HTMLInputElement | null;
        if (gwSlider) gwSlider.value = String(this.stickman.globalWidthScale || 1.0);
        const gwVal = document.getElementById('global-width-val');
        if (gwVal) gwVal.textContent = (this.stickman.globalWidthScale || 1.0).toFixed(1);

        this.updateVFXButtonStates();
    }

    static updateLabelSlider(id: string, val: number): void {
        const slider = document.getElementById(`slider-${id}`) as HTMLInputElement | null;
        const valSpan = document.getElementById(`val-${id}`);
        if (slider) slider.value = String(val);
        if (valSpan) valSpan.textContent = val.toFixed(1);
    }

    static updateSlider(id: string, val: number): void {
        const slider = document.getElementById(`slider-${id}`) as HTMLInputElement | null;
        const valSpan = document.getElementById(`val-${id}`);
        if (slider) slider.value = String(val);
        if (valSpan) valSpan.textContent = val.toFixed(1);
    }

    static setupTabs(): void {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                if (targetTab) {
                    this.showTab(targetTab);
                }
                if ((window as any).playBlip) (window as any).playBlip(1100);
            });
        });
    }

    static showTab(target: string): void {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => {
            const isActive = t.getAttribute('data-tab') === target;
            t.classList.toggle('active', isActive);
            (t as HTMLElement).style.background = isActive ? '#d0d0d0' : '#c0c0c0';
        });

        document.querySelectorAll('.tab-content').forEach(pane => {
            (pane as HTMLElement).style.display = pane.id === `tab-${target}` ? 'block' : 'none';
        });
    }

    static setupGlobalSliders(): void {
        const globalScaleSlider = document.getElementById('global-scale-slider') as HTMLInputElement | null;
        const globalScaleVal = document.getElementById('global-scale-val');
        const globalWidthSlider = document.getElementById('global-width-slider') as HTMLInputElement | null;
        const globalWidthVal = document.getElementById('global-width-val');

        if (globalScaleSlider) {
            globalScaleSlider.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const val = parseFloat(target.value);
                if (globalScaleVal) globalScaleVal.textContent = String(val);
                if (RagdollUI.stickman) RagdollUI.stickman.setGlobalScale(val);
                if ((window as any).playBlip) (window as any).playBlip(1000);
            });
        }

        if (globalWidthSlider) {
            globalWidthSlider.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                const val = parseFloat(target.value);
                if (globalWidthVal) globalWidthVal.textContent = String(val);
                if (RagdollUI.stickman) RagdollUI.stickman.setGlobalWidthScale(val);
                if ((window as any).playBlip) (window as any).playBlip(1000);
            });
        }
    }

    static setupPartAdjustments(): void {
        const scaleSlider = document.getElementById('skin-scale-slider') as HTMLInputElement | null;
        const heightSlider = document.getElementById('skin-height-slider') as HTMLInputElement | null;
        const scaleVal = document.getElementById('skin-scale-val');
        const heightVal = document.getElementById('skin-height-val');

        if (scaleSlider) {
            scaleSlider.addEventListener('input', (e) => {
                if (!RagdollUI.selectedPart) return;
                const target = e.target as HTMLInputElement;
                const val = parseFloat(target.value);
                if (scaleVal) scaleVal.textContent = String(val);
                if (RagdollUI.stickman) RagdollUI.stickman.updateSkinConfig(RagdollUI.selectedPart, 'scale', val);
                if ((window as any).playBlip) (window as any).playBlip(1100);
            });
        }

        if (heightSlider) {
            heightSlider.addEventListener('input', (e) => {
                if (!RagdollUI.selectedPart) return;
                const target = e.target as HTMLInputElement;
                const val = parseFloat(target.value);
                if (heightVal) heightVal.textContent = String(val);
                if (RagdollUI.stickman) RagdollUI.stickman.updateSkinConfig(RagdollUI.selectedPart, 'y', val);
                if ((window as any).playBlip) (window as any).playBlip(1100);
            });
        }
    }

    static setupDropZones(): void {
        const zones = document.querySelectorAll('.drop-zone');
        const label = document.getElementById('selected-part-label');
        const scaleSlider = document.getElementById('skin-scale-slider') as HTMLInputElement | null;
        const heightSlider = document.getElementById('skin-height-slider') as HTMLInputElement | null;

        zones.forEach(zone => {
            const part = zone.getAttribute('data-part');
            if (!part) return;

            zone.addEventListener('click', () => {
                RagdollUI.selectedPart = part;
                if (label) label.textContent = part.charAt(0).toUpperCase() + part.slice(1);

                // Highlight selected
                zones.forEach(z => (z as HTMLElement).style.outline = 'none');
                (zone as HTMLElement).style.outline = '2px solid #000080';

                // Enable and update sliders
                if (RagdollUI.stickman) {
                    const config = (RagdollUI.stickman.skinConfig as any)[part] || { scale: 1.0, y: 0 };
                    if (scaleSlider) {
                        scaleSlider.disabled = false;
                        scaleSlider.value = String(config.scale);
                        const scaleValEl = document.getElementById('skin-scale-val');
                        if (scaleValEl) {
                            scaleValEl.textContent = scaleSlider.value;
                        }
                    }
                    if (heightSlider) {
                        heightSlider.disabled = false;
                        heightSlider.value = String(config.y);
                        const heightValEl = document.getElementById('skin-height-val');
                        if (heightValEl) {
                            heightValEl.textContent = heightSlider.value;
                        }
                    }
                }
                if ((window as any).playBlip) (window as any).playBlip(1300);
            });

            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                (zone as HTMLElement).style.background = '#e0e0ff';
            });

            zone.addEventListener('dragleave', () => {
                (zone as HTMLElement).style.background = '#fff';
            });

            zone.addEventListener('drop', (e: Event) => {
                const dragEvent = e as DragEvent;
                dragEvent.preventDefault();
                (zone as HTMLElement).style.background = '#fff';
                const file = dragEvent.dataTransfer?.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const src = event.target?.result as string;
                        if (RagdollUI.stickman) {
                            RagdollUI.stickman.updatePartImage(part, src);
                        }

                        // Update preview
                        zone.innerHTML = '';
                        const img = document.createElement('img');
                        img.src = src;
                        img.style.maxWidth = '100%';
                        img.style.maxHeight = '40px';
                        img.style.objectFit = 'contain';
                        zone.appendChild(img);

                        const cap = document.createElement('span');
                        cap.textContent = part;
                        cap.style.fontSize = '8px';
                        zone.appendChild(cap);

                        if ((window as any).playBlip) (window as any).playBlip(900);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    static setupResetButtons(): void {
        const resetBtn = document.getElementById('reset-global-scale');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (RagdollUI.stickman) {
                    RagdollUI.stickman.resetCustomSkin();
                }
                RagdollUI.syncUIState();

                document.querySelectorAll('.drop-zone').forEach(zone => {
                    const part = zone.getAttribute('data-part');
                    if (part) {
                        zone.innerHTML = `<span style="font-size: 16px;">${RagdollUI.getPartEmoji(part)}</span><span style="font-size: 9px;">${part}</span>`;
                    }
                    (zone as HTMLElement).style.background = '#fff';
                    (zone as HTMLElement).style.outline = 'none';
                });

                if ((window as any).playBlip) (window as any).playBlip(600);
            });
        }
    }

    static setupPhysicsControls(): void {
        const handle = (id: string, prop: keyof Proportions) => {
            const slider = document.getElementById(`slider-${id}`) as HTMLInputElement | null;
            const valSpan = document.getElementById(`val-${id}`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    const val = parseFloat(target.value);
                    if (valSpan) valSpan.textContent = val.toFixed(1);
                    if (RagdollUI.manager) {
                        RagdollUI.manager.setProportion(prop, val);
                    }
                    if ((window as any).playBlip) (window as any).playBlip(1050);
                });
            }
        };

        handle('arm', 'armLength');
        handle('leg', 'legLength');
        handle('head', 'headScale');
        handle('torso', 'torsoScale');
    }

    static setupVFXControls(): void {
        const softCheck = document.getElementById('check-soft') as HTMLInputElement | null;
        if (softCheck) {
            softCheck.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (RagdollUI.manager) {
                    RagdollUI.manager.config.softJoints = target.checked;
                }
                if ((window as any).playBlip) (window as any).playBlip(800);
            });
        }

        const shadowCheck = document.getElementById('check-shadow') as HTMLInputElement | null;
        if (shadowCheck) {
            shadowCheck.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (RagdollUI.manager) {
                    RagdollUI.manager.config.showShadow = target.checked;
                }
                if ((window as any).playBlip) (window as any).playBlip(800);
            });
        }

        // VFX Sliders
        const handleSlider = (id: string, prop: keyof SkinConfig) => {
            const slider = document.getElementById(`slider-${id}`) as HTMLInputElement | null;
            const valSpan = document.getElementById(`val-${id}`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    const val = parseFloat(target.value);
                    if (valSpan) valSpan.textContent = val.toFixed(1);
                    if (RagdollUI.manager) {
                        (RagdollUI.manager.config as any)[prop] = val;
                    }
                });
            }
        };

        handleSlider('vfx-intensity', 'vfxIntensity');
        handleSlider('vfx-size', 'vfxSize');

        document.querySelectorAll('.vfx-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (RagdollUI.manager) {
                    const type = btn.getAttribute('data-type');
                    if (type) {
                        const active = RagdollUI.manager.toggleEmanator(type, 'waist');
                        RagdollUI.updateVFXButtonStates();
                        if ((window as any).playBlip) (window as any).playBlip(active ? 1500 : 700);
                    }
                }
            });
        });
    }

    static updateVFXButtonStates(): void {
        if (!RagdollUI.manager) return;
        const activeTypes = RagdollUI.manager.config.emanators.map(e => e.type);
        document.querySelectorAll('.vfx-btn').forEach(btn => {
            const type = btn.getAttribute('data-type');
            if (type) {
                const isActive = activeTypes.includes(type);
                (btn as HTMLElement).style.background = isActive ? '#a0a0ff' : '#c0c0c0';
                (btn as HTMLElement).style.border = isActive ? '2px inset #fff' : '2px outset #fff';
            }
        });
    }

    static generateColorGrid(): void {
        const grid = document.getElementById('color-grid-skins');
        if (!grid) return;

        const colors = [
            '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
            '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'
        ];

        grid.innerHTML = colors.map(c => `<div class="color-cell" data-color="${c}" style="width: 100%; height: 16px; background: ${c}; border: 1px solid #808080; cursor: pointer;"></div>`).join('');

        grid.querySelectorAll('.color-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const color = cell.getAttribute('data-color');
                if (RagdollUI.manager && color) {
                    RagdollUI.manager.layers.base.tint = color;
                    if ((window as any).playBlip) (window as any).playBlip(1200);
                }
            });
        });
    }

    static getPartEmoji(part: string): string {
        const map: Record<string, string> = {
            head: '🙂',
            shirt: '👕',
            neck: '🧣',
            leftArm: '💪L',
            rightArm: '💪R',
            leftLeg: '🦵L',
            rightLeg: '🦵R'
        };
        return map[part] || '📦';
    }

    static setupKeyboardControls(): void {
        // Idempotent: drop any handlers from a previous init() before re-adding,
        // so re-opening the Workshop never accumulates window-level listeners.
        if (this._onKeyDown) window.removeEventListener('keydown', this._onKeyDown);
        if (this._onKeyUp) window.removeEventListener('keyup', this._onKeyUp);

        this._onKeyDown = (e: KeyboardEvent) => {
            if (!this.stickman || !this.ragdollPet || !this.ragdollPet.isActive) return;

            // Ignore if typing in an input/textarea
            if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            const key = e.key.toLowerCase();

            // Movement (Horizontal)
            if (key === 'a' || key === 'arrowleft') {
                this.stickman.state = 'walking';
                this.stickman.direction = -1;
                this.stickman.walkSpeed = 2.0;
            } else if (key === 'd' || key === 'arrowright') {
                this.stickman.state = 'walking';
                this.stickman.direction = 1;
                this.stickman.walkSpeed = 2.0;
            }

            // Jump
            if (key === 'w' || key === 'arrowup' || key === ' ') {
                if (this.stickman.state !== 'jumping') {
                    this.stickman.startJumping();
                }
                e.preventDefault(); // Stop scrolling with space/arrows
            }

            // Physics Toggle
            if (key === 'p') {
                if (this.stickman.physicsMode) {
                    this.stickman.deactivatePhysics();
                } else {
                    this.stickman.activatePhysics();
                }
            }

            // Reset / Stand Up
            if (key === 'r') {
                this.stickman.deactivatePhysics();
                this.stickman.standUp();
                this.stickman.state = 'idle';
                this.stickman.emotion = 'happy';
            }
        };

        this._onKeyUp = (e: KeyboardEvent) => {
            if (!this.stickman) return;
            const key = e.key.toLowerCase();
            if (['a', 'd', 'arrowleft', 'arrowright'].includes(key)) {
                if (this.stickman.state === 'walking') {
                    this.stickman.state = 'idle';
                    this.stickman.walkSpeed = 0;
                }
            }
        };

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    /** Removes the window-level keyboard listeners (call on Workshop teardown). */
    static destroy(): void {
        if (this._onKeyDown) {
            window.removeEventListener('keydown', this._onKeyDown);
            this._onKeyDown = null;
        }
        if (this._onKeyUp) {
            window.removeEventListener('keyup', this._onKeyUp);
            this._onKeyUp = null;
        }
    }
}
