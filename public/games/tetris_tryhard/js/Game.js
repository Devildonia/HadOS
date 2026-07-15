/**
 * Game.js — Tetris Tryhard Game Controller
 * Pure game logic: state machine, gravity loop, piece physics.
 * No DOM access here — all UI side-effects go through this.ui (UIController).
 *
 * NOTE — Inverted Gravity mechanic:
 *   Only the CSS transform scaleY(-1) on #gameCanvas is needed for the visual flip.
 *   Internal board logic (spawn at top, fall down, lock at bottom) is UNCHANGED.
 *   The visual illusion is that pieces appear to come from the bottom and fall upward.
 */

import {
    ROWS, COLS, COLORS, SHAPES,
    LINE_SCORES, TSPIN_SCORES,
    PERFECT_CLEAR_BONUS, FLIP_DURATION_LINES
} from './constants.js';
import { translations } from './i18n.js';

const DROP_SPEEDS = level => Math.max(50, 1000 - (level - 1) * 80);

export class GameController {
    /**
     * @param {import('./engine.js').TetrisEngine} engine
     * @param {import('./render.js').TetrisRender} render
     * @param {import('./audio.js').TetrisAudio} audio
     * @param {import('./ui.js').UIController} ui
     */
    constructor(engine, render, audio, ui) {
        this.engine = engine;
        this.render = render;
        this.audio = audio;
        this.ui = ui;

        // ── State ────────────────────────────────────────────────────────────
        this.running = false;
        this.paused = false;

        // ── Scoring ──────────────────────────────────────────────────────────
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = -1;
        this.backToBack = false;

        // ── Gravity flip ─────────────────────────────────────────────────────
        this.gravityInverted = false;
        this.flipLines = 0;          // lines cleared during current flip event
        this._prevLevel = 1;         // to detect level-up boundary crossings
        this._lastWasRotation = false;

        // ── Pieces ───────────────────────────────────────────────────────────
        this.currentPiece = null;
        this.nextPieces = [];
        this.heldPiece = null;
        this.canHold = true;

        // ── Gravity rAF loop ─────────────────────────────────────────────────
        this._rafId = null;
        this._lastDrop = 0;
        this._lastFrame = 0;
    }

    // ────────────────────────────────────────────────────────────────────────
    //  Public API
    // ────────────────────────────────────────────────────────────────────────

    start() {
        this.engine.reset();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this._prevLevel = 1;
        this.combo = -1;
        this.backToBack = false;
        this.gravityInverted = false;
        this.flipLines = 0;
        this.heldPiece = null;
        this.canHold = true;
        this.running = true;
        this.paused = false;
        this._lastWasRotation = false;

        this.nextPieces = [
            this.engine.createPiece(),
            this.engine.createPiece(),
            this.engine.createPiece()
        ];

        this.ui.onGameStart();
        this.ui.setGravityFlip(false);
        this.audio.playMusic();
        this._spawnPiece();
        this._startLoop();
    }

    reset() {
        this._stopLoop();
        this.running = false;
        this.paused = false;
        this.currentPiece = null;
        this.nextPieces = [];
        this.heldPiece = null;
        this.gravityInverted = false;
        this.flipLines = 0;
        this.engine.reset();
        this.ui.setGravityFlip(false);
        this.ui.refresh(this.engine.board, null, null, this.nextPieces, this.heldPiece, this.engine.pieceConfig);
        this.audio.stopMusic();
        this.ui.showScreen('mainMenu');
    }

    togglePause() {
        if (!this.running) return;
        this.paused = !this.paused;

        if (this.paused) {
            this.audio.pauseMusic();
        } else {
            this._lastDrop = performance.now();
            this.audio.playMusic();
        }
        this.ui.onPauseChange(this.paused);
    }

    // ── Input ────────────────────────────────────────────────────────────────

    moveLeft() { this._move(-1, 0); }
    moveRight() { this._move(1, 0); }

    softDrop() {
        if (this._move(0, 1)) {
            this.score += 1;
            this.ui.updateStats(this.score, this.lines, this.level);
        }
    }

    rotateCW() { this._rotate(1); }
    rotateCCW() { this._rotate(-1); }

    hardDrop() {
        if (!this.running || this.paused || !this.currentPiece) return;
        let dist = 0;
        while (!this.engine.collides(this.currentPiece, this.engine.board, 0, 1)) {
            this.currentPiece.y++;
            dist++;
        }
        this.score += dist * 2;
        this.render.triggerShake(10);
        this.ui.updateStats(this.score, this.lines, this.level);
        this._lastWasRotation = false;
        this._lockPiece();
    }

