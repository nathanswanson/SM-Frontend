import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSelectedServerContext } from './selected-server-context'
import { getLogMessageApiContainerContainerNameLogsGet } from '../../lib/hey-api/client'
import { getBaseUrl } from '../../utils/urlIntercept'

const METRICS_SIZE = 50
const LOG_SIZE = 50

enum ConnectionState {
    connected,
    disconnected
}

enum WSPacketCmdType {
    SUBSCRIBE = 'subscribe',
    UNSUBCRIBE = 'unsubscribe',
    LOGS = 'push_log',
    METRICS = 'push_metric'
}

interface IWebSocketContext {
    logMessages: string[]
    metricMessages: number[][]
    connectionStatus: ConnectionState
    sendMessage: (command: WSPacketCmdType, data: string) => void
}

const webSocketContext = createContext<IWebSocketContext | undefined>(undefined)

export const useWebSocketProvider = () => {
    const context = useContext(webSocketContext)
    if (!context) {
        throw new Error('useWebSocketProvider must be used within a WebSocketProvider')
    }
    return context
}

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const socketRef = useRef<any>(null)
    const [connectionStatus, setConnectionStatus] = useState<ConnectionState>(ConnectionState.disconnected)
    const [logMessages, setLogMessages] = useState<string[]>([])
    const [metricMessages, setMetricMessages] = useState<number[][]>([[0, 0, 0, 0, 0, 0]])
    const { selectedServer } = useSelectedServerContext()

    useEffect(() => {
        if (!selectedServer) {
            // Clear state and disconnect socket if selectedServer is empty
            setLogMessages([])
            setMetricMessages([[]])
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
            return
        }

        // Dynamically import socket.io-client and initialize the socket
        let isMounted = true
        import('socket.io-client').then(({ io }) => {
            if (!isMounted) return

            const socket = io(getBaseUrl(), {
                autoConnect: true
            })
            socketRef.current = socket

            socket.on('connect', () => {
                setConnectionStatus(ConnectionState.connected)
            })

            socket.on('disconnect', () => {
                setConnectionStatus(ConnectionState.disconnected)
            })

            socket.on(WSPacketCmdType.LOGS, msg => {
                setLogMessages(prev => prev.concat(msg).slice(-LOG_SIZE))
            })

            socket.on(WSPacketCmdType.METRICS, msg => {
                setMetricMessages(prev => {
                    let parsed: number[] = []
                    if (Array.isArray(msg)) {
                        parsed = msg.map((v: any) => Number(v))
                    } else if (typeof msg === 'string') {
                        try {
                            const maybe = JSON.parse(msg)
                            if (Array.isArray(maybe)) {
                                parsed = maybe.map((v: any) => Number(v))
                            } else {
                                // not an array after parsing, attempt comma-separated fallback
                                parsed = msg.split(',').map(s => Number(s.trim()))
                            }
                        } catch {
                            // fallback for plain comma-separated string
                            parsed = msg.split(',').map(s => Number(s.trim()))
                        }
                    }
                    return [...prev, parsed].slice(-METRICS_SIZE)
                })
            })
        })

        return () => {
            isMounted = false
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [selectedServer])

    const sendMessage = useCallback((command: WSPacketCmdType, msg: string) => {
        if (socketRef.current && command === WSPacketCmdType.SUBSCRIBE) {
            socketRef.current.emit(command, msg)
        }
    }, [])

    return (
        <webSocketContext.Provider
            value={{
                connectionStatus,
                sendMessage,
                logMessages,
                metricMessages
            }}
        >
            {children}
        </webSocketContext.Provider>
    )
}
