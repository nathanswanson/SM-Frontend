import { Button } from '@chakra-ui/react/button'
import { Text } from '@chakra-ui/react/text'
import { ReactNode } from 'react'
import { toaster } from '../../lib/chakra/toaster'
export const CopyField = ({ children }: { children: ReactNode }) => {
    return (
        <Button
            padding={0}
            m={0}
            h="auto"
            width="15em"
            maxW="1fr"
            variant={'ghost'}
            fontWeight={'light'}
            maxLines={2}
            flexWrap={'wrap'}
            textAlign={'left'}
            onClick={() => {
                navigator.clipboard.writeText(children as string)
                toaster.success({ title: 'Copied to clipboard' })
            }}
        >
            <Text width="100%">{children}</Text>
        </Button>
    )
}
