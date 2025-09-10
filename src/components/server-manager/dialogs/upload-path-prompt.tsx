import { Button, Dialog, FileUpload, Input, Portal } from '@chakra-ui/react'
import { BiUpload } from 'react-icons/bi'
import { useSelectedServerContext } from '../../../selected-server-context'
import { useState } from 'react'
import { uploadFileApiContainerContainerNameFsUploadPost } from '../../../client'

function upload_file(containerName: string, path: string, file: File) {
    // looks like a bug in relativePath, if file is in folder the first directory

    uploadFileApiContainerContainerNameFsUploadPost({
        path: { container_name: containerName },
        query: { path: path },
        body: { file: file }
    })
}

export const UploadPathPrompt = () => {
    const { selectedServer } = useSelectedServerContext()
    const [selectedPath, setSelectedPath] = useState<string>('')
    const [pendingFiles, setPendingFiles] = useState<File>()
    return (
        <Dialog.Root role="alertdialog">
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    disabled={
                        selectedServer == undefined || selectedServer == ''
                    }
                >
                    <BiUpload /> Upload File
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            Upload File - {selectedServer}
                        </Dialog.Header>
                        <Dialog.CloseTrigger />
                        <Dialog.Content>
                            <FileUpload.Root
                                onFileAccept={e => setPendingFiles(e.files[0])}
                                onFileChange={e => console.log(e)}
                            >
                                <FileUpload.Dropzone w="100%">
                                    <FileUpload.DropzoneContent>
                                        <BiUpload /> Drag File Here
                                    </FileUpload.DropzoneContent>
                                </FileUpload.Dropzone>
                                <FileUpload.List
                                    clearable={true}
                                    showSize={true}
                                />
                            </FileUpload.Root>
                            <Input
                                value={selectedPath}
                                onChange={e => setSelectedPath(e.target.value)}
                            />
                            <Dialog.CloseTrigger>
                                <Button
                                    onClick={() => {
                                        if (selectedServer && pendingFiles)
                                            upload_file(
                                                selectedServer,
                                                selectedPath,
                                                pendingFiles
                                            )
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
