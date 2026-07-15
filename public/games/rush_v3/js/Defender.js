/**
 * FOOTBALL RUSH V2 - DEFENDER ENTITY
 */

export class Defender {
    constructor(game) {
        this.game = game;
        this.radius = 22;
        this.size = 44;
        this.reset();

        this.image = new Image();
        this.image.src = 'assets/defender.webp';
    }

    reset() {
        // Spawn randomly outside or at the top
        const side = Math.random() < 0.5 ? 'top' : (Math.random() < 0.5 ? 'left' : 'right');

        if (side === 'top') {
            this.x = Math.random() * this.game.width;
            this.y = -50;
        } else if (side === 'left') {
            this.x = -50;
            this.y = Math.random() * this.game.height;
        } else {
            this.x = this.game.width + 50;
            this.y = Math.random() * this.game.height;
        }

        this.speed = 150 + (this.game.level * 40);
        this.angle = Math.random() * Math.PI * 2;
        this.driftSpeed = 80;
    }

    update(dt, player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Even more dynamic chase logic: increase tracking range and aggression
        if (dist < 500) {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed * dt;
            this.y += Math.sin(angle) * this.speed * dt;
        } else {
            // Drift logic
            this.angle += (Math.random() - 0.5) * 0.2;
            this.x += Math.cos(this.angle) * this.driftSpeed * dt;
            this.y += Math.sin(this.angle) * this.driftSpeed * dt;
        }

        // Respawn if too far
        if (this.x < -100 || this.x > this.game.width + 100 ||
            this.y < -100 || this.y > this.game.height + 100) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 12, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (this.image.complete) {
            ctx.drawImage(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }
}
