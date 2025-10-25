import { Box, QrCode } from '@chakra-ui/react'
import React from 'react'
import { getTemplate, TemplatesRead } from '../../../lib/hey-api/client'
import { InfoList } from '../../components/info-list'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { getFrontendUrl } from '../../utils/api'
export const ServerOverview = () => {
    const { serverOnline, serverInfo } = useSelectedServerContext()
    const [templateInfo, setTemplateInfo] = React.useState<TemplatesRead | undefined>(undefined)
    React.useEffect(() => {
        if (serverInfo) {
            getTemplate({
                path: { template_id: serverInfo.template_id }
            }).then(res => {
                setTemplateInfo(res.data)
            })
        }
    }, [serverInfo])
    const items = [
        { id: 'template', value: templateInfo?.name ?? 'N/A' },
        { id: 'status', value: serverOnline ? 'Online' : 'Offline' },
        { id: 'address', value: `${getFrontendUrl()}:${serverInfo?.port ?? '0000'}` },
        { id: 'total cpu', value: serverInfo?.cpu ? `${serverInfo.cpu} cores` : 'N/A' },
        { id: 'total memory', value: serverInfo?.memory ? `${serverInfo.memory} GB` : 'N/A' },
        { id: 'total disk', value: serverInfo?.disk ? `${serverInfo.disk} GB` : 'N/A' }
    ]

    return (
        <Box position="relative">
            {/* qr code is in top right of container */}
            <Box position="absolute" bottom={0} right={0} zIndex={10}>
                <QrCode.Root zIndex={10} value={window.location.host + ':' + (serverInfo?.port ?? '')} size="xs">
                    <QrCode.Frame>
                        <QrCode.Pattern />
                    </QrCode.Frame>
                </QrCode.Root>
            </Box>
            <InfoList header="Information" items={items} width="100%" />
        </Box>
    )
}
