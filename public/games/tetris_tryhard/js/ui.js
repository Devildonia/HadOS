/**
 * ui.js — Tetris Tryhard UI Controller
 * Pure DOM layer: screen visibility, stats, leaderboard, i18n, input wiring.
 * No game state lives here — all logic delegated to GameController.
 */

import { PIECE_TYPES, SHAPES } from './constants.js';
import { translations } from './i18n.js';

export class UIController {
    /**
     * @param {import('./render.js').TetrisRender} render
     * @param {import('./audio.js').TetrisAudio} audio
     */
    constructor(render, audio) {
        this.render = render;
        this.audio = audio;

        /** @type {import('./Game.js').GameController | null} */
        this.game = null;  // set after GameController is created

        this.currentLanguage = localStorage.getItem('tetrisLang') || 'es';

        this.pieceImages = {};
        this._preloadAssets();

        this.updateHighScoreDisplay();
        this.setLanguage(this.currentLanguage);
    }

    /** Called once by index.html after both objects are created. */
    bindGame(game) {
        this.game = game;
        this._initEventListeners();
        this._initTouchGestures();
    }

    // ────────────────────────────────────────────────────────────────────────
    //  Callbacks invoked by GameController
    // ────────────────────────────────────────────────────────────────────────

    onGameStart() {
        this.hideScreen('mainMenu');
        this._el('gameOver').classList.add('hidden');
        this._el('highScoreEntry').classList.add('hidden');
        this._el('pauseBtn').disabled = false;
        const t = translations[this.currentLanguage];
        this._el('pauseBtn').textContent = t.pause;
    }

    onPauseChange(paused) {
        const t = translations[this.currentLanguage];
        this._el('pauseBtn').textContent = paused ? t.resume : t.pause;
    }

    onGameOver(score) {
        this._el('finalScore').textContent = score.toLocaleString();
        const lb = this._getLeaderboard();

        // Show Game Over overlay first
        const go = this._el('gameOver');
        go.classList.remove('hidden');
        go.classList.add('flex');

        if (lb.length < 10 || score > lb[lb.length - 1].score) {
            // New record! Show name entry, hide regular actions
            this._el('highScoreEntry').classList.remove('hidden');
            this._el('gameOverActions').classList.add('hidden');
            this._el('playerName').value = '';
            setTimeout(() => this._el('playerName').focus(), 100);
        } else {
            // No record, just show normal actions
            this._el('highScoreEntry').classList.add('hidden');
            this._el('gameOverActions').classList.remove('hidden');
        }
    }

    /** Called by GameController every time the board state changes. */
    refresh(board, currentPiece, ghostPiece, nextPieces, heldPiece, pieceConfig) {
        this.render.drawBoard(board, currentPiece, ghostPiece, this.pieceImages, pieceConfig);

        // Next queue
        this.render.nextCtx.fillStyle = '#0a0e27';
        this.render.nextCtx.fillRect(0, 0, 120, 360);
        nextPieces.forEach((p, i) => {
            this.render.drawPiece(
                this.render.nextCtx,
                { ...p, x: 0, y: 0 },
                30,
                (4 - SHAPES[p.type][0].length) * 15,
                (i * 4 + (4 - SHAPES[p.type].length) / 2) * 30,
                this.pieceImages,
                pieceConfig
            );
        });

        // Hold box
        this.render.holdCtx.fillStyle = '#0a0e27';
        this.render.holdCtx.fillRect(0, 0, 120, 120);
        if (heldPiece) {
            this.render.drawPiece(
                this.render.holdCtx,
                { type: heldPiece, x: 0, y: 0, rotation: 0 },
                30,
                (4 - SHAPES[heldPiece][0].length) * 15,
                (4 - SHAPES[heldPiece].length) * 15,
                this.pieceImages,
                pieceConfig
            );
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    //  Stats & Leaderboard
    // ────────────────────────────────────────────────────────────────────────

    updateStats(score, lines, level) {
        this._el('score').textContent = score.toLocaleString();
        this._el('lines').textContent = lines;
        this._el('level').textContent = level;
        // Show the rank name for this level
        const t = translations[this.currentLanguage];
        const name = (t.levelNames && t.levelNames[level]) || t.levelNames[t.levelNames.length - 1];
        const rankEl = this._el('rankName');
        if (rankEl) rankEl.textContent = name;
    }

    // ── Gravity Flip Methods ─────────────────────────────────────────────────

    setGravityFlip(active) {
        const canvas = document.getElementById('gameCanvas');
        const badge = document.getElementById('gravityBadge');
        if (canvas) canvas.classList.toggle('gravity-inverted', active);
        if (badge) badge.classList.toggle('hidden', !active);
    }

    showGravityFlipWarning() {
        const overlay = document.getElementById('gravityWarningOverlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');
        overlay.classList.add('visible');
        setTimeout(() => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.classList.add('hidden'), 500);
        }, 2500);
    }

