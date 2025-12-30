'use client'

import { Box, Breadcrumb, Flex, HStack, IconButton, ScrollArea, Spinner, Text, VStack } from '@chakra-ui/react'
import { ChevronRight, Download, Edit, File, Folder, FolderUp, Home, Plus, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { readFile, searchFs, ServersRead, uploadFile } from '../../../../lib/hey-api/client'
import { DisabledModule } from '../../../components/disabled-module'
import { useSelectedServerContext } from '../../../providers/selected-server-context'
import { FileUploadDialog } from './file-upload'
import { TextEditorDialog } from './text-editor'
import { SFTPCredentialsDialog } from './sftp-creds'

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
    '.properties',
    '.yaml'
]

interface FileItem {
    name: string
    fullPath: string
    isDirectory: boolean
}

export const FileManager = ({ ...props }) => {
    const { serverInfo } = useSelectedServerContext()

    return (
        <>
            {!serverInfo ? (
                <DisabledModule requester="files" />
            ) : (
                <Box height="30em" {...props}>
                    <FileExplorer />
                </Box>
            )}
        </>
    )
}

const FileExplorer = () => {
    const { serverInfo, serverOnline } = useSelectedServerContext()
    const [currentPath, setCurrentPath] = useState<string>('/')
    const [files, setFiles] = useState<FileItem[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [editorInputStream, setEditorInputStream] = useState<ReadableStream<Uint8Array> | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false)
    const [editorFilePath, setEditorFilePath] = useState<string>('.txt')

    // State for file upload dialog
    const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false)
    const [fileUploadPath, setFileUploadPath] = useState<string>('')
    
    // State for selected file
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

    const loadDirectory = useCallback(
        async (path: string) => {
            if (!serverOnline || !serverInfo) return
            setLoading(true)
            try {
                const result = await searchFs({
                    path: { server_id: serverInfo.id, path: path }
                })
                if (result.data) {
                    const items: FileItem[] = result.data.items.map(fullPath => {
                        const isDirectory = fullPath.endsWith('/')
                        const name = isDirectory
                            ? fullPath.slice(0, -1).split('/').pop() || ''
                            : fullPath.split('/').pop() || fullPath
                        return {
                            name,
                            fullPath,
                            isDirectory
                        }
                    })
                    // Sort: directories first, then files, alphabetically
                    items.sort((a, b) => {
                        if (a.isDirectory && !b.isDirectory) return -1
                        if (!a.isDirectory && b.isDirectory) return 1
                        return a.name.localeCompare(b.name)
                    })
                    setFiles(items)
                }
            } finally {
                setLoading(false)
            }
        },
        [serverInfo, serverOnline]
    )

    useEffect(() => {
        loadDirectory(currentPath)
    }, [currentPath, loadDirectory])

    const navigateTo = (path: string) => {
        setCurrentPath(path)
    }

    const navigateUp = () => {
        if (currentPath === '/') return
        const parts = currentPath.split('/').filter(Boolean)
        parts.pop()
        const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/') + '/'
        setCurrentPath(parentPath)
    }

    const getBreadcrumbItems = () => {
        const parts = currentPath.split('/').filter(Boolean)
        const items: { label: string; path: string }[] = [{ label: 'Root', path: '/' }]
        let accumulatedPath = ''
        for (const part of parts) {
            accumulatedPath += '/' + part
            items.push({ label: part, path: accumulatedPath + '/' })
        }
        return items
    }

    function handleFileClick(file: FileItem) {
        if (file.isDirectory) {
            navigateTo(file.fullPath)
            setSelectedFile(null)
        } else {
            setSelectedFile(file)
        }
    }

    async function handleDownload() {
        if (!serverInfo || !selectedFile || selectedFile.isDirectory) return
        const response = await readFile({
            path: { server_id: serverInfo.id },
            query: { path: selectedFile.fullPath }
        })
        if (response.data) {
            const data = response.data as Blob
            const url = URL.createObjectURL(data)
            const a = document.createElement('a')
            a.href = url
            a.download = selectedFile.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            setTimeout(() => URL.revokeObjectURL(url), 5000)
        }
    }

    async function handleEdit() {
        if (!serverInfo || !selectedFile || selectedFile.isDirectory) return
        const response = await readFile({
            path: { server_id: serverInfo.id },
            query: { path: selectedFile.fullPath }
        })
        if (response.data) {
            const data = response.data as Blob
            const stream = typeof data.stream === 'function' ? data.stream() : new Response(data).body

            if (stream) {
                if (
                    data.size > TEXT_EDITOR_FILE_SIZE_LIMIT ||
                    !ALLOWED_TEXT_FILE_EXTENSIONS.some(ext => selectedFile.fullPath.endsWith(ext))
                ) {
                    // File too large or not a text file - just download instead
                    handleDownload()
                } else {
                    setEditorInputStream(stream)
                    setIsEditorOpen(true)
                    setEditorFilePath(selectedFile.fullPath)
                }
            }
        }
    }

    async function handleEditorOutputStream(path: string, outStream: ReadableStream<Uint8Array> | undefined) {
        if (!outStream) return
        if (!serverInfo) return
        const reader = outStream.getReader()
        await new Response(
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
                uploadFile({ path: { server_id: serverInfo.id }, query: { path: path }, body: blob })
            })
    }

    const handleFileUploadButton = () => {
        setFileUploadPath(currentPath)
        setIsFileUploadDialogOpen(true)
    }

    const breadcrumbItems = getBreadcrumbItems()

    return (
        <Flex direction="column" height="100%" gap={2}>
            {/* Toolbar */}
            <HStack justifyContent="space-between" px={2} py={1} borderBottomWidth="1px">
                <HStack gap={1}>
                    <IconButton
                        aria-label="Go to root"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateTo('/')}
                        disabled={currentPath === '/'}
                    >
                        <Home size={16} />
                    </IconButton>
                    <IconButton
                        aria-label="Go up"
                        variant="ghost"
                        size="sm"
                        onClick={navigateUp}
                        disabled={currentPath === '/'}
                    >
                        <FolderUp size={16} />
                    </IconButton>
                    <IconButton
                        aria-label="Refresh"
                        variant="ghost"
                        size="sm"
                        onClick={() => loadDirectory(currentPath)}
                    >
                        <RefreshCw size={16} />
                    </IconButton>
                </HStack>
                <HStack gap={1}>
                    <IconButton
                        aria-label="Edit file"
                        variant="ghost"
                        size="sm"
                        onClick={handleEdit}
                        disabled={!selectedFile || selectedFile.isDirectory}
                    >
                        <Edit size={16} />
                    </IconButton>
                    <IconButton
                        aria-label="Download file"
                        variant="ghost"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!selectedFile || selectedFile.isDirectory}
                    >
                        <Download size={16} />
                    </IconButton>
                    <IconButton aria-label="Upload file" variant="ghost" size="sm" onClick={handleFileUploadButton}>
                        <Plus size={16} />
                    </IconButton>
                </HStack>
            </HStack>

            {/* Breadcrumb Navigation */}
            <Breadcrumb.Root px={2}>
                <Breadcrumb.List>
                    {breadcrumbItems.map((item, index) => (
                        <Breadcrumb.Item key={item.path}>
                            {index === breadcrumbItems.length - 1 ? (
                                <Breadcrumb.CurrentLink fontWeight="semibold">{item.label}</Breadcrumb.CurrentLink>
                            ) : (
                                <Breadcrumb.Link
                                    cursor="pointer"
                                    onClick={() => navigateTo(item.path)}
                                    _hover={{ textDecoration: 'underline' }}
                                >
                                    {item.label}
                                </Breadcrumb.Link>
                            )}
                            {index < breadcrumbItems.length - 1 && (
                                <Breadcrumb.Separator>
                                    <ChevronRight size={14} />
                                </Breadcrumb.Separator>
                            )}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb.List>
            </Breadcrumb.Root>

            {/* File List */}
            <ScrollArea.Root flex={1}>
                <ScrollArea.Viewport>
                    <ScrollArea.Content>
                        {loading ? (
                            <Flex justify="center" align="center" py={8}>
                                <Spinner size="lg" />
                            </Flex>
                        ) : files.length === 0 ? (
                            <Flex justify="center" align="center" py={8}>
                                <Text color="fg.muted">Empty folder</Text>
                            </Flex>
                        ) : (
                            <VStack align="stretch" gap={0}>
                                {files.map(file => (
                                    <HStack
                                        key={file.fullPath}
                                        px={3}
                                        py={2}
                                        cursor="pointer"
                                        bg={selectedFile?.fullPath === file.fullPath ? 'bg.emphasized' : undefined}
                                        _hover={{ bg: 'bg.subtle' }}
                                        onClick={() => handleFileClick(file)}
                                        onDoubleClick={() => {
                                            if (!file.isDirectory) handleEdit()
                                        }}
                                        borderRadius="md"
                                        mx={1}
                                    >
                                        {file.isDirectory ? <Folder size={18} /> : <File size={18} />}
                                        <Text fontSize="sm" truncate>
                                            {file.name}
                                        </Text>
                                    </HStack>
                                ))}
                            </VStack>
                        )}
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar>
                    <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>

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
            <SFTPCredentialsDialog />
        </Flex>
    )
}
