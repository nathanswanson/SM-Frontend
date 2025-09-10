import { Button, FileUpload, Flex, Group, Stat, VStack } from '@chakra-ui/react'
import { HiUpload } from 'react-icons/hi'
import {
    getContainerStatusApiContainerContainerNameStatusGet,
    startContainerApiContainerNameStartGet,
    stopContainerApiContainerNameStopGet
} from '../../../client'
import { useState, useEffect } from 'react'
import { VscDebugRestart } from 'react-icons/vsc'
import { useSelectedServerContext } from '../../../selected-server-context'
import { DangerConfirmation } from '../dialogs/danger-confirmation'
import { UploadPathPrompt } from '../dialogs/upload-path-prompt'

export const ServerOverview = ({ ...props }) => {
    return (
        <Flex>
            <UploadPathPrompt />
            <CommandButtons width="50%" />
        </Flex>
    )
}

const AllocatedResources = ({ ...props }) => {
    // memory, cpus, disk
    return (
        <Group {...props}>
            <Stat.Root>
                <Stat.Label>Memory</Stat.Label>
                <Stat.ValueText>16</Stat.ValueText>
                <Stat.ValueUnit>GB</Stat.ValueUnit>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>CPUs</Stat.Label>
                <Stat.ValueText>4</Stat.ValueText>
                <Stat.ValueUnit>Core</Stat.ValueUnit>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Disk</Stat.Label>
                <Stat.ValueText>100</Stat.ValueText>
                <Stat.ValueUnit>GB</Stat.ValueUnit>
            </Stat.Root>
        </Group>
    )
}

const CommandButtons = ({ ...props }) => {
    const { selectedServer, setSelectedServer } = useSelectedServerContext()
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
        <VStack width="100%" {...props}>
            <Button
                size="lg"
                loading={loading}
                disabled={selectedServer == undefined || selectedServer == ''}
                onClick={serverRunning ? stop_server : start_server}
                width="100%"
            >
                {serverRunning === null
                    ? 'Loading...'
                    : serverRunning
                      ? 'Stop'
                      : 'Start'}
                {/* {serverRunning ? <VscDebugStop /> : <VscDebugStart />} */}
            </Button>
            <Group width="100%">
                <Button width="50%" size="lg" disabled>
                    <VscDebugRestart />
                </Button>
                <DangerConfirmation
                    width="100%"
                    size="lg"
                    disabled={
                        selectedServer == undefined ||
                        selectedServer == '' ||
                        loading
                    }
                    colorPalette="red"
                />
            </Group>
        </VStack>
    )
}
