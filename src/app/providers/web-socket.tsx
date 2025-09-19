import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { io, Socket } from 'socket.io-client'
import { useSelectedServerContext } from './selected-server-context'
import { getLogMessageApiContainerContainerNameLogsGet } from '../../lib/hey-api/client'
import { useLoginProvider } from './login-provider-context'
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
        throw new Error(
            'useWebSocketProvider must be used within a WebSocketProvider'
        )
    }
    return context
}

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { cookie } = useLoginProvider()

    const socketRef = useRef<Socket | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<ConnectionState>(
        ConnectionState.disconnected
    )
    const [logMessages, setLogMessages] = useState<string[]>([])
    const [metricMessages, setMetricMessages] = useState<number[][]>([
        [0, 0, 0, 0, 0, 0]
    ])
    useEffect(() => {
        const socket = io(`wss://${import.meta.env.VITE_BACKEND_HOST}:80`, {
            autoConnect: true
        })
        socketRef.current = socket

        socket.on('connect', () => {
            console.debug(`in: connect`)
            setConnectionStatus(ConnectionState.connected)
        })

        socket.on('disconnect', () => {
            console.debug(`in: disconnect`)
            setConnectionStatus(ConnectionState.disconnected)
        })

        socket.on(WSPacketCmdType.LOGS, msg => {
            console.debug(`in: log: ${msg}`)
            setLogMessages(prev => prev.concat(msg).slice(-LOG_SIZE))
        })
        socket.on(WSPacketCmdType.METRICS, msg => {
            console.debug(`in: metrics: ${msg}`)
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
    }, [])

    const { selectedServer } = useSelectedServerContext()

    useEffect(() => {
        console.debug(`out: updating container: ${selectedServer}`)
        if (!selectedServer) {
            console.debug(`purge active logs and metrics`)

            setLogMessages([])
            setMetricMessages([[]])
            sendMessage(WSPacketCmdType.UNSUBCRIBE, `01+${selectedServer}`)
        } else {
            getLogMessageApiContainerContainerNameLogsGet({
                auth: cookie['token'],
                path: { container_name: selectedServer },
                query: { line_count: 50 }
            }).then(logs => {
                if (logs?.data) {
                    setLogMessages(logs.data)
                    sendMessage(
                        WSPacketCmdType.SUBSCRIBE,
                        `01+${selectedServer}`
                    )
                }
            })
        }
    }, [selectedServer])

    const sendMessage = useCallback((command: WSPacketCmdType, msg: string) => {
        if (command == WSPacketCmdType.SUBSCRIBE) {
            console.debug(`out: sending ${command}: ${msg}`)
            socketRef.current?.emit(command, msg)
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
