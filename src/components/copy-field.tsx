import { ReactNode } from 'react'
import { Button } from '@chakra-ui/react/button'
import { toaster } from '../lib/chakra/toaster'

export const CopyField = ({ children }: { children: ReactNode }) => {
    return (
        <Button
            padding={0}
            m={0}
            h="auto"
            width="15em  "
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
            {children}
        </Button>
    )
}
