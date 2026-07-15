import { CONFIG } from '../utils/Constants.js';
import { Utils } from '../utils/Math.js';
import { Assets } from '../systems/Assets.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.sprite = Assets.getImage('neon');

        this.wings = [
            Assets.getImage('neon_wings'),   // Frame 0
            Assets.getImage('neon_wings_1'), // Frame 1
            Assets.getImage('neon_wings_2'), // Frame 2
            Assets.getImage('neon_wings_3'), // Frame 3
            Assets.getImage('neon_wings_4'), // Frame 4
            Assets.getImage('neon_wings_5')  // Frame 5
        ];

        // Animation state
        this.wingFrame = 0;
        this.wingTimer = 0;

        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = CONFIG.V_HEIGHT / 2;
        this.vy = 0;
        this.tilt = 0;
        this.trail = [];
        this.trailPool = [];
        this.radius = 38;
        this.invulnerableTimer = 0;
    }

    flap() {
        this.vy = CONFIG.JUMP_FORCE;
        this.game.shake = 5;
        this.game.audio.playJump();
    }

    update(dt) {
        // Physics
        if (this.game.streak >= 10) {
            // FLY FLIGHT MODEL (Wings)
            if (this.game.inputActive) {
                // Ascend smoothly
                const LIFT_FORCE = -1500; // Force against gravity
                this.vy += LIFT_FORCE * dt;

                // Cap upward speed to avoid rocketing
                if (this.vy < -400) this.vy = -400;
            } else {
                // Glide down (Less gravity than normal)
                this.vy += (CONFIG.GRAVITY * 0.6) * dt;
            }
        } else {
            // NORMAL FLIGHT MODEL
            this.vy += CONFIG.GRAVITY * dt;
        }

        this.y += this.vy * dt;

        // Tilt
        const targetTilt = Utils.clamp(this.vy / 1000, -0.5, 0.5);
        this.tilt = Utils.lerp(this.tilt, targetTilt, dt * 8);

        // Bounds
        if (this.y < 0) { this.y = 0; this.vy = 0; }
        const floorY = CONFIG.V_HEIGHT - 50;
        if (this.y > floorY) {
            this.y = floorY;
            this.game.gameOver();
        }

        // Animation Timer (Wing Flap)
        if (this.game.streak >= 10) {
            this.wingTimer += dt;
            const animSpeed = 0.08; // 12.5 fps for smooth motion
            if (this.wingTimer > animSpeed) {
                this.wingTimer = 0;
                // Cycle 0 to 5
                this.wingFrame = (this.wingFrame + 1) % 6;
            }
        } else {
            this.wingFrame = 0;
        }

        // Invulnerability
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
        }

        this.updateTrail(dt);
    }

    updateTrail(dt) {
        // Move trail points left
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const p = this.trail[i];
            p.x -= (CONFIG.WORLD_SPEED + (Math.min(this.game.pipesPassed / CONFIG.DIFF_PIPES, 1)) * (CONFIG.SPEED_MAX - CONFIG.WORLD_SPEED)) * dt;
            p.life -= dt;

            if (p.life <= 0) {
                this.trailPool.push(p);
                this.trail.splice(i, 1);
            }
        }

        const vW = this.game.canvas.width / this.game.scale;
        const pX = vW * 0.3;
        this.x = pX;

        const offX = -25;
        const offY = 0;
        const c = Math.cos(this.tilt);
        const s = Math.sin(this.tilt);

        const tailX = pX + (offX * c - offY * s);
        const tailY = this.y + (offX * s + offY * c);

        let t;
        if (this.trailPool.length > 0) {
            t = this.trailPool.pop();
        } else {
            t = {};
        }
        t.x = tailX;
        t.y = tailY;
        t.life = 0.4;

        this.trail.push(t);
    }

    draw(ctx) {
        // Blinking if invulnerable
        if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) return;

        const scale = this.game.scale;

        // --- TRAIL RENDER (Restored Original Style) ---
        if (this.trail.length > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';

            // Evolution Colors
            let baseHue = 180; // Cyan default
            if (this.game.streak >= 30) baseHue = 280; // Violet/Pink
            else if (this.game.streak >= 10) baseHue = 200; // Blue-ish

            for (const p of this.trail) {
                const ratio = p.life / 0.4;
                const size = 32 * ratio * scale * (this.game.streak >= 30 ? 1.5 : 1); // Thicker trail on high streak
                const alpha = ratio * 0.6;

                // Dynamic hue shift
                const hue = (baseHue + Math.min(this.game.pipesPassed * 2, 60)) % 360;

                ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x * scale, p.y * scale, size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // --- SPRITE RENDER ---
        const px = this.x * scale;
        const py = this.y * scale;
        const sizev = 160 * scale;
        const r = sizev / 2;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(this.tilt);

        // Determine which sprite to use
        let renderSprite = this.sprite;

        // Evolution Logic
        if (this.game.streak >= 10) {
            renderSprite = this.wings[this.wingFrame];
            // Fallback
            if (!renderSprite) renderSprite = this.sprite;
        }

        // Draw Sprite
        if (renderSprite && renderSprite.complete && renderSprite.naturalWidth > 0) {
            // Glow effect
            ctx.shadowBlur = (this.game.streak >= 50) ? 30 : 25;

            // Glow color matches trail
            let glowHue = 180;
            if (this.game.streak >= 30) glowHue = 280;

            ctx.shadowColor = (this.game.streak >= 50) ? '#ffffff' : `hsla(${glowHue}, 100%, 60%, 0.6)`;

            ctx.drawImage(renderSprite, -r, -r, sizev, sizev);
        } else {
            // Fallback
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * scale, 0, Math.PI * 2);
            ctx.fill();
        }

        // Specular Highlight
        const tiltNorm = Utils.clamp(this.tilt / 1.2, -1, 1);
        const scaleY = 1.0 - Math.abs(tiltNorm) * 0.15;

        ctx.save();
        ctx.scale(1, scaleY);
        ctx.globalCompositeOperation = 'overlay';
        const spec = ctx.createRadialGradient(-r * 0.25, -r * 0.3, 0, -r * 0.25, -r * 0.3, r * 0.3);
        spec.addColorStop(0, 'rgba(255,255,255,0.9)');
        spec.addColorStop(1, 'rgba(255,255,255,0.0)');
        ctx.fillStyle = spec;
        ctx.beginPath();
        ctx.arc(-r * 0.1, -r * 0.1, r * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.restore(); // end transform
    }
}
