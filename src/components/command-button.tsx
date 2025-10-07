import { IconButton, IconButtonProps } from '@chakra-ui/react/button'
import { Tooltip } from './tooltip'

interface CommandButtonProps extends IconButtonProps {
    label: string
    children: React.ReactNode
}

export const CommandButton = ({ label, children, ...props }: CommandButtonProps) => {
    return (
        <Tooltip openDelay={100} content={label}>
            <IconButton variant={'ghost'} {...props}>
                {children}
            </IconButton>
        </Tooltip>
    )
}
export default CommandButton
