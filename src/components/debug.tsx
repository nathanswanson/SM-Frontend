import { Box, Button, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { useList } from 'react-use'
import LogView from '../features/console/components/log-terminal'

export const DebugView = ({ ...props }) => {
    if (import.meta.env.DEV) {
        const [consoleOpen, setConsoleOpen] = useState<boolean>(false)
        const [messages, { push, set }] = useList<string>([])
        const browserLog = console.log
        const browserError = console.error
        console.log = (...args: any[]) => {
            browserLog(...args)
            push(JSON.stringify(args))
        }

        console.error = (...args: any[]) => {
            browserError(...args)
            push(JSON.stringify(args))
        }

        return (
            <VStack position="fixed" bottom="1" left="1" zIndex="max" bg={'#2c292930'}>
                <Button onClick={() => setConsoleOpen(!consoleOpen)}>Toggle Console</Button>
                {consoleOpen && (
                    <Box height="400px" width="600px" overflow="scroll" {...props}>
                        <LogView messages={messages} />
                    </Box>
                )}
            </VStack>
        )
    } else {
        return null
    }
}
