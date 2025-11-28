// ignore-file-checks
import { Button, HStack, Input, VStack } from '@chakra-ui/react'

import { ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useSubscription } from 'urql'
import { sendCommand } from '../../../lib/hey-api/client'
import { DisabledModule } from '../../components/disabled-module'
import { useSelectedServerContext } from '../../providers/selected-server-context'

const LazyLogView = React.lazy(() => import('./components/log-terminal'))

const subscribe = (name: string) => {
    return `
    subscription logs {
        getLogs(containerName: "${name}")
    }
`
}

const handleSubscription = (_previous: any, response: any) => {
    return response.getLogs
}

// Cap logs at a reasonable size (e.g., 1000 messages)
const cap50 = <T,>(arr: T[], next: T): T[] => [...arr, next].slice(-50)

export const LogManager = ({ ...props }) => {
    const [commandText, setCommandText] = useState('')
    const { serverInfo } = useSelectedServerContext()
    const [logMessages, setLogMessages] = useState<string[]>([])

    const [res] = useSubscription(
        {
            query: subscribe(serverInfo?.container_name ?? ''),
            pause: !serverInfo?.container_name
        },
        handleSubscription
    )

    useEffectOnce(() => {
        const cached_command = window.localStorage.getItem('console_command')
        setCommandText(cached_command ?? '')
    })

    useEffect(() => {
        if (res && res.data) {
            setLogMessages(prev => cap50(prev, res.data))
        }
    }, [res])

    useEffect(() => {
        setLogMessages([])
    }, [serverInfo])

    function submit_command(command: string) {
        if (serverInfo) {
            sendCommand({
                path: {
                    server_id: serverInfo.id
                },
                query: {
                    command: command
                }
            })
        }
    }

    return (
        <VStack flexGrow={1} h="100%" width="100%" {...props}>
            {!serverInfo ? <DisabledModule requester="logs" /> : <LazyLogView messages={logMessages} />}
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
                        window.localStorage.setItem('console_command', event.target.value)
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
                    <ChevronRight />
                </Button>
            </HStack>
        </VStack>
    )
}
