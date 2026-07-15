import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./test/setup.js'],
        exclude: ['**/node_modules/**', 'test/e2e/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'html'],
            thresholds: {
                statements: 55,
                branches: 40,
                functions: 55,
                lines: 55
            }
        }
    },
});
