'use client'

import { ScrollArea, TreeView, createTreeCollection } from '@chakra-ui/react'
import { useState } from 'react'
import { LuFile, LuFolder, LuLoaderCircle } from 'react-icons/lu'
import {
    getDirectoryFilenamesApiContainerContainerNameFsListGet,
    readFileApiContainerContainerNameFsGet
} from '../../../lib/hey-api/client'
import { useSelectedServerContext } from '../../providers/selected-server-context'
interface Node {
    id: string
    name: string
    full_path: string
    children?: Node[]
    childrenCount?: number
}

async function getPathFiles(
    path: string,
    selectedServer: string
): Promise<Node[]> {
    if (!selectedServer) return []
    const strings =
        await getDirectoryFilenamesApiContainerContainerNameFsListGet({
            path: { container_name: selectedServer },
            query: { path: path }
        })
    if (!strings.data) return []
    return strings.data.map(filePath => {
        return {
            id: filePath,
            full_path: path + filePath,
            name: filePath,
            ...(filePath.includes('.') ? {} : { childrenCount: 1 })
        }
    })
}

// function to load children of a node

const initialCollection = createTreeCollection<Node>({
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    rootNode: {
        id: 'ROOT',
        name: '',
        full_path: '',
        // single placeholder entry for the root; real children will be loaded via loadChildren
        children: [{ id: '/', name: '/', full_path: '/', childrenCount: 1 }]
    }
})

export const FileManager = ({ ...props }) => {
    return (
        <ScrollArea.Root {...props}>
            <ScrollArea.Viewport h="95%">
                <ScrollArea.Content h="95%">
                    <FileTree />
                </ScrollArea.Content>
                <ScrollArea.Scrollbar>
                    <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
            </ScrollArea.Viewport>
        </ScrollArea.Root>
    )
}

const FileTree = () => {
    const [collection, setCollection] = useState(initialCollection)
    const { selectedServer } = useSelectedServerContext()

    function loadChildren(
        details: TreeView.LoadChildrenDetails<Node>
    ): Promise<Node[]> {
        const value = details.valuePath.join('')
        return getPathFiles(value, selectedServer || '')
    }
    async function handleFileSelect(e: TreeView.SelectionChangeDetails<Node>) {
        if (e.focusedValue?.endsWith('/')) return
        if (!selectedServer) return
        console.log(selectedServer)
        console.log(!selectedServer)
        const path = e.selectedNodes[0]['full_path']
        readFileApiContainerContainerNameFsGet({
            path: { container_name: selectedServer },
            query: { path: path }
        }).then(dl => {
            const url = URL.createObjectURL(dl.data as Blob)
            const a = document.createElement('a')
            a.href = url
            a.download = e.selectedNodes[0]['id']
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        })
    }
    return (
        <TreeView.Root
            aspectRatio={1 / 1.5}
            size="md"
            collection={collection}
            loadChildren={loadChildren}
            onLoadChildrenComplete={e => setCollection(e.collection)}
            onSelectionChange={handleFileSelect}
        >
            <TreeView.Label>Tree</TreeView.Label>
            <TreeView.Tree height="95%">
                <TreeView.Node<Node>
                    indentGuide={<TreeView.BranchIndentGuide />}
                    render={({ node, nodeState }) =>
                        nodeState.isBranch ? (
                            <TreeView.BranchControl>
                                {nodeState.loading ? (
                                    <LuLoaderCircle
                                        style={{
                                            animation: 'spin 1s infinite'
                                        }}
                                    />
                                ) : (
                                    <LuFolder />
                                )}
                                <TreeView.BranchText>
                                    {node.name}
                                </TreeView.BranchText>
                            </TreeView.BranchControl>
                        ) : (
                            <TreeView.Item>
                                <LuFile />
                                <TreeView.ItemText>
                                    {node.name}
                                </TreeView.ItemText>
                            </TreeView.Item>
                        )
                    }
                />
            </TreeView.Tree>
        </TreeView.Root>
    )
}
