import { Box, Card, GridItem, SimpleGrid, BoxProps } from '@chakra-ui/react'
import { FileManager } from './cards/file-explorer'
import { NodeOverview } from './cards/node-overview'
import { LogManager } from './cards/log-viewer'
import { ChartDisplay } from './cards/chart-display'
import React, { useEffect, useState } from 'react'
import { useSelectedServerContext } from '../providers/selected-server-context'
import { ServerOverview } from './cards/server-overview'
import { useWebSocketProvider } from '../providers/web-socket'

const graph_size = 25

export const MainContent = () => {
    const { metricMessages } = useWebSocketProvider()

    return (
        <SimpleGrid
            flex="1"
            gap="4"
            width="100%"
            minChildWidth="320px"
            alignContent="flex-start"
            columns={{ base: 1, md: 3 }}
        >
            <GridItemHelper header="Node Management" rowSize={2}>
                <NodeOverview />
            </GridItemHelper>

            <GridItemHelper header="File Manager" rowSize={2}>
                <FileManager height="100%" />
            </GridItemHelper>

            <GridItemHelper header="Server" colSize={2}>
                <ServerOverview />
            </GridItemHelper>

            <GridItemHelper header="Logs" colSize={2} rowSize={2}>
                <LogManager />
            </GridItemHelper>

            <GridItemHelper
                header="Metrics"
                colSize={2}
                rowSize={1}
                marginRight={0}
                marginBottom={0}
                cardContentPadding={0}
            >
                <ChartDisplay metricState={metricMessages} />
            </GridItemHelper>
        </SimpleGrid>
    )
}

interface GridItemHelperProps extends BoxProps {
    rowSize?: number
    colSize?: number
    children?: React.ReactNode
    header?: string
    cardContentPadding?: string | number
}

const GridItemHelper = ({
    rowSize = 1,
    colSize = 1,
    children,
    header: label,
    cardContentPadding,
    ...rest
}: GridItemHelperProps) => {
    return (
        <GridItem
            h="100%"
            overflow={'hidden'}
            rowSpan={rowSize}
            colSpan={colSize}
        >
            <Card.Root
                height="100%"
                width="100%"
                padding={0}
                boxShadow="md"
                borderRadius="lg"
                display="flex"
                flexDirection="column"
            >
                {/* Header */}
                {label ? (
                    <Card.Header
                        px={4}
                        py={3}
                        borderBottomWidth="1px"
                        bg="bg.panel"
                        fontWeight="semibold"
                    >
                        {label}
                    </Card.Header>
                ) : null}

                <Card.Body
                    p={cardContentPadding ?? cardContentPadding}
                    height="100%"
                    width="100%"
                    {...rest}
                >
                    {children}
                </Card.Body>
            </Card.Root>
        </GridItem>
    )
}
