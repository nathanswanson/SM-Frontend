import { Group, HStack, Skeleton, SkeletonCircle, SkeletonText, VStack } from '@chakra-ui/react'

const UserProfile = ({ ...props }) => {
    return (
        <HStack align="center" spaceX="12px" {...props}>
            <SkeletonCircle color="red" boxSize="48px"></SkeletonCircle>
            <SkeletonText noOfLines={2} w="150px"></SkeletonText>
            <Skeleton width="100%" color="danger" height={200} />
        </HStack>
    )
}

export const Gutter = ({ ...props }) => {
    return (
        <VStack bg="blue" p="16px" {...props}>
            <UserProfile width="100%" />
        </VStack>
    )
}
