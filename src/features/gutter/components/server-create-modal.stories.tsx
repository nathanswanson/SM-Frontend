import type { Meta, StoryObj } from '@storybook/react-vite'

import { ServerCreationDialog } from './server-create-modal'

const meta = {
    component: ServerCreationDialog
} satisfies Meta<typeof ServerCreationDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
