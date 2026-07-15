import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';

export interface IMessageLibrary {
    get(category: string, avoidRepeat?: boolean): string;
    getByEmotion(emotion: string): string;
    getByState(state: string): string;
    getContextual(context: string): string;
    addToHistory(message: string): void;
    clearHistory(): void;
    getTotalMessageCount(): number;
    getCategories(): string[];
    isEmoji(text: string): boolean;
    getRecommendedFontSize(text: string): number;
}

class MessageLibrary implements IMessageLibrary {
    private messages: Record<string, string[]>;
    private recentMessages: string[];
    private maxHistory: number;

    constructor() {
        this.messages = {
            // ===== GREETINGS (5) =====
            GREETINGS: [
                'ragdoll.greetings.hi',
                'ragdoll.greetings.hello',
                'ragdoll.greetings.hey',
                '👋',
                'ragdoll.greetings.yo'
            ],

            // ===== HAPPINESS (6) =====
            HAPPY: [
                'ragdoll.happy.yay',
                'ragdoll.happy.woohoo',
                '😊',
                'ragdoll.happy.nice',
                'ragdoll.happy.cool',
                '⭐'
            ],

            // ===== SADNESS (5) =====
            SAD: [
                'ragdoll.sad.oww',
                'ragdoll.sad.ouch',
                '😢',
                'ragdoll.sad.noo',
                '💔'
            ],

            // ===== ANGER (5) =====
            ANGRY: [
                'ragdoll.angry.grr',
                '😠',
                'ragdoll.angry.hmph',
                'ragdoll.angry.stop',
                '💢'
            ],

            // ===== FEAR (5) =====
            SCARED: [
                'ragdoll.scared.eek',
                '😱',
                'ragdoll.scared.help',
                'ragdoll.scared.ahh',
                '!!!'
            ],

            // ===== SURPRISE (5) =====
            SURPRISED: [
                'ragdoll.surprised.oh',
                'ragdoll.surprised.wow',
                '😮',
                'ragdoll.surprised.what',
                '⁉️'
            ],

            // ===== TIREDNESS (5) =====
            TIRED: [
                'ragdoll.tired.zzz',
                '😴',
                'ragdoll.tired.yawn',
                'ragdoll.tired.sleepy',
                '💤'
            ],

            // ===== THINKING (5) =====
            THINKING: [
                'ragdoll.thinking.hmm',
                '🤔',
                '...',
                '💭',
                'ragdoll.thinking.whatif'
            ],

            // ===== CONFUSION (4) =====
            CONFUSED: [
                'ragdoll.confused.huh',
                '❓',
                '???',
                'ragdoll.confused.what'
            ],

            // ===== EATING (5) =====
            EATING: [
                'ragdoll.eating.yum',
                '😋',
                'ragdoll.eating.nomnom',
                '🍕',
                'ragdoll.eating.tasty'
            ],

            // ===== DRINKING (4) =====
            DRINKING: [
                'ragdoll.drinking.gulp',
                '🥤',
                'ragdoll.drinking.sip',
                'ragdoll.drinking.ahhh'
            ],

            // ===== EXERCISE (4) =====
            EXERCISING: [
                'ragdoll.exercising.hup',
                '💪',
                'ragdoll.exercising.one',
                'ragdoll.exercising.two'
            ],

            // ===== CELEBRATION (5) =====
            CELEBRATING: [
                'ragdoll.celebrating.yeah',
                '🎉',
                'ragdoll.celebrating.wooo',
                'ragdoll.celebrating.yess',
                '✨'
            ],

            // ===== BOREDOM (4) =====
            BORED: [
                'ragdoll.bored.sigh',
                '😑',
                'ragdoll.bored.meh',
                'ragdoll.bored.sobored'
            ],

            // ===== LOVE (5) =====
            LOVE: [
                '❤️',
                '😍',
                'ragdoll.love.aww',
                '💕',
                'ragdoll.love.loveit'
            ],

            // ===== PAIN (5) =====
            HURT: [
                'ragdoll.hurt.ow',
                '💥',
                'ragdoll.hurt.thathurt',
                'ragdoll.hurt.ouch',
                '😣'
            ],

            // ===== JUMPING (3) =====
            JUMPING: [
                'ragdoll.jumping.whee',
                '!',
                'Boing!'
            ],

            // ===== WATCHING (3) =====
            WATCHING: [
                '👀',
                '...',
                'Hmm?'
            ],

            // ===== STYLE/COOL (5) =====
            COOL: [
                'ragdoll.cool.cool',
                '😎',
                'ragdoll.cool.socool',
                'ragdoll.cool.stylin',
                '✨'
            ],

            // ===== HUNGRY (5) =====
            HUNGRY: [
                'ragdoll.hungry.hungry',
                '😋',
                'ragdoll.hungry.needfood',
                'ragdoll.hungry.pizza',
                '🍔'
            ],

            // ===== FUNNY (5) =====
            FUNNY: [
                'ragdoll.funny.haha',
                '😂',
                'ragdoll.funny.lol',
                'ragdoll.funny.funny',
                '🤣'
            ]
        };

        // Recent message history (avoid repetitions)
        this.recentMessages = [];
        this.maxHistory = 5;

        Utils.Logger.audio(`MessageLibrary initialized with ${this.getTotalMessageCount()} messages`);
    }

