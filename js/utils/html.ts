/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for innerHTML
 */
export function escapeHTML(str: string): string {
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
export function sanitizeHTML(html: string): string {
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
