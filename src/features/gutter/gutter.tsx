import {
    Avatar,
    CloseButton,
    Drawer,
    HStack,
    IconButton,
    Portal,
    Show,
    Stack,
    Text,
    VStack,
    useBreakpointValue
} from '@chakra-ui/react'
import { MenuSelectButton } from '../../mocks/menu-select-button'

import { LuLogOut, LuMenu } from 'react-icons/lu'
import { ColorModeButton } from '../../../lib/chakra/color-mode.js'
import { logoutUser } from '../../../lib/hey-api/client'
import { useUserDataContext } from '../../providers/user-data'
import { NodeCreateDialog } from './components/node-create-modal'
import { ServerCreateDialog } from './components/server-create-modal'
import { SettingsModal } from './components/settings-modal'
import { TemplateCreateDialog } from './components/template-create-modal'

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
                    <LuMenu />
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
        <VStack paddingTop="1em" rowGap={'0.05em'} alignItems={'flex-start'} {...props}>
            <TemplateCreateDialog />
            <Show when={userData?.admin}>
                <NodeCreateDialog />
            </Show>
            <ServerCreateDialog />
            <HStack width="100%" borderBottomWidth="0px" paddingTop={'1.5em'} borderColor="border" />

            <SettingsModal />
            <MenuSelectButton
                onClick={async () => {
                    await logoutUser({ credentials: 'include' }).then(() => {
                        window.location.reload()
                    })
                }}
                color="danger.500"
            >
                <LuLogOut />
                Sign Out
            </MenuSelectButton>
            <HStack width="100%" paddingTop={'1.5em'} borderBottomWidth="1px" borderColor="border" />
            <ColorModeButton />
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
