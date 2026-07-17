import { Logger } from './utils/logger';
import { escapeHTML, sanitizeHTML } from './utils/html';
import { sanitizePath, pathSegments, hasTraversal, isSafeRelativePath, normalizeVfsPath } from './utils/vfs';
import { debounce, throttle } from './utils/timing';
import { getElement, showElement, hideElement, toggleElement } from './utils/dom';
import { randomInt, randomFloat, randomChoice, inRange, clamp } from './utils/math';
import { eventManager } from './utils/events';
import { getStorage, setStorage, removeStorage } from './utils/storage';
import { announce } from './utils/a11y';
import { validateObject } from './utils/validation';

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
    (window as any).Utils = Utils;
}
