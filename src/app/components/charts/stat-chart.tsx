import { Box, HStack, Stat } from '@chakra-ui/react'
import {
    Area,
    AreaChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts'
import { convertToGB } from '../../../utils/util'

export interface ChartDisplayProps {
    metricState: number[][]
    id: number
    label: string
    color: string
}

function dataToRecharts(
    data: number[][],
    id: number,
    expr: (n: number) => number = n => n
) {
    return data.map((value, index) => ({
        time: index,
        data: value[id]
    }))
}

export const StatChart = ({
    metricState,
    id,
    label,
    color,
    ...rest
}: ChartDisplayProps) => (
    <HStack
        marginLeft={4}
        justifyItems={'flex-end'}
        aspectRatio={2 / 1}
        alignItems="center"
        height="100%"
        width="100%"
        {...rest}
    >
        <Stat.Root>
            <Stat.Label>{label}</Stat.Label>
            <Stat.ValueText>
                {convertToGB(metricState[metricState.length - 1][id])}
            </Stat.ValueText>
        </Stat.Root>
        <ResponsiveContainer>
            <AreaChart
                data={dataToRecharts(metricState, id, n => {
                    return n
                })}
                margin={{
                    top: 50,
                    right: 0,
                    left: 0,
                    bottom: 8
                }}
            >
                <Area
                    type="monotone"
                    dataKey="data"
                    stroke={color}
                    fill={color}
                    strokeWidth={2}
                    activeDot={false}
                    dot={false}
                    animationDuration={0}
                />

                <Tooltip />
            </AreaChart>
        </ResponsiveContainer>
    </HStack>
)
