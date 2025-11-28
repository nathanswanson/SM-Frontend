import { Box, CloseButton, Dialog, FileUpload, FileUploadFileAcceptDetails } from '@chakra-ui/react'
import { fetch } from 'ofetch'
import { toaster } from '../../../../lib/chakra/toaster'
import { useFileTransferContext } from '../../../providers/file-transfer'
import { useSelectedServerContext } from '../../../providers/selected-server-context'
import { getAccessToken, getBaseUrl } from '../../../utils/api'

interface FileUploaddialogProps {
    isOpen: boolean
    setOpen: (open: boolean) => void
    uploadPath: string
}

export const FileUploadDialog = (props: FileUploaddialogProps) => {
    const { serverInfo } = useSelectedServerContext()
    const { setTransferProgress, setFile } = useFileTransferContext()
    const handleFileAccept = async (details: FileUploadFileAcceptDetails) => {
        if (serverInfo && details.files.length > 0) {
            const file = details.files[0]

            setFile({
                fileName: file.name,
                sizeTotal: file.size,
                downloadPath: props.uploadPath + file.name,
                direction: 'upload'
            })
            // initialize and track progress numerically
            let uploadedBytes = 0
            setTransferProgress(0)

            const progressStream = new TransformStream<Uint8Array, Uint8Array>({
                transform(chunk, controller) {
                    uploadedBytes += chunk.length
                    setTransferProgress(uploadedBytes)
                    controller.enqueue(chunk)
                }
            })

            if (!file.name) {
                console.error('File has no name, aborting upload.')
                return
            }
            await fetch(
                `${getBaseUrl()}/volumes/${serverInfo.id}/fs/?path=${encodeURIComponent(props.uploadPath + file.name)}`,
                {
                    method: 'POST',
                    body: file.stream().pipeThrough(progressStream),
                    headers: {
                        'X-Upload-Path': props.uploadPath,
                        'Content-Type': 'application/octet-stream',
                        'X-File-Name': file.name,
                        Authorization: `Bearer ${getAccessToken()} ?? ''}`
                    },
                    // @ts-ignore
                    duplex: 'half'
                }
            ).then(response => {
                if (!response.ok) {
                    console.error('File upload failed:', response.status, response.statusText)
                } else {
                    toaster.success({
                        title: 'File uploaded',
                        description: `Successfully uploaded ${file.name}`,
                        closable: true,
                        duration: 5000
                    })
                    console.log('File uploaded successfully')
                }
            })
        }
    }

    return (
        <Dialog.Root open={props.isOpen} onOpenChange={e => props.setOpen(e.open)}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        Upload File to {props.uploadPath}
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>
                    <Dialog.Body>
                        <FileUpload.Root width="100%" allowDrop onFileAccept={handleFileAccept}>
                            <FileUpload.HiddenInput />
                            <FileUpload.Dropzone width="100%">
                                <FileUpload.DropzoneContent>
                                    <Box>Drag and drop files here</Box>
                                </FileUpload.DropzoneContent>
                            </FileUpload.Dropzone>
                        </FileUpload.Root>
                    </Dialog.Body>
                </Dialog.Content>
                <Dialog.CloseTrigger />
            </Dialog.Positioner>
        </Dialog.Root>
    )
}
