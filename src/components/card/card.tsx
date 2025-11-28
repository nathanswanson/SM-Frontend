import { HStack } from '@chakra-ui/react'
import { BoxProps } from '@chakra-ui/react/box'
import { Card } from '@chakra-ui/react/card'
import { GridItem } from '@chakra-ui/react/grid'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { ExpandModeDialog } from './expanded-mode'

const BASE_COL_SPAN = 3

interface CardModuleProps extends CardModuleRawProps {
    rowSize?: number
    colSize?: number
    expandable?: boolean | undefined
}

interface CardModuleRawProps extends BoxProps {
    children?: React.ReactNode
    header?: string
    expandable?: boolean | undefined
}

export const CardModule = ({
    rowSize = 1,
    colSize = BASE_COL_SPAN,
    children,
    header: label,
    expandable,
    ...rest
}: CardModuleProps) => {
    return (
        <GridItem
            flexDirection="column"
            height="100%"
            display="flex"
            width="100%"
            colSpan={{ smOnly: BASE_COL_SPAN, base: colSize }}
            rowSpan={rowSize}
        >
            <CardModuleRaw header={label} expandable={expandable} {...rest}>
                {children}
            </CardModuleRaw>
        </GridItem>
    )
}

export const CardModuleRaw = ({ children, header, expandable, ...rest }: CardModuleRawProps) => {
    const { serverInfo } = useSelectedServerContext()
    return (
        <Card.Root
            display="flex"
            flexDirection="column"
            flexGrow={1}
            borderRadius={'sm'}
            overflow={'hidden'}
            shadow="sm"
            borderWidth={0}
        >
            {/* Header */}
            {header ? (
                <Card.Header px={4} py={3} borderBottomWidth="2px" borderBottomColor="bg.muted" fontWeight="semibold">
                    <HStack justifyContent="space-between" width="100%">
                        {header}
                        {expandable !== undefined ? (
                            <ExpandModeDialog disabled={!serverInfo} label={header}>
                                {children}
                            </ExpandModeDialog>
                        ) : null}
                    </HStack>
                </Card.Header>
            ) : null}

            <Card.Body display="flex" flexGrow={1} width="100%" {...rest}>
                {children}
            </Card.Body>
        </Card.Root>
    )
}

export default CardModule
