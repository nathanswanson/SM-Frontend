import {
    Button,
    CloseButton,
    createListCollection,
    Dialog,
    Field,
    Fieldset,
    Group,
    Heading,
    IconButton,
    Input,
    Portal,
    ScrollArea,
    Select,
    Table,
    Text,
    Textarea,
    VStack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, SwatchBook, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Control, SubmitErrorHandler, SubmitHandler, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useMap } from 'react-use'
import { z } from 'zod/v4'
import { toaster } from '../../../../lib/chakra/toaster'
import {
    addTemplate,
    getTemplate,
    searchTemplates,
    TemplatesRead,
    updateTemplate
} from '../../../../lib/hey-api/client'
import {
    CheckboxModule,
    ListModule,
    MiniForm,
    NumberModule,
    SelectModule,
    TemplateModule,
    TextModule
} from '../../../components/template-module'
import { MenuSelectButton } from '../../../mocks/menu-select-button'
import {
    buttonModuleSchema,
    checkboxModuleSchema,
    FieldType,
    listModuleSchema,
    numberModuleSchema,
    selectModuleSchema,
    textModuleSchema
} from '../../../utils/template-schema'
import { prettyErrorMessages, titleCaseString } from '../../../utils/util'
const emptyTemplateModule = {
    label: '',
    type: FieldType.TEXT,
    readonly: false,
    required: false,
    description: ''
}

const emptyTemplateCreateForm = {
    name: '',
    image: '',
    tags: [],
    resource_min_cpu: 0,
    resource_min_mem: 0,
    resource_min_disk: 0,
    modules: [],
    exposed_port: [],
    exposed_volume: []
}

const templateTypeCollection = createListCollection<string>({
    items: [FieldType.TEXT, FieldType.NUMBER, FieldType.SELECT, FieldType.CHECKBOX].map(type => titleCaseString(type))
})

const formSchema = z.object({
    name: z.string().min(1, 'Template name is required'),
    image: z.string().min(1, 'Container image is required'),
    tags: z.array(z.string()).min(1),
    resource_min_cpu: z.number().min(1),
    resource_min_mem: z.number().min(1),
    resource_min_disk: z.number().min(16),
    exposed_port: z.array(z.coerce.number()),
    exposed_volume: z.array(z.string()),
    description: z.string().optional(),
    modules: z.array(
        z.discriminatedUnion('type', [
            textModuleSchema,
            numberModuleSchema,
            selectModuleSchema,
            checkboxModuleSchema,
            buttonModuleSchema,
            listModuleSchema
        ])
    )
})

export interface TemplateCreateDialogProps {
    usingSelectedTemplate?: number
}

