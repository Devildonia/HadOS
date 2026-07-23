import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { radarMatches } from '../js/apps/HackerNewsScout.js';

describe('radarMatches (Nova Radar)', () => {
    it('matches case-insensitively and reports which topics hit', () => {
        expect(radarMatches('Rust 2.0 released with WebGPU support', ['rust', 'webgpu', 'go'])).toEqual(['rust', 'webgpu']);
    });
    it('ignores blank and single-char topics', () => {
        expect(radarMatches('a b c', ['', ' ', 'a'])).toEqual([]);
    });
    it('returns empty for no hits', () => {
        expect(radarMatches('Nothing relevant', ['rust'])).toEqual([]);
    });
});
import { HackerNewsScout } from '../js/apps/HackerNewsScout';
import { Kernel } from '../js/core/Kernel';
import { WindowFactory } from '../js/ui/WindowFactory';

describe('HackerNewsScout App', () => {
    let windowBody: HTMLDivElement;

    beforeEach(() => {
        vi.restoreAllMocks();

        windowBody = document.createElement('div');
        document.body.appendChild(windowBody);

        vi.spyOn(WindowFactory, 'create').mockReturnValue('win-hnscout-test');
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(windowBody);
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});

        window.playBlip = vi.fn();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        delete window.playBlip;
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['hnscout']).toBeDefined();
    });

    it('should initialize and render layout', () => {
        const app = new HackerNewsScout();
        expect(WindowFactory.create).toHaveBeenCalled();
        expect(windowBody.innerHTML).toContain('hn-scout-container');
        expect(windowBody.innerHTML).toContain('hn-news-grid');
        app.terminate();
    });

    it('should show an honest error state on fetch failure, with demo data behind an opt-in button', async () => {
        // Fetch fails → no silent mock fallback: the app must say so (audit A3)
        vi.spyOn(window, 'fetch').mockRejectedValue(new Error('Network error'));

        const app = new HackerNewsScout();
        // Wait for fetch/promises to resolve
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(windowBody.innerHTML).toContain('Could not reach Hacker News');
        const demoBtn = windowBody.querySelector('#hn-demo-btn') as HTMLButtonElement;
        expect(demoBtn).not.toBeNull();
        expect(windowBody.querySelector('#hn-retry-btn')).not.toBeNull();

        // Demo data is opt-in and visibly stamped [DEMO]
        demoBtn.click();
        expect(windowBody.innerHTML).toContain('[DEMO]');
        expect(windowBody.innerHTML).toContain('hn-summarize-btn');

        app.terminate();
    });

    it('should open the summary side panel labelled as a simulated demo', async () => {
        vi.spyOn(window, 'fetch').mockRejectedValue(new Error('Network error'));

        const app = new HackerNewsScout();
        await new Promise(resolve => setTimeout(resolve, 50));

        // Opt into demo data first (no silent fallback anymore)
        (windowBody.querySelector('#hn-demo-btn') as HTMLButtonElement).click();

        const summarizeBtn = windowBody.querySelector('.hn-summarize-btn') as HTMLButtonElement;
        expect(summarizeBtn).not.toBeNull();

        summarizeBtn.click();
        expect(window.playBlip).toHaveBeenCalledWith(700);

        const panel = windowBody.querySelector('#hn-side-panel') as HTMLElement;
        expect(panel.style.display).toBe('flex');
        expect(panel.innerHTML).toContain('Summary (simulated demo)');
        expect(panel.innerHTML).toContain('No AI model runs');

        app.terminate();
    });
});
