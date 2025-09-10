'use client'

import {
    Box,
    Button,
    Center,
    Combobox,
    HStack,
    Menu,
    Portal,
    Span,
    Spinner,
    Status,
    useListCollection
} from '@chakra-ui/react'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useAsync } from 'react-use'
import { listContainersApiContainerListGet } from '../../client'
import { FaGrav } from 'react-icons/fa6'
import { DialogBasic } from './dialogs/server-create-modal'
import { TemplateCreateDialog } from './dialogs/template-create-modal'
import { useSelectedServerContext } from '../../selected-server-context'

export const NavBar = ({ ...props }) => {
    return (
        <Box {...props}>
            <HStack>
                {/* icon left */}
                <Box>
                    <FaGrav />
                </Box>
                {/* search-bar center */}
                <Center>
                    <SearchComboBox />
                </Center>
                {/* create new button right */}
                <CreateNewMenu />
            </HStack>
        </Box>
    )
}

const CreateNewMenu = () => {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button>Create New</Button>
            </Menu.Trigger>
            <Menu.Positioner>
                <Menu.Content>
                    <Menu.Item closeOnSelect={false} value="Server">
                        <DialogBasic />
                    </Menu.Item>
                    <Menu.Item closeOnSelect={false} value="Template">
                        <TemplateCreateDialog />
                    </Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    )
}

export const SearchComboBox = () => {
    const { selectedServer, setSelectedServer } = useSelectedServerContext()

    const { collection, set } = useListCollection<string>({
        initialItems: []
    })

    const state = useAsync(async () => {
        const container_list = await listContainersApiContainerListGet()
        set(container_list.data?.values ?? [''])
    }, [selectedServer, set])

    return (
        <Combobox.Root
            width="320px"
            collection={collection}
            placeholder="Search characters..."
            onInputValueChange={e => setSelectedServer(e.inputValue)}
            positioning={{ sameWidth: false, placement: 'bottom-start' }}
        >
            <Combobox.Control>
                <Combobox.Input placeholder="Type to search" />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content minW="sm">
                        {state.loading ? (
                            <HStack p="4">
                                <Spinner size="xs" borderWidth="1px" />
                                <Span>Loading...</Span>
                            </HStack>
                        ) : state.error ? (
                            <Span p="4" color="fg.error">
                                Error fetching
                            </Span>
                        ) : (
                            collection.items?.map(container => (
                                <Combobox.Item key={container} item={container}>
                                    <HStack
                                        display="flex"
                                        justify="space-between"
                                        textStyle="sm"
                                    >
                                        <Status.Root>
                                            <Status.Indicator />
                                        </Status.Root>
                                        <Span fontWeight="medium" truncate>
                                            {container}
                                        </Span>
                                    </HStack>
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            ))
                        )}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    )
}
