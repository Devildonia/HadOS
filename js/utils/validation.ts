/**
 * Validates that object has required properties
 * @param {object} obj - Object to validate
 * @param {Array<string>} required - Required property names
 * @returns {boolean} Is valid
 */
export function validateObject<T extends string>(obj: unknown, required: T[]): obj is Record<T, unknown> {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    return required.every(prop => prop in obj);
}
