import {
    Container,
    Flex,
    Grid,
    GridItem,
    Group,
    SimpleGrid,
    Skeleton,
    Stat,
    VStack
} from '@chakra-ui/react'
import {
    hardwareApiSystemHardwareGet,
    HardwareInfoResponse
} from '../../../client'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { convertToGB, roundToNearest4GB } from '../util/util'

export const NodeOverview = () => {
    return (
        <Grid>
            <GridItem>
                <HardwareInfo />
            </GridItem>
            <GridItem>
                <VStack>
                    <Skeleton></Skeleton>
                    <Skeleton></Skeleton>
                </VStack>
            </GridItem>
            <GridItem></GridItem>
        </Grid>
    )
}

const HardwareInfo = ({ ...props }) => {
    const hardwareInfo = useState<HardwareInfoResponse | undefined>(undefined)
    const state = useAsync(async () => {
        const hardware_info = await hardwareApiSystemHardwareGet()
        hardwareInfo[1](hardware_info.data)
    }, [])

    return state.loading ? (
        <Skeleton></Skeleton>
    ) : (
        <SimpleGrid>
            <Stat.Root>
                <Stat.Label>Node ID</Stat.Label>
                <Stat.ValueText>01</Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Containers</Stat.Label>
                <Stat.ValueText>4</Stat.ValueText>
                <Stat.ValueUnit></Stat.ValueUnit>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>CPU Architecture</Stat.Label>
                <Stat.ValueText>
                    {hardwareInfo[0]?.cpu.architecture}
                </Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Arch</Stat.Label>
                <Stat.ValueText>
                    {hardwareInfo[0]?.cpu.model_name}
                </Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>RunTime</Stat.Label>
                <Stat.ValueText>{64}</Stat.ValueText>
                <Stat.ValueUnit>hours</Stat.ValueUnit>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Core Usage</Stat.Label>
                <Stat.ValueText>38 / 64</Stat.ValueText>
                <Stat.ValueUnit>CPU / CPU</Stat.ValueUnit>
            </Stat.Root>
            <Group>
                <Stat.Root>
                    <Stat.Label>Disk</Stat.Label>
                    <Stat.ValueText>23.45%</Stat.ValueText>
                    <Stat.ValueUnit>Usage</Stat.ValueUnit>
                </Stat.Root>
                <Stat.Root>
                    <Stat.Label>Disk Size</Stat.Label>
                    <Stat.ValueText>1.03</Stat.ValueText>
                    <Stat.ValueUnit>TB</Stat.ValueUnit>
                </Stat.Root>
                <Stat.Root>
                    <Stat.Label>Memory</Stat.Label>
                    <Stat.ValueText>
                        24.34 /{' '}
                        {roundToNearest4GB(
                            convertToGB(hardwareInfo[0]?.mem ?? 0)
                        )}
                    </Stat.ValueText>
                    <Stat.ValueUnit>GB / GB</Stat.ValueUnit>
                </Stat.Root>
            </Group>
        </SimpleGrid>
    )
}
