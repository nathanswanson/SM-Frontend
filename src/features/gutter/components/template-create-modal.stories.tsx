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
        await userEvent.type(within(dialog).getByLabelText('Container Image'), 'itzg/minecraft-server')
        await userEvent.type(within(dialog).getByLabelText('Tags'), 'latest')
        await userEvent.type(within(dialog).getByLabelText('Minimum CPU (cores)'), '1')
        await userEvent.type(within(dialog).getByLabelText('Minimum Memory (GB)'), '1')
        await userEvent.type(within(dialog).getByLabelText('Minimum Disk (GB)'), '5')
        const moduleTable = within(within(dialog).getByTestId('template-module-rows'))

        // const rows_0 = moduleTable.getAllByRole('row')
        // // // There should be no rows in the table initially
        // expect(rows_0.length).toBe(0)
        await userEvent.click(within(dialog).getByTestId('add-template-module-button'))
        const rows_1 = moduleTable.getAllByRole('row')
        // There should be one row in the table now
        expect(rows_1.length).toBe(1)
        const rows_2 = moduleTable.getAllByRole('row')
        // There should be no rows in the table now
        const tempQuery = moduleTable.queryAllByRole('checkbox')
        await userEvent.click(tempQuery[0])
    }
}
