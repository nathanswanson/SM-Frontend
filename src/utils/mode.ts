export enum SMMode {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
    TESTING = 'testing',
    DEMO = 'demo'
}

export const smMode = import.meta.env.VITE_SM_MODE ?? SMMode.PRODUCTION
export function mockingEnabled() {
    return smMode === SMMode.TESTING || smMode === SMMode.DEMO
}
