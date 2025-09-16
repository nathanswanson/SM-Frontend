import {
    Button,
    Container,
    Flex,
    Grid,
    GridItem,
    Group,
    Menu,
    Portal,
    SimpleGrid,
    Skeleton,
    Stat,
    VStack
} from '@chakra-ui/react'
import {
    hardwareApiSystemHardwareGet,
    HardwareInfoResponse
} from '../../../lib/hey-api/client'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { convertToGB, roundToNearest4GB } from '../../../utils/util'
import { FaPlus } from 'react-icons/fa'
import { TemplateCreateDialog } from '../dialogs/template-create-modal'
import { ServerCreationDialog } from '../dialogs/server-create-modal'
import { FaLinkSlash } from 'react-icons/fa6'

export const NodeOverview = () => {
    return (
        <Grid width="100%" height="100%">
            <GridItem w="100%" h="100%">
                <NodeHeaderInfo w="100%" justifyContent={'space-between'} />
            </GridItem>
            <GridItem h="100%">
                <HardwareInfo />
            </GridItem>
            <GridItem
                width="100%"
                minH={0}
                h="100%"
                alignSelf="stretch"
                overflow="auto"
            >
                <NodeControls
                    alignItems="flex-end"
                    height="100%"
                    width="100%"
                    alignContent={'flex-end'}
                />
            </GridItem>
        </Grid>
    )
}

const NodeHeaderInfo = ({ ...props }) => {
    return (
        <Group {...props} alignContent={'space-between'}>
            <GridItem>
                <Stat.Root size="lg" p="2">
                    <Stat.Label>Node ID</Stat.Label>
                    <Stat.ValueText>01</Stat.ValueText>
                </Stat.Root>
            </GridItem>

            <GridItem>
                <Stat.Root p="2" width="100%">
                    <Stat.Label>Containers</Stat.Label>
                    <Stat.ValueText>4</Stat.ValueText>
                    <Stat.ValueUnit></Stat.ValueUnit>
                </Stat.Root>
            </GridItem>
        </Group>
    )
}

const CreateNewMenu = () => {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button color="white" bg="blue.700">
                    Create New
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item closeOnSelect={false} value="Node">
                            New Node...
                        </Menu.Item>
                        <Menu.Item closeOnSelect={false} value="Template">
                            <TemplateCreateDialog />
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    )
}

const NodeControls = ({ ...props }) => {
    return (
        <Group {...props}>
            <CreateNewMenu />

            <Button color="white" bg="red.700">
                <FaLinkSlash />
                Unlink
            </Button>
        </Group>
    )
}

const HardwareInfo = ({ ...props }) => {
    const hardwareInfo = useState<HardwareInfoResponse | undefined>(undefined)
    const state = useAsync(async () => {
        const hardware_info = await hardwareApiSystemHardwareGet()
        hardwareInfo[1](hardware_info.data)
    }, [])

    return state.loading ? (
        <Skeleton h="100%" w="100%"></Skeleton>
    ) : (
        <VStack w="100%" height="100%">
            <SimpleGrid
                height="100%"
                templateColumns={'1fr 1fr'}
                templateRows={'1fr 1fr 1fr'}
                width={'100%'}
            >
                <GridItem colSpan={2}>
                    <Stat.Root p="2">
                        <Stat.Label>CPU Architecture</Stat.Label>
                        <Stat.ValueText>
                            {hardwareInfo[0]?.cpu.architecture}
                        </Stat.ValueText>
                    </Stat.Root>
                </GridItem>

                <GridItem>
                    <Stat.Root p="2">
                        <Stat.Label>Arch</Stat.Label>
                        <Stat.ValueText>
                            {hardwareInfo[0]?.cpu.model_name}
                        </Stat.ValueText>
                    </Stat.Root>
                </GridItem>

                <GridItem>
                    <Stat.Root p="2">
                        <Stat.Label>RunTime</Stat.Label>
                        <Stat.ValueText>{64}</Stat.ValueText>
                        <Stat.ValueUnit>hours</Stat.ValueUnit>
                    </Stat.Root>
                </GridItem>

                <GridItem>
                    <Stat.Root p="2">
                        <Stat.Label>Core Usage</Stat.Label>
                        <Stat.ValueText>38 / 64</Stat.ValueText>
                        <Stat.ValueUnit>CPU / CPU</Stat.ValueUnit>
                    </Stat.Root>
                </GridItem>

                <GridItem>
                    <Stat.Root p="2">
                        <Stat.Label>Disk</Stat.Label>
                        <Stat.ValueText>23.45%</Stat.ValueText>
                        <Stat.ValueUnit>Usage</Stat.ValueUnit>
                    </Stat.Root>
                </GridItem>
                <GridItem>
                    <Stat.Root p="2">
                        <Stat.Label>Disk Size</Stat.Label>
                        <Stat.ValueText>1.03</Stat.ValueText>
                        <Stat.ValueUnit>TB</Stat.ValueUnit>
                    </Stat.Root>
                </GridItem>

                <GridItem>
                    <Stat.Root p="2">
                        <Stat.Label>Memory</Stat.Label>
                        <Stat.ValueText>
                            24.34 /{' '}
                            {roundToNearest4GB(
                                convertToGB(hardwareInfo[0]?.mem ?? 0)
                            )}
                        </Stat.ValueText>
                        <Stat.ValueUnit>GB / GB</Stat.ValueUnit>
                    </Stat.Root>
                </GridItem>
            </SimpleGrid>
        </VStack>
    )
}
