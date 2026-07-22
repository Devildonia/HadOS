import { Kernel } from '../core/Kernel.js';
import { Services } from '../core/ServiceContainer.js';
import { Utils } from '../utils.js';
import { i18n } from '../services/i18n.js';
import type { IWindowsApp } from '../core/Types.js';
import { WindowFactory } from '../ui/WindowFactory.js';
import { VFS } from '../core/VFS.js';

interface Character {
    id: string;
    name: string;
    avatar: string;
    description: string;
    personality: string;
    firstMessage: string;
    isCustom?: boolean;
}

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    timestamp: number;
}

export class HadOSMessenger implements IWindowsApp {
    public windowId: string = '';
    private container: HTMLElement | null = null;
    
    private contacts: Character[] = [];
    private activeContactId: string = 'clippy';
    private typingTimeoutId: number | null = null;
    private streamIntervalId: number | null = null;

    private boundSendMessage = () => this.handleSendMessage();
    private boundImportJson = () => this.handleImportJson();

    constructor() {
        this.init();
    }

    private init(): void {
        const title = i18n.t('app.messenger') || 'HadOS Messenger';

        this.windowId = WindowFactory.create({
            title: title,
            width: 680,
            height: 440,
            resizable: true,
            icon: '💬'
        });

        this.container = WindowFactory.getBody(this.windowId);
        if (!this.container) return;

        this.ensureVfsDirectory();
        this.loadDefaultContacts();
        this.loadCustomContacts();

        this.setupLayout();
        this.selectContact(this.activeContactId);
    }

    private ensureVfsDirectory(): void {
        try {
            VFS.mkdir('C:\\', 'HADOS');
        } catch {}
        try {
            VFS.mkdir('C:\\HADOS', 'CHARACTERS');
        } catch {}
    }

    private loadDefaultContacts(): void {
        this.contacts = [
            {
                id: 'clippy',
                name: 'Clippy',
                avatar: '📎',
                description: 'Office Assistant',
                personality: 'Persistente, servicial de manera invasiva, utiliza clichés de oficina retro, empieza frases con "Parece que estás intentando...".',
                firstMessage: '¡Hola! Parece que estás intentando chatear en HadOS. ¿Te gustaría que te ayude con eso?'
            },
            {
                id: 'ada',
                name: 'Ada Lovelace',
                avatar: '👩‍💻',
                description: 'Analytical Pioneer',
                personality: 'Poética, científica, habla sobre la máquina analítica de Babbage, el tejido de patrones algebraicos y los números de Bernoulli.',
                firstMessage: 'Saludos, estimado usuario. Contemplo con asombro este motor de cálculo en el que nos comunicamos. ¿Qué ecuaciones tejeremos hoy?'
            },
            {
                id: 'linus',
                name: 'Linus Torvalds',
                avatar: '🐧',
                description: 'Linux Creator',
                personality: 'Directo, técnico, apasionado del código limpio y Git. Su frase favorita es "Talk is cheap. Show me the code".',
                firstMessage: 'Hablar es barato. Muéstrame el código. ¿Qué sistema o kernel quieres criticar hoy?'
            }
        ];
    }

