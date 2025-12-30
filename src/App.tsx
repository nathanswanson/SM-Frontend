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
import { mockingEnabled } from './utils/mode'
const mockGraphQlClient = mockingEnabled() ? (await import('./mocks/graphql')).mockGraphQlClient : null

const NavBar = lazy(() => import('./features/nav_bar/nav-bar'))
export default function Page() {
    return (
        <SM>
            <Login>
                <SkipNavLink>Skip to content</SkipNavLink>

                <GhostNav />
                <HStack
                    p="1em"
                    alignItems={'stretch'}
                    justifySelf={'center'}
                    maxWidth={1980}
                    height="calc(100vh - 2em)"
                    overflow="hidden"
                >
                    <Gutter width="280px" flexShrink={0} />

                    <VStack marginX="auto" paddingX="4" height="100%" overflow="hidden" flex={1}>
                        {/* nav bar */}
                        {/* <Suspense> add fallback */}
                        <NavBar width="100%" justifyContent="flex-end" flexShrink={0} />
                        {/* </Suspense> */}
                        <URQLProvider value={mockGraphQlClient ?? graphql_client}>
                            <MainContent flex={1} overflow="hidden" />
                        </URQLProvider>
                    </VStack>
                </HStack>
            </Login>
            <Toaster />
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
