import {
    Button,
    CloseButton,
    Combobox,
    createListCollection,
    Dialog,
    Field,
    Fieldset,
    HStack,
    IconButton,
    Input,
    InputGroup,
    NumberInput,
    Portal,
    Span,
    Spinner
} from '@chakra-ui/react'

import { useState } from 'react'
import { FaDatabase } from 'react-icons/fa6'
import { LuRefreshCcw } from 'react-icons/lu'
import { useAsync } from 'react-use'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { createServer, searchTemplates } from '../../../../lib/hey-api/client'
import { MenuSelectButton } from '../../../mocks/menu-select-button'
import { useSelectedServerContext } from '../../../providers/selected-server-context'

function parsedPort(serverPort: string): { [key: string]: number | null } | null {
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

// does not include template name
// or envs that would be dependent on template
interface ServerCreateFormData {
    name: string
    cpu: number
    memory: number
    disk: number
}

const colSpan = (span: number) => ({ gridColumn: `1 / span ${span}` })

export const ServerCreationDialog = () => {
    // dynamic import of unique-names-generator

    const { setSelectedServer } = useSelectedServerContext()
    const [createServerLoading, setCreateServerLoading] = useState<boolean>(false)
    const [open, setOpen] = useState(false)
    const [templateMap, setTemplateMap] = useState<{ [key: string]: number } | undefined>({})

    // form data
    const [formData, setFormData] = useState<ServerCreateFormData>({
        name: uniqueNamesGenerator({ length: 2, separator: '-', dictionaries: [adjectives, colors, animals] }),
        cpu: 1,
        memory: 1,
        disk: 16
    })

    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const node_id = 1 // for now, only one node
    const templateNames = createListCollection({
        items: Object.keys(templateMap || {})
    })

    const state = useAsync(async () => {
        if (open) {
            const templateList = await searchTemplates({ credentials: 'include' })
            setTemplateMap(templateList.data?.items)
        }
    }, [open])

    const generateSuggestedName = () => {
        return uniqueNamesGenerator({ length: 2, separator: '-', dictionaries: [adjectives, colors, animals] })
    }

    const create_server = async () => {
        setCreateServerLoading(true)
        if (templateMap !== undefined) {
            if (!formData) {
                setCreateServerLoading(false)
                return
            }
            createServer({
                credentials: 'include',
                body: {
                    ...formData,
                    node_id: node_id,
                    template_id: templateMap[selectedTemplate],
                    env: {} // TODO: Add env parsing
                }
            })
                .finally(() => {
                    // Server Responded
                    setCreateServerLoading(false)
                })
                .then(() => {
                    // Created successfully
                    setOpen(false)
                    setSelectedServer(undefined)
                })
        }
    }
    return (
        <Dialog.Root lazyMount size="lg" open={open} onOpenChange={e => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <MenuSelectButton color="fg.muted">
                    <FaDatabase />
                    Create New Server
                </MenuSelectButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Create New Server</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body as="form">
                            <Fieldset.Root
                                borderRadius={'sm'}
                                p="1em"
                                borderWidth={1}
                                gridAutoRows={'auto'}
                                gridTemplateColumns={'repeat(3, 1fr)'}
                                display={'grid'}
                                gridGap={'1em'}
                            >
                                <Fieldset.Legend>Server Details</Fieldset.Legend>
                                <Field.Root {...colSpan(3)}>
                                    <Field.Label>Template</Field.Label>
                                    <Combobox.Root
                                        maxW="390px"
                                        collection={templateNames}
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
                                                    templateNames.items?.map(container => (
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
                                <Field.Root aria-autocomplete="none" {...colSpan(3)}>
                                    <Field.Label>Server Name</Field.Label>
                                    <InputGroup
                                        maxW="390px"
                                        endElement={
                                            <IconButton
                                                onClick={() => {
                                                    setFormData({ ...formData, name: generateSuggestedName() })
                                                }}
                                                size="xs"
                                                color="fg.muted"
                                                variant={'plain'}
                                            >
                                                <LuRefreshCcw />
                                            </IconButton>
                                        }
                                        endElementProps={{ padding: '0.25em' }}
                                    >
                                        <Input
                                            autoComplete="off"
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            name="server_name"
                                            value={formData.name}
                                        />
                                    </InputGroup>
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>CPU cores</Field.Label>
                                    <NumberInput.Root defaultValue="1" step={1} min={1}>
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Memory</Field.Label>
                                    <NumberInput.Root
                                        defaultValue="1"
                                        step={1}
                                        min={1}
                                        formatOptions={{
                                            style: 'unit',
                                            unit: 'gigabyte'
                                        }}
                                    >
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Disk</Field.Label>
                                    <NumberInput.Root
                                        defaultValue="16"
                                        step={16}
                                        min={16}
                                        formatOptions={{
                                            style: 'unit',
                                            unit: 'gigabyte'
                                        }}
                                    >
                                        <NumberInput.Control />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </Field.Root>
                            </Fieldset.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button size="md" variant="outline">
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button size="md" type="submit" onClick={create_server} loading={createServerLoading}>
                                Create
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="md" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