    holdPiece() {
        if (!this.running || this.paused || !this.canHold) return;
        const type = this.currentPiece.type;
        if (!this.heldPiece) {
            this.heldPiece = type;
            this._spawnPiece();
        } else {
            const next = this.heldPiece;
            this.heldPiece = type;
            this.currentPiece = this.engine.createPiece(next);
        }
        this.canHold = false;
        this._redraw();
    }

    // ────────────────────────────────────────────────────────────────────────
    //  Private helpers
    // ────────────────────────────────────────────────────────────────────────

    _startLoop() {
        this._lastDrop = performance.now();
        this._lastFrame = performance.now();
        const tick = (now) => {
            if (!this.running) return;
            this._rafId = requestAnimationFrame(tick);
            this._lastFrame = now;

            // Render background & VFX every frame
            this.render.updateVFX();
            this.render.renderBackground(now);
            this.render.animateCelebration();

            // Redraw board if VFX active
            if (this.render.particles.length > 0 || this.render.shakeIntensity > 0) {
                this._redraw();
            }

            // Gravity (always downward internally — canvas flip handles visual)
            if (!this.paused && this.currentPiece) {
                const speed = DROP_SPEEDS(this.level);
                if (now - this._lastDrop >= speed) {
                    this._lastDrop = now;
                    this._gravityDrop();
                }
            }
        };
        this._rafId = requestAnimationFrame(tick);
    }

    _stopLoop() {
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }

    _gravityDrop() {
        if (!this._move(0, 1)) {
            setTimeout(() => {
                if (this.running && !this.paused &&
                    this.currentPiece &&
                    this.engine.collides(this.currentPiece, this.engine.board, 0, 1)) {
                    this._lockPiece();
                }
            }, 500);
        }
    }

    _move(dx, dy) {
        if (!this.running || this.paused || !this.currentPiece) return false;
        if (!this.engine.collides(this.currentPiece, this.engine.board, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this._lastWasRotation = false;
            this.ui.updateStats(this.score, this.lines, this.level);
            this._redraw();
            return true;
        }
        return false;
    }

    _rotate(dir) {
        if (!this.running || this.paused || !this.currentPiece) return;
        const rotated = this.engine.rotate(this.currentPiece, this.engine.board, dir);
        if (rotated !== this.currentPiece) {
            this.currentPiece = rotated;
            this._lastWasRotation = true;
            this.audio.playSFX('rotate');
            this._redraw();
        }
    }

    _lockPiece() {
        const piece = this.currentPiece;

        // Write piece to board
        piece.shape.forEach((row, dy) => {
            row.forEach((cell, dx) => {
                if (cell) {
                    const y = piece.y + dy;
                    const x = piece.x + dx;
                    if (y >= 0 && y < ROWS) {
                        this.engine.board[y][x] = {
                            type: piece.type,
                            r: piece.rotation,
                            sliceX: cell.sx,
                            sliceY: cell.sy
                        };
                    }
                }
            });
        });

        const tSpin = this._detectTSpin(piece);
        this.audio.playSFX('place');
        this._clearLines(tSpin);
        this._spawnPiece();
        this._lastWasRotation = false;
    }

    // ── T-Spin Detection (3-corner rule) ─────────────────────────────────────

    _detectTSpin(piece) {
        if (piece.type !== 'T' || !this._lastWasRotation) return null;

        // Corners of the 3×3 bounding box
        const corners = [
            [piece.y, piece.x],
            [piece.y, piece.x + 2],
            [piece.y + 2, piece.x],
            [piece.y + 2, piece.x + 2]
        ];

        let filled = 0;
        corners.forEach(([cy, cx]) => {
            if (cy < 0 || cy >= ROWS || cx < 0 || cx >= COLS || this.engine.board[cy]?.[cx]) {
                filled++;
            }
        });

        return filled >= 3 ? 'tspin' : null;
    }

    // ── Line Clearing & Scoring ───────────────────────────────────────────────

    _clearLines(tSpin = null) {
        let cleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (this.engine.board[r].every(c => c !== 0)) {
                this.engine.board[r].forEach((c, col) =>
                    this.render.createParticles(col, r, COLORS[c.type])
                );
                this.engine.board.splice(r, 1);
                this.engine.board.unshift(Array(COLS).fill(0));
                cleared++;
                r++;
            }
        }

        if (cleared > 0) {
            // ── T-Spin scoring ────────────────────────────────────────────────
            let pts = 0;
            if (tSpin === 'tspin') {
                const tMap = { 1: 'single', 2: 'double', 3: 'triple' };
                const key = tMap[cleared] ?? 'single';
                pts = (TSPIN_SCORES[key] ?? TSPIN_SCORES.single) * this.level;
            } else {
                pts = (LINE_SCORES[cleared] ?? LINE_SCORES[4]) * this.level;
            }

            // ── Combo ─────────────────────────────────────────────────────────
            this.combo++;
            if (this.combo > 0) pts += this.combo * 50 * this.level;

            // ── Back-to-Back ──────────────────────────────────────────────────
            const isTetris = cleared === 4;
            const isTSpinClear = tSpin === 'tspin' && cleared > 0;
            if ((isTetris || isTSpinClear) && this.backToBack) {
                pts = Math.floor(pts * 1.5);
            }
            if (isTetris || isTSpinClear) {
                this.backToBack = true;
                if (isTetris) this.audio.playSFX('tetris');
                else this.audio.playSFX('line');
            } else {
                this.backToBack = false;
                this.audio.playSFX('line');
            }

            // ── Gravity flip bonus ×1.5 ───────────────────────────────────────
            if (this.gravityInverted) pts = Math.floor(pts * 1.5);

            // ── Perfect Clear ─────────────────────────────────────────────────
            const isPerfect = this.engine.board.every(row => row.every(c => c === 0));
            if (isPerfect) {
                pts += PERFECT_CLEAR_BONUS * this.level;
                this.ui.showBonusMessage('PERFECT CLEAR!', '#ffff00');
            }

            this.score += pts;
            this.lines += cleared;
            const newLevel = Math.floor(this.lines / 10) + 1;

            // Track flip lines if in flip mode
            if (this.gravityInverted) {
                this.flipLines += cleared;
                if (this.flipLines >= FLIP_DURATION_LINES) {
                    this._endGravityFlip();
                }
            }

            // ── Level up & flip check ─────────────────────────────────────────
            if (newLevel > this.level) {
                this.level = newLevel;
                this._checkLevelFlip(newLevel);
            } else {
                this.level = newLevel;
            }

            this.render.triggerShake(cleared === 4 ? 20 : 6);
            this.render.startCelebration(cleared);
            this.ui.updateStats(this.score, this.lines, this.level);
            this._lastDrop = performance.now();
        } else {
            this.combo = -1;
        }
    }

