import type { Meta, StoryObj } from '@storybook/react-vite'

import { TemplateModule } from './template-module'

const meta = {
    component: TemplateModule
} satisfies Meta<typeof TemplateModule>

export default meta

type Story = StoryObj<typeof meta>

// A story for the CHECKBOX type
// export const Checkbox: Story = {
//     args: {
//         type: TemplateModuleType.CHECKBOX,
//         required: true,
//         description: 'Do you accept the terms laid out in the eula?',
//         label: 'EULA',
//         hookName: 'eulaAccepted'
//     }
// }

// export const Text: Story = {
//     args: {
//         type: TemplateModuleType.TEXT,
//         required: true,
//         description: 'The name for your new server.',
//         label: 'Server Name',
//         hookName: 'serverName'
//     }
// }

// export const Number: Story = {
//     args: {
//         type: TemplateModuleType.NUMBER,
//         required: true,
//         description: 'The maximum number of players allowed.',
//         label: 'Player Slots',
//         hookName: 'playerSlots'
//     }
// }

// export const Select: Story = {
//     args: {
//         type: TemplateModuleType.SELECT,
//         options: ['Survival', 'Creative', 'Adventure', 'Spectator'],
//         required: true,
//         description: 'Select the game mode for your server.',
//         label: 'Game Mode',
//         hookName: 'gameMode'
//     }
// }
