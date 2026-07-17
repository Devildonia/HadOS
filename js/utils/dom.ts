import { Logger } from './logger';

/**
 * Safely gets element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
export function getElement(id: string): HTMLElement | null {
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
export function showElement(id: string): boolean {
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
export function hideElement(id: string): boolean {
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
export function toggleElement(id: string): boolean {
    const element = getElement(id);
    if (element) {
        const isHidden = element.style.display === 'none';
        element.style.display = isHidden ? 'block' : 'none';
        return isHidden;
    }
    return false;
}
