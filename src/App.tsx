import { VStack } from "@chakra-ui/react";
import { Navbar } from "./components/Navbar";
import { MainTable } from "./pages/MainTable";

function App() {
  return (
    <VStack h={"100vh"} align={"stretch"}>
      <Navbar />
      <VStack flex={1} align="center" justify={"center"}>
        <MainTable />
      </VStack>
    </VStack>
  );
}

export default App;
