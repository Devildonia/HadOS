/**
 * FOOTBALL RUSH V2 - PLAYER ENTITY
 */

export class Player {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 24;
        this.size = 50;

        this.inputs = { up: false, down: false, left: false, right: false };

        this.baseSpeed = 300;
        this.sprintSpeed = 500;
        this.isSprinting = false;
        this.sprintCooldown = 0;
        this.sprintDuration = 1.5;
        this.maxCooldown = 5;

        this.isInvincible = false;
        this.invincibilityTime = 1.5;
        this.invincibilityTimer = 0;

        this.image = new Image();
        this.image.src = 'assets/player.webp';
        this.hasBall = false;
    }

    triggerSprint() {
        if (this.sprintCooldown <= 0 && !this.isSprinting) {
            this.isSprinting = true;
            this.sprintCooldown = this.maxCooldown;
            this.game.audio.playSFX('sprint');

            setTimeout(() => {
                this.isSprinting = false;
            }, this.sprintDuration * 1000);
        }
    }

    onTackle() {
        this.isInvincible = true;
        this.invincibilityTimer = this.invincibilityTime;
    }

    update(dt) {
        // Cooldowns
        if (this.sprintCooldown > 0) {
            this.sprintCooldown -= dt;
        }

        if (this.isInvincible) {
            this.invincibilityTimer -= dt;
            if (this.invincibilityTimer <= 0) this.isInvincible = false;
        }

        // Movement
        const speed = this.isSprinting ? this.sprintSpeed : this.baseSpeed;
        let dx = 0;
        let dy = 0;

        if (this.inputs.up) dy -= 1;
        if (this.inputs.down) dy += 1;
        if (this.inputs.left) dx -= 1;
        if (this.inputs.right) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const factor = 1 / Math.sqrt(2);
            dx *= factor;
            dy *= factor;
        }

        this.x += dx * speed * dt;
        this.y += dy * speed * dt;

        // Constraints
        this.x = Math.max(this.radius, Math.min(this.game.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.game.height - this.radius, this.y));
    }

    checkCollision(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.radius + other.radius) * 0.8;
    }

    draw(ctx) {
        ctx.save();

        if (this.isInvincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        if (this.image.complete) {
            ctx.drawImage(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else {
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        }

        if (this.isSprinting) {
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw carried ball
        if (this.hasBall) {
            if (this.game.ballImage && this.game.ballImage.complete && this.game.ballImage.naturalWidth > 0) {
                // Draw slightly to the side to look like it's being carried
                ctx.drawImage(this.game.ballImage, this.x + 5, this.y - 10, 30, 30);
            } else {
                // DEFINITIVE FALLBACK: Yellow ellipse if image is not ready
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.ellipse(this.x + 10, this.y, 12, 8, Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        ctx.restore();
    }
}
