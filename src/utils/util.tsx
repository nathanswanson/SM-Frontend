import { Badge, Field, Input } from '@chakra-ui/react'

export const FormField = (
    label: string,
    placeholder: string,
    state: [string, (value: string) => void],
    helperText?: any,
    optional?: boolean
) => {
    return (
        <Field.Root>
            <Field.Label>
                {label}
                {optional && (
                    <Field.RequiredIndicator
                        fallback={<Badge>(Optional)</Badge>}
                    ></Field.RequiredIndicator>
                )}
            </Field.Label>
            <Input
                placeholder={placeholder}
                value={state[0]}
                onChange={e => state[1](e.target.value)}
            />

            {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
        </Field.Root>
    )
}

export function convertToGB(bytes: number | undefined): number {
    if (bytes === undefined) return 0
    return parseFloat((bytes / (1024 * 1024)).toFixed(2))
}

export function roundToNearest4GB(memory_size: number): number {
    return parseFloat((Math.round(memory_size / 4) * 4).toFixed(2))
}
