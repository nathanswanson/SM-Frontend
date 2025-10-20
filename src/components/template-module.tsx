import { Checkbox, Field, Input, NumberInput } from '@chakra-ui/react'

export enum TemplateModuleType {
    CHECKBOX = 'checkbox',
    TEXT = 'text',
    SELECT = 'select',
    NUMBER = 'number'
}

interface TemplateModuleBaseProps {
    templateModID: string
}

interface TemplateModuleProps extends TemplateModuleBaseProps {
    label: string
    type: TemplateModuleType
    required: boolean
    description?: string
}

const CheckboxModule = ({ templateModID }: TemplateModuleBaseProps) => {
    return (
        <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control>
                <Checkbox.Indicator />
            </Checkbox.Control>
        </Checkbox.Root>
    )
}

const SelectModule = ({ templateModID }: TemplateModuleBaseProps) => {
    return <div>Select Module</div>
}

const TextModule = ({ templateModID }: TemplateModuleBaseProps) => {
    return <Input id={templateModID}></Input>
}
const NumberModule = ({ templateModID }: TemplateModuleBaseProps) => {
    return (
        <NumberInput.Root id={templateModID}>
            <NumberInput.Input></NumberInput.Input>
        </NumberInput.Root>
    )
}

export const TemplateModule = ({ type, templateModID, required, description, label }: TemplateModuleProps) => {
    let templ = null
    console.log(type)
    switch (type) {
        case TemplateModuleType.CHECKBOX:
            templ = <CheckboxModule templateModID={templateModID} />
            break
        case TemplateModuleType.TEXT:
            templ = <TextModule templateModID={templateModID} />
            break
        case TemplateModuleType.SELECT:
            templ = <SelectModule templateModID={templateModID} />
            break
        case TemplateModuleType.NUMBER:
            templ = <NumberModule templateModID={templateModID} />
            break
        default:
            templ = <div>Unknown Module Type</div>
    }
    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            {required && <Field.RequiredIndicator />}
            {templ}
            {description && <Field.HelperText>{description}</Field.HelperText>}
        </Field.Root>
    )
}
