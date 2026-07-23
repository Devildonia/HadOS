/**
 * HADA (voice assistant)
 * jsdom has no microphone, no MediaRecorder, no Gemma — which makes it the
 * perfect place to pin the HONEST-STATE contract: the app must say exactly
 * which pieces are missing and refuse to pretend, with the mic disabled.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HadOSVoiceAssistant } from '../js/apps/HadOSVoiceAssistant.js';
import { WindowFactory } from '../js/ui/WindowFactory.js';

describe('HadOSVoiceAssistant (Hada)', () => {
    beforeEach(() => localStorage.removeItem('hados-ai-chat-models'));
    afterEach(() => localStorage.removeItem('hados-ai-chat-models'));

    it('renders the layout with feed, status, mic button and speak toggle', () => {
        const app = new HadOSVoiceAssistant();
        const body = WindowFactory.getBody(app.windowId)!;
        expect(body.querySelector('#va-feed')).not.toBeNull();
        expect(body.querySelector('#va-status')).not.toBeNull();
        expect(body.querySelector('#va-mic-btn')).not.toBeNull();
        expect(body.querySelector('#va-speak-toggle')).not.toBeNull();
        app.terminate();
    });

    it('states every missing requirement honestly and disables the mic', () => {
        const app = new HadOSVoiceAssistant();
        const body = WindowFactory.getBody(app.windowId)!;
        const req = body.querySelector('#va-requirements')!;
        // jsdom: no MediaRecorder, no imported Gemma.
        expect(req.textContent).toContain('micrófono');
        expect(req.textContent).toContain('Gemma');
        expect(req.textContent).toContain('Tavern Chat'); // points at the import path
        expect((body.querySelector('#va-mic-btn') as HTMLButtonElement).disabled).toBe(true);
        app.terminate();
    });

    it('greets with the on-device honesty statement', () => {
        const app = new HadOSVoiceAssistant();
        const body = WindowFactory.getBody(app.windowId)!;
        expect(body.querySelector('#va-feed')!.textContent).toContain('Nada sale de aquí');
        app.terminate();
    });

    it('a mic click in an unsupported environment does nothing (no crash, no fake state)', async () => {
        const app = new HadOSVoiceAssistant();
        const body = WindowFactory.getBody(app.windowId)!;
        (body.querySelector('#va-mic-btn') as HTMLButtonElement).click();
        await new Promise(r => setTimeout(r, 10));
        expect(app['state']).toBe('idle');
        app.terminate();
    });
});
