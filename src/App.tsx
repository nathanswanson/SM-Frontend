import { Box, HStack, VStack } from '@chakra-ui/react'
import { MainContent } from './features/server_manager/server-manager'
import { Login } from './pages/login'
import { Toaster } from '../lib/chakra/toaster'
import { Gutter } from './features/gutter/gutter'
import { NavBar } from './features/nav_bar/nav-bar'
import { GhostNav } from './components/ghost-nav'

export default function Page() {
    return (
        // <Login>
        <Box height={'svh'} width={'svw'} bg="bg.subtle">
            <GhostNav />
            <HStack p="1em" alignItems={'flex-start'} justifySelf={'center'} maxWidth={1980}>
                <Gutter top="100px" width="20%" />

                <VStack marginY="6" marginX="auto" paddingX="6" marginTop="0" marginBottom="0">
                    {/* nav bar */}
                    <NavBar width="100%" justifyContent="flex-end"></NavBar>
                    <MainContent></MainContent>
                    <Toaster />
                </VStack>
            </HStack>
        </Box>
        // </Login>
    )
}
