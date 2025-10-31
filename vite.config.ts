import { defineConfig } from 'vitest/config';
import { builtinModules } from 'node:module';
import { fileURLToPath } from 'node:url';

// Vite config to bundle the library (ESM only)
export default defineConfig({
    resolve: {
        alias: {
            '@orkestrel/validator': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        },
    },
    build: {
        sourcemap: true,
        emptyOutDir: false,
        outDir: fileURLToPath(new URL('./dist', import.meta.url)),
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            formats: ['es'],
            fileName: () => 'index.js',
        },
        rollupOptions: {
            external: [
                ...builtinModules,
                /^node:.*/,
            ],
        },
    },
    test: {
        globals: true,
        // setupFiles: ['./tests/setup.ts'],
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        exclude: ['node_modules', 'dist'],
        testTimeout: 10000,
        hookTimeout: 10000,
    }
});
