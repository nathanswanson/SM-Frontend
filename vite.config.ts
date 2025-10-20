/// <reference types="vitest" />
/// <reference types="@vitest/browser/providers/playwright" />
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        visualizer({ open: false }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler']
            }
        })
    ],
    test: {
        browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium', include: ['**/__test__/*.test.ts'] }]
        }
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
