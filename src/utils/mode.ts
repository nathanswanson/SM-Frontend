export function mockingEnabled() {
    if (origin.includes('demo') || import.meta.env.VITE_MOCKING === 'true') {
        return true
    }
}
