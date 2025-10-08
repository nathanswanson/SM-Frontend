import { createContext, useEffect, useState } from 'react'
import { useContext } from 'react'
import { ReactNode } from 'react'
import { getContainerStatusApiContainerContainerNameStatusGet } from '../lib/hey-api/client'
import { useEffectOnce } from 'react-use'

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

    useEffectOnce(() => {
        const saved = localStorage.getItem('selectedServer')
        if (saved) {
            setSelectedServer(saved)
        }
    })

    useEffect(() => {
        if (selectedServer == undefined || selectedServer == '') {
            setServerOnline(undefined)
            localStorage.removeItem('selectedServer')
            return
        }

        const abortController = new AbortController()

        getContainerStatusApiContainerContainerNameStatusGet({
            credentials: 'include',
            path: { container_name: selectedServer },
            signal: abortController.signal
        }).then(res => {
            setServerOnline(res.data?.running)
            localStorage.setItem('selectedServer', selectedServer)
        })

        return () => {
            abortController.abort()
        }
    }, [selectedServer])

    return (
        <SelectedServerContext.Provider value={{ selectedServer, setSelectedServer, serverOnline, setServerOnline }}>
            {children}
        </SelectedServerContext.Provider>
    )
}
