import { ServerCog } from 'lucide-react'
import { MenuSelectButton } from '../../../components/menu-select-button'

export const NodeCreateDialog = () => {
    return (
        <MenuSelectButton disable={true} color="fg.muted">
            <ServerCog /> Node Management
        </MenuSelectButton>
    )
}

export default NodeCreateDialog
