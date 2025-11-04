import { CloseButton, createOverlay, Dialog, Portal, ScrollArea } from '@chakra-ui/react'
import { ElementType, ReactNode } from 'react'

interface DialogProps {
    title: string
    content: ReactNode
    footer: ReactNode
    asElement?: ElementType
}

//<dialog.Viewport/>
const dialog = createOverlay<DialogProps>(props => {
    const { title, footer, content, asElement, ...rest } = props
    return (
        <Dialog.Root {...rest}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content as={asElement}>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <ScrollArea.Root>
                            <ScrollArea.Viewport>
                                <ScrollArea.Content>
                                    <Dialog.Body spaceY="4">{content}</Dialog.Body>
                                </ScrollArea.Content>
                            </ScrollArea.Viewport>
                        </ScrollArea.Root>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
})
