import { DownloadTrigger, IconButton } from '@chakra-ui/react'
import { HStack } from '@chakra-ui/react/stack'
import { fetch } from 'ofetch'
import { useState } from 'react'
import { LuFileDown } from 'react-icons/lu'
import { getTemplate } from '../../../../lib/hey-api/client'
import { DownloadProgress } from '../../../components/download-progress'
import { useFileTransferContext } from '../../../providers/file-transfer'
import { useSelectedServerContext } from '../../../providers/selected-server-context'
import { getBaseUrl } from '../../../utils/api'

export const FileActionBar = ({ ...props }) => {
    const { serverInfo } = useSelectedServerContext()
    const { setFile, setTransferProgress } = useFileTransferContext()
    const [loading, setLoading] = useState(false)
    const data = async (): Promise<Blob> => {
        if (!serverInfo) throw new Error('No server selected')
        setLoading(true)
        try {
            const template = await getTemplate({ path: { template_id: serverInfo.template_id } })
            const paths = template?.data?.exposed_volume || []
            const res = await fetch(
                `${getBaseUrl()}/volumes/${serverInfo.id}/fs/archive?paths=${encodeURIComponent(JSON.stringify(paths))}`,
                {
                    credentials: 'include'
                }
            )
            const contentLength = res.headers.get('Content-Length')
            const totalSize = contentLength ? parseInt(contentLength, 10) : 0

            setFile({
                fileName: 'export.tar',
                sizeTotal: totalSize,
                downloadPath: '',
                direction: 'download'
            })
            if (!res.ok) {
                throw new Error('Failed to initiate download')
            }

            const reader = res.body?.getReader()
            if (!reader) {
                throw new Error('Failed to get readable stream from response')
            }

            setTransferProgress(0)

            let downloadedBytes = 0
            const chunks = []
            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    break
                }
                chunks.push(value)
                downloadedBytes += value.length
                setTransferProgress(downloadedBytes)
            }
            setLoading(false)
            return new Blob(chunks, { type: 'application/x-tar' })
        } catch (error) {
            console.error('Download failed:', error)
            setLoading(false)
            return new Blob(['failed to download file'], { type: 'text/plain' })
        }
    }
    return (
        <HStack justifyContent={'space-between'} width="100%" {...props}>
            <DownloadTrigger asChild fileName="export.tar" mimeType="application/x-tar" data={data}>
                <IconButton loading={loading} variant={'ghost'}>
                    <LuFileDown size={20} />
                </IconButton>
            </DownloadTrigger>

            <DownloadProgress />
        </HStack>
    )
}
