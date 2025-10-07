import { HStack } from '@chakra-ui/react/stack'
import { ButtonGroup } from '@chakra-ui/react/button'
import { Status } from '@chakra-ui/react/status'
import CommandButton from '../../../components/command-button'
import { RiDeleteBin7Fill, RiPlayLargeFill, RiResetLeftFill, RiStopLargeFill } from 'react-icons/ri'
import { Tooltip } from '../../../components/tooltip'
import { useSelectedServerContext } from '../../../providers/selected-server-context'
import { Spinner } from '@chakra-ui/react'
import { useState } from 'react'
import {
    deleteContainerApiContainerContainerNameDeleteGet,
    startContainerApiContainerNameStartGet,
    stopContainerApiContainerNameStopGet
} from '../../../lib/hey-api/client'

export const ConsoleCommands = ({ ...props }) => {
    const { selectedServer, setSelectedServer, serverOnline, setServerOnline } = useSelectedServerContext()
    const [commandLoading, setCommandLoading] = useState(false)

    const startServer = async () => {
        setCommandLoading(true)
        // await api call
        startContainerApiContainerNameStartGet({ credentials: 'include', path: { name: selectedServer ?? '' } })
            .then(response => {
                if (response.response.ok) {
                    setServerOnline(true)
                }
            })
            .finally(() => {
                setCommandLoading(false)
            })
    }

    const stopServer = async () => {
        setCommandLoading(true)
        stopContainerApiContainerNameStopGet({ credentials: 'include', path: { name: selectedServer ?? '' } })
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
        const stopResponse = await stopContainerApiContainerNameStopGet({
            credentials: 'include',
            path: { name: selectedServer ?? '' }
        })
        if (stopResponse.response.ok) {
            setServerOnline(false)
        }
        const startResponse = await startContainerApiContainerNameStartGet({
            credentials: 'include',
            path: { name: selectedServer ?? '' }
        })
        if (startResponse.response.ok) {
            setServerOnline(true)
        }
        setCommandLoading(false)
    }

    const deleteServer = async () => {
        setCommandLoading(true)
        deleteContainerApiContainerContainerNameDeleteGet({
            credentials: 'include',
            path: { container_name: selectedServer ?? '' }
        })
            .then(response => {
                if (response.response.ok) {
                    setSelectedServer('')
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
                <CommandButton onClick={startServer} disabled={!selectedServer} label="Start" aria-label="start">
                    <RiPlayLargeFill />
                </CommandButton>
                <CommandButton
                    onClick={stopServer}
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

                <CommandButton onClick={deleteServer} disabled={!selectedServer} label="Delete" aria-label="delete">
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
