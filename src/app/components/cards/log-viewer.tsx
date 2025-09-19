import { Button, Container, HStack, Input, ScrollArea, VStack } from '@chakra-ui/react'

import { useEffect, useState } from 'react'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { createHighlighter } from 'shiki'
import { purify } from '../../../utils/dom'
import { sendCommandApiContainerContainerNameCommandGet } from '../../../lib/hey-api/client'
import { VscChevronRight } from 'react-icons/vsc'
import { useWebSocketProvider } from '../../providers/web-socket'

export const LogView = () => {
    const { logMessages } = useWebSocketProvider()
    const [highlighter, setHighlighter] = useState<any>(null)

    // Initialize Shiki highlighter
    useEffect(() => {
        createHighlighter({
            themes: ['github-dark-high-contrast'], // or any theme you prefer
            langs: ['log', 'shell', 'bash', 'text']
        }).then(setHighlighter)
    }, [])

    // Listen for log messages from the server

    return (
        <ScrollArea.Root height="100%" background="#0a0c10">
            <ScrollArea.Viewport height="100%">
                <ScrollArea.Content height="100px" textStyle="sm">
                    {logMessages.map((log, idx) => (
                        <Container
                            p="0"
                            width="auto"
                            key={idx}
                            dangerouslySetInnerHTML={{
                                __html: highlighter
                                    ? highlighter.codeToHtml(log, {
                                          lang: 'log',
                                          theme: 'github-dark-high-contrast'
                                      })
                                    : purify(log) // fallback, make sure to sanitize
                            }}
                        />
                    ))}
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>

            <ScrollArea.Corner />
        </ScrollArea.Root>
    )
}

export const LogManager = () => {
    const [commandText, setCommandText] = useState('')
    const { selectedServer } = useSelectedServerContext()

    function submit_command(container: string | undefined, command: string) {
        if (container) {
            sendCommandApiContainerContainerNameCommandGet({
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
            {LogView()}
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
                    color="white"
                    bg="blue.700"
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
