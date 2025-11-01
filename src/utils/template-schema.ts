import { z } from 'zod'
export enum TemplateModuleType {
    CHECKBOX = 'checkbox',
    TEXT = 'text',
    SELECT = 'select',
    NUMBER = 'number',
    LIST = 'list'
}

export const templateModuleSchema = z.object({
    label: z.string().min(2, 'Key must be at least 2 length'),
    type: z
        .string()
        .transform(val => val as TemplateModuleType)
        .default(TemplateModuleType.TEXT),
    required: z.coerce.boolean(),
    readonly: z.coerce.boolean(),
    defaultValue: z.any().optional(),
    description: z.string().optional()
})

export type TemplateModuleSchema = z.infer<typeof templateModuleSchema>
