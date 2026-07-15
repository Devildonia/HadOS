export class UIManager {
    constructor(game) {
        this.game = game;
        this.elements = {
            intro: document.getElementById('intro-layer'),
            video: document.getElementById('intro-video'),
            start: document.getElementById('screen-start'),
            gameOver: document.getElementById('screen-gameover'),
            pause: document.getElementById('screen-pause'),
            hud: document.getElementById('hud'),
            score: document.getElementById('scoreValue'),
            best: document.getElementById('bestValue'),
            endScore: document.getElementById('end-score'),
            endBest: document.getElementById('end-best'),
            flash: document.getElementById('flash-overlay'),
            homeBtn: document.getElementById('btn-home'),
            streakPill: document.getElementById('streak-pill'),
            streakValue: document.getElementById('streakValue'),
            streakBanner: document.getElementById('streak-banner'),
            nameModal: document.getElementById('name-modal'),
            nameInput: document.getElementById('name-input'),
            lbList: document.getElementById('leaderboard-list'),
            creditsModal: document.getElementById('credits-modal'),
            newHighScore: document.getElementById('new-high-score')
        };

        this.streakTimer = null;
        this._bindEvents();
    }

    _bindEvents() {
        // Buttons
        document.getElementById('btn-start').onclick = () => this.game.startGame();
        document.getElementById('btn-restart').onclick = () => this.game.resetGame();

        if (this.elements.homeBtn) {
            this.elements.homeBtn.onclick = () => this.game.goToMenu();
        }

        document.getElementById('btn-resume').onclick = () => this.game.togglePause();
        document.getElementById('btn-quit').onclick = () => {
            this.game.state = 'GAMEOVER';
            this.game.goToMenu();
        };

        document.getElementById('btn-credits').onclick = () => {
            this.elements.creditsModal.classList.remove('hidden');
        };
        document.getElementById('btn-credits-close').onclick = () => {
            this.elements.creditsModal.classList.add('hidden');
        };

        document.getElementById('btn-name-submit').onclick = () => this.game.submitName();
        this.elements.nameInput.onkeydown = (e) => {
            if (e.code === 'Enter') this.game.submitName();
        };
    }

    showIntro() {
        this.elements.intro.classList.remove('hidden');
        this.elements.intro.style.display = 'flex'; // Ensure visible
        this.elements.start.classList.add('hidden');
    }

    showMenu() {
        this.elements.intro.classList.add('hidden');
        this.elements.intro.style.display = 'none'; // Force hide

        this.elements.video.pause();
        this.elements.start.classList.remove('hidden');
        this.elements.hud.classList.add('hidden');
        this.elements.gameOver.classList.add('hidden');
        this.elements.pause.classList.add('hidden');
        this.elements.nameModal.classList.add('hidden');
        this.resetStreakUI();
    }

    showHUD(score, best) {
        this.elements.start.classList.add('hidden');
        this.elements.hud.classList.remove('hidden');
        this.elements.gameOver.classList.add('hidden');
        this.elements.pause.classList.add('hidden');
        this.updateScore(score);
        this.elements.best.innerText = best;
    }

    updateScore(score) {
        this.elements.score.innerText = score;
        this.elements.score.classList.remove('pulse-text');
        void this.elements.score.offsetWidth;
        this.elements.score.classList.add('pulse-text');
    }

    updateStreak(streak, multiplier) {
        if (streak >= 3) {
            this.elements.streakPill.style.display = '';
            this.elements.streakValue.innerText = `${streak} (x${multiplier})`;
        } else {
            this.elements.streakPill.style.display = 'none';
        }
    }

    showStreakBanner(text) {
        const el = this.elements.streakBanner;
        el.textContent = text;
        el.classList.remove('hidden', 'pop');
        void el.offsetWidth;
        el.classList.add('pop');

        clearTimeout(this.streakTimer);
        this.streakTimer = setTimeout(() => el.classList.add('hidden'), 1050);
    }

    resetStreakUI() {
        this.elements.streakPill.style.display = 'none';
        this.elements.streakBanner.classList.add('hidden');
    }

    showPause(isPaused) {
        if (isPaused) {
            this.elements.pause.classList.remove('hidden');
        } else {
            this.elements.pause.classList.add('hidden');
        }
    }

    showGameOver(score, best, isNewRecord, leaderboard, highlightIdx) {
        this.elements.flash.style.opacity = '0.5';
        setTimeout(() => this.elements.flash.style.opacity = '0', 100);

        this.elements.endScore.innerText = score;
        this.elements.endBest.innerText = best;

        if (isNewRecord) {
            this.elements.newHighScore.classList.remove('hidden');
        } else {
            this.elements.newHighScore.classList.add('hidden');
        }

        // Delay showing options to let flash settle
        setTimeout(() => {
            this.renderLeaderboard(leaderboard, highlightIdx);
            this.elements.start.classList.add('hidden');
            this.elements.hud.classList.add('hidden');
            this.elements.gameOver.classList.remove('hidden');

            // If we just showed game over, ensure name modal is hidden unless called explicitly
            this.elements.nameModal.classList.add('hidden');
        }, 1200);
    }

    showNameInput() {
        this.elements.nameModal.classList.remove('hidden');
        this.elements.nameInput.value = '';
        setTimeout(() => this.elements.nameInput.focus(), 50);
    }

    hideNameInput() {
        this.elements.nameModal.classList.add('hidden');
    }

    getNameInput() {
        return this.elements.nameInput.value.trim().toUpperCase() || 'PILOT';
    }

    renderLeaderboard(leaderboard, highlightIdx) {
        const list = this.elements.lbList;
        list.innerHTML = '';
        leaderboard.forEach((entry, i) => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="lb-name">${entry.name}</span> <span class="lb-score">${entry.score}</span>`;
            if (i === highlightIdx) li.classList.add('highlight');
            list.appendChild(li);
        });
    }
}
