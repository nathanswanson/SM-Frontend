import { Avatar, Text, HStack, Stack, VStack, Spacer } from '@chakra-ui/react'
import { FaBarsProgress, FaDatabase, FaGear, FaSwatchbook, FaUserLock, FaUserMinus } from 'react-icons/fa6'
import { MenuSelectButton } from './components/menu-select-button'
import { getUserMePost, logoutUserLogoutPost } from '../../lib/hey-api/client'
import { useEffect, useState } from 'react'
import { useUserDataContext } from '../../providers/user-data'

const UserProfile = ({ ...props }) => {
    const { userData } = useUserDataContext()

    return (
        <HStack gap="4" align="center" spaceX="12px" {...props}>
            <Avatar.Root padding="1em" variant={'solid'}>
                <Avatar.Fallback />
                <Avatar.Image />
            </Avatar.Root>
            <Stack gap="0">
                <Text fontWeight={'medium'}>{userData?.username}</Text>
                <Text color="fg.muted" textStyle={'sm'}>
                    {userData?.admin ? 'Admin' : 'User'}
                </Text>
            </Stack>
        </HStack>
    )
}

const MenuOptions = ({ ...props }) => {
    return (
        <VStack paddingTop="1em" width="100%" rowGap={'0.05em'} justifyContent="left" {...props}>
            <MenuSelectButton color="fg.muted">
                <FaSwatchbook />
                Create Template
            </MenuSelectButton>
            <MenuSelectButton color="fg.muted">
                <FaBarsProgress /> Create Node
            </MenuSelectButton>
            <MenuSelectButton marginBottom={'2em'} color="fg.muted">
                <FaDatabase />
                Create New Server
            </MenuSelectButton>

            <MenuSelectButton color="fg.muted">
                <FaGear /> Settings
            </MenuSelectButton>
            <MenuSelectButton
                onClick={async () => {
                    await logoutUserLogoutPost().then(() => {
                        // window.location.reload()
                    })
                }}
                color="danger.500"
            >
                <FaUserLock />
                Sign Out
            </MenuSelectButton>
        </VStack>
    )
}

export const Gutter = ({ ...props }) => {
    return (
        <VStack as="nav" alignSelf={'flex-start'} p="12px" {...props}>
            <UserProfile width="100%" />
            <MenuOptions />
        </VStack>
    )
}
