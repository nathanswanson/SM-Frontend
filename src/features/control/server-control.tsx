import { Button, ButtonGroup, Flex, IconButton, Status, Text } from '@chakra-ui/react'

import { useState } from 'react'
import { FaFileExport } from 'react-icons/fa6'
import { VscDebugRestart, VscDebugStart, VscDebugStop } from 'react-icons/vsc'
import { deleteServer, startServer, stopServer } from '../../../lib/hey-api/client'
import { DangerConfirmation } from '../../components/danger-confirmation'
import { useSelectedServerContext } from '../../providers/selected-server-context'

export const ServerControl = ({ ...props }) => {
    const { selectedServer, setSelectedServer, serverInfo, serverOnline } = useSelectedServerContext()
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false)
    function delete_server(serverName: string) {
        if (serverName) {
            deleteServer({
                credentials: 'include',
                path: { server_id: serverInfo?.id ?? -1 }
            })
                .then(() => {
                    setSelectedServer(undefined)
                })
                .finally(() => {
                    setIsOpenDeleteDialog(false)
                })
        }
    }
    return (
        <Flex gap="8px" wrap="wrap" justifyContent={'space-between'} {...props}>
            <Text color={serverOnline ? 'green.500' : 'red.500'} width="100%" textAlign={'end'}>
                Server {serverOnline ? 'online' : 'offline'}{' '}
                <Status.Root>
                    <Status.Indicator background={!serverOnline ? 'danger.500' : 'green.500'} />
                </Status.Root>
            </Text>
            <Button size="lg" variant="surface" disabled={selectedServer == undefined}>
                <FaFileExport />
                Export Server
            </Button>
            <CommandButtons />
            <DangerConfirmation
                resourceName={serverInfo?.name ?? ''}
                onConfirm={e => {
                    deleteServer({
                        credentials: 'include',
                        path: { server_id: serverInfo?.id ?? -1 }
                    })
                }}
                open={isOpenDeleteDialog}
                setOpen={setIsOpenDeleteDialog}
            />
        </Flex>
    )
}

const CommandButtons = ({ ...props }) => {
    const { selectedServer, serverOnline, serverInfo, setServerOnline } = useSelectedServerContext()

    const [loading, setLoading] = useState(false)

    async function stop_server() {
        setLoading(true)
        if (selectedServer) {
            try {
                await stopServer({
                    credentials: 'include',
                    path: { server_id: serverInfo?.id ?? -1 }
                })
                setServerOnline(false)
            } finally {
                setLoading(false)
            }
        }
    }

    async function start_server() {
        setLoading(true)
        if (selectedServer) {
            try {
                await startServer({
                    credentials: 'include',
                    path: { server_id: serverInfo?.id ?? -1 }
                })
                setServerOnline(true)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <ButtonGroup size="lg" variant="surface" attached {...props}>
            <IconButton
                loading={loading}
                disabled={selectedServer == undefined}
                onClick={serverOnline ? stop_server : start_server}
            >
                {serverOnline === null ? <VscDebugStart /> : serverOnline ? <VscDebugStop /> : <VscDebugStart />}
            </IconButton>
            <IconButton disabled={!serverOnline}>
                <VscDebugRestart />
            </IconButton>
        </ButtonGroup>
    )
}
