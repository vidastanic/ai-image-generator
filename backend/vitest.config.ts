import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node", // Use "jsdom" for frontend testing
        coverage: {
            provider: "v8", // Built-in coverage support
            reporter: ["text", "json", "html"], // Generates different coverage reports
        },
        globalSetup: './tests/integration/setup-test-db.ts',
    },
});
