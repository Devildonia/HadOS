

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
        for (const [, { element, event, handler, options }] of this.listeners) {
            element.removeEventListener(event, handler, options);
        }

        this.listeners.clear();
    }

    /**
     * Creates a scoped handle tied to one window or component lifecycle.
     *
     * The global manager holds STRONG references to every element and handler it
     * tracks, so an `add()` whose `remove()` never comes pins that DOM node for the
     * life of the page — and anonymous arrow handlers can't be removed at all, since
     * the caller keeps no reference to pass back (audit v1.0.0-rc.1, M-08). A scope
     * remembers what it registered, so teardown is one `removeAll()` and inline
     * arrows stop being a leak.
     *
     * Delegates to `add`/`remove` rather than reimplementing them, so scoped
     * listeners get the same dedupe and appear in the same `count()`.
     */
    scope(_owner?: string) {
        const scoped: TrackedListener[] = [];
        return {
            add: (element: Element | Window | Document, event: string, handler: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions = {}) => {
                this.add(element, event, handler, options);
                scoped.push({ element, event, handler, options });
            },
            removeAll: () => {
                for (const { element, event, handler } of scoped) {
                    this.remove(element, event, handler);
                }
                scoped.length = 0;
            },
            count: () => scoped.length,
        };
    }

    /**
     * Generates unique key for listener (collision-safe)
     * @private
     */
    private _getKey(element: unknown, event: string, handler: unknown): string {
        const el = element as Record<string, unknown>;
        const fn = handler as Record<string, unknown>;
        // Assign unique IDs to avoid collisions with same class/anonymous handlers
        if (!el.__evtId) el.__evtId = ++EventManager._idCounter;
        if (!fn.__handlerId) fn.__handlerId = ++EventManager._idCounter;
        return `el${el.__evtId}-${event}-fn${fn.__handlerId}`;
    }
}

// Create global instance
export const eventManager = new EventManager();
