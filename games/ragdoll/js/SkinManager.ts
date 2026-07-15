/**
 * RAGDOLL SYSTEM - SKIN MANAGER
 * Orchestrates layers, colors, and visual effects for the Ragdoll Workshop.
 */

interface LayerOffset { x: number; y: number; }

interface ImageLayer { image: string | null; scale: number; offset: LayerOffset; tint?: string | null; }

interface SkinLayers {
    base: { tint: string; opacity: number };
    clothing_top: ImageLayer;
    clothing_bottom: ImageLayer;
    shoes: ImageLayer;
    headwear: ImageLayer;
    accessories: Array<{ part: string; image: string | null; type: string }>;
}

type ImageLayerKey = 'clothing_top' | 'clothing_bottom' | 'shoes' | 'headwear';

interface Emanator { type: string; part: string; color: string; }

export interface SkinConfig {
    softJoints: boolean;
    showShadow: boolean;
    emanators: Emanator[];
    vfxIntensity: number;
    vfxSize: number;
    glowMaps: Map<string, unknown>;
    animatedPatterns: Map<string, unknown>;
}

export interface Proportions {
    armLength: number;
    legLength: number;
    torsoScale: number;
    headScale: number;
}

/** Minimal surface of Stickman that the SkinManager mutates. */
interface SkinnableStickman {
    skinEnabled?: boolean;
    rebuildSkeleton?: () => void;
}

export class SkinManager {
    public stickman: SkinnableStickman;
    public layers: SkinLayers;
    public config: SkinConfig;
    public proportions: Proportions;

    constructor(stickman: SkinnableStickman) {
        this.stickman = stickman;

        // Layers: Base, Clothes, Accessories, VFX
        this.layers = {
            base: { tint: '#000000', opacity: 1 },
            clothing_top: { image: null, scale: 1.0, offset: { x: 0, y: 0 }, tint: null },
            clothing_bottom: { image: null, scale: 1.0, offset: { x: 0, y: 0 }, tint: null },
            shoes: { image: null, scale: 1.0, offset: { x: 0, y: 0 } },
            headwear: { image: null, scale: 1.0, offset: { x: 0, y: 0 } },
            accessories: [] // Array of { part: 'hand', image: null, type: 'attachment' }
        };

        // Advanced Visuals
        this.config = {
            softJoints: false,
            showShadow: false,
            emanators: [], // Array of { type: 'fire', part: 'waist', color: '#ff4400' }
            vfxIntensity: 1.0,
            vfxSize: 1.0,
            glowMaps: new Map(), // partName -> texture/color
            animatedPatterns: new Map() // partName -> { type: 'scrolling', speed: 1.0 }
        };

        this.proportions = {
            armLength: 1.0,
            legLength: 1.0,
            torsoScale: 1.0,
            headScale: 1.0
        };
    }

    setLayerImage(layer: ImageLayerKey, image: string): void {
        const target = this.layers[layer];
        if (target) {
            target.image = image;
            this.stickman.skinEnabled = true;
        }
    }

    setProportion(prop: keyof Proportions, val: number): void {
        if (this.proportions[prop] !== undefined) {
            this.proportions[prop] = val;
            this.stickman.rebuildSkeleton?.();
        }
    }

    toggleEmanator(type: string, part: string, color: string = '#ffffff'): boolean {
        const index = this.config.emanators.findIndex(e => e.type === type && e.part === part);
        if (index > -1) {
            this.config.emanators.splice(index, 1);
            return false; // Deactivated
        } else {
            this.config.emanators.push({ type, part, color });
            return true; // Activated
        }
    }

    serialize(): string {
        return JSON.stringify({
            layers: this.layers,
            config: this.config,
            proportions: this.proportions
        });
    }

    deserialize(data: string | Record<string, unknown>): void {
        const parsed: any = typeof data === 'string' ? JSON.parse(data) : data;
        Object.assign(this.layers, parsed.layers);
        Object.assign(this.config, parsed.config);
        Object.assign(this.proportions, parsed.proportions);
    }
}
