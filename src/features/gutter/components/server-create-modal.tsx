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
import { Database } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAsyncFn, useMap } from 'react-use'
import { z } from 'zod/v4'
import { toaster } from '../../../../lib/chakra/toaster'
import { createServer, getTemplate, searchTemplates, TemplatesRead } from '../../../../lib/hey-api/client'
import { MenuSelectButton } from '../../../components/menu-select-button'
import { CheckboxModule, ListModule, NumberModule, SelectModule, TextModule } from '../../../components/template-module'
import { FieldType, NumberModuleSchema, SelectModuleSchema } from '../../../utils/template-schema'

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
        defaultValues: { env: {}, cpu: 1, memory: 1, disk: 16, name: '', template_name: '', description: '', tag: '' }
    })

    const [templateMap, { set: setTemplateMap, setAll: setAllTemplateMap }] = useMap<{ [key: string]: number }>({})
    const [selectedTemplate, setSelectedTemplate] = useState<TemplatesRead | undefined>(undefined)
    const [createServerLoading, setCreateServerLoading] = useState(false)
    const [open, setOpen] = useState(false)
    //names only
    const templateList = createListCollection({
        items: Object.keys(templateMap)
    })

    const [templateListState, fetchTemplates] = useAsyncFn(async () => {
        searchTemplates({}).then(res => {
            if (!res.data?.items) {
                setAllTemplateMap({})
                return
            }
            setAllTemplateMap(res.data.items)
        })
    }, [])

    const onSubmit = handleSubmit(data => {
        setCreateServerLoading(true)
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
            .then(() => {
                setCreateServerLoading(false)
                setOpen(false)
            })
            .catch(ret => {
                setCreateServerLoading(false)
                toaster.error({ title: 'Error creating server', description: ret.message || 'Unknown error occurred' })
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
        <Dialog.Root
            lazyMount
            size="lg"
            open={open}
            onOpenChange={e => {
                if (e.open) {
                    fetchTemplates()
                } else {
                    setSelectedTemplate(undefined)
                }
                setOpen(e.open)
            }}
        >
            <Dialog.Trigger asChild>
                <MenuSelectButton color="fg.muted">
                    <Database />
                    Server Management
                </MenuSelectButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxH="80vh">
                        <Dialog.Header>Create New Server</Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <ScrollArea.Root>
                            <ScrollArea.Viewport scrollSnapType={'y mandatory'}>
                                <ScrollArea.Content scrollSnapType={'y mandatory'} as="form" onSubmit={onSubmit}>
                                    <Dialog.Body>
                                        <Fieldset.Root display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="4">
                                            <TextModule
                                                key="server-name"
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
                                                    onValueChange={e => handleTemplateChange(e.value[0])}
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
                                            <NumberModule
                                                key="cpu"
                                                label="CPU Cores"
                                                required={false}
                                                control={control}
                                                hookName={'cpu'}
                                            />
                                            <NumberModule
                                                key="memory"
                                                label="Memory (GB)"
                                                required={false}
                                                control={control}
                                                hookName={'memory'}
                                            />
                                            <NumberModule
                                                key="disk-space"
                                                label="Disk Space (GB)"
                                                required={false}
                                                control={control}
                                                hookName={'disk'}
                                            />
                                            {/* env */}
                                            {selectedTemplate?.modules?.map((field, index) => {
                                                const template = JSON.parse(field) as any

                                                switch (template.type.toLowerCase()) {
                                                    case FieldType.NUMBER:
                                                        const numberTemplate = template as NumberModuleSchema
                                                        return (
                                                            <NumberModule
                                                                key={`env-${index}`}
                                                                label={numberTemplate.label}
                                                                min={numberTemplate.min}
                                                                max={numberTemplate.max}
                                                                step={numberTemplate.step}
                                                                slider={numberTemplate.slider}
                                                                description={numberTemplate.description}
                                                                required={numberTemplate.required}
                                                                disabled={numberTemplate.readonly}
                                                                control={control}
                                                                hookName={`env.${numberTemplate.label}`}
                                                            />
                                                        )
                                                    case FieldType.LIST:
                                                        return (
                                                            <ListModule
                                                                key={`env-${index}`}
                                                                label={template.label}
                                                                description={template.description}
                                                                required={template.required}
                                                                disabled={template.readonly}
                                                                control={control}
                                                                hookName={`env.${template.label}`}
                                                            />
                                                        )
                                                    case FieldType.SELECT:
                                                        const selectedTemplate = template as SelectModuleSchema
                                                        return (
                                                            <SelectModule
                                                                options={selectedTemplate.options}
                                                                key={`env-${index}`}
                                                                label={template.label}
                                                                description={template.description}
                                                                withinPortal
                                                                required={template.required}
                                                                disabled={template.readonly}
                                                                control={control}
                                                                hookName={`env.${template.label}`}
                                                            />
                                                        )
                                                    case FieldType.BUTTON:
                                                        return (
                                                            <TextModule
                                                                key={`env-${index}`}
                                                                label={template.label}
                                                                description={template.description}
                                                                required={template.required}
                                                                disabled={template.readonly}
                                                                control={control}
                                                                hookName={`env.${template.label}`}
                                                            />
                                                        )

                                                    case FieldType.CHECKBOX:
                                                        return (
                                                            <CheckboxModule
                                                                key={`env-${index}`}
                                                                label={template.label}
                                                                description={template.description}
                                                                required={template.required}
                                                                control={control}
                                                                hookName={`env.${template.label}`}
                                                                disabled={template.readonly}
                                                            />
                                                        )
                                                    default:
                                                        return (
                                                            <TextModule
                                                                key={`env-${index}`}
                                                                label={template.label}
                                                                description={template.description}
                                                                required={template.required}
                                                                control={control}
                                                                hookName={`env.${template.label}`}
                                                                disabled={template.readonly}
                                                            />
                                                        )
                                                }
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

export default ServerCreateDialog
