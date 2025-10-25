import {
    BoxProps,
    Checkbox,
    createListCollection,
    Field,
    Input,
    NumberInput,
    Portal,
    Select,
    TagsInput
} from '@chakra-ui/react'
import { Controller, ControllerRenderProps, FieldValues } from 'react-hook-form'
import { TemplateModuleType } from '../utils/template-schema'
interface TemplateModuleBaseProps extends BoxProps {
    field: ControllerRenderProps<FieldValues, string>
}

interface TemplateModuleProps extends BoxProps {
    hookName: string
    control: any
    label: string
    type: TemplateModuleType
    required: boolean
    description?: string
    invalid?: boolean
}

interface NumberModuleProps extends TemplateModuleBaseProps {
    min?: number
    max?: number
    step?: number
    slider?: boolean
}

interface CheckboxModuleProps extends TemplateModuleBaseProps {}

interface SelectModuleProps extends TemplateModuleBaseProps {
    options?: Array<string>
}

const CheckboxModule = ({ field }: CheckboxModuleProps) => {
    return (
        <Checkbox.Root
            name={field.name}
            checked={field.value}
            onCheckedChange={e => {
                console.log(e)
                field.onChange(!!e.checked.valueOf)
            }}
        >
            <Checkbox.HiddenInput />
            <Checkbox.Control>
                <Checkbox.Indicator />
            </Checkbox.Control>
        </Checkbox.Root>
    )
}

const SelectModule = ({ options = [] }: SelectModuleProps) => {
    // return <Select.Root {...rest}></Select.Root>
    const collection = createListCollection<string>({ items: options })

    return (
        <Select.Root collection={collection}>
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                    <Select.ClearTrigger />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        <Select.ItemGroup>
                            {options.map(option => (
                                <Select.Item item={option} key={option}>
                                    <Select.ItemText>{option}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.ItemGroup>
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

const TextModule = ({ field }: TemplateModuleBaseProps) => {
    return (
        <Input
            value={field.value}
            onChange={e => {
                field.onChange(e)
            }}
        />
    )
}
const NumberModule = ({ field }: NumberModuleProps) => {
    return (
        <NumberInput.Root
            value={field.value}
            onValueChange={({ value }) => {
                field.onChange(Number(value))
            }}
        >
            <NumberInput.Control />
            <NumberInput.Input onBlur={field.onBlur} />
        </NumberInput.Root>
    )
}

interface ListModuleProps extends TemplateModuleBaseProps {
    type?: string | number | boolean
    options?: Array<string>
    editable?: boolean
}

const ListModule = ({ field }: ListModuleProps) => {
    return (
        <TagsInput.Root onValueChange={values => field.onChange(values.value)} value={field.value} editable={true}>
            <TagsInput.Control>
                <TagsInput.Items />
                <TagsInput.Input />
                <TagsInput.ClearTrigger />
            </TagsInput.Control>
            <TagsInput.HiddenInput />
        </TagsInput.Root>
    )
}

export const TemplateModule = ({
    type,
    required,
    description,
    label,
    invalid,
    hookName,
    control
}: TemplateModuleProps) => {
    return (
        <Field.Root invalid={invalid}>
            <Field.Label>{label}</Field.Label>
            {required && <Field.RequiredIndicator />}
            <Controller
                name={hookName}
                control={control}
                render={({ field }) => {
                    switch (type.toLowerCase()) {
                        case TemplateModuleType.CHECKBOX:
                            return <CheckboxModule field={field} />
                        case TemplateModuleType.TEXT:
                            return <TextModule field={field} />
                        case TemplateModuleType.SELECT:
                            return <SelectModule field={field} />
                        case TemplateModuleType.NUMBER:
                            return <NumberModule field={field} />
                        case TemplateModuleType.LIST:
                            return <ListModule field={field} />
                        default:
                            return <div>Unknown Module Type {type}</div>
                    }
                }}
            />

            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}
