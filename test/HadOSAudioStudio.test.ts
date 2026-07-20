import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HadOSAudioStudio } from '../js/apps/HadOSAudioStudio.js';
import { VFS } from '../js/core/VFS.js';
import { WindowFactory } from '../js/ui/WindowFactory.js';

describe('HadOSAudioStudio', () => {
    beforeEach(() => {
        // Mock VFS methods
        vi.spyOn(VFS, 'mkdir').mockImplementation(() => true);
        vi.spyOn(VFS, 'writeFile').mockImplementation(() => true);

        // Mock window.speechSynthesis
        const mockSpeechSynthesis = {
            speak: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            cancel: vi.fn(),
            getVoices: vi.fn().mockReturnValue([
                { name: 'Voice A', lang: 'en-US' },
                { name: 'Voice B', lang: 'en-US' }
            ])
        };
        vi.stubGlobal('speechSynthesis', mockSpeechSynthesis);
        vi.stubGlobal('SpeechSynthesisUtterance', class {
            public lang: string = '';
            public voice: any = null;
            public onend: any = null;
            public onerror: any = null;
            constructor(public text: string) {}
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize and set up layout elements with tabs navigation', () => {
        const app = new HadOSAudioStudio();
        const body = WindowFactory.getBody(app.windowId);
        expect(body).not.toBeNull();
        expect(body!.querySelector('#tab-podcast')).not.toBeNull();
        expect(body!.querySelector('#tab-dictation')).not.toBeNull();
        expect(body!.querySelector('#audiostudio-tab-panel')).not.toBeNull();
        app.terminate();
    });

    it('should write script to VFS and call speechSynthesis on generate in Podcast tab', () => {
        const app = new HadOSAudioStudio();
        const body = WindowFactory.getBody(app.windowId)!;
        const input = body.querySelector('#audiostudio-text-input') as HTMLTextAreaElement;
        const genBtn = body.querySelector('#audiostudio-gen-btn') as HTMLButtonElement;

        input.value = "Test input text";
        genBtn.click();

        expect(VFS.writeFile).toHaveBeenCalled();
        expect(window.speechSynthesis.speak).toHaveBeenCalled();
        app.terminate();
    });

    it('should support pausing and stopping the audio player on Podcast tab', () => {
        const app = new HadOSAudioStudio();
        const body = WindowFactory.getBody(app.windowId)!;
        const playBtn = body.querySelector('#audiostudio-play-btn') as HTMLButtonElement;
        const pauseBtn = body.querySelector('#audiostudio-pause-btn') as HTMLButtonElement;
        const stopBtn = body.querySelector('#audiostudio-stop-btn') as HTMLButtonElement;

        // Directly mock tab state
        const tab = app['currentTab'] as any;
        tab['scriptQueue'] = [{ speaker: 'A', text: 'Hello' }];
        tab['isPlaying'] = true;

        pauseBtn.click();
        expect(window.speechSynthesis.pause).toHaveBeenCalled();

        playBtn.click();
        expect(window.speechSynthesis.resume).toHaveBeenCalled();

        stopBtn.click();
        expect(window.speechSynthesis.cancel).toHaveBeenCalled();
        app.terminate();
    });

    it('should switch to Dictation tab, start recording, and save note to VFS', () => {
        const app = new HadOSAudioStudio();
        const body = WindowFactory.getBody(app.windowId)!;
        const tabDictation = body.querySelector('#tab-dictation') as HTMLButtonElement;

        tabDictation.click(); // switch tab

        const textarea = body.querySelector('#dictation-textarea') as HTMLTextAreaElement;
        const recordBtn = body.querySelector('#dictation-record-btn') as HTMLButtonElement;
        const saveBtn = body.querySelector('#dictation-save-btn') as HTMLButtonElement;

        expect(textarea).not.toBeNull();
        expect(recordBtn).not.toBeNull();

        recordBtn.click(); // trigger mock recording
        textarea.value = "Mock voice transcribed note text";

        saveBtn.click(); // save note
        expect(VFS.writeFile).toHaveBeenCalledWith(
            'C:\\HADOS\\NOTES',
            expect.stringContaining('nota-'),
            'Mock voice transcribed note text'
        );

        app.terminate();
    });
});
