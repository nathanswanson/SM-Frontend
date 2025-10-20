import { AbsoluteCenter } from '@chakra-ui/react'
import type { Preview } from '@storybook/react-vite'
import { spyOn } from 'storybook/test'
import { SM } from '../src/App'
const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    },
    decorators: [
        Story => (
            <SM>
                <AbsoluteCenter>
                    <Story />
                </AbsoluteCenter>
            </SM>
        )
    ]
}

export const beforeEach = () => {
    spyOn(console, 'log').mockName('console.log')
    spyOn(console, 'error').mockName('console.error')
}

export default preview
