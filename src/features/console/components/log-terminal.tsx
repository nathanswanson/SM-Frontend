import { ScrollArea, Container } from '@chakra-ui/react'
import { createHighlighterCore, createJavaScriptRegexEngine } from 'shiki'
import useAsync from 'react-use/lib/useAsync'
import { useState } from 'react'

const temp_logs = `[00:24:29] [Server thread/INFO]: /weather (clear|rain|thunder)
[00:24:29] [Server thread/INFO]: /worldborder (add|set|center|damage|get|warning)
[00:24:29] [Server thread/INFO]: /jfr (start|stop)
[00:24:29] [Server thread/INFO]: /ban-ip <target> [<reason>]
[00:24:29] [Server thread/INFO]: /banlist [ips|players]
[00:24:29] [Server thread/INFO]: /ban <targets> [<reason>]
[00:24:29] [Server thread/INFO]: /deop <targets>
[00:24:29] [Server thread/INFO]: /op <targets>
[00:24:29] [Server thread/INFO]: /pardon <targets>
[00:24:29] [Server thread/INFO]: /pardon-ip <target>
[00:24:29] [Server thread/INFO]: /perf (start|stop)
[00:24:29] [Server thread/INFO]: /save-all [flush]
[00:24:29] [Server thread/INFO]: /save-off
[00:24:29] [Server thread/INFO]: /save-on
[00:24:29] [Server thread/INFO]: /setidletimeout <minutes>
[00:24:29] [Server thread/INFO]: /stop
[00:24:29] [Server thread/INFO]: /transfer <hostname> [<port>]
[00:24:29] [Server thread/INFO]: /whitelist (on|off|list|add|remove|reload)`.split('\n')

// theme
import githubLight from '@shikijs/themes/github-light'
import { useWebSocketProvider } from '../../../providers/web-socket'
import { purify } from '../../../utils/dom'

const LogView = () => {
    // const { logMessages } = useWebSocketProvider()
    const [highlighter, setHighlighter] = useState<any>(null)
    const logMessages = temp_logs
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
