/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({open: true})],
  test: {
    projects: [
      {
        test: {
          name: 'default',
          include: ['src/test/*.test.ts'],
          setupFiles: ['./vitest.setup.ts']
        }
      }
    ]
  }
})
