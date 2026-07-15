import { CONFIG } from '../utils/Constants.js';
import { Utils } from '../utils/Math.js';
import { AudioManager } from '../systems/Audio.js';
import { UIManager } from '../systems/UIManager.js';
import { Player } from '../entities/Player.js';
import { PipeManager } from '../entities/PipeManager.js';
import { ParticleSystem } from '../entities/Particle.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true });

        this.audio = new AudioManager();
        this.ui = new UIManager(this);
        this.player = new Player(this);
        this.pipes = new PipeManager(this);
        this.particles = new ParticleSystem();

        this.scale = 1;
        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAMEOVER
        this.score = 0;
        this.pipesPassed = 0;
        this.streak = 0;
        this.best = parseInt(localStorage.getItem('flappy_neon_best') || 0);
        this.shake = 0;
        this.bgHue = 240;

        // Load leaderboard
        try { this.leaderboard = JSON.parse(localStorage.getItem('flappy_neon_lb') || '[]'); }
        catch (e) { this.leaderboard = []; }

        // Initial UI State
        this.ui.showIntro();

        // Input binding (Game logic input only, UI input handled by UIManager)
        this.inputActive = false; // Track hold state

        // Key Events
        // Input binding (Game logic input only, UI input handled by UIManager)
        this.inputActive = false; // Track hold state

        // Key Events
        window.addEventListener('keydown', e => {
            if (e.repeat) return;
            if (e.code === 'Escape') { this.togglePause(); return; }
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.inputActive = true;
                this.handleInputDown();
            }
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.inputActive = false;
                this.handleInputUp();
            }
        });

        // Pointer Events (Mouse/Touch)
        window.addEventListener('pointerdown', e => {
            if (this.state === 'INTRO') { this.endIntro(); return; }
            if (!e.target.closest('button') && !e.target.closest('input')) {
                this.inputActive = true;
                this.handleInputDown();
            }
        });
        window.addEventListener('pointerup', () => {
            this.inputActive = false;
            this.handleInputUp();
        });
        // Handle pointer leaving window as release
        window.addEventListener('pointerleave', () => {
            this.inputActive = false;
            this.handleInputUp();
        });

        // Resize
        window.addEventListener('resize', () => this.resize());
        this.resize();
        window.addEventListener('pointerup', () => {
            this.inputActive = false;
            this.handleInputUp();
        });
        // Handle pointer leaving window as release
        window.addEventListener('pointerleave', () => {
            this.inputActive = false;
            this.handleInputUp();
        });

        // Resize
        window.addEventListener('resize', () => this.resize());
        this.resize();

        // Intro Video Logic
        // We still need to control the video element for autoplay logic, 
        // but maybe we can ask UI to get it or handle it? 
        // For simplicity, let's keep the video logic here but use UI references if needed.
        // Actually, UIManager has the reference. Let's access it via this.ui.elements.video for now
        // or just move this logic to UIManager? Moving to UIManager would be cleaner but complex.
        // Let's keep it here for now as it drives game state 'INTRO'.

        const vid = this.ui.elements.video;
        vid.src = 'assets/Trailer.mp4';
        vid.muted = false;
        vid.load();

        vid.onended = () => {
            this.endIntro();
        };

        vid.onerror = (e) => {
            console.log("Video Error", e);
            this.endIntro();
        };

        vid.play().then(() => {
            console.log("Autoplay success");
        }).catch(err => {
            console.log("Unmuted autoplay failed, falling back to muted", err);
            vid.muted = true;
            vid.play().catch(e => {
                console.log("Muted autoplay also failed", e);
            });
        });

        // Loop
        let lastTime = 0;
        const shaderStart = Date.now();
        const loop = (t) => {
            const dt = Math.min((t - lastTime) / 1000, 0.05);
            lastTime = t;
            if (window.shaderBG) window.shaderBG.render((Date.now() - shaderStart) / 1000);
            this.update(dt);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

        // Force INTRO state to start
        this.state = 'INTRO';
    }

    endIntro() {
        if (this.state !== 'INTRO') return;
        this.state = 'MENU';
        this.ui.showMenu();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.scale = this.canvas.height / CONFIG.V_HEIGHT;
    }

    handleInputDown() {
        if (this.state === 'MENU') {
            this.startGame();
            // Initial flap on start
            this.player.flap();
        } else if (this.state === 'GAMEOVER') {
            // Restart handled by UI, avoid accidental restarts
        } else if (this.state === 'PLAYING') {
            // Always Flap on tap (Hybrid Mechanic: Tap to Jump, Hold to Fly)
            this.player.flap();
        }
    }

    handleInputUp() {
        // Optional: Release logic if needed
    }

    // Legacy compatibility
    handleInput(e) {
        if (e) e.preventDefault();
        this.handleInputDown();
    }

    startGame() {
        this.state = 'PLAYING';
        this.score = 0;
        this.pipesPassed = 0;
        this.streak = 0;

        this.ui.showHUD(this.score, this.best);
        this.ui.resetStreakUI();

        this.player.reset();
        this.pipes.reset();
        this.particles.reset();
        this.pipes.spawn(this.canvas.width / this.scale + 100);

        this.audio.playBGM();
    }

    resetGame() {
        this.startGame();
    }

    goToMenu() {
        this.state = 'MENU';
        this.audio.stopBGM();
        this.ui.showMenu();
        this.pipes.reset();
        this.player.reset();
        this.particles.reset();
    }

    addScore() {
        this.pipesPassed++;
        this.streak++;

        // Multiplier Logic
        let multiplier = 1;
        if (this.streak >= 50) multiplier = 10;
        else if (this.streak >= 30) multiplier = 5;
        else if (this.streak >= 20) multiplier = 4;
        else if (this.streak >= 10) multiplier = 3;
        else if (this.streak >= 5) multiplier = 2;

        this.score += multiplier;

        this.ui.updateScore(this.score);
        this.ui.updateStreak(this.streak, multiplier);

        // Score SFX
        this.audio.playScore(this.score);

        // Evolution VFX
        if (this.streak === 10 || this.streak === 30 || this.streak === 50) {
            const px = this.player.x * this.scale;
            const py = this.player.y * this.scale;
            // Big explosion for evolution
            for (let i = 0; i < 3; i++) this.particles.explode(px, py, this.scale * 1.5);
            this.shake = 15;
            this.audio.playStreak(); // Maybe a special sound here would be better later
        }

        // Milestone banners
        const milestones = [5, 10, 15, 20, 30, 50];
        if (milestones.includes(this.streak)) {
            this.ui.showStreakBanner(`${this.streak} STREAK! x${multiplier}`);
            this.shake = 8;
            this.audio.playStreak();
        }
    }

    handleCollision() {
        if (this.state === 'GAMEOVER') return;
        if (this.player.invulnerableTimer > 0) return; // Immediate ignore if already hit

        // WINGS SHIELD MECHANIC
        if (this.streak >= 10) {
            // SHIELD BREAK!
            this.streak = 0; // Reset to 0
            this.ui.updateScore(this.score);
            this.ui.resetStreakUI();

            // Visual Feedback
            this.audio.playDie(); // "Crack" sound
            this.shake = 20; // Big shake

            const px = this.player.x * this.scale;
            const py = this.player.y * this.scale;
            // Explosion of "feathers" (particles)
            for (let i = 0; i < 5; i++) this.particles.explode(px, py, this.scale * 1.2);

            this.player.invulnerableTimer = 1.5; // 1.5s invulnerability

        } else {
            // DIE
            this.gameOver();
        }
    }

    gameOver() {
        if (this.state === 'GAMEOVER') return;
        this.state = 'GAMEOVER';

        this.audio.stopBGM();
        this.audio.playDie();

        // Death particles
        const px = this.player.x * this.scale;
        const py = this.player.y * this.scale;
        this.particles.explode(px, py, this.scale);

        // Streak reset
        this.streak = 0;
        this.ui.resetStreakUI();

        // High score logic
        let isNewRecord = false;
        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('flappy_neon_best', this.best);
            isNewRecord = true;
        }

        // Check if score qualifies for top 5
        const qualifies = this.score > 0 && (
            this.leaderboard.length < 5 ||
            this.score > this.leaderboard[this.leaderboard.length - 1].score
        );

        // Show Game Over sequence via UI
        // We wait a bit to show score aggregation or just delay
        // But logic is cleaner if we just tell UI "Game Over" and let it handle presentation?
        // For now, mirroring previous logic but delegated.

        if (qualifies) {
            setTimeout(() => {
                this.ui.elements.flash.style.opacity = '0.5';
                setTimeout(() => this.ui.elements.flash.style.opacity = '0', 100);

                this.ui.elements.endScore.innerText = this.score;
                this.ui.elements.endBest.innerText = this.best;
                this.ui.showNameInput();
            }, 1200);
        } else {
            this.ui.showGameOver(this.score, this.best, isNewRecord, this.leaderboard, -1);
        }
    }

    submitName() {
        const val = this.ui.getNameInput();
        this.ui.hideNameInput();

        // Add
        this.leaderboard.push({ name: val, score: this.score });
        // Sort DESC
        this.leaderboard.sort((a, b) => b.score - a.score);
        // Keep top 5
        if (this.leaderboard.length > 5) this.leaderboard.length = 5;

        localStorage.setItem('flappy_neon_lb', JSON.stringify(this.leaderboard));

        const idx = this.leaderboard.findIndex(x => x.score === this.score && x.name === val);

        // Force show game over screen now
        this.ui.showGameOver(this.score, this.best, (this.score === this.best), this.leaderboard, idx);
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.ui.showPause(true);
            this.audio.stopBGM();
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.ui.showPause(false);
            this.audio.playBGM();
        }
    }

    update(dt) {
        // Shake decay (always run)
        if (this.shake > 0) {
            this.shake -= dt * 30;
            if (this.shake < 0) this.shake = 0;
        }

        // Always update particles (explosions need to finish)
        this.particles.update(dt);

        if (this.state !== 'PLAYING') return;

        this.player.update(dt);
        this.pipes.update(dt);
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();

        if (this.shake > 0) {
            ctx.translate(Utils.rand(-this.shake, this.shake), Utils.rand(-this.shake, this.shake));
        }

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Floor Line
        const floorY = (CONFIG.V_HEIGHT - 50) * this.scale;
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(this.canvas.width, floorY);
        ctx.stroke();

        this.pipes.draw(ctx);
        this.player.draw(ctx);
        this.particles.draw(ctx);

        ctx.restore();
    }
}
