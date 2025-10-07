import { AbsoluteCenter, Group, HStack, Spinner } from '@chakra-ui/react'
import { hardwareApiNodesHardwareGet, Nodes } from '../../lib/hey-api/client'
import { useState, ComponentProps } from 'react'
import { useAsync } from 'react-use'
import { AsyncState } from 'react-use/lib/useAsync'
import { InfoList } from '../../components/info-list'

interface IHardwareInfoProps extends ComponentProps<typeof Group> {
    hardwareState: AsyncState<void>
    hardwareInfo: Nodes
}

export const ServerOverview = () => {
    const [hardwareInfo, setHardwareInfo] = useState<Nodes | undefined>(undefined)
    const hardwareState = useAsync(async () => {
        const hardwareInfo = await hardwareApiNodesHardwareGet({ credentials: 'include' })
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
        { id: 'template', value: 'N/A' },
        { id: 'status', value: 'Offline' }
    ]

    return <InfoList header="Information" items={items} width="100%" />
}
