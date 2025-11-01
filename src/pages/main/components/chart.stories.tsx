import type { Meta, StoryObj } from '@storybook/react-vite'

import { SMChart } from './chart'

const meta = {
    component: SMChart
} satisfies Meta<typeof SMChart>

export default meta

type Story = StoryObj<typeof meta>

// export const Default: Story = {
//     args: {
//         label: 'Cpu Usage',
//         color: 'red',
//         data: [
//             { value: 10, unit: '%' },
//             { value: 20, unit: '%' },
//             { value: 15, unit: '%' },
//             { value: 30, unit: '%' },
//             { value: 25, unit: '%' },
//             { value: 40, unit: '%' },
//             { value: 35, unit: '%' },
//             { value: 50, unit: '%' },
//             { value: 45, unit: '%' },
//             { value: 60, unit: '%' }
//         ],
//         unit: '%'
//     },
//     decorators: [
//         Story => (
//             <div style={{ width: '300px', height: '200px' }}>
//                 <Story />
//             </div>
//         )
//     ]
// }
