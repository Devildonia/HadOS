export class TetrisAudio {
    constructor() {
        this.bgMusic = new Audio();
        this.bgMusic.src = 'assets/audio/tetris_pro.opus';
        this.bgMusic.loop = true;
        this.bgMusic.volume = 1.0;

        this.gravityMusic = new Audio();
        this.gravityMusic.src = 'assets/audio/tetris_gravity.opus';
        this.gravityMusic.loop = true;
        this.gravityMusic.volume = 0.0; // Starts silent

        // Lazy-loaded SFX: src set immediately but resolved at play time.
        const makeSFX = (file) => {
            const a = new Audio();
            a.src = file;
            return a;
        };

        this.sfx = {
            rotate: makeSFX('assets/audio/rotate.opus'),
            place: makeSFX('assets/audio/place.opus'),
            line: makeSFX('assets/audio/line.opus'),
            tetris: makeSFX('assets/audio/tetris.opus')
        };

        this.musicMuted = false;
        this.sfxMuted = false;

        // Track crossfade intervals
        this._fadeIntervals = new Map();
    }

    playMusic() {
        if (!this.musicMuted) {
            // Ensure both are playing if we are in a transition, but usually just main
            // If gravity volume > 0, we play that too.
            this.bgMusic.play().catch(e => console.warn('Music play failed:', e));
            if (this.gravityMusic.volume > 0) {
                this.gravityMusic.play().catch(e => console.warn('Gravity music play failed:', e));
            }
        }
    }

    pauseMusic() {
        this.bgMusic.pause();
        this.gravityMusic.pause();
    }

    stopMusic() {
        this.pauseMusic();
        this.bgMusic.currentTime = 0;
        this.gravityMusic.currentTime = 0;
        // Reset volumes
        this.bgMusic.volume = 1.0;
        this.gravityMusic.volume = 0.0;
    }

    async enterGravityMode() {
        if (this.musicMuted) return;

        // Ensure gravity track is playing before fading in
        if (this.gravityMusic.paused) {
            this.gravityMusic.currentTime = this.bgMusic.currentTime % this.gravityMusic.duration; // Try to sync beat if possible/relevant
            this.gravityMusic.play().catch(() => { });
        }

        this._crossFade(this.bgMusic, this.gravityMusic, 1000);
    }

    async exitGravityMode() {
        if (this.musicMuted) return;

        // Ensure normal track is playing (it should be, but just in case)
        if (this.bgMusic.paused) this.bgMusic.play().catch(() => { });

        this._crossFade(this.gravityMusic, this.bgMusic, 1500);
    }

    _crossFade(fromTrack, toTrack, duration = 1000) {
        const steps = 20;
        const stepTime = duration / steps;
        const volStep = 1.0 / steps;

        // Clear existing intervals for these tracks to prevent fighting
        if (this._fadeIntervals.has(fromTrack)) clearInterval(this._fadeIntervals.get(fromTrack));
        if (this._fadeIntervals.has(toTrack)) clearInterval(this._fadeIntervals.get(toTrack));

        const interval = setInterval(() => {
            let fromVol = Math.max(0, fromTrack.volume - volStep);
            let toVol = Math.min(1, toTrack.volume + volStep);

            fromTrack.volume = fromVol;
            toTrack.volume = toVol;

            if (fromVol <= 0 && toVol >= 1) {
                fromTrack.volume = 0;
                toTrack.volume = 1;
                fromTrack.pause(); // Save resources
                clearInterval(interval);
                this._fadeIntervals.delete(fromTrack);
                this._fadeIntervals.delete(toTrack);
            }
        }, stepTime);

        this._fadeIntervals.set(fromTrack, interval);
        this._fadeIntervals.set(toTrack, interval);
    }

    toggleMusic() {
        this.musicMuted = !this.musicMuted;
        if (this.musicMuted) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
        return this.musicMuted;
    }

    playSFX(key) {
        if (!this.sfxMuted && this.sfx[key]) {
            const sound = this.sfx[key];
            sound.currentTime = 0;
            sound.play().catch(e => {
                if (e.name === 'NotSupportedError' || e.name === 'NotAllowedError') {
                    // Reload the audio element and retry once
                    const src = sound.src;
                    sound.src = '';
                    sound.src = src;
                    sound.load();
                    sound.play().catch(() => { }); // silent retry
                }
            });
        }
    }

    toggleSFX() {
        this.sfxMuted = !this.sfxMuted;
        return this.sfxMuted;
    }
}
