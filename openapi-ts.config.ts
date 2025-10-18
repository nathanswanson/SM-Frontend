import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
    input: './openapi.json',
    output: 'lib/hey-api/client',
    plugins: ['@hey-api/client-ofetch']
})
