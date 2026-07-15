/**
 * RAGDOLL SYSTEM - PARTICLES
 * Extracted from ragdoll.js
 */

export class BloodParticle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public life: number;
    public size: number;
    public gravity: number;
    public color: string;

    constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 1.0;
        this.size = Math.random() * 3 + 2;
        this.gravity = window.CONFIG.RAGDOLL.BLOOD_GRAVITY;
        this.color = `rgb(${Math.floor(Math.random() * 50 + 139)}, 0, 0)`;
    }

    update(): boolean {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.life -= window.CONFIG.RAGDOLL.BLOOD_FADE_SPEED;
        return this.life > 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ZzzParticle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public life: number;
    public size: number;
    public fadeSpeed: number;
    public rotation: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -0.8;
        this.life = 1.0;
        this.size = Math.random() * 4 + 8;
        this.fadeSpeed = 0.01;
        this.rotation = Math.random() * Math.PI * 0.2 - Math.PI * 0.1;
    }

    update(): boolean {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.02;
        this.life -= this.fadeSpeed;
        this.rotation += 0.02;
        return this.life > 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillText('z', 0, 0);

        ctx.restore();
    }
}

export class TearParticle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public life: number;
    public size: number;
    public fadeSpeed: number;
    public gravity: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = 0.5;
        this.life = 1.0;
        this.size = Math.random() * 2 + 3;
        this.fadeSpeed = 0.015;
        this.gravity = 0.1;
    }

    update(): boolean {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.life -= this.fadeSpeed;
        return this.life > 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = this.life * 0.5;
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Global Registration for legacy compatibility
if (typeof window !== 'undefined') {
    window.BloodParticle = BloodParticle;
    window.ZzzParticle = ZzzParticle;
    window.TearParticle = TearParticle;
}
