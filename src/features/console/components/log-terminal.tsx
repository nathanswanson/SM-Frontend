import { Container, ScrollArea } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { createHighlighterCore, createJavaScriptRegexEngine, type HighlighterCore } from 'shiki'

// theme
import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'
import { purify } from '../../../utils/dom'

interface LogTerminalProps {
    messages: string[]
    height?: string | number
}

// Cache the highlighter promise globally, but only create it when first needed
let cachedHighlighterPromise: Promise<HighlighterCore> | null = null

const LogView = ({ messages, height }: LogTerminalProps & { height?: string | number }) => {
    const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null)
    const viewportRef = useRef<HTMLDivElement>(null)

    // Initialize Shiki highlighter (only creates once across all instances)
    useEffect(() => {
        let mounted = true

        if (!cachedHighlighterPromise) {
            cachedHighlighterPromise = createHighlighterCore({
                themes: [githubLight, githubDark],
                langs: [import('@shikijs/langs/log')],
                engine: createJavaScriptRegexEngine()
            })
        }

        cachedHighlighterPromise.then(h => {
            if (mounted) {
                setHighlighter(h)
            }
        })

        return () => {
            mounted = false
        }
    }, [])

    // Listen for log messages from the server
    useEffect(() => {
        const viewport = viewportRef.current
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight
        }
    }, [messages])

    return (
        <ScrollArea.Root ref={viewportRef}>
            <ScrollArea.Viewport ref={viewportRef}>
                <ScrollArea.Content height={'0px'}>
                    {messages.map((log, idx) => (
                        <Container
                            p={0}
                            m={0}
                            maxWidth={'670px'}
                            key={idx}
                            dangerouslySetInnerHTML={{
                                __html: highlighter
                                    ? highlighter.codeToHtml(log, {
                                          lang: 'log',
                                          theme: 'github-light'
                                      })
                                    : purify(log)
                            }}
                        />
                    ))}
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar orientation="horizontal">
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>

            <ScrollArea.Corner />
        </ScrollArea.Root>
    )
}

export default LogView
