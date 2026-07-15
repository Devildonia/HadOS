/**
 * FOOTBALL RUSH - CORE ENGINE
 * Clean game logic. All UI updates go through UI.js.
 */

import { Player } from './Player.js';
import { Defender } from './Defender.js';
import { AudioManager } from './AudioManager.js';
import { translations } from './i18n.js';
import * as UI from './UI.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) { console.error('Canvas not found'); return; }
        this.ctx = this.canvas.getContext('2d');

        // Dimensions (9:16, base 540×960)
        this.width = 540;
        this.height = 960;
        this.endzoneHeight = 100;

        // State machine: VIDEO → MENU → PLAYING → PAUSED → GAMEOVER
        this.state = 'VIDEO';

        // Game data
        this.score = 0;
        this.level = 1;
        this.tackles = 0;
        this.tacklesInPhase = 0;
        this.maxTackles = 3;
        this.difficulty = 'CASUAL';
        this.scoreSaved = false;
        this.highScores = JSON.parse(localStorage.getItem('rush_scores_v2')) || { CASUAL: [], PRO: [] };
        this.lang = localStorage.getItem('rushLang') || 'es';

        // Entities
        this.player = null;
        this.defenders = [];
        this.hasBall = false;
        this.ballX = this.width / 2;
        this.ballY = this.height / 2;

        // Assets
        this.background = new Image();
        this.background.src = 'assets/fondo.webp';
        this.ballImage = new Image();
        this.ballImage.src = 'assets/ball.webp';

        this.lastTime = 0;

        // Expose globally for external lang toggle buttons
        window.rushGame = this;

        this.init();
    }

    // ─── Initialization ─────────────────────────────────────────────────────────

    init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.audio = new AudioManager();
        this.applyLanguage(this.lang);

        this._wireButtons();
        this._wireInput();
        this._wireTouch();

        this.startIntro();
        requestAnimationFrame(t => this.loop(t));
    }

    _wireButtons() {
        const on = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.onclick = fn;
        };

        // Menu
        on('start-btn', () => this.startMatch());
        on('scores-btn', () => this.showScores());
        on('diff-casual', () => this._setDifficulty('CASUAL'));
        on('diff-pro', () => this._setDifficulty('PRO'));

        // Leaderboard
        on('close-scores-btn', () => {
            UI.hideOverlay('scores-screen');
            UI.showOverlay('menu-screen');
        });
        on('score-tab-casual', () => this.showScores('CASUAL'));
        on('score-tab-pro', () => this.showScores('PRO'));

        // Game Over
        on('retry-btn', () => this.startMatch());
        on('menu-btn', () => this.returnToMenu());

        // Pause
        on('pause-btn', () => this.pauseGame());
        on('resume-btn', () => this.resumeGame());
        on('pause-menu-btn', () => this.returnToMenu());

        // Language
        on('lang-es-btn', () => this.applyLanguage('es'));
        on('lang-en-btn', () => this.applyLanguage('en'));
    }

    _wireInput() {
        window.addEventListener('keydown', e => {
            this._handleKey(e, true);
            if (e.key === 'Escape' && this.state === 'PLAYING') this.pauseGame();
            if (e.key === 'Escape' && this.state === 'PAUSED') this.resumeGame();
        });
        window.addEventListener('keyup', e => this._handleKey(e, false));
    }

    _wireTouch() {
        const joyArea = document.getElementById('joy-area');
        const stick = document.getElementById('joystick-stick');
        const sprint = document.getElementById('joy-sprint');
        if (!joyArea || !stick) return;

        let touching = false;

        const move = e => {
            if (!touching || !this.player) return;
            const touch = e.touches[0];
            const r = joyArea.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            let dx = touch.clientX - cx;
            let dy = touch.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const max = r.width / 2;
            if (dist > max) { dx *= max / dist; dy *= max / dist; }
            stick.style.transform = `translate(${dx}px, ${dy}px)`;
            this.player.inputs.left = dx < -10;
            this.player.inputs.right = dx > 10;
            this.player.inputs.up = dy < -10;
            this.player.inputs.down = dy > 10;
        };

        joyArea.ontouchstart = e => { touching = true; move(e); };
        joyArea.ontouchmove = e => { e.preventDefault(); move(e); };
        joyArea.ontouchend = () => {
            touching = false;
            stick.style.transform = 'translate(0,0)';
            if (this.player) {
                this.player.inputs = { up: false, down: false, left: false, right: false };
            }
        };

        if (sprint) sprint.ontouchstart = e => { e.preventDefault(); if (this.player) this.player.triggerSprint(); };
    }

    _setDifficulty(diff) {
        this.difficulty = diff;
        ['CASUAL', 'PRO'].forEach(k => {
            const btn = document.getElementById(`diff-${k.toLowerCase()}`);
            if (btn) btn.classList.toggle('active', k === diff);
        });
    }

    _handleKey(e, pressed) {
        if (!this.player) return;
        const k = e.key.toLowerCase();
        if (k === 'w' || k === 'arrowup') this.player.inputs.up = pressed;
        if (k === 's' || k === 'arrowdown') this.player.inputs.down = pressed;
        if (k === 'a' || k === 'arrowleft') this.player.inputs.left = pressed;
        if (k === 'd' || k === 'arrowright') this.player.inputs.right = pressed;
        if (pressed && (k === 'shift' || k === ' ')) this.player.triggerSprint();
    }

    // ─── Intro ──────────────────────────────────────────────────────────────────

    startIntro() {
        document.body.classList.add('intro-active');

        const video = document.getElementById('intro-video');
        if (!video) { this.skipIntro(); return; }

        video.src = 'assets/intro.mp4';
        video.muted = false;
        video.load();

        video.onended = () => this.skipIntro();
        video.onerror = () => this.skipIntro();
        this._introTimeout = setTimeout(() => this.skipIntro(), 10000);

        this._skipOnInput = e => {
            if (this.state !== 'VIDEO') return;
            if (e) e.preventDefault();
            this.skipIntro();
        };
        window.addEventListener('keydown', this._skipOnInput, { once: true });
        window.addEventListener('pointerdown', this._skipOnInput, { once: true });

        video.play().catch(() => {
            video.muted = true;
            video.play().catch(() => this.skipIntro());
        });
    }

    skipIntro() {
        clearTimeout(this._introTimeout);
        window.removeEventListener('keydown', this._skipOnInput);
        window.removeEventListener('pointerdown', this._skipOnInput);

        const video = document.getElementById('intro-video');
        if (video) { video.onended = null; video.onerror = null; video.pause(); }

        document.body.classList.remove('intro-active');
        this.state = 'MENU';
        UI.showScreen('menu-screen');
        UI.setLangBar(true);
    }

    // ─── Screen Transitions ─────────────────────────────────────────────────────

    showScores(diff = null) {
        diff = diff || this.difficulty;
        UI.setScoreTab(diff);
        const t = translations[this.lang] || translations['es'];
        const scores = (this.highScores[diff] || []).slice().sort((a, b) => b.score - a.score);
        UI.renderScoresList(scores, t.noRecords);
        // Show scores on top, hide menu behind it (keep HUD if playing)
        UI.hideOverlay('menu-screen');
        UI.showOverlay('scores-screen');
    }

    startMatch() {
        // Clear all overlays and menus immediately
        UI.showScreen(null);
        UI.setGameplayUI(true);
        UI.setPauseBtn(true);
        UI.setLangBar(false);

        if (this.state === 'GAMEOVER') this._saveScore();

        this.state = 'PLAYING';
        this.score = 0;
        this.level = 1;
        this.tackles = 0;
        this.tacklesInPhase = 0;
        this.scoreSaved = false;
        this.hasBall = false;

        this._initLevel();
        UI.updateHUD(0, 1, 0);
        this.audio.playBGM();
    }

    pauseGame() {
        if (this.state !== 'PLAYING') return;
        this.state = 'PAUSED';
        UI.showOverlay('pause-screen');
        this.audio.stopBGM();
    }

    resumeGame() {
        if (this.state !== 'PAUSED') return;
        this.state = 'PLAYING';
        UI.hideOverlay('pause-screen');
        this.audio.resumeBGM();
    }

    returnToMenu() {
        if (this.state === 'GAMEOVER') this._saveScore();
        this.state = 'MENU';
        this.player = null;
        this.defenders = [];
        UI.showScreen('menu-screen');
        UI.setGameplayUI(false);
        UI.setPauseBtn(false);
        UI.setLangBar(true);
        // Clear name input
        const ni = document.getElementById('player-name');
        if (ni) ni.value = '';
        this.audio.stopBGM();
    }

    endGame() {
        this.state = 'GAMEOVER';
        this.scoreSaved = false;
        UI.setGameplayUI(false);
        UI.setPauseBtn(false);
        UI.setLangBar(true);
        UI.showGameOver(this.score);
        this.audio.stopBGM();
    }

    applyLanguage(lang) {
        this.lang = lang;
        localStorage.setItem('rushLang', lang);
        const t = translations[lang] || translations['es'];
        UI.applyTranslations(t, lang);
        // Sync external lang toggles
        if (window.updateLangButtons) window.updateLangButtons(lang);
    }

    // ─── Game Logic ─────────────────────────────────────────────────────────────

    _initLevel() {
        this.player = new Player(this.width / 2, this.height - 80, this);
        this.defenders = [];
        this.hasBall = false;
        this.ballX = this.width / 2;
        this.ballY = this.height / 2;

        const base = this.difficulty === 'PRO' ? 8 : 4;
        const mult = this.difficulty === 'PRO' ? 4 : 2;
        const count = base + (this.level * mult);
        for (let i = 0; i < count; i++) this.defenders.push(new Defender(this));
    }

    update(dt) {
        if (this.state !== 'PLAYING') return;

        this.player.update(dt);
        UI.updateSprintMeter(this.player.sprintCooldown > 0
            ? Math.max(0, 1 - this.player.sprintCooldown / this.player.maxCooldown)
            : 1);

        for (const d of this.defenders) {
            d.update(dt, this.player);
            if (this.player.checkCollision(d)) this._handleTackle();
        }

        // Ball pickup
        if (!this.hasBall) {
            const dx = this.player.x - this.ballX;
            const dy = this.player.y - this.ballY;
            if (Math.sqrt(dx * dx + dy * dy) < 50) {
                this.hasBall = true;
                this.player.hasBall = true;
                this.audio.playSFX('pickup');
            }
        }

        // Touchdown
        if (this.hasBall && this.player.y < this.endzoneHeight) {
            this._handleTouchdown();
        }
    }

    _handleTackle() {
        if (this.player.isInvincible) return;
        if (this.hasBall) {
            this.tackles++;
            this.tacklesInPhase++;
            this.audio.playSFX('tackle');
            UI.updateHUD(this.score, this.level, this.tackles);
            if (this.tackles >= this.maxTackles) {
                this.endGame();
                return;
            }
        }
        this.player.onTackle();
    }

    _handleTouchdown() {
        this.state = 'TOUCHDOWN';
        const phaseScore = Math.max(20, 100 - (this.tacklesInPhase * 20));
        this.score += phaseScore;
        this.level++;
        this.tacklesInPhase = 0;
        this.audio.playSFX('touchdown');
        UI.updateHUD(this.score, this.level, this.tackles);

        const td = document.getElementById('touchdown-screen');
        if (td) td.classList.remove('hidden');

        setTimeout(() => {
            if (td) td.classList.add('hidden');
            this.state = 'PLAYING';
            this._initLevel();
        }, 1500);
    }

    _saveScore() {
        if (this.scoreSaved || this.score <= 0) return;
        const ni = document.getElementById('player-name');
        const name = (ni && ni.value.trim()) ? ni.value.trim().toUpperCase() : 'ANON';
        if (!this.highScores[this.difficulty]) this.highScores[this.difficulty] = [];
        this.highScores[this.difficulty].push({ name, score: this.score, date: new Date().toLocaleDateString() });
        this.highScores[this.difficulty].sort((a, b) => b.score - a.score);
        this.highScores[this.difficulty] = this.highScores[this.difficulty].slice(0, 10);
        localStorage.setItem('rush_scores_v2', JSON.stringify(this.highScores));
        this.scoreSaved = true;
    }

    // ─── Render ─────────────────────────────────────────────────────────────────

    draw() {
        if (this.state === 'VIDEO') return;

        // Background
        if (this.background.complete && this.background.naturalWidth > 0) {
            this.ctx.drawImage(this.background, 0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = '#1e6b3a';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Yard lines
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.lineWidth = 2;
        for (let i = 1; i < 10; i++) {
            const y = this.endzoneHeight + (i * (this.height - this.endzoneHeight) / 10);
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        // Endzone
        this.ctx.fillStyle = 'rgba(245,166,35,0.8)';
        this.ctx.fillRect(0, 0, this.width, this.endzoneHeight);

        // Entities
        if (this.player) this.player.draw(this.ctx);
        this.defenders.forEach(d => d.draw(this.ctx));

        // Ball
        if (!this.hasBall && this.ballImage.complete) {
            this.ctx.drawImage(this.ballImage, this.ballX - 25, this.ballY - 25, 50, 50);
        }
    }

    loop(time) {
        const dt = Math.min((time - this.lastTime) / 1000, 0.05); // cap at 50ms
        this.lastTime = time;
        this.update(dt);
        this.draw();
        requestAnimationFrame(t => this.loop(t));
    }
}

// ─── Boot ───────────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Game());
} else {
    new Game();
}
