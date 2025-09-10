import { Flex, SimpleGrid, VStack } from '@chakra-ui/react'
import { StatChart } from '../charts/stat-chart'

//0: cpu 1: mem*100
export const ChartDisplay = ({ metricState }: { metricState: any }) => {
    return (
        <SimpleGrid templateColumns="1fr 1fr" width="100%" h="100%">
            <StatChart metricState={metricState} id={0} label="CPU" />
            <StatChart metricState={metricState} id={1} label="Mem" />
            <StatChart metricState={metricState} id={2} label="Net" />
            <StatChart metricState={metricState} id={3} label="Net" />
            <StatChart metricState={metricState} id={4} label="Disk" />
            <StatChart metricState={metricState} id={5} label="Disk" />
        </SimpleGrid>
    )
}
