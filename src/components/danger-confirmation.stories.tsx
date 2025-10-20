import type { Meta, StoryObj } from '@storybook/react-vite'

import { DangerConfirmation } from './danger-confirmation'

const meta = {
    component: DangerConfirmation
} satisfies Meta<typeof DangerConfirmation>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        resourceName: 'cool.file',
        onConfirm: resourceName => {
            console.log(`Confirmed deletion of ${resourceName}`)
        }
    }
}
