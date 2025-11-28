import { CloseButton, Dialog, IconButton, Portal, Text } from '@chakra-ui/react'
import { ExpandIcon } from 'lucide-react'

export interface ExpandModeDialogProps {
    label?: string
    children?: React.ReactNode
    disabled?: boolean | undefined
}

export const ExpandModeDialog = ({ children, label, disabled, ...props }: ExpandModeDialogProps) => {
    return (
        <Dialog.Root size="xl">
            <Dialog.Trigger asChild>
                <IconButton disabled={disabled} variant={'ghost'}>
                    <ExpandIcon />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content {...props} width={'100%'}>
                        {label ? (
                            <Dialog.Header>
                                <Text>{label}</Text>
                            </Dialog.Header>
                        ) : null}
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                        <Dialog.Body>{children}</Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
