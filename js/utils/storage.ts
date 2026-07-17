import { Logger } from './logger';

/**
 * Safely gets item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default if not found
 * @returns {*} Stored value or default
 */
export function getStorage<T>(key: string, defaultValue: T | null = null): T | null {
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
export function setStorage<T>(key: string, value: T): boolean {
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
export function removeStorage(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        Logger.error('localStorage remove error:', error);
        return false;
    }
}
