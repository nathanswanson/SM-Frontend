import { createContext, ReactNode, useContext, useState } from 'react'
import { getServerInfo, getServerStatus, ServersRead } from '../../lib/hey-api/client'

interface ISelectedServerContext {
    serverInfo: ServersRead | undefined
    serverOnline: boolean | undefined
    setServerOnline: (online: boolean) => void
    setSelectedServer: (id: number | undefined) => void
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
    const [serverOnline, setServerOnline] = useState<boolean | undefined>(undefined)
    const [serverInfo, setServerInfo] = useState<ServersRead | undefined>(undefined)

    // Function to set selected server by ID
    const setSelectedServer = async (id: number | undefined) => {
        if (id === undefined) {
            setServerInfo(undefined)
            setServerOnline(undefined)
            return
        }
        // Fetch server info
        getServerInfo({ path: { server_id: id } }).then(res => {
            setServerInfo(res.data)
            // check server online
            getServerStatus({ path: { server_id: id } }).then(statusRes => {
                if (statusRes.data) {
                    setServerOnline(statusRes.data.running ?? false)
                }
            })
        })
    }

    return (
        <SelectedServerContext.Provider value={{ serverInfo, setSelectedServer, serverOnline, setServerOnline }}>
            {children}
        </SelectedServerContext.Provider>
    )
}
