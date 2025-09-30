import { Button, ButtonGroup, HStack, IconButton } from '@chakra-ui/react'
import { startContainerApiContainerNameStartGet, stopContainerApiContainerNameStopGet } from '../../lib/hey-api/client'
import { useState } from 'react'
import { VscDebugRestart, VscDebugStart, VscDebugStop, VscTrash } from 'react-icons/vsc'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { DangerConfirmation } from '../../components/danger-confirmation'
import { UploadPathPrompt } from './components/upload-path-prompt'
import { ServerCreationDialog } from './components/server-create-modal'

export const ServerOverview = ({ ...props }) => {
    const { selectedServer } = useSelectedServerContext()
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false)
    return (
        <HStack justifyContent={'space-between'} {...props}>
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
            <DangerConfirmation open={isOpenDeleteDialog} setOpen={setIsOpenDeleteDialog} />
            <ServerCreationDialog />
        </HStack>
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
