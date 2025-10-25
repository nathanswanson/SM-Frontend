import { Button } from '@chakra-ui/react'

export const MenuSelectButton = ({ children, ...props }: any) => {
    return (
        <Button _hover={{ bg: 'bg.subtle' }} variant={'ghost'} {...props}>
            {children}
        </Button>
    )
}
