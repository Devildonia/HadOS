import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Kernel } from '../js/core/Kernel.js';
import { Services } from '../js/core/ServiceContainer.js';

// Import IE module (registers with Kernel)
import '../js/apps/InternetExplorer.js';

describe('InternetExplorer', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        Kernel.getRegistry().processes.forEach(p => Kernel.kill(p.pid));
        Services.__reset();

        document.body.innerHTML = `
            <div id="win-internet-explorer" class="win95-window" style="display:none;">
                <div class="window-header"><span>Internet Explorer</span></div>
                <div class="window-body">
                    <input id="ie-address-input" type="text" value="">
                    <iframe id="ie-frame" src="about:blank"></iframe>
                    <div id="ie-status">Ready</div>
                </div>
            </div>
        `;
    });

    describe('registration', () => {
        it('should register as "internet-explorer" in Kernel', () => {
            const registry = Kernel.getRegistry();
            expect(registry.apps['internet-explorer']).toBeDefined();
            expect(registry.apps['internet-explorer'].metadata.name).toBe('Internet Explorer');
        });
    });

    describe('URL validation (security)', () => {
        let ieInstance;

        beforeEach(() => {
            const proc = Kernel.launch('internet-explorer');
            ieInstance = proc.instance;
        });

        it('should block javascript: protocol (XSS)', () => {
            const result = ieInstance.validateUrl('javascript:alert(1)');
            expect(result).toBeNull();
        });

        it('should block data: protocol', () => {
            const result = ieInstance.validateUrl('data:text/html,<script>alert(1)</script>');
            expect(result).toBeNull();
        });

        it('should block vbscript: protocol', () => {
            const result = ieInstance.validateUrl('vbscript:msgbox("hack")');
            expect(result).toBeNull();
        });

        it('should block blob: protocol', () => {
            const result = ieInstance.validateUrl('blob:http://evil.com/uuid');
            expect(result).toBeNull();
        });

        it('should accept https:// URLs', () => {
            const result = ieInstance.validateUrl('https://www.google.com');
            expect(result).toBe('https://www.google.com');
        });

        it('should accept http:// URLs', () => {
            const result = ieInstance.validateUrl('http://example.com');
            expect(result).toBe('http://example.com');
        });

        it('should auto-prefix https:// when no protocol given', () => {
            const result = ieInstance.validateUrl('www.google.com');
            expect(result).toBe('https://www.google.com');
        });

        it('should trim whitespace from URLs', () => {
            const result = ieInstance.validateUrl('  https://example.com  ');
            expect(result).toBe('https://example.com');
        });

        it('should return null for empty/null input', () => {
            expect(ieInstance.validateUrl('')).toBeNull();
            expect(ieInstance.validateUrl(null)).toBeNull();
        });

        it('should be case-insensitive for protocol blocking', () => {
            expect(ieInstance.validateUrl('JAVASCRIPT:alert(1)')).toBeNull();
            expect(ieInstance.validateUrl('JavaScript:void(0)')).toBeNull();
        });
    });

    describe('navigation', () => {
        it('should set iframe src to validated URL', () => {
            const proc = Kernel.launch('internet-explorer');
            proc.instance.navigate('https://example.com');

            const frame = document.getElementById('ie-frame');
            expect(frame.src).toContain('example.com');
        });

        it('should update address bar on navigation', () => {
            const proc = Kernel.launch('internet-explorer');
            proc.instance.navigate('example.com');

            const input = document.getElementById('ie-address-input');
            expect(input.value).toBe('https://example.com');
        });

        it('should block dangerous URLs in navigate()', () => {
            const proc = Kernel.launch('internet-explorer');
            const frame = document.getElementById('ie-frame');
            const originalSrc = frame.src;

            proc.instance.navigate('javascript:alert(document.cookie)');
            // Frame src should not have changed
            expect(frame.src).toBe(originalSrc);
        });

        it('should show status message on blocked navigation', () => {
            const proc = Kernel.launch('internet-explorer');
            proc.instance.navigate('javascript:void(0)');

            const status = document.getElementById('ie-status');
            expect(status.textContent).toContain('Blocked');
        });
    });
});
