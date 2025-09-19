import { Button, ButtonGroup, HStack, IconButton } from '@chakra-ui/react'
import {
    getContainerStatusApiContainerContainerNameStatusGet,
    startContainerApiContainerNameStartGet,
    stopContainerApiContainerNameStopGet
} from '../../../lib/hey-api/client'
import { useState, useEffect } from 'react'
import { VscDebugRestart, VscDebugStart, VscDebugStop, VscTrash } from 'react-icons/vsc'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { UploadPathPrompt } from '../dialogs/upload-path-prompt'
import { ServerCreationDialog } from '../dialogs/server-create-modal'

export const ServerOverview = ({ ...props }) => {
    const { selectedServer } = useSelectedServerContext()
    return (
        <HStack justifyContent={'space-between'} {...props}>
            <Button size="lg" variant="surface" disabled={selectedServer == undefined || selectedServer == ''}>
                Export Server
            </Button>
            <UploadPathPrompt />
            <CommandButtons />
            <Button
                disabled={selectedServer == undefined || selectedServer == ''}
                size="lg"
                bg={selectedServer ? 'red.700' : ''}
                color="white"
                variant="surface"
            >
                <VscTrash />
                Delete Server
            </Button>
            <ServerCreationDialog />
        </HStack>
    )
}

const CommandButtons = ({ ...props }) => {
    const { selectedServer } = useSelectedServerContext()
    const [serverRunning, setServerRunning] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStatus() {
            if (selectedServer) {
                const serverStatus = await getContainerStatusApiContainerContainerNameStatusGet({
                    credentials: 'include',
                    path: { container_name: selectedServer }
                })
                const status = (serverStatus.data as { running?: boolean } | undefined)?.running
                setServerRunning(status ?? false)
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
                    credentials: 'include',
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
                    credentials: 'include',
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
                loading={loading && serverRunning != null}
                disabled={selectedServer == undefined || selectedServer == ''}
                bg={selectedServer != undefined && selectedServer != '' ? (serverRunning ? 'green' : 'red') : ''}
                color="white"
                onClick={serverRunning ? stop_server : start_server}
            >
                {serverRunning === null ? <VscDebugStart /> : serverRunning ? <VscDebugStop /> : <VscDebugStart />}
            </IconButton>
            <IconButton disabled={!serverRunning}>
                <VscDebugRestart />
            </IconButton>
        </ButtonGroup>
    )
}
