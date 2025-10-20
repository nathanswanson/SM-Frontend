import type { Meta, StoryObj } from '@storybook/react-vite'

import { TemplateCreateDialog } from './template-create-modal'

const meta = {
    component: TemplateCreateDialog
} satisfies Meta<typeof TemplateCreateDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
