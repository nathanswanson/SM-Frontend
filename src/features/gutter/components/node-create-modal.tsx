import { FaBarsProgress } from 'react-icons/fa6'
import { MenuSelectButton } from './menu-select-button'

export const NodeCreateDialog = () => {
    return (
        <MenuSelectButton disable={true} color="fg.muted">
            <FaBarsProgress /> Create Node
        </MenuSelectButton>
    )
}
