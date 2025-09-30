import { createContext, useEffect, useState } from 'react'
import { useContext } from 'react'
import { ReactNode } from 'react'
import { getContainerStatusApiContainerContainerNameStatusGet } from '../lib/hey-api/client'

interface ISelectedServerContext {
    selectedServer: string | undefined
    serverOnline: boolean | undefined
    setServerOnline: (online: boolean) => void
    setSelectedServer: (id: string) => void
}

const SelectedServerContext = createContext<ISelectedServerContext | undefined>(undefined)

export const useSelectedServerContext = () => {
    const context = useContext(SelectedServerContext)
    if (!context) {
        throw new Error('useSelectedServerContext must be used within a SelectedServerProvider')
    }
    return context
}

export const SelectedServerProvider = ({ children }: { children: ReactNode }) => {
    const [selectedServer, setSelectedServer] = useState<string | undefined>(undefined)
    const [serverOnline, setServerOnline] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        if (selectedServer == undefined || selectedServer == '') {
            setServerOnline(undefined)
            return
        }
        getContainerStatusApiContainerContainerNameStatusGet({
            credentials: 'include',
            path: { container_name: selectedServer }
        }).then(res => {
            setServerOnline(res.data?.running)
        })
    }, [selectedServer])

    return (
        <SelectedServerContext.Provider value={{ selectedServer, setSelectedServer, serverOnline, setServerOnline }}>
            {children}
        </SelectedServerContext.Provider>
    )
}
