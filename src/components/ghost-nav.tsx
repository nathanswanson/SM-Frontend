import { Box } from '@chakra-ui/react/box'
import { useEffect, useState } from 'react'
import { useWindowContext } from '../providers/window-context'

function minmaxScale(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return Math.min(Math.max(((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin, outMin), outMax)
}

export const GhostNav = ({ ...props }) => {
    const { scrollPosition } = useWindowContext()

    return (
        <Box
            pointerEvents={'none'}
            backgroundImage={'linear-gradient(to bottom, {colors.brand.700}, {transparent})'}
            position="fixed"
            top="0"
            width="100vw"
            zIndex="100"
            opacity={minmaxScale(scrollPosition.y, 0, 100, 0, 0.5)}
            transition="opacity 0.3s ease-in-out"
            height="10em"
            {...props}
        ></Box>
    )
}
