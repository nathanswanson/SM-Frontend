import { ServerOverview } from '../features/control/server-control'
import { NodeOverview } from '../features/node_overview/node-overview'
import { FileManager } from '../features/file_manager/file-explorer'
import CardModule from '../components/card'
import { Grid } from '@chakra-ui/react/grid'
import { LogManager } from '../features/logger/log-viewer'
import { SkeletonCircle } from '@chakra-ui/react'

export const MainContent = ({ ...props }) => {
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
            autoRows={'minmax(400px, max-content);'}
            flexWrap={'wrap'}
            {...props}
        >
            <CardModule header="Node" colSize={3}>
                <NodeOverview />
            </CardModule>
            {/* 
            <CardModule header="Template Manager" colSize={6}>
                <TemplateViewer />
            </CardModule> */}

            <CardModule header="Server" colSize={3}>
                <NodeOverview />
            </CardModule>
            <CardModule header="Files" rowSize={1} colSize={3}>
                <FileManager height="100%" />
            </CardModule>
            <CardModule header="Manage" colSize={3}>
                <ServerOverview />
            </CardModule>
            <CardModule header="console" colSize={6}>
                <LogManager />
            </CardModule>
            <CardModule header="cpu" colSize={3}>
                <SkeletonCircle height="100%" />
            </CardModule>
            <CardModule header="memory" colSize={3}></CardModule>
        </Grid>
    )
}
