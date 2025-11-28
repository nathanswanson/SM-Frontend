import { Box } from '@chakra-ui/react/box'
import { GridItem } from '@chakra-ui/react/grid'
import React from 'react'

interface ActionHaloProps {
    rowSpan?: number
    colSpan?: number
    children?: React.ReactNode
}

export const ActionHalo = ({ children, rowSpan, colSpan }: ActionHaloProps) => {
    let contents = null
    let header = null
    let otherChildren: React.ReactNode[] = []
    React.Children.forEach(children, child => {
        if (React.isValidElement(child) && typeof child.type !== 'string') {
            if (child.type === ActionHalo.Contents) {
                contents = child
            } else if (child.type === ActionHalo.Header) {
                header = child
            } else {
                otherChildren.push(child)
            }
        } else {
            otherChildren.push(child)
        }
    })

    return (
        <GridItem
            gap="1em"
            display="flex"
            flexDirection={'column'}
            colSpan={{ base: colSpan, smDown: 3 }}
            rowSpan={rowSpan}
            className="actionhalo-root"
        >
            {header}
            {contents}
        </GridItem>
    )
}

const Contents = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Box className="actionhalo-contents" width="100%" display="flex" flexGrow={1}>
            {children}
        </Box>
    )
}

const Header = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems={'center'}
            p="1em"
            className="actionhalo-header"
            height="5em"
            bg="bg.panel"
            shadow="sm"
            borderRadius="sm"
            width="100%"
        >
            {children}
        </Box>
    )
}

ActionHalo.Header = Header
ActionHalo.Contents = Contents

export default ActionHalo
