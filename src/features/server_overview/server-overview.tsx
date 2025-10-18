import { InfoList } from '../../components/info-list'
import { useSelectedServerContext } from '../../providers/selected-server-context'

export const ServerOverview = () => {
    const { serverOnline, serverInfo } = useSelectedServerContext()

    const items = [
        { id: 'template', value: serverInfo?.template_id.toString() ?? 'N/A' },
        { id: 'status', value: serverOnline ? 'Online' : 'Offline' },
        { id: 'address', value: `${window.location.host}:${serverInfo?.port ?? 'N/A'}` }
    ]

    return <InfoList header="Information" items={items} width="100%" />
}
