import {
    Avatar,
    Text,
    HStack,
    Stack,
    VStack,
    useBreakpointValue,
    Drawer,
    Portal,
    CloseButton,
    IconButton
} from '@chakra-ui/react'
import { FaBars, FaBarsProgress, FaDatabase, FaGear, FaSwatchbook, FaUserLock } from 'react-icons/fa6'
import { MenuSelectButton } from './components/menu-select-button'

import { useUserDataContext } from '../../providers/user-data'
import { logoutUserLogoutPost } from '../../lib/hey-api/client/sdk.gen'
import { ColorModeButton } from '../../lib/chakra/color-mode.js'
import { TemplateCreateDialog } from './components/template-create-modal'
import { NodeCreateDialog } from './components/node-create-modal'
import { ServerCreationDialog } from './components/server-create-modal'

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

const CollapseWrapper = ({ children, ...props }: { children: React.ReactNode }) => {
    const isPermanent = useBreakpointValue({ smOnly: false, md: true })
    if (isPermanent) return children

    return (
        <Drawer.Root placement={'start'}>
            <Drawer.Trigger asChild>
                <IconButton variant="outline" size="sm">
                    <FaBars />
                </IconButton>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Body>{children}</Drawer.Body>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="lg" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

const MenuOptions = ({ ...props }) => {
    const { userData } = useUserDataContext()

    return (
        <VStack paddingTop="1em" width="100%" rowGap={'0.05em'} justifyContent="left" {...props}>
            <TemplateCreateDialog />
            <NodeCreateDialog />
            <ServerCreationDialog />
            <HStack width="100%" borderBottomWidth="0px" paddingTop={'1.5em'} borderColor="border" />

            <MenuSelectButton color="fg.muted">
                <FaGear /> Settings
            </MenuSelectButton>
            <MenuSelectButton
                onClick={async () => {
                    await logoutUserLogoutPost({ credentials: 'include' }).then(() => {
                        window.location.reload()
                    })
                }}
                color="danger.500"
            >
                <FaUserLock />
                Sign Out
            </MenuSelectButton>
            <HStack width="100%" paddingTop={'1.5em'} borderBottomWidth="1px" borderColor="border" />
            <ColorModeButton width="100%" justifyContent={'left'} paddingLeft="2em" />
        </VStack>
    )
}

export const Gutter = ({ ...props }) => {
    return (
        <CollapseWrapper>
            <VStack as="nav" alignSelf={'flex-start'} p="12px" {...props}>
                <UserProfile width="100%" />
                <MenuOptions />
            </VStack>
        </CollapseWrapper>
    )
}
