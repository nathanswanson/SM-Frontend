import { Spinner } from '@chakra-ui/react'
import { ButtonGroup } from '@chakra-ui/react/button'
import { HStack } from '@chakra-ui/react/stack'
import { Status } from '@chakra-ui/react/status'
import { useState } from 'react'
import { RiDeleteBin7Fill, RiPlayLargeFill, RiResetLeftFill, RiStopLargeFill } from 'react-icons/ri'
import { deleteServer, startServer, stopServer } from '../../../../lib/hey-api/client'
import CommandButton from '../../../components/command-button'
import { Tooltip } from '../../../components/tooltip'
import { useSelectedServerContext } from '../../../providers/selected-server-context'

export const ConsoleCommands = ({ ...props }) => {
    const { selectedServer, serverInfo, setSelectedServer, serverOnline, setServerOnline } = useSelectedServerContext()
    const [commandLoading, setCommandLoading] = useState(false)

    const start_server = async () => {
        setCommandLoading(true)
        // await api call
        startServer({ credentials: 'include', path: { server_id: serverInfo?.id ?? -1 } })
            .then(response => {
                if (response.response.ok) {
                    setServerOnline(true)
                }
            })
            .finally(() => {
                setCommandLoading(false)
            })
    }

    const stop_server = async () => {
        setCommandLoading(true)
        stopServer({ credentials: 'include', path: { server_id: serverInfo?.id ?? -1 } })
            .then(response => {
                if (response.response.ok) {
                    setServerOnline(false)
                }
            })
            .finally(() => {
                setCommandLoading(false)
            })
    }

    const restartServer = async () => {
        setCommandLoading(true)
        stop_server()
            .then(() => {
                start_server()
            })
            .finally(() => {
                setCommandLoading(false)
            })
    }

    const delete_server = async () => {
        setCommandLoading(true)
        deleteServer({
            credentials: 'include',
            path: { server_id: serverInfo?.id ?? -1 }
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
                <CommandButton onClick={start_server} disabled={!selectedServer} label="Start" aria-label="start">
                    <RiPlayLargeFill />
                </CommandButton>
                <CommandButton
                    onClick={stop_server}
                    disabled={!selectedServer || !serverOnline}
                    label="Stop"
                    aria-label="stop"
                >
                    <RiStopLargeFill />
                </CommandButton>
                <CommandButton
                    onClick={restartServer}
                    disabled={!selectedServer || !serverOnline}
                    label="Restart"
                    aria-label="restart"
                >
                    <RiResetLeftFill />
                </CommandButton>

                <CommandButton onClick={delete_server} disabled={!selectedServer} label="Delete" aria-label="delete">
                    <RiDeleteBin7Fill />
                </CommandButton>
            </ButtonGroup>
            <Spinner hidden={!commandLoading} />
            <Tooltip content={`Status ${serverOnline ? 'Online' : 'Offline'}`}>
                <Status.Root
                    size="lg"
                    p="1rem"
                    colorPalette={selectedServer ? (serverOnline ? 'green' : 'red') : 'current'}
                >
                    <Status.Indicator />
                </Status.Root>
            </Tooltip>
        </HStack>
    )
}
