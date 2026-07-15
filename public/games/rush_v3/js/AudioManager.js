/**
 * FOOTBALL RUSH - AUDIO MANAGER
 */

export class AudioManager {
    constructor() {
        this.bgm = new Audio('assets/audio/bso.opus');
        this.bgm.loop = true;
        this.bgm.volume = 0.4;

        this.sfx = {
            sprint: new Audio('assets/audio/sprint.opus'),
            tackle: new Audio('assets/audio/tackle.opus'),
            touchdown: new Audio('assets/audio/touchdown.opus'),
            pickup: new Audio('assets/audio/ooh.opus'),
        };

        Object.values(this.sfx).forEach(a => {
            a.volume = 0.6;
            a.preload = 'auto';
        });
    }

    /** Starts BGM from the beginning */
    playBGM() {
        this.bgm.currentTime = 0;
        this.bgm.play().catch(() => { });
    }

    /** Resumes BGM from current position (use after pause) */
    resumeBGM() {
        this.bgm.play().catch(() => { });
    }

    stopBGM() {
        this.bgm.pause();
    }

    playSFX(name) {
        const sound = this.sfx[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => { });
        }
    }
}
