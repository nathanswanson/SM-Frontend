import { NodeOverview } from '../node_overview/node-overview'
import CardModule from '../../components/card'
import { Grid } from '@chakra-ui/react/grid'
import { LogManager } from '../console/console'
import { ButtonGroup, Flex, HStack, Status, VStack } from '@chakra-ui/react'
import { ServerOverview } from '../server_overview/server-overview'
import { LightCard } from '../../components/light-card'
import { ActionHalo } from '../../components/action-halo'
import { RiDeleteBin7Fill, RiPlayLargeFill, RiResetLeftFill, RiStopLargeFill } from 'react-icons/ri'
import { Tooltip } from '../../components/tooltip'
import { FileManagerHalo } from '../file_manager/file-manager'
import CommandButton from '../../components/command-button'

// make graph data spuratic
const tempRandomData = () => {
    return [...Array(5).keys()].map(() => Math.floor(Math.random() * 100))
}

export const MainContent = ({ ...props }) => {
    return (
        <VStack {...props}>
            <Flex margin="8" justifyContent={'space-evenly'} width="100%" mb="1.5em">
                <LightCard color="red" unit="Cores" label="Cpu" data={tempRandomData()} />
                <LightCard color="blue" unit="GB" label="Memory" data={tempRandomData()} />
                <LightCard color="green" unit="Mbps" label="Network" data={tempRandomData()} />
                <LightCard color="orange" unit="GB" label="Disk" data={tempRandomData()} />
            </Flex>
            <Cards />
        </VStack>
    )
}

const ConsoleCommands = ({ ...props }) => {
    return (
        <HStack justifyContent={'space-between'} width="100%">
            <ButtonGroup width="100%">
                <CommandButton label="Start" aria-label="start">
                    <RiPlayLargeFill />
                </CommandButton>
                <CommandButton label="Restart" aria-label="restart">
                    <RiResetLeftFill />
                </CommandButton>
                <CommandButton label="Stop" aria-label="stop">
                    <RiStopLargeFill />
                </CommandButton>
                <CommandButton label="Delete" aria-label="delete">
                    <RiDeleteBin7Fill />
                </CommandButton>
            </ButtonGroup>
            <Tooltip content={`Status ${false}`}>
                <Status.Root size="lg" p="1rem" colorPalette={'green'}>
                    <Status.Indicator />
                </Status.Root>
            </Tooltip>
        </HStack>
    )
}

interface CommandButtonProps {
    label: string
    children: React.ReactNode
}

const Cards = ({ ...props }) => {
    // const { metricMessages } = useWebSocketProvider()
    return (
        <Grid
            alignSelf="flex-start"
            gap="1.5em"
            // minW={'1400px'}
            templateColumns={[
                'repeat(3, 1fr);',
                'repeat(3, 1fr);',
                'repeat(6, 1fr);',
                'repeat(9, 1fr);',
                'repeat(12, 1fr);'
            ]}
            autoRows={'minmax(330px, max-content);'}
            flexWrap={'wrap'}
            {...props}
        >
            <CardModule header="Node" colSize={3}>
                <NodeOverview />
            </CardModule>
            <FileManagerHalo colSpan={3} rowSpan={2} />
            <ActionHalo colSpan={6} rowSpan={2}>
                <ActionHalo.Header>
                    <ConsoleCommands />
                </ActionHalo.Header>
                <ActionHalo.Contents>
                    <CardModule header="console">
                        <LogManager />
                    </CardModule>
                </ActionHalo.Contents>
            </ActionHalo>
            <CardModule header="Server" colSize={3}>
                <ServerOverview />
            </CardModule>
        </Grid>
    )
}
