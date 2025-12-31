import { useChart } from '@chakra-ui/charts'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export interface SparkLineProps {
    data: { value: number }[]
    color: string
    // controlled value (optional)
    highlightedIndex?: number | null
    // callback when highlight changes
    onHighlightIndex?: (index: number | null) => void
}

export const SparkLine = ({ data, color, onHighlightIndex }: SparkLineProps) => {
    // initialize from controlled prop if provided

    const chart = useChart({
        data: data,
        series: [{ color: color }]
    })

    return (
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <AreaChart
                data={chart.data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                onMouseMove={e => {
                    const idx = e && e.activeLabel != null ? Number(e.activeLabel) : null
                    if (onHighlightIndex) onHighlightIndex(idx)
                }}
                onMouseLeave={() => {
                    if (onHighlightIndex) onHighlightIndex(null)
                }}
            >
                <Area
                    key={chart.series[0].name}
                    isAnimationActive={false}
                    dataKey={chart.key(chart.series[0].name)}
                    fill={chart.color(chart.series[0].color)}
                    fillOpacity={0.2}
                    stroke={chart.color(chart.series[0].color)}
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
