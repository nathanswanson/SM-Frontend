import { Button, ButtonGroup, Flex, Text, IconButton, Status } from '@chakra-ui/react'
import {
    deleteContainerApiContainerContainerNameDeleteGet,
    startContainerApiContainerNameStartGet,
    stopContainerApiContainerNameStopGet
} from '../../lib/hey-api/client'
import { useState } from 'react'
import { VscDebugRestart, VscDebugStart, VscDebugStop, VscTrash } from 'react-icons/vsc'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { DangerConfirmation } from '../../components/danger-confirmation'
import { UploadPathPrompt } from '../file_manager/components/upload-path-prompt'
import { ServerCreationDialog } from '../gutter/components/server-create-modal'
import { InfoList } from '../../components/info-list'
import { FaFileExport } from 'react-icons/fa6'

export const ServerControl = ({ ...props }) => {
    const { selectedServer, setSelectedServer, serverOnline } = useSelectedServerContext()
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false)
    function deleteServer(serverName: string) {
        if (serverName) {
            deleteContainerApiContainerContainerNameDeleteGet({
                credentials: 'include',
                path: { container_name: serverName }
            })
                .then(() => {
                    setSelectedServer('')
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
            <Button size="lg" variant="surface" disabled={selectedServer == undefined || selectedServer == ''}>
                <FaFileExport />
                Export Server
            </Button>
            <CommandButtons />
            <DangerConfirmation
                resourceName={selectedServer ? selectedServer : ''}
                onConfirm={e => {
                    deleteServer(selectedServer ? selectedServer : '')
                }}
                open={isOpenDeleteDialog}
                setOpen={setIsOpenDeleteDialog}
            />
        </Flex>
    )
}

const CommandButtons = ({ ...props }) => {
    const { selectedServer, serverOnline, setServerOnline } = useSelectedServerContext()

    const [loading, setLoading] = useState(false)

    async function stop_server() {
        setLoading(true)
        if (selectedServer) {
            try {
                await stopContainerApiContainerNameStopGet({
                    credentials: 'include',
                    path: { name: selectedServer }
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
                await startContainerApiContainerNameStartGet({
                    credentials: 'include',
                    path: { name: selectedServer }
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
                disabled={selectedServer == undefined || selectedServer == ''}
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
