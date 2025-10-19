import { Checkbox } from '@chakra-ui/react'

export enum TemplateModuleType {
    CHECKBOX = 'checkbox',
    TEXT = 'text',
    SELECT = 'select',
    NUMBER = 'number'
}

interface TemplateModuleProps {
    type: TemplateModuleType
    key: string
    required: boolean
    description?: string
    label: string
}

const CheckboxModule = ({ type, key, required, description, label }: TemplateModuleProps) => {
    return (
        <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control>
                <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>{label}</Checkbox.Label>
        </Checkbox.Root>
    )
}

const SelectModule = ({ type, key, required, description, label }: TemplateModuleProps) => {
    return <div>Select Module: {label}</div>
}

const TextModule = ({ type, key, required, description, label }: TemplateModuleProps) => {
    return <div>Text Module: {label}</div>
}
const NumberModule = ({ type, key, required, description, label }: TemplateModuleProps) => {
    return <div>Number Module: {label}</div>
}

export const TemplateModule = ({ type, key, required, description, label, ...props }: TemplateModuleProps) => {
    switch (type) {
        case TemplateModuleType.CHECKBOX:
            return (
                <CheckboxModule
                    key={key}
                    required={required}
                    label={label}
                    description={description}
                    type={type}
                    {...props}
                />
            )
        case TemplateModuleType.TEXT:
            return (
                <TextModule
                    key={key}
                    required={required}
                    label={label}
                    description={description}
                    type={type}
                    {...props}
                />
            )
        case TemplateModuleType.SELECT:
            return (
                <SelectModule
                    key={key}
                    required={required}
                    label={label}
                    description={description}
                    type={type}
                    {...props}
                />
            )
        case TemplateModuleType.NUMBER:
            return (
                <NumberModule
                    key={key}
                    required={required}
                    label={label}
                    description={description}
                    type={type}
                    {...props}
                />
            )
        default:
            return <div>Unknown Module Type</div>
    }
}
