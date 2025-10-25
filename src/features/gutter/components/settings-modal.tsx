import { Button, Dialog, Portal, Text } from '@chakra-ui/react'
import { LuSettings } from 'react-icons/lu'
import { MenuSelectButton } from '../../../mocks/menu-select-button'

export const SettingsModal = ({}) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <MenuSelectButton color="fg.muted">
                    <LuSettings />
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
