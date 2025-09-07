import { Button, HStack, Stat, Text, VStack } from '@chakra-ui/react'
import {
    getContainerStatusApiContainerContainerNameStatusGet,
    hardwareApiSystemHardwareGet,
    HardwareInfoResponse,
    startContainerApiContainerNameStartGet,
    stopContainerApiContainerNameStopGet
} from '../../../client'
import { useEffect, useState } from 'react'
import { useSelectedServerContext } from '../../../selected-server-context'
import { VscDebugRestart, VscDebugStart, VscDebugStop } from 'react-icons/vsc'
import { DangerConfirmation } from '../dialogs/danger-confirmation'
import { useAsync } from 'react-use'
import { convertToGB } from '../util/util'

export const ManageServer = () => {
    return (
        <VStack m="4" display="flow" justify="space-between">
            <HardwareInfo />
            <AllocatedResources />
            <CommandButtons />
        </VStack>
    )
}

const AllocatedResources = () => {
    const { selectedServer } = useSelectedServerContext()
    // memory, cpus, disk
    return (
        <HStack align={'flex-start'}>
            <Stat.Root>
                <Stat.Label>Memory</Stat.Label>
                <Stat.ValueText>16</Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>CPUs</Stat.Label>
                <Stat.ValueText>4</Stat.ValueText>
            </Stat.Root>
            <Stat.Root>
                <Stat.Label>Disk</Stat.Label>
                <Stat.ValueText>100 </Stat.ValueText>
            </Stat.Root>
        </HStack>
    )
}

const HardwareInfo = () => {
    const hardwareInfo = useState<HardwareInfoResponse | undefined>(undefined)
    const state = useAsync(async () => {
        const hardware_info = await hardwareApiSystemHardwareGet()
        hardwareInfo[1](hardware_info.data)
    }, [])

    return state.loading ? (
        'Loading...'
    ) : (
        <VStack>
            <Stat.Root textAlign={'left'}>
                <Stat.Label>CPU Architecture</Stat.Label>
                <Stat.ValueText>
                    {hardwareInfo[0]?.cpu.architecture}
                </Stat.ValueText>
            </Stat.Root>
            <HStack align={'flex-start'}>
                <Stat.Root>
                    <Stat.Label>CPU Model</Stat.Label>
                    <Stat.ValueText>
                        {hardwareInfo[0]?.cpu.model_name}
                    </Stat.ValueText>
                </Stat.Root>
                <Stat.Root>
                    <Stat.Label>Memory</Stat.Label>
                    <Stat.ValueText>
                        {convertToGB(hardwareInfo[0]?.mem ?? 0)} GB
                    </Stat.ValueText>
                </Stat.Root>
            </HStack>
        </VStack>
    )
}

const CommandButtons = () => {
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
        <HStack>
            <Button
                loading={loading}
                disabled={selectedServer == undefined || selectedServer == ''}
                onClick={serverRunning ? stop_server : start_server}
            >
                {serverRunning === null
                    ? 'Loading...'
                    : serverRunning
                      ? 'Stop'
                      : 'Start'}
                {/* {serverRunning ? <VscDebugStop /> : <VscDebugStart />} */}
            </Button>
            <Button disabled>
                <VscDebugRestart />
            </Button>
            {/* <DangerConfirmation
                disabled={
                    selectedServer == undefined ||
                    selectedServer == '' ||
                    loading
                }
                colorPalette="red"
            /> */}
        </HStack>
    )
}
