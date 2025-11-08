import { AbsoluteCenter, Group, Spinner } from '@chakra-ui/react'
import { ComponentProps, useState } from 'react'
import { useAsync } from 'react-use'
import { AsyncState } from 'react-use/lib/useAsync'
import { getNode, NodesRead } from '../../../lib/hey-api/client'
import { InfoList } from '../../components/info-list'

interface IHardwareInfoProps extends ComponentProps<typeof Group> {
    hardwareState: AsyncState<void>
    hardwareInfo: NodesRead | undefined
}

export const NodeOverview = () => {
    const [hardwareInfo, setHardwareInfo] = useState<NodesRead | undefined>(undefined)
    const hardwareState = useAsync(async () => {
        const hardwareInfo = await getNode({ path: { node_id: 1 } })
        setHardwareInfo(hardwareInfo.data)
    }, [])

    if (hardwareState.loading) {
        return (
            <AbsoluteCenter>
                <Spinner></Spinner>
            </AbsoluteCenter>
        )
    }

    const items = [
        { id: 'node_id', value: hardwareInfo?.id ?? 'N/A' },
        { id: 'cpu', value: hardwareInfo?.cpu_name ?? 'N/A' },
        { id: 'memory', value: hardwareInfo?.memory ? `${hardwareInfo.memory} GB` : 'N/A' },
        { id: 'disk', value: hardwareInfo?.disk ? `${hardwareInfo.disk} GB` : 'N/A' },
        { id: 'arch', value: hardwareInfo?.arch ?? 'N/A' },
        { id: 'cpus', value: hardwareInfo?.cpus ? `${hardwareInfo.cpus}` : 'N/A' },
        { id: 'max_hz', value: hardwareInfo?.max_hz ? `${(hardwareInfo.max_hz ?? 0) / 1000.0} GHz` : 'N/A' }
    ]

    return <InfoList header="Information" items={items} width="100%" />
}
