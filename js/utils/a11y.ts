let _announceTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Announces text to screen readers using aria-live announcer
 * @param {string} text - Message to announce
 */
export function announce(text: string): void {
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
