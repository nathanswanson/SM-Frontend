import {
  Button,
  CloseButton,
  Combobox,
  Dialog,
  Field,
  FieldsetRoot,
  HStack,
  Input,
  Portal,
  Span,
  Spinner,
  useListCollection
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAsync } from 'react-use'
import {
  createContainerApiContainerCreateTemplateNamePost,
  listTemplatesApiTemplateListGet
} from '../../../client'

function parsedPort(
  serverPort: string
): { [key: string]: number | null } | null {
  const entries: Record<string, number | null> = {}
  serverPort.split(',').forEach(entry => {
    const portSplit = entry.split(':', 2)
    var portExtNumber = null
    var portInternal = null
    if (portSplit.length == 1) {
      portInternal = portSplit[0]
    } else {
      ;[portExtNumber, portInternal] = portSplit
      portExtNumber = Number(portExtNumber)
    }
    entries[portInternal] = portExtNumber
  })
  return Object.keys(entries).length > 0 ? entries : null
}

function parsedEnv(serverEnv: string): { [key: string]: string } {
  const entries: Record<string, string> = {}
  serverEnv.split(',').map(value => {
    const [envKey, envValue] = value.split('=', 2)
    entries[envKey] = envValue
  })

  return entries
}

export const DialogBasic = () => {
  const [serverPort, setPort] = useState<string>('')
  const [serverEnv, setServerEnv] = useState<string>('')
  const [serverName, setServerName] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const { collection: templateList, set: setTemplateList } =
    useListCollection<string>({
      initialItems: ['']
    })

  const state = useAsync(async () => {
    const template_list = await listTemplatesApiTemplateListGet()
    setTemplateList(template_list.data?.template ?? [''])
  }, [selectedTemplate, setTemplateList])

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
              <FieldsetRoot>
                <Field.Root>
                  <Combobox.Root
                    width="320px"
                    collection={templateList}
                    placeholder="Search characters..."
                    onInputValueChange={value => {
                      setSelectedTemplate(value.inputValue)
                    }}
                    positioning={{
                      sameWidth: false,
                      placement: 'bottom-start'
                    }}
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
                          templateList.items?.map(container => (
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
                </Field.Root>
                <Field.Root>
                  <Field.Label>Server Name</Field.Label>
                  <Input
                    onChange={e => setServerName(e.target.value)}
                    name="server_name"
                    value={serverName}
                  ></Input>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Port</Field.Label>
                  <Field.HelperText>
                    ex. 25565 ex. 25565/tcp ex. 25565:25565/tcp
                  </Field.HelperText>
                  <Input
                    value={serverPort}
                    onChange={value => {
                      setPort(value.target.value)
                    }}
                  ></Input>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Environment Variables</Field.Label>
                  <Field.HelperText>
                    Must be in comma seperate format ex. EULA=TRUE,MODDED=TRUE
                  </Field.HelperText>
                  <Input
                    value={serverEnv}
                    onChange={value => {
                      setServerEnv(value.target.value)
                    }}
                  ></Input>
                </Field.Root>
              </FieldsetRoot>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={() => {
                  createContainerApiContainerCreateTemplateNamePost({
                    body: {
                      template: selectedTemplate,
                      server_name: serverName,
                      port: parsedPort(serverPort),
                      env: parsedEnv(serverEnv)
                    }
                  })
                }}
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
  )
}
