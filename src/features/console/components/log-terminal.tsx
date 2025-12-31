import { Box, ScrollArea } from '@chakra-ui/react'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createHighlighterCore, createJavaScriptRegexEngine, type HighlighterCore } from 'shiki'
import { purify } from '../../../utils/dom'

interface LogTerminalProps {
    messages: string[]
    height?: string | number
}

// Cache the highlighter promise globally, but only create it when first needed
let cachedHighlighterPromise: Promise<HighlighterCore> | null = null

// Cache for highlighted HTML to prevent re-processing
const highlightCache = new Map<string, string>()

// Global incrementing ID for each log line instance
let globalLogId = 0

// Memoized log line component to prevent unnecessary re-renders
const LogLine = memo(({ html }: { html: string }) => (
    <Box p={0} m={0} maxWidth={'670px'} css={{ contain: 'layout style' }} dangerouslySetInnerHTML={{ __html: html }} />
))

LogLine.displayName = 'LogLine'

interface LogEntry {
    id: number
    message: string
    html: string
}

const LogView = ({ messages, height }: LogTerminalProps & { height?: string | number }) => {
    const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const logEntriesRef = useRef<LogEntry[]>([])
    const prevMessagesLengthRef = useRef(0)
    const isAtBottomRef = useRef(true)

    // Track if user is at bottom of scroll
    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = viewport
            // Consider "at bottom" if within 20px of the bottom
            isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 20
        }

        viewport.addEventListener('scroll', handleScroll)
        return () => viewport.removeEventListener('scroll', handleScroll)
    }, [])

    // Initialize Shiki highlighter (only creates once across all instances)
    useEffect(() => {
        let mounted = true

        if (!cachedHighlighterPromise) {
            cachedHighlighterPromise = createHighlighterCore({
                themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
                langs: [import('shiki/langs/log.mjs')],
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

    // Scroll to bottom when messages change, only if already at bottom
    useLayoutEffect(() => {
        const viewport = viewportRef.current
        if (viewport && isAtBottomRef.current) {
            viewport.scrollTop = viewport.scrollHeight
        }
    }, [messages])

    // Build log entries with stable IDs - only process new messages
    const logEntries = useMemo(() => {
        const prevLength = prevMessagesLengthRef.current
        const currentLength = messages.length

        // If array was reset/cleared or shrunk more than expected, rebuild
        if (currentLength < prevLength - 1 || currentLength === 0) {
            logEntriesRef.current = []
            prevMessagesLengthRef.current = 0
        }

        // Calculate how many items were removed from the front
        const removedCount = Math.max(0, prevLength - currentLength + 1)
        if (removedCount > 0 && logEntriesRef.current.length > 0) {
            logEntriesRef.current = logEntriesRef.current.slice(removedCount)
        }

        // Add new messages (typically just one)
        const existingCount = logEntriesRef.current.length
        for (let i = existingCount; i < currentLength; i++) {
            const message = messages[i]
            const cached = highlightCache.get(message)
            const html =
                cached ??
                (highlighter
                    ? highlighter.codeToHtml(message, { lang: 'log', theme: 'github-light' })
                    : purify(message))

            if (!cached) highlightCache.set(message, html)

            logEntriesRef.current.push({
                id: globalLogId++,
                message,
                html
            })
        }

        prevMessagesLengthRef.current = currentLength
        return [...logEntriesRef.current]
    }, [messages, highlighter])

    return (
        <ScrollArea.Root height={height ?? '100%'}>
            <ScrollArea.Viewport ref={viewportRef}>
                {logEntries.map(({ id, html }) => (
                    <LogLine key={id} html={html} />
                ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>

            <ScrollArea.Corner />
        </ScrollArea.Root>
    )
}

export default LogView
