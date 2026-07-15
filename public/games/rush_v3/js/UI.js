/**
 * FOOTBALL RUSH - UI MODULE
 * Single source of truth for all screen visibility and DOM updates.
 * No other module should add/remove .hidden on screens directly.
 */

// ─── Screen IDs ────────────────────────────────────────────────────────────────

const SCREENS = [
    'intro-layer',
    'menu-screen',
    'scores-screen',
    'game-over-screen',
    'pause-screen',
];

// ─── Screen Control ────────────────────────────────────────────────────────────

/**
 * Hides all screens and shows only the one specified.
 * Pass null to hide all (e.g. when gameplay starts).
 * @param {string|null} screenId
 */
export function showScreen(screenId) {
    SCREENS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === screenId) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

/**
 * Shows a screen on top (overlay) without hiding other screens.
 * Used for scores while menu is behind, or touch controls on top.
 * @param {string} screenId
 */
export function showOverlay(screenId) {
    const el = document.getElementById(screenId);
    if (el) el.classList.remove('hidden');
}

/**
 * Hides a single screen/overlay.
 * @param {string} screenId
 */
export function hideOverlay(screenId) {
    const el = document.getElementById(screenId);
    if (el) el.classList.add('hidden');
}

// ─── Gameplay UI ───────────────────────────────────────────────────────────────

export function setGameplayUI(visible) {
    const hud = document.getElementById('hud');
    const touch = document.getElementById('touch-controls');
    if (hud) hud.classList.toggle('hidden', !visible);
    if (touch) touch.classList.toggle('hidden', !visible);
}

export function setPauseBtn(visible) {
    const btn = document.getElementById('pause-btn');
    if (btn) btn.classList.toggle('hidden', !visible);
}

export function setLangBar(visible) {
    const bar = document.getElementById('global-lang-bar');
    if (!bar) return;
    if (visible) {
        bar.classList.remove('hidden');
        bar.style.display = 'flex';
    } else {
        bar.classList.add('hidden');
        bar.style.display = '';
    }
}

// ─── HUD ───────────────────────────────────────────────────────────────────────

export function updateHUD(score, level, tackles) {
    const s = document.getElementById('score-val');
    const l = document.getElementById('level-val');
    const t = document.getElementById('tackles-val');
    if (s) s.textContent = score;
    if (l) l.textContent = level;
    if (t) t.textContent = tackles;
}

export function updateSprintMeter(pct) {
    const fill = document.getElementById('sprint-fill');
    if (fill) fill.style.width = (pct * 100) + '%';
}

// ─── Scores / Leaderboard ─────────────────────────────────────────────────────

/**
 * Renders the high score list for a given difficulty.
 * @param {Array} scores - sorted score array [{name, score}]
 * @param {string} noRecordsText - i18n text for empty state
 */
export function renderScoresList(scores, noRecordsText) {
    const list = document.getElementById('highscore-list');
    if (!list) return;
    list.innerHTML = '';

    if (!scores || scores.length === 0) {
        list.innerHTML = `<div class="no-records">${noRecordsText}</div>`;
        return;
    }

    scores.slice(0, 5).forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'highscore-item';
        div.innerHTML = `<span>${idx + 1}. ${item.name || 'ANON'}</span><span class="score-val">${item.score}</span>`;
        list.appendChild(div);
    });
}

export function setScoreTab(diff) {
    ['CASUAL', 'PRO'].forEach(k => {
        const tab = document.getElementById(`score-tab-${k.toLowerCase()}`);
        if (tab) tab.classList.toggle('active', k === diff);
    });
}

// ─── Game Over ─────────────────────────────────────────────────────────────────

export function showGameOver(score) {
    const finalScore = document.getElementById('final-score');
    if (finalScore) finalScore.textContent = score;
    showScreen('game-over-screen');
}

// ─── i18n Text ─────────────────────────────────────────────────────────────────

/**
 * Updates all translatable DOM nodes.
 * @param {object} t - translations object for the selected language
 * @param {string} lang - 'es' | 'en'
 */
export function applyTranslations(t, lang) {
    if (!t) return;

    const set = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    const setHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    const setPlaceholder = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.placeholder = text;
    };

    // Menu
    set('difficulty-label', t.difficulty);
    set('start-btn', t.startSeason);
    set('scores-btn', t.leaderboard);
    set('close-scores-btn', t.backToMenu);
    setHtml('controls-hint', `${t.controls}<br><br>&copy; HaDeS (A.K.A. DeViLDoNia) 2026`);

    // Intro
    set('skip-hint-text', t.tapToSkip);

    // Leaderboard
    set('leaderboard-title', t.leaderboard);

    // Game Over
    set('gameover-title', t.gameOver);
    set('yardage-label', t.yardageGained);
    set('retry-btn', t.retry);
    set('menu-btn', t.menu);
    setPlaceholder('player-name', t.yourName);

    // Pause screen
    set('pause-title', t.pause || 'PAUSA');
    set('resume-btn-label', t.resume || '▶ REANUDAR');
    set('pause-menu-label', t.menu);

    // HUD
    set('hud-score-label', t.score);
    set('hud-level-label', t.level);
    set('hud-tackles-label', t.tackles);

    // Lang button active state
    ['es', 'en'].forEach(l => {
        const btn = document.getElementById(`lang-${l}-btn`);
        if (btn) btn.classList.toggle('active', lang === l);
    });
}
