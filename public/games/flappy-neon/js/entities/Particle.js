export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.pool = [];
    }

    explode(x, y, scale) {
        const colors = ['#00f3ff', '#bc13fe', '#ff0055', '#ffff00', '#ffffff'];
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 200 + Math.random() * 600;

            let p;
            if (this.pool.length > 0) {
                p = this.pool.pop();
            } else {
                p = {};
            }

            p.x = x;
            p.y = y;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.life = 0.6 + Math.random() * 0.6;
            p.maxLife = p.life;
            p.size = (3 + Math.random() * 6) * scale;
            p.color = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push(p);
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 800 * dt; // gravity

            if (p.life <= 0) {
                this.pool.push(p);
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const p of this.particles) {
            const ratio = p.life / p.maxLife;
            ctx.globalAlpha = ratio;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    reset() { this.particles = []; }
}
