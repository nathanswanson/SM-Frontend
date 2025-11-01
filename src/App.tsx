import { ChakraProvider, HStack, SkipNavLink, VStack } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'urql'
import { ColorModeProvider } from '../lib/chakra/color-mode'
import { Toaster } from '../lib/chakra/toaster'
import { GhostNav } from './components/ghost-nav'
import { Gutter } from './features/gutter/gutter'
import { NavBar } from './features/nav_bar/nav-bar'
import { Login } from './pages/login/login'
import { MainContent } from './pages/main/server-manager'
import { graphql_client } from './providers/graphql'
import { SelectedServerProvider } from './providers/selected-server-context'
import { UserDataProvider } from './providers/user-data'
import { WindowProvider } from './providers/window-context'
import { system } from './theme'

// const Messages = () => {
//     const [res] = useSubscription({ query: subscribe }, handleSubscription)

//     if (res.fetching) {
//         return <p>Loading...</p>
//     }

//     if (res.error) {
//         return <p>Error: {res.error.message}</p>
//     }

//     if (!res.data) {
//         return <p>No data received</p>
//     }

//     const metrics = res.data
//     return (
//         <div>
//             <p>Memory: {metrics.memory}</p>
//             <p>CPU: {metrics.cpu}</p>
//             <p>Disk: {metrics.disk}</p>
//             <p>Network: {metrics.network}</p>
//         </div>
//     )
// }

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
                        <Provider value={graphql_client}>
                            {/* <Messages /> */}
                            <MainContent />
                        </Provider>
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
