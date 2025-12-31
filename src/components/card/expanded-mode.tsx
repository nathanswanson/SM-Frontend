import { CloseButton, Dialog, IconButton, Portal, Text } from '@chakra-ui/react'
import { ExpandIcon } from 'lucide-react'
import React from 'react'

export interface ExpandModeDialogProps {
    label?: string
    children?: React.ReactNode
    disabled?: boolean | undefined
}

export const ExpandModeDialog = ({ children, label, disabled, ...props }: ExpandModeDialogProps) => {
    return (
        <Dialog.Root size="cover" placement="center" motionPreset="slide-in-bottom">
            <Dialog.Trigger asChild>
                <IconButton disabled={disabled} variant={'ghost'} size="sm">
                    <ExpandIcon />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner padding={6}>
                    <Dialog.Content {...props} width="100%" height="100%" display="flex" flexDirection="column">
                        <Dialog.Header flexShrink={0} borderBottomWidth="1px">
                            <Dialog.Title>{label}</Dialog.Title>
                            <Dialog.CloseTrigger asChild position="absolute" top={3} right={3}>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body
                            flex={1}
                            minHeight={0}
                            display="flex"
                            flexDirection="column"
                            overflow="hidden"
                            p={4}
                        >
                            {React.Children.map(children, child => {
                                if (React.isValidElement(child)) {
                                    return React.cloneElement(child as React.ReactElement<any>, {
                                        height: '100%'
                                    })
                                }
                                return child
                            })}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
