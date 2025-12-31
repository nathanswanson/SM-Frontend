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
            display="flex"
            width="100%"
            minHeight={0}
            colSpan={{ base: 1, sm: BASE_COL_SPAN, md: colSize }}
            rowSpan={{ base: 1, sm: rowSize }}
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
            minHeight={0}
            borderRadius={'sm'}
            overflow={'hidden'}
            shadow="sm"
            borderWidth={0}
        >
            {/* Header */}
            {header ? (
                <Card.Header
                    px={4}
                    py={3}
                    borderBottomWidth="2px"
                    borderBottomColor="bg.muted"
                    fontWeight="semibold"
                    flexShrink={0}
                >
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

            <Card.Body display="flex" flexGrow={1} minHeight={0} width="100%" p={4} {...rest}>
                {children}
            </Card.Body>
        </Card.Root>
    )
}

export default CardModule
