import { Card, Stat } from '@chakra-ui/react'
import { Chart, useChart } from '@chakra-ui/charts'
import { AreaChart, Area } from 'recharts'
import { Text } from '@chakra-ui/react/text'

const SparkLine = ({ data, color }: { data: { value: number }[]; color: string }) => {
    const chart = useChart({
        data: data,
        series: [{ color: color }]
    })

    return (
        <Chart.Root width="300px" height="10" chart={chart}>
            <AreaChart data={chart.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area
                    key={chart.series[0].name}
                    isAnimationActive={false}
                    dataKey={chart.key(chart.series[0].name)}
                    fill={chart.color(chart.series[0].color)}
                    fillOpacity={0.2}
                    stroke={chart.color(chart.series[0].color)}
                    strokeWidth={2}
                    // width="200px"
                />
            </AreaChart>
        </Chart.Root>
    )
}

interface LightCardProps {
    label: string
    color: string
    unit?: string
    data: number[]
}

export const LightCard = ({ label, color, unit, data }: LightCardProps) => {
    // random data temp

    return (
        <>
            <Card.Root bg={`${color}.50`} shadow="sm" maxW="lg" size="sm" overflow="hidden">
                <Card.Body>
                    {data == undefined || data.length < 5 ? (
                        <Text>Gathering Data...</Text>
                    ) : (
                        <Stat.Root>
                            <Stat.Label>{label}</Stat.Label>
                            <Stat.ValueText>{data[data.length - 1].toPrecision(3)}</Stat.ValueText>
                            {unit && <Stat.HelpText>{unit}</Stat.HelpText>}
                        </Stat.Root>
                    )}
                </Card.Body>
                {data == undefined || data.length < 5 ? (
                    <></>
                ) : (
                    <SparkLine color={`${color}.500`} data={data.map(item => ({ value: item }))} />
                )}
            </Card.Root>
        </>
    )
}
