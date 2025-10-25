import { Button, CloseButton, Dialog, Fieldset, Portal, ScrollArea, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { createContext, useState } from 'react'
import { Control, SubmitErrorHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { toaster } from '../../lib/chakra/toaster'
import { prettyErrorMessages } from '../utils/util'

interface FormControllerProps {
    children: React.ReactNode
    schema?: any //zod
}

interface FormDataProps {
    control: Control
}

export const FormController = ({ children, schema }: FormControllerProps) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

    type FormData = z.input<typeof schema>
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    let trigger: React.ReactNode = null
    let header: React.ReactNode = null

    for (const child of React.Children.toArray(children)) {
        if (React.isValidElement(child)) {
            const element = child as React.ReactElement<any>
            if (element.type === FormController.Trigger) {
                trigger = element.props.children
            } else if (element.type === FormController.Header) {
                header = element.props.children
            }
        }
    }

    const formDataContext = createContext<FormControllerProps>

    const onError: SubmitErrorHandler<FormData> = errors => {
        const prettyErrors = prettyErrorMessages(errors)
        setErrorMessage(prettyErrors)
        toaster.error({ title: 'Failed to create template ', description: 'See Errors at top of form.' })
    }

    return (
        <Dialog.Root>
            {/* Render extracted trigger so the dialog can be opened */}
            {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content as="form" onSubmit={handleSubmit(onSubmit, onError)}>
                        <Dialog.Header>
                            {/* Render extracted header inside the dialog header */}
                            {header && <Dialog.Title>{header}</Dialog.Title>}
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                            <ScrollArea.Root>
                                <ScrollArea.Viewport>
                                    <ScrollArea.Content>
                                        {/* error messages */}
                                        <Text color="fg.error"></Text>
                                        {/* form fields */}
                                        <Fieldset.Root
                                            display={'grid'}
                                            gridTemplateColumns={'1fr 1fr 1fr'}
                                            gap="4"
                                        ></Fieldset.Root>
                                    </ScrollArea.Content>
                                </ScrollArea.Viewport>
                            </ScrollArea.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant={'outline'}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button>Submit</Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

const Trigger = ({ children }: { children: React.ReactNode }) => {
    return <Dialog.Trigger>{children}</Dialog.Trigger>
}

const Header = ({ children }: { children: React.ReactNode }) => {
    return <Dialog.Title>{children}</Dialog.Title>
}

FormController.Trigger = Trigger
FormController.Header = Header
