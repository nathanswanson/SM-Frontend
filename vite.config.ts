/// <reference types="vitest/config" />
/// <reference types="vitest" />
/// <reference types="@vitest/browser/providers/playwright" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    plugins: [
        visualizer({
            open: false
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler']
            }
        })
    ],
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({
                        configDir: path.join(dirname, '.storybook')
                    })
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: 'playwright',
                        instances: [
                            {
                                browser: 'chromium'
                            }
                        ]
                    },
                    setupFiles: ['.storybook/vitest.setup.ts']
                }
            }
        ]
    },
    build: {
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/[name]-[hash].js',
                manualChunks: manualChunks
            }
        }
    }
})
function manualChunks(id) {
    if (id.includes('node_modules')) {
        if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react'
        }
        if (id.includes('@zag-js')) {
            return 'vendor-zag-js'
        }
        if (id.includes('@emotion')) {
            return 'vendor-emotion'
        }
        if (id.includes('@shikijs')) {
            return 'vendor-shikijs'
        }
        return 'vendor'
    }
    return null
}
