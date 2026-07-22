import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HadOSMediaPlayer } from '../js/apps/HadOSMediaPlayer.js';
import { VFS } from '../js/core/VFS.js';
import { WindowFactory } from '../js/ui/WindowFactory.js';

describe('HadOSMediaPlayer', () => {
    beforeEach(() => {
        // Mock VFS listDir, etc.
        vi.spyOn(VFS, 'listDir').mockImplementation((path) => {
            if (path === 'C:\\HADOS\\PODCASTS') return ['test-podcast.mp3'];
            return [];
        });

        // Mock window timer
        vi.stubGlobal('setInterval', vi.fn((cb) => {
            // Immediately run callback once to simulate tick
            cb();
            return 123;
        }));
        vi.stubGlobal('clearInterval', vi.fn());

        // Mock global fetch for oembed metadata
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ title: "Never Gonna Give You Up" })
        })));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize and set up layout elements correctly', () => {
        const app = new HadOSMediaPlayer();
        const body = WindowFactory.getBody(app.windowId);
        expect(body).not.toBeNull();
        expect(body!.querySelector('#mediaplayer-vfs-select')).not.toBeNull();
        expect(body!.querySelector('#mediaplayer-yt-input')).not.toBeNull();
        expect(body!.querySelector('#mediaplayer-yt-btn')).not.toBeNull();
        expect(body!.querySelector('#mp-tab-transcript')).not.toBeNull();
        app.terminate();
    });

    it('should open VFS local media file on load', () => {
        const app = new HadOSMediaPlayer();
        const body = WindowFactory.getBody(app.windowId)!;
        const openBtn = body.querySelector('#mediaplayer-vfs-btn') as HTMLButtonElement;

        // Stub document.createElement for input picker to simulate file picking
        const mockFile = new File([''], 'test-podcast.mp3', { type: 'audio/mp3' });
        const originalCreateElement = document.createElement.bind(document);
        vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            const el = originalCreateElement(tagName);
            if (tagName === 'input') {
                el.click = () => {
                    Object.defineProperty(el, 'files', {
                        value: [mockFile],
                        writable: false
                    });
                    if (el.onchange) {
                        el.onchange({ target: el } as any);
                    }
                };
            }
            return el;
        });

        openBtn.click();

        expect(app['playerType']).toBe('local');
        expect(app['mediaElement']).not.toBeNull();
        expect(body.querySelector('video')).not.toBeNull();
        app.terminate();
    });

    it('should load YouTube url, parse ID, download mock transcript, and click to seek', async () => {
        const app = new HadOSMediaPlayer();
        const body = WindowFactory.getBody(app.windowId)!;
        const input = body.querySelector('#mediaplayer-yt-input') as HTMLInputElement;
        const loadBtn = body.querySelector('#mediaplayer-yt-btn') as HTMLButtonElement;

        input.value = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        loadBtn.click();

        // Allow async oembed fetch and transcript gen to resolve
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(app['playerType']).toBe('youtube');
        expect(app['transcript'].length).toBeGreaterThan(0);

        // Check if transcript lines are rendered
        const firstLine = body.querySelector('#mp-line-0') as HTMLElement;
        expect(firstLine).not.toBeNull();
        expect(firstLine.innerHTML).toContain('Never gonna give you up');

        // Test click to seek
        const seekSpy = vi.spyOn(app as any, 'seekToTime');
        firstLine.click();
        expect(seekSpy).toHaveBeenCalledWith(0);

        app.terminate();
    });

    it('should support switching to RAG Chat, typing query, and getting citation links', async () => {
        const app = new HadOSMediaPlayer();
        const body = WindowFactory.getBody(app.windowId)!;
        const loadBtn = body.querySelector('#mediaplayer-yt-btn') as HTMLButtonElement;
        const inputYt = body.querySelector('#mediaplayer-yt-input') as HTMLInputElement;

        inputYt.value = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        loadBtn.click();

        // Allow async oembed fetch and transcript gen to resolve
        await new Promise(resolve => setTimeout(resolve, 50));

        // Switch to Chat tab
        const tabChat = body.querySelector('#mp-tab-chat') as HTMLButtonElement;
        tabChat.click();

        const chatInput = body.querySelector('#mp-chat-input') as HTMLInputElement;
        const sendBtn = body.querySelector('#mp-chat-send-btn') as HTMLButtonElement;

        expect(chatInput).not.toBeNull();
        chatInput.value = "cry";
        
        vi.useFakeTimers();
        sendBtn.click();

        // Check if matching citation is printed (mock response)
        const chatFeed = body.querySelector('#mp-chat-feed')!;
        vi.advanceTimersByTime(600);
        
        expect(chatFeed.innerHTML).toContain('Never gonna make you cry');
        // Citations are class-based now (duplicate-id fix, audit A2)
        expect(chatFeed.querySelector('.mp-chat-citation')).not.toBeNull();
        
        vi.useRealTimers();
        app.terminate();
    });
});
