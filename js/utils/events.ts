import { Logger } from './logger';

/**
 * Track details for registered event listeners
 */
interface TrackedListener {
    element: Element | Window | Document;
    event: string;
    handler: EventListenerOrEventListenerObject;
    options: boolean | AddEventListenerOptions;
}

/**
 * Manages event listeners to prevent memory leaks
 */
export class EventManager {
    static _idCounter = 0;
    private listeners: Map<string, TrackedListener>;

    constructor() {
        this.listeners = new Map();
    }

    count(): number {
        return this.listeners.size;
    }

    /**
     * Adds an event listener and tracks it
     */
    add(element: Element | Window | Document, event: string, handler: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions = {}): void {
        const key = this._getKey(element, event, handler);

        // Remove old listener if exists
        if (this.listeners.has(key)) {
            this.remove(element, event, handler);
        }

        element.addEventListener(event, handler, options);
        this.listeners.set(key, { element, event, handler, options });
    }

    /**
     * Removes a specific event listener
     */
    remove(element: Element | Window | Document, event: string, handler: EventListenerOrEventListenerObject): void {
        const key = this._getKey(element, event, handler);
        const listener = this.listeners.get(key);

        if (listener) {
            element.removeEventListener(event, handler, listener.options);
            this.listeners.delete(key);
        }
    }

    /**
     * Removes all tracked event listeners
     */
    removeAll(): void {
        for (const [key, { element, event, handler, options }] of this.listeners) {
            element.removeEventListener(event, handler, options);
        }

        this.listeners.clear();
        Logger.groupEnd();
    }

    /**
     * Generates unique key for listener (collision-safe)
     * @private
     */
    private _getKey(element: any, event: string, handler: any): string {
        // Assign unique IDs to avoid collisions with same class/anonymous handlers
        if (!element.__evtId) element.__evtId = ++EventManager._idCounter;
        if (!handler.__handlerId) handler.__handlerId = ++EventManager._idCounter;
        return `el${element.__evtId}-${event}-fn${handler.__handlerId}`;
    }
}

// Create global instance
export const eventManager = new EventManager();
