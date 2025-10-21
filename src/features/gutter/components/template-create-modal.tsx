import {
    Button,
    Checkbox,
    CloseButton,
    createListCollection,
    Dialog,
    Fieldset,
    Heading,
    IconButton,
    Input,
    Portal,
    ScrollArea,
    Select,
    Table
} from '@chakra-ui/react'

import { useFieldArray, useForm } from 'react-hook-form'
import { FaSwatchbook } from 'react-icons/fa6'
import { LuPlus, LuX } from 'react-icons/lu'
import { z } from 'zod'
import { TemplateModule, TemplateModuleType } from '../../../components/template-module'
import { MenuSelectButton } from '../../../mocks/menu-select-button'
import { titleCaseString } from '../../../utils/util'

interface TemplateModuleData {
    templateModID: string
    label: string
    type: TemplateModuleType
    required: boolean
    description?: string
}

const emptyTemplateModule: TemplateModuleData = {
    templateModID: '',
    label: '',
    type: TemplateModuleType.TEXT,
    required: false,
    description: ''
}

const templateTypeCollection = createListCollection<string>({
    items: [
        TemplateModuleType.TEXT,
        TemplateModuleType.NUMBER,
        TemplateModuleType.SELECT,
        TemplateModuleType.CHECKBOX
    ].map((type: TemplateModuleType) => titleCaseString(type))
})

export const TemplateCreateDialog = () => {
    const rowSchema = z.object({
        templateModID: z.string(),
        label: z.string(),
        type: z.enum([
            TemplateModuleType.TEXT,
            TemplateModuleType.NUMBER,
            TemplateModuleType.SELECT,
            TemplateModuleType.CHECKBOX
        ]),
        required: z.boolean(),
        description: z.string().optional()
    })

    const formSchema = z.object({
        templateName: z.string().min(1, 'Template name is required'),
        containerImage: z.string().min(1, 'Container image is required'),
        containerTags: z.string().optional(),
        minCPU: z.number().min(0).optional(),
        minMemory: z.number().min(0).optional(),
        minDisk: z.number().min(0).optional(),
        description: z.string().optional(),
        modules: z.array(rowSchema)
    })

    type FormData = z.infer<typeof formSchema>
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<FormData>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'modules'
    })

    const handleAddRow = () => {
        append({ ...emptyTemplateModule, templateModID: `mod-${fields.length + 1}` })
    }

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })

    return (
        <Dialog.Root size="xl">
            <Dialog.Trigger asChild>
                <MenuSelectButton color="fg.muted">
                    <FaSwatchbook />
                    Create Template
                </MenuSelectButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxH="80vh">
                        <Dialog.Header>Create New Template</Dialog.Header>

                        <ScrollArea.Root>
                            <ScrollArea.Viewport>
                                <ScrollArea.Content as="form" onSubmit={onSubmit}>
                                    <Dialog.Body>
                                        <Fieldset.Root display="grid" gridTemplateColumns="1fr 1fr 1fr" gap="4">
                                            <TemplateModule
                                                templateModID="template-name"
                                                type={TemplateModuleType.TEXT}
                                                label="Template Name"
                                                required={true}
                                                description="The name of the template."
                                                gridColumn="span 3"
                                                maxWidth={'50%'}
                                                {...register('templateName', { required: true })}
                                            />
                                            <TemplateModule
                                                templateModID="template-image"
                                                type={TemplateModuleType.TEXT}
                                                label="Container Image"
                                                required={true}
                                                description="The Docker image for the template."
                                                gridColumn={'span 3'}
                                                maxWidth={'50%'}
                                                {...register('containerImage', { required: true })}
                                            />
                                            <TemplateModule
                                                templateModID="template-tags"
                                                type={TemplateModuleType.TEXT}
                                                label="Container Tags"
                                                required={false}
                                                description="Image tags (comma separated)."
                                                gridColumn={'span 3'}
                                                maxWidth={'30%'}
                                                {...register('containerTags')}
                                            />

                                            <TemplateModule
                                                templateModID="template-min-cpu"
                                                type={TemplateModuleType.NUMBER}
                                                label="Minimum CPU (cores)"
                                                required={false}
                                                {...register('minCPU')}
                                            />
                                            <TemplateModule
                                                templateModID="template-min-mem"
                                                type={TemplateModuleType.NUMBER}
                                                label="Minimum Memory (GB)"
                                                required={false}
                                                {...register('minMemory')}
                                            />
                                            <TemplateModule
                                                templateModID="template-min-disk"
                                                type={TemplateModuleType.NUMBER}
                                                label="Minimum Disk (GB)"
                                                required={false}
                                                {...register('minDisk')}
                                            />
                                        </Fieldset.Root>
                                        <Heading padding="10px">Environment Variables</Heading>

                                        <Table.Root>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.ColumnHeader width="12em">Key</Table.ColumnHeader>
                                                    <Table.ColumnHeader width="12em">Type</Table.ColumnHeader>
                                                    <Table.ColumnHeader width="24em">Description</Table.ColumnHeader>
                                                    <Table.ColumnHeader>Required</Table.ColumnHeader>
                                                    <Table.ColumnHeader>
                                                        <IconButton
                                                            data-testid="add-template-module-button"
                                                            variant={'ghost'}
                                                            onClick={handleAddRow}
                                                        >
                                                            <LuPlus />
                                                        </IconButton>
                                                    </Table.ColumnHeader>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body data-testid="template-module-rows">
                                                {fields.map((mod, index) => (
                                                    <Table.Row key={mod.templateModID}>
                                                        <Table.Cell>
                                                            <Input {...register(`modules.${index}.label`)}></Input>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Select.Root
                                                                positioning={{
                                                                    strategy: 'fixed',
                                                                    hideWhenDetached: true
                                                                }}
                                                                collection={templateTypeCollection}
                                                                {...register(`modules.${index}.type`)}
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
                                                                        {templateTypeCollection.items.map(item => (
                                                                            <Select.Item item={item} key={item}>
                                                                                <Select.ItemText>
                                                                                    {item}
                                                                                </Select.ItemText>
                                                                                <Select.ItemIndicator />
                                                                            </Select.Item>
                                                                        ))}
                                                                    </Select.Content>
                                                                </Select.Positioner>
                                                            </Select.Root>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Input
                                                                {...register(`modules.${index}.description`)}
                                                            ></Input>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Checkbox.Root
                                                                size="md"
                                                                {...register(`modules.${index}.required`)}
                                                            >
                                                                <Checkbox.HiddenInput />
                                                                <Checkbox.Control />
                                                            </Checkbox.Root>
                                                        </Table.Cell>

                                                        <Table.Cell>
                                                            <IconButton onClick={() => remove(index)} variant={'ghost'}>
                                                                <LuX />
                                                            </IconButton>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table.Root>
                                    </Dialog.Body>
                                    <Dialog.Footer>
                                        <Dialog.ActionTrigger asChild>
                                            <Button variant="subtle">Cancel</Button>
                                        </Dialog.ActionTrigger>
                                        <Button type="submit">Create Template</Button>
                                    </Dialog.Footer>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                                </ScrollArea.Content>
                            </ScrollArea.Viewport>
                        </ScrollArea.Root>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
