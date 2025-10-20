import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@chakra-ui/react'
import { Login } from './login'

const meta = {
    component: Login
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: <Box>Login Page</Box>
    },

    play: async ({ canvas, userEvent }) => {}
}