    /**
     * Get a random message from a category
     * @param {string} category - Message category
     * @param {boolean} avoidRepeat - Avoid repeating recent messages
     * @returns {string} Selected message
     */
    get(category: string, avoidRepeat: boolean = true): string {
        const messages = this.messages[category];

        if (!messages || messages.length === 0) {
            Utils.Logger.warn(`Category "${category}" not found in MessageLibrary`);
            return '...';
        }

        let messageKey = '';
        if (avoidRepeat && messages.length > 1) {
            // Filter recent messages
            const available = messages.filter(msg => !this.recentMessages.includes(msg));

            if (available.length > 0) {
                messageKey = available[Math.floor(Math.random() * available.length)] || '';
            }
        }

        if (!messageKey) {
            // If none available or not avoiding repetition, pick random
            messageKey = messages[Math.floor(Math.random() * messages.length)] || '';
        }

        if (messageKey) {
            this.addToHistory(messageKey);
        }

        // Translate the key if it belongs to the ragdoll set and i18n is available
        if (messageKey && messageKey.startsWith('ragdoll.')) {
            const i18nService = Services.get('i18n') as any;
            if (i18nService) {
                return i18nService.t(messageKey);
            }
        }

        return messageKey;
    }

    /**
     * Get message based on emotion
     * @param {string} emotion - Current emotion (happy, sad, angry, etc.)
     * @returns {string} Appropriate message
     */
    getByEmotion(emotion: string): string {
        const emotionMap: Record<string, string> = {
            'happy': 'HAPPY',
            'sad': 'SAD',
            'angry': 'ANGRY',
            'panic': 'SCARED',
            'surprised': 'SURPRISED',
            'neutral': 'THINKING',
            'tired': 'TIRED',
            'hurt': 'HURT'
        };

        const category = emotionMap[emotion] || 'THINKING';
        return this.get(category);
    }

    /**
     * Get message based on state
     * @param {string} state - Current state (idle, walking, jumping, etc.)
     * @returns {string} Appropriate message
     */
    getByState(state: string): string {
        const stateMap: Record<string, string> = {
            'idle': 'THINKING',
            'walking': 'HAPPY',
            'scared': 'SCARED',
            'waving': 'GREETINGS',
            'sitting': 'TIRED',
            'jumping': 'JUMPING',
            'dancing': 'CELEBRATING',
            'hurt': 'HURT',
            'looking-up': 'WATCHING'
        };

        const category = stateMap[state] || 'THINKING';
        return this.get(category);
    }

    /**
     * Get contextual message based on situation
     * @param {string} context - Context (grabbed, dropped, near, etc.)
     * @returns {string} Appropriate message
     */
    getContextual(context: string): string {
        switch (context) {
            case 'grabbed':
                return this.get('SURPRISED');
            case 'dropped':
                return this.get('SCARED');
            case 'near':
                return this.get('WATCHING');
            case 'firstMeet':
                return this.get('GREETINGS');
            case 'happy':
                return this.get('HAPPY');
            case 'love':
                return this.get('LOVE');
            default:
                return this.get('THINKING');
        }
    }

    /**
     * Add message to history
     */
    addToHistory(message: string): void {
        this.recentMessages.push(message);
        if (this.recentMessages.length > this.maxHistory) {
            this.recentMessages.shift();
        }
    }

    /**
     * Clear history
     */
    clearHistory(): void {
        this.recentMessages = [];
    }

    /**
     * Get total message count
     */
    getTotalMessageCount(): number {
        return Object.values(this.messages).reduce((sum, arr) => sum + arr.length, 0);
    }

    /**
     * Get all categories
     */
    getCategories(): string[] {
        return Object.keys(this.messages);
    }

    /**
     * Check if text is emoji
     * @param {string} text - Text to verify
     * @returns {boolean} True if it is primarily emoji
     */
    isEmoji(text: string): boolean {
        const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
        return emojiRegex.test(text.trim());
    }

    /**
     * Get recommended font size for text
     * @param {string} text - Text to evaluate
     * @returns {number} Font size in px
     */
    getRecommendedFontSize(text: string): number {
        if (this.isEmoji(text)) {
            return 20; // Larger emojis
        }

        if (text.length <= 3) {
            return 16; // Very short texts
        }

        if (text.length <= 8) {
            return 12; // Short texts
        }

        return 11; // Normal texts
    }
}

// Export for use in modules
export { MessageLibrary };

if (typeof window !== 'undefined') {
    Services.register('MessageLibrary', MessageLibrary);
}