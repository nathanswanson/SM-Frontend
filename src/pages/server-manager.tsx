import { Box, Card, GridItem, SimpleGrid, BoxProps } from '@chakra-ui/react'
import { LogManager } from '../features/logger/log-viewer'
import { ChartDisplay } from '../features/chart_viewer/chart-display'
import React, { useEffect, useState } from 'react'
import { useSelectedServerContext } from '../providers/selected-server-context'
import { ServerOverview } from '../features/server_overview/server-overview'
import { useWebSocketProvider } from '../providers/web-socket'
import { NodeOverview } from '../features/node_overview/node-overview'
import { FileManager } from '../features/file_manager/file-explorer'

const graph_size = 25

export const MainContent = ({ ...props }) => {
    const { metricMessages } = useWebSocketProvider()

    return (
        <SimpleGrid
            flex="1"
            gap="4"
            width="100%"
            minChildWidth="320px"
            alignContent="flex-start"
            columns={{ base: 1, md: 3 }}
            {...props}
        >
            <GridItemHelper header="Node Management" colSize={2} rowSize={2}>
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
        <GridItem h="100%" rowSpan={rowSize} colSpan={colSize}>
            <Card.Root
                borderRadius={'sm'}
                bg="bg.subtle"
                overflow={'hidden'}
                height="100%"
                shadow="sm"
                width="100%"
                padding={0}
                display="flex"
                flexDirection="column"
                borderWidth={0}
            >
                {/* Header */}
                {label ? (
                    <Card.Header
                        px={4}
                        py={3}
                        borderBottomWidth="2px"
                        borderBottomColor="gray.200"
                        bg="bg.panel"
                        fontWeight="semibold"
                    >
                        {label}
                    </Card.Header>
                ) : null}

                <Card.Body
                    p={cardContentPadding ?? cardContentPadding}
                    bg="bg.panel"
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
