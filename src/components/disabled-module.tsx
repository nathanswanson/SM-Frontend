import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react/text'

export const DisabledModule = ({ requester, ...props }: { requester: string }) => {
    return (
        <Box bg="bg.muted" alignContent={'center'} width="100%" height="100%">
            <Text textAlign={'center'} flexWrap={'wrap'} width="100%" color="fg.muted" {...props}>
                Select online server to view {requester}
            </Text>
        </Box>
    )
}
