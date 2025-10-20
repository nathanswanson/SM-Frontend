import type { Meta, StoryObj } from '@storybook/react-vite'

import { DownloadProgress } from './download-progress'

const meta = {
    component: DownloadProgress
} satisfies Meta<typeof DownloadProgress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        current: 0,
        total: 0
    }
}
