import { CONFIG } from '../utils/Constants.js';
import { Utils } from '../utils/Math.js';
import { PipeShader } from '../graphics/PipeShader.js';

export class PipeManager {
    constructor(game) {
        this.game = game;
        this.pipes = [];
        this.pipeShader = new PipeShader();
        this._shaderTime = 0;
        this.reset();
    }

    reset() {
        this.pipes = [];
        this.timer = 0;
    }

    update(dt) {
        this._shaderTime += dt; // Full speed — slowdown is applied inside the GLSL

        // Dificultad progresiva basada en tuberías pasadas
        const progress = Math.min(this.game.pipesPassed / CONFIG.DIFF_PIPES, 1);
        const speed = CONFIG.WORLD_SPEED + progress * (CONFIG.SPEED_MAX - CONFIG.WORLD_SPEED);
        const gap = CONFIG.PIPE_GAP - progress * (CONFIG.PIPE_GAP - CONFIG.GAP_MIN);

        // Spawn
        const vW = this.game.canvas.width / this.game.scale;

        if (this.pipes.length === 0) {
            this.spawn(vW + 200, gap);
        } else {
            const lastPipe = this.pipes[this.pipes.length - 1];
            if ((vW + 200) - lastPipe.x >= CONFIG.PIPE_SPACING) {
                this.spawn(vW + 200, gap);
            }
        }

        // Move & Collision
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const p = this.pipes[i];
            p.x -= speed * dt;

            // Remove if off screen
            if (p.x < -CONFIG.PIPE_WIDTH - 100) {
                this.pipes.splice(i, 1);
                continue;
            }

            // Score
            if (!p.passed && p.x < this.game.player.x) {
                p.passed = true;
                this.game.addScore();
            }

            // Collision
            const pX = p.x;
            const pW = CONFIG.PIPE_WIDTH;
            const topH = p.y - p.gap / 2;
            const botY = p.y + p.gap / 2;

            const player = this.game.player;

            // Top Pipe
            if (Utils.circleRectCollide(player.x, player.y, player.radius, pX, 0, pW, topH)) {
                this.game.handleCollision();
            }
            // Bot Pipe
            if (Utils.circleRectCollide(player.x, player.y, player.radius, pX, botY, pW, 9999)) {
                this.game.handleCollision();
            }
        }
    }

    spawn(x, gap) {
        const gapSize = gap || CONFIG.PIPE_GAP;
        const minCenter = 180 + gapSize / 2;
        const maxCenter = CONFIG.V_HEIGHT - 180 - gapSize / 2;
        const y = Utils.rand(minCenter, maxCenter);

        this.pipes.push({
            x: x,
            y: y,
            gap: gapSize,
            passed: false,
            hue: Utils.rand(180, 320)
        });
    }

    draw(ctx) {
        if (!this.pipeShader.gl) {
            // WebGL unavailable fallback: old flat style
            this._drawFallback(ctx);
            return;
        }

        const scale = this.game.scale;
        const t = this._shaderTime;

        for (const p of this.pipes) {
            const x = p.x * scale;
            const w = CONFIG.PIPE_WIDTH * scale;
            const topH = (p.y - p.gap / 2) * scale;
            const botY = (p.y + p.gap / 2) * scale;
            const botH = ctx.canvas.height - botY;

            // Render the shader texture for this pipe's hue
            const { col1, col2 } = PipeShader.hueToColors(p.hue);
            this.pipeShader.render(t, col1, col2);

            // Tile the shader canvas as a pattern inside each pipe rect
            const pattern = ctx.createPattern(this.pipeShader.canvas, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(x, 0, w, topH);
            ctx.fillRect(x, botY, w, botH);

            // Neon glow stroke on top
            const color = `hsla(${p.hue}, 100%, 60%`;
            ctx.lineWidth = 14 * scale;
            ctx.strokeStyle = `${color}, 0.22)`;
            ctx.strokeRect(x, 0, w, topH);
            ctx.strokeRect(x, botY, w, botH);

            ctx.lineWidth = 2.5 * scale;
            ctx.strokeStyle = `${color}, 1.0)`;
            ctx.strokeRect(x, 0, w, topH);
            ctx.strokeRect(x, botY, w, botH);

            // --- VOLUMETRIC SHADOW (cylinder illusion) ---
            // Left shadow: dark edge fading to transparent
            const gradL = ctx.createLinearGradient(x, 0, x + w * 0.45, 0);
            gradL.addColorStop(0, 'rgba(0,0,0,0.70)');
            gradL.addColorStop(0.4, 'rgba(0,0,0,0.15)');
            gradL.addColorStop(1, 'rgba(0,0,0,0.0)');
            ctx.fillStyle = gradL;
            ctx.fillRect(x, 0, w, topH);
            ctx.fillRect(x, botY, w, botH);

            // Right shadow: dark edge fading to transparent
            const gradR = ctx.createLinearGradient(x + w, 0, x + w * 0.55, 0);
            gradR.addColorStop(0, 'rgba(0,0,0,0.70)');
            gradR.addColorStop(0.4, 'rgba(0,0,0,0.15)');
            gradR.addColorStop(1, 'rgba(0,0,0,0.0)');
            ctx.fillStyle = gradR;
            ctx.fillRect(x, 0, w, topH);
            ctx.fillRect(x, botY, w, botH);

            // Center highlight: thin bright stripe for specular gleam
            const cx = x + w * 0.38;
            const gradC = ctx.createLinearGradient(cx, 0, cx + w * 0.22, 0);
            gradC.addColorStop(0, 'rgba(255,255,255,0.0)');
            gradC.addColorStop(0.5, 'rgba(255,255,255,0.12)');
            gradC.addColorStop(1, 'rgba(255,255,255,0.0)');
            ctx.fillStyle = gradC;
            ctx.fillRect(cx, 0, w * 0.22, topH);
            ctx.fillRect(cx, botY, w * 0.22, botH);

            // Cap highlight bar
            ctx.fillStyle = `${color}, 0.55)`;
            ctx.fillRect(x, topH - 18 * scale, w, 18 * scale);
            ctx.fillRect(x, botY, w, 18 * scale);
        }
    }

    _drawFallback(ctx) {
        const scale = this.game.scale;
        ctx.lineWidth = 3 * scale;
        for (const p of this.pipes) {
            const x = p.x * scale;
            const w = CONFIG.PIPE_WIDTH * scale;
            const topH = (p.y - p.gap / 2) * scale;
            const botY = (p.y + p.gap / 2) * scale;
            const botH = ctx.canvas.height - botY;
            const color = `hsla(${p.hue}, 100%, 60%`;
            ctx.fillStyle = `${color}, 0.15)`;
            ctx.strokeStyle = `${color}, 1.0)`;
            ctx.fillRect(x, 0, w, topH); ctx.strokeRect(x, 0, w, topH);
            ctx.fillRect(x, botY, w, botH); ctx.strokeRect(x, botY, w, botH);
        }
    }
}
