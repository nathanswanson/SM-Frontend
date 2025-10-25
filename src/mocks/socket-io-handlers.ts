import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw/core/ws'
enum WSPacketCmdType {
    SUBSCRIBE = 'subscribe',
    UNSUBCRIBE = 'unsubscribe',
    LOGS = 'push_log',
    METRICS = 'push_metric'
}

const activeSubscriptions = new Set<string>()
const activeIntervals = new Map<string, NodeJS.Timeout>()

const ip_ws = 'ws://api.localhost/socket.io/'
const socketLink = ws.link(ip_ws)

function generateMetricData() {
    return [
        Math.random() * 100, // CPU usage (percentage)
        Math.random() * 0.7 + 0.1, // Memory usage (0.1-0.8)
        Math.random() * 10000000, // Network in (bytes)
        Math.random() * 5000000, // Network out (bytes)
        Math.random() * 1000000, // Disk read (bytes)
        Math.random() * 500000 // Disk write (bytes)
    ]
}

export const socketIOHandlers = [
    socketLink.addEventListener('connection', connection => {
        const io = toSocketIo(connection)
        io.server.on('message', (event, ...data) => {
            console.log('Received WebSocket message:', event, data)
            // const command = data[0]?.command
            // const serverId = data[0]?.data
            // if (command === WSPacketCmdType.SUBSCRIBE) {
            //     if (!activeSubscriptions.has(serverId)) {
            //         activeSubscriptions.add(serverId)
            //         // Start sending metrics every second
            //         const interval = setInterval(() => {
            //             const metricData = generateMetricData()
            //             io.server.emit('message', {
            //                 command: WSPacketCmdType.METRICS,
            //                 data: metricData
            //             })
            //         }, 1000)
            //         activeIntervals.set(serverId, interval)
            //     }
            // } else if (command === WSPacketCmdType.UNSUBCRIBE) {
            //     if (activeSubscriptions.has(serverId)) {
            //         activeSubscriptions.delete(serverId)
            //         const interval = activeIntervals.get(serverId)
            //         if (interval) {
            //             clearInterval(interval)
            //             activeIntervals.delete(serverId)
            //         }
            //     }
            // }
        })
    })
]
