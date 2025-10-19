import { Button, HStack, Input, VStack } from '@chakra-ui/react'

import React, { useState } from 'react'
import { VscChevronRight } from 'react-icons/vsc'
import { sendCommand } from '../../../lib/hey-api/client'
import { DisabledModule } from '../../components/disabled-module'
import { useSelectedServerContext } from '../../providers/selected-server-context'

const LazyLogView = React.lazy(() => import('./components/log-terminal'))

export const LogManager = ({ ...props }) => {
    const [commandText, setCommandText] = useState('')
    const { serverInfo } = useSelectedServerContext()

    function submit_command(command: string) {
        if (serverInfo) {
            sendCommand({
                credentials: 'include',
                path: {
                    server_id: serverInfo?.id ?? -1
                },
                query: {
                    command: command
                }
            })
        }
    }

    return (
        <VStack flexGrow={1} h="100%" maxW="100%" width="700px" {...props}>
            {!serverInfo ? <DisabledModule requester="logs" /> : <LazyLogView></LazyLogView>}
            <HStack width="100%">
                <Input
                    width="100%"
                    onKeyDown={value => {
                        if (value.key == 'Enter') {
                            submit_command(commandText)
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
                        submit_command(commandText)
                        setCommandText('')
                    }}
                >
                    <VscChevronRight />
                </Button>
            </HStack>
        </VStack>
    )
}
