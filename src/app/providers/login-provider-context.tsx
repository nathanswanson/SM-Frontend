import { createContext, useContext, useState } from 'react'
import { ReactNode } from 'react'
import { Login } from '../components/login'

interface ILoginProviderContext {
    loggedIn: any
    setLoggedIn: any
}

const loginProviderContext = createContext<ILoginProviderContext | undefined>(undefined)

export const useLoginProvider = () => {
    const context = useContext(loginProviderContext)
    if (!context) {
        throw new Error('useLoginProvider must be used within a LoginProvider')
    }
    return context
}

export const LoginProvider = ({ children }: { children: ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState<boolean>()

    function loggedInCB(loggedIn: boolean) {
        setLoggedIn(loggedIn)
    }

    return (
        <loginProviderContext.Provider value={{ loggedIn, setLoggedIn }}>
            {loggedIn ? children : Login(loggedInCB)}
        </loginProviderContext.Provider>
    )
}
