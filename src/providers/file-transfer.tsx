import { createContext, ReactNode, useContext, useState } from 'react'

interface TransferInfo {
    fileName: string
    sizeTotal: number
    downloadPath: string
    direction: 'upload' | 'download'
    fileCount?: number
}

interface IFileTransferContext {
    file: TransferInfo | null
    setFile: (file: TransferInfo | null) => void

    transferProgress: number
    setTransferProgress: (progress: number) => void

    filesTransferred?: number
    setFilesTransferred?: (count: number) => void
}

const FileTransferContext = createContext<IFileTransferContext | undefined>(undefined)

export const useFileTransferContext = () => {
    const context = useContext(FileTransferContext)
    if (!context) {
        throw new Error('useFileTransferContext must be used within a FileTransferProvider')
    }
    return context
}

export const FileTransferProvider = ({ children }: { children: ReactNode }) => {
    const [file, setFile] = useState<TransferInfo | null>(null)
    const [transferProgress, setTransferProgress] = useState<number>(0)
    const [filesTransferred, setFilesTransferred] = useState<number | undefined>(undefined)

    return (
        <FileTransferContext.Provider
            value={{ file, setFile, transferProgress, setTransferProgress, filesTransferred, setFilesTransferred }}
        >
            {children}
        </FileTransferContext.Provider>
    )
}
