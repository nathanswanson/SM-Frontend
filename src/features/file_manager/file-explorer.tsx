'use client'

import { Box, Button, IconButton, ScrollArea, TreeView, VStack, createTreeCollection } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuFile, LuFolder, LuLoaderCircle } from 'react-icons/lu'
import {
    getDirectoryFilenamesApiContainerContainerNameFsListGet,
    readFileApiContainerContainerNameFsGet,
    uploadFileApiContainerContainerNameFsUploadPost
} from '../../lib/hey-api/client'
import { useSelectedServerContext } from '../../providers/selected-server-context'
import { TextEditorDialog } from './components/text-editor'
import { DisabledModule } from '../../components/disabled-module'
import { relative } from 'path'
import { FaDownload, FaFileExport, FaUpload } from 'react-icons/fa6'

const TEXT_EDITOR_FILE_SIZE_LIMIT = 1024 * 1024 * 5 // 5 MB
const ALLOWED_TEXT_FILE_EXTENSIONS = [
    '.txt',
    '.md',
    '.json',
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.html',
    '.css',
    '.py',
    '.java',
    '.c',
    '.cpp',
    '.rb',
    '.go',
    '.rs',
    '.log',
    '.sh',
    '.properties'
]

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
    const { selectedServer } = useSelectedServerContext()

    return (
        <>
            {!selectedServer ? (
                <DisabledModule requester="files" />
            ) : (
                <ScrollArea.Root height="30em" {...props}>
                    <ScrollArea.Viewport>
                        <ScrollArea.Content>
                            <FileTree />
                        </ScrollArea.Content>
                        <ScrollArea.Scrollbar>
                            <ScrollArea.Thumb />
                        </ScrollArea.Scrollbar>
                    </ScrollArea.Viewport>
                </ScrollArea.Root>
            )}
        </>
    )
}

const FileTree = () => {
    const [collection, setCollection] = useState(initialCollection)
    const { selectedServer } = useSelectedServerContext()
    const [editorInputStream, setEditorInputStream] = useState<ReadableStream<Uint8Array> | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState<string[]>([])
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
                ...(filePath.endsWith('/') ? { childrenCount: 1 } : {})
            }
        })
    }

    function loadChildren(details: TreeView.LoadChildrenDetails<Node>): Promise<Node[]> {
        const value = details.valuePath.join('')
        return getPathFiles(value, selectedServer || '')
    }

    async function handleFileSelect(e: TreeView.SelectionChangeDetails<Node>) {
        if (e.selectedNodes.length > 0) {
            if (!e.focusedValue?.endsWith('/')) {
                if (!selectedServer) return
                const path = e.selectedNodes[0]['full_path']
                const dl = await readFileApiContainerContainerNameFsGet({
                    credentials: 'include',
                    path: { container_name: selectedServer },
                    query: { path: path }
                })
                if (dl?.data) {
                    const data = dl.data as Blob
                    const stream = typeof data.stream === 'function' ? data.stream() : new Response(data).body

                    if (stream) {
                        if (
                            data.size > TEXT_EDITOR_FILE_SIZE_LIMIT ||
                            !ALLOWED_TEXT_FILE_EXTENSIONS.some(ext => path.endsWith(ext))
                        ) {
                            // download file instead of opening in editor
                            const url = URL.createObjectURL(data)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = path.split('/').pop() || 'download'
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                            URL.revokeObjectURL(url)
                            return
                        } else {
                            setEditorInputStream(stream)
                            setIsEditorOpen(true)
                        }
                    }
                }
            }
        }
        setSelectedValue([''])
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
        if (!selectedServer) return
        uploadFileApiContainerContainerNameFsUploadPost({
            body: { file: blob, path: '/tmp' },
            path: { container_name: selectedServer }
        })
    }

    return (
        <Box flexGrow={1}>
            <TreeView.Root
                size="md"
                collection={collection}
                loadChildren={loadChildren}
                onLoadChildrenComplete={e => setCollection(e.collection)}
                onSelectionChange={handleFileSelect}
                selectedValue={selectedValue}
            >
                <TreeView.Tree>
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
        </Box>
    )
}
