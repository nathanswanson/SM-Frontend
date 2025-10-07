import {
    Box,
    Button,
    CloseButton,
    Dialog,
    DialogCloseTrigger,
    DialogHeader,
    DialogRootProps,
    IconButton,
    Portal,
    Spinner
} from '@chakra-ui/react'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { FaDownload } from 'react-icons/fa6'

const EditorLazy = React.lazy(() => import('@monaco-editor/react'))

export interface TextEditorProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    inputStream: ReadableStream<Uint8Array>
    onSave: (stream: ReadableStream<Uint8Array>) => void
    fileExtension: string
}

export const TextEditorDialog = ({
    isOpen,
    setIsOpen,

    inputStream,
    onSave,
    fileExtension,
    ...props
}: TextEditorProps) => {
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

    // Wrapper to adapt Dialog's OpenChangeDetails => boolean for setIsOpen
    const handleDialogOpenChange = (details: any) => {
        // Radix/Chakra may pass an object like { open: boolean } or just a boolean.
        // Normalize both cases to a boolean and forward to setIsOpen.
        if (typeof details === 'boolean') {
            setIsOpen(details)
        } else {
            setIsOpen(Boolean(details?.open))
        }
    }

    return (
        <Dialog.Root lazyMount open={isOpen} onOpenChange={handleDialogOpenChange} size="xl" {...props}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <DialogHeader>{fileExtension}</DialogHeader>
                        <DialogCloseTrigger />

                        <Dialog.Body>
                            <Box position={'relative'}>
                                {!isOpen ? (
                                    <Spinner />
                                ) : (
                                    <Suspense fallback={<Spinner />}>
                                        <EditorLazy
                                            height="60vh"
                                            language={fileExtension}
                                            theme="vs-dark"
                                            value={value}
                                            onChange={v => setValue(v ?? '')}
                                            onMount={editor => {
                                                editorRef.current = editor
                                            }}
                                        />
                                    </Suspense>
                                )}

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
