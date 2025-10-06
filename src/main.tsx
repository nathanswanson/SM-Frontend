import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SelectedServerProvider } from './providers/selected-server-context'
import { system } from './theme'
import { WebSocketProvider } from './providers/web-socket'
import { ColorModeProvider, DarkMode, LightMode } from './lib/chakra/color-mode'
import { WindowProvider } from './providers/window-context'
import { UserDataProvider } from './providers/user-data'

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
                    <ColorModeProvider>
                        <SelectedServerProvider>
                            <WebSocketProvider>
                                <WindowProvider>
                                    <UserDataProvider>
                                        <App />
                                    </UserDataProvider>
                                </WindowProvider>
                            </WebSocketProvider>
                        </SelectedServerProvider>
                    </ColorModeProvider>
                </ThemeProvider>
            </ChakraProvider>
        </React.StrictMode>
    )
})
