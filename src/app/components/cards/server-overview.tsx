import {
    Button,
    ButtonGroup,
    Flex,
    Group,
    HStack,
    IconButton,
    Status,
    VStack
} from '@chakra-ui/react'
import {
    getContainerStatusApiContainerContainerNameStatusGet,
    startContainerApiContainerNameStartGet,
    stopContainerApiContainerNameStopGet
} from '../../../lib/hey-api/client'
import { useState, useEffect } from 'react'
import {
    VscDebugRestart,
    VscDebugStart,
    VscDebugStop,
    VscTrash
} from 'react-icons/vsc'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { UploadPathPrompt } from '../dialogs/upload-path-prompt'
import { ServerCreationDialog } from '../dialogs/server-create-modal'

export const ServerOverview = ({ ...props }) => {
    const { selectedServer } = useSelectedServerContext()
    return (
        <HStack justifyContent={'space-between'} {...props}>
            <Button
                size="lg"
                variant="surface"
                disabled={selectedServer == undefined || selectedServer == ''}
            >
                Export Server
            </Button>
            <UploadPathPrompt />
            <CommandButtons />
            <ServerCreationDialog />
            <Button size="lg" bg="red.700" variant="surface">
                <VscTrash />
                Delete Server
            </Button>
        </HStack>
    )
}

function restartServer() {}

const CommandButtons = ({ ...props }) => {
    const { selectedServer } = useSelectedServerContext()
    const [serverRunning, setServerRunning] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStatus() {
            if (selectedServer) {
                const serverStatus =
                    await getContainerStatusApiContainerContainerNameStatusGet({
                        path: { container_name: selectedServer }
                    })
                const serverData = serverStatus.data as {
                    server_status: string
                }
                setServerRunning(serverData.server_status === 'running')
                setLoading(false)
            }
        }
        fetchStatus()
    }, [selectedServer])

    async function stop_server() {
        setLoading(true)
        if (selectedServer) {
            try {
                await stopContainerApiContainerNameStopGet({
                    path: { name: selectedServer }
                })
                setServerRunning(false)
            } finally {
                setLoading(false)
            }
        }
    }

    async function start_server() {
        setLoading(true)
        if (selectedServer) {
            try {
                await startContainerApiContainerNameStartGet({
                    path: { name: selectedServer }
                })
                setServerRunning(true)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <ButtonGroup size="lg" variant="surface" attached>
            <IconButton
                loading={loading}
                disabled={selectedServer == undefined || selectedServer == ''}
                colorPalette={serverRunning ? 'green' : 'red'}
                onClick={serverRunning ? stop_server : start_server}
            >
                {serverRunning === null ? (
                    'Loading...'
                ) : serverRunning ? (
                    <VscDebugStop />
                ) : (
                    <VscDebugStart />
                )}
            </IconButton>
            <IconButton disabled={!serverRunning}>
                <VscDebugRestart />
            </IconButton>
        </ButtonGroup>
    )
}
