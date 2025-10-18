import React from 'react'
import { UsersBase } from '../../lib/hey-api/client/types.gen'

interface IUserDataContext {
    userData: UsersBase | undefined
    setUserData: (data: UsersBase | undefined) => void
}

export const userDataContextProvider = React.createContext<IUserDataContext | undefined>(undefined)
export const useUserDataContext = () => {
    const context = React.useContext(userDataContextProvider)
    if (!context) {
        throw new Error('useUserDataContext must be used within a UserDataProvider')
    }
    return context
}

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = React.useState<UsersBase | undefined>(undefined)

    return (
        <userDataContextProvider.Provider value={{ userData, setUserData }}>
            {children}
        </userDataContextProvider.Provider>
    )
}
