import { createSystem, defaultConfig, defineConfig, defineSemanticTokens, defineTokens, Heading } from '@chakra-ui/react'
import { buttonRecipe } from './recipes/button'

const tokens = defineTokens({
  fonts: {
    heading: { value: 'Roboto, Arial' },
    body: { value: 'Roboto, Arial' },
  },
   colors: {
    brand: {
      50: { value: '#E8EAFC' },
      100: { value: '#C2C9F3' },
      200: { value: '#9BA9EA' },
      300: { value: '#7488E2' },
      400: { value: '#6D7FE6' },
      500: { value: '#6772E5' }, // The core brand blue
      600: { value: '#545DBA' },
      700: { value: '#41488F' },
      800: { value: '#2E3464' },
      900: { value: '#1C203A' },
    },
    // Grays and text colors
    gray: {
      50: { value: '#F6F9FC' },  // Page background
      100: { value: '#EBF1F6' }, // Borders and dividers
      200: { value: '#DDE4ED' },
      300: { value: '#C5D0E0' },
      400: { value: '#ADBACD' },
      500: { value: '#4F566B' }, // Secondary text
      600: { value: '#6B7A90' },
      700: { value: '#424D68' },
      800: { value: '#292F45' }, // Primary text
      900: { value: '#1E1E34' },
    },
    success: {
        50: { value: '#E3F9E5' },
        500: { value: '#29A35B' },
    },
    warning: {
        50: { value: '#FEF3E1' },
        500: { value: '#F49402' },
    },
    danger: {
        50: { value: '#FFE3E3' },
        500: { value: '#FF4C4C' },
    }
  }
})

const semanticTokens = {
 }

const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    recipes: {
      button: buttonRecipe,
    },
  },
  globalCss: {
    body: {
      _dark: { bg: 'gray.900' },
      base: {bg: 'gray.200' },
      color: 'text.primary',
    },
    a: {
      color: 'brand.primary',
      _hover: {
        textDecoration: 'underline',
      },
    },
  }
})

export const system = createSystem(defaultConfig, config)
