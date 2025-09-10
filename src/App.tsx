import { VStack, Text, Flex, HStack } from '@chakra-ui/react'
import { NavBar } from './components/server-manager/nav-bar'
import { MainContent } from './components/server-manager/server-manager'

export default function Page() {
    return (
        <VStack
            width="100%"
            height="100vh"
            maxWidth={1680}
            marginY="6"
            marginX="auto"
            paddingX="6"
        >
            {/* nav bar */}
            <NavBar></NavBar>
            <MainContent></MainContent>
        </VStack>
    )
}
