import { Box, Button, HStack, Input, VStack } from '@chakra-ui/react'

import { useSelectedServerContext } from '../../providers/selected-server-context'
import { sendCommandApiContainerContainerNameCommandGet } from '../../../lib/hey-api/client'
import { VscChevronRight } from 'react-icons/vsc'
import React, { useState } from 'react'

const LazyLogView = React.lazy(() => import('../log-terminal'))

export const LogManager = () => {
    const [commandText, setCommandText] = useState('')
    const { selectedServer } = useSelectedServerContext()

    function submit_command(container: string | undefined, command: string) {
        if (container) {
            sendCommandApiContainerContainerNameCommandGet({
                credentials: 'include',
                path: {
                    container_name: container
                },
                query: {
                    command: command
                }
            })
        }
    }

    return (
        <VStack h="100%">
            {!selectedServer ? (
                <Box width="100%" bg="bg.muted">
                    Select online server to view logs
                </Box>
            ) : (
                <LazyLogView></LazyLogView>
            )}
            <HStack width="100%">
                <Input
                    width="100%"
                    onKeyDown={value => {
                        if (value.key == 'Enter') {
                            submit_command(selectedServer, commandText)
                            setCommandText('')
                        }
                    }}
                    value={commandText}
                    onChange={event => {
                        setCommandText(event.target.value)
                    }}
                ></Input>
                <Button
                    size="sm"
                    colorPalette={'brand'}
                    onClick={() => {
                        submit_command(selectedServer, commandText)
                        setCommandText('')
                    }}
                >
                    <VscChevronRight />
                </Button>
            </HStack>
        </VStack>
    )
}
