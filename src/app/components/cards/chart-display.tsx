import { SimpleGrid } from '@chakra-ui/react'
import { StatChart } from '../charts/stat-chart'

//0: cpu 1: mem*100
export const ChartDisplay = ({ metricState }: { metricState: number[][] }) => {
    return (
        <SimpleGrid
            gap="4"
            templateColumns="1fr 1fr"
            width="100%"
            height="100%"
            alignItems="end"
        >
            <StatChart
                metricState={metricState}
                id={0}
                label="CPU"
                color="#FFBA49"
            />
            <StatChart
                metricState={metricState}
                id={1}
                label="Mem"
                color="#5386E4"
            />
        </SimpleGrid>
    )
}
