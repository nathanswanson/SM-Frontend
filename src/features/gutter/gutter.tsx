import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarRoot,
    Button,
    HStack,
    Skeleton,
    SkeletonText,
    VStack
} from '@chakra-ui/react'

const UserProfile = ({ ...props }) => {
    return (
        <HStack align="center" spaceX="12px" {...props}>
            <AvatarGroup boxSize="48px">
                <AvatarRoot>
                    <AvatarFallback />
                    <Avatar.Image />
                </AvatarRoot>
            </AvatarGroup>
            <SkeletonText noOfLines={2} w="150px"></SkeletonText>
            <Skeleton width="100%" height={200} />
        </HStack>
    )
}

const MenuOptions = ({ ...props }) => {
    return (
        <VStack {...props}>
            <Button variant="ghost">Create Template</Button>
            <Button variant="ghost"></Button>
            <Button color="danger" variant="ghost">
                Sign Out
            </Button>
        </VStack>
    )
}

export const Gutter = ({ ...props }) => {
    return (
        <VStack p="16px" {...props}>
            <UserProfile width="100%" />
            <MenuOptions />
        </VStack>
    )
}
