import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSelectedServerContext } from './selected-server-context'
import { io } from 'socket.io-client'
import { getBaseUrl } from '../utils/urlIntercept'
import bytes from 'bytes'
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

function metricFilters(data: number[]): UnitValue[] {
    // cpu, mem, net_in, net_out, disk_read, disk_write

    const bytesConvert = (...index: number[]): UnitValue => {
        //sum of all data[index]
        const total = index.reduce((acc, curr) => acc + (data[curr] || 0), 0)
        if (total === 0) return { value: 0, unit: '', timestamp: Date.now() }

        const [value, unit] = bytes.format(total, { unitSeparator: ' ' })?.split(' ') || ['0', '']
        return { value: parseFloat(value), unit: unit, timestamp: Date.now() }
    }
    const values: UnitValue[] = [
        { value: parseFloat((data[0] * 100).toFixed(2)), unit: '% 1-core', timestamp: Date.now() },
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
    const { selectedServer } = useSelectedServerContext()
    const [connectionStatus, setConnectionStatus] = useState<ConnectionState>(ConnectionState.disconnected)
    const [logMessages, setLogMessages] = useState<string[]>([])
    const [metricMessages, setMetricMessages] = useState<UnitValue[][]>([[], [], [], []])

    useEffect(() => {
        socket.connect()
        socket.on('connect', () => {
            setConnectionStatus(ConnectionState.connected)
        })

        socket.on('disconnect', () => {
            setConnectionStatus(ConnectionState.disconnected)
        })

        socket.on(WSPacketCmdType.LOGS, (msg: string) => {
            setLogMessages(prev => [...prev, msg].slice(-LOG_SIZE))
        })

        socket.on(WSPacketCmdType.METRICS, (data: string) => {
            setMetricMessages(prev => {
                // prev is string of "[n,n,n,n]"
                let parsedData = JSON.parse(data) as number[]
                let parsedDataUnits = metricFilters(parsedData)
                const newMetrics = prev.map((arr, idx) => [...arr, parsedDataUnits[idx]].slice(-METRICS_SIZE))
                return newMetrics
            })
        })

        return () => {
            socket.disconnect()
            socket.off('connect')
            socket.off('disconnect')
            socket.off(WSPacketCmdType.LOGS)
            socket.off(WSPacketCmdType.METRICS)
        }
    }, [])

    useEffect(() => {
        if (selectedServer) {
            sendMessage(WSPacketCmdType.SUBSCRIBE, `01+${selectedServer}`)
        }
        return () => {
            if (selectedServer) {
                sendMessage(WSPacketCmdType.UNSUBCRIBE, `01+${selectedServer}`)
            }
        }
    }, [selectedServer])

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
