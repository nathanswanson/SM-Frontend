import { createContext, useContext } from 'react'
import { ReactNode } from 'react'
import { Login } from '../components/login'
import { useCookies } from 'react-cookie'

interface ILoginProviderContext {
    cookie: any
    setCookie: any
}

const loginProviderContext = createContext<ILoginProviderContext | undefined>(
    undefined
)

export const useLoginProvider = () => {
    const context = useContext(loginProviderContext)
    if (!context) {
        throw new Error('useLoginProvider must be used within a LoginProvider')
    }
    return context
}

export const LoginProvider = ({ children }: { children: ReactNode }) => {
    const [cookie, setCookie] = useCookies(['token'])

    function handleCookie(token: string) {
        setCookie('token', token, { maxAge: 3600 })
    }

    return (
        <loginProviderContext.Provider value={{ cookie, setCookie }}>
            {cookie.token ? (
                children
            ) : (
                <Login
                    onLoginSuccess={token => {
                        handleCookie(token)
                    }}
                />
            )}
        </loginProviderContext.Provider>
    )
}
