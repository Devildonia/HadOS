/**
 * WINDOWS 95 APP CENTER - EVENT BUS & REACTIVE STORE
 * Replaces direct window.state mutations with observable state
 * Version: 1.1 (ES Modules)
 * 
 * Usage:
 *   Store.set('wallpaper', 'path/to/img.jpg');       // Set + emit
 *   Store.get('wallpaper');                            // Read
 *   Store.on('wallpaper:changed', (val, old) => {});  // React to changes
 *   EventBus.emit('app:launched', { id: 'paint' });   // Custom events
 *   EventBus.on('app:launched', handler);              // Listen
 */

import { Utils } from '../utils.js';
import { Services } from './ServiceContainer.js';
import type { IEventPayloadMap, IStoreStateMap, EventPayload } from './Types.js';

// ============================================
// EVENT BUS — Pub/Sub for decoupled communication
// ============================================
/**
 * Type representing a generic event callback handler function.
 */
export type EventHandler<T extends unknown[] = unknown[]> = (...args: T) => void;

/** Maps standard event payload names. */
type KnownEventName = keyof IEventPayloadMap;
/** Extracts standard arguments structure for a given event name. */
type KnownEventArgs<K extends KnownEventName> = IEventPayloadMap[K] extends unknown[] ? IEventPayloadMap[K] : [IEventPayloadMap[K]];

/**
 * Interface detailing event publish-subscribe operations.
 */
export interface IEventBus {
    /** Subscribes a listener callback to an event. */
    on<K extends KnownEventName>(event: K, handler: EventHandler<KnownEventArgs<K>>): () => void;
    on(event: string, handler: EventHandler<unknown[]>): () => void;
    /** Subscribes a listener callback to an event that executes once and auto-unsubscribes. */
    once<K extends KnownEventName>(event: K, handler: EventHandler<KnownEventArgs<K>>): void;
    once(event: string, handler: EventHandler<unknown[]>): void;
    /** Unsubscribes a listener callback from a target event. */
    off<K extends KnownEventName>(event: K, handler: EventHandler<KnownEventArgs<K>> | EventHandler<unknown[]>): void;
    off(event: string, handler: EventHandler<unknown[]>): void;
    /** Dispatches an event notifying all active subscribers with the supplied payload. */
    emit<K extends KnownEventName>(event: K, ...args: KnownEventArgs<K>): void;
    emit(event: string, ...args: unknown[]): void;
    /** Purges all registered listener callback sets. */
    clear(): void;
    /** Purges all registered listener callback sets (primarily for testing). */
    __reset(): void;
    /** Returns a registry audit of event names mapped to their subscriber counts. */
    debug(): Record<string, number>;
}

const EventBus: IEventBus = (() => {
    'use strict';

    /** Maps event name strings to sets of listener callback references. */
    const listeners = new Map<string, Set<EventHandler<unknown[]>>>();

    /**
     * Subscribe to an event.
     * @param event Event name.
     * @param handler Callback.
     * @returns Unsubscribe function.
     */
    function on(event: string, handler: EventHandler<unknown[]>): () => void {
        const eventName = String(event);
        if (!listeners.has(eventName)) {
            listeners.set(eventName, new Set());
        }
        listeners.get(eventName)!.add(handler);

        // Return unsubscribe function
        return () => off(eventName, handler);
    }

    /**
     * Subscribe to an event (fires only once).
     * @param event Event name.
     * @param handler Callback.
     */
    function once(event: string, handler: EventHandler<unknown[]>): void {
        const wrapper: EventHandler<unknown[]> = (...args) => {
            off(event, wrapper);
            handler(...args);
        };
        on(event, wrapper);
    }

    /**
     * Unsubscribe from an event.
     * @param event Event name.
     * @param handler Callback to remove.
     */
    function off(event: string, handler: EventHandler<unknown[]>): void {
        const eventName = String(event);
        const set = listeners.get(eventName);
        if (set) {
            set.delete(handler);
            if (set.size === 0) listeners.delete(eventName);
        }
    }

    /**
     * Emit an event to all subscribers.
     * @param event Event name.
     * @param args Arguments to pass.
     */
    function emit(event: string, ...args: unknown[]): void {
        const eventName = String(event);
        const set = listeners.get(eventName);
        if (set) {
            // Snapshot before iterating: a handler that on()/once()/off()s the
            // same event during dispatch would otherwise mutate the live Set
            // (re-entrant handlers firing in the same cycle, or a skipped one).
            [...set].forEach(handler => {
                try {
                    handler(...(args as unknown[]));
                } catch (e) {
                    console.error(`[EventBus] Error in handler for "${event}":`, e);
                }
            });
        }
    }

    /**
     * Remove all listeners (for cleanup/testing).
     */
    function clear(): void {
        listeners.clear();
    }

    /**
     * Identical to clear, for testing standard.
     */
    function __reset(): void {
        clear();
    }

    /**
     * Debug: list all registered events and listener counts.
     */
    function debug(): Record<string, number> {
        const info: Record<string, number> = {};
        listeners.forEach((set, event) => {
            info[event] = set.size;
        });
        return info;
    }

    return { on, once, off, emit, clear, __reset, debug };
})();

// ============================================
// STORE — Reactive state container
// ============================================

/**
 * Interface detailing global reactive Store operations.
 */
