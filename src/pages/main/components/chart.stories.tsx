import type { Meta, StoryObj } from '@storybook/react-vite'

import { SMChart } from './chart'

const meta = {
    component: SMChart
} satisfies Meta<typeof SMChart>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        label: 'Cpu Usage',
        color: 'red',
        data: [
            { timestamp: 0, value: 10, unit: '%' },
            { timestamp: 1, value: 20, unit: '%' },
            { timestamp: 2, value: 15, unit: '%' },
            { timestamp: 3, value: 30, unit: '%' },
            { timestamp: 4, value: 25, unit: '%' },
            { timestamp: 5, value: 40, unit: '%' },
            { timestamp: 6, value: 35, unit: '%' },
            { timestamp: 7, value: 50, unit: '%' },
            { timestamp: 8, value: 45, unit: '%' },
            { timestamp: 9, value: 60, unit: '%' }
        ],
        unit: '%'
    },
    decorators: [
        Story => (
            <div style={{ width: '300px', height: '200px' }}>
                <Story />
            </div>
        )
    ]
}
