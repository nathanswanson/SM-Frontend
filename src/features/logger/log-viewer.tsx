import { Box, Button, HStack, Input, VStack } from '@chakra-ui/react'

import { useSelectedServerContext } from '../../providers/selected-server-context'
import { sendCommandApiContainerContainerNameCommandGet } from '../../lib/hey-api/client'
import { VscChevronRight } from 'react-icons/vsc'
import React, { useState } from 'react'
import { DisabledModule } from '../../components/disabled-module'

const LazyLogView = React.lazy(() => import('./components/log-terminal'))

export const LogManager = ({ ...props }) => {
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
        <VStack h="100%" {...props}>
            {!selectedServer ? <DisabledModule requester="logs" /> : <LazyLogView></LazyLogView>}
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
