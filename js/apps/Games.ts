/**
 * WINDOWS 95 APP CENTER - GAMES
 * Kernel-compatible wrappers for integrated games
 * Version: 3.2 (TypeScript)
 */

import { Kernel } from '../core/Kernel.js';

export interface IGameConfig {
    windowId: string;
    iframeId: string;
    url: string;
}

class GameApp {
    public windowId: string;
    protected iframeId: string;
    protected url: string;

    constructor(config: IGameConfig) {
        this.windowId = config.windowId;
        this.iframeId = config.iframeId;
        this.url = config.url;

        this.init();
    }

    private init(): void {
        const frame = document.getElementById(this.iframeId) as HTMLIFrameElement;
        if (frame && (frame.src === 'about:blank' || frame.src === '' || !frame.src.includes(this.url))) {
            frame.src = this.url;
        }
    }
}

// Register with Kernel
Kernel.registerApp('vlrs', class extends GameApp {
    constructor() { super({ windowId: 'win-vlrs-game', iframeId: 'vlrs-game-frame', url: 'games/vlrs/index.html' }); }
}, { name: 'Virtual Life Restart Simulator', icon: 'assets/icons/vlrs_icon.webp', singleton: true });

Kernel.registerApp('flappy-neon', class extends GameApp {
    constructor() { super({ windowId: 'win-flappy-neon', iframeId: 'flappy-neon-frame', url: 'games/flappy-neon/index.html' }); }
}, { name: 'Flappy Neon', icon: 'assets/icons/neon.webp', singleton: true });

Kernel.registerApp('football-rush', class extends GameApp {
    constructor() { super({ windowId: 'win-football-rush', iframeId: 'football-rush-frame', url: 'games/rush_v3/index.html' }); }
}, { name: 'Football Rush', icon: 'assets/icons/rush.webp', singleton: true });

Kernel.registerApp('doom', class extends GameApp {
    constructor() { super({ windowId: 'win-doom', iframeId: 'doom-frame', url: 'games/doom/ultimate_doom.html' }); }
}, { name: 'Ultimate DOOM', icon: 'assets/icons/doom.webp', singleton: true });

Kernel.registerApp('tetris-tryhard', class extends GameApp {
    constructor() { super({ windowId: 'win-tetris-tryhard', iframeId: 'tetris-tryhard-frame', url: 'games/tetris_tryhard/index.html' }); }
}, { name: 'Tetris Tryhard', icon: 'assets/icons/tetris.webp', singleton: true });

Kernel.registerApp('chapas-prime', class extends GameApp {
    constructor() { super({ windowId: 'win-chapas-game', iframeId: 'chapas-game-frame', url: 'games/chapas-prime/index.html' }); }
}, { name: 'Chapas Prime', icon: 'assets/icons/chapas.webp', singleton: true });

Kernel.registerApp('nocturna', class extends GameApp {
    constructor() { super({ windowId: 'win-nocturna-game', iframeId: 'nocturna-game-frame', url: 'games/nocturna/index.html' }); }
}, { name: 'Nocturna', icon: '🌙', singleton: true });

Kernel.registerApp('gameboy', class extends GameApp {
    constructor() { super({ windowId: 'win-gameboy-game', iframeId: 'gameboy-game-frame', url: 'games/hip-gb/index.html' }); }
}, { name: 'H.I.P. Game Boy', icon: 'assets/icons/gameboy.png', singleton: true });
