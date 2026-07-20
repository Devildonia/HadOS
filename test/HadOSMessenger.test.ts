import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HadOSMessenger } from '../js/apps/HadOSMessenger';
import { Kernel } from '../js/core/Kernel';
import { WindowFactory } from '../js/ui/WindowFactory';
import { VFS } from '../js/core/VFS';

describe('HadOSMessenger App', () => {
    let windowBody: HTMLDivElement;

    beforeEach(() => {
        vi.restoreAllMocks();

        windowBody = document.createElement('div');
        document.body.appendChild(windowBody);

        vi.spyOn(WindowFactory, 'create').mockReturnValue('win-messenger-test');
        vi.spyOn(WindowFactory, 'getBody').mockReturnValue(windowBody);
        vi.spyOn(WindowFactory, 'destroy').mockImplementation(() => {});

        window.playBlip = vi.fn();
        localStorage.clear();

        // Stub VFS
        vi.spyOn(VFS, 'mkdir').mockImplementation(() => true);
        vi.spyOn(VFS, 'listDir').mockReturnValue([]);
        vi.spyOn(VFS, 'writeFile').mockImplementation(() => true);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        delete window.playBlip;
        localStorage.clear();
    });

    it('should register with the Kernel', () => {
        const registry = Kernel.getRegistry();
        expect(registry.apps['messenger']).toBeDefined();
    });

    it('should initialize structure and load default contacts', () => {
        const app = new HadOSMessenger();
        expect(WindowFactory.create).toHaveBeenCalled();
        expect(windowBody.innerHTML).toContain('messenger-container');
        expect(windowBody.innerHTML).toContain('Clippy');
        expect(windowBody.innerHTML).toContain('Ada Lovelace');
        expect(windowBody.innerHTML).toContain('Linus Torvalds');
        app.terminate();
    });

    it('should select contact and load chat history from localStorage', () => {
        const testHistory = [
            { sender: 'user', text: 'Hello Ada', timestamp: Date.now() },
            { sender: 'bot', text: 'Hello indeed.', timestamp: Date.now() }
        ];
        localStorage.setItem('messenger-history-ada', JSON.stringify(testHistory));

        const app = new HadOSMessenger();
        const adaItem = windowBody.querySelector('.messenger-contact-item[data-id="ada"]') as HTMLElement;
        expect(adaItem).not.toBeNull();
        adaItem.click();

        expect(windowBody.innerHTML).toContain('Hello Ada');
        expect(windowBody.innerHTML).toContain('Hello indeed.');

        app.terminate();
    });

    it('should send a user message and trigger typing indicator simulation', async () => {
        const app = new HadOSMessenger();

        const input = windowBody.querySelector('#messenger-input-text') as HTMLInputElement;
        const sendBtn = windowBody.querySelector('#messenger-send-btn') as HTMLButtonElement;

        input.value = 'Test Message';
        sendBtn.click();

        expect(window.playBlip).toHaveBeenCalledWith(900);
        expect(windowBody.innerHTML).toContain('Test Message');
        expect(windowBody.querySelector('#messenger-typing')).not.toBeNull();

        app.terminate();
    });

    it('should read custom characters from VFS during init', () => {
        vi.spyOn(VFS, 'listDir').mockReturnValue(['batman.json']);
        vi.spyOn(VFS, 'readFile').mockReturnValue(JSON.stringify({
            id: 'batman',
            name: 'Batman',
            avatar: '🦇',
            description: 'The Dark Knight',
            personality: 'Grave, justice, protector of Gotham',
            firstMessage: 'I am vengeance. I am the night.'
        }));

        const app = new HadOSMessenger();
        expect(windowBody.innerHTML).toContain('Batman');
        app.terminate();
    });

    it('should clear chat history when clear button is clicked', () => {
        const app = new HadOSMessenger();
        const clearBtn = windowBody.querySelector('#messenger-clear-btn') as HTMLButtonElement;
        expect(clearBtn).not.toBeNull();

        // Add dummy message to history
        localStorage.setItem('messenger-history-clippy', JSON.stringify([
            { sender: 'user', text: 'Hello', timestamp: Date.now() }
        ]));
        app['renderHistory'](); // reload

        expect(windowBody.innerHTML).toContain('Hello');

        clearBtn.click();
        expect(localStorage.getItem('messenger-history-clippy')).toBeNull();
        expect(windowBody.innerHTML).not.toContain('Hello');

        app.terminate();
    });
});
