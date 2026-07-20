import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

    it('should fall back to mock data and render news cards', async () => {
        // We trigger mock fallback since fetch fails or is mocked to reject
        vi.spyOn(window, 'fetch').mockRejectedValue(new Error('Network error'));
        
        const app = new HackerNewsScout();
        // Wait for fetch/promises to resolve
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(windowBody.innerHTML).toContain('LiteRT: Google\'s new lightweight runtime');
        expect(windowBody.innerHTML).toContain('antigravity');
        expect(windowBody.innerHTML).toContain('hn-summarize-btn');

        app.terminate();
    });

    it('should open AI Summarizer side panel and trigger LiteRT simulation log', async () => {
        vi.spyOn(window, 'fetch').mockRejectedValue(new Error('Network error'));

        const app = new HackerNewsScout();
        await new Promise(resolve => setTimeout(resolve, 50));

        const summarizeBtn = windowBody.querySelector('.hn-summarize-btn') as HTMLButtonElement;
        expect(summarizeBtn).not.toBeNull();

        summarizeBtn.click();
        expect(window.playBlip).toHaveBeenCalledWith(700);

        const panel = windowBody.querySelector('#hn-side-panel') as HTMLElement;
        expect(panel.style.display).toBe('flex');
        expect(panel.innerHTML).toContain('LiteRT Summarizer');
        expect(panel.innerHTML).toContain('Initializing LiteRT pipeline');

        app.terminate();
    });
});
