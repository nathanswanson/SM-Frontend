import bytes from 'bytes'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { getLogMessage } from '../../lib/hey-api/client'
import { getBaseUrl } from '../utils/urlIntercept'
import { useSelectedServerContext } from './selected-server-context'
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

export interface UnitValue {
    value: number
    unit: string
    timestamp: number
}

interface IWebSocketContext {
    logMessages: string[]
    metricMessages: UnitValue[][]
    connectionStatus: ConnectionState
    sendMessage: (command: WSPacketCmdType, data: string) => void
}

function metricFilters(core_count: number, data: number[]): UnitValue[] {
    // cpu, mem, net_in, net_out, disk_read, disk_write

    const bytesConvert = (core_count: number, ...index: number[]): UnitValue => {
        //sum of all data[index]
        const total = index.reduce((acc, curr) => acc + (data[curr] || 0), 0)
        if (total === 0) return { value: 0, unit: '', timestamp: Date.now() }

        const [value, unit] = bytes.format(total, { unitSeparator: ' ' })?.split(' ') || ['0', '']
        return { value: parseFloat(value), unit: unit, timestamp: Date.now() }
    }
    const values: UnitValue[] = [
        { value: parseFloat((data[0] / core_count).toFixed(2)), unit: '% 1-core', timestamp: Date.now() },
        { value: parseFloat((data[1] * 100).toFixed(2)), unit: '%', timestamp: Date.now() },
        bytesConvert(2, 3),
        bytesConvert(4, 5)
    ]

    return values
}

const webSocketContext = createContext<IWebSocketContext | undefined>(undefined)

export const useWebSocketProvider = () => {
    const context = useContext(webSocketContext)
    if (!context) {
        throw new Error('useWebSocketProvider must be used within a WebSocketProvider')
    }
    return context
}

const socket = io(getBaseUrl(), { autoConnect: false, transports: ['websocket'] })
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { selectedServer, serverInfo } = useSelectedServerContext()
    const [connectionStatus, setConnectionStatus] = useState<ConnectionState>(ConnectionState.disconnected)
    const [logMessages, setLogMessages] = useState<string[]>([])
    const [metricMessages, setMetricMessages] = useState<UnitValue[][]>([[], [], [], []])

    useEffect(() => {
        socket.connect()
        const onConnect = () => setConnectionStatus(ConnectionState.connected)
        const onDisconnect = () => setConnectionStatus(ConnectionState.disconnected)

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)

        // To prevent the "closed before established" warning in React's StrictMode,
        // we avoid disconnecting in the cleanup. The socket connection will persist
        // for the lifetime of the application.
        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
        }
    }, [])

    useEffect(() => {
        // This effect handles message listeners.
        // It depends on `serverInfo` to avoid a stale closure in the `onMetric` handler.
        const onLog = (msg: string) => {
            setLogMessages(prev => [...prev, msg].slice(-LOG_SIZE))
        }

        const onMetric = (data: string) => {
            setMetricMessages(prev => {
                // prev is string of "[n,n,n,n]"
                let parsedData = JSON.parse(data) as number[]
                let parsedDataUnits = metricFilters(serverInfo?.cpu ?? 1, parsedData)
                const newMetrics = prev.map((arr, idx) => [...arr, parsedDataUnits[idx]].slice(-METRICS_SIZE))
                return newMetrics
            })
        }

        socket.on(WSPacketCmdType.LOGS, onLog)
        socket.on(WSPacketCmdType.METRICS, onMetric)

        return () => {
            socket.off(WSPacketCmdType.LOGS, onLog)
            socket.off(WSPacketCmdType.METRICS, onMetric)
        }
    }, [serverInfo])

    useEffect(() => {
        if (serverInfo) {
            getLogMessage({ path: { server_id: serverInfo?.id ?? -1 }, credentials: 'include' }).then(res => {
                setLogMessages(res.data?.items || [])
            })
            sendMessage(WSPacketCmdType.SUBSCRIBE, `01+${serverInfo.container_name}`)
        }

        return () => {
            if (serverInfo) {
                sendMessage(WSPacketCmdType.UNSUBCRIBE, `01+${serverInfo.container_name}`)
            }
        }
    }, [selectedServer, serverInfo])

    const sendMessage = useCallback((command: WSPacketCmdType, data: string) => {
        socket.emit(command, data)
    }, [])

    return (
        <webSocketContext.Provider
            value={{
                logMessages,
                metricMessages,
                connectionStatus,
                sendMessage
            }}
        >
            {children}
        </webSocketContext.Provider>
    )
}
