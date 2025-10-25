import {
    Button,
    CloseButton,
    Combobox,
    createListCollection,
    Dialog,
    Field,
    Fieldset,
    Portal,
    ScrollArea
} from '@chakra-ui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuDatabase } from 'react-icons/lu'
import { useAsync, useMap } from 'react-use'
import { z } from 'zod'
import { createServer, getTemplate, searchTemplates, TemplatesRead } from '../../../../lib/hey-api/client'
import { TemplateModule } from '../../../components/template-module'
import { MenuSelectButton } from '../../../mocks/menu-select-button'
import { TemplateModuleSchema, TemplateModuleType } from '../../../utils/template-schema'

const formSchema = z.object({
    name: z.string().min(1),
    template_name: z.string().min(1),
    cpu: z.number().min(1).default(1),
    tag: z.string().optional(),
    memory: z.number().min(1).default(1),
    disk: z.number().min(1).default(16),
    description: z.string().max(500).optional(),
    env: z.record(z.string(), z.string())
})

export const ServerCreateDialog = () => {
    type FormData = z.infer<typeof formSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<FormData>({
        // ensure env is always an array at runtime
        defaultValues: { env: {} }
    })

    const [templateMap, { set: setTemplateMap, setAll: setAllTemplateMap }] = useMap<{ [key: string]: number }>({})
    const [selectedTemplate, setSelectedTemplate] = useState<TemplatesRead | undefined>(undefined)

    //names only
    const templateList = createListCollection({
        items: Object.keys(templateMap)
    })

    const templateListState = useAsync(async () => {
        searchTemplates({}).then(res => {
            if (!res.data?.items) {
                setAllTemplateMap({})
                return
            }
            setAllTemplateMap(res.data.items)
        })
    }, [])

    const onSubmit = handleSubmit(data => {
        // transform env array to object map for API
        const envAsStrings = Object.fromEntries(
            Object.entries(data.env).map(([key, value]) => [key, typeof value === 'boolean' ? String(value) : value])
        )
        createServer({
            body: {
                node_id: 1,
                name: data.name,
                tags: data.tag ? [data.tag] : [],
                template_id: selectedTemplate?.id || -1,
                env: envAsStrings,
                cpu: data.cpu,
                disk: data.disk,
                memory: data.memory
            }
        })
    })

    const handleTemplateChange = async (templateName: string) => {
        const template = (await getTemplate({ path: { template_id: templateMap[templateName] } })).data
        setSelectedTemplate(template)
    }

    if (templateListState.loading) {
        return <div>Loading...</div>
    }

    return (
        <Dialog.Root size="lg">
            <Dialog.Trigger asChild>
                <MenuSelectButton color="fg.muted">
                    <LuDatabase />
                    Server Management
                </MenuSelectButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxH="80vh">
                        <Dialog.Header>Create New Template</Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <ScrollArea.Root>
                            <ScrollArea.Viewport scrollSnapType={'y mandatory'}>
                                <ScrollArea.Content scrollSnapType={'y mandatory'} as="form" onSubmit={onSubmit}>
                                    <Dialog.Body>
                                        <Fieldset.Root display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="4">
                                            <TemplateModule
                                                key="server-name"
                                                type={TemplateModuleType.TEXT}
                                                label="Server Name"
                                                required={true}
                                                gridColumn={'1 / span 3'}
                                                control={control}
                                                hookName={'name'}
                                            />
                                            <Field.Root key="template-select" gridColumn={'span 3'}>
                                                <Field.Label>Template</Field.Label>
                                                <Combobox.Root
                                                    collection={templateList}
                                                    onInputValueChange={e => handleTemplateChange(e.inputValue)}
                                                >
                                                    <Combobox.Control>
                                                        <Combobox.Input />
                                                        <Combobox.IndicatorGroup>
                                                            <Combobox.ClearTrigger />
                                                            <Combobox.Trigger />
                                                        </Combobox.IndicatorGroup>
                                                    </Combobox.Control>
                                                    <Combobox.Positioner>
                                                        <Combobox.Content>
                                                            <Combobox.Empty>No Templates found</Combobox.Empty>
                                                            {templateList.items.map(templateName => (
                                                                <Combobox.Item key={templateName} item={templateName}>
                                                                    {templateName}
                                                                    <Combobox.ItemIndicator />
                                                                </Combobox.Item>
                                                            ))}
                                                        </Combobox.Content>
                                                    </Combobox.Positioner>
                                                </Combobox.Root>
                                            </Field.Root>
                                            <TemplateModule
                                                key="cpu"
                                                type={TemplateModuleType.NUMBER}
                                                label="CPU Cores"
                                                required={false}
                                                control={control}
                                                hookName={'cpu'}
                                            />
                                            <TemplateModule
                                                key="memory"
                                                type={TemplateModuleType.NUMBER}
                                                label="Memory (GB)"
                                                required={false}
                                                control={control}
                                                hookName={'memory'}
                                            />
                                            <TemplateModule
                                                key="disk-space"
                                                type={TemplateModuleType.NUMBER}
                                                label="Disk Space (GB)"
                                                required={false}
                                                control={control}
                                                hookName={'disk'}
                                            />
                                            {/* env */}
                                            {selectedTemplate?.modules?.map((field, index) => {
                                                const template = JSON.parse(field) as TemplateModuleSchema
                                                return (
                                                    <>
                                                        <TemplateModule
                                                            key={`env-${index}`}
                                                            type={template.type.toLowerCase() as TemplateModuleType}
                                                            label={template.label}
                                                            description={template.description}
                                                            required={template.required}
                                                            control={control}
                                                            hookName={`env.${template.label}`}
                                                        />
                                                    </>
                                                )
                                            })}
                                        </Fieldset.Root>
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                            <Button variant="subtle">Cancel</Button>
                                        </Dialog.ActionTrigger>
                                        <Button type="submit">Create Server</Button>
                                    </Dialog.Footer>
                                </ScrollArea.Content>
                            </ScrollArea.Viewport>
                            <ScrollArea.Scrollbar>
                                <ScrollArea.Thumb />
                            </ScrollArea.Scrollbar>
                        </ScrollArea.Root>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
