import { VStack } from '@chakra-ui/react'
import { MainContent } from './app/components/server-manager'
import { NavBar } from './app/components/nav-bar'
import { Login } from './app/components/login'

export default function Page() {
    return (
        <Login>
            <VStack
                width="100%"
                height="100vh"
                maxWidth={1680}
                marginY="6"
                marginX="auto"
                paddingX="6"
                marginTop="0"
                marginBottom="0"
            >
                {/* nav bar */}
                <NavBar width="100%" justifyContent="flex-end"></NavBar>
                <MainContent></MainContent>
            </VStack>
        </Login>
    )
}
