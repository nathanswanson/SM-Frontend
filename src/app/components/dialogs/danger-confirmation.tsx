import { VscTrash } from 'react-icons/vsc'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import {
    Button,
    CloseButton,
    Dialog,
    Group,
    Input,
    Portal,
    Text
} from '@chakra-ui/react'
import { useState } from 'react'
import { deleteContainerApiContainerContainerNameDeleteGet } from '../../../lib/hey-api/client'

export const DangerConfirmation = (props: any) => {
    const { selectedServer, setSelectedServer } = useSelectedServerContext()
    const [confirmText, setConfirmText] = useState('')
    return (
        <Dialog.Root role="alertdialog">
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
                                    Deleting a server is permanent. To confirm
                                    please type in name of server then hit
                                    confirm
                                </Text>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Group>
                                    <Input
                                        value={confirmText}
                                        placeholder={selectedServer}
                                        onChange={value =>
                                            setConfirmText(value.target.value)
                                        }
                                    ></Input>
                                    <Dialog.ActionTrigger></Dialog.ActionTrigger>
                                </Group>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Backdrop>
            </Portal>
        </Dialog.Root>
    )
}