export const TemplateCreateDialog = ({ usingSelectedTemplate }: TemplateCreateDialogProps) => {
    const [loadingTemplateCreate, setLoadingTemplateCreate] = useState<boolean>(false)
    const [templateMap, { setAll: setAllTemplateMap }] = useMap<{ [key: string]: number }>({})
    const [selectedTemplate, setSelectedTemplate] = useState<TemplatesRead | null>(null)
    const [open, setOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [isCreatingNew, setIsCreatingNew] = useState(false)

    const templateList = createListCollection({
        items: Object.keys(templateMap)
    })

    type FormData = z.input<typeof formSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: emptyTemplateCreateForm,
        mode: 'onBlur'
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'modules'
    })

    // Only fetch template when dialog opens and usingSelectedTemplate is provided
    useEffect(() => {
        if (usingSelectedTemplate && open) {
            getTemplate({ path: { template_id: usingSelectedTemplate } }).then(res => {
                if (res.data) {
                    setSelectedTemplate(res.data)
                    const parsedModules = res.data.modules?.map(m => JSON.parse(m)) ?? []
                    reset({
                        name: res.data.name ?? '',
                        image: res.data.image ?? '',
                        tags: res.data.tags ?? [],
                        exposed_port: (res.data.exposed_port ?? []) as unknown[],
                        exposed_volume: res.data.exposed_volume ?? [],
                        description: res.data.description ?? undefined,
                        resource_min_cpu: res.data.resource_min_cpu ?? 0,
                        resource_min_mem: res.data.resource_min_mem ?? 0,
                        resource_min_disk: res.data.resource_min_disk ?? 0,
                        modules: parsedModules
                    } as FormData)
                }
            })
        }
    }, [open, usingSelectedTemplate])

    const handleAddRow = () => {
        append({ ...emptyTemplateModule })
    }

    const handleTemplateSelect = async (templateName: string) => {
        if (templateName === 'New Template') {
            setSelectedTemplate(null)
            setIsCreatingNew(true)
            reset(emptyTemplateCreateForm) // Reset to default values
            return
        }

        setIsCreatingNew(false)
        const templateId = templateMap[templateName]
        if (templateId) {
            const response = await getTemplate({ path: { template_id: templateId } })
            if (response.data) {
                setSelectedTemplate(response.data)
                // The API returns modules as stringified JSON, so we need to parse them.
                const parsedModules = response.data.modules?.map(m => JSON.parse(m)) ?? []

                // Normalize API response to form types (no nulls, correct arrays).
                reset({
                    name: response.data.name ?? '',
                    image: response.data.image ?? '',
                    tags: response.data.tags ?? [],
                    exposed_port: (response.data.exposed_port ?? []) as unknown[],
                    exposed_volume: response.data.exposed_volume ?? [],
                    description: response.data.description ?? undefined,
                    resource_min_cpu: response.data.resource_min_cpu ?? 0,
                    resource_min_mem: response.data.resource_min_mem ?? 0,
                    resource_min_disk: response.data.resource_min_disk ?? 0,
                    modules: parsedModules
                } as FormData)
            }
        }
    }

    const onSubmit: SubmitHandler<FormData> = data => {
        //modules needs to be string[] made from json[]

        // ensure exposed port is string[]
        if (!selectedTemplate && !isCreatingNew) {
            console.error('No selected template for update, but not creating new?')
            return
        }

        const body = {
            name: data.name,
            image: data.image,
            tags: data.tags,
            exposed_port: data.exposed_port as number[],
            exposed_volume: data.exposed_volume,
            resource_min_cpu: data.resource_min_cpu,
            resource_min_mem: data.resource_min_mem,
            resource_min_disk: data.resource_min_disk,
            description: data.description,
            modules: data.modules.map(module => JSON.stringify(module))
        }
        setLoadingTemplateCreate(true)
        const templateAction = isCreatingNew
            ? addTemplate({
                  body: body
              })
            : updateTemplate({ body: body, path: { template_id: selectedTemplate!.id } })

        templateAction
            .then(ret => {
                if (ret.response.status !== 200) {
                    toaster.error({ title: 'Failed to create template' })
                } else {
                    toaster.success({ title: 'Template created successfully' })
                    setOpen(false)
                }
            })
            .catch(e => {
                toaster.error({ title: 'Failed to create template', description: e.message })
            })
            .finally(() => {
                setLoadingTemplateCreate(false)
            })
    }

    const onError: SubmitErrorHandler<FormData> = errors => {
        try {
            const prettyErrors = prettyErrorMessages(errors)
            setErrorMessage(prettyErrors)
        } catch (e) {
            console.log('Failed to pretty print errors:', e)
        }
        toaster.error({ title: 'Failed to create template ', description: 'See Errors at top of form.' })
    }

    useEffect(() => {
        if (open) {
            searchTemplates({}).then(ret => {
                if (ret.response.status === 200 && ret.data) {
                    setAllTemplateMap({ ...ret.data.items, 'New Template': -1 })
                } else {
                    setAllTemplateMap({})
                }
            })
        }
    }, [open])

    return (
        <Dialog.Root
            size="xl"
            unmountOnExit
            open={open}
            onOpenChange={e => {
                reset(emptyTemplateCreateForm)
                setOpen(e.open)
            }}
        >
            <Dialog.Trigger asChild>
                <MenuSelectButton color="fg.muted">
                    <SwatchBook /> Template Management
                </MenuSelectButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxH="80vh">
                        <Dialog.Header>Template Management</Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <ScrollArea.Root>
                            <ScrollArea.Viewport>
                                <ScrollArea.Content as="form" onSubmit={handleSubmit(onSubmit, onError)}>
                                    <Dialog.Body>
                                        <Text color="fg.error" whiteSpace={'pre-wrap'}>
                                            {errorMessage}
                                        </Text>
                                        <Field.Root>
                                            <Select.Root
                                                positioning={{ strategy: 'fixed', hideWhenDetached: true }}
                                                collection={createListCollection({ items: templateList })}
                                                onValueChange={e => handleTemplateSelect(e.value[0])}
                                                padding={'0em 2em 4em 2em'}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Control>
                                                    <Select.Trigger>
                                                        <Select.ValueText placeholder="Modify/Create Template" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>

                                                <Select.Positioner>
                                                    <Select.Content divideY={'1px'}>
                                                        <Select.ItemGroup>
                                                            {templateList.items.slice(0, -1).map(framework => (
                                                                <Select.Item item={framework} key={framework}>
                                                                    <Select.ItemText>{framework}</Select.ItemText>
                                                                    <Select.ItemIndicator />
                                                                </Select.Item>
                                                            ))}
                                                        </Select.ItemGroup>
                                                        <Select.ItemGroup>
                                                            <Select.Item item="New Template" key="New Template">
                                                                <Select.ItemText>New Template</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        </Select.ItemGroup>
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Select.Root>
                                        </Field.Root>
                                        <Fieldset.Root
                                            disabled={!(selectedTemplate || isCreatingNew)}
                                            display="grid"
                                            gridTemplateColumns="1fr 1fr 1fr"
                                            gap="4"
                                        >
                                            <TextModule
                                                gridColumn={'span 3'}
                                                invalid={!!errors.name}
                                                label="Template Name"
                                                hookName={'name'}
                                                control={control}
                                                description="The name of the template."
                                            />
                                            <Field.Root invalid={!!errors.description} gridColumn={'span 3'}>
                                                <Field.Label>Template Description</Field.Label>
                                                <Textarea {...register('description')} />
                                                <Field.HelperText>
                                                    A brief description of the template. 500 characters max.
                                                </Field.HelperText>
                                            </Field.Root>
                                            <Group gridColumn={'span 3'}>
                                                <TextModule
                                                    invalid={!!errors.image}
                                                    label="Container Image"
                                                    required={true}
                                                    width="100%"
                                                    control={control}
                                                    description="The Docker image for the template."
                                                    hookName="image"
                                                />

                                                <ListModule
                                                    invalid={!!errors.tags}
                                                    label="Image Tags"
                                                    required={true}
                                                    width="100%"
                                                    control={control}
                                                    description="The tags to use for the image."
                                                    hookName={'tags'}
                                                />
                                            </Group>
                                            <ListModule
                                                invalid={!!errors.exposed_volume}
                                                label="Volumes"
                                                required={false}
                                                control={control}
                                                gridColumn={'span 3'}
                                                description="Container volumes to mount."
                                                hookName={'exposed_volume'}
                                            />
                                            <ListModule
                                                invalid={!!errors.exposed_port}
                                                label="Ports"
                                                required={false}
                                                gridColumn={'span 3'}
                                                control={control}
                                                description="Container ports to expose."
                                                hookName={'exposed_port'}
                                            />
                                            <Group gridColumn={'span 3'} gap="4">
                                                <NumberModule
                                                    invalid={!!errors.resource_min_cpu}
                                                    label="Minimum CPU (cores)"
                                                    required={false}
                                                    control={control}
                                                    hookName={'resource_min_cpu'}
                                                />
                                                <NumberModule
                                                    invalid={!!errors.resource_min_mem}
                                                    label="Minimum Memory (GB)"
                                                    required={false}
                                                    control={control}
                                                    hookName={'resource_min_mem'}
                                                />
                                                <NumberModule
                                                    invalid={!!errors.resource_min_disk}
                                                    label="Minimum Disk (GB)"
                                                    required={false}
                                                    control={control}
                                                    hookName="resource_min_disk"
                                                />
                                            </Group>

                                            <Fieldset.ErrorText>
                                                Some fields are invalid. Please check them.
                                            </Fieldset.ErrorText>
                                            <VStack gridColumnEnd={'span 3'}>
                                                <Heading paddingTop="3em">Environment Variables</Heading>

                                                <Table.Root>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.ColumnHeader width="12em">Key</Table.ColumnHeader>
                                                            <Table.ColumnHeader width="12em">Type</Table.ColumnHeader>
                                                            <Table.ColumnHeader width="12em">
                                                                Default Value
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader width="24em">
                                                                Description
                                                            </Table.ColumnHeader>
                                                            <Table.ColumnHeader>Required</Table.ColumnHeader>
                                                            <Table.ColumnHeader>Readonly</Table.ColumnHeader>
                                                            <Table.ColumnHeader>Configure</Table.ColumnHeader>

                                                            <Table.ColumnHeader>
                                                                <IconButton
                                                                    data-testid="add-template-module-button"
                                                                    variant={'ghost'}
                                                                    onClick={handleAddRow}
                                                                >
                                                                    <Plus />
                                                                </IconButton>
                                                            </Table.ColumnHeader>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body data-testid="template-module-rows">
                                                        {fields.map((field, index) => {
                                                            return (
                                                                <ModuleRow
                                                                    key={field.id}
                                                                    index={index}
                                                                    control={control}
                                                                    register={register}
                                                                    remove={remove}
                                                                    errors={errors}
                                                                />
                                                            )
                                                        })}
                                                    </Table.Body>
                                                </Table.Root>
                                            </VStack>
                                        </Fieldset.Root>
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                            <Button variant="subtle">Cancel</Button>
                                        </Dialog.ActionTrigger>
                                        <Button loading={loadingTemplateCreate} type="submit">
                                            {isCreatingNew ? 'Create Template' : 'Save Changes'}
                                        </Button>
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

interface ModuleRowProps {
    index: number
    control: Control<any>
    register: any
    remove: (index: number) => void
    errors: any
}

const ModuleRow = ({ index, control, register, remove, errors }: ModuleRowProps) => {
    const watcherType = useWatch({
        control,
        defaultValue: FieldType.TEXT,
        name: `modules.${index}.type`
    })

    const watcherOptions =
        watcherType == FieldType.SELECT
            ? useWatch({
                  control,
                  defaultValue: [] as string[],
                  name: `modules.${index}.options`
              })
            : undefined

    return (
        <Table.Row key={`template-row-${index}`}>
            <Table.Cell>
                <Field.Root invalid={!!errors.modules?.[index]?.label}>
                    <Input {...register(`modules.${index}.label`)}></Input>
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root invalid={!!errors.modules?.[index]?.type}>
                    <SelectModule
                        hookName={`modules.${index}.type`}
                        control={control}
                        invalid={!!errors.modules?.[index]?.type}
                        options={['text', 'number', 'select', 'checkbox', 'list']}
                        withinPortal={true}
                    />
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root invalid={!!errors.modules?.[index]?.defaultValue}>
                    {watcherType == FieldType.SELECT && (
                        <TemplateModule
                            type={FieldType.SELECT}
                            hookName={`modules.${index}.defaultValue`}
                            control={control}
                            options={watcherOptions}
                            withinPortal
                        />
                    )}
                    {watcherType == FieldType.NUMBER && (
                        <TemplateModule
                            type={FieldType.NUMBER}
                            hookName={`modules.${index}.defaultValue`}
                            control={control}
                            invalid={!!errors.modules?.[index]?.defaultValue}
                        />
                    )}
                    {watcherType != FieldType.SELECT && watcherType != FieldType.NUMBER && (
                        <TemplateModule
                            type={watcherType}
                            hookName={`modules.${index}.defaultValue`}
                            control={control}
                        />
                    )}
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <TextModule
                    hookName={`modules.${index}.description`}
                    control={control}
                    invalid={!!errors.modules?.[index]?.description}
                />
            </Table.Cell>
            <Table.Cell>
                <CheckboxModule
                    hookName={`modules.${index}.required`}
                    control={control}
                    invalid={!!errors.modules?.[index]?.required}
                />
            </Table.Cell>
            <Table.Cell>
                <CheckboxModule
                    hookName={`modules.${index}.readonly`}
                    control={control}
                    invalid={!!errors.modules?.[index]?.readonly}
                />
            </Table.Cell>
            <Table.Cell>
                {(watcherType === FieldType.SELECT || watcherType === FieldType.NUMBER) && (
                    <MiniForm>
                        {watcherType === FieldType.SELECT && (
                            <ListModule
                                label="Options"
                                hookName={`modules.${index}.options`}
                                control={control}
                                invalid={!!errors.modules?.[index]?.options}
                            />
                        )}
                    </MiniForm>
                )}
            </Table.Cell>
            <Table.Cell>
                <IconButton onClick={() => remove(index)} variant={'ghost'}>
                    <X />
                </IconButton>
            </Table.Cell>
        </Table.Row>
    )
}

export default TemplateCreateDialog
