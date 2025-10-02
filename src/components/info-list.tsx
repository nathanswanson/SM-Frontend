import { Box, BoxProps, Heading } from '@chakra-ui/react'
import { DataList } from '@chakra-ui/react/data-list'

interface AllocatedResourceListProps extends BoxProps {
    items: { id: string; value: string }[]
    header: string
}

export const InfoList = ({ items, header, ...props }: AllocatedResourceListProps) => {
    return (
        <Box alignSelf={'flex-start'} {...props}>
            <Heading size="sm" alignSelf={'flex-start'} marginBottom="0.5em">
                {header}
            </Heading>
            <DataList.Root gap="0.50em" orientation="horizontal" width="100%">
                {items.map(item => (
                    <DataList.Item key={item.id}>
                        <DataList.ItemLabel fontWeight={'medium'} maxLines={1}>
                            {item.id}
                        </DataList.ItemLabel>
                        <DataList.ItemValue fontWeight={'light'} maxLines={2} flexWrap={'wrap'}>
                            {item.value}
                        </DataList.ItemValue>
                    </DataList.Item>
                ))}
            </DataList.Root>
        </Box>
    )
}
