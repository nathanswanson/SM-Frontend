import { BoxProps } from '@chakra-ui/react/box'
import { Card } from '@chakra-ui/react/card'
import { GridItem } from '@chakra-ui/react/grid'

const BASE_COL_SPAN = 3

interface GridItemHelperProps extends BoxProps {
    rowSize?: number
    colSize?: number
    children?: React.ReactNode
    header?: string
    cardContentPadding?: string | number
}

export const CardModule = ({
    rowSize = 1,
    colSize = BASE_COL_SPAN,
    children,
    header: label,
    cardContentPadding,
    ...rest
}: GridItemHelperProps) => {
    return (
        <GridItem colSpan={{ base: colSize > BASE_COL_SPAN ? BASE_COL_SPAN : colSize, md: colSize }} rowSpan={rowSize}>
            <Card.Root
                borderRadius={'sm'}
                bg="bg.subtle"
                overflow={'hidden'}
                height="100%"
                shadow="sm"
                padding={0}
                borderWidth={0}
            >
                {/* Header */}
                {label ? (
                    <Card.Header
                        px={4}
                        py={3}
                        borderBottomWidth="2px"
                        borderBottomColor="gray.200"
                        bg="bg.panel"
                        fontWeight="semibold"
                    >
                        {label}
                    </Card.Header>
                ) : null}

                <Card.Body p={cardContentPadding ?? cardContentPadding} bg="bg.panel" {...rest}>
                    {children}
                </Card.Body>
            </Card.Root>
        </GridItem>
    )
}

export default CardModule
