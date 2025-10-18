import { createContext, useEffect, useState } from 'react'
import { useContext } from 'react'
import { ReactNode } from 'react'
import { getServerInfo, getServerStatus, ServersBase, ServersRead } from '../../lib/hey-api/client'
import { useEffectOnce } from 'react-use'

interface ISelectedServerContext {
    selectedServer: string | undefined
    serverInfo: ServersRead | undefined
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
    const [serverInfo, setServerInfo] = useState<ServersRead | undefined>(undefined)
    useEffectOnce(() => {
        const saved = localStorage.getItem('selectedServer')
        if (saved) {
            setSelectedServer(saved)
        }
    })

    // change serverInfo to match selectedServer
    useEffect(() => {
        if (selectedServer == undefined || selectedServer == '') {
            setServerInfo(undefined)
        } else {
            const abortController = new AbortController()
            getServerInfo({
                credentials: 'include',
                path: { server_id: 1 },
                signal: abortController.signal
            }).then(res => {
                setServerInfo(res.data ?? undefined)
            })
            return () => {
                abortController.abort()
            }
        }
    }, [selectedServer])

    useEffect(() => {
        if (selectedServer == undefined || selectedServer == '' || serverInfo == undefined) {
            setServerOnline(undefined)
            localStorage.removeItem('selectedServer')
            return
        }

        const abortController = new AbortController()

        getServerStatus({
            credentials: 'include',
            path: { server_id: serverInfo.id ?? -1 },
            signal: abortController.signal
        }).then(res => {
            setServerOnline(res.data?.running)
            localStorage.setItem('selectedServer', selectedServer)
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
