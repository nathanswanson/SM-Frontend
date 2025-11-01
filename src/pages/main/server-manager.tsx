import { SimpleGrid, SkipNavContent } from '@chakra-ui/react'
import { Grid } from '@chakra-ui/react/grid'
import { VStack } from '@chakra-ui/react/stack'
import { useEffect, useState } from 'react'
import { useSubscription } from 'urql'
import { ActionHalo } from '../../components/action-halo'
import CardModule from '../../components/card'
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
    const [res] = useSubscription({ query: subscribe(serverInfo?.container_name ?? '') }, handleSubscription)
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
                <SMChart color="red" unit="Cores" label="Cpu" data={cpuData} />
                <SMChart color="blue" unit="GB" label="Memory" data={memData} />
                <SMChart color="green" unit="Mbps" label="Network" data={netData} />
                <SMChart color="orange" unit="GB" label="Disk" data={diskData} />
            </SimpleGrid>

            <SkipNavContent>
                <Cards />
            </SkipNavContent>
        </VStack>
    )
}

const Cards = ({ ...props }) => {
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
