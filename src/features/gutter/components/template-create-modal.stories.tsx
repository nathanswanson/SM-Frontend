import type { Meta, StoryObj } from '@storybook/react-vite'
import { screen, within } from '@testing-library/react'

import { expect } from 'storybook/test'
import { TemplateCreateDialog } from './template-create-modal'

const meta = {
    component: TemplateCreateDialog
} satisfies Meta<typeof TemplateCreateDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement, userEvent }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
        const dialog = await screen.findByRole('dialog')
        // Check that the dialog opened
        expect(dialog).toBeTruthy()
        await userEvent.type(within(dialog).getByLabelText('Template Name'), 'My Template')
        await userEvent.type(within(dialog).getByLabelText('Template Description'), 'This is my template')
        await userEvent.type(within(dialog).getByLabelText('Container Image'), 'itzg/minecraft-server')
        await userEvent.type(within(dialog).getByLabelText('Image Tags'), 'latest')
        await userEvent.type(within(dialog).getByLabelText('Volumes'), '/data\n')
        await userEvent.keyboard('{Enter}')

        await userEvent.type(within(dialog).getByLabelText('Ports'), '25565')
        await userEvent.keyboard('{Enter}')

        await userEvent.type(within(dialog).getByLabelText('Minimum CPU (cores)'), '1')
        await userEvent.type(within(dialog).getByLabelText('Minimum Memory (GB)'), '1')
        await userEvent.type(within(dialog).getByLabelText('Minimum Disk (GB)'), '16')
        const moduleTable = within(within(dialog).getByTestId('template-module-rows'))

        await userEvent.click(within(dialog).getByTestId('add-template-module-button'))

        const textBoxes = moduleTable.getAllByRole('textbox')
        const key = textBoxes[0]
        const default_value = textBoxes[1]
        const description = textBoxes[2]
        const checkBoxes = moduleTable.getAllByRole('checkbox')
        const required = checkBoxes[0]
        const readonly = checkBoxes[1]

        await userEvent.type(key, 'EULA')

        const select = await moduleTable.getByRole('combobox')
        await userEvent.click(select)
        const select_options = await moduleTable.findByRole('listbox')
        await userEvent.click(within(select_options).getByText('Text', { exact: false }))

        await userEvent.type(default_value, 'FALSE')
        await userEvent.type(description, 'EULA Acceptance')

        await userEvent.click(required)
        await userEvent.click(readonly)

        await userEvent.click(within(dialog).getByRole('button', { name: 'Create Template' }))
    }
}
