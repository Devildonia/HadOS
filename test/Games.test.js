import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel.js';
import { Services } from '../js/core/ServiceContainer.js';

// Import Games module (registers all games with Kernel)
import '../js/apps/Games.js';

describe('Games', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Services.__reset();
        // Don't reset Kernel — we need the game registrations from import

        document.body.innerHTML = `
            <div id="win-vlrs-game" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="vlrs-game-frame" src="about:blank"></iframe></div>
            </div>
            <div id="win-flappy-neon" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="flappy-neon-frame" src="about:blank"></iframe></div>
            </div>
            <div id="win-football-rush" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="football-rush-frame" src="about:blank"></iframe></div>
            </div>
            <div id="win-doom" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="doom-frame" src="about:blank"></iframe></div>
            </div>
            <div id="win-tetris-tryhard" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="tetris-tryhard-frame" src="about:blank"></iframe></div>
            </div>
            <div id="win-chapas-game" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="chapas-game-frame" src="about:blank"></iframe></div>
            </div>
            <div id="win-nocturna-game" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="nocturna-game-frame" src="about:blank"></iframe></div>
            </div>
            <div id="win-gameboy-game" class="win95-window" style="display:none;">
                <div class="window-body"><iframe id="gameboy-game-frame" src="about:blank"></iframe></div>
            </div>
        `;
    });

    describe('registration', () => {
        it('should register all 8 games with Kernel', () => {
            const registry = Kernel.getRegistry();
            const gameIds = ['vlrs', 'flappy-neon', 'football-rush', 'doom', 'tetris-tryhard', 'chapas-prime', 'nocturna', 'gameboy'];

            gameIds.forEach(id => {
                expect(registry.apps[id]).toBeDefined();
                expect(registry.apps[id].metadata.name).toBeTruthy();
                expect(registry.apps[id].metadata.icon).toBeTruthy();
            });
        });

        it('should have correct metadata for VLRS', () => {
            const app = Kernel.getRegistry().apps['vlrs'];
            expect(app.metadata.name).toBe('Virtual Life Restart Simulator');
        });

        it('should have correct metadata for DOOM', () => {
            const app = Kernel.getRegistry().apps['doom'];
            expect(app.metadata.name).toBe('Ultimate DOOM');
        });

        it('should have correct metadata for Tetris', () => {
            const app = Kernel.getRegistry().apps['tetris-tryhard'];
            expect(app.metadata.name).toBe('Tetris Tryhard');
        });

        it('should have correct metadata for Chapas Prime', () => {
            const app = Kernel.getRegistry().apps['chapas-prime'];
            expect(app.metadata.name).toBe('Chapas Prime');
        });

        it('should have correct metadata for Nocturna', () => {
            const app = Kernel.getRegistry().apps['nocturna'];
            expect(app.metadata.name).toBe('Nocturna');
        });

        it('should have correct metadata for Game Boy', () => {
            const app = Kernel.getRegistry().apps['gameboy'];
            expect(app.metadata.name).toBe('H.I.P. Game Boy');
        });
    });

    describe('launch behavior', () => {
        it('should set iframe src to game URL on launch', () => {
            const proc = Kernel.launch('flappy-neon');
            expect(proc).not.toBeNull();

            const frame = document.getElementById('flappy-neon-frame');
            expect(frame.src).toContain('flappy-neon');
        });

        it('should set correct window ID', () => {
            const proc = Kernel.launch('doom');
            expect(proc.instance.windowId).toBe('win-doom');
        });

        it('should not reload iframe if already loaded with correct URL', () => {
            const frame = document.getElementById('vlrs-game-frame');
            frame.src = 'games/vlrs/index.html';
            const originalSrc = frame.src;

            Kernel.launch('vlrs');
            // Should not have changed since it already has the correct URL
            expect(frame.src).toBe(originalSrc);
        });
    });
});
