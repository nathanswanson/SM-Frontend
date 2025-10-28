import { ChakraProvider, HStack, SkipNavLink, VStack } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { ColorModeProvider } from '../lib/chakra/color-mode'
import { Toaster } from '../lib/chakra/toaster'
import { DebugView } from './components/debug'
import { GhostNav } from './components/ghost-nav'
import { Gutter } from './features/gutter/gutter'
import { NavBar } from './features/nav_bar/nav-bar'
import { Login } from './pages/login/login'
import { MainContent } from './pages/main/server-manager'
import { SelectedServerProvider } from './providers/selected-server-context'
import { UserDataProvider } from './providers/user-data'
import { WebSocketProvider } from './providers/web-socket'
import { WindowProvider } from './providers/window-context'
import { system } from './theme'

export default function Page() {
    return (
        <SM>
            <Login>
                <SkipNavLink>Skip to content</SkipNavLink>

                <GhostNav />
                <HStack p="1em" alignItems={'flex-start'} justifySelf={'center'} maxWidth={1980}>
                    <Gutter top="100px" width="20%" />

                    <VStack marginY="6" marginX="auto" paddingX="6" marginTop="0" marginBottom="0">
                        {/* nav bar */}
                        <NavBar width="100%" justifyContent="flex-end"></NavBar>
                        <MainContent />
                        <Toaster />
                    </VStack>
                </HStack>
            </Login>
        </SM>
    )
}

export const SM = ({ children }: { children: React.ReactNode }) => {
    return (
        <ChakraProvider value={system}>
            <ThemeProvider attribute="class">
                <ColorModeProvider>
                    <SelectedServerProvider>
                        <DebugView />

                        <WebSocketProvider>
                            <WindowProvider>
                                <UserDataProvider>{children}</UserDataProvider>
                            </WindowProvider>
                        </WebSocketProvider>
                    </SelectedServerProvider>
                </ColorModeProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}
