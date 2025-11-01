'use client'

import { Combobox, createListCollection, HStack, Portal, Span, Spinner } from '@chakra-ui/react'
import { useAsync } from 'react-use'

import { useState } from 'react'
import { searchServers } from '../../../lib/hey-api/client'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { useWindowContext } from '../../providers/window-context'

export const NavBar = ({ ...props }) => {
    return (
        <HStack zIndex={'sticky'} position="sticky" top="0" {...props} paddingY="3">
            {/* search-bar center */}
            <SearchComboBox />
        </HStack>
    )
}

const SearchComboBox = () => {
    const { setSelectedServer, serverInfo } = useSelectedServerContext()
    const { scrollPosition } = useWindowContext()
    const [openState, setOpenState] = useState<Boolean>(false)
    const [serverList, setServerList] = useState<{ [key: string]: number }>({})

    const serverCollection = createListCollection({
        items: Object.keys(serverList)
    })

    const state = useAsync(async () => {
        const container_list = await searchServers({ credentials: 'include' })
        if (container_list.data?.items) {
            setServerList(container_list.data?.items || {})
        }
    }, [serverInfo])

    return (
        <Combobox.Root
            width="50%"
            minWidth="300px"
            size="lg"
            shadow="sm"
            bg={scrollPosition.y == 0 ? 'bg.panel' : 'bg.panel'}
            transitionDuration={'0.3ms'}
            borderRadius={'sm'}
            collection={serverCollection}
            placeholder="Search characters..."
            onInputValueChange={e => {
                setSelectedServer(serverList[e.inputValue])
            }}
            positioning={{ sameWidth: false, placement: 'bottom-start' }}
            onOpenChange={value => {
                if (value.open) setOpenState(prev => !prev)
            }}
        >
            <Combobox.Control>
                <Combobox.Input borderWidth={0} placeholder="Select Server..." />
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
                            serverCollection.items?.map(container => (
                                <Combobox.Item key={container} item={container}>
                                    <HStack display="flex" justify="space-between" textStyle="sm">
                                        <Span fontWeight="medium" truncate>
                                            {container}
                                        </Span>
                                    </HStack>
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            ))
                        )}
                        <Combobox.Empty>No Servers found</Combobox.Empty>
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    )
}
