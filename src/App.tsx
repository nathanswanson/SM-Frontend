import { Box, HStack, VStack } from '@chakra-ui/react'
import { MainContent } from './pages/server-manager'
import { Login } from './pages/login'
import { Toaster } from './lib/chakra/toaster'
import { Gutter } from './features/gutter/gutter'
import { NavBar } from './features/nav_bar/nav-bar'

export default function Page() {
    return (
        <Login>
            <HStack maxWidth={1680} width="100%">
                <Gutter height="100vh" width="20%" />
                <VStack
                    height="100vh"
                    width="80%"
                    marginY="6"
                    marginX="auto"
                    paddingX="6"
                    marginTop="0"
                    marginBottom="0"
                >
                    {/* nav bar */}
                    <NavBar width="100%" justifyContent="flex-end"></NavBar>
                    <MainContent></MainContent>
                    <Toaster />
                </VStack>
            </HStack>
        </Login>
    )
}
