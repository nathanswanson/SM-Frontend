import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts'
import { useSelectedServerContext } from '../../../selected-server-context'

function dataToRecharts(data: number[][]) {
    return data.map((value, index) => ({
        time: index,
        cpu: value[0] * 100,
        mem: value[1] * 100
    }))
}

export interface ChartDisplayProps {
    metricState: number[][]
    graph_size: number
}

//0: cpu 1: mem*100
export const ChartDisplay = ({
    metricState,
    graph_size
}: ChartDisplayProps) => {
    return (
        // <HStack>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataToRecharts(metricState)}>
                <CartesianGrid strokeOpacity={0.1} strokeDasharray="3 3" />
                <XAxis dataKey="time" domain={[0, graph_size]} />
                <YAxis domain={[0, 100]} />
                <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#8884d8"
                    dot={false}
                    isAnimationActive={false}
                    animationDuration={0}
                />
                <Line
                    type="monotone"
                    dataKey="mem"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    animationDuration={0}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