    // ── Level & Gravity Flip ──────────────────────────────────────────────────

    _checkLevelFlip(newLevel) {
        if (this.gravityInverted) return;        // already in flip mode
        if (newLevel > 1 && newLevel % 5 === 0) {
            this._triggerGravityFlip();
        }
    }

    _triggerGravityFlip() {
        this.gravityInverted = true;
        this.flipLines = 0;
        this.ui.setGravityFlip(true);
        this.ui.showGravityFlipWarning();
        this.audio.enterGravityMode();
    }

    _endGravityFlip() {
        this.gravityInverted = false;
        this.flipLines = 0;
        this.ui.setGravityFlip(false);
        const t = translations[this.ui.currentLanguage];
        this.ui.showBonusMessage(t.survived, '#00f0ff');
        this.audio.exitGravityMode();
    }

    // ── Piece Spawning ────────────────────────────────────────────────────────

    _spawnPiece() {
        this.currentPiece = this.nextPieces.shift();
        this.nextPieces.push(this.engine.createPiece());
        this.canHold = true;

        // Normal spawn at top — the CSS scaleY(-1) handles visual inversion
        if (this.engine.collides(this.currentPiece, this.engine.board)) {
            this._gameOver();
            return;
        }
        this._redraw();
    }

    _gameOver() {
        this.running = false;
        this._stopLoop();
        this.audio.pauseMusic();
        this.ui.setGravityFlip(false);
        this.ui.onGameOver(this.score);
    }

    _getGhost() {
        if (!this.currentPiece) return null;
        const g = { ...this.currentPiece };
        while (!this.engine.collides(g, this.engine.board, 0, 1)) g.y++;
        return g;
    }

    _redraw() {
        const ghost = this._getGhost();
        this.ui.refresh(
            this.engine.board,
            this.currentPiece,
            ghost,
            this.nextPieces,
            this.heldPiece,
            this.engine.pieceConfig
        );
    }
}
