import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        // Global ignores
        ignores: [
            "node_modules/**",
            "dist/**",
            "public/libs/**",
            "public/games/**",
            "public/css/**",
            "*.min.js"
        ]
    },
    {
        // Main source files
        files: ["js/**/*.{js,ts}", "main.ts", "ragdoll.ts"],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                // Project globals (legacy — to be removed)
                CONFIG: "readonly",
                Utils: "readonly",
                Kernel: "readonly",
                WindowManager: "readonly",
                AudioManager: "readonly",
                DesktopManager: "readonly",
                ShaderWallpaper: "readonly",
                TouchManager: "readonly",
                TaskbarManager: "readonly",
                HDRManager: "readonly",
                EventBus: "readonly",
                Store: "readonly",
                VFS: "readonly",
                BootLoader: "readonly",
                WindowFactory: "readonly",
                BubbleAnimator: "readonly",
                MessageLibrary: "readonly",
                RagdollMemory: "readonly",
                GlobalAIService: "readonly",
                WebampApp: "readonly",
                // OS engine globals (legacy — shrinking as migration completes)
                state: "readonly",
                familyData: "readonly",
                playBlip: "readonly",
                openWindow: "readonly",
                closeWindow: "readonly",
                openDialog: "readonly",
                closeDialog: "readonly",
                navigateIE: "readonly",
                handleShutdown: "readonly",
                initOS: "readonly",
                setupEventListeners: "readonly",
                initializeWindowControls: "readonly",
                initializeDraggableIcons: "readonly",
                // External libs
                Webamp: "readonly",
                Matter: "readonly"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin
        },
        rules: {
            // === Errors ===
            "no-undef": "off", // TypeScript compiler handles definition checking better
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],
            "no-duplicate-imports": "error",
            "no-self-assign": "error",
            "no-self-compare": "error",
            "no-template-curly-in-string": "warn",

            // === Security ===
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-new-func": "error",

            // === Best practices ===
            "eqeqeq": ["error", "always", { "null": "ignore" }],
            "no-var": "error",
            "prefer-const": ["warn", { "destructuring": "all" }],
            "no-throw-literal": "error",
            "no-useless-catch": "warn",
            "no-empty": ["warn", { "allowEmptyCatch": true }],

            // === Style (relaxed for existing codebase) ===
            "semi": ["warn", "always"],
            "no-trailing-spaces": "off",
            "no-multiple-empty-lines": "off",
            "indent": "off"
        }
    },
    {
        // Test files
        files: ["test/**/*.{js,ts}"],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                // Vitest globals
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                vi: "readonly",
                global: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off"
        }
    }
];
