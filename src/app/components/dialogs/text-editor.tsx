import {
    Box,
    Button,
    CloseButton,
    Dialog,
    DialogCloseTrigger,
    DialogHeader,
    IconButton,
    Portal
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { FaDownload } from 'react-icons/fa6'

export const TextEditorDialog = ({
    isOpen,
    setIsOpen,

    inputStream,
    onSave,
    ...props
}: {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    inputStream: ReadableStream<Uint8Array>
    onSave: (stream: ReadableStream<Uint8Array>) => void
}) => {
    const [value, setValue] = useState('')
    const editorRef = useRef<any>(null)

    useEffect(() => {
        if (!inputStream) return
        const reader = inputStream.getReader()
        const decoder = new TextDecoder('utf-8')
        let cancelled = false
        async function pump() {
            try {
                while (!cancelled) {
                    const { done, value: chunk } = await reader.read()
                    if (done) break
                    // decode chunk(s) and append to editor state incrementally
                    const decoded = decoder.decode(chunk, { stream: true })
                    if (decoded) setValue(prev => prev + decoded)
                }
                // flush trailing bytes and trim trailing NULs (0x00) that may come from fixed-size buffers
                const tail = decoder.decode()
                setValue(prev => (prev + tail).replace(/\0+$/g, ''))
            } finally {
                reader.releaseLock?.()
            }
        }
        pump()
        return () => {
            reader.releaseLock?.()
            setValue('')
        }
    }, [inputStream])

    const handleSave = () => {
        // create a one-shot ReadableStream that emits current text as bytes
        const encoder = new TextEncoder()
        const bytes = encoder.encode(value)
        const outStream = new ReadableStream<Uint8Array>({
            start(controller) {
                controller.enqueue(bytes)
                controller.close()
            }
        })
        onSave?.(outStream)
        setIsOpen(false)
    }

    const handleDownload = async () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_HOST}/fs/}`
    }

    return (
        <Dialog.Root lazyMount open={isOpen} onOpenChange={e => setIsOpen(e.open)} size="xl" {...props}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <DialogHeader>Text Editor - (Unsaved Changes)</DialogHeader>
                        <DialogCloseTrigger />

                        <Dialog.Body>
                            <Box position={'relative'}>
                                <Editor
                                    height="60vh"
                                    defaultLanguage="json"
                                    theme="vs-dark"
                                    value={value}
                                    onChange={v => setValue(v ?? '')}
                                    onMount={editor => {
                                        editorRef.current = editor
                                    }}
                                />
                                <IconButton
                                    variant="subtle"
                                    zIndex={1}
                                    position={'absolute'}
                                    bottom={2}
                                    left={2}
                                    aria-label="Download"
                                >
                                    <FaDownload />
                                </IconButton>
                            </Box>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                onClick={() => {
                                    handleSave()
                                    isOpen = false
                                }}
                                variant="surface"
                            >
                                Save
                            </Button>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger onClick={() => setValue('')} asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
