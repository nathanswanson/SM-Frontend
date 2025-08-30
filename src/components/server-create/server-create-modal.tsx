import {
  Button,
  CloseButton,
  Combobox,
  Dialog,
  HStack,
  Portal,
  Span,
  Spinner,
  useListCollection,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAsync } from "react-use";
import { listTemplatesApiTemplateListGet } from "../../client";

export const DialogBasic = () => {
  const [inputValue, setInputValue] = useState("");

  const { collection, set } = useListCollection<string>({
    initialItems: [""],
  });

  const state = useAsync(async () => {
    const template_list = await listTemplatesApiTemplateListGet();
    set(template_list.data?.template ?? [""]);
  }, [inputValue, set]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="plain"
          unstyled
          w="100%"
          justifyContent="flex-start"
          textAlign="left"
        >
          New Server...
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create New Server</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Combobox.Root
                width="320px"
                collection={collection}
                placeholder="Search characters..."
                onInputValueChange={(e) => setInputValue(e.inputValue)}
                positioning={{ sameWidth: false, placement: "bottom-start" }}
              >
                <Combobox.Control>
                  <Combobox.Input placeholder="Type to search" />
                  <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                  </Combobox.IndicatorGroup>
                </Combobox.Control>

                <Combobox.Positioner>
                  <Combobox.Content minW="sm">
                    {state.loading ? (
                      <HStack p="4">
                        <Spinner size="xs" borderWidth="1px" />
                        <Span>Loading...</Span>
                      </HStack>
                    ) : state.error ? (
                      <Span p="4" color="fg.error">
                        Error fetching
                      </Span>
                    ) : (
                      collection.items?.map((container) => (
                        <Combobox.Item key={container} item={container}>
                          <Span fontWeight="medium" truncate>
                            {container}
                          </Span>
                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      ))
                    )}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Combobox.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Create</Button>
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
