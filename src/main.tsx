import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SelectedServerProvider } from './app/providers/selected-server-context'
import { system } from './theme'
import { WebSocketProvider } from './app/providers/web-socket'
import { ColorModeProvider, DarkMode } from './lib/chakra/color-mode'

const DISABLE_MOCK = true
async function preLoad() {
    await enableMocking()
    return
}

async function enableMocking() {
    if (process.env.NODE_ENV !== 'development' || DISABLE_MOCK) {
        return
    }

    const { worker } = await import('./mocks/browser')
    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}

preLoad().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <ChakraProvider value={system}>
                <ThemeProvider attribute="class">
                    {/* <ColorModeProvider> */}
                    <SelectedServerProvider>
                        <WebSocketProvider>
                            <App />
                        </WebSocketProvider>
                    </SelectedServerProvider>
                    {/* </ColorModeProvider> */}
                </ThemeProvider>
            </ChakraProvider>
        </React.StrictMode>
    )
})
