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
                statements: 71,
                branches: 57,
                functions: 70,
                lines: 75
            }
        }
    },
});
