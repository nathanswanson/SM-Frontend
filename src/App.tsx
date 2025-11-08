import { ChakraProvider, HStack, SkipNavLink, VStack } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { lazy } from 'react'
import { Provider as URQLProvider } from 'urql'
import { ColorModeProvider } from '../lib/chakra/color-mode'
import { Toaster } from '../lib/chakra/toaster'
import { GhostNav } from './components/ghost-nav'
import { Gutter } from './features/gutter/gutter'
import { Login } from './pages/login/login'
import { MainContent } from './pages/main/server-manager'
import { graphql_client } from './providers/graphql'
import { SelectedServerProvider } from './providers/selected-server-context'
import { UserDataProvider } from './providers/user-data'
import { WindowProvider } from './providers/window-context'
import { system } from './theme'
const mockGraphQlClient = true ? (await import('./mocks/graphql')).mockGraphQlClient : null

const NavBar = lazy(() => import('./features/nav_bar/nav-bar'))
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
                        {/* <Suspense> add fallback */}
                        <NavBar width="100%" justifyContent="flex-end" />
                        {/* </Suspense> */}
                        <URQLProvider value={mockGraphQlClient ?? graphql_client}>
                            <MainContent />
                        </URQLProvider>
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
                        <WindowProvider>
                            <UserDataProvider>{children}</UserDataProvider>
                        </WindowProvider>
                    </SelectedServerProvider>
                </ColorModeProvider>
            </ThemeProvider>
        </ChakraProvider>
    )
}
