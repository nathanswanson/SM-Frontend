export function mockingEnabled() {
    if (origin.includes('demo')) {
        return true
    }
}
