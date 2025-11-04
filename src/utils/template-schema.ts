import { z } from 'zod'
export const FieldType = {
    CHECKBOX: 'checkbox',
    TEXT: 'text',
    SELECT: 'select',
    NUMBER: 'number',
    LIST: 'list',
    BUTTON: 'button'
} as const

export const stringToFieldType = (type: string) => {
    switch (type) {
        case 'checkbox':
            return FieldType.CHECKBOX
        case 'text':
            return FieldType.TEXT
        case 'select':
            return FieldType.SELECT
        case 'number':
            return FieldType.NUMBER
        case 'list':
            return FieldType.LIST
        default:
            return FieldType.TEXT
    }
}

const templateModuleSchema = z.object({
    label: z.string().min(2, 'Key must be at least 2 length'),
    type: z.preprocess(val => (Array.isArray(val) ? val[0] : val), z.string()),
    required: z.coerce.boolean(),
    readonly: z.coerce.boolean(),
    defaultValue: z.any().optional(),
    description: z.string().optional()
})
export type TemplateModuleSchema = z.infer<typeof templateModuleSchema>

export const numberModuleSchema = templateModuleSchema.extend({
    type: z.literal(FieldType.NUMBER),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    slider: z.coerce.boolean().optional()
})

export type NumberModuleSchema = z.infer<typeof numberModuleSchema>

export const selectModuleSchema = templateModuleSchema.extend({
    type: z.literal(FieldType.SELECT),
    options: z.array(z.string()).min(1, 'Select module must have at least one option')
})
export type SelectModuleSchema = z.infer<typeof selectModuleSchema>

export const listModuleSchema = templateModuleSchema.extend({
    type: z.literal(FieldType.LIST)
})
export type ListModuleSchema = z.infer<typeof listModuleSchema>

export const checkboxModuleSchema = templateModuleSchema.extend({
    type: z.literal(FieldType.CHECKBOX)
})
export type CheckboxModuleSchema = z.infer<typeof checkboxModuleSchema>

export const textModuleSchema = templateModuleSchema.extend({
    type: z.literal(FieldType.TEXT)
})
export type TextModuleSchema = z.infer<typeof textModuleSchema>

export const buttonModuleSchema = templateModuleSchema.extend({
    type: z.literal(FieldType.BUTTON)
})
export type ButtonModuleSchema = z.infer<typeof buttonModuleSchema>
