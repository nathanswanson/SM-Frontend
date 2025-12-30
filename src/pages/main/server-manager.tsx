import { SimpleGrid, SkipNavContent } from '@chakra-ui/react'
import { Grid } from '@chakra-ui/react/grid'
import { VStack } from '@chakra-ui/react/stack'
import { useEffect, useState } from 'react'
import { useSubscription } from 'urql'
import { ActionHalo } from '../../components/card/action-halo'
import CardModule from '../../components/card/card'
import { ConsoleCommands } from '../../features/console/components/command-bar'
import { LogManager } from '../../features/console/console'
import { FileManagerHalo } from '../../features/file_manager/file-manager'
import { NodeOverview } from '../../features/node_overview/node-overview'
import { ServerOverview } from '../../features/server_overview/server-overview'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { SMChart } from './components/chart'

const subscribe = (source: string) => {
    return `
    subscription metrics {
        getMetrics(containerName: "${source}") {
            cpu
            disk
            memory
            network
        }
    }
`
}

const handleSubscription = (_previous: any, response: any) => {
    return response.getMetrics
}

// Helper to cap arrays at 50 items
const cap50 = <T,>(arr: T[], next: T): T[] => [...arr, next].slice(-50)

export const MainContent = ({ ...props }) => {
    const { serverInfo } = useSelectedServerContext()
    const [res] = useSubscription(
        { query: subscribe(serverInfo?.container_name ?? ''), pause: !serverInfo?.container_name },
        handleSubscription
    )
    const [cpuData, setCpuData] = useState<number[]>([])
    const [memData, setMemData] = useState<number[]>([])
    const [netData, setNetData] = useState<number[]>([])
    const [diskData, setDiskData] = useState<number[]>([])
    useEffect(() => {
        if (res.data) {
            const dataPoint = res.data
            setCpuData(prev => cap50(prev, dataPoint.cpu))
            setMemData(prev => cap50(prev, dataPoint.memory))
            setNetData(prev => cap50(prev, dataPoint.network))
            setDiskData(prev => cap50(prev, dataPoint.disk))
        }
    }, [res])

    return (
        <VStack height="100%" gap={0} {...props}>
            <SimpleGrid
                hideBelow={'md'}
                gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
                paddingX="8"
                paddingTop="4"
                paddingBottom="6"
                gap={'2em'}
                justifyContent={'space-evenly'}
                width="100%"
                flexShrink={0}
            >
                <SMChart color="red" unit="Cores" label="Cpu" data={cpuData} />
                <SMChart color="blue" unit="GB" label="Memory" data={memData} />
                <SMChart color="green" unit="Mbps" label="Network" data={netData} />
                <SMChart color="orange" unit="GB" label="Disk" data={diskData} />
            </SimpleGrid>

            <SkipNavContent style={{ display: 'flex', flex: 1, width: '100%', minHeight: 0 }}>
                <Cards />
            </SkipNavContent>
        </VStack>
    )
}

const Cards = ({ ...props }) => {
    return (
        <Grid
            gap="1.5em"
            padding="1em"
            width="100%"
            flex={1}
            minHeight={0}
            templateColumns={[
                'repeat(3, 1fr);',
                'repeat(3, 1fr);',
                'repeat(6, 1fr);',
                'repeat(9, 1fr);',
                'repeat(12, 1fr);'
            ]}
            templateRows="repeat(2, minmax(0, 320px))"
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
                    <CardModule expandable header="Console" overflow="auto">
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
