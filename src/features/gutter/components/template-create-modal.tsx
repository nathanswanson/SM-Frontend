import {
    Button,
    Checkbox,
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
import { useState } from 'react'
import { Control, SubmitErrorHandler, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { toaster } from '../../../../lib/chakra/toaster'
import { addTemplate } from '../../../../lib/hey-api/client'
import { TemplateModule } from '../../../components/template-module'
import { MenuSelectButton } from '../../../mocks/menu-select-button'
import { templateModuleSchema, TemplateModuleType } from '../../../utils/template-schema'
import { prettyErrorMessages, titleCaseString } from '../../../utils/util'

const emptyTemplateModule = {
    label: '',
    type: TemplateModuleType.TEXT,
    readonly: false,
    required: false,
    description: ''
}

const templateTypeCollection = createListCollection<string>({
    items: [
        TemplateModuleType.TEXT,
        TemplateModuleType.NUMBER,
        TemplateModuleType.SELECT,
        TemplateModuleType.CHECKBOX
    ].map(type => titleCaseString(type))
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
    modules: z.array(templateModuleSchema)
})

export const TemplateCreateDialog = () => {
    const [loadingTemplateCreate, setLoadingTemplateCreate] = useState<boolean>(false)
    const [open, setOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    type FormData = z.input<typeof formSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            image: '',
            tags: ['latest'],
            resource_min_cpu: 0,
            resource_min_mem: 0,
            resource_min_disk: 0,
            modules: [],
            exposed_port: [],
            exposed_volume: []
        },
        mode: 'onBlur'
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'modules'
    })

    const handleAddRow = () => {
        append({ ...emptyTemplateModule })
    }

    const onSubmit: SubmitHandler<FormData> = data => {
        //modules needs to be string[] made from json[]

        // ensure exposed port is string[]

        setLoadingTemplateCreate(true)
        addTemplate({
            body: {
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
        })
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

    return (
        <Dialog.Root size="xl" open={open} onOpenChange={e => setOpen(e.open)}>
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
                                        <Fieldset.Root display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="4">
                                            <TemplateModule
                                                gridColumn={'span 3'}
                                                invalid={!!errors.name}
                                                type={TemplateModuleType.TEXT}
                                                label="Template Name"
                                                hookName={'name'}
                                                required={true}
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
                                                <TemplateModule
                                                    invalid={!!errors.image}
                                                    type={TemplateModuleType.TEXT}
                                                    label="Container Image"
                                                    required={true}
                                                    width="100%"
                                                    control={control}
                                                    description="The Docker image for the template."
                                                    hookName="image"
                                                />

                                                <TemplateModule
                                                    invalid={!!errors.tags}
                                                    type={TemplateModuleType.LIST}
                                                    label="Image Tags"
                                                    required={true}
                                                    width="100%"
                                                    control={control}
                                                    description="The tags to use for the image."
                                                    hookName={'tags'}
                                                />
                                            </Group>
                                            <TemplateModule
                                                invalid={!!errors.exposed_volume}
                                                type={TemplateModuleType.LIST}
                                                label="Volumes"
                                                required={false}
                                                control={control}
                                                gridColumn={'span 3'}
                                                description="Container volumes to mount."
                                                hookName={'exposed_volume'}
                                            />
                                            <TemplateModule
                                                invalid={!!errors.exposed_port}
                                                type={TemplateModuleType.LIST}
                                                label="Ports"
                                                required={false}
                                                gridColumn={'span 3'}
                                                control={control}
                                                description="Container ports to expose."
                                                hookName={'exposed_port'}
                                            />
                                            <Group gridColumn={'span 3'} gap="4">
                                                <TemplateModule
                                                    invalid={!!errors.resource_min_cpu}
                                                    type={TemplateModuleType.NUMBER}
                                                    label="Minimum CPU (cores)"
                                                    required={false}
                                                    control={control}
                                                    hookName={'resource_min_cpu'}
                                                />
                                                <TemplateModule
                                                    invalid={!!errors.resource_min_mem}
                                                    type={TemplateModuleType.NUMBER}
                                                    label="Minimum Memory (GB)"
                                                    required={false}
                                                    control={control}
                                                    hookName={'resource_min_mem'}
                                                />
                                                <TemplateModule
                                                    invalid={!!errors.resource_min_disk}
                                                    type={TemplateModuleType.NUMBER}
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
                                                        {fields.map((_, index) => (
                                                            <Table.Row key={`template-row-${index}`}>
                                                                <Table.Cell>
                                                                    <Field.Root
                                                                        invalid={!!errors.modules?.[index]?.label}
                                                                    >
                                                                        <Input
                                                                            {...register(`modules.${index}.label`)}
                                                                        ></Input>
                                                                    </Field.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <Field.Root
                                                                        invalid={!!errors.modules?.[index]?.type}
                                                                    >
                                                                        <Select.Root
                                                                            positioning={{
                                                                                strategy: 'fixed',
                                                                                hideWhenDetached: true
                                                                            }}
                                                                            collection={templateTypeCollection}
                                                                            {...register(`modules.${index}.type`)}
                                                                            invalid={!!errors.modules?.[index]?.type}
                                                                        >
                                                                            <Select.HiddenSelect />
                                                                            <Select.Control>
                                                                                <Select.Trigger>
                                                                                    <Select.ValueText />
                                                                                </Select.Trigger>
                                                                                <Select.IndicatorGroup>
                                                                                    <Select.Indicator />
                                                                                </Select.IndicatorGroup>
                                                                            </Select.Control>
                                                                            <Select.Positioner>
                                                                                <Select.Content>
                                                                                    {templateTypeCollection.items.map(
                                                                                        item => (
                                                                                            <Select.Item
                                                                                                item={item}
                                                                                                key={item}
                                                                                            >
                                                                                                <Select.ItemText>
                                                                                                    {item}
                                                                                                </Select.ItemText>
                                                                                                <Select.ItemIndicator />
                                                                                            </Select.Item>
                                                                                        )
                                                                                    )}
                                                                                </Select.Content>
                                                                            </Select.Positioner>
                                                                        </Select.Root>
                                                                    </Field.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <Field.Root
                                                                        invalid={
                                                                            !!errors.modules?.[index]?.defaultValue
                                                                        }
                                                                    >
                                                                        <Input
                                                                            {...register(
                                                                                `modules.${index}.defaultValue`
                                                                            )}
                                                                        ></Input>
                                                                    </Field.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <Field.Root
                                                                        invalid={!!errors.modules?.[index]?.description}
                                                                    >
                                                                        <Input
                                                                            {...register(
                                                                                `modules.${index}.description`
                                                                            )}
                                                                        ></Input>
                                                                    </Field.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <Field.Root
                                                                        invalid={!!errors.modules?.[index]?.required}
                                                                    >
                                                                        <Checkbox.Root
                                                                            size="md"
                                                                            {...register(`modules.${index}.required`)}
                                                                        >
                                                                            <Checkbox.HiddenInput />
                                                                            <Checkbox.Control />
                                                                        </Checkbox.Root>
                                                                    </Field.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <Field.Root
                                                                        invalid={!!errors.modules?.[index]?.readonly}
                                                                    >
                                                                        <Checkbox.Root
                                                                            size="md"
                                                                            {...register(`modules.${index}.readonly`)}
                                                                        >
                                                                            <Checkbox.HiddenInput />
                                                                            <Checkbox.Control />
                                                                        </Checkbox.Root>
                                                                    </Field.Root>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <IconButton
                                                                        onClick={() => remove(index)}
                                                                        variant={'ghost'}
                                                                    >
                                                                        <X />
                                                                    </IconButton>
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        ))}
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
                                            Create Template
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

interface EnvTableProps {
    control: Control<any>
}
