/**
 * Escapes HTML special characters to prevent XSS.
 * Safe for text content, attribute contexts, and Web Workers.
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for innerHTML
 */
export function escapeHTML(str: string): string {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Validates whether a URL scheme is allowed.
 * @param url Target URL
 * @param isImgSrc Whether the URL is for an <img> element src attribute
 */
function isAllowedUrl(url: string, isImgSrc = false): boolean {
    const trimmed = url.trim().toLowerCase();
    if (!trimmed) return true;

    // Relative URLs (starting with /, ./, ../, # or without a colon before any slash)
    if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('.')) return true;
    const colonIndex = trimmed.indexOf(':');
    const slashIndex = trimmed.indexOf('/');
    if (colonIndex === -1 || (slashIndex !== -1 && colonIndex > slashIndex)) return true;

    // Absolute URLs with allowed protocols
    if (trimmed.startsWith('https:') || trimmed.startsWith('http:') || trimmed.startsWith('mailto:')) {
        return true;
    }

    // data: URLs are only allowed for <img> src with image MIME type
    if (isImgSrc && trimmed.startsWith('data:image/')) {
        return true;
    }

    return false;
}

/**
 * Sanitizes HTML by removing script tags and dangerous attributes
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html: string): string {
    if (typeof html !== 'string') return '';

    // Use DOMParser to parse the HTML in a safe context
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Tags allowlist (iframe removed)
    const ALLOWED_TAGS = new Set([
        'html', 'body',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'p', 'br', 'hr', 'span', 'div', 'pre', 'code',
        'b', 'i', 'strong', 'em', 'u', 'strike', 's', 'sub', 'sup',
        'ul', 'ol', 'li', 'dl', 'dt', 'dd',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        'a', 'img', 'canvas', 'blockquote',
        'fieldset', 'legend', 'label', 'input', 'textarea', 'select', 'option', 'button'
    ]);

    // Attributes allowlist (style removed)
    const ALLOWED_ATTRS = new Set([
        'href', 'src', 'alt', 'title', 'class', 'id', 'width', 'height',
        'target', 'rel', 'type', 'value', 'placeholder', 'disabled', 'checked', 'readonly',
        'rows', 'cols', 'colspan', 'rowspan', 'sandbox', 'frameborder', 'data-target'
    ]);

    function cleanNode(node: Node): void {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            const tagName = el.tagName.toLowerCase();

            // If tag is not allowed, replace with text content so text isn't lost
            if (!ALLOWED_TAGS.has(tagName)) {
                const text = el.textContent || '';
                const textNode = doc.createTextNode(text);
                el.replaceWith(textNode);
                return;
            }

            // Remove any attribute not in the allowlist or starting with "on"
            for (const attr of [...el.attributes]) {
                const attrName = attr.name.toLowerCase();
                const attrVal = attr.value;
                if (!ALLOWED_ATTRS.has(attrName) || attrName.startsWith('on')) {
                    el.removeAttribute(attr.name);
                    continue;
                }

                // URL schema validation for href and src
                if (attrName === 'href') {
                    if (!isAllowedUrl(attrVal, false)) {
                        el.removeAttribute(attr.name);
                    }
                } else if (attrName === 'src') {
                    if (!isAllowedUrl(attrVal, tagName === 'img')) {
                        el.removeAttribute(attr.name);
                    }
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
