/**
 * WINDOWS 95 APP CENTER - UTILITIES
 * Helper functions, logging, sanitization, and common utilities
 * Version: 0.7 (ES Modules)
 */

import { CONFIG } from './config';

// ============================================
// LOGGER SYSTEM
// ============================================
const Logger = {
    enabled: CONFIG.DEBUG.ENABLED,

    log(...args: any[]) {
        if (this.enabled) {
            console.log('[Win95]', ...args);
        }
    },

    info(...args: any[]) {
        if (this.enabled) {
            console.info('[Win95]', ...args);
        }
    },

    warn(...args: any[]) {
        if (this.enabled) {
            console.warn('[Win95]', ...args);
        }
    },

    error(...args: any[]) {
        // Always show errors, even in production
        console.error('[Win95 ERROR]', ...args);
    },

    group(label: string) {
        if (this.enabled) {
            console.group('[Win95]', label);
        }
    },

    groupEnd() {
        if (this.enabled) {
            console.groupEnd();
        }
    },

    // Specific loggers
    init(...args: any[]) {
        if (this.enabled) {
            console.log('[Win95:INIT]', ...args);
        }
    },

    game(...args: any[]) {
        if (this.enabled && CONFIG.DEBUG.LOG_EVENTS) {
            console.log('[Win95:GAME]', ...args);
        }
    },

    ragdoll(...args: any[]) {
        if (this.enabled && CONFIG.DEBUG.LOG_RAGDOLL) {
            console.log('[Win95:RAGDOLL]', ...args);
        }
    },

    audio(...args: any[]) {
        if (this.enabled && CONFIG.DEBUG.LOG_AUDIO) {
            console.log('[Win95:AUDIO]', ...args);
        }
    },

    window(...args: any[]) {
        if (this.enabled) {
            console.log('[Win95:WINDOW]', ...args);
        }
    }
};

// ============================================
// HTML SANITIZATION
// ============================================

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for innerHTML
 */
function escapeHTML(str: string): string {
    if (typeof str !== 'string') return '';

    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Sanitizes HTML by removing script tags and dangerous attributes
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
function sanitizeHTML(html: string): string {
    if (typeof html !== 'string') return '';

    // Use DOMParser to parse the HTML in a safe context
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Tags allowlist
    const ALLOWED_TAGS = new Set([
        'html', 'body',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'p', 'br', 'hr', 'span', 'div', 'pre', 'code',
        'b', 'i', 'strong', 'em', 'u', 'strike', 's', 'sub', 'sup',
        'ul', 'ol', 'li', 'dl', 'dt', 'dd',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        'a', 'img', 'iframe', 'canvas', 'blockquote',
        'fieldset', 'legend', 'label', 'input', 'textarea', 'select', 'option', 'button'
    ]);

    // Attributes allowlist
    const ALLOWED_ATTRS = new Set([
        'href', 'src', 'alt', 'title', 'class', 'id', 'style', 'width', 'height',
        'target', 'rel', 'type', 'value', 'placeholder', 'disabled', 'checked', 'readonly',
        'rows', 'cols', 'colspan', 'rowspan', 'sandbox', 'frameborder', 'data-target'
    ]);

    function cleanNode(node: Node): void {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            const tagName = el.tagName.toLowerCase();

            // If tag is not allowed, remove the node entirely
            if (!ALLOWED_TAGS.has(tagName)) {
                el.remove();
                return;
            }

            // Remove any attribute not in the allowlist or starting with "on"
            for (const attr of [...el.attributes]) {
                const attrName = attr.name.toLowerCase();
                if (!ALLOWED_ATTRS.has(attrName) || attrName.startsWith('on')) {
                    el.removeAttribute(attr.name);
                }
            }
        }

        // Clean child nodes
        for (const child of [...node.childNodes]) {
            cleanNode(child);
        }
    }

    const body = doc.body || doc.querySelector('body') || doc.documentElement;
    cleanNode(body);
    const resultElement = body.tagName?.toLowerCase() === 'body' ? body : (body.querySelector('body') || body);
    return resultElement.innerHTML;
}

/**
 * Sanitizes a file/folder name for VFS operations
 * Removes dangerous characters that could cause path traversal or XSS
 * @param {string} name - File or folder name
 * @returns {string} Sanitized name
 */
