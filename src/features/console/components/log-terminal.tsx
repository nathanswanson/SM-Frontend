import { Container, ScrollArea } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import useAsync from 'react-use/lib/useAsync'
import { createHighlighterCore, createJavaScriptRegexEngine } from 'shiki'

// theme
import githubLight from '@shikijs/themes/github-light'
import { purify } from '../../../utils/dom'
interface LogTerminalProps {
    messages: string[]
}

const LogView = ({ messages }: LogTerminalProps) => {
    const [highlighter, setHighlighter] = useState<any>(null)
    const viewportRef = useRef<HTMLDivElement>(null)

    // Initialize Shiki highlighter
    useAsync(async () => {
        createHighlighterCore({
            themes: [githubLight], // or any theme you prefer
            langs: [import('@shikijs/langs/log')],
            engine: createJavaScriptRegexEngine()
        }).then(setHighlighter)
    }, [])

    // Listen for log messages from the server
    useEffect(() => {
        const viewport = viewportRef.current
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight
        }
    }, [messages])
    return (
        <ScrollArea.Root borderWidth={1}>
            <ScrollArea.Viewport scrollBehavior={'smooth'} ref={viewportRef}>
                <ScrollArea.Content textStyle="sm">
                    {messages.map((log, idx) => (
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
