import { Dialog } from '@chakra-ui/react'
import React from 'react'

interface ConfirmationPromptProps {
    message: string
    on_confirm: () => void
    on_cancel: () => void
    children: React.ReactNode
}

export const ConfirmationPrompt = ({ on_confirm, on_cancel, children, ...props }: ConfirmationPromptProps) => {
    let bodyChildren = null
    let bodyTrigger = null

    React.Children.forEach(children, child => {
        if (React.isValidElement(child)) {
            const element = child as React.ReactElement<{ message?: string; children?: React.ReactNode }>
            if (element.type === Body) {
                bodyChildren = element.props.message
            } else if (element.type === Trigger) {
                bodyTrigger = element.props.children
            }
        }
    })

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>{bodyTrigger}</Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Confirm Action</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>{bodyChildren}</Dialog.Body>
                <Dialog.Footer>
                    <button onClick={on_cancel}>Cancel</button>
                    <button onClick={on_confirm}>Confirm</button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    )
}

const Trigger = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

const Body = ({ message }: { message: string }) => {
    return <p>{message}</p>
}

ConfirmationPrompt.Trigger = Trigger
ConfirmationPrompt.Body = Body

export default ConfirmationPrompt
