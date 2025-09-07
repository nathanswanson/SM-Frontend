import { Box, Card, Grid, GridItem } from '@chakra-ui/react'
import { FileManager } from './cards/file-explorer'
import { ManageServer } from './cards/server-overview'
import { LogManager } from './cards/log-viewer'
import { ChartDisplay } from './cards/chart-display'
import { useEffect, useState } from 'react'
import { useSelectedServerContext } from '../../selected-server-context'
import { MeterDisplay } from './cards/meter-display'
import { hostname } from 'os'

const graph_size = 25

export const MainContent = () => {
    const { selectedServer } = useSelectedServerContext()
    const [metrics, setMetrics] = useState<number[][]>([[0, 0, 0, 0, 0]])
    useEffect(() => {
        if (!selectedServer) return

        const metricsMessage = new EventSource(
            `http://raspberrypi.home:8000/api/container/${selectedServer}/metrics`
        )
        metricsMessage.onmessage = event => {
            setMetrics(prev => {
                const newData = JSON.parse(event.data)
                if (!Array.isArray(newData)) return prev
                const next = [...prev, newData].slice(-graph_size)
                return next
            })
        }

        return () => {
            metricsMessage.close()
        }
    }, [selectedServer])

    return (
        <Grid
            p="8"
            templateColumns="0.5fr 1fr 1fr"
            templateRows={'1fr 1fr'}
            gap={'10'}
            w="100%"
            h="100%"
        >
            <GridItem colSpan={1} rowSpan={2} h="100%">
                <Card.Root h="100%">
                    <Card.Body h="100%">
                        <FileManager />
                    </Card.Body>
                </Card.Root>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
                <Card.Root h="100%">
                    <Card.Title p="4">Logs</Card.Title>
                    <Card.Body h="100%">
                        <LogManager />
                    </Card.Body>
                </Card.Root>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
                <Card.Root h="100%">
                    <Card.Title p="4">Manage Server</Card.Title>
                    <Card.Body h="100%">
                        <ManageServer />
                    </Card.Body>
                </Card.Root>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
                <Card.Root h="100%">
                    <Card.Body h="100%">
                        <ChartDisplay
                            metricState={metrics}
                            graph_size={graph_size}
                        />
                    </Card.Body>
                </Card.Root>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
                <Card.Root h="100%">
                    <Card.Body h="100%">
                        <MeterDisplay
                            metricState={metrics}
                            graph_size={graph_size}
                        />
                    </Card.Body>
                </Card.Root>
            </GridItem>
        </Grid>
    )
}
