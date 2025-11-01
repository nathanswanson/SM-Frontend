export function titleCaseString(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function prettyErrorMessages(errors: Record<string, any>): string {
    const formatError = (error: any): string => {
        if (error && error.message) {
            return error.message
        }
        return 'An unknown error occurred.'
    }

    const processErrors = (errorObject: Record<string, any>): string[] => {
        return Object.entries(errorObject).map(([key, value], index) => {
            if (!value) return ''

            // Handle array of errors (e.g., useFieldArray)
            if (Array.isArray(value)) {
                const subErrors = value
                    .map((itemError, itemIndex) => {
                        if (!itemError) return null
                        const charIndex = String.fromCharCode(itemIndex + 97)
                        const nestedMessages = processErrors(itemError)
                        if (nestedMessages.length > 0) {
                            return `\t- Item ${charIndex}: ${nestedMessages.join(', ')}`
                        }
                        return null
                    })
                    .filter(Boolean)
                    .join('\n')

                return subErrors ? `${index + 1}. ${key}:\n${subErrors}` : ''
            }

            // Handle simple field error
            if (value.message) {
                return `${index + 1}. ${key}: ${formatError(value)}`
            }

            // Handle nested object errors
            const nestedMessages = processErrors(value)
            if (nestedMessages.length > 0) {
                return `${index + 1}. ${key}: ${nestedMessages.join(', ')}`
            }

            return ''
        })
    }

    return processErrors(errors).filter(Boolean).join('\n')
}
