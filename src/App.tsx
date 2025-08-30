import { VStack } from "@chakra-ui/react";
import { NavBar } from "./components/server-manager/nav-bar";
import { MainContent } from "./components/server-manager/main-content";

export default function Page() {
  return (
    <VStack height="100%">
      {/* nav bar */}
      <NavBar></NavBar>
      <MainContent></MainContent>
    </VStack>
  );
}
