import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  globalCss: {
    ".chakra-card__root": {
      "p": "0"
    },
    ".chakra-card__title": {
      "p": "24px 0 0 24px"
    }
  },
  theme: {
    breakpoints: {
      sm: '320px',
      md: '768px',
      lg: '960px',
      xl: '1200px'
    },
    tokens: {
      colors: {
        primary: {}
      }
    },
    semanticTokens: {
      colors: {
        danger: { value: '{colors.red}' }
      }
    },
    keyframes: {
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      }
    }
  }
})
export const system = createSystem(defaultConfig, config)
