import { LuServerCog } from 'react-icons/lu'
import { MenuSelectButton } from '../../../mocks/menu-select-button'

export const NodeCreateDialog = () => {
    return (
        <MenuSelectButton disable={true} color="fg.muted">
            <LuServerCog /> Node Management
        </MenuSelectButton>
    )
}
