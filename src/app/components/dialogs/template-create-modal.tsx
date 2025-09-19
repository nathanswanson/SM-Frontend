import {
    Button,
    CloseButton,
    Collapsible,
    Dialog,
    Fieldset,
    Link,
    Portal
} from '@chakra-ui/react'
import { FormField } from '../../../utils/util'
import { useState } from 'react'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { addTemplateApiTemplateCreatePost } from '../../../lib/hey-api/client'
import { useLoginProvider } from '../../providers/login-provider-context'
export const TemplateCreateDialog = () => {
    const [template_name, setTemplateName] = useState('')
    const [template_image, setTemplateImage] = useState('')
    const [template_port, setTemplatePort] = useState('')
    const [, setTemplateCpu] = useState('2')
    const [, setTemplateMemory] = useState('4G')

    const { selectedServer } = useSelectedServerContext()
    const { cookie } = useLoginProvider()
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button
                    variant="plain"
                    unstyled
                    justifyContent="flex-start"
                    textAlign="left"
                >
                    New Template...
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>Create New Template</Dialog.Header>
                        <Dialog.Body>
                            <Fieldset.Root>
                                {FormField(
                                    'Template Name',
                                    'e.g. Minecraft, Valheim, Minecraft-Bedrock',
                                    [template_name, setTemplateName]
                                )}
                                {FormField(
                                    'Image',
                                    'itzg/minecraft-server',
                                    [template_image, setTemplateImage],
                                    <>
                                        Docker image used to create the server.
                                        Find one{' '}
                                        <Link
                                            href="https://hub.docker.com/"
                                            target="_blank"
                                        >
                                            Here
                                        </Link>
                                        .
                                    </>
                                )}
                                {FormField('Port', 'random', [
                                    template_port,
                                    setTemplatePort
                                ])}

                                <Collapsible.Root>
                                    <Collapsible.Trigger>
                                        Resource Options - Advanced
                                    </Collapsible.Trigger>
                                    <Collapsible.Content>
                                        {FormField('CPU Cores', '2', [
                                            selectedServer ?? '',
                                            setTemplateCpu
                                        ])}
                                        {FormField('Memory', '4G', [
                                            selectedServer ?? '',
                                            setTemplateMemory
                                        ])}
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            </Fieldset.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                onClick={() =>
                                    addTemplateApiTemplateCreatePost({
                                        auth: cookie['token'],
                                        body: {
                                            name: template_name,
                                            image: template_image,
                                            tags: null,
                                            default_env: null,
                                            additional_env: null,
                                            resource_min_cpu: null,
                                            resource_min_disk: null,
                                            resource_min_mem: null
                                        }
                                    })
                                }
                            >
                                Create
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
