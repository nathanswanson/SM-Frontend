import React, { useState } from 'react'
import { Dialog } from '@chakra-ui/react/dialog'
import { Portal } from '@chakra-ui/react/portal'
import { Text } from '@chakra-ui/react/text'
import { Input } from '@chakra-ui/react/input'
import { Group } from '@chakra-ui/react/group'
import { Button } from '@chakra-ui/react/button'
import { FaDeleteLeft, FaTrash, FaTrashCan } from 'react-icons/fa6'

export const DangerConfirmation = ({
    open,
    setOpen,
    onConfirm,
    resourceName
}: {
    open: boolean
    setOpen: (value: React.SetStateAction<boolean>) => void
    onConfirm: (resourceName: string) => void
    resourceName: string
}) => {
    const [confirmText, setConfirmText] = useState('')
    return (
        <Dialog.Root role="alertdialog" open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger>
                <Button bg="danger.500" size="md">
                    <FaTrashCan />
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop>
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>DANGER</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Text>
                                    Deleting this resource is permanent. To confirm please type in name of this resource
                                    then hit confirm
                                </Text>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Group width="100%">
                                    <Input
                                        value={confirmText}
                                        placeholder={resourceName}
                                        onChange={value => setConfirmText(value.target.value)}
                                    ></Input>
                                    <Button
                                        onClick={() => onConfirm(resourceName)}
                                        disabled={confirmText !== resourceName}
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
