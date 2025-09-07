import { VStack } from '@chakra-ui/react'
import { NavBar } from './components/server-manager/nav-bar'
import { MainContent } from './components/server-manager/server-manager'

export default function Page() {
  return (
    <VStack height="100vh" width="100%">
      {/* nav bar */}
      <NavBar></NavBar>
      <MainContent></MainContent>
    </VStack>
  )
}
