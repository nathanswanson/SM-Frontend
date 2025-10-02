import { useSelectedServerContext } from '../../providers/selected-server-context'
import React from 'react'
import { Flex } from '@chakra-ui/react/flex'
import { DisabledModule } from '../../components/disabled-module'

const LazyStatChart = React.lazy(() => import('./components/stat-chart'))

export const ChartDisplay = ({ metricState }: { metricState: number[][] }) => {
    const { selectedServer, serverOnline } = useSelectedServerContext()
    return selectedServer == undefined || selectedServer == '' || !serverOnline ? (
        <DisabledModule requester="charts" />
    ) : (
        <Flex gap="4" width="100%" height="100%">
            <LazyStatChart metricState={metricState} id={0} label="CPU" color="#FFBA49" />
            <LazyStatChart metricState={metricState} id={1} label="Mem" color="#5386E4" />
        </Flex>
    )
}
