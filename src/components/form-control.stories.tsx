import type { Meta, StoryObj } from '@storybook/react-vite'

import z from 'zod'
import { FormController } from './form-control'

const meta = {
    component: FormController
} satisfies Meta<typeof FormController>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        children: [
            <FormController.Trigger>Trigger</FormController.Trigger>,
            <FormController.Header>Header</FormController.Header>
        ],
        schema: z.object({
            name: z.string()
        })
    }
}
