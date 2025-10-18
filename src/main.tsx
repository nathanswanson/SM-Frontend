import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { SelectedServerProvider } from './providers/selected-server-context'
import { system } from './theme'
import { WebSocketProvider } from './providers/web-socket'
import { ColorModeProvider, DarkMode, LightMode } from '../lib/chakra/color-mode'
import { WindowProvider } from './providers/window-context'
import { UserDataProvider } from './providers/user-data'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
if (!import.meta.env.VITE_SM_MODE) {
    console.warn('VITE_SM_MODE is not set, defaulting to production')
}

export const SMMode = {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development',
    TESTING: 'testing',
    DEMO: 'demo'
}

export const smMode = import.meta.env.VITE_SM_MODE || SMMode.PRODUCTION
export function mockingEnabled() {
    return smMode === SMMode.TESTING || smMode === SMMode.DEMO
}

async function preLoad() {
    async function loadClient() {
        const { client } = await import('./api')
        console.log('hey-api client baseUrl:', client.getConfig().baseUrl)
    }
    if (smMode == SMMode.DEMO || smMode == SMMode.DEVELOPMENT) await enableMocking()
    await loadClient()
    return
}

async function enableMocking() {
    console.log('Mocking enabled')
    const { worker } = await import('./mocks/browser')
    const { LocalDB } = await import('./mocks/local-db')
    LocalDB.getInstance()
    return worker.start()
}

preLoad().then(() => {
    createRoot(document.getElementById('root')!).render(
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
