import {
    Box,
    Button,
    Container,
    HStack,
    IconButton,
    Input,
    ScrollArea,
    VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSelectedServerContext } from '../../../selected-server-context'
import { createHighlighter } from 'shiki'
import { useStickToBottom } from 'use-stick-to-bottom'
import { LuArrowDown } from 'react-icons/lu'
import { purify } from '../util/dom'
import { sendCommandApiContainerContainerNameCommandGet } from '../../../client'
import { VscChevronRight } from 'react-icons/vsc'

const line_count = 30

export const LogView = () => {
    const { selectedServer } = useSelectedServerContext()
    const [logs, setLogs] = useState<string[]>([])
    const stickToBottom = useStickToBottom()

    const [highlighter, setHighlighter] = useState<any>(null)

    // Initialize Shiki highlighter
    useEffect(() => {
        createHighlighter({
            themes: ['vitesse-black'], // or any theme you prefer
            langs: ['log', 'shell', 'bash', 'text']
        }).then(setHighlighter)
    }, [])

    // Listen for log messages from the server
    useEffect(() => {
        if (!selectedServer) return

        const logMessage = new EventSource(
            `http://raspberrypi.home:8000/api/container/${selectedServer}/logs?line_count=${line_count}`
        )
        logMessage.onmessage = event => {
            setLogs(prev => {
                const updatedLogs = [...prev, event.data]
                // clamp
                if (updatedLogs.length > line_count) {
                    return updatedLogs.slice(-line_count)
                }
                return updatedLogs
            })
        }

        logMessage.onerror = error => {
            console.error('EventSource failed:', error)
            logMessage.close()
        }

        return () => {
            setLogs([])
            logMessage.close()
        }
    }, [selectedServer])

    return (
        <ScrollArea.Root height="100%" background="black">
            <ScrollArea.Viewport height="100%" ref={stickToBottom.scrollRef}>
                <ScrollArea.Content
                    ref={stickToBottom.contentRef}
                    w="100px"
                    height="100px"
                    textStyle="sm"
                >
                    {logs.map((log, idx) => (
                        <Container
                            p="0"
                            width="100px"
                            key={idx}
                            dangerouslySetInnerHTML={{
                                __html: highlighter
                                    ? highlighter.codeToHtml(log, {
                                          lang: 'log',
                                          theme: 'vitesse-black'
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
            {!stickToBottom.isAtBottom && (
                <Box position="absolute" bottom="4" right="4" zIndex="10">
                    <IconButton
                        size="sm"
                        onClick={() => {
                            stickToBottom.scrollToBottom()
                        }}
                        colorScheme="blue"
                        variant="solid"
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )}
            <ScrollArea.Corner />
        </ScrollArea.Root>
    )
}

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

export const LogManager = () => {
    const [commandText, setCommandText] = useState('')
    const { selectedServer } = useSelectedServerContext()
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
