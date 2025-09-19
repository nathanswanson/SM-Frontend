import {
    Button,
    CloseButton,
    Dialog,
    DialogCloseTrigger,
    DialogHeader,
    Portal
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'

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
        let unsaved_file = ''
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

    return (
        <Dialog.Root
            lazyMount
            open={isOpen}
            onOpenChange={e => setIsOpen(e.open)}
            size="lg"
            {...props}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner height="90vh">
                    <Dialog.Content height="100%">
                        <DialogHeader>
                            Text Editor - (Unsaved Changes)
                        </DialogHeader>
                        <DialogCloseTrigger />

                        <Dialog.Body>
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme="vs-dark"
                                value={value}
                                onChange={v => setValue(v ?? '')}
                                onMount={editor => {
                                    editorRef.current = editor
                                }}
                            />
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
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
