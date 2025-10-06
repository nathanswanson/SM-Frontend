'use client'

import {
    Button,
    ButtonGroup,
    HStack,
    Input,
    Listbox,
    ListCollection,
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaRoot,
    useFilter,
    useListCollection
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { listTemplatesApiTemplateListGet } from '../../lib/hey-api/client'

export const TemplateViewer = ({ ...props }) => {
    const { contains } = useFilter({ sensitivity: 'base' })

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

    const { collection, filter, set } = useListCollection<string>({
        initialItems: [],
        filter: contains
    })

    useAsync(async () => {
        const response = await listTemplatesApiTemplateListGet({ credentials: 'include' })
        const data = response.data?.items
        if (data) {
            set(data)
        }
    }, [set, selectedTemplate])

    return (
        <HStack height={'100%'} {...props} alignItems="flex-start">
            <ScrollArea.Root maxW="lg">
                <Listbox.Root collection={collection}>
                    <Listbox.Input
                        as={Input}
                        placeholder="Type to search templates..."
                        onChange={e => filter(e.target.value)}
                        onSelectCapture={e => setSelectedTemplate(e.currentTarget.value)}
                    />
                    <ScrollArea.Viewport borderWidth={1} borderRadius={4}>
                        <ScrollArea.Content height="10em">
                            <Listbox.Content borderWidth={0}>
                                {collection.items.map(framework => (
                                    <Listbox.Item item={framework} key={framework}>
                                        <Listbox.ItemText>{framework}</Listbox.ItemText>
                                        <Listbox.ItemIndicator />
                                    </Listbox.Item>
                                ))}

                                <Listbox.Empty>No Templates found</Listbox.Empty>
                            </Listbox.Content>
                        </ScrollArea.Content>
                    </ScrollArea.Viewport>
                </Listbox.Root>
            </ScrollArea.Root>
            <ButtonGroup gap="2">
                <Button>New Template...</Button>
                <Button bg="danger.500">Delete</Button>
                <Button variant={'subtle'}>View Scaffold</Button>
                <Button variant={'subtle'}>Edit</Button>
            </ButtonGroup>
        </HStack>
    )
}
