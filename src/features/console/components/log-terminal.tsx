import { ScrollArea, Container } from '@chakra-ui/react'
import { createHighlighterCore, createJavaScriptRegexEngine } from 'shiki'
import useAsync from 'react-use/lib/useAsync'
import { useState } from 'react'

// theme
import githubLight from '@shikijs/themes/github-light'
import { useWebSocketProvider } from '../../../providers/web-socket'
import { purify } from '../../../utils/dom'

const LogView = () => {
    // const { logMessages } = useWebSocketProvider()
    const [highlighter, setHighlighter] = useState<any>(null)
    const { logMessages } = useWebSocketProvider()
    // Initialize Shiki highlighter
    useAsync(async () => {
        createHighlighterCore({
            themes: [githubLight], // or any theme you prefer
            langs: [import('@shikijs/langs/log')],
            engine: createJavaScriptRegexEngine()
        }).then(setHighlighter)
    }, [])

    // Listen for log messages from the server

    return (
        <ScrollArea.Root>
            <ScrollArea.Viewport>
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
                                          theme: 'github-light'
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

export default LogView
