import { Box, SimpleGrid } from '@chakra-ui/react'
import { StatChart } from '../charts/stat-chart'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import React from 'react'

const LazyStatChart = React.lazy(() => import('../charts/stat-chart'))

export const ChartDisplay = ({ metricState }: { metricState: number[][] }) => {
    const { selectedServer, serverOnline } = useSelectedServerContext()
    return selectedServer == undefined || selectedServer == '' || !serverOnline ? (
        <Box textAlign="center" color="fg.muted" p="20">
            Select an online server to view stats
        </Box>
    ) : (
        <SimpleGrid gap="4" templateColumns="1fr 1fr" width="100%" height="100%" alignItems="end">
            <LazyStatChart metricState={metricState} id={0} label="CPU" color="#FFBA49" />
            <LazyStatChart metricState={metricState} id={1} label="Mem" color="#5386E4" />
        </SimpleGrid>
    )
}
