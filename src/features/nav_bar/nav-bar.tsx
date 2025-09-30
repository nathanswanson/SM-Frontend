'use client'

import { Combobox, HStack, Portal, Span, Spinner, Status, useListCollection } from '@chakra-ui/react'
import { useAsync } from 'react-use'

import { useState } from 'react'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { listContainersApiContainerListGet } from '../../lib/hey-api/client/sdk.gen'

export const NavBar = ({ ...props }) => {
    return (
        <HStack width="100%" {...props} as="nav" paddingY="3">
            {/* search-bar center */}
            <SearchComboBox />
        </HStack>
    )
}

const SearchComboBox = () => {
    const { selectedServer, setSelectedServer } = useSelectedServerContext()

    const [openState, setOpenState] = useState<Boolean>(false)
    const { collection: serverList, set: setServerList } = useListCollection<string>({
        initialItems: []
    })

    const state = useAsync(async () => {
        const container_list = await listContainersApiContainerListGet({ credentials: 'include' })
        setServerList(container_list.data?.items ?? [''])
    }, [selectedServer, openState])

    return (
        <Combobox.Root
            borderWidth={0}
            width="50%"
            minWidth="300px"
            size="lg"
            shadow="sm"
            borderRadius={'sm'}
            collection={serverList}
            placeholder="Search characters..."
            onInputValueChange={e => setSelectedServer(e.inputValue)}
            positioning={{ sameWidth: false, placement: 'bottom-start' }}
            onOpenChange={value => {
                if (value.open) setOpenState(prev => !prev)
            }}
            bg="bg.panel"
        >
            <Combobox.Control>
                <Combobox.Input borderWidth={0} placeholder="Type to search" />
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
                                <Spinner size="xs" />
                                <Span>Loading...</Span>
                            </HStack>
                        ) : state.error ? (
                            <Span p="4" color="fg.error">
                                Error fetching
                            </Span>
                        ) : (
                            serverList.items?.map(container => (
                                <Combobox.Item key={container} item={container}>
                                    <HStack display="flex" justify="space-between" textStyle="sm">
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
