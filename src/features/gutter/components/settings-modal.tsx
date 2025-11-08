import { Button, Dialog, Portal, Text } from '@chakra-ui/react'
import { Settings } from 'lucide-react'
import { MenuSelectButton } from '../../../components/menu-select-button'

export const SettingsModal = ({}) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <MenuSelectButton color="fg.muted">
                    <Settings />
                    Settings
                </MenuSelectButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>Settings</Dialog.Header>
                        <Dialog.Body>
                            <Text>Manage your account settings. This is not implemented yet</Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button variant="outline">Cancel</Button>
                            <Button colorScheme="blue">Save</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
