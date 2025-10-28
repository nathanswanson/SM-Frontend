'use client'

import { Box, Group, HStack, IconButton, ScrollArea, TreeView, createTreeCollection } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuFile, LuFolder, LuLoaderCircle, LuPlus } from 'react-icons/lu'

import { readFile, searchFs } from '../../../../lib/hey-api/client'
import { DisabledModule } from '../../../components/disabled-module'
import { useSelectedServerContext } from '../../../providers/selected-server-context'
import { FileUploadDialog } from './file-upload'
import { TextEditorDialog } from './text-editor'

function getRelativePath(from: string, to: string): string {
    if (from !== '/') {
        throw new Error('Only supporting relative from root path')
    }
    if (to.startsWith(from)) {
        return to.substring(from.length)
    }
    return to
}

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
    const { serverInfo } = useSelectedServerContext()

    return (
        <>
            {!serverInfo ? (
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
    const { selectedServer, serverInfo } = useSelectedServerContext()
    const [editorInputStream, setEditorInputStream] = useState<ReadableStream<Uint8Array> | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [editorFilePath, setEditorFilePath] = useState<string>('.txt')
    const [selectedValue, setSelectedValue] = useState<string[]>([])

    // State for file upload dialog
    const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false)
    const [fileUploadPath, setFileUploadPath] = useState<string>('')

    async function getPathFiles(path: string, selectedServer: string): Promise<Node[]> {
        if (!selectedServer) return []
        if (!serverInfo) return []
        const strings = await searchFs({
            credentials: 'include',
            path: { server_id: serverInfo?.id, path: path }
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
        return getPathFiles(value, serverInfo?.name || '')
    }

    async function handleFileSelect(e: TreeView.SelectionChangeDetails<Node>) {
        if (e.selectedNodes.length > 0) {
            if (!e.focusedValue?.endsWith('/')) {
                if (!selectedServer) return
                const path = e.selectedNodes[0]['full_path']
                if (serverInfo) {
                    await readFile({
                        credentials: 'include',
                        path: { server_id: serverInfo?.id },
                        query: { path: path }
                    }).then(dl => {
                        if (dl.data) {
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
                                    setTimeout(() => URL.revokeObjectURL(url), 5000)
                                    return
                                } else {
                                    setEditorInputStream(stream)
                                    setIsEditorOpen(true)
                                    setEditorFilePath(path)
                                }
                            }
                        }
                    })
                }
            }
        }
    }
    useEffect(() => {
        if (initialCollection.rootNode.children) {
            initialCollection.rootNode['children'][0].disabled = !selectedServer

            setCollection(initialCollection)
        }
    }, [selectedServer])

    async function handleEditorOutputStream(path: string, outStream: ReadableStream<Uint8Array> | undefined) {
        if (!outStream) return
        if (!selectedServer) return
        const reader = outStream.getReader()
        const blob = await new Response(
            new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close()
                                return
                            }
                            controller.enqueue(value)
                            push()
                        })
                    }
                    push()
                }
            })
        )
            .blob()
            .then(async blob => {
                console.log(blob)
                //TODO: upload file
                // await uploadFile({
                //     credentials: 'include',
                //     path: { container_name: selectedServer, path: path },
                //     body: { file: blob }
                // })
            })
    }

    const handleFileUploadButton = (path: string) => {
        console.log('upload to path:', path)
        setFileUploadPath(path)
        setIsFileUploadDialogOpen(true)
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
                                <HStack width="100%" justifyContent={'space-between'}>
                                    <TreeView.BranchControl width="100%">
                                        {nodeState.loading ? (
                                            <LuLoaderCircle
                                                style={{
                                                    animation: 'spin 1s infinite'
                                                }}
                                            />
                                        ) : (
                                            <HStack>
                                                <Group>
                                                    <LuFolder />
                                                    <TreeView.BranchText>{node.name}</TreeView.BranchText>
                                                </Group>
                                            </HStack>
                                        )}
                                    </TreeView.BranchControl>
                                    <IconButton
                                        id={`file-upload-${node.full_path}`}
                                        variant={'ghost'}
                                        onClick={() => {
                                            handleFileUploadButton(node.full_path)
                                        }}
                                    >
                                        <LuPlus />
                                    </IconButton>
                                </HStack>
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
                fullPath={editorFilePath}
            />
            <FileUploadDialog
                isOpen={isFileUploadDialogOpen}
                setOpen={open => {
                    return setIsFileUploadDialogOpen(open)
                }}
                uploadPath={fileUploadPath}
            />
        </Box>
    )
}
