import { Card, HStack, Stat } from '@chakra-ui/react'
import React, { useState } from 'react'

const SparkLineLazy = React.lazy(() => import('./spark-card').then(module => ({ default: module.SparkLine })))

interface LightCardProps {
    label: string
    color: string
    unit?: string
    data: number[]
}

export const SMChart = ({ label, color, unit, data }: LightCardProps) => {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    return (
        <>
            <Card.Root bg={`${color}.50`} shadow="sm" minH={'150px'} minW="xs" size="sm" overflow="hidden">
                <Card.Body>
                    <Stat.Root>
                        <Stat.Label color={{ base: 'gray.900', _dark: 'gray.900' }}>{label}</Stat.Label>

                        <HStack gap="0.5em">
                            <Stat.ValueText color={{ _light: 'gray.800', _dark: 'gray.800' }}>
                                {highlightedIndex !== null && data && data[highlightedIndex]
                                    ? data[highlightedIndex]
                                    : data && data.length > 0
                                      ? data[data.length - 1]
                                      : '--'}
                            </Stat.ValueText>

                            {unit && (
                                <Stat.HelpText color={{ base: 'gray.900', _dark: 'gray.900' }}>
                                    {unit || '--'}
                                </Stat.HelpText>
                            )}
                        </HStack>
                    </Stat.Root>
                </Card.Body>
                {/* <React.Suspense fallback={<div>Loading...</div>}>
                    {data && data.length > 0 && ( */}
                <SparkLineLazy
                    color={`${color}.500`}
                    data={data.map(item => ({ value: item }))}
                    highlightedIndex={highlightedIndex}
                    onHighlightIndex={setHighlightedIndex}
                />
                {/* )} */}
                {/* </React.Suspense> */}
            </Card.Root>
        </>
    )
}
