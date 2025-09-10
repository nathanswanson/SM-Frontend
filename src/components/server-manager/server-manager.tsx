import { Box, Card, Grid, GridItem, SimpleGrid } from '@chakra-ui/react'
import { FileManager } from './cards/file-explorer'
import { NodeOverview } from './cards/node-overview'
import { LogManager } from './cards/log-viewer'
import { ChartDisplay } from './cards/chart-display'
import React, { useEffect, useState } from 'react'
import { useSelectedServerContext } from '../../selected-server-context'
import { MeterDisplay } from './cards/meter-display'
import { hostname } from 'os'
import { ServerOverview } from './cards/server-overview'

const graph_size = 25

export const MainContent = ({ ...props }) => {
    const { selectedServer } = useSelectedServerContext()
    const [metrics, setMetrics] = useState<number[][]>([[0, 0, 0, 0, 0]])
    useEffect(() => {
        if (!selectedServer) return

        const metricsMessage = new EventSource(
            `http://localhost:8000/api/container/${selectedServer}/metrics`
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
        <SimpleGrid
            flex="1"
            gap="4"
            width="100%"
            minChildWidth="320px"
            aspectRatio={1 / 1}
            alignContent="flex-start"
            columns={{ base: 1, md: 3 }}
        >
            <GridItemHelper rowSize={2}>
                <Card.Title>Files</Card.Title>
                <Card.Body h="100%">
                    <FileManager height="100%" />
                </Card.Body>
            </GridItemHelper>

            <GridItemHelper colSize={1}>
                <Card.Title>Manage Server</Card.Title>
                <Card.Body>
                    <ServerOverview />
                </Card.Body>
            </GridItemHelper>
            <GridItemHelper colSize={2}>
                <Card.Title>Manage Node</Card.Title>
                <Card.Body>
                    <NodeOverview />
                </Card.Body>
            </GridItemHelper>
            <GridItemHelper colSize={2}>
                <Card.Title>Logs</Card.Title>
                <Card.Body>
                    <LogManager />
                </Card.Body>
            </GridItemHelper>

            <GridItemHelper>
                <Card.Body>
                    <ChartDisplay metricState={metrics} />
                </Card.Body>
            </GridItemHelper>
        </SimpleGrid>
    )
}

interface GridItemHelperProps extends React.HTMLAttributes<HTMLDivElement> {
    rowSize?: number
    colSize?: number
    children?: React.ReactNode
}

const GridItemHelper = ({
    rowSize = 1,
    colSize = 1,
    children,
    ...rest
}: GridItemHelperProps) => {
    return (
        <GridItem
            overflow={'hidden'}
            rowSpan={rowSize}
            colSpan={colSize}
            {...rest}
        >
            <Card.Root
                height="100%"
                width="100%"
                aspectRatio={colSize / rowSize}
            >
                {children}
            </Card.Root>
        </GridItem>
    )
}
