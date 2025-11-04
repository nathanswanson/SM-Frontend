import { Spinner } from '@chakra-ui/react'
import { ButtonGroup } from '@chakra-ui/react/button'
import { HStack } from '@chakra-ui/react/stack'
import { Status } from '@chakra-ui/react/status'
import { Delete, PlayCircle, RotateCcw, StopCircle } from 'lucide-react'
import { useState } from 'react'
import { deleteServer, startServer, stopServer } from '../../../../lib/hey-api/client/sdk.gen'
import CommandButton from '../../../components/command-button'
import { Tooltip } from '../../../components/tooltip'
import { useSelectedServerContext } from '../../../providers/selected-server-context'

export const ConsoleCommands = ({ ...props }) => {
    const { serverInfo, setSelectedServer, serverOnline, setServerOnline } = useSelectedServerContext()
    const [commandLoading, setCommandLoading] = useState(false)

    const start_server = async (e: any) => {
        e.preventDefault()
        setCommandLoading(true)
        // await api call
        if (serverInfo) {
            startServer({ credentials: 'include', path: { server_id: serverInfo.id } })
                .then(response => {
                    if (response.response.ok) {
                        setServerOnline(true)
                    }
                })
                .finally(() => {
                    setCommandLoading(false)
                })
        }
    }

    const stop_server = async () => {
        setCommandLoading(true)
        if (serverInfo) {
            stopServer({ credentials: 'include', path: { server_id: serverInfo.id } })
                .then(response => {
                    if (response.response.ok) {
                        setServerOnline(false)
                    }
                })
                .finally(() => {
                    setCommandLoading(false)
                })
        }
    }

    const restartServer = async () => {
        setCommandLoading(true)
        // stop_server()
        //     .then(() => {
        //         // start_server()
        //     })
        //     .finally(() => {
        //         // setCommandLoading(false)
        //     })
    }

    const delete_server = async () => {
        if (!serverInfo) {
            return
        }
        setCommandLoading(true)
        deleteServer({
            path: { server_id: serverInfo.id }
        })
            .then(response => {
                if (response.response.ok) {
                    setSelectedServer(undefined)
                    setServerOnline(false)
                }
            })
            .finally(() => {
                setCommandLoading(false)
            })
    }

    return (
        <HStack justifyContent={'space-between'} width="100%" {...props}>
            <ButtonGroup width="100%">
                <CommandButton onClick={start_server} disabled={serverOnline || !serverInfo} label="Start">
                    <PlayCircle />
                </CommandButton>
                <CommandButton type="button" onClick={stop_server} disabled={!serverOnline} label="Stop">
                    <StopCircle />
                </CommandButton>
                <CommandButton onClick={restartServer} disabled={!serverOnline} label="Restart">
                    <RotateCcw />
                </CommandButton>

                <CommandButton onClick={delete_server} disabled={!serverInfo} label="Delete">
                    <Delete />
                </CommandButton>
            </ButtonGroup>
            <Spinner hidden={!commandLoading} />
            <Tooltip content={`Status ${serverOnline ? 'Online' : 'Offline'}`}>
                <Status.Root
                    size="lg"
                    p="1rem"
                    colorPalette={serverInfo ? (serverOnline ? 'green' : 'red') : 'current'}
                >
                    <Status.Indicator />
                </Status.Root>
            </Tooltip>
        </HStack>
    )
}
