import { Logger } from './logger';

/**
 * Generates random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Returns random element from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
export function randomChoice<T>(array: T[]): T | null {
    if (!Array.isArray(array) || array.length === 0) {
        Logger.warn('randomChoice: Invalid or empty array');
        return null;
    }
    return array[Math.floor(Math.random() * array.length)] ?? null;
}

/**
 * Checks if value is within range
 * @param {number} value - Value to check
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {boolean} Is in range
 */
export function inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Clamps value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number} Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
