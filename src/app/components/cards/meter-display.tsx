import { Grid, GridItem } from '@chakra-ui/react'
import { ChartDisplayProps } from './chart-display'
import {
    Cell,
    Label,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts'

function dataToRecharts(data: number[][], keyA: number, keyB: number) {
    return [
        { name: 'up', value: data[data.length - 1][keyA] / 1024 },
        { name: 'down', value: data[data.length - 1][keyB] / 1024 }
    ]
}

export const MeterDisplay = ({
    metricState,
    graph_size
}: ChartDisplayProps) => {
    return (
        <Grid h="100%" w="100%" templateColumns={'1fr 1fr'} gap={4}>
            <GridItem>
                <ResponsiveContainer height="100%">
                    <PieChart
                        width={100}
                        height={100}
                        data={dataToRecharts(metricState, 2, 3)}
                    >
                        <Pie
                            dataKey="value"
                            nameKey="name"
                            innerRadius={100}
                            outerRadius={120}
                        >
                            <Cell key="down" fill="#3182CE" />
                            <Cell key="up" fill="#E2E8F0" />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </GridItem>
            <GridItem>
                <ResponsiveContainer height="100%">
                    <PieChart
                        width={150}
                        height={150}
                        data={dataToRecharts(metricState, 4, 5)}
                    >
                        <Pie
                            dataKey="value"
                            nameKey="name"
                            innerRadius={100}
                            outerRadius={120}
                        >
                            <Cell key="down" fill="#3182CE" />
                            <Cell key="up" fill="#E2E8F0" />
                        </Pie>
                        Test
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </GridItem>
        </Grid>
    )
}