export interface IStore {
    /** Restores persisted key states from storage and merges initial values. */
    init(defaults?: Partial<IStoreStateMap>): void;
    /** Fetches a state value under a given key, defaulting to the fallback if undefined. */
    get<K extends keyof IStoreStateMap, Fallback = IStoreStateMap[K]>(key: K, fallback?: Fallback): IStoreStateMap[K] | Fallback;
    /** Modifies a state value under a given key, triggering local storage updates and change events on modification. */
    set<K extends keyof IStoreStateMap>(key: K, value: IStoreStateMap[K]): void;
    /** Captures a read-only snapshot copy of the current state mapping. */
    getAll(): Partial<IStoreStateMap>;
    /** Checks if a key is registered within the Store state dictionary. */
    has(key: string): boolean;
    /** Listens for state modification events on a given key. */
    on<K extends string>(event: K, handler: EventHandler<EventPayload<K>>): () => void;
    /** Detaches a listener callback from store change events. */
    off<K extends string>(event: K, handler: EventHandler<unknown[]>): void;
    /** Resets the internal state dictionary (primarily for testing). */
    __reset(): void;
}

const Store: IStore = (() => {
    'use strict';

    /** Map containing internal state values. */
    const _state: Record<string, unknown> = {};

    /** Storage keys configured to auto-save to browser local storage. */
    const PERSISTED_KEYS = new Set<string>([
        'wallpaper',
        'taskbarColor',
        'lang'
    ]);

    /** Maps state keys to legacy localStorage keys for backward compatibility. */
    const KEY_MAP: Record<string, string> = {
        'wallpaper': 'desktop-wallpaper',
        'taskbarColor': 'taskbar-color',
        'lang': 'lang'
    };

    /**
     * Initialize store with defaults, restoring persisted values.
     * @param defaults Default state values.
     */
    function init(defaults: Partial<IStoreStateMap> = {}): void {
        Object.entries(defaults).forEach(([key, value]) => {
            // Try to restore from localStorage first
            if (PERSISTED_KEYS.has(key)) {
                const storageKey = KEY_MAP[key] || key;
                const stored = localStorage.getItem(storageKey);
                if (stored !== null) {
                    try {
                        _state[key] = JSON.parse(stored);
                    } catch {
                        _state[key] = stored; // plain string
                    }
                    return;
                }
            }
            _state[key] = value;
        });

        Utils.Logger.log('[Store] Initialized with keys:', Object.keys(_state).join(', '));
    }

    /**
     * Get a value from state.
     * @param key State key.
     * @param fallback Default if not found.
     * @returns Value.
     */
    function get<K extends keyof IStoreStateMap, Fallback = IStoreStateMap[K]>(key: K, fallback?: Fallback): IStoreStateMap[K] | Fallback {
        return key in _state ? _state[key as string] as IStoreStateMap[K] : fallback!;
    }

    /**
     * Set a value and emit change event.
     * @param key State key.
     * @param value New value.
     */
    function set<K extends keyof IStoreStateMap>(key: K, value: IStoreStateMap[K]): void {
        const keyString = key as string;
        const oldValue = _state[keyString];

        // Skip if unchanged (shallow comparison)
        if (oldValue === value) return;

        _state[keyString] = value;

        // Persist if configured
        if (PERSISTED_KEYS.has(keyString)) {
            const storageKey = KEY_MAP[keyString] || keyString;
            try {
                localStorage.setItem(storageKey,
                    typeof value === 'string' ? value : JSON.stringify(value));
            } catch (e) {
                console.error(`[Store] Failed to persist ${key}:`, e);
            }
        }

        // Emit specific change event
        EventBus.emit(`${keyString}:changed`, value, oldValue);

        // Emit generic change event
        EventBus.emit('store:changed', key as string, value, oldValue);
    }

    /**
     * Get entire state snapshot (read-only copy).
     * @returns State copy.
     */
    function getAll(): Partial<IStoreStateMap> {
        return { ..._state } as Partial<IStoreStateMap>;
    }

    /**
     * Check if a key exists.
     * @param key State key.
     * @returns True if exists, false otherwise.
     */
    function has(key: string): boolean {
        return key in _state;
    }

    /**
     * Reset store (clear state) for testing.
     */
    function __reset(): void {
        Object.keys(_state).forEach(key => delete _state[key]);
    }

    return { init, get, set, getAll, has, on: EventBus.on, off: EventBus.off, __reset };
})();

// ============================================
// BACKWARD COMPATIBILITY BRIDGE
// Keep window.state working for existing code, but proxy mutations to Store
// ============================================
/**
 * Creates a backward compatibility state proxy mapping old window.state mutations to Store operations.
 */
function createStateBridge(): Record<string, unknown> {
    // Initialize Store with the same defaults as old window.state
    Store.init({
        lang: 'en',
        screen: 'desktop',
        bootComplete: false,
        wallpaper: localStorage.getItem('desktop-wallpaper') || '',
        taskbarColor: localStorage.getItem('taskbar-color') || '#c0c0c0'
    });

    // Create a Proxy so old code doing window.state.X = Y triggers Store.set
    const stateProxy = new Proxy({} as Record<string, unknown>, {
        get(target, prop) {
            if (typeof prop !== 'string') return undefined;
            return Store.get(prop);
        },
        set(target, prop, value) {
            if (typeof prop !== 'string') return true;
            Store.set(prop, value);
            return true;
        },
        has(target, prop) {
            if (typeof prop !== 'string') return false;
            return Store.has(prop);
        },
        ownKeys() {
            return Object.keys(Store.getAll());
        },
        getOwnPropertyDescriptor(target, prop) {
            if (typeof prop !== 'string') return undefined;
            if (Store.has(prop)) {
                return { configurable: true, enumerable: true, value: Store.get(prop) };
            }
            return undefined;
        }
    });

    return stateProxy;
}

// ============================================
// EXPORTS
// ============================================
// ES Module exports
export { EventBus, Store, createStateBridge };

// Legacy globals
if (typeof window !== 'undefined') {
    Services.register('EventBus', EventBus);
    window._createStateBridge = createStateBridge;
}
