import { Button } from '@chakra-ui/react/button'
import { Dialog } from '@chakra-ui/react/dialog'
import { Group } from '@chakra-ui/react/group'
import { Input } from '@chakra-ui/react/input'
import { Portal } from '@chakra-ui/react/portal'
import { Text } from '@chakra-ui/react/text'
import { useState } from 'react'
import { LuTable2 } from 'react-icons/lu'

export const DangerConfirmation = ({
    onConfirm,
    resourceName
}: {
    onConfirm: (resourceName: string) => void
    resourceName: string
}) => {
    const [confirmText, setConfirmText] = useState('')
    const [open, setOpen] = useState(false)
    const handleClose = () => {
        setConfirmText('')
        if (onConfirm) onConfirm(resourceName)
        setOpen(false)
    }

    return (
        <Dialog.Root role="alertdialog" open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger>
                <Button asChild bg="danger.500" size="md">
                    <LuTable2 />
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
                                    <Button onClick={handleClose} disabled={confirmText !== resourceName}>
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
