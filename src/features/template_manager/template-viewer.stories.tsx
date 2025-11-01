import type { Meta, StoryObj } from '@storybook/react-vite'

import { TemplateViewer } from './template-viewer'

const meta = {
    component: TemplateViewer
} satisfies Meta<typeof TemplateViewer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
