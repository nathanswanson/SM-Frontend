'use client'

import { ScrollArea, TreeView, createTreeCollection } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuFile, LuFolder, LuLoaderCircle } from 'react-icons/lu'
import {
    getDirectoryFilenamesApiContainerContainerNameFsListGet,
    readFileApiContainerContainerNameFsGet
} from '../../../lib/hey-api/client'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { TextEditorDialog } from '../dialogs/text-editor'

interface Node {
    id: string
    name: string
    full_path: string
    children?: Node[]
    childrenCount?: number
    disabled?: boolean
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
        children: [
            {
                id: '/',
                name: '/',
                full_path: '/',
                childrenCount: 1
            }
        ]
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
    const [editorInputStream, setEditorInputStream] = useState<ReadableStream<Uint8Array> | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)

    async function getPathFiles(path: string, selectedServer: string): Promise<Node[]> {
        if (!selectedServer) return []
        const strings = await getDirectoryFilenamesApiContainerContainerNameFsListGet({
            credentials: 'include',
            path: { container_name: selectedServer },
            query: { path: path }
        })
        if (!strings.data) return []
        return strings.data.items.map(filePath => {
            return {
                id: filePath,
                full_path: path + filePath,
                name: filePath,
                ...(filePath.includes('.') ? {} : { childrenCount: 1 })
            }
        })
    }

    function loadChildren(details: TreeView.LoadChildrenDetails<Node>): Promise<Node[]> {
        const value = details.valuePath.join('')
        return getPathFiles(value, selectedServer || '')
    }

    async function handleFileSelect(e: TreeView.SelectionChangeDetails<Node>) {
        if (e.focusedValue?.endsWith('/')) return
        if (!selectedServer) return
        const path = e.selectedNodes[0]['full_path']
        const dl = await readFileApiContainerContainerNameFsGet({
            credentials: 'include',
            path: { container_name: selectedServer },
            query: { path: path }
        })

        if (dl?.data && typeof (dl.data as Blob).stream === 'function') {
            setEditorInputStream((dl.data as Blob).stream() as ReadableStream<Uint8Array>)
            setIsEditorOpen(true)
        } else if (dl?.data) {
            // fallback: convert blob to stream using Response
            const stream = new Response(dl.data as Blob).body as ReadableStream<Uint8Array> | null
            if (stream) {
                setEditorInputStream(stream)
                setIsEditorOpen(true)
            }
        }
    }

    useEffect(() => {
        if (initialCollection.rootNode.children) {
            initialCollection.rootNode['children'][0].disabled = !selectedServer

            setCollection(initialCollection)
        }
    }, [selectedServer])

    async function handleEditorOutputStream(outStream: ReadableStream<Uint8Array> | undefined) {
        if (!outStream) return
        const res = new Response(outStream)
        const blob = await res.blob()
        // TODO: send `blob` back
    }

    return (
        <>
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
                                    <TreeView.BranchText>{node.name}</TreeView.BranchText>
                                </TreeView.BranchControl>
                            ) : (
                                <TreeView.Item>
                                    <LuFile />
                                    <TreeView.ItemText>{node.name}</TreeView.ItemText>
                                </TreeView.Item>
                            )
                        }
                    />
                </TreeView.Tree>
            </TreeView.Root>
            <TextEditorDialog
                isOpen={isEditorOpen}
                setIsOpen={setIsEditorOpen}
                inputStream={editorInputStream as any}
                onSave={handleEditorOutputStream}
            />
        </>
    )
}
