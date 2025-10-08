import { AbsoluteCenter, Spinner } from '@chakra-ui/react'
import { getServerInfoServerNameGet, Servers } from '../../lib/hey-api/client'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { InfoList } from '../../components/info-list'
import { useSelectedServerContext } from '../../providers/selected-server-context'

export const ServerOverview = () => {
    const { selectedServer, serverOnline } = useSelectedServerContext()

    const [serverInfo, setServerInfo] = useState<Servers | undefined>(undefined)

    const serverInfoState = useAsync(async () => {
        const serverInfo = await getServerInfoServerNameGet({
            credentials: 'include',
            path: { server_name: selectedServer ?? '' }
        })
        setServerInfo(serverInfo.data)
    }, [])

    if (serverInfoState.loading) {
        return (
            <AbsoluteCenter>
                <Spinner></Spinner>
            </AbsoluteCenter>
        )
    }

    const items = [
        { id: 'template', value: serverInfo?.template ?? 'N/A' },
        { id: 'status', value: serverOnline ? 'Online' : 'Offline' },
        { id: 'address', value: `${window.location.host}:${serverInfo?.port ?? 'N/A'}` }
    ]

    return <InfoList header="Information" items={items} width="100%" />
}
