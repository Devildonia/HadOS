export class AudioManager {
    constructor() {
        this.bgm = new Audio('assets/audio/flappy.opus');
        this.bgm.loop = true;
        this.bgm.volume = 0.4;

        this.sfxJump = new Audio('assets/audio/wii.opus');
        this.sfxDie = new Audio('assets/audio/oh_no.opus');
        this.sfxStreak = new Audio('assets/audio/streak.opus');

        // Web Audio for score SFX
        try { this.actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
    }

    playBGM() {
        this.bgm.play().catch(e => console.log("Audio play failed", e));
    }

    stopBGM() {
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }

    playJump() {
        this.sfxJump.currentTime = 0;
        this.sfxJump.play().catch(() => { });
    }

    playDie() {
        this.sfxDie.currentTime = 0;
        this.sfxDie.play().catch(() => { });
    }

    playStreak() {
        this.sfxStreak.currentTime = 0;
        this.sfxStreak.volume = 0.6;
        this.sfxStreak.play().catch(() => { });
    }

    playScore(score) {
        if (!this.actx) return;
        try {
            const osc = this.actx.createOscillator();
            const gain = this.actx.createGain();
            osc.connect(gain); gain.connect(this.actx.destination);
            // Pitch rises with score, caps at a nice tone
            const freq = 440 + Math.min(score * 8, 400);
            osc.frequency.setValueAtTime(freq, this.actx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.actx.currentTime + 0.07);
            gain.gain.setValueAtTime(0.15, this.actx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.actx.currentTime + 0.15);
            osc.start(); osc.stop(this.actx.currentTime + 0.15);
        } catch (e) { }
    }
}
