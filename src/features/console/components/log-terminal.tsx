import { Container, ScrollArea } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { createHighlighterCore, createJavaScriptRegexEngine, type HighlighterCore } from 'shiki'

// theme
import githubLight from '@shikijs/themes/github-light'
import { purify } from '../../../utils/dom'

interface LogTerminalProps {
    messages: string[]
}

// Cache the highlighter promise globally, but only create it when first needed
let cachedHighlighterPromise: Promise<HighlighterCore> | null = null

const LogView = ({ messages }: LogTerminalProps) => {
    const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null)
    const viewportRef = useRef<HTMLDivElement>(null)

    // Initialize Shiki highlighter (only creates once across all instances)
    useEffect(() => {
        let mounted = true

        if (!cachedHighlighterPromise) {
            cachedHighlighterPromise = createHighlighterCore({
                themes: [githubLight],
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
                                    : purify(log)
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
