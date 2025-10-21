import { Box, BoxProps, Checkbox, Field, Input, NumberInput } from '@chakra-ui/react'

export enum TemplateModuleType {
    CHECKBOX = 'checkbox',
    TEXT = 'text',
    SELECT = 'select',
    NUMBER = 'number'
}

interface TemplateModuleBaseProps extends BoxProps {
    templateModID: string
}

interface TemplateModuleProps extends TemplateModuleBaseProps {
    label: string
    type: TemplateModuleType
    required: boolean
    description?: string
}

const CheckboxModule = ({ templateModID, ...rest }: TemplateModuleBaseProps) => {
    return (
        <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control>
                <Checkbox.Indicator />
            </Checkbox.Control>
        </Checkbox.Root>
    )
}

const SelectModule = ({ templateModID, ...rest }: TemplateModuleBaseProps) => {
    // return <Select.Root {...rest}></Select.Root>
    return <Box></Box>
}

const TextModule = ({ templateModID, ...rest }: TemplateModuleBaseProps) => {
    return <Input {...rest}></Input>
}
const NumberModule = ({ templateModID, ...rest }: TemplateModuleBaseProps) => {
    return (
        <NumberInput.Root>
            <NumberInput.Input {...rest}></NumberInput.Input>
        </NumberInput.Root>
    )
}

export const TemplateModule = ({ type, templateModID, required, description, label, ...rest }: TemplateModuleProps) => {
    let templ = null
    switch (type) {
        case TemplateModuleType.CHECKBOX:
            templ = <CheckboxModule templateModID={templateModID} {...rest} />
            break
        case TemplateModuleType.TEXT:
            templ = <TextModule templateModID={templateModID} {...rest} />
            break
        case TemplateModuleType.SELECT:
            templ = <SelectModule templateModID={templateModID} {...rest} />
            break
        case TemplateModuleType.NUMBER:
            templ = <NumberModule templateModID={templateModID} {...rest} />
            break
        default:
            templ = <div>Unknown Module Type</div>
    }
    return (
        <Field.Root {...rest}>
            <Field.Label>{label}</Field.Label>
            {required && <Field.RequiredIndicator />}
            {templ}
            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}
