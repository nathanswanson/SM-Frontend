import { Button, Card, Grid, GridItem, HStack } from "@chakra-ui/react";
import {
  VscDebugRestart,
  VscDebugStart,
  VscDebugStop,
  VscTrash,
} from "react-icons/vsc";
import { useSelectedServerContext } from "../../selected-server-context";
import { useState } from "react";
import {
  startContainerApiContainerNameStartGet,
  stopContainerApiContainerNameStopGet,
} from "../../client";
import { LogView } from "./log-viewer";

export const MainContent = () => {
  return (
    <Grid>
      <GridItem colSpan={6}>
        <ManageServer />
      </GridItem>
    </Grid>
  );
};

const ManageServer = () => {
  return (
    <Card.Root h="300px" w="300px">
      <Card.Title>Manage Server</Card.Title>
      <Card.Body>
        <CommandButtons />
        {/* server up time chart */}
      </Card.Body>
    </Card.Root>
  );
};

const CommandButtons = () => {
  const { selectedServer } = useSelectedServerContext();
  const [serverRunning, setServerRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  async function stop_server() {
    setLoading(true);
    if (selectedServer) {
      try {
        await stopContainerApiContainerNameStopGet({
          path: { name: selectedServer },
        });
        setServerRunning(false);
      } finally {
        setLoading(false);
      }
    }
  }

  async function start_server() {
    setLoading(true);
    if (selectedServer) {
      try {
        await startContainerApiContainerNameStartGet({
          path: { name: selectedServer },
        });
        setServerRunning(true);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <HStack>
      {LogView("lucid_neumann")}
      <Button
        loading={loading}
        disabled={selectedServer == undefined || selectedServer == ""}
        onClick={serverRunning ? stop_server : start_server}
      >
        {!serverRunning ? <VscDebugStart /> : <VscDebugStop />}
      </Button>
      <Button disabled>
        <VscDebugRestart />
      </Button>
      <Button
        disabled={
          selectedServer == undefined || selectedServer == "" || loading
        }
        colorPalette="red"
      >
        <VscTrash />
      </Button>
    </HStack>
  );
};
