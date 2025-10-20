import { SimpleGrid } from '@chakra-ui/react'
import { Grid } from '@chakra-ui/react/grid'
import { VStack } from '@chakra-ui/react/stack'
import { ActionHalo } from '../../components/action-halo'
import CardModule from '../../components/card'
import { LogManager } from '../../features/console/console'
import { FileManagerHalo } from '../../features/file_manager/file-manager'
import { NodeOverview } from '../../features/node_overview/node-overview'
import { ConsoleCommands } from '../../features/server_overview/components/command-bar'
import { ServerOverview } from '../../features/server_overview/server-overview'
import { useWebSocketProvider } from '../../providers/web-socket'
import { SMChart } from './components/chart'

export const MainContent = ({ ...props }) => {
    const { metricMessages } = useWebSocketProvider()
    return (
        <VStack {...props}>
            <SimpleGrid
                hideBelow={'md'}
                gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
                margin="8"
                gap={'4em'}
                justifyContent={'space-evenly'}
                width="100%"
                mb="1.5em"
                // flexFlow={'row wrap'}
            >
                <SMChart color="red" unit="Cores" label="Cpu" data={metricMessages[0]} />
                <SMChart color="blue" unit="GB" label="Memory" data={metricMessages[1]} />
                <SMChart color="green" unit="Mbps" label="Network" data={metricMessages[2]} />
                <SMChart color="orange" unit="GB" label="Disk" data={metricMessages[3]} />
            </SimpleGrid>
            <Cards />
        </VStack>
    )
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
