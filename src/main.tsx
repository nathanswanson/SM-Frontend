import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { mockingEnabled } from './utils/mode'
if (!import.meta.env.VITE_SM_MODE) {
    console.warn('VITE_SM_MODE is not set, defaulting to production')
}

async function preLoad() {
    if (mockingEnabled()) await enableMocking()

    return
}

async function enableMocking() {
    const { worker } = await import('./mocks/browser')
    const { LocalDB } = await import('./mocks/local-db')
    LocalDB.getInstance()
    return worker.start()
}

preLoad().then(() => {
    createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
})
