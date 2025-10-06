import { Box, BoxProps } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react/text'

interface DisabledModuleProps extends BoxProps {
    requester: string
    children?: React.ReactNode
}

export const DisabledModule = ({ requester, ...props }: DisabledModuleProps) => {
    return (
        <Box bg="bg.muted" alignContent={'center'} height="100%" width="100%">
            <Text textAlign={'center'} flexWrap={'wrap'} width="100%" color="fg.muted" {...props}>
                Select online server to view {requester}
            </Text>
        </Box>
    )
}
