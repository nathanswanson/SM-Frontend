import { Button, Dialog, FileUpload, Input, Portal } from '@chakra-ui/react'
import { useState } from 'react'
import { LuUpload } from 'react-icons/lu'
import { uploadFile } from '../../../../lib/hey-api/client'
import { useSelectedServerContext } from '../../../providers/selected-server-context'

export const UploadPathPrompt = () => {
    const { selectedServer, serverInfo } = useSelectedServerContext()
    const [selectedPath, setSelectedPath] = useState<string>('')
    const [pendingFiles, setPendingFiles] = useState<File>()

    function upload_file(containerName: string, path: string, file: File) {
        uploadFile({
            path: { container_name: containerName, path: path },
            body: { file: file }
        })
    }
    return (
        <Dialog.Root role="alertdialog">
            <Dialog.Trigger asChild>
                <Button size="lg" variant="surface" disabled={selectedServer == undefined}>
                    <LuUpload />
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>Upload File - {selectedServer}</Dialog.Header>
                        <Dialog.CloseTrigger />
                        <Dialog.Body>
                            <FileUpload.Root
                                onFileAccept={e => setPendingFiles(e.files[0])}
                                // onFileChange={e => console.log(e)}
                                accept={'.zip'}
                            >
                                <FileUpload.Dropzone w="100%">
                                    <FileUpload.DropzoneContent>
                                        <LuUpload /> Drag File Here
                                    </FileUpload.DropzoneContent>
                                </FileUpload.Dropzone>
                                <FileUpload.List clearable={true} showSize={true} />
                            </FileUpload.Root>
                            <Input value={selectedPath} onChange={e => setSelectedPath(e.target.value)} />
                            <Dialog.CloseTrigger>
                                <Button
                                    onClick={() => {
                                        if (serverInfo && pendingFiles)
                                            upload_file(serverInfo.name, selectedPath, pendingFiles)
                                    }}
                                ></Button>
                            </Dialog.CloseTrigger>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
