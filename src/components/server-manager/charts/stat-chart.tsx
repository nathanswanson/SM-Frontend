import { HStack, Stat } from '@chakra-ui/react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { convertToGB } from '../util/util'

export interface ChartDisplayProps {
    metricState: number[][]
    id: number
    label: string
}

function dataToRecharts(
    data: number[][],
    id: number,
    expr: (n: number) => number = n => n
) {
    return data.map((value, index) => ({
        time: index,
        data: expr(value[id])
    }))
}

export const StatChart = ({ metricState, id, label }: ChartDisplayProps) => (
    <HStack height="4em" overflow="hidden">
        <Stat.Root size="sm">
            <Stat.Label>{label}</Stat.Label>
            <Stat.ValueText>
                {convertToGB(metricState[metricState.length - 1][id])}
            </Stat.ValueText>
        </Stat.Root>
        <ResponsiveContainer height="4em" width="4em">
            <LineChart data={dataToRecharts(metricState, id)}>
                <Line
                    type="monotone"
                    dataKey="data"
                    stroke="#8884d8"
                    dot={false}
                    animationDuration={0}
                />
            </LineChart>
        </ResponsiveContainer>
    </HStack>
)
