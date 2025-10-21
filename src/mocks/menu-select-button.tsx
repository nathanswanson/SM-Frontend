import { Button } from '@chakra-ui/react'

export const MenuSelectButton = ({ children, ...props }: any) => {
    return (
        <Button
            padding="0.25em"
            paddingLeft={'2em'}
            variant="ghost"
            height="auto"
            fontSize={'md'}
            width="100%"
            justifyContent={'left'}
            borderRadius={0}
            {...props}
        >
            {children}
        </Button>
    )
}
