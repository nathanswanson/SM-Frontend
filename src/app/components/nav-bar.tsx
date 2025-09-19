'use client'

import {
    Combobox,
    HStack,
    Portal,
    Span,
    Spinner,
    Status,
    useListCollection
} from '@chakra-ui/react'
import { useAsync } from 'react-use'
import { listContainersApiContainerListGet } from '../../lib/hey-api/client'
import { useSelectedServerContext } from '../../app/providers/selected-server-context'
import { useLoginProvider } from '../providers/login-provider-context'

export const NavBar = ({ ...props }) => {
    return (
        <HStack width="100%" {...props} as="nav" paddingY="3">
            {/* search-bar center */}
            <SearchComboBox />
            {/* create new button right */}
        </HStack>
    )
}

export const SearchComboBox = () => {
    const { selectedServer, setSelectedServer } = useSelectedServerContext()
    const { cookie } = useLoginProvider()

    const { collection, set } = useListCollection<string>({
        initialItems: []
    })

    const state = useAsync(async () => {
        const container_list = await listContainersApiContainerListGet({
            auth: cookie['token']
        })
        set(container_list.data?.values ?? [''])
    }, [selectedServer, set])

    return (
        <Combobox.Root
            width="30%"
            size="lg"
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
