import { Card, HStack, Stat } from '@chakra-ui/react'
import React, { useState } from 'react'
import { UnitValue } from '../../../providers/web-socket'

const SparkLineLazy = React.lazy(() => import('./spark-card').then(module => ({ default: module.SparkLine })))

interface LightCardProps {
    label: string
    color: string
    unit?: string
    data: UnitValue[]
}

export const SMChart = ({ label, color, unit, data }: LightCardProps) => {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    return (
        <>
            <Card.Root bg={`${color}.50`} shadow="sm" minH={'150px'} minW="xs" size="sm" overflow="hidden">
                <Card.Body>
                    <Stat.Root>
                        <Stat.Label>{label}</Stat.Label>

                        <HStack gap="0.5em">
                            <Stat.ValueText>
                                {highlightedIndex !== null && data && data[highlightedIndex]
                                    ? data[highlightedIndex].value
                                    : data && data.length > 0
                                      ? data[data.length - 1].value
                                      : '--'}
                            </Stat.ValueText>

                            {unit && <Stat.HelpText>{data ? data[data.length - 1]?.unit : '--'}</Stat.HelpText>}
                        </HStack>
                    </Stat.Root>
                </Card.Body>
                <React.Suspense fallback={<div>Loading...</div>}>
                    {data && data.length > 0 && (
                        <SparkLineLazy
                            color={`${color}.500`}
                            data={data.map(item => ({ value: item.value }))}
                            highlightedIndex={highlightedIndex}
                            onHighlightIndex={setHighlightedIndex}
                        />
                    )}
                </React.Suspense>
            </Card.Root>
        </>
    )
}
