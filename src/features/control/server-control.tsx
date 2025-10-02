import { Button, ButtonGroup, Flex, HStack, IconButton } from '@chakra-ui/react'
import {
    deleteContainerApiContainerContainerNameDeleteGet,
    startContainerApiContainerNameStartGet,
    stopContainerApiContainerNameStopGet
} from '../../lib/hey-api/client'
import { useState } from 'react'
import { VscDebugRestart, VscDebugStart, VscDebugStop, VscTrash } from 'react-icons/vsc'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { DangerConfirmation } from '../../components/danger-confirmation'
import { UploadPathPrompt } from './components/upload-path-prompt'
import { ServerCreationDialog } from './components/server-create-modal'
import { InfoList } from '../../components/info-list'

export const ServerOverview = ({ ...props }) => {
    const { selectedServer, setSelectedServer } = useSelectedServerContext()
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
            <Button size="lg" variant="surface" disabled={selectedServer == undefined || selectedServer == ''}>
                Export Server
            </Button>
            <UploadPathPrompt />
            <CommandButtons />
            <Button
                onClick={() => {
                    setIsOpenDeleteDialog(true)
                }}
                disabled={selectedServer == undefined || selectedServer == ''}
                size="lg"
                variant="surface"
            >
                <VscTrash />
                Delete Server
            </Button>
            <DangerConfirmation
                resourceName={selectedServer ? selectedServer : ''}
                onConfirm={e => {
                    deleteServer(selectedServer ? selectedServer : '')
                }}
                open={isOpenDeleteDialog}
                setOpen={setIsOpenDeleteDialog}
            />
            <ServerCreationDialog />
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
