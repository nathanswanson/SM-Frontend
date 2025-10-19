import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { getServerInfo, getServerStatus, ServersRead } from '../../lib/hey-api/client'

interface ISelectedServerContext {
    selectedServer: number | undefined
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
    const [selectedServer, setSelectedServer] = useState<number | undefined>(undefined)
    const [serverOnline, setServerOnline] = useState<boolean | undefined>(undefined)
    const [serverInfo, setServerInfo] = useState<ServersRead | undefined>(undefined)
    useEffectOnce(() => {
        const saved = localStorage.getItem('selectedServer')
        if (saved) {
            setSelectedServer(Number(saved))
        }
    })

    // change serverInfo to match selectedServer
    useEffect(() => {
        if (selectedServer == undefined) {
            setServerInfo(undefined)
        } else {
            const abortController = new AbortController()
            getServerInfo({
                credentials: 'include',
                path: { server_id: selectedServer },
                signal: abortController.signal
            })
                .then(res => {
                    setServerInfo(res.data ?? undefined)
                })
                .catch(error => {
                    console.error('Failed to fetch server info:', error)
                    setServerInfo(undefined)
                })
            return () => {
                abortController.abort()
            }
        }
    }, [selectedServer])

    useEffect(() => {
        if (selectedServer == undefined || serverInfo == undefined) {
            setServerOnline(undefined)
            // localStorage.removeItem('selectedServer')
            return
        }

        const abortController = new AbortController()

        getServerStatus({
            credentials: 'include',
            path: { server_id: serverInfo.id ?? -1 },
            signal: abortController.signal
        })
            .then(res => {
                setServerOnline(res.data?.running)
                // localStorage.setItem('selectedServer', selectedServer.toString())
            })
            .catch(error => {
                console.error('Failed to fetch server status:', error)
                setServerOnline(false)
            })

        return () => {
            abortController.abort()
        }
    }, [serverInfo])

    return (
        <SelectedServerContext.Provider
            value={{ selectedServer, serverInfo, setSelectedServer, serverOnline, setServerOnline }}
        >
            {children}
        </SelectedServerContext.Provider>
    )
}
