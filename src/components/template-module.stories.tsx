import type { Meta, StoryObj } from '@storybook/react-vite'

import { TemplateModule, TemplateModuleType } from './template-module'

const meta = {
    component: TemplateModule
} satisfies Meta<typeof TemplateModule>

export default meta

type Story = StoryObj<typeof meta>

// A story for the CHECKBOX type
export const Checkbox: Story = {
    args: {
        type: TemplateModuleType.CHECKBOX,
        templateModID: 'EULA',
        required: false,
        description: 'Do you accept the terms laid out in the eula?',
        label: 'EULA'
    }
}

export const Text: Story = {
    args: {
        type: TemplateModuleType.TEXT,
        templateModID: 'ServerName',
        required: true,
        description: 'The name for your new server.',
        label: 'Server Name'
    }
}

export const Number: Story = {
    args: {
        type: TemplateModuleType.NUMBER,
        templateModID: 'PlayerSlots',
        required: true,
        description: 'The maximum number of players allowed.',
        label: 'Player Slots'
    }
}

export const Select: Story = {
    args: {
        type: TemplateModuleType.SELECT,
        templateModID: 'GameMode',
        required: true,
        description: 'Select the game mode for your server.',
        label: 'Game Mode'
    }
}
