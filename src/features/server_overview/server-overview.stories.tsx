import type { Meta, StoryObj } from '@storybook/react-vite'

import { ServerOverview } from './server-overview'

const meta = {
    component: ServerOverview
} satisfies Meta<typeof ServerOverview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
