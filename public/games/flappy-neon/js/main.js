import { Game } from './core/Game.js';
import { Assets } from './systems/Assets.js';

window.addEventListener('load', async () => {
    await Assets.loadAll();
    new Game();
});
