'use client'

import { HStack, ScrollArea, Table, useFilter, useListCollection } from '@chakra-ui/react'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { searchTemplates } from '../../../lib/hey-api/client'

export const TemplateViewer = ({ ...props }) => {
    const { contains } = useFilter({ sensitivity: 'base' })

    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

    const { collection, filter, set } = useListCollection<string>({
        initialItems: [],
        filter: contains
    })

    useAsync(async () => {
        const response = await searchTemplates({ credentials: 'include' })
        const data = response.data?.items
        if (data) {
            set(Object.entries(data).map(([key, _]) => key))
        }
    }, [set, selectedTemplate])

    return (
        <HStack height={'100%'} {...props} alignItems="flex-start">
            <ScrollArea.Root maxW="lg">
                <ScrollArea.Viewport>
                    <ScrollArea.Content>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Product</Table.ColumnHeader>
                                    <Table.ColumnHeader>Category</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {collection.items.map((item, index) => (
                                    <Table.Row key={item}>
                                        <Table.Cell>item</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
            </ScrollArea.Root>
        </HStack>
    )
}
