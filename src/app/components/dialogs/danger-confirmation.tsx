import { useSelectedServerContext } from '../../providers/selected-server-context'
import { Button, Dialog, Group, Input, Portal, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { deleteContainerApiContainerContainerNameDeleteGet } from '../../../lib/hey-api/client'

export const DangerConfirmation = ({
    open,
    setOpen
}: {
    open: boolean
    setOpen: (value: React.SetStateAction<boolean>) => void
}) => {
    const { selectedServer, setSelectedServer } = useSelectedServerContext()
    const [confirmText, setConfirmText] = useState('')
    const [pendingDeletion, setPendingDeletion] = useState<boolean>(false)
    function deleteServer() {
        setPendingDeletion(true)
        if (selectedServer) {
            deleteContainerApiContainerContainerNameDeleteGet({
                credentials: 'include',
                path: { container_name: selectedServer }
            })
                .then(() => {
                    setSelectedServer('')
                })
                .finally(() => {
                    setOpen(false)
                    setPendingDeletion(false)
                })
        }
    }

    return (
        <Dialog.Root role="alertdialog" open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger width="100%" height="100%"></Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>DANGER</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Text>
                                    Deleting a server is permanent. To confirm please type in name of server then hit
                                    confirm
                                </Text>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Group width="100%">
                                    <Input
                                        value={confirmText}
                                        placeholder={selectedServer}
                                        onChange={value => setConfirmText(value.target.value)}
                                    ></Input>
                                    <Button
                                        loading={pendingDeletion}
                                        onClick={deleteServer}
                                        disabled={confirmText !== selectedServer}
                                        color="white"
                                        bg="red.500"
                                    >
                                        Confirm
                                    </Button>
                                </Group>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Backdrop>
            </Portal>
        </Dialog.Root>
    )
}
