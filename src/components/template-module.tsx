import {
    BoxProps,
    Checkbox,
    createListCollection,
    Field,
    IconButton,
    Input,
    NumberInput,
    Popover,
    Portal,
    Select,
    TagsInput
} from '@chakra-ui/react'
import { Edit } from 'lucide-react'
import { ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { FieldType } from '../utils/template-schema'

interface TemplateModuleProps extends BoxProps {
    type?: (typeof FieldType)[keyof typeof FieldType]
    hookName: string
    control: any
    label?: string
    required?: boolean
    description?: string
    invalid?: boolean
    withinPortal?: boolean
    disabled?: boolean
}

interface NumberModuleProps extends TemplateModuleProps {
    type?: typeof FieldType.NUMBER
    min?: number
    max?: number
    step?: number
    slider?: boolean
}

interface SelectModuleProps extends TemplateModuleProps {
    type?: typeof FieldType.SELECT
    options: Array<string>
}

interface ListModuleProps extends TemplateModuleProps {
    type?: typeof FieldType.LIST
    editable?: boolean
}

// Add discriminated props for checkbox and text
interface CheckboxModuleProps extends TemplateModuleProps {
    type?: typeof FieldType.CHECKBOX
}
interface TextModuleProps extends TemplateModuleProps {
    type?: typeof FieldType.TEXT
}

export const CheckboxModule = ({
    disabled,
    hookName,
    control,
    label,
    description,
    invalid,
    type = FieldType.CHECKBOX
}: CheckboxModuleProps) => {
    return (
        <Field.Root invalid={invalid} disabled={disabled}>
            {/* render label only when provided */}
            {label && <Field.Label>{label}</Field.Label>}
            <Controller
                name={hookName}
                control={control}
                render={({ field }) => (
                    <Checkbox.Root checked={field.value} onCheckedChange={({ checked }) => field.onChange(checked)}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                )}
            />
            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}

export const SelectModule = ({
    type = FieldType.SELECT, // @ts-ignore
    hookName,
    control,
    label,
    required,
    description,
    invalid,
    options,
    withinPortal,
    disabled
}: SelectModuleProps) => {
    const collection = createListCollection<string>({ items: options })
    return (
        <Field.Root disabled={disabled} invalid={invalid}>
            <Field.Label>{label}</Field.Label>
            {required && <Field.RequiredIndicator />}
            <Controller
                name={hookName}
                control={control}
                render={({ field }) => (
                    <Select.Root
                        {...(withinPortal ? { positioning: { strategy: 'fixed', hideWhenDetached: true } } : {})}
                        collection={collection}
                        value={field.value ? [field.value] : []}
                        name={field.name}
                        onValueChange={e => field.onChange(e.value[0])}
                        onInteractOutside={() => field.onBlur()}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.ClearTrigger />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal disabled={withinPortal}>
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
                )}
            />
            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}

export interface MiniFormProps {
    invalid?: boolean
    disabled?: boolean
    children: ReactNode
}

export const MiniForm = ({ disabled, invalid, children }: MiniFormProps) => {
    return (
        <Popover.Root positioning={{ strategy: 'fixed', hideWhenDetached: true }}>
            <Popover.Trigger asChild>
                <IconButton
                    borderColor={invalid ? 'fg.error' : 'transparent'}
                    variant={invalid ? 'outline' : 'ghost'}
                    disabled={disabled}
                >
                    <Edit />
                </IconButton>
            </Popover.Trigger>
            <Popover.Positioner>
                <Popover.Content p="1em">{children}</Popover.Content>
            </Popover.Positioner>
        </Popover.Root>
    )
}
export const ButtonModule = MiniForm

export const TextModule = ({
    hookName,
    control,
    disabled,
    label,
    required,
    description,
    invalid,
    type = FieldType.TEXT
}: TextModuleProps) => {
    return (
        <Field.Root disabled={disabled} invalid={invalid}>
            <Field.Label>{label}</Field.Label>
            {required && <Field.RequiredIndicator />}
            <Controller
                name={hookName}
                control={control}
                render={({ field }) => (
                    <Input
                        value={field.value}
                        onChange={e => {
                            // ensure we pass the input's value, not the event
                            field.onChange(e.target.value)
                        }}
                    />
                )}
            />
            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}
export const NumberModule = ({
    hookName,
    disabled,
    control,
    label,
    required,
    description,
    invalid,
    type = FieldType.NUMBER
}: NumberModuleProps) => {
    return (
        <Field.Root disabled={disabled} invalid={invalid}>
            <Field.Label>{label}</Field.Label>
            {required && <Field.RequiredIndicator />}
            <Controller
                name={hookName}
                control={control}
                render={({ field }) => (
                    <NumberInput.Root
                        value={field.value}
                        onValueChange={({ value }) => {
                            field.onChange(Number(value))
                        }}
                    >
                        <NumberInput.Control />
                        <NumberInput.Input onBlur={field.onBlur} />
                    </NumberInput.Root>
                )}
            />
            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}

export const ListModule = ({
    hookName,
    disabled,
    control,
    label,
    required,
    description,
    invalid,
    type = FieldType.LIST
}: ListModuleProps) => {
    return (
        <Field.Root disabled={disabled} invalid={invalid}>
            <Field.Label>{label}</Field.Label>
            {required && <Field.RequiredIndicator />}
            <Controller
                name={hookName}
                control={control}
                render={({ field }) => (
                    <TagsInput.Root
                        onValueChange={values => field.onChange(values.value)}
                        value={field.value}
                        editable={true}
                    >
                        <TagsInput.Control bg="bg.panel">
                            <TagsInput.Items />
                            <TagsInput.Input />
                            <TagsInput.ClearTrigger />
                        </TagsInput.Control>
                        <TagsInput.HiddenInput />
                    </TagsInput.Root>
                )}
            />
            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}

// Make the union strictly discriminated by type; remove broad TemplateModuleProps
type TemplateModuleUnionProps =
    | (NumberModuleProps & { type: typeof FieldType.NUMBER })
    | (SelectModuleProps & { type: typeof FieldType.SELECT })
    | (ListModuleProps & { type: typeof FieldType.LIST })
    | (CheckboxModuleProps & { type: typeof FieldType.CHECKBOX })
    | (TextModuleProps & { type: typeof FieldType.TEXT })

export const TemplateModule = (props: TemplateModuleUnionProps) => {
    switch (props.type) {
        case FieldType.NUMBER:
            return <NumberModule {...props} />
        case FieldType.CHECKBOX:
            return <CheckboxModule {...props} />
        case FieldType.LIST:
            return <ListModule {...props} />
        case FieldType.SELECT:
            return <SelectModule {...props} />
        case FieldType.TEXT:
            return <TextModule {...props} />
        default:
            const _exhaustiveCheck: never = props
            return null
    }
}
