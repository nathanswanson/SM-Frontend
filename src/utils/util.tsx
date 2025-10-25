export function titleCaseString(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function prettyErrorMessages(errors: Record<string, any>): string {
    return Object.entries(errors)
        .map((error: [string, any], index) => {
            let message = ''
            // Handle nested errors for modules
            if (Array.isArray(error[1])) {
                message += `${index}. ${errors[0]}:\n`
                const moduleErrors = error[1].map((modError: any, modIndex: number) => {
                    const charIndex = String.fromCharCode(modIndex + 97)
                    if (modError) {
                        const fieldErrors = Object.entries(modError).map(
                            (fieldError: [string, any]) => fieldError[1].message
                        )
                        return `\t\t${charIndex}. ${fieldErrors.join(', ')}`
                    }
                })
                message += moduleErrors.join('\n')
            } else {
                message = `${index + 1}. ${error[1]['message']}`
            }
            return message
        })
        .join('\n')
}