    showBonusMessage(text, color = '#00f0ff') {
        const overlay = document.getElementById('bonusMessageOverlay');
        if (!overlay) return;
        overlay.textContent = text;
        overlay.style.color = color;
        overlay.style.textShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
        overlay.classList.remove('hidden');
        overlay.classList.add('visible');
        setTimeout(() => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.classList.add('hidden'), 400);
        }, 2000);
    }

    updateHighScoreDisplay() {
        const lb = this._getLeaderboard();

        // Sidebar mini-list
        this._el('leaderboardDisplay').innerHTML = lb.slice(0, 5).map((e, i) => `
            <div class="lb-row ${i === 0 ? 'lb-row--top' : ''}">
                <span class="lb-rank">${i === 0 ? '🥇' : (i + 1) + '.'}</span>
                <span class="lb-name">${e.name}</span>
                <span class="lb-score">${e.score.toLocaleString()}</span>
            </div>
        `).join('') || '<p class="lb-empty">No scores yet</p>';

        // Full scores screen
        const full = this._el('leaderboardFullDisplay');
        if (full) {
            const t = translations[this.currentLanguage];
            full.innerHTML = lb.slice(0, 10).map((e, i) => `
                <div class="lb-full-row ${i === 0 ? 'lb-full-row--top' : ''}">
                    <div class="lb-full-left">
                        <span class="lb-full-rank ${i === 0 ? 'lb-full-rank--top' : ''}">${String(i + 1).padStart(2, '0')}</span>
                        <span class="lb-full-name">${e.name}</span>
                    </div>
                    <span class="lb-full-score">${e.score.toLocaleString()}</span>
                </div>
            `).join('') || `<p class="lb-empty">${t.emptyArchives}</p>`;
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    //  Screen management
    // ────────────────────────────────────────────────────────────────────────

    showScreen(id) {
        const el = this._el(id);
        el.classList.remove('hidden');
        el.classList.add('flex');
    }

    hideScreen(id) {
        const el = this._el(id);
        el.classList.add('hidden');
        el.classList.remove('flex');
    }

    // ────────────────────────────────────────────────────────────────────────
    //  i18n
    // ────────────────────────────────────────────────────────────────────────

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('tetrisLang', lang);
        const t = translations[lang];

        const map = {
            'i18n-title': t.title.replace(' ', '<br>'),
            'menuPlayBtn': t.menuPlay,
            'menuScoresBtn': t.menuScores,
            'i18n-hallOfFame': t.hallOfFame,
            'scoresBackBtn': t.backToMenu,
            'i18n-holdLabel': t.hold,
            'i18n-scoreLabel': t.score,
            'i18n-linesLabel': t.lines,
            'i18n-levelLabel': t.level,
            'i18n-top5Label': t.top5,
            'i18n-gameOverLabel': t.gameOver,
            'i18n-finalScoreLabel': t.score,
            'restartBtn': t.retry,
            'backToMenuBtn': t.backToStart,
            'i18n-newRecordLabel': t.newRecord,
            'i18n-enterNameLabel': t.enterName,
            'saveHighScore': t.saveScore,
            'i18n-nextLabel': t.nextPieces || 'NEXT',
            'i18n-controlsLabel': t.controls,
            'resetBtn': t.reset,
        };

        for (const [id, value] of Object.entries(map)) {
            const el = this._el(id);
            if (!el) continue;
            if (id === 'i18n-title') el.innerHTML = value;
            else el.textContent = value;
        }

        // Pause btn respects current pause state
        if (this.game) {
            this._el('pauseBtn').textContent = this.game.paused ? t.resume : t.pause;
        } else {
            this._el('pauseBtn').textContent = t.pause;
        }

        // Controls list
        const controls = [t.move, t.rotate, t.softDrop, t.hardDrop, t.hold,
        t.rotateCCW + ' / ' + t.rotateCW];
        this._el('i18n-controlsList').innerHTML = controls.map(c => `<p>${c}</p>`).join('');

        // Language button active state
        ['langEs', 'langEn'].forEach(btnId => {
            const btn = this._el(btnId);
            if (!btn) return;
            const isActive = (btnId === 'langEs' && lang === 'es') ||
                (btnId === 'langEn' && lang === 'en');
            btn.dataset.active = isActive ? 'true' : 'false';
        });

        this._updateAudioLabels();
        this.updateHighScoreDisplay();
    }

    // ────────────────────────────────────────────────────────────────────────
    //  Private
    // ────────────────────────────────────────────────────────────────────────

    _el(id) { return document.getElementById(id); }

    _getLeaderboard() {
        return JSON.parse(localStorage.getItem('tetrisLeaderboard') || '[]');
    }

    _handleSaveScore() {
        const name = this._el('playerName').value.trim() || 'Anon';
        let lb = this._getLeaderboard();
        lb.push({ score: this.game.score, name: name.substring(0, 6), date: new Date().toISOString() });
        lb.sort((a, b) => b.score - a.score);
        localStorage.setItem('tetrisLeaderboard', JSON.stringify(lb.slice(0, 10)));

        this.updateHighScoreDisplay();
        this._el('highScoreEntry').classList.add('hidden');
        this._el('gameOverActions').classList.remove('hidden');
        this.audio.playSFX('place');
    }

    _updateAudioLabels() {
        const t = translations[this.currentLanguage];
        const set = (id, val) => { const el = this._el(id); if (el) el.textContent = val; };
        set('muteText', `${t.music} ${this.audio.musicMuted ? t.off : t.on}`);
        set('sfxText', `${t.sfx}   ${this.audio.sfxMuted ? t.off : t.on}`);
        set('muteIcon', this.audio.musicMuted ? '🔇' : '🔊');
        set('sfxIcon', this.audio.sfxMuted ? '🔇' : '🔊');
        set('muteText-m', this.audio.musicMuted ? t.muteShort : t.musicShort);
        set('sfxText-m', this.audio.sfxMuted ? t.offShort : t.sfxShort);
        set('muteIcon-m', this.audio.musicMuted ? '🔇' : '🔊');
        set('sfxIcon-m', this.audio.sfxMuted ? '🔇' : '🔊');
    }

    _preloadAssets() {
        PIECE_TYPES.forEach(type => {
            const img = new Image();
            img.src = `assets/${type}.webp`;
            img.onload = () => { this.pieceImages[type] = img; };
        });
    }

    _initEventListeners() {
        // Menu
        this._on('menuPlayBtn', 'click', () => this.game.start());
        this._on('menuScoresBtn', 'click', () => {
            this.showScreen('highScoresScreen');
            this.updateHighScoreDisplay();
        });
        this._on('scoresBackBtn', 'click', () => this.hideScreen('highScoresScreen'));

        // Game Over
        this._on('restartBtn', 'click', () => {
            this._el('gameOver').classList.add('hidden');
            this.game.start();
        });
        this._on('backToMenuBtn', 'click', () => {
            this._el('gameOver').classList.add('hidden');
            this.game.reset();
        });

        // In-game controls
        this._on('pauseBtn', 'click', () => this.game.togglePause());
        this._on('resetBtn', 'click', () => this.game.reset());

        // Audio
        this._on('muteBtn', 'click', () => {
            this.audio.toggleMusic();
            this._updateAudioLabels();
        });
        this._on('sfxBtn', 'click', () => {
            this.audio.toggleSFX();
            this._updateAudioLabels();
        });
        this._onMaybe('muteBtn-m', 'click', () => {
            this.audio.toggleMusic();
            this._updateAudioLabels();
        });
        this._onMaybe('sfxBtn-m', 'click', () => {
            this.audio.toggleSFX();
            this._updateAudioLabels();
        });

        // Score save
        this._on('saveHighScore', 'click', () => this._handleSaveScore());

        // Language
        this._on('langEs', 'click', () => this.setLanguage('es'));
        this._on('langEn', 'click', () => this.setLanguage('en'));

        // Keyboard
        document.addEventListener('keydown', e => this._handleKeyboard(e));
    }

    _initTouchGestures() {
        const canvas = this.render.gameCanvas;
        let touchStartX = 0, touchStartY = 0, lastMoveX = 0, lastMoveY = 0;
        let isMoving = false;
        const THRESHOLD = 30;

        canvas.addEventListener('touchstart', e => {
            touchStartX = lastMoveX = e.touches[0].clientX;
            touchStartY = lastMoveY = e.touches[0].clientY;
            isMoving = false;
        }, { passive: false });

        canvas.addEventListener('touchmove', e => {
            if (!this.game?.running || this.game?.paused) return;
            e.preventDefault();
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;

            if (Math.abs(x - touchStartX) > THRESHOLD || Math.abs(y - touchStartY) > THRESHOLD) {
                isMoving = true;
            }
            if (Math.abs(x - lastMoveX) > 40) {
                if (x > lastMoveX) this.game.moveRight(); else this.game.moveLeft();
                lastMoveX = x;
                if (window.navigator.vibrate) window.navigator.vibrate(5);
            }
            if (y - lastMoveY > 60) {
                this.game.softDrop();
                lastMoveY = y;
            }
        }, { passive: false });

        canvas.addEventListener('touchend', e => {
            if (!this.game?.running || this.game?.paused) return;
            const totalDY = e.changedTouches[0].clientY - touchStartY;
            if (!isMoving) this.game.rotateCW();
            else if (totalDY < -100) this.game.hardDrop();
        }, { passive: false });
    }

    _handleKeyboard(e) {
        if (!this.game?.running || this.game?.paused) return;
        switch (e.key) {
            case 'ArrowLeft': this.game.moveLeft(); break;
            case 'ArrowRight': this.game.moveRight(); break;
            case 'ArrowDown': this.game.softDrop(); break;
            case 'ArrowUp': case 'x': case 'X': this.game.rotateCW(); break;
            case 'z': case 'Z': case 'Control': this.game.rotateCCW(); break;
            case ' ': this.game.hardDrop(); break;
            case 'c': case 'C': case 'Shift': this.game.holdPiece(); break;
            case 'Escape': this.game.togglePause(); break;
        }
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
            e.preventDefault();
        }
    }

    _on(id, event, fn) { this._el(id).addEventListener(event, fn); }
    _onMaybe(id, event, fn) { const el = this._el(id); if (el) el.addEventListener(event, fn); }
}