function sanitizePath(name: string): string {
    if (typeof name !== 'string') return '';
    return name
        .replace(/[<>:"/\\|?*]/g, '_')  // Remove filesystem-dangerous chars
        .replace(/\.\./g, '_')           // Prevent path traversal
        .replace(/^\s+|\s+$/g, '')       // Trim whitespace
        .substring(0, 255);              // Max length
}

/** Splits a VFS path into segments, treating `/` and `\` alike. */
function pathSegments(path: string): string[] {
    if (typeof path !== 'string') return [];
    return path.replace(/\//g, '\\').split('\\').filter(Boolean);
}

/**
 * True when any segment is `..` — i.e. the path attempts directory traversal.
 * Callers must REJECT such paths at the boundary rather than rely on how the VFS
 * happens to resolve them (today `VFS.resolve` treats `..` as a literal name, so
 * traversal fails by accident, not by design).
 */
function hasTraversal(path: string): boolean {
    return pathSegments(path).some(seg => seg === '..');
}

/**
 * True when `path` is a safe *relative* path usable as a key inside a package or
 * an app home: no `..` segments, no drive prefix (`C:`) and no leading separator
 * (both of which would make it absolute).
 */
function isSafeRelativePath(path: string): boolean {
    if (typeof path !== 'string' || !path.trim()) return false;
    if (/^[a-z]:/i.test(path)) return false;   // drive prefix -> absolute
    if (/^[\\/]/.test(path)) return false;     // leading separator -> absolute
    return !hasTraversal(path);
}

/**
 * Normalizes an absolute VFS path for comparison: unifies separators, drops
 * empty segments and trailing separators. Does NOT resolve `..` — use
 * hasTraversal() to reject those first.
 */
function normalizeVfsPath(path: string): string {
    const segs = pathSegments(path);
    return segs.join('\\');
}

// ============================================
// DEBOUNCING
// ============================================

/**
 * Creates a debounced function that delays execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(this: any, ...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Creates a throttled function that executes at most once per interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds between executions
 * @returns {Function} Throttled function
 */
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ============================================
// DOM UTILITIES
// ============================================

/**
 * Safely gets element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
function getElement(id: string): HTMLElement | null {
    const element = document.getElementById(id);
    if (!element) {
        Logger.warn(`Element not found: ${id}`);
    }
    return element;
}

/**
 * Safely shows an element
 * @param {string} id - Element ID
 * @returns {boolean} Success status
 */
function showElement(id: string): boolean {
    const element = getElement(id);
    if (element) {
        element.style.display = 'block';
        return true;
    }
    return false;
}

/**
 * Safely hides an element
 * @param {string} id - Element ID
 * @returns {boolean} Success status
 */
function hideElement(id: string): boolean {
    const element = getElement(id);
    if (element) {
        element.style.display = 'none';
        return true;
    }
    return false;
}

/**
 * Safely toggles element visibility
 * @param {string} id - Element ID
 * @returns {boolean} New visibility state (true = visible)
 */
function toggleElement(id: string): boolean {
    const element = getElement(id);
    if (element) {
        const isHidden = element.style.display === 'none';
        element.style.display = isHidden ? 'block' : 'none';
        return isHidden;
    }
    return false;
}

// ============================================
// RANDOM NUMBER UTILITIES
// ============================================

/**
 * Generates random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Returns random element from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
function randomChoice<T>(array: T[]): T | null {
    if (!Array.isArray(array) || array.length === 0) {
        Logger.warn('randomChoice: Invalid or empty array');
        return null;
    }
    return array[Math.floor(Math.random() * array.length)] ?? null;
}

// ============================================
// EVENT MANAGER
// ============================================

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
class EventManager {
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
const eventManager = new EventManager();

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Checks if value is within range
 * @param {number} value - Value to check
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {boolean} Is in range
 */
function inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Clamps value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number} Clamped value
 */
function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Validates that object has required properties
 * @param {object} obj - Object to validate
 * @param {Array<string>} required - Required property names
 * @returns {boolean} Is valid
 */
function validateObject<T extends string>(obj: any, required: T[]): obj is Record<T, unknown> {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    return required.every(prop => prop in obj);
}

// ============================================
// STORAGE UTILITIES
// ============================================

/**
 * Safely gets item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default if not found
 * @returns {*} Stored value or default
 */
function getStorage<T>(key: string, defaultValue: T | null = null): T | null {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? JSON.parse(value) : defaultValue;
    } catch (error) {
        Logger.error('localStorage get error:', error);
        return defaultValue;
    }
}

/**
 * Safely sets item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
function setStorage<T>(key: string, value: T): boolean {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        Logger.error('localStorage set error:', error);
        return false;
    }
}

/**
 * Removes item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
function removeStorage(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        Logger.error('localStorage remove error:', error);
        return false;
    }
}

let _announceTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Announces text to screen readers using aria-live announcer
 * @param {string} text - Message to announce
 */
function announce(text: string): void {
    if (typeof document === 'undefined') return;
    const announcer = document.getElementById('a11y-announcer');
    if (!announcer) return;

    if (_announceTimeout) {
        clearTimeout(_announceTimeout);
        _announceTimeout = null;
    }

    announcer.textContent = text;

    _announceTimeout = setTimeout(() => {
        announcer.textContent = '';
        _announceTimeout = null;
    }, 1000);
}

// ============================================
// EXPORT UTILITIES
// ============================================

// Export for ES Modules
export const Utils = {
    announce,
    Logger,
    escapeHTML,
    sanitizeHTML,
    sanitizePath,
    pathSegments,
    hasTraversal,
    isSafeRelativePath,
    normalizeVfsPath,
    debounce,
    throttle,
    getElement,
    showElement,
    hideElement,
    toggleElement,
    randomInt,
    randomFloat,
    randomChoice,
    eventManager,
    inRange,
    clamp,
    validateObject,
    getStorage,
    setStorage,
    removeStorage
};

// Legacy global (for HTML onclick handlers and modules not yet migrated)
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}
