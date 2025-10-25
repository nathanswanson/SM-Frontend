import type { Meta, StoryObj } from '@storybook/react-vite'

import { MainContent } from './server-manager'

const meta = {
    component: MainContent
} satisfies Meta<typeof MainContent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
