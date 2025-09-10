import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SelectedServerProvider } from './selected-server-context'
import { system } from './theme'

const DISABLE_MOCK = true

async function enableMocking() {
    if (process.env.NODE_ENV !== 'development' || DISABLE_MOCK) {
        return
    }

    const { worker } = await import('./mocks/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}
enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <ChakraProvider value={system}>
                <SelectedServerProvider>
                    <ThemeProvider attribute="class" disableTransitionOnChange>
                        <App />
                    </ThemeProvider>
                </SelectedServerProvider>
            </ChakraProvider>
        </React.StrictMode>
    )
})
