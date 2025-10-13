/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    visualizer({open: false}),
    react({babel: {plugins: ['babel-plugin-react-compiler']}}),
  ],
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
  },

  // build: {
  //   rollupOptions: {
  //     output: {
  //       chunkFileNames: 'assets/[name]-[hash].js',
  //       manualChunks: 
  //         manualChunks
        
  //     },
  //   }
  // },
})

// function manualChunks(id) {
// 	if (id.includes('node_modules')) {
//     if (id.includes('react') || id.includes('react-dom')) {
//         return 'vendor-react'
//     }

//     if (id.includes('@zag-js')) {
//       return 'vendor-zag-js'
//     }
//     if (id.includes('@emotion')) {
//       return 'vendor-emotion'
//     }

//     if (id.includes('@shikijs')) {
//       return 'vendor-shikijs'
//     }

//     return 'vendor'
//   }
// 	return null;
// }