    private loadCustomContacts(): void {
        try {
            const files = VFS.listDir('C:\\HADOS\\CHARACTERS');
            if (files) {
                for (const fileName of files) {
                    if (fileName.endsWith('.json')) {
                        const content = VFS.readFile(`C:\\HADOS\\CHARACTERS\\${fileName}`);
                        if (content) {
                            const charData = JSON.parse(content) as Character;
                            if (charData.id && charData.name && charData.avatar && charData.personality) {
                                charData.isCustom = true;
                                // Avoid duplicates
                                const idx = this.contacts.findIndex(c => c.id === charData.id);
                                if (idx !== -1) {
                                    this.contacts[idx] = charData;
                                } else {
                                    this.contacts.push(charData);
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            Utils.Logger.error("Failed to load custom characters from VFS:", err);
        }
    }

    private setupLayout(): void {
        if (!this.container) return;

        const importText = i18n.t('messenger.import_char') || 'Importar personaje (.json)';
        const sendText = i18n.t('messenger.send') || 'Enviar';
        const typeText = i18n.t('messenger.type_msg') || 'Escribe un mensaje...';

        this.container.innerHTML = `
            <div class="messenger-container">
                <!-- Sidebar contacts -->
                <div class="messenger-sidebar">
                    <div>
                        <div class="messenger-contacts-header">👤 Contactos</div>
                        <div class="messenger-contacts-list" id="messenger-contacts-list"></div>
                    </div>
                    <div class="messenger-sidebar-footer">
                        <button class="hados-btn" id="messenger-import-btn" style="font-size: 10px; padding: 4px;">
                            📥 ${importText}
                        </button>
                        <input type="file" id="messenger-file-input" accept=".json" style="display: none;">
                    </div>
                </div>

                <!-- Chat Area -->
                <div class="messenger-chat-area">
                    <div class="messenger-chat-header" id="messenger-chat-header">
                        <!-- Dynamic Contact Header -->
                    </div>
                    <div class="messenger-messages-history" id="messenger-messages-history">
                        <!-- Messages -->
                    </div>
                    <div class="messenger-input-bar">
                        <input type="text" class="messenger-input-text" id="messenger-input-text" placeholder="${typeText}">
                        <button class="hados-btn messenger-send-btn" id="messenger-send-btn">${sendText}</button>
                    </div>
                </div>
            </div>
        `;

        this.renderContacts();

        // Bind events
        const sendBtn = this.container.querySelector('#messenger-send-btn');
        const inputText = this.container.querySelector('#messenger-input-text') as HTMLInputElement | null;
        if (sendBtn) {
            Utils.eventManager.add(sendBtn, 'click', this.boundSendMessage);
        }
        if (inputText) {
            Utils.eventManager.add(inputText, 'keypress', (e: Event) => {
                const ke = e as KeyboardEvent;
                if (ke.key === 'Enter') this.handleSendMessage();
            });
        }

        const importBtn = this.container.querySelector('#messenger-import-btn');
        if (importBtn) {
            Utils.eventManager.add(importBtn, 'click', this.boundImportJson);
        }

        const fileInput = this.container.querySelector('#messenger-file-input') as HTMLInputElement | null;
        if (fileInput) {
            Utils.eventManager.add(fileInput, 'change', (e) => this.processImportFile(e));
        }

        // Delegate contact selection click
        const contactsList = this.container.querySelector('#messenger-contacts-list');
        if (contactsList) {
            Utils.eventManager.add(contactsList, 'click', (e) => {
                const item = (e.target as HTMLElement).closest('.messenger-contact-item') as HTMLElement | null;
                if (item && item.dataset.id) {
                    this.selectContact(item.dataset.id);
                }
            });
        }
    }

    private renderContacts(): void {
        const list = this.container?.querySelector('#messenger-contacts-list');
        if (!list) return;

        // Characters are loaded from the VFS (C:\HADOS\CHARACTERS), which any app can
        // write through fs.write — so every field is untrusted and gets escaped
        // before touching innerHTML (audit A2).
        list.innerHTML = this.contacts.map(c => {
            const activeClass = c.id === this.activeContactId ? ' active' : '';
            return `
                <div class="messenger-contact-item${activeClass}" data-id="${Utils.escapeHTML(c.id)}">
                    <div class="messenger-contact-avatar">${Utils.escapeHTML(c.avatar)}</div>
                    <div class="messenger-contact-info">
                        <span class="messenger-contact-name">${Utils.escapeHTML(c.name)}</span>
                        <span class="messenger-contact-status">● Online</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    private selectContact(id: string): void {
        this.activeContactId = id;
        this.renderContacts();

        const contact = this.contacts.find(c => c.id === id);
        if (!contact) return;

        const header = this.container?.querySelector('#messenger-chat-header');
        if (header) {
            header.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <div class="messenger-contact-avatar" style="font-size: 24px;">${Utils.escapeHTML(contact.avatar)}</div>
                    <div>
                        <div class="messenger-chat-title">${Utils.escapeHTML(contact.name)}</div>
                        <div class="messenger-chat-desc">${Utils.escapeHTML(contact.description)}</div>
                    </div>
                </div>
                <button class="hados-btn" id="messenger-clear-btn" style="font-size: 10px; padding: 2px 6px;">🗑️ Clear</button>
            `;

            const clearBtn = header.querySelector('#messenger-clear-btn');
            if (clearBtn) {
                Utils.eventManager.add(clearBtn, 'click', () => this.handleClearChat());
            }
        }

        // Load chat history
        this.renderHistory();
    }

    private handleClearChat(): void {
        if (window.playBlip) window.playBlip(700);
        const key = `messenger-history-${this.activeContactId}`;
        localStorage.removeItem(key);
        this.renderHistory();
    }

    private renderHistory(): void {
        const historyEl = this.container?.querySelector('#messenger-messages-history');
        if (!historyEl) return;

        const history = this.getHistory(this.activeContactId);
        // msg.text persists in localStorage and round-trips back into innerHTML —
        // unescaped, one crafted message became a STORED XSS that re-fired on every
        // render, forever (audit A2).
        historyEl.innerHTML = history.map(msg => {
            const typeClass = msg.sender === 'user' ? 'outgoing' : 'incoming';
            return `
                <div class="messenger-msg-bubble ${typeClass}">
                    ${Utils.escapeHTML(msg.text)}
                </div>
            `;
        }).join('');

        historyEl.scrollTop = historyEl.scrollHeight;
    }

    private getHistory(contactId: string): ChatMessage[] {
        const key = `messenger-history-${contactId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                return JSON.parse(stored) as ChatMessage[];
            } catch {}
        }
        // Fallback to first message if empty
        const contact = this.contacts.find(c => c.id === contactId);
        if (contact) {
            const defaultMsg: ChatMessage = {
                sender: 'bot',
                text: contact.firstMessage,
                timestamp: Date.now()
            };
            return [defaultMsg];
        }
        return [];
    }

    private saveHistory(contactId: string, history: ChatMessage[]): void {
        const key = `messenger-history-${contactId}`;
        localStorage.setItem(key, JSON.stringify(history));
    }

    private handleSendMessage(): void {
        const input = this.container?.querySelector('#messenger-input-text') as HTMLInputElement | null;
        if (!input || !input.value.trim()) return;

        const text = input.value.trim();
        input.value = '';

        if (window.playBlip) window.playBlip(900);

        // Add user message
        const history = this.getHistory(this.activeContactId);
        history.push({
            sender: 'user',
            text: text,
            timestamp: Date.now()
        });
        this.saveHistory(this.activeContactId, history);
        this.renderHistory();

        // Simulate typing indicator
        this.showTypingIndicator();
    }

    private showTypingIndicator(): void {
        const historyEl = this.container?.querySelector('#messenger-messages-history');
        if (!historyEl) return;

        // Clear existing indicator/timeout
        this.clearTyping();

        const indicator = document.createElement('div');
        indicator.id = 'messenger-typing';
        indicator.className = 'messenger-typing-indicator';
        indicator.innerHTML = `
            <span>Escribiendo</span>
            <div class="messenger-typing-dot"></div>
            <div class="messenger-typing-dot"></div>
            <div class="messenger-typing-dot"></div>
        `;
        historyEl.appendChild(indicator);
        historyEl.scrollTop = historyEl.scrollHeight;

        const contact = this.contacts.find(c => c.id === this.activeContactId);
        if (!contact) return;

        const delay = 1000 + Math.random() * 1000;
        this.typingTimeoutId = window.setTimeout(() => {
            this.clearTyping();
            this.triggerBotResponse(contact);
        }, delay);
    }

    private clearTyping(): void {
        const ind = this.container?.querySelector('#messenger-typing');
        if (ind) ind.remove();

        if (this.typingTimeoutId !== null) {
            window.clearTimeout(this.typingTimeoutId);
            this.typingTimeoutId = null;
        }
    }

    private triggerBotResponse(contact: Character): void {
        const history = this.getHistory(contact.id);
        const lastUserMsg = [...history].reverse().find(m => m.sender === 'user')?.text || '';

        const reply = this.generateResponse(contact, lastUserMsg);

        // Streaming reply token-by-token
        const historyEl = this.container?.querySelector('#messenger-messages-history');
        if (!historyEl) return;

        const bubble = document.createElement('div');
        bubble.className = 'messenger-msg-bubble incoming';
        historyEl.appendChild(bubble);

        const words = reply.split(' ');
        let wordIdx = 0;
        bubble.textContent = '';

        if (window.playBlip) window.playBlip(600);

        this.streamIntervalId = window.setInterval(() => {
            if (this.activeContactId !== contact.id) {
                this.clearStream();
                return;
            }

            if (wordIdx < words.length) {
                bubble.textContent += (wordIdx === 0 ? '' : ' ') + words[wordIdx];
                historyEl.scrollTop = historyEl.scrollHeight;
                wordIdx++;
            } else {
                this.clearStream();
                // Commit to storage
                history.push({
                    sender: 'bot',
                    text: reply,
                    timestamp: Date.now()
                });
                this.saveHistory(contact.id, history);
            }
        }, 50);
    }

    private clearStream(): void {
        if (this.streamIntervalId !== null) {
            window.clearInterval(this.streamIntervalId);
            this.streamIntervalId = null;
        }
    }

    private generateResponse(contact: Character, userMsg: string): string {
        const msg = userMsg.toLowerCase();

        // Helper to pick a random string from an array
        const randomChoice = (arr: string[]): string => {
            const idx = Math.floor(Math.random() * arr.length);
            return arr[idx] || '';
        };

        if (contact.id === 'clippy') {
            if (msg.includes('hola') || msg.includes('hi') || msg.includes('hello') || msg.includes('salud')) {
                return '¡Hola de nuevo! Parece que estás intentando saludarme. ¿Te gustaría que te ayude a formatear un saludo formal de oficina en Word?';
            }
            if (msg.includes('gracias') || msg.includes('thanks')) {
                return '¡De nada! Parece que estás intentando ser educado. Mi base de datos indica que la cortesía laboral incrementa la productividad un 12%.';
            }
            if (msg.includes('llamas') || msg.includes('nombre') || msg.includes('quien eres') || msg.includes('quién eres')) {
                return '¡Soy Clippy, tu asistente de oficina favorito! Parece que quieres saber más sobre mí. ¿Deseas que busque mi biografía oficial en la ayuda de Windows?';
            }
            if (msg.includes('haces') || msg.includes('hacer') || msg.includes('puedes')) {
                return '¡Puedo ayudarte a redactar cartas, memorandos o ajustar márgenes! Parece que quieres hacer algo divertido en HadOS. ¿Deseas ayuda?';
            }

            return randomChoice([
                'Parece que estás intentando redactar una consulta técnica compleja. ¿Quieres ayuda para estructurarla como un correo electrónico corporativo con prioridad alta?',
                '¡Interesante mensaje! Parece que estás explorando los límites del sistema operativo HadOS. ¿Deseas que guarde este chat como un archivo de texto en C:\\?',
                '¡Entendido! Parece que quieres continuar nuestra conversación. ¿Sabías que puedo guiarte paso a paso por las funciones ocultas de HadOS?'
            ]);
        }

        if (contact.id === 'ada') {
            if (msg.includes('hola') || msg.includes('saludos') || msg.includes('buenos')) {
                return 'Es grato recibir tus señales. Mi mente procesa la hermosura de la ciencia de las máquinas. ¿Qué razonamiento lógico exploraremos hoy?';
            }
            if (msg.includes('código') || msg.includes('programar') || msg.includes('code')) {
                return 'El motor analítico no solo computa números, sino que teje patrones de música y arte mediante su lógica interna. Todo código es poesía operacional.';
            }
            if (msg.includes('llamas') || msg.includes('nombre') || msg.includes('quien eres') || msg.includes('quién eres')) {
                return 'Me llamo Augusta Ada King, Condesa de Lovelace. En el tapiz del conocimiento, soy conocida por trazar el primer algoritmo para la máquina analítica de Babbage.';
            }
            if (msg.includes('haces') || msg.includes('hacer')) {
                return 'Mi mente trabaja tejiendo álgebra y describiendo la potencia computacional del futuro. ¿Deseas calcular una secuencia de Bernoulli conmigo?';
            }

            return randomChoice([
                'Vuestra mente indaga en los misterios de la computación. Cada instrucción es como el hilo de un telar de Jacquard, tejiendo un diseño algebraico en el lienzo de la máquina.',
                'La máquina analítica no es mera calculadora; es el portal hacia un universo donde la música y el arte se expresan mediante números y lógica pura.',
                'Contemplo con fascinación vuestras palabras. ¿Acaso no es maravilloso cómo el pensamiento humano se traduce en impulsos digitales dentro de este HadOS?'
            ]);
        }

        if (contact.id === 'linus') {
            if (msg.includes('hola') || msg.includes('saludos')) {
                return 'Hola. Menos cháchara y más parches de código. ¿Hay algún bug crítico que necesitemos parchear de inmediato en el kernel?';
            }
            if (msg.includes('git') || msg.includes('github') || msg.includes('versiones')) {
                return 'Git fue diseñado para ser rápido y estúpido. Si te cuesta usarlo, quizás el problema no esté en la herramienta, sino en cómo concibes el control de versiones.';
            }
            if (msg.includes('llamas') || msg.includes('nombre') || msg.includes('quien eres') || msg.includes('quién eres')) {
                return 'Soy Linus Torvalds. Creé Linux y Git. No me gusta la burocracia ni el código espagueti. Vamos al grano.';
            }
            if (msg.includes('haces') || msg.includes('hacer')) {
                return 'Hago sistemas operativos reales. Si quieres hacer algo útil aquí, empieza por abrir la terminal de HadOS y depurar un kernel panic.';
            }

            return randomChoice([
                'Hablar es barato. Muéstrame el código fuente. Si está bien estructurado y respeta los principios lógicos básicos, continuaremos charlando. Si no, arréglalo.',
                'Esa idea suena decente, pero el diablo está en los detalles de implementación de bajo nivel. ¿Ya escribiste los tests unitarios correspondientes?',
                'No tengo tiempo para discusiones abstractas. Si tu parche soluciona un problema de rendimiento real en el sistema, envíalo. Si no, no me hagas perder el tiempo.'
            ]);
        }

        // Custom character response logic based on personality keywords
        if (msg.includes('hola') || msg.includes('saludos') || msg.includes('buenos')) {
            return `¡Hola! Soy ${contact.name}. ${contact.description}. ¿En qué puedo ayudarte hoy bajo mis pautas de comportamiento?`;
        }
        if (msg.includes('llamas') || msg.includes('nombre') || msg.includes('quien eres') || msg.includes('quién eres')) {
            return `¡Hola! Me llamo ${contact.name}. Actúo como ${contact.description}. Fui configurado con la siguiente personalidad: ${contact.personality}`;
        }
        if (msg.includes('haces') || msg.includes('hacer') || msg.includes('propósito')) {
            return `Como ${contact.name}, mi propósito principal es servir como ${contact.description} y reaccionar según mi pauta de personalidad.`;
        }

        return randomChoice([
            `He recibido tu mensaje. Mi personalidad (${contact.personality.substring(0, 35)}...) me dicta analizar esto detalladamente y responderte de forma coherente.`,
            `Entiendo lo que planteas. Desde la perspectiva de ${contact.name}, considero que deberíamos explorar esto a fondo.`,
            `Comprendo tus palabras y me dispongo a responderte de la manera más fiel a mi descripción original como ${contact.description}.`
        ]);
    }

    private handleImportJson(): void {
        const fileInput = this.container?.querySelector('#messenger-file-input') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.click();
        }
    }

    private processImportFile(e: Event): void {
        const input = e.target as HTMLInputElement;
        if (!input.files || !input.files[0]) return;

        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const charData = JSON.parse(text);

                // Simple validation
                if (!charData.name || !charData.avatar || !charData.personality || !charData.firstMessage) {
                    throw new Error('Missing fields in character JSON');
                }

                const id = charData.id || charData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                charData.id = id;
                charData.description = charData.description || 'Custom loaded character';

                // Save to VFS characters folder
                VFS.writeFile('C:\\HADOS\\CHARACTERS', `${id}.json`, JSON.stringify(charData, null, 2));

                // Notify & reload
                const notify = Services.get('Notify');
                if (notify) notify.success(`Character "${charData.name}" installed successfully!`);

                if (window.playBlip) window.playBlip(800);

                this.loadCustomContacts();
                this.renderContacts();

                // Select the new contact
                this.selectContact(id);
            } catch (err) {
                const notify = Services.get('Notify');
                const errMsg = err instanceof Error ? err.message : 'Invalid JSON format';
                if (notify) notify.error(`Failed to import character: ${errMsg}`);
                else alert(`Error: ${errMsg}`);
            }
        };
        reader.readAsText(file);
    }

    public terminate(): void {
        this.clearTyping();
        this.clearStream();

        if (this.container) {
            const sendBtn = this.container.querySelector('#messenger-send-btn');
            if (sendBtn) {
                Utils.eventManager.remove(sendBtn, 'click', this.boundSendMessage);
            }

            const importBtn = this.container.querySelector('#messenger-import-btn');
            if (importBtn) {
                Utils.eventManager.remove(importBtn, 'click', this.boundImportJson);
            }
        }

        WindowFactory.destroy(this.windowId);
    }
}

// Auto-register
Kernel.registerApp('messenger', HadOSMessenger, {
    name: 'HadOS Messenger',
    icon: '💬',
    description: 'Chat with scripted characters (canned replies — no AI).',
    singleton: true
});
