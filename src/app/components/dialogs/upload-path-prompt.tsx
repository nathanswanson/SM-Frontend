import { Button, Dialog, FileUpload, Input, Portal } from '@chakra-ui/react'
import { BiUpload } from 'react-icons/bi'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { useState } from 'react'
import { uploadFileApiContainerContainerNameFsUploadPost } from '../../../lib/hey-api/client'

export const UploadPathPrompt = () => {
    const { selectedServer } = useSelectedServerContext()
    const [selectedPath, setSelectedPath] = useState<string>('')
    const [pendingFiles, setPendingFiles] = useState<File>()

    function upload_file(containerName: string, path: string, file: File) {
        uploadFileApiContainerContainerNameFsUploadPost({
            path: { container_name: containerName },
            body: { file: file, path: path }
        })
    }
    return (
        <Dialog.Root role="alertdialog">
            <Dialog.Trigger asChild>
                <Button size="lg" variant="surface" disabled={selectedServer == undefined || selectedServer == ''}>
                    <BiUpload /> Upload File
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>Upload File - {selectedServer}</Dialog.Header>
                        <Dialog.CloseTrigger />
                        <Dialog.Content>
                            <FileUpload.Root
                                onFileAccept={e => setPendingFiles(e.files[0])}
                                // onFileChange={e => console.log(e)}
                            >
                                <FileUpload.Dropzone w="100%">
                                    <FileUpload.DropzoneContent>
                                        <BiUpload /> Drag File Here
                                    </FileUpload.DropzoneContent>
                                </FileUpload.Dropzone>
                                <FileUpload.List clearable={true} showSize={true} />
                            </FileUpload.Root>
                            <Input value={selectedPath} onChange={e => setSelectedPath(e.target.value)} />
                            <Dialog.CloseTrigger>
                                <Button
                                    onClick={() => {
                                        if (selectedServer && pendingFiles)
                                            upload_file(selectedServer, selectedPath, pendingFiles)
                                    }}
                                ></Button>
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
