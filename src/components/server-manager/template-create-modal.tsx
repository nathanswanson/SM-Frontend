import {
  Box,
  Button,
  CloseButton,
  Collapsible,
  Dialog,
  Field,
  Input,
  Link,
  Portal,
} from "@chakra-ui/react";
import { FormField } from "./util";
import { addTemplateApiTemplateAddTemplatePost } from "../../client";
import { useState } from "react";
import { useSelectedServerContext } from "../../selected-server-context";
export const TemplateCreateDialog = () => {
  const [template_name, setTemplateName] = useState("");
  const [template_image, setTemplateImage] = useState("");
  const [template_port, setTemplatePort] = useState("");
  const [template_cpu, setTemplateCpu] = useState("2");
  const [template_memory, setTemplateMemory] = useState("4G");

  const { selectedServer } = useSelectedServerContext();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="plain"
          unstyled
          justifyContent="flex-start"
          textAlign="left"
        >
          New Template...
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>Create New Template</Dialog.Header>
            <Dialog.Body>
              {FormField(
                "Template Name",
                "e.g. Minecraft, Valheim, Minecraft-Bedrock",
                [template_name, setTemplateName]
              )}
              {FormField(
                "Image",
                "itzg/minecraft-server",
                [template_image, setTemplateImage],
                <>
                  Docker image used to create the server. Find one{" "}
                  <Link href="https://hub.docker.com/" target="_blank">
                    Here
                  </Link>
                  .
                </>
              )}
              {FormField("Port", "random", [template_port, setTemplatePort])}

              <Collapsible.Root>
                <Collapsible.Trigger>
                  Resource Options - Advanced
                </Collapsible.Trigger>
                <Collapsible.Content>
                  {FormField("CPU Cores", "2", [
                    selectedServer ?? "",
                    setTemplateCpu,
                  ])}
                  {FormField("Memory", "4G", [
                    selectedServer ?? "",
                    setTemplateMemory,
                  ])}
                </Collapsible.Content>
              </Collapsible.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={() =>
                  addTemplateApiTemplateAddTemplatePost({
                    body: {
                      name: template_name,
                      image: template_image,
                      resource: {
                        cpu: +template_cpu,
                        memory: template_memory,
                      },
                    },
                  })
                }
              >
                Create
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
