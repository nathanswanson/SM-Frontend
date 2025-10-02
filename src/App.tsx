import { Box, HStack, VStack } from '@chakra-ui/react'
import { MainContent } from './pages/server-manager'
import { Login } from './pages/login'
import { Toaster } from './lib/chakra/toaster'
import { Gutter } from './features/gutter/gutter'
import { NavBar } from './features/nav_bar/nav-bar'
import { GhostNav } from './components/ghost-nav'

export default function Page() {
    return (
        <Login>
            <Box width="100%" bg="bg.subtle">
                {}
                <GhostNav />
                <HStack p="1em" alignItems={'flex-start'} justifySelf={'center'} maxWidth={1980}>
                    <Gutter height="auto" top="100px" width="20%" />

                    <VStack height="100%" marginY="6" marginX="auto" paddingX="6" marginTop="0" marginBottom="0">
                        {/* nav bar */}
                        <NavBar width="100%" justifyContent="flex-end"></NavBar>
                        <MainContent></MainContent>
                        <Toaster />
                    </VStack>
                </HStack>
            </Box>
        </Login>
    )
}
