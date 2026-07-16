import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./test/setup.ts'],
        exclude: ['**/node_modules/**', 'test/e2e/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'html'],
            thresholds: {
                statements: 68,
                branches: 55,
                functions: 67,
                lines: 71
            }
        }
    },
});
