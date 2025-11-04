import { AbsoluteCenter, Badge, Box } from '@chakra-ui/react'
import type { Preview } from '@storybook/react-vite'
import { http, passthrough } from 'msw'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { spyOn } from 'storybook/test'
import { Provider as URQLProvider } from 'urql'
import { Toaster } from '../lib/chakra/toaster'
import { SM } from '../src/App'
import { handlers } from '../src/mocks/handlers'
import { graphql_client } from '../src/providers/graphql'
import { getBaseUrl } from '../src/utils/api'

const worker = initialize()

const preview: Preview = {
    parameters: {
        backgrounds: {
            options: {
                light: { name: 'light', value: '#1A202C' },
                dark: { name: 'dark', value: '#0D1117' }
            }
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        msw: {
            handlers
        }
    },

    decorators: [
        (Story, context) => {
            const { apiSource } = context.globals

            // Disable MSW if using real server
            // if (apiSource === 'real') {
            worker.use(
                http.all('/*', () => {
                    return passthrough()
                })
            )
            // } else {
            //     worker.resetHandlers(...handlers)
            // }
            return (
                <SM>
                    <AbsoluteCenter>
                        <Box bg="bg.panel" borderRadius={'md'} p={'1em'} position="relative">
                            <Badge
                                position="fixed"
                                top={-8}
                                right={0}
                                zIndex={9999}
                                colorScheme={apiSource === 'real' ? 'green' : 'blue'}
                            >
                                {apiSource === 'real' ? `Real API: ${getBaseUrl()}` : 'Mock API'}
                            </Badge>
                            <URQLProvider value={graphql_client}>
                                <Story />
                            </URQLProvider>
                        </Box>
                    </AbsoluteCenter>
                    <Toaster />
                </SM>
            )
        }
    ],

    globalTypes: {
        apiSource: {
            name: 'API Source',
            defaultValue: 'mock',
            description: 'Source of API data',
            toolbar: {
                title: 'Server Source',
                items: [
                    { value: 'mock', title: 'Mock Server' },
                    { value: 'real', title: 'Real Server' }
                ]
            }
        }
    },

    loaders: [mswLoader],

    initialGlobals: {
        backgrounds: {
            value: 'light'
        }
    }
}

export const beforeEach = () => {
    spyOn(console, 'log').mockName('console.log')
    spyOn(console, 'error').mockName('console.error')
}

export default preview
