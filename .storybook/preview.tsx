import { AbsoluteCenter, Box } from '@chakra-ui/react'
import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { spyOn } from 'storybook/test'
import { SM } from '../src/App'
import { handlers } from '../src/mocks/handlers'

initialize()

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#1A202C' },
                { name: 'dark', value: '#0D1117' }
            ]
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
        Story => (
            <SM>
                <AbsoluteCenter>
                    <Box bg="bg.panel" borderRadius={'md'} p={'1em'}>
                        <Story />
                    </Box>
                </AbsoluteCenter>
            </SM>
        )
    ],
    loaders: [mswLoader]
}

export const beforeEach = () => {
    spyOn(console, 'log').mockName('console.log')
    spyOn(console, 'error').mockName('console.error')
}

export default preview